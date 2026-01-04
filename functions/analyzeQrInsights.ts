import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        
        // Authenticate user
        const user = await base44.auth.me();
        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { qrType, qrData, design } = await req.json();

        // Construct a detailed prompt for the AI
        const prompt = `
        You are an expert QR code strategist and security analyst. Analyze the following QR code configuration and provide actionable insights.

        Configuration:
        - Type: ${qrType}
        - Payload Data: ${JSON.stringify(qrData)}
        - Design Settings: ${JSON.stringify(design)}

        Please provide a JSON response with the following structure (no markdown, just JSON):
        {
            "payloadOptimization": [
                { "title": "...", "description": "..." }
            ],
            "scanRateImprovement": [
                { "title": "...", "description": "..." }
            ],
            "securityEnhancements": [
                { "title": "...", "description": "..." }
            ],
            "overallScore": number (0-100)
        }

        Focus on:
        1. Optimizing payload (e.g., recommend dynamic URLs if static is used, shortening URLs, etc.)
        2. Improving scan rates (contrast, size, call-to-action suggestions)
        3. Enhancing security (identifying PII risks, suggesting encrypted payloads or password protection)
        `;

        const response = await base44.integrations.Core.InvokeLLM({
            prompt: prompt,
            response_json_schema: {
                type: "object",
                properties: {
                    payloadOptimization: { 
                        type: "array", 
                        items: { 
                            type: "object",
                            properties: {
                                title: { type: "string" },
                                description: { type: "string" }
                            }
                        } 
                    },
                    scanRateImprovement: { 
                        type: "array", 
                        items: { 
                            type: "object",
                            properties: {
                                title: { type: "string" },
                                description: { type: "string" }
                            }
                        } 
                    },
                    securityEnhancements: { 
                        type: "array", 
                        items: { 
                            type: "object",
                            properties: {
                                title: { type: "string" },
                                description: { type: "string" }
                            }
                        } 
                    },
                    overallScore: { type: "number" }
                }
            }
        });

        // The integration returns a dict/object directly when response_json_schema is used
        return Response.json(response);

    } catch (error) {
        console.error("AI Analysis Error:", error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});