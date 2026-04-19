export default function ResourceUsage() {
    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col">
            <h3 className="text-sm font-bold tracking-wider text-white mb-6">PAAS RESOURCE USAGE</h3>

            <div className="flex justify-between items-end mb-6">
                <div className="flex-1">
                    <p className="text-xs text-zinc-400 mb-2">Global network bandwidth</p>
                    {/* Simple SVG representation of the wave chart */}
                    <svg className="w-full h-12" viewBox="0 0 200 40" preserveAspectRatio="none">
                        <path d="M0,20 Q10,5 20,20 T40,20 T60,10 T80,30 T100,15 T120,25 T140,5 T160,20 T180,10 T200,20 L200,40 L0,40 Z" fill="rgba(0, 209, 255, 0.1)" stroke="#00d1ff" strokeWidth="2" />
                    </svg>
                </div>

                <div className="ml-4 bg-white/5 border border-white/10 rounded-lg p-3 text-right">
                    <p className="text-xs text-zinc-400">Total PaaS Resource</p>
                    <p className="text-lg font-bold text-white">Load: 42%</p>
                </div>
            </div>

            <div className="mt-auto">
                <p className="text-xs font-semibold mb-3">Active Container Count: 25 / 100</p>
                <div className="flex gap-4 text-xs text-zinc-400 border-t border-white/10 pt-4">
                    <span className="flex items-center gap-1">"health-check-API" <div className="w-1.5 h-1.5 rounded-full bg-[#00ff88]"></div></span>
                    <span className="flex items-center gap-1">"deploy-API" <div className="w-1.5 h-1.5 rounded-full bg-[#00ff88]"></div></span>
                    <span className="flex items-center gap-1">"auth-API" <div className="w-1.5 h-1.5 rounded-full bg-[#00ff88]"></div></span>
                </div>
            </div>
        </div>
    );
}