import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default async function handler(req, res) {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, CORS_HEADERS);
    return res.end();
  }

  if (req.method !== 'POST') {
    res.writeHead(405, { ...CORS_HEADERS, 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: 'Method not allowed' }));
  }

  try {
    const { imageBase64, stylePrompt, styleName } = req.body;

    if (!imageBase64 || !stylePrompt) {
      res.writeHead(400, { ...CORS_HEADERS, 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'imageBase64 and stylePrompt are required' }));
    }

    // Step 1: Analyze face traits with Claude Vision
    const visionResponse = await client.messages.create({
      model: 'claude-opus-4-7',
      max_tokens: 400,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: detectMediaType(imageBase64),
                data: imageBase64,
              },
            },
            {
              type: 'text',
              text: 'Describe this person\'s key facial features in 2-3 sentences for an anime artist: hair color and style, eye color and shape, skin tone, distinctive features, approximate age, and gender expression. Be concise and specific.',
            },
          ],
        },
      ],
    });

    const description = visionResponse.content[0].text;

    // Step 2: Build image prompt and call Pollinations
    const imagePrompt = buildImagePrompt(description, stylePrompt, styleName);
    const imageUrl = buildPollinationsUrl(imagePrompt);

    // Warm up the image by fetching headers (optional, ensures it's cached)
    try {
      await fetch(imageUrl, { method: 'HEAD' });
    } catch (_) {
      // Non-blocking — the URL still works
    }

    res.writeHead(200, { ...CORS_HEADERS, 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ imageUrl, description }));
  } catch (err) {
    console.error('[transform] Error:', err);
    const status = err.status || 500;
    res.writeHead(status, { ...CORS_HEADERS, 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: err.message || 'Internal server error' }));
  }
}

function buildImagePrompt(description, stylePrompt, styleName) {
  return (
    `${styleName} anime character portrait, ` +
    `${stylePrompt}, ` +
    `based on person described as: ${description}, ` +
    `high quality, detailed face, anime art, illustration, ` +
    `single character, centered composition, clean background`
  );
}

function buildPollinationsUrl(prompt) {
  const encoded = encodeURIComponent(prompt);
  const seed = Math.floor(Math.random() * 999999);
  // Pollinations free tier — no API key needed unless using premium models
  return `https://image.pollinations.ai/prompt/${encoded}?width=512&height=512&seed=${seed}&nologo=true&model=flux`;
}

function detectMediaType(base64) {
  // Detect from base64 header signature
  const header = base64.substring(0, 8);
  if (header.startsWith('/9j/')) return 'image/jpeg';
  if (header.startsWith('iVBORw0')) return 'image/png';
  if (header.startsWith('R0lGOD')) return 'image/gif';
  if (header.startsWith('UklGR')) return 'image/webp';
  return 'image/jpeg'; // default fallback
}
