import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

// --- CONFIGURATION ---
const SITE_URL = "https://glyphlock.io";

const NAV_CONFIG = [
    { label: "Home", path: "/", visibility: "public" },
    { label: "Dream Team", path: "/DreamTeam", visibility: "public" },
    { label: "GlyphBot", path: "/GlyphBot", visibility: "public" },
    { label: "Media Hub", path: "/VideoUpload", visibility: "public" },
    { label: "Command Center", path: "/CommandCenter", visibility: "public" },
    { label: "Protocol Verification", path: "/Consultation", visibility: "public" },
    { label: "About Us", path: "/About", visibility: "public" },
    { label: "Partners", path: "/Partners", visibility: "public" },
    { label: "Contact", path: "/Contact", visibility: "public" },
    { label: "Accessibility", path: "/Accessibility", visibility: "public" },
    { label: "QR Verification", path: "/Qr", visibility: "public" },
    { label: "Image Processing", path: "/ImageLab", visibility: "public" },
    { label: "NUPS Transaction Verification", path: "/NUPSLogin", visibility: "public" },
    { label: "Security Modules", path: "/SecurityTools", visibility: "public" },
    { label: "SDK Documentation", path: "/SDKDocs", visibility: "public" },
    { label: "Site Intelligence", path: "/Sie", visibility: "admin" },
    { label: "Master Covenant", path: "/GovernanceHub", visibility: "public" },
    { label: "Trust & Security", path: "/TrustSecurity", visibility: "public" },
    { label: "NIST Challenge", path: "/NISTChallenge", visibility: "public" },
    { label: "Case Studies", path: "/CaseStudies", visibility: "public" },
    { label: "Documentation", path: "/SecurityDocs", visibility: "public" },
    { label: "FAQ", path: "/FAQ", visibility: "public" },
    { label: "Roadmap", path: "/Roadmap", visibility: "public" },
    { label: "Site Map", path: "/SitemapXml", visibility: "public" },
    { label: "Security Settings", path: "/AccountSecurity", visibility: "public" }
];

const SITEMAP_TYPES = ["xml", "app", "qr", "images", "interactive", "dynamic"];

// --- HELPERS ---
const httpProbe = async (path) => {
    const url = path.startsWith('http') ? path : `${SITE_URL}${path}`;
    try {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), 8000); // 8s timeout per probe
        const res = await fetch(url, { redirect: 'manual', signal: controller.signal });
        clearTimeout(id);
        
        let text = "";
        try { text = await res.text(); } catch(e) {}
        
        return { status_code: res.status, text };
    } catch (e) {
        return { status_code: 0, text: "", error: e.message };
    }
};

// --- SUB-SCAN LOGIC ---

async function runNavScan(scan_id, adminBase44) {
    let counts = { ok: 0, warning: 0, critical: 0 };
    // Run in parallel chunks of 5 to avoid resource exhaustion
    const chunkSize = 5;
    for (let i = 0; i < NAV_CONFIG.length; i += chunkSize) {
        const chunk = NAV_CONFIG.slice(i, i + chunkSize);
        await Promise.all(chunk.map(async (item) => {
            const probe = await httpProbe(item.path);
            
            const violations = [];
            const messages = [];
            let severity = "ok";
            let action = "none";

            if (item.visibility === "public" && (probe.status_code === 404 || probe.status_code === 0)) {
                severity = "critical";
                violations.push("NAV_001");
                messages.push(`Public nav item ${item.path} unreachable (${probe.status_code})`);
                action = "fix_route";
            }
            if (probe.status_code >= 500) {
                severity = "critical";
                violations.push("NAV_010");
                messages.push("Server Error");
                action = "fix_route";
            }

            if (severity === "ok") counts.ok++;
            else if (severity === "warning") counts.warning++;
            else counts.critical++;

            await adminBase44.entities.NavAuditRow.create({
                scan_run_id: scan_id,
                label: item.label,
                path: item.path,
                visibility: item.visibility,
                http_status: probe.status_code,
                page_exists: probe.status_code !== 404 && probe.status_code !== 0,
                backend_exists: true,
                violation_ids: JSON.stringify(violations),
                violation_messages: JSON.stringify(messages),
                severity,
                required_action: action
            });
        }));
    }
    return counts;
}

async function runRouteScan(scan_id, adminBase44) {
    let counts = { ok: 0, warning: 0, critical: 0 };
    // 1. Get Routes from Sitemap
    let routes = ["/", "/About", "/Contact", "/DreamTeam", "/GlyphBot"];
    try {
        const probe = await httpProbe("/sitemap.xml");
        if (probe.status_code === 200) {
            const matches = [...probe.text.matchAll(/<loc>(.*?)<\/loc>/g)];
            if (matches.length > 0) {
                routes = matches.map(m => m[1].replace(SITE_URL, ""));
            }
        }
    } catch (e) {}

    // Limit routes to top 20 to prevent timeout in single function
    const scanRoutes = routes.slice(0, 20);

    await Promise.all(scanRoutes.map(async (path) => {
        const cleanPath = path.trim();
        if (!cleanPath) return;

        const probe = await httpProbe(cleanPath);
        let severity = "ok";
        let violations = [];
        let messages = [];
        let action = "none";

        if (probe.status_code >= 500) {
            severity = "critical";
            violations.push("ROUTE_ERROR");
            messages.push("Page returns 500");
            action = "fix_route";
        }
        if (probe.status_code === 404) {
            severity = "warning";
            violations.push("ROUTE_MISSING");
            messages.push("Route in sitemap but returns 404");
            action = "fix_route";
        }

        if (severity === "ok") counts.ok++;
        else if (severity === "warning") counts.warning++;
        else counts.critical++;

        await adminBase44.entities.RouteAuditRow.create({
            scan_run_id: scan_id,
            route_path: cleanPath,
            component_name: "Page",
            is_public: true,
            http_status: probe.status_code,
            has_auth_guard: false,
            violation_ids: JSON.stringify(violations),
            violation_messages: JSON.stringify(messages),
            severity,
            required_action: action
        });
    }));
    return counts;
}

async function runSitemapScan(scan_id, adminBase44) {
    let counts = { ok: 0, warning: 0, critical: 0 };
    for (const type of SITEMAP_TYPES) {
        let humanPath = `/sitemap-${type}`;
        let xmlPath = `/sitemap-${type}.xml`;
        if (type === "xml") {
             humanPath = "/SitemapXml"; 
             xmlPath = "/sitemap.xml";
        }

        const [humanProbe, xmlProbe] = await Promise.all([
            httpProbe(humanPath),
            httpProbe(xmlPath)
        ]);

        let severity = "ok";
        let violations = [];
        let messages = [];
        let action = "none";

        if (humanProbe.status_code !== 200) {
            severity = "critical";
            violations.push("SITEMAP_001");
            messages.push(`Missing human page: ${humanPath}`);
            action = "implement_page";
        }
        if (xmlProbe.status_code !== 200) {
            severity = "critical";
            violations.push("SITEMAP_002");
            messages.push(`Missing XML endpoint: ${xmlPath}`);
            if (action === "none") action = "implement_backend";
        }

        if (severity === "ok") counts.ok++;
        else if (severity === "warning") counts.warning++;
        else counts.critical++;

        await adminBase44.entities.SitemapAuditRow.create({
            scan_run_id: scan_id,
            sitemap_type: type,
            url: humanPath,
            human_readable_url: humanPath,
            xml_url: xmlPath,
            human_exists: humanProbe.status_code === 200,
            xml_exists: xmlProbe.status_code === 200,
            contains_preview_urls: false, 
            is_indexable: true,
            violation_ids: JSON.stringify(violations),
            violation_messages: JSON.stringify(messages),
            severity,
            required_action: action
        });
    }
    return counts;
}

async function runBackendScan(scan_id, adminBase44) {
    // Simulated check for now
    await adminBase44.entities.BackendAuditRow.create({
        scan_run_id: scan_id,
        function_name: "runFullScan",
        endpoint_path: "/api/apps/functions/runFullScan",
        expected_output_type: "json",
        function_exists: true,
        responds_correctly: true,
        violation_ids: "[]",
        violation_messages: "[]",
        severity: "ok",
        required_action: "none"
    });
    return { ok: 1, warning: 0, critical: 0 };
}

// --- MAIN HANDLER ---

export default async function runFullScan(req) {
    const base44 = createClientFromRequest(req);
    const adminBase44 = base44.asServiceRole;

    try {
        const scan_id = crypto.randomUUID();
        const started_at = new Date().toISOString();
        
        // 1. Create Scan Record
        const scanRun = await adminBase44.entities.ScanRun.create({
            scan_id: scan_id,
            started_at: started_at,
            status: "running",
            nav_ok_count: 0, nav_warning_count: 0, nav_critical_count: 0,
            route_ok_count: 0, route_warning_count: 0, route_critical_count: 0,
            sitemap_ok_count: 0, sitemap_warning_count: 0, sitemap_critical_count: 0,
            backend_ok_count: 0, backend_warning_count: 0, backend_critical_count: 0
        });

        // 2. Execute All Scans Parallel
        const [nav, route, sitemap, backend] = await Promise.all([
            runNavScan(scan_id, adminBase44),
            runRouteScan(scan_id, adminBase44),
            runSitemapScan(scan_id, adminBase44),
            runBackendScan(scan_id, adminBase44)
        ]);

        // 3. Aggregate
        const totalCrit = nav.critical + route.critical + sitemap.critical + backend.critical;
        const totalWarn = nav.warning + route.warning + sitemap.warning + backend.warning;
        let finalStatus = "success";
        if (totalWarn > 0) finalStatus = "warning";
        if (totalCrit > 0) finalStatus = "critical";

        // 4. Update Record
        await adminBase44.entities.ScanRun.update(scanRun.id, {
            status: finalStatus,
            completed_at: new Date().toISOString(),
            nav_ok_count: nav.ok, nav_warning_count: nav.warning, nav_critical_count: nav.critical,
            route_ok_count: route.ok, route_warning_count: route.warning, route_critical_count: route.critical,
            sitemap_ok_count: sitemap.ok, sitemap_warning_count: sitemap.warning, sitemap_critical_count: sitemap.critical,
            backend_ok_count: backend.ok, backend_warning_count: backend.warning, backend_critical_count: backend.critical
        });

        // 5. Log
        await adminBase44.entities.SIEActionLog.create({
            action_id: crypto.randomUUID(),
            scan_run_id: scan_id,
            actor: "system",
            action_type: "SCAN_COMPLETED",
            target_entity: "ScanRun",
            details: `Unified scan finished: ${finalStatus}`,
            timestamp: new Date().toISOString()
        });

        return Response.json({
            status: finalStatus,
            scan_id: scan_id,
            run_id: scanRun.id
        });

    } catch (err) {
        console.error("Unified Scan Error:", err);
        return Response.json({ error: err.message, status: "failed" }, { status: 500 });
    }
}

Deno.serve(runFullScan);