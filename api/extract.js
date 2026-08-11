import ytDlpExec from 'yt-dlp-exec';

export default async function handler(req, res) {
  // Enable CORS Headers for Vercel Serverless
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

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

    const formats = data.formats || [];
    const combinedFormats = formats.filter(f => f.vcodec !== 'none' && f.acodec !== 'none' && f.url);
    
    const bestFormat = combinedFormats.length > 0 
      ? combinedFormats[combinedFormats.length - 1]
      : formats.find(f => f.url && f.ext === 'mp4') || formats[0];

    const streamUrl = bestFormat?.url || data.url;

    return res.status(200).json({
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
    return res.status(500).json({
      error: 'Failed to extract video details',
      details: error.message || error
    });
  }
}
