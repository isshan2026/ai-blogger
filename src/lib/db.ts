import fs from 'fs';
import path from 'path';

// 保存先のファイルパス（Vercel等のサーバーレス環境では書き込み不可な場合があるためローカル開発用）
const DB_FILE_PATH = path.join(process.cwd(), 'data', 'articles.json');

export interface ArticleRecord {
    id: string; // 記事の一意なID (URL slugなどに使用)
    title: string;
    summary: string[]; // 要約（箇条書き）
    body: string;
    originalLink: string;
    source: string;
    pubDate: string; // RSSでの公開日時
    createdAt: string; // 生成日時
}

/**
 * DBファイルを初期化（存在しない場合は作成）する
 */
function initDb() {
    const dir = path.dirname(DB_FILE_PATH);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE_PATH)) {
        fs.writeFileSync(DB_FILE_PATH, JSON.stringify([]));
    }
}

/**
 * 過去に保存された記事をすべて取得する
 */
export function getArticles(): ArticleRecord[] {
    initDb();
    try {
        const data = fs.readFileSync(DB_FILE_PATH, 'utf-8');
        const articles = JSON.parse(data);
        // 日付の新しい順（降順）に並び替えて返す
        return articles.sort((a: ArticleRecord, b: ArticleRecord) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (err) {
        console.error('Error reading DB:', err);
        return [];
    }
}

/**
 * IDで特定の記事を取得する
 */
export function getArticleById(id: string): ArticleRecord | null {
    const articles = getArticles();
    return articles.find(a => a.id === id) || null;
}

/**
 * 同じ元記事からすでに生成済みかどうかを判定する
 */
export function isArticleExists(originalLink: string): boolean {
    const articles = getArticles();
    return articles.some(a => a.originalLink === originalLink);
}

/**
 * 新しい記事を保存する
 */
export function saveArticle(article: Omit<ArticleRecord, 'id' | 'createdAt'>): ArticleRecord {
    const articles = getArticles();

    // ID生成 (英数字のランダムな文字列または日付ベース)
    const id = Date.now().toString(36) + Math.random().toString(36).substring(2, 7);

    const newRecord: ArticleRecord = {
        ...article,
        id,
        createdAt: new Date().toISOString(),
    };

    articles.push(newRecord);
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(articles, null, 2));

    return newRecord;
}
