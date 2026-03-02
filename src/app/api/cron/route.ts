import { NextResponse } from 'next/server';
import { fetchLatestArticles } from '@/lib/fetcher';
import { generateBlogArticle } from '@/lib/ai';
import { isArticleExists, saveArticle } from '@/lib/db';
import { insertAffiliateTags } from '@/lib/affiliate';

// Vercel Cron等から定期的に叩かれるルート
export async function GET(request: Request) {
    try {
        // 1. 最新のRSS記事を一括取得
        const articles = await fetchLatestArticles();
        if (articles.length === 0) {
            return NextResponse.json({ message: 'No articles found in RSS feeds' }, { status: 200 });
        }

        // 2. まだ翻訳・生成されていない新しい記事だけをフィルタリング
        // ※ APIコストを抑えるため、1回の実行につき最大1記事だけ生成する
        let targetArticle = null;
        for (const article of articles) {
            const exists = await isArticleExists(article.link);
            if (!exists) {
                targetArticle = article;
                break;
            }
        }

        if (!targetArticle) {
            return NextResponse.json({ message: 'No new articles to process' }, { status: 200 });
        }

        const contentToTranslate = targetArticle.originalContent || targetArticle.contentSnippet || '';
        if (!contentToTranslate) {
            return NextResponse.json({ message: 'Target article has no content' }, { status: 400 });
        }

        console.log(`Processing new article: ${targetArticle.title}`);

        // 3. 英語記事をGemini APIで処理して日本語ブログ記事化
        const generated = await generateBlogArticle(targetArticle.title, contentToTranslate);

        if (!generated) {
            return NextResponse.json({ error: 'Failed to generate article from AI' }, { status: 500 });
        }

        // 4. アフィリエイト用タグを本文に挿入する
        const bodyWithAffiliate = insertAffiliateTags(generated.body);

        // 5. 生成されたデータをDB（ローカルJSON）に保存する
        // summaryが配列の場合はそのまま、文字列の場合は配列に変換して保存
        const summaryArray = Array.isArray(generated.summary)
            ? generated.summary
            : typeof generated.summary === 'string'
                ? [generated.summary]
                : [];

        const newSavedRecord = await saveArticle({
            title: generated.title,
            summary: summaryArray,
            body: bodyWithAffiliate,
            originalLink: targetArticle.link,
            source: targetArticle.source,
            pubDate: targetArticle.pubDate,
        });

        return NextResponse.json({
            message: 'Successfully generated and saved new article',
            article: newSavedRecord
        }, { status: 200 });

    } catch (error: any) {
        console.error('Cron API Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
