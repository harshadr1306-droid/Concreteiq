// netlify/functions/analyse-image.js
//
// Optional serverless function for ConcreteIQ. Forwards an image + prompt to
// Anthropic's Claude Vision API and returns the parsed JSON.
//
// Required environment variable (set in Netlify dashboard):
//   ANTHROPIC_API_KEY
//
// The HTML client only calls this endpoint when running on a *.netlify.app /
// *.netlify.com host. On every other host (GitHub Pages, Cloudflare, file://)
// the client uses its built-in MobileNet + CV pipeline.

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'method not allowed' };
  }
  let body;
  try { body = JSON.parse(event.body || '{}'); } catch (e) {
    return { statusCode: 400, body: 'invalid json' };
  }
  const { base64, mime, prompt } = body;
  if (!base64 || !prompt) {
    return { statusCode: 400, body: 'missing base64 or prompt' };
  }
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'ANTHROPIC_API_KEY not configured' }) };
  }

  try {
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 250,
        system: prompt,
        messages: [{
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: mime || 'image/jpeg', data: base64 } },
            { type: 'text', text: 'Classify this image strictly as construction aggregate or non-aggregate per the system prompt. Respond ONLY with valid JSON.' },
          ],
        }],
      }),
    });
    if (!resp.ok) {
      const txt = await resp.text();
      return { statusCode: 502, body: JSON.stringify({ error: `claude ${resp.status}: ${txt.slice(0,200)}` }) };
    }
    const data = await resp.json();
    const tc = (data.content || []).find(c => c.type === 'text');
    if (!tc) return { statusCode: 502, body: JSON.stringify({ error: 'no text content in claude response' }) };
    let clean = tc.text.trim().replace(/^```json\s*|^```\s*|```\s*$/gm, '').trim();
    const m = clean.match(/\{[\s\S]*\}/);
    if (m) clean = m[0];
    let parsed;
    try { parsed = JSON.parse(clean); } catch (e) {
      return { statusCode: 502, body: JSON.stringify({ error: 'claude returned non-json: ' + clean.slice(0,200) }) };
    }
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsed),
    };
  } catch (e) {
    return { statusCode: 502, body: JSON.stringify({ error: 'network: ' + e.message }) };
  }
};
