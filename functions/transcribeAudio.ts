import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();
        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await req.formData();
        const audioFile = formData.get('audio');

        if (!audioFile) {
            return Response.json({ error: 'Audio file is required' }, { status: 400 });
        }

        // Convert audio to base64 for API transmission
        const audioBuffer = await audioFile.arrayBuffer();
        const audioBase64 = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)));

        // Use speech recognition API or service
        // For now, using Google Speech-to-Text via Cloud API
        const response = await fetch(
            `https://speech.googleapis.com/v1/speech:recognize?key=${Deno.env.get('GOOGLE_API_KEY')}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    config: {
                        encoding: 'WEBM_OPUS',
                        sampleRateHertz: 48000,
                        languageCode: 'en-US',
                        enableAutomaticPunctuation: true,
                    },
                    audio: {
                        content: audioBase64,
                    },
                }),
            }
        );

        const result = await response.json();

        if (!response.ok) {
            return Response.json({ error: 'Speech recognition failed', details: result }, { status: 500 });
        }

        const transcript = result.results?.[0]?.alternatives?.[0]?.transcript || '';

        return Response.json({ text: transcript });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});