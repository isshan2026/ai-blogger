import { notFound } from 'next/navigation';
import { getArticleById } from '@/lib/db';
import ArticleDetail from '@/components/ArticleDetail';

export const dynamic = 'force-dynamic';

type Props = {
    params: Promise<{ id: string }>;
};

export default async function PostPage(props: Props) {
    const params = await props.params;
    const article = await getArticleById(params.id);

    if (!article) {
        notFound();
    }

    return <ArticleDetail article={article} />;
}
