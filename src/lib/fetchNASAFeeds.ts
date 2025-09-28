// src/lib/fetchNASAFeeds.ts
import Parser from "rss-parser";

const parser = new Parser();

const FEEDS = [
  "https://www.nasa.gov/news-release/feed/",
  "https://www.nasa.gov/feed/",
  "https://www.jpl.nasa.gov/rss/news"
];

export async function fetchNASAFeeds() {
  const allItems: any[] = [];

  for (const url of FEEDS) {
    try {
      const feed = await parser.parseURL(url);
      feed.items.forEach((item) => {
        allItems.push({
          title: item.title,
          link: item.link,
          pubDate: item.pubDate,
          contentSnippet: item.contentSnippet,
          source: feed.title
        });
      });
    } catch (err) {
      console.error("Error leyendo feed:", url, err);
    }
  }

  // Ordenar por fecha descendente
  return allItems.sort(
    (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
  );
}
