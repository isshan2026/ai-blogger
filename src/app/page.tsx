import { getArticles } from '@/lib/db';
import ArticleList from '@/components/ArticleList';

export default function Home() {
  const articles = getArticles();

  return <ArticleList articles={articles} />;
}
