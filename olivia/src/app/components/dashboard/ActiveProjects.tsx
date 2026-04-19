"use client"
import { Layers, Box } from "lucide-react";
import { useSession } from "next-auth/react";

export default function ActiveProjects() {
    const { data: data, status } = useSession()
    const []

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-sm font-bold tracking-wider text-white mb-6">ACTIVE PROJECTS <span className="text-zinc-500 font-normal">(Showing 2 of 8)</span></h3>

            <div className="space-y-3">
                {/* Project 1 */}
                <div className="bg-black/20 border border-white/5 rounded-xl p-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-emerald-500/10 rounded-lg"><Layers className="text-emerald-400 w-6 h-6" /></div>
                        <div>
                            <h4 className="font-semibold text-sm">Project Aether</h4>
                            <p className="text-xs text-zinc-500">Stack: NextJS/TS</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="flex items-center justify-end gap-2 mb-1">
                            <span className="text-xs text-[#00ff88]">Active</span>
                            <div className="w-2 h-2 rounded-full bg-[#00ff88] shadow-[0_0_8px_#00ff88]"></div>
                        </div>
                        <p className="text-xs text-zinc-500">Last Deployment: 5m ago</p>
                    </div>
                </div>

                {/* Project 2 */}
                <div className="bg-black/20 border border-white/5 rounded-xl p-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-blue-500/10 rounded-lg"><Box className="text-[#00d1ff] w-6 h-6" /></div>
                        <div>
                            <h4 className="font-semibold text-sm">Project Helios</h4>
                            <p className="text-xs text-zinc-500">Stack: Docker/Compose</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="flex items-center justify-end gap-2 mb-1">
                            <span className="text-xs text-[#00d1ff]">Building...</span>
                            <div className="w-3 h-3 border-2 border-[#00d1ff] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <p className="text-xs text-zinc-500">Last Deployment: 15m ago</p>
                    </div>
                </div>
            </div>
        </div>
    );
}