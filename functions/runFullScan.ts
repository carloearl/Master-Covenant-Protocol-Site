import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
    const base44 = createClientFromRequest(req);
    const adminBase44 = base44.asServiceRole;

    try {
        // STEP 1 — Create ScanRun IMMEDIATELY
        const scanRun = await adminBase44.entities.ScanRun.create({
            scan_id: crypto.randomUUID(),
            started_at: new Date().toISOString(),
            status: "running",
            nav_ok_count: 0,
            nav_warning_count: 0,
            nav_critical_count: 0,
            route_ok_count: 0,
            route_warning_count: 0,
            route_critical_count: 0,
            sitemap_ok_count: 0,
            sitemap_warning_count: 0,
            sitemap_critical_count: 0,
            backend_ok_count: 0,
            backend_warning_count: 0,
            backend_critical_count: 0
        });

        const scan_id = scanRun.scan_id;

        // STEP 2 — RETURN IMMEDIATELY (UI MUST RECEIVE THIS)
        const responsePayload = {
            scan_id: scanRun.scan_id,
            run_id: scanRun.id,
            status: "started"
        };

        // STEP 3 — Execute audits AFTER return path is unblocked (Background execution)
        (async () => {
            try {
                // Invoke sub-scans concurrently
                // Using base44.functions.invoke to trigger them
                const [navRes, routeRes, sitemapRes, backendRes] = await Promise.all([
                    base44.functions.invoke("scanNavigation", { scan_id }),
                    base44.functions.invoke("scanRoutes", { scan_id }),
                    base44.functions.invoke("scanSitemaps", { scan_id }),
                    base44.functions.invoke("scanBackends", { scan_id })
                ]);

                // Helper to safely get data
                const getCounts = (res) => res?.data || { ok: 0, warning: 0, critical: 0 };
                const nav = getCounts(navRes);
                const route = getCounts(routeRes);
                const sitemap = getCounts(sitemapRes);
                const backend = getCounts(backendRes);

                // STEP 4 — Update final counts + status
                const totalCrit = nav.critical + route.critical + sitemap.critical + backend.critical;
                const totalWarn = nav.warning + route.warning + sitemap.warning + backend.warning;
                
                let finalStatus = "success";
                if (totalWarn > 0) finalStatus = "warning";
                if (totalCrit > 0) finalStatus = "critical";

                await adminBase44.entities.ScanRun.update(scanRun.id, {
                    status: finalStatus,
                    completed_at: new Date().toISOString(),
                    nav_ok_count: nav.ok, nav_warning_count: nav.warning, nav_critical_count: nav.critical,
                    route_ok_count: route.ok, route_warning_count: route.warning, route_critical_count: route.critical,
                    sitemap_ok_count: sitemap.ok, sitemap_warning_count: sitemap.warning, sitemap_critical_count: sitemap.critical,
                    backend_ok_count: backend.ok, backend_warning_count: backend.warning, backend_critical_count: backend.critical
                });

            } catch (err) {
                console.error("Scan background error:", err);
                await adminBase44.entities.ScanRun.update(scanRun.id, {
                    status: "failed",
                    error_message: String(err)
                });
            }
        })();

        return Response.json(responsePayload);

    } catch (e) {
        return Response.json({ error: e.message }, { status: 500 });
    }
});