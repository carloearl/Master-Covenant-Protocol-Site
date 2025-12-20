import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        // Public utility, no auth required for DNS check as it's public info
        // But we might want to restrict it to logged in users to prevent abuse
        
        const url = new URL(req.url);
        // Allow passing domain via query param or body, default to glyphlock.io
        let domain = "glyphlock.io";
        
        try {
            const body = await req.json();
            if (body.domain) domain = body.domain;
        } catch (e) {
            // ignore
        }

        // Use Google Public DNS API over HTTPS
        const response = await fetch(`https://dns.google/resolve?name=${domain}&type=A`);
        const data = await response.json();

        const aRecords = data.Answer ? data.Answer.map(r => r.data) : [];
        
        // Also check CNAME for www
        const wwwResponse = await fetch(`https://dns.google/resolve?name=www.${domain}&type=A`); // A record lookup for CNAME follows chain
        const wwwData = await wwwResponse.json();
        const wwwRecords = wwwData.Answer ? wwwData.Answer.map(r => r.data) : [];

        // Attempt to find correct IP from current Origin (if running on base44.app domain)
        let suggestedIP = null;
        const origin = req.headers.get("origin");
        if (origin && origin.includes("base44.app")) {
            try {
                const originHost = new URL(origin).hostname;
                const originRes = await fetch(`https://dns.google/resolve?name=${originHost}&type=A`);
                const originData = await originRes.json();
                if (originData.Answer && originData.Answer.length > 0) {
                    suggestedIP = originData.Answer[0].data;
                }
            } catch (e) {
                console.error("Failed to resolve origin IP:", e);
            }
        }

        return Response.json({
            domain,
            a_records: aRecords,
            www_records: wwwRecords,
            suggested_ip: suggestedIP,
            status: "success",
            timestamp: new Date().toISOString(),
            provider: "Google DNS"
        });

    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});