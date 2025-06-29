import fetch from 'node-fetch';
import cheerio from 'cheerio';

export default async function handler(req, res) {
  const { url } = req.query;
  if (!url || !url.includes('xvideos.com/video')) {
    return res.status(400).json({ status: false, message: "URL tidak valid" });
  }

  try {
    const html = await fetch(url).then(res => res.text());
    const $ = cheerio.load(html);
    const script = $('script').filter((i, el) => $(el).html().includes('setVideoUrlHigh')).html();

    const video_360 = script?.match(/setVideoUrlLow\('(.*?)'\)/)?.[1];
    const video_720 = script?.match(/setVideoUrlHigh\('(.*?)'\)/)?.[1];
    const video_1080 = script?.match(/setVideoUrlHLS\('(.*?)'\)/)?.[1];
    const title = $('title').text().trim();
    const duration = $('span.duration').first().text().trim();

    res.json({
      status: true,
      result: {
        title,
        duration,
        video_360,
        video_720,
        video_1080
      }
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ status: false, message: "Gagal mengambil data video." });
  }
}
