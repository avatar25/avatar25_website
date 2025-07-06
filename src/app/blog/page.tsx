import Link from 'next/link';
import { getSortedPosts } from '@/lib/blog';

export const metadata = {
  title: 'Blog',
};

export default function BlogPage() {
  const posts = getSortedPosts();
  return (
    <main className="mx-auto max-w-3xl py-16 px-6 pt-20">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      <ul className="space-y-4">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={`/blog/${post.slug}`} className="text-cyan-400 hover:underline">
              {post.title}
            </Link>
            <span className="block text-sm text-slate-400">{post.date}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}
