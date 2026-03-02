import { getArticles } from '@/lib/db';
import ArticleList from '@/components/ArticleList';

export default async function Home() {
  const articles = await getArticles();

  return <ArticleList articles={articles} />;
}
