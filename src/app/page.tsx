import MapComponent from "@/components/MapComponent";
import { Github } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950 font-sans text-slate-50 selection:bg-cyan-500/30">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="font-semibold tracking-tight text-lg">Deck.GL Demo</span>
          </div>

          <nav className="flex items-center gap-6 text-sm font-medium text-slate-300">
            <a href="https://deck.gl/" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Documentation</a>
            <a href="https://github.com/visgl/deck.gl" target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center gap-2">
              <Github className="h-4 w-4" />
              <span>GitHub</span>
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col pt-16">
        {/* Hero Section */}
        <section className="relative px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
              Interactive Geospatial Visualization
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              Experience the power of high-performance WebGL-powered data visualization using Deck.GL, react-map-gl, and MapLibre integrated into a modern Next.js application.
            </p>
          </div>
        </section>

        {/* Map Section */}
        <section className="flex-1 w-full max-w-7xl mx-auto px-6 pb-24 h-[600px] lg:h-[800px]">
          <div className="w-full h-full rounded-2xl overflow-hidden ring-1 ring-white/10 shadow-2xl shadow-cyan-500/10">
            <MapComponent />
          </div>
        </section>
      </main>
    </div>
  );
}
