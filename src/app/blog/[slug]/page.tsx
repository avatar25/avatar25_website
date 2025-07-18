import { getPostBySlug } from '@/lib/blog';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const { meta, content } = getPostBySlug(slug);
  return (
    <main className="mx-auto max-w-3xl py-16 px-6 pt-20" style={{ background: '#FDF6ED', minHeight: '100vh' }}>
      <h1 className="text-3xl font-bold mb-4" style={{ color: '#D9822B' }}>{meta.title}</h1>
      <p className="text-sm mb-8" style={{ color: '#D9822B' }}>{meta.date}</p>
      <article
        className="prose prose-lg leading-relaxed space-y-6"
        style={{
          color: '#3E3E3E',
          '--tw-prose-bullets': '#D9822B',
          '--tw-prose-counters': '#D9822B',
          '--tw-prose-headings': '#D9822B',
          '--tw-prose-links': '#D9822B',
        } as React.CSSProperties}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            a: (props) => <a {...props} style={{ color: '#D9822B' }} />,
            h1: (props) => <h1 {...props} style={{ color: '#D9822B' }} />,
            h2: (props) => <h2 {...props} style={{ color: '#D9822B' }} />,
            h3: (props) => <h3 {...props} style={{ color: '#D9822B' }} />,
            ul: (props) => <ul {...props} className="list-disc list-inside" />,
            ol: (props) => <ol {...props} className="list-decimal list-inside" />,
            li: (props) => <li {...props} className="my-1" />,
          }}
        >
          {content}
        </ReactMarkdown>
      </article>
    </main>
  );
}
