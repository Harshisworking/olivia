"use client"

import type { NextPage } from 'next';
import { Hero } from './components/home/Hero';
import { DeploymentFlow } from './components/home/DeploymentFlow';
import heroBg from "./components/home/Gemini_Generated_Image_a5jgoma5jgoma5jg(1).jpeg"
import { useSession, signOut } from "next-auth/react";


const Home: NextPage = () => {
  const { data: session, status } = useSession();
  console.log(session)
  return (
    <div className="min-h-screen bg-[#222933] text-[#e2e8f0] font-sans selection:bg-sky-500/30">

      {/* Navbar */}
      <nav className="max-w-[1200px] mx-auto flex justify-between items-center py-8 px-5">
        <div className="font-extrabold text-sky-400 text-xl tracking-tight">
          OLIVIA <span className="text-white">PROJECT</span>
        </div>
        <div className="hidden md:flex gap-8">
          {['Overview', 'Features', 'Architecture'].map((item) => (
            <a key={item} href="#" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">
              {item}
            </a>
          ))}
          <a href="https://github.com" target="_blank" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">
            GitHub
          </a>
        </div>
      </nav>

      <main className="w-full flex flex-col justify-center items-center pb-20">
        {/* Hero Section - Now taking full width since Graphic is removed */}
        <div className="w-full bg-cover bg-center w-full" style={{ backgroundImage: `url('${heroBg.src}')` }}>
          <div className=' mx-auto p-10 max-w-[1200px]' >
            <Hero />
          </div>
        </div>

        {/* Deployment Flow - Centered below the Hero */}
        <div className="w-full bg-[#25313d]/50 border border-slate-800/50 p-8 backdrop-blur-sm">
          <DeploymentFlow />
        </div>
      </main>

      {/* Footer Simple */}
      <footer className="max-w-[1200px] mx-auto px-5 py-10 border-t border-slate-900 flex justify-between items-center text-xs text-slate-500">
        <p>© 2026 Olivia Project • Built on DragoUltra</p>
        <div className="flex gap-4">
          <span>Status: <span className="text-emerald-500">Online</span></span>
        </div>
      </footer>
    </div>
  );
};

export default Home;