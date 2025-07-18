'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-sm border-b border-slate-800/50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Navigation Links */}
          <div className="flex items-center space-x-8">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors ${
                pathname === '/' 
                  ? 'text-cyan-400' 
                  : 'text-slate-300 hover:text-cyan-400'
              }`}
            >
              Home
            </Link>
            <Link
              href="/blog"
              className={`text-sm font-medium transition-colors ${
                pathname.startsWith('/blog') 
                  ? 'text-cyan-400' 
                  : 'text-slate-300 hover:text-cyan-400'
              }`}
            >
              Blog
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 