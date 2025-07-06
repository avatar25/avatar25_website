import { getPostBySlug } from '@/lib/blog';
import ReactMarkdown from 'react-markdown';

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const { meta, content } = getPostBySlug(slug);
  return (
    <main className="mx-auto max-w-3xl py-16 px-6 pt-20">
      <h1 className="text-3xl font-bold mb-4">{meta.title}</h1>
      <p className="text-sm text-slate-400 mb-8">{meta.date}</p>
      <article className="prose prose-invert">
        <ReactMarkdown>{content}</ReactMarkdown>
      </article>
    </main>
  );
}
