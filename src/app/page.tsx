import { getArticles, getTotalArticlesCount } from '@/lib/db';
import ArticleList from '@/components/ArticleList';

export const dynamic = 'force-dynamic';

export default async function Home({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page, 10) : 1;
  const limit = 5; // より軽く、見やすくするため1ページ5件に設定
  
  const [articles, totalCount] = await Promise.all([
      getArticles(page, limit),
      getTotalArticlesCount()
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  return <ArticleList articles={articles} currentPage={page} totalPages={totalPages} />;
}
