import { Pool } from 'pg';

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

// 開発中のホットリロードによるコネクション枯渇を防ぐためのシングルトンプール
const globalForPg = global as unknown as { pool: Pool };

const pool = globalForPg.pool || new Pool({
    connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
    // ローカル環境等でSSLエラーが出ないように調整（本番Vercelではほぼ必須）
    ssl: { rejectUnauthorized: false }
});

if (process.env.NODE_ENV !== 'production') globalForPg.pool = pool;

let initialized = false;

/**
 * データベース上にテーブルが存在しない場合は作成する
 */
async function initDb() {
    if (initialized) return;
    try {
        const query = `
            CREATE TABLE IF NOT EXISTS articles (
                id VARCHAR(255) PRIMARY KEY,
                title TEXT NOT NULL,
                summary JSONB NOT NULL,
                body TEXT NOT NULL,
                "originalLink" TEXT UNIQUE NOT NULL,
                source VARCHAR(255) NOT NULL,
                "pubDate" TIMESTAMP NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
            );
        `;
        await pool.query(query);
        initialized = true;
    } catch (error) {
        console.error("Database initialization failed:", error);
    }
}

/**
 * 過去に保存された記事をすべて取得する
 */
export async function getArticles(): Promise<ArticleRecord[]> {
    await initDb();
    try {
        const { rows } = await pool.query('SELECT * FROM articles ORDER BY "createdAt" DESC');
        return rows.map(row => ({
            ...row,
            createdAt: row.createdAt.toISOString(),
            pubDate: row.pubDate.toISOString(),
        }));
    } catch (err) {
        console.error('Error reading DB:', err);
        return [];
    }
}

/**
 * IDで特定の記事を取得する
 */
export async function getArticleById(id: string): Promise<ArticleRecord | null> {
    await initDb();
    const { rows } = await pool.query('SELECT * FROM articles WHERE id = $1', [id]);
    if (rows.length === 0) return null;
    const row = rows[0];
    return {
        ...row,
        createdAt: row.createdAt.toISOString(),
        pubDate: row.pubDate.toISOString(),
    };
}

/**
 * 同じ元記事からすでに生成済みかどうかを判定する
 */
export async function isArticleExists(originalLink: string): Promise<boolean> {
    await initDb();
    const { rows } = await pool.query('SELECT 1 FROM articles WHERE "originalLink" = $1', [originalLink]);
    return rows.length > 0;
}

/**
 * 新しい記事を保存する
 */
export async function saveArticle(article: Omit<ArticleRecord, 'id' | 'createdAt'>): Promise<ArticleRecord> {
    await initDb();
    const id = Date.now().toString(36) + Math.random().toString(36).substring(2, 7);

    const query = `
        INSERT INTO articles (id, title, summary, body, "originalLink", source, "pubDate")
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
    `;
    const values = [
        id,
        article.title,
        JSON.stringify(article.summary),
        article.body,
        article.originalLink,
        article.source,
        new Date(article.pubDate)
    ];

    const { rows } = await pool.query(query, values);
    const row = rows[0];
    return {
        ...row,
        createdAt: row.createdAt.toISOString(),
        pubDate: row.pubDate.toISOString(),
    };
}
