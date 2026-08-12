import { Readable } from 'stream';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const mediaUrl = req.query.url;
  const filename = req.query.filename || 'StreamSnag_Video.mp4';

  if (!mediaUrl) {
    return res.status(400).send('Media URL is required');
  }

  // Parse origin domain for Referer header
  let refererHeader = 'https://www.youtube.com/';
  try {
    const parsed = new URL(mediaUrl);
    refererHeader = `${parsed.protocol}//${parsed.hostname}/`;
  } catch {
    // fallback
  }

  try {
    const fetchResponse = await fetch(mediaUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': '*/*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': refererHeader,
      },
    });

    if (!fetchResponse.ok) {
      // If direct proxy fetch fails (e.g. 403/404), redirect browser directly to the media stream URL!
      return res.redirect(302, mediaUrl);
    }

    const cleanName = filename.replace(/[/\\?%*:|"<>]/g, '_').trim();
    const contentType = fetchResponse.headers.get('content-type') || 'video/mp4';
    const contentLength = fetchResponse.headers.get('content-length');

    res.setHeader('Content-Disposition', `attachment; filename="${cleanName}"`);
    res.setHeader('Content-Type', contentType.includes('text') ? 'video/mp4' : contentType);

    if (contentLength) {
      res.setHeader('Content-Length', contentLength);
    }

    if (fetchResponse.body) {
      Readable.fromWeb(fetchResponse.body).pipe(res);
    } else {
      const buffer = await fetchResponse.arrayBuffer();
      res.send(Buffer.from(buffer));
    }
  } catch (err) {
    console.error('Direct download proxy error:', err);
    // If proxy fails, redirect to direct URL so browser downloads raw file natively!
    return res.redirect(302, mediaUrl);
  }
}
