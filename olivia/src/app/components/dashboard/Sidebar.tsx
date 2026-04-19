import React from 'react';
import { LayoutDashboard, FolderKanban, Activity, Server, Settings } from "lucide-react";
import Link from 'next/link';

const menuLinks = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard", active: true },
    { name: "Projects", icon: FolderKanban, href: "/dashboard/projects", active: false },
    { name: "Status", icon: Activity, href: "/dashboard/status", active: false },
    { name: "Nodes", icon: Server, href: "/dashboard/nodes", active: false },
];

const systemLinks = [
    { name: "Settings", icon: Settings, href: "/dashboard/settings", active: false },
];

export default function Sidebar() {
    return (
        <aside className="w-64 border-r border-white/10 flex flex-col bg-black/20">
            {/* Brand Header */}
            <div className="h-24 flex items-center px-8 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full border-2 border-[#00d1ff] flex items-center justify-center shadow-[0_0_10px_rgba(0,209,255,0.3)]">
                        <div className="w-3 h-3 bg-[#00d1ff] rounded-full"></div>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white tracking-wide">Olivia</h1>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Olivia Project</p>
                    </div>
                </div>
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 px-4 py-8 space-y-2">
                {menuLinks.map((link) => (
                    <Link key={link.name} href={link.href}>
                        <div className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${link.active
                                ? "bg-white/5 text-[#00d1ff] border-l-2 border-[#00d1ff] shadow-[inset_4px_0_10px_rgba(0,209,255,0.1)]"
                                : "text-zinc-400 hover:text-white hover:bg-white/5 border-l-2 border-transparent"
                            }`}>
                            <link.icon className="w-5 h-5" />
                            <span className="font-medium text-sm">{link.name}</span>
                        </div>
                    </Link>
                ))}
            </nav>

            {/* System Navigation */}
            <div className="p-4 border-t border-white/5">
                {systemLinks.map((link) => (
                    <Link key={link.name} href={link.href}>
                        <div className="flex items-center gap-4 px-4 py-3 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-all">
                            <link.icon className="w-5 h-5" />
                            <span className="font-medium text-sm">{link.name}</span>
                        </div>
                    </Link>
                ))}
            </div>
        </aside>
    );
}