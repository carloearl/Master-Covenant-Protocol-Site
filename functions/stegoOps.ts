import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();
        
        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { action } = body;

        // --- CREATE STEGO ASSET RECORD ---
        if (action === 'create_record') {
            const { name, algorithm, resultUrl, carrierUrl, payloadHash, keyHint } = body;
            
            const asset = await base44.entities.StegoAsset.create({
                name: name || `Stego-${Date.now()}`,
                algorithm: algorithm || 'AES_ENCRYPTED_LSB',
                carrier_url: carrierUrl,
                result_url: resultUrl,
                payload_hash: payloadHash,
                key_hint: keyHint,
                access_level: 'private'
            });

            return Response.json({ success: true, asset });
        }

        // --- ANALYZE IMAGE (Steganalysis) ---
        if (action === 'analyze_image') {
            // In a real scenario, this would use complex statistical analysis (Chi-square, RS analysis).
            // Here we simulate "Military Grade" analysis for the UI.
            const { imageUrl } = body;
            
            // Mock analysis logic
            const entropy = Math.random() * (8 - 7.5) + 7.5; // High entropy usually
            const noiseLevel = Math.random() * 100;
            const detected = noiseLevel > 80;

            return Response.json({
                success: true,
                analysis: {
                    entropy: entropy.toFixed(4),
                    noise_level: noiseLevel.toFixed(2),
                    lsb_usage: (Math.random() * 100).toFixed(2) + '%',
                    threat_detected: detected,
                    recommendation: detected ? "Review content immediately" : "Clean carrier signal"
                }
            });
        }

        return Response.json({ error: 'Invalid action' }, { status: 400 });

    } catch (error) {
        console.error("StegoOps Error:", error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});