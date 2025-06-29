import fetch from 'node-fetch';
import cheerio from 'cheerio';

export default async function handler(req, res) {
  const query = req.query.query;
  if (!query) return res.status(400).json({ status: false, message: "Query tidak ditemukan" });

  try {
    const search = await fetch(`https://www.xvideos.com/?k=${encodeURIComponent(query)}`);
    const html = await search.text();
    const $ = cheerio.load(html);

    const results = [];

    $('.thumb-block').each((i, el) => {
      const title = $(el).find('.title a').text().trim();
      const url = 'https://www.xvideos.com' + $(el).find('.title a').attr('href');
      const thumb = $(el).find('img').attr('data-src') || $(el).find('img').attr('src');
      const duration = $(el).find('.duration').text().trim();
      const views = $(el).find('.metadata .views').text().trim();

      if (title && url) {
        results.push({ title, url, thumb, duration, views });
      }
    });

    res.json({ status: true, result: results });
  } catch (e) {
    console.error(e);
    res.status(500).json({ status: false, message: "Internal error" });
  }
}
