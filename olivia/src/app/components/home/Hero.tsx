import React from 'react';
import { FeatureItem } from '../../types';
// Ensure the filename matches exactly (case sensitive)


const features: FeatureItem[] = [
    { title: 'Total Control', description: 'Full orchestration on your Ubuntu-based bare metal.' },
    { title: 'Containerized Efficiency', description: 'Leverages Docker for lightweight, scalable applications.' },
    { title: 'Zero Reliance', description: 'Complete independence from external cloud providers.' },
    { title: 'Streamlined Workflow', description: 'Push code and see it go live instantly.' },
];

export const Hero: React.FC = () => {
    // This is the logic that fixed your background visibility


    return (
        <section
            className="w-full min-h-[700px] flex items-center rounded-[40px] overflow-hidden relative bg-cover bg-center border border-white/5 shadow-2xl transition-all duration-500 hover:border-white/10 pr-1 bg-black/20 backdrop-blur-md"
        >
            {/* Content Overlay */}
            <div className="relative z-20 w-full px-10 md:px-24 py-20">
                <div className="max-w-3xl">

                    {/* Status Badge */}
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-[10px] font-black tracking-[0.2em] uppercase mb-10">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                        </span>
                        System Online: DragoUltra
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.9] mb-8 tracking-tighter uppercase">
                        OLIVIA <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600">PAAS</span>
                    </h1>

                    <p className="text-xl text-slate-400 mb-12 leading-relaxed max-w-lg font-medium">
                        The ultimate <span className="text-white">bare-metal</span> deployment engine.
                        Host your MERN stack with zero third-party dependency.
                    </p>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 mb-16">
                        {features.map((f, i) => (
                            <div key={i} className="group flex flex-col gap-1 border-l-2 border-slate-800 pl-5 hover:border-sky-500 transition-all duration-300">
                                <span className="text-white font-bold text-sm tracking-widest uppercase group-hover:text-sky-400 transition-colors">
                                    {f.title}
                                </span>
                                <span className="text-slate-500 text-xs leading-snug">
                                    {f.description}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-6">
                        <button className="px-12 py-5 bg-sky-500 hover:bg-sky-400 text-white font-black rounded-2xl transition-all duration-300 transform active:scale-95 shadow-[0_20px_40px_-15px_rgba(14,165,233,0.5)]">
                            GET STARTED
                        </button>
                        <button className="px-12 py-5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl font-black backdrop-blur-3xl transition-all active:scale-95">
                            DOCUMENTATION
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom blend gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f1a] via-transparent to-transparent z-10" />
        </section>
    );
};