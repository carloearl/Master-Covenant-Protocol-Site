import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import { createHash } from 'node:crypto';

/**
 * GlyphLock Image Lab Operations Backend
 * Advanced AI image generation, hotzone management, and secure asset processing
 */

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Check authentication - some operations require it, some don't
    let user = null;
    try {
      user = await base44.auth.me();
    } catch (e) {
      // User not authenticated - allow some public operations
    }

    const body = await req.json();
    const { operation } = body;

    // Operations that don't require auth
    const publicOps = ['enhancePrompt', 'analyzeImage'];
    
    if (!publicOps.includes(operation) && !user) {
      return Response.json({ error: 'Authentication required' }, { status: 401 });
    }

    switch (operation) {
      case 'generateAdvanced':
        return await handleAdvancedGenerate(base44, user, body);
      
      case 'enhancePrompt':
        return await handleEnhancePrompt(base44, body);
      
      case 'analyzeImage':
        return await handleAnalyzeImage(base44, body);
      
      case 'detectObjects':
        return await handleDetectObjects(base44, body);
      
      case 'createHotzone':
        return await handleCreateHotzone(base44, user, body);
      
      case 'batchGenerate':
        return await handleBatchGenerate(base44, user, body);
      
      case 'upscale':
        return await handleUpscale(base44, user, body);
      
      case 'inpaint':
        return await handleInpaint(base44, user, body);
      
      case 'styleTransfer':
        return await handleStyleTransfer(base44, user, body);
      
      case 'removeBackground':
        return await handleRemoveBackground(base44, user, body);
      
      default:
        return Response.json({ error: 'Invalid operation' }, { status: 400 });
    }

  } catch (error) {
    console.error('Image Lab Ops error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

// Advanced AI Image Generation with full parameter control
async function handleAdvancedGenerate(base44, user, body) {
  const { 
    prompt, 
    negativePrompt,
    style,
    aspectRatio,
    quality,
    creativity,
    seed,
    referenceImageUrl,
    styleStrength,
    enhancePrompt: shouldEnhance
  } = body;

  if (!prompt) {
    return Response.json({ error: 'Prompt is required' }, { status: 400 });
  }

  // Build enhanced prompt based on parameters
  let finalPrompt = prompt;
  
  // Auto-enhance prompt if requested
  if (shouldEnhance) {
    try {
      const enhanceResponse = await base44.asServiceRole.integrations.Core.InvokeLLM({
        prompt: `Enhance this image generation prompt to produce better results. Keep the core idea but add artistic details, lighting, composition hints. Be concise but descriptive. Output ONLY the enhanced prompt, nothing else.

Original: "${prompt}"

Style: ${style || 'photorealistic'}`,
        response_json_schema: {
          type: "object",
          properties: {
            enhanced_prompt: { type: "string" }
          }
        }
      });
      finalPrompt = enhanceResponse.enhanced_prompt || prompt;
    } catch (e) {
      console.log('Enhancement failed, using original prompt');
    }
  }

  // Add style modifiers
  const styleModifiers = {
    photorealistic: 'photorealistic, ultra detailed, 8k resolution, professional photography',
    cyberpunk: 'cyberpunk aesthetic, neon lights, futuristic cityscape, rain reflections, blade runner style',
    watercolor: 'watercolor painting, soft edges, paper texture, artistic brush strokes',
    oilPainting: 'oil painting, impasto technique, classical masterpiece, rich colors',
    anime: 'anime style, studio ghibli quality, vibrant colors, detailed linework',
    minimalist: 'minimalist design, clean lines, simple composition, negative space',
    surreal: 'surrealist art, dreamlike, salvador dali inspired, impossible geometry',
    neon: 'neon glow, vivid colors, light trails, cybernetic aesthetic',
    vintage: 'vintage photography, film grain, sepia tones, nostalgic atmosphere',
    pencilSketch: 'pencil sketch, detailed shading, graphite on paper, artistic drawing',
    sciFi: 'science fiction, space opera, advanced technology, cinematic lighting',
    gothic: 'gothic architecture, dark atmosphere, dramatic shadows, mysterious',
    impressionist: 'impressionist painting, monet style, light and color, brushwork visible',
    lowPoly: 'low poly 3d art, geometric shapes, faceted surfaces, vibrant colors',
    steampunk: 'steampunk aesthetic, brass and copper, victorian machinery, gears and cogs',
    vaporwave: 'vaporwave aesthetic, 80s retro, pink and cyan, geometric shapes, nostalgic',
    artDeco: 'art deco style, 1920s elegance, geometric patterns, gold accents',
    cinematic: 'cinematic shot, movie still, dramatic lighting, film quality, anamorphic lens',
    abstract: 'abstract art, expressive, non-representational, color and form exploration',
    portrait: 'professional portrait, studio lighting, shallow depth of field, detailed skin texture'
  };

  const styleBoost = styleModifiers[style] || styleModifiers.photorealistic;
  
  // Quality modifiers
  const qualityModifiers = {
    'Draft': 'sketch quality',
    'Standard': 'good quality, detailed',
    'HD': 'high definition, very detailed, sharp focus',
    'Ultra': 'ultra high definition, masterpiece, extremely detailed, perfect composition, 8k resolution'
  };
  
  const qualityBoost = qualityModifiers[quality] || qualityModifiers.Standard;

  // Compose final prompt
  finalPrompt = `${finalPrompt}, ${styleBoost}, ${qualityBoost}`;
  
  if (negativePrompt) {
    finalPrompt += `. Avoid: ${negativePrompt}`;
  }

  // Generate the image using service role
  const generateParams = { prompt: finalPrompt };

  if (referenceImageUrl) {
    generateParams.existing_image_urls = [referenceImageUrl];
  }

  const result = await base44.asServiceRole.integrations.Core.GenerateImage(generateParams);

  // Save to database
  const savedImage = await base44.asServiceRole.entities.InteractiveImage.create({
    name: `Generated: ${prompt.substring(0, 50)}`,
    fileUrl: result.url,
    prompt: prompt,
    enhancedPrompt: finalPrompt,
    style: style || 'photorealistic',
    generationSettings: {
      negativePrompt,
      aspectRatio,
      quality,
      creativity,
      seed,
      styleStrength,
      referenceUsed: !!referenceImageUrl
    },
    source: 'generated',
    status: 'draft',
    ownerEmail: user.email,
  });

  return Response.json({
    success: true,
    image: {
      id: savedImage.id,
      url: result.url,
      prompt: prompt,
      enhancedPrompt: finalPrompt,
      style,
      quality
    }
  });
}

// Enhance a user's prompt with AI
async function handleEnhancePrompt(base44, body) {
  const { prompt, style, context } = body;

  if (!prompt) {
    return Response.json({ error: 'Prompt is required' }, { status: 400 });
  }

  const response = await base44.asServiceRole.integrations.Core.InvokeLLM({
    prompt: `You are an expert at crafting prompts for AI image generation. Enhance the following prompt to produce stunning, high-quality images.

Original prompt: "${prompt}"
Target style: ${style || 'any'}
${context ? `Additional context: ${context}` : ''}

Rules:
1. Keep the core subject/idea
2. Add specific artistic details (lighting, composition, atmosphere)
3. Include technical quality terms (8k, detailed, sharp)
4. Be descriptive but concise (under 200 words)
5. Don't change the fundamental concept

Return a JSON object with:
- enhanced_prompt: the improved prompt
- suggestions: array of 3 alternative variations
- keywords: array of key terms added`,
    response_json_schema: {
      type: "object",
      properties: {
        enhanced_prompt: { type: "string" },
        suggestions: { type: "array", items: { type: "string" } },
        keywords: { type: "array", items: { type: "string" } }
      }
    }
  });

  return Response.json({
    success: true,
    original: prompt,
    enhanced: response.enhanced_prompt,
    suggestions: response.suggestions || [],
    keywords: response.keywords || []
  });
}

// Analyze an image for content, objects, and composition
async function handleAnalyzeImage(base44, body) {
  const { imageUrl } = body;

  if (!imageUrl) {
    return Response.json({ error: 'Image URL is required' }, { status: 400 });
  }

  const response = await base44.asServiceRole.integrations.Core.InvokeLLM({
    prompt: `Analyze this image comprehensively. Provide:

1. Main subjects and objects visible
2. Scene description and setting
3. Color palette (list dominant colors)
4. Mood/atmosphere
5. Composition analysis (rule of thirds, symmetry, etc.)
6. Suggested improvements or variations
7. Potential hotspot locations (interactive elements users might want to click)

Return as structured JSON.`,
    file_urls: [imageUrl],
    response_json_schema: {
      type: "object",
      properties: {
        subjects: { type: "array", items: { type: "string" } },
        scene_description: { type: "string" },
        colors: { type: "array", items: { type: "string" } },
        mood: { type: "string" },
        composition: { type: "string" },
        suggestions: { type: "array", items: { type: "string" } },
        potential_hotspots: {
          type: "array",
          items: {
            type: "object",
            properties: {
              object: { type: "string" },
              location: { type: "string" },
              suggested_action: { type: "string" }
            }
          }
        }
      }
    }
  });

  return Response.json({
    success: true,
    analysis: response
  });
}

// Detect all objects in an image and return bounding boxes
async function handleDetectObjects(base44, body) {
  const { imageUrl } = body;

  if (!imageUrl) {
    return Response.json({ error: 'Image URL is required' }, { status: 400 });
  }

  const response = await base44.asServiceRole.integrations.Core.InvokeLLM({
    prompt: `Detect all distinct objects, UI elements, people, and interactive areas in this image. For each, provide:

- object_name: what the object is
- bounding_box: approximate position as percentages {x, y, width, height} where x,y is top-left corner
- confidence: 0-100
- suggested_action: what action would make sense (openUrl, showInfo, playMedia, zoomIn, etc.)
- is_clickable: true if this looks like something users would want to interact with

Focus on elements that would make good interactive hotspots. Be thorough.`,
    file_urls: [imageUrl],
    response_json_schema: {
      type: "object",
      properties: {
        objects: {
          type: "array",
          items: {
            type: "object",
            properties: {
              object_name: { type: "string" },
              bounding_box: {
                type: "object",
                properties: {
                  x: { type: "number" },
                  y: { type: "number" },
                  width: { type: "number" },
                  height: { type: "number" }
                }
              },
              confidence: { type: "number" },
              suggested_action: { type: "string" },
              is_clickable: { type: "boolean" }
            }
          }
        },
        total_objects: { type: "number" }
      }
    }
  });

  return Response.json({
    success: true,
    objects: response.objects || [],
    totalDetected: response.total_objects || 0
  });
}

// Create an intelligent hotzone with AI assistance
async function handleCreateHotzone(base44, user, body) {
  const { imageId, imageUrl, clickX, clickY, payloadType, customPayload } = body;

  if (!imageUrl || clickX === undefined || clickY === undefined) {
    return Response.json({ error: 'Image URL and click coordinates are required' }, { status: 400 });
  }

  // AI detection at click location
  const response = await base44.asServiceRole.integrations.Core.InvokeLLM({
    prompt: `A user clicked at position ${Math.round(clickX)}% from left, ${Math.round(clickY)}% from top on this image.

Identify what object/element is at that location and provide:
1. detected_object: specific name of what was clicked
2. bounding_box: tight bounding box around the object as percentages {x, y, width, height}
3. suggested_label: short label (2-4 words)
4. suggested_action: best action type (openUrl, showModal, playAudio, invokeAgent, verifyAccess, downloadFile, shareLink)
5. confidence: 0-100
6. description: brief description for accessibility`,
    file_urls: [imageUrl],
    response_json_schema: {
      type: "object",
      properties: {
        detected_object: { type: "string" },
        bounding_box: {
          type: "object",
          properties: {
            x: { type: "number" },
            y: { type: "number" },
            width: { type: "number" },
            height: { type: "number" }
          }
        },
        suggested_label: { type: "string" },
        suggested_action: { type: "string" },
        confidence: { type: "number" },
        description: { type: "string" }
      }
    }
  });

  // Create hotzone object
  const hotzone = {
    id: `hz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    x: response.bounding_box?.x ?? Math.max(0, clickX - 5),
    y: response.bounding_box?.y ?? Math.max(0, clickY - 5),
    width: response.bounding_box?.width ?? 10,
    height: response.bounding_box?.height ?? 10,
    shape: 'rect',
    label: response.suggested_label || 'Hotzone',
    description: response.description || response.detected_object || '',
    actionType: payloadType || response.suggested_action || 'openUrl',
    actionValue: customPayload || '',
    payload: {
      type: payloadType || response.suggested_action,
      value: customPayload || '',
      metadata: {}
    },
    aiDetected: true,
    detectedObject: response.detected_object,
    confidence: response.confidence || 0,
    createdAt: new Date().toISOString(),
    createdBy: user?.email || 'anonymous'
  };

  // If imageId provided, update the image's hotspots
  if (imageId && user) {
    try {
      const images = await base44.entities.InteractiveImage.filter({ id: imageId });
      const image = images[0];
      
      if (image && (image.ownerEmail === user.email || user.role === 'admin')) {
        const existingHotspots = image.hotspots || [];
        await base44.entities.InteractiveImage.update(imageId, {
          hotspots: [...existingHotspots, hotzone]
        });
      }
    } catch (e) {
      console.log('Could not auto-save hotzone to image:', e.message);
    }
  }

  return Response.json({
    success: true,
    hotzone,
    detected: response.detected_object,
    confidence: response.confidence
  });
}

// Batch generate multiple images
async function handleBatchGenerate(base44, user, body) {
  const { prompts, style, quality, count } = body;

  const generatePrompts = prompts || Array(count || 1).fill(body.prompt);
  
  if (!generatePrompts.length || !generatePrompts[0]) {
    return Response.json({ error: 'Prompts or prompt+count required' }, { status: 400 });
  }

  if (generatePrompts.length > 8) {
    return Response.json({ error: 'Maximum 8 images per batch' }, { status: 400 });
  }

  const results = [];
  const errors = [];

  for (let i = 0; i < generatePrompts.length; i++) {
    try {
      const prompt = generatePrompts[i];
      const result = await base44.asServiceRole.integrations.Core.GenerateImage({
        prompt: `${prompt}, ${style || 'photorealistic'} style, ${quality || 'high'} quality`
      });

      const savedImage = await base44.asServiceRole.entities.InteractiveImage.create({
        name: `Batch ${i + 1}: ${prompt.substring(0, 40)}`,
        fileUrl: result.url,
        prompt,
        style: style || 'photorealistic',
        source: 'batch_generated',
        status: 'draft',
        ownerEmail: user.email,
        batchId: body.batchId || `batch_${Date.now()}`
      });

      results.push({
        index: i,
        id: savedImage.id,
        url: result.url,
        prompt
      });
    } catch (err) {
      errors.push({ index: i, prompt: generatePrompts[i], error: err.message });
    }
  }

  return Response.json({
    success: true,
    generated: results.length,
    failed: errors.length,
    results,
    errors
  });
}

// Upscale an image
async function handleUpscale(base44, user, body) {
  const { imageUrl, scale } = body;

  if (!imageUrl) {
    return Response.json({ error: 'Image URL is required' }, { status: 400 });
  }

  const analysis = await base44.asServiceRole.integrations.Core.InvokeLLM({
    prompt: 'Describe this image in detail for recreation at higher quality. Include all visual elements, colors, composition, and style.',
    file_urls: [imageUrl],
    response_json_schema: {
      type: "object",
      properties: {
        description: { type: "string" },
        style: { type: "string" }
      }
    }
  });

  const upscaledResult = await base44.asServiceRole.integrations.Core.GenerateImage({
    prompt: `${analysis.description}, ultra high definition, 8k resolution, masterpiece quality, extremely detailed, sharp focus`,
    existing_image_urls: [imageUrl]
  });

  return Response.json({
    success: true,
    originalUrl: imageUrl,
    upscaledUrl: upscaledResult.url,
    scale: scale || 2
  });
}

// Inpaint/edit part of an image
async function handleInpaint(base44, user, body) {
  const { imageUrl, editPrompt, region } = body;

  if (!imageUrl || !editPrompt) {
    return Response.json({ error: 'Image URL and edit prompt are required' }, { status: 400 });
  }

  const result = await base44.asServiceRole.integrations.Core.GenerateImage({
    prompt: `${editPrompt}. Maintain the original image style and quality. Seamless integration.`,
    existing_image_urls: [imageUrl]
  });

  return Response.json({
    success: true,
    originalUrl: imageUrl,
    editedUrl: result.url,
    editPrompt
  });
}

// Apply style transfer to an image
async function handleStyleTransfer(base44, user, body) {
  const { imageUrl, targetStyle, styleImageUrl } = body;

  if (!imageUrl || !targetStyle) {
    return Response.json({ error: 'Image URL and target style are required' }, { status: 400 });
  }

  const stylePrompts = {
    'van_gogh': 'in the style of Vincent van Gogh, swirling brushstrokes, starry night aesthetic',
    'monet': 'in the style of Claude Monet, impressionist, soft light, water reflections',
    'picasso': 'in the style of Pablo Picasso, cubist, geometric shapes, bold colors',
    'anime': 'anime style, studio ghibli quality, vibrant colors',
    'comic': 'comic book style, bold outlines, halftone dots, action panels',
    'pixel': 'pixel art style, 16-bit graphics, retro gaming aesthetic',
    'watercolor': 'watercolor painting, soft edges, paper texture',
    'oil': 'oil painting, impasto technique, classical masterpiece',
    'sketch': 'pencil sketch, detailed shading, artistic drawing',
    'photorealistic': 'photorealistic, ultra detailed, professional photography',
    'cyberpunk': 'cyberpunk aesthetic, neon lights, futuristic',
    'minimalist': 'minimalist design, clean lines, simple',
    'surreal': 'surrealist art, dreamlike, impossible geometry',
    'neon': 'neon glow, vivid colors, light trails',
    'vintage': 'vintage photography, film grain, sepia tones',
    'sciFi': 'science fiction, space opera, advanced technology',
    'gothic': 'gothic architecture, dark atmosphere, dramatic shadows',
    'impressionist': 'impressionist painting, monet style, light and color',
    'lowPoly': 'low poly 3d art, geometric shapes',
    'steampunk': 'steampunk aesthetic, brass and copper, victorian machinery',
    'vaporwave': 'vaporwave aesthetic, 80s retro, pink and cyan',
    'artDeco': 'art deco style, 1920s elegance, geometric patterns'
  };

  const styleModifier = stylePrompts[targetStyle] || targetStyle;

  const existingUrls = [imageUrl];
  if (styleImageUrl) existingUrls.push(styleImageUrl);

  const result = await base44.asServiceRole.integrations.Core.GenerateImage({
    prompt: `Transform this image ${styleModifier}. Maintain the subject and composition but apply the artistic style completely.`,
    existing_image_urls: existingUrls
  });

  return Response.json({
    success: true,
    originalUrl: imageUrl,
    styledUrl: result.url,
    appliedStyle: targetStyle
  });
}

// Remove background from image
async function handleRemoveBackground(base44, user, body) {
  const { imageUrl } = body;

  if (!imageUrl) {
    return Response.json({ error: 'Image URL is required' }, { status: 400 });
  }

  const analysis = await base44.asServiceRole.integrations.Core.InvokeLLM({
    prompt: 'Identify the main subject of this image. Describe it in detail for isolation on a transparent/white background.',
    file_urls: [imageUrl],
    response_json_schema: {
      type: "object",
      properties: {
        subject: { type: "string" },
        description: { type: "string" }
      }
    }
  });

  const result = await base44.asServiceRole.integrations.Core.GenerateImage({
    prompt: `${analysis.subject}, ${analysis.description}, isolated on pure white background, product photography style, no shadows, clean cutout`,
    existing_image_urls: [imageUrl]
  });

  return Response.json({
    success: true,
    originalUrl: imageUrl,
    processedUrl: result.url,
    subject: analysis.subject
  });
}