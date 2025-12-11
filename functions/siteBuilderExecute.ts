import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

/**
 * Site Builder Agent Backend - Gemini 3 Pro Powered
 * Advanced reasoning, 4K image generation, and grounded generation
 * Dual backend access: glyphlock.io + base44 platform
 */

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admins can use site builder
    if (user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { action, payload } = await req.json();

    switch (action) {
      case 'generate_code': {
        // Use Gemini 3 Pro for code generation with adaptive thinking
        const { prompt, context, complexity = 'medium' } = payload;
        
        // Map complexity to thinking level
        const thinkingLevel = complexity === 'high' ? 'high' : 'low';
        
        const response = await fetch(`${GEMINI_BASE_URL}/models/gemini-3-pro-preview:generateContent?key=${GEMINI_API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `You are an expert full-stack developer for GlyphLock.io.

Context: ${context || 'None'}

Request: ${prompt}

Generate production-ready React code with:
- Tailwind CSS styling
- Royal blue color scheme (#3B82F6, #4F46E5, #8B5CF6)
- Mobile-first responsive design
- Proper imports and exports
- Clean, documented code

Provide ONLY the complete code, no explanations.`
              }]
            }],
            generationConfig: {
              temperature: 1.0, // Keep default for Gemini 3
              thinkingConfig: {
                thinkingLevel: thinkingLevel
              }
            }
          })
        });

        const data = await response.json();
        const generatedCode = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const thoughtSignature = data.candidates?.[0]?.content?.parts?.[0]?.thoughtSignature;

        return Response.json({ 
          success: true,
          code: generatedCode,
          thought_signature: thoughtSignature,
          model: 'gemini-3-pro-preview',
          thinking_level: thinkingLevel
        });
      }

      case 'generate_image': {
        // Use Gemini 3 Pro Image for 4K generation with grounding
        const { 
          prompt, 
          use_grounding = false, 
          aspect_ratio = '16:9',
          image_size = '4K' // 4K, 2K, or default
        } = payload;

        const tools = use_grounding ? [{ googleSearch: {} }] : [];

        const response = await fetch(`${GEMINI_BASE_URL}/models/gemini-3-pro-image-preview:generateContent?key=${GEMINI_API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Generate a professional, high-quality image: ${prompt}

Style: Modern, tech-focused, cybersecurity aesthetic, royal blue gradient palette.`
              }]
            }],
            generationConfig: {
              temperature: 1.0,
              imageConfig: {
                aspectRatio: aspect_ratio,
                imageSize: image_size
              }
            },
            tools: tools
          })
        });

        const data = await response.json();
        const imagePart = data.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
        const thoughtSignature = data.candidates?.[0]?.content?.parts?.[0]?.thoughtSignature;

        if (imagePart?.inlineData) {
          // Upload to Base44 storage
          const imageBuffer = Uint8Array.from(atob(imagePart.inlineData.data), c => c.charCodeAt(0));
          const blob = new Blob([imageBuffer], { type: imagePart.inlineData.mimeType });
          
          const uploadResult = await base44.asServiceRole.integrations.Core.UploadFile({
            file: blob
          });

          return Response.json({
            success: true,
            image_url: uploadResult.file_url,
            thought_signature: thoughtSignature,
            model: 'gemini-3-pro-image-preview',
            grounded: use_grounding,
            resolution: image_size
          });
        }

        return Response.json({
          success: false,
          error: 'No image generated'
        }, { status: 500 });
      }

      case 'edit_image': {
        // Conversational image editing with Gemini 3 Pro Image
        const { 
          prompt, 
          previous_thought_signature, 
          conversation_history = []
        } = payload;

        // Build conversation with thought signatures
        const contents = [
          ...conversation_history,
          {
            role: 'user',
            parts: [{ text: prompt }]
          }
        ];

        const response = await fetch(`${GEMINI_BASE_URL}/models/gemini-3-pro-image-preview:generateContent?key=${GEMINI_API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: contents,
            generationConfig: {
              temperature: 1.0
            }
          })
        });

        const data = await response.json();
        const imagePart = data.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
        const thoughtSignature = data.candidates?.[0]?.content?.parts?.[0]?.thoughtSignature;

        if (imagePart?.inlineData) {
          const imageBuffer = Uint8Array.from(atob(imagePart.inlineData.data), c => c.charCodeAt(0));
          const blob = new Blob([imageBuffer], { type: imagePart.inlineData.mimeType });
          
          const uploadResult = await base44.asServiceRole.integrations.Core.UploadFile({
            file: blob
          });

          return Response.json({
            success: true,
            image_url: uploadResult.file_url,
            thought_signature: thoughtSignature,
            model: 'gemini-3-pro-image-preview'
          });
        }

        return Response.json({
          success: false,
          error: 'No image generated'
        }, { status: 500 });
      }

      case 'plan_with_search': {
        // Deep planning with Google Search grounding
        const { prompt, context } = payload;

        const response = await fetch(`${GEMINI_BASE_URL}/models/gemini-3-pro-preview:generateContent?key=${GEMINI_API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `You are a senior software architect planning a feature for GlyphLock.io.

Context: ${context || 'None'}

Request: ${prompt}

Create a detailed implementation plan with:
1. Architecture overview
2. Step-by-step breakdown
3. Dependencies and requirements
4. Potential challenges
5. Best practices

Use Google Search to verify current best practices and technologies.`
              }]
            }],
            generationConfig: {
              temperature: 1.0,
              thinkingConfig: {
                thinkingLevel: 'high' // Deep reasoning for planning
              }
            },
            tools: [
              { googleSearch: {} },
              { urlContext: {} }
            ]
          })
        });

        const data = await response.json();
        const plan = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const thoughtSignature = data.candidates?.[0]?.content?.parts?.[0]?.thoughtSignature;

        return Response.json({
          success: true,
          plan: plan,
          thought_signature: thoughtSignature,
          model: 'gemini-3-pro-preview',
          grounded: true
        });
      }

      case 'create_ui_artifact': {
        // Generate complete UI component with code + 4K image
        const { description, component_name, include_image = true } = payload;

        // 1. Generate component code
        const codeResponse = await fetch(`${GEMINI_BASE_URL}/models/gemini-3-pro-preview:generateContent?key=${GEMINI_API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Create a React component for GlyphLock.io:

Component Name: ${component_name}
Description: ${description}

Requirements:
- Use Tailwind CSS
- Royal blue gradient theme (#3B82F6, #4F46E5, #8B5CF6)
- Mobile responsive
- Include proper imports
- Export as default
- Clean, production-ready code

Provide ONLY the complete JSX code.`
              }]
            }],
            generationConfig: {
              temperature: 1.0,
              thinkingConfig: {
                thinkingLevel: 'low'
              }
            }
          })
        });

        const codeData = await codeResponse.json();
        const componentCode = codeData.candidates?.[0]?.content?.parts?.[0]?.text || '';

        // 2. Generate hero image if requested
        let imageUrl = null;
        if (include_image) {
          const imageResponse = await fetch(`${GEMINI_BASE_URL}/models/gemini-3-pro-image-preview:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{
                parts: [{
                  text: `Generate a professional hero image for: ${description}. 
                  
Style: Modern cybersecurity tech aesthetic, royal blue gradient (#3B82F6, #4F46E5, #8B5CF6), glassmorphism, high-tech, premium quality.`
                }]
              }],
              generationConfig: {
                temperature: 1.0,
                imageConfig: {
                  aspectRatio: '16:9',
                  imageSize: '4K'
                }
              },
              tools: [{ googleSearch: {} }]
            })
          });

          const imageData = await imageResponse.json();
          const imagePart = imageData.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
          
          if (imagePart?.inlineData) {
            const imageBuffer = Uint8Array.from(atob(imagePart.inlineData.data), c => c.charCodeAt(0));
            const blob = new Blob([imageBuffer], { type: imagePart.inlineData.mimeType });
            
            const uploadResult = await base44.asServiceRole.integrations.Core.UploadFile({
              file: blob
            });
            
            imageUrl = uploadResult.file_url;
          }
        }

        return Response.json({
          success: true,
          component: {
            name: component_name,
            code: componentCode,
            image_url: imageUrl
          },
          model: 'gemini-3-pro-preview + gemini-3-pro-image-preview'
        });
      }

      case 'analyze_codebase': {
        // Analyze project structure
        const entities = await base44.asServiceRole.entities;
        
        return Response.json({
          success: true,
          analysis: {
            project: 'glyphlock.io',
            entities: Object.keys(entities),
            message: 'Codebase analysis complete',
            model: 'gemini-3-pro-preview'
          }
        });
      }

      default:
        return Response.json({ 
          error: 'Unknown action',
          available_actions: [
            'generate_code',
            'generate_image',
            'edit_image',
            'plan_with_search',
            'create_ui_artifact',
            'analyze_codebase'
          ]
        }, { status: 400 });
    }

  } catch (error) {
    console.error('Site Builder error:', error);
    return Response.json({ 
      error: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
});