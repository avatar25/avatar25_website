import { getPostBySlug } from '@/lib/blog';
import ReactMarkdown from 'react-markdown';

interface PostPageProps {
  params: { slug: string };
}

export default function PostPage({ params }: PostPageProps) {
  const { meta, content } = getPostBySlug(params.slug);
  return (
    <main className="mx-auto max-w-3xl py-16 px-6">
      <h1 className="text-3xl font-bold mb-4">{meta.title}</h1>
      <p className="text-sm text-slate-400 mb-8">{meta.date}</p>
      <article className="prose prose-invert">
        <ReactMarkdown>{content}</ReactMarkdown>
      </article>
    </main>
  );
}
