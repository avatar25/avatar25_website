import ParticleCanvas from "@/components/ParticleCanvas";

export default function Home() {
  return (
    <>
      <ParticleCanvas />
      <main className="relative flex min-h-screen flex-col items-center justify-center text-center px-6">
        <h1 className="text-5xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-yellow-300 animate-pulse">
          Hi, I’m Shiben 👋
        </h1>
        <p className="mt-6 max-w-xl text-lg md:text-xl text-slate-200/90">
          Info-sec engineer · Meditation nerd · Building cool stuff one vibe at a time.
        </p>
      </main>
    </>
  );
}