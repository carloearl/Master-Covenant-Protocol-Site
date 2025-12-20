import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

export default async function runFullScan(req) {
    const base44 = createClientFromRequest(req);
    const adminBase44 = base44.asServiceRole;

    try {
        // --- STEP 1: INITIALIZATION ---
        const scan_id = crypto.randomUUID();
        const started_at = new Date().toISOString();
        const user = await base44.auth.me().catch(() => ({ email: 'system' }));

        // Create ScanRun IMMEDIATELY (Status: running)
        // Using the schema we know exists (Nav/Route/Sitemap/Backend)
        const scanRun = await adminBase44.entities.ScanRun.create({
            scan_id: scan_id,
            started_at: started_at,
            status: "running",
            nav_ok_count: 0, nav_warning_count: 0, nav_critical_count: 0,
            route_ok_count: 0, route_warning_count: 0, route_critical_count: 0,
            sitemap_ok_count: 0, sitemap_warning_count: 0, sitemap_critical_count: 0,
            backend_ok_count: 0, backend_warning_count: 0, backend_critical_count: 0
        });

        // Log Start
        await adminBase44.entities.SIEActionLog.create({
            action_id: crypto.randomUUID(),
            scan_run_id: scan_id,
            actor: user?.email || 'system',
            action_type: "SCAN_STARTED",
            target_entity: "ScanRun",
            details: "Full scan initiated via OMEGA protocol",
            timestamp: new Date().toISOString()
        });

        // --- STEP 2: PREPARE RESPONSE ---
        const responsePayload = {
            scan_id: scan_id,
            run_id: scanRun.id,
            status: "started"
        };

        // --- STEP 3: ASYNC EXECUTION (FIRE & FORGET) ---
        // We do not await this promise tree in the main flow to ensure fast return
        (async () => {
            try {
                // Execute Sub-Scans Parallel
                const [navRes, routeRes, sitemapRes, backendRes] = await Promise.all([
                    base44.functions.invoke("scanNavigation", { scan_id }),
                    base44.functions.invoke("scanRoutes", { scan_id }),
                    base44.functions.invoke("scanSitemaps", { scan_id }),
                    base44.functions.invoke("scanBackends", { scan_id })
                ]);

                // Helper to extract data
                const getCounts = (res) => res?.data || { ok: 0, warning: 0, critical: 0 };
                const nav = getCounts(navRes);
                const route = getCounts(routeRes);
                const sitemap = getCounts(sitemapRes);
                const backend = getCounts(backendRes);

                // --- STEP 4: AGGREGATION & UPDATE ---
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

                // Log Completion
                await adminBase44.entities.SIEActionLog.create({
                    action_id: crypto.randomUUID(),
                    scan_run_id: scan_id,
                    actor: "system",
                    action_type: "SCAN_COMPLETED",
                    target_entity: "ScanRun",
                    details: `Scan finished with status: ${finalStatus}`,
                    timestamp: new Date().toISOString()
                });

            } catch (err) {
                console.error("OMEGA Scan Background Error:", err);
                
                // Attempt to update status to failed
                try {
                    await adminBase44.entities.ScanRun.update(scanRun.id, {
                        status: "failed",
                        error_message: String(err)
                    });

                    await adminBase44.entities.SIEActionLog.create({
                        action_id: crypto.randomUUID(),
                        scan_run_id: scan_id,
                        actor: "system",
                        action_type: "SCAN_FAILED",
                        target_entity: "ScanRun",
                        details: String(err),
                        timestamp: new Date().toISOString()
                    });
                } catch (e) {
                    console.error("Critical Failure: Could not update failed scan status", e);
                }
            }
        })();

        // Return immediately to UI
        return Response.json(responsePayload);

    } catch (e) {
        console.error("OMEGA Init Error:", e);
        return Response.json({ error: e.message }, { status: 500 });
    }
}

// Deno handler wrapper
Deno.serve(runFullScan);