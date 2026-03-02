import { getArticles } from '@/lib/db';
import ArticleList from '@/components/ArticleList';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const articles = await getArticles();

  return <ArticleList articles={articles} />;
}
