import Parser from 'rss-parser';

// RSSから取得するデータの型定義
export interface ExtractedArticle {
  title: string;
  link: string;
  pubDate: string;
  contentSnippet?: string;
  originalContent?: string;
  source: string;
}

// 監視する海外のAI/Tech関連RSSフィードリスト
const RSS_FEEDS = [
  { name: 'TechCrunch AI (EN)', url: 'https://techcrunch.com/category/artificial-intelligence/feed/' },
  { name: 'The Verge (Tech)', url: 'https://www.theverge.com/rss/index.xml' },
  // 必要に応じて他のフィード（Hugging FaceブログやMIT Tech Reviewなど）を追加
];

/**
 * 登録されたすべてのRSSフィードから最新記事を取得して結合し、新しい順にソートする
 */
export async function fetchLatestArticles(): Promise<ExtractedArticle[]> {
  const parser = new Parser();
  let allArticles: ExtractedArticle[] = [];

  for (const feed of RSS_FEEDS) {
    try {
      console.log(`Fetching RSS feed: ${feed.name}`);
      const parsedFeed = await parser.parseURL(feed.url);

      const items = parsedFeed.items.map((item) => {
        return {
          title: item.title || 'No Title',
          link: item.link || '',
          pubDate: item.pubDate || new Date().toISOString(),
          contentSnippet: item.contentSnippet || item.summary || '',
          originalContent: item.content || '',
          source: feed.name,
        };
      });

      allArticles = [...allArticles, ...items];
    } catch (error) {
      console.error(`Error fetching feed ${feed.name}:`, error);
    }
  }

  // 日付が新しい順にソート
  allArticles.sort((a, b) => {
    return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
  });

  return allArticles;
}
