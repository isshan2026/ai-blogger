import { NextResponse } from 'next/server';
import { fetchLatestArticles } from '@/lib/fetcher';
import { generateBlogArticle } from '@/lib/ai';

export async function GET() {
    try {
        // 1. RSSから記事を取得
        const articles = await fetchLatestArticles();
        if (articles.length === 0) {
            return NextResponse.json({ message: 'No articles found' }, { status: 404 });
        }

        // 2. テストのため、最新の1件だけを処理する
        const targetArticle = articles[0];
        const contentToTranslate = targetArticle.originalContent || targetArticle.contentSnippet || '';

        if (!contentToTranslate) {
            return NextResponse.json({ message: 'No content to translate', article: targetArticle }, { status: 400 });
        }

        // 3. Gemini API で日本語記事を生成
        const generated = await generateBlogArticle(targetArticle.title, contentToTranslate);

        // 4. 結果を返す
        return NextResponse.json({
            original: targetArticle,
            generated: generated
        });

    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
