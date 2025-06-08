import ParticleCanvas from "@/components/TVStatic";

export default function Home() {
  return (
    <>
      <ParticleCanvas />
      <main className="relative flex min-h-screen flex-col items-center justify-center text-center px-6">
        <h1 className="text-5xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-yellow-300 animate-pulse">
          Hi, I’m Shiben 👋
        </h1>
        <p className="mt-6 max-w-xl text-lg md:text-xl text-slate-200/90">
          Infosec engineer · Meditation nerd · Building cool stuff one vibe at a time.
        </p>
        <div className="mt-6 flex gap-6 justify-center">
          <a
            href="https://www.linkedin.com/in/shibenc/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-200/80 hover:text-cyan-400 transition-colors text-2xl"
            aria-label="LinkedIn"
          >
            <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.27c-.97 0-1.75-.79-1.75-1.76s.78-1.76 1.75-1.76 1.75.79 1.75 1.76-.78 1.76-1.75 1.76zm15.5 11.27h-3v-5.6c0-1.34-.03-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7h-3v-10h2.88v1.36h.04c.4-.76 1.38-1.56 2.84-1.56 3.04 0 3.6 2 3.6 4.59v5.61z"/>
            </svg>
          </a>
          <a
            href="https://www.instagram.com/supernova_shiben25"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-200/80 hover:text-fuchsia-400 transition-colors text-2xl"
            aria-label="Instagram"
          >
            <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.241 1.308 3.608.058 1.266.069 1.646.069 4.85s-.011 3.584-.069 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.241 1.246-3.608 1.308-1.266.058-1.646.069-4.85.069s-3.584-.011-4.85-.069c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.241-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608C4.515 2.497 5.782 2.225 7.148 2.163 8.414 2.105 8.794 2.163 12 2.163zm0-2.163C8.741 0 8.332.013 7.052.072 5.775.13 4.602.402 3.635 1.37 2.668 2.338 2.396 3.511 2.338 4.788 2.279 6.068 2.267 6.477 2.267 12s.012 5.932.071 7.212c.058 1.277.33 2.45 1.297 3.418.967.967 2.14 1.239 3.417 1.297 1.28.059 1.689.071 7.212.071s5.932-.012 7.212-.071c1.277-.058 2.45-.33 3.417-1.297.967-.968 1.239-2.141 1.297-3.418.059-1.28.071-1.689.071-7.212s-.012-5.932-.071-7.212c-.058-1.277-.33-2.45-1.297-3.417C19.45.402 18.277.13 17 .072 15.72.013 15.311 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
            </svg>
          </a>
        </div>
      </main>
    </>
  );
}
