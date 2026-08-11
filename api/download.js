import { Readable } from 'stream';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const mediaUrl = req.query.url;
  const filename = req.query.filename || 'StreamSnag_Video.mp4';

  if (!mediaUrl) {
    return res.status(400).send('Media URL is required');
  }

  const cleanName = filename.replace(/[/\\?%*:|"<>]/g, '_').trim();
  res.setHeader('Content-Disposition', `attachment; filename="${cleanName}"`);
  res.setHeader('Content-Type', 'video/mp4');

  try {
    const fetchResponse = await fetch(mediaUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    if (!fetchResponse.ok) throw new Error(`HTTP ${fetchResponse.status}`);

    const contentLength = fetchResponse.headers.get('content-length');
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
    res.status(500).send('Failed to process download stream');
  }
}
