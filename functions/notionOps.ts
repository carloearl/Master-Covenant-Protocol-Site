import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';
import { Client } from "npm:@notionhq/client@2.2.14";

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        
        // 1. Get OAuth Token
        const accessToken = await base44.asServiceRole.connectors.getAccessToken("notion");
        if (!accessToken) {
            return Response.json({ error: "Notion not connected", connected: false }, { status: 401 });
        }

        const notion = new Client({ auth: accessToken });
        const { action, payload } = await req.json();

        // 2. Handle Actions
        if (action === "list_resources") {
            // Search for pages/databases the user has shared with the integration
            const response = await notion.search({
                filter: { value: 'page', property: 'object' },
                sort: { direction: 'descending', timestamp: 'last_edited_time' }
            });
            return Response.json({ 
                connected: true, 
                results: response.results.map(p => ({
                    id: p.id,
                    title: p.properties?.title?.title?.[0]?.plain_text || 
                           p.properties?.Name?.title?.[0]?.plain_text || 
                           "Untitled Page",
                    url: p.url
                }))
            });
        }

        if (action === "post_update") {
            const { parentId, title, content } = payload;
            
            if (!parentId) return Response.json({ error: "Parent ID required" }, { status: 400 });

            // Create a new page as a child of the selected page
            const response = await notion.pages.create({
                parent: { page_id: parentId },
                properties: {
                    title: {
                        title: [
                            {
                                text: {
                                    content: title || `Update - ${new Date().toLocaleDateString()}`,
                                },
                            },
                        ],
                    },
                },
                children: [
                    {
                        object: 'block',
                        type: 'paragraph',
                        paragraph: {
                            rich_text: [
                                {
                                    type: 'text',
                                    text: {
                                        content: content,
                                    },
                                },
                            ],
                        },
                    },
                ],
            });

            return Response.json({ success: true, url: response.url });
        }

        return Response.json({ error: "Invalid action" }, { status: 400 });

    } catch (error) {
        console.error("Notion Error:", error);
        return Response.json({ 
            error: error.message, 
            details: error.body || "Unknown error" 
        }, { status: 500 });
    }
});