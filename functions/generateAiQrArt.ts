import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        
        // Authenticate user
        const user = await base44.auth.me();
        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { prompt, style } = await req.json();

        // Construct a detailed prompt for the AI Image Generator
        // We optimize the prompt to be suitable for a QR code background/art
        const enhancedPrompt = `
        Create a high-contrast, visually striking artistic image suitable for a QR code background.
        Style: ${style || 'Futuristic Cyberpunk'}
        Theme: ${prompt}
        
        Requirements:
        - High contrast details
        - Centered composition
        - Suitable for blending with a QR code
        - Artistic and unique
        - No text (unless specified)
        `;

        const response = await base44.integrations.Core.GenerateImage({
            prompt: enhancedPrompt,
        });

        // The integration returns { url: "..." }
        return Response.json(response);

    } catch (error) {
        console.error("AI Art Generation Error:", error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});