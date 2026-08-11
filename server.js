import express from 'express';
import cors from 'cors';
import ytDlpExec from 'yt-dlp-exec';
import { Readable } from 'stream';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get('/api/extract', async (req, res) => {
  const videoUrl = req.query.url;
  if (!videoUrl) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  try {
    const data = await ytDlpExec(videoUrl, {
      dumpSingleJson: true,
      noWarnings: true,
      noCallHome: true,
      preferFreeFormats: true,
    });

    // Find pre-merged full-length video + audio formats (vcodec !== 'none' && acodec !== 'none')
    const formats = data.formats || [];
    const combinedFormats = formats.filter(f => f.vcodec !== 'none' && f.acodec !== 'none' && f.url);
    
    // Pick the highest quality combined video+audio MP4 format
    const bestFormat = combinedFormats.length > 0 
      ? combinedFormats[combinedFormats.length - 1]
      : formats.find(f => f.url && f.ext === 'mp4') || formats[0];

    const streamUrl = bestFormat?.url || data.url;

    res.json({
      id: data.id,
      title: data.title,
      thumbnail: data.thumbnail,
      author: data.uploader || data.channel || '@StreamCreator',
      duration: data.duration_string || `${Math.floor((data.duration || 0) / 60)}:${(data.duration || 0) % 60}`,
      url: streamUrl,
      formats: (combinedFormats.length > 0 ? combinedFormats : formats).slice(-6).map((f) => ({
        format_id: f.format_id,
        resolution: f.resolution || (f.width && f.height ? `${f.width}x${f.height}` : 'HD Stream'),
        ext: f.ext || 'mp4',
        filesize: f.filesize ? `${(f.filesize / 1024 / 1024).toFixed(1)} MB` : 'Direct Stream',
        url: f.url,
      })),
    });
  } catch (error) {
    console.error('yt-dlp extraction error:', error.message || error);
    res.status(500).json({
      error: 'Failed to extract video details',
      details: error.message || error
    });
  }
});

// Force Direct File Attachment Download with Content-Length header for exact "X MB / Y MB" progress
app.get('/api/download', async (req, res) => {
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

    // Pass upstream Content-Length to browser so Chrome displays "X MB / Y MB (Z%)"
    const contentLength = fetchResponse.headers.get('content-length');
    if (contentLength) {
      res.setHeader('Content-Length', contentLength);
    }

    if (fetchResponse.body) {
      // Pipe stream directly to response for instant 0ms download hand-off
      Readable.fromWeb(fetchResponse.body).pipe(res);
    } else {
      const buffer = await fetchResponse.arrayBuffer();
      res.send(Buffer.from(buffer));
    }
  } catch (err) {
    console.error('Direct download proxy error:', err);
    res.status(500).send('Failed to process download stream');
  }
});

app.listen(PORT, () => {
  console.log(`🚀 StreamSnag Extraction Server running at http://localhost:${PORT}`);
});
