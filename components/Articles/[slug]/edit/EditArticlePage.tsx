'use client';

import { useEffect, useState, useRef } from 'react';
import { notFound, useParams } from 'next/navigation';
import { withAdminAuth } from '@/hoc/withAdminAuth';
import { getArticleBySlug } from '@/lib/database';
import ArticleEditor from '@/components/Articles/editor/ArticleEditor';
import type { ArticleType } from '@/types/article';
import ArticleLoading from '@/components/Articles/[slug]/ArticleLoading';

const EditArticlePage = () => {
  const [article, setArticle] = useState<ArticleType['articles'][0] | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const { slug } = useParams();
  const articleSlug = Array.isArray(slug) ? slug[0] : slug;
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!articleSlug || hasFetched.current) return;

    const fetchArticle = async () => {
      try {
        const foundArticle = await getArticleBySlug(articleSlug);

        if (foundArticle) {
          setArticle(foundArticle);
        }
      } catch (error) {
        console.error('Error fetching article:', error);
      } finally {
        setLoading(false);
        hasFetched.current = true;
      }
    };

    fetchArticle();
  }, [articleSlug]);

  if (loading) {
    return <ArticleLoading />;
  }

  if (!article) {
    return notFound();
  }

  return <ArticleEditor article={article} isNewArticle={false} />;
};

export default withAdminAuth(EditArticlePage);
