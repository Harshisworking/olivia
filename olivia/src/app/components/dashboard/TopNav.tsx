"use client";

import React, { useState } from 'react';
import { Search, User } from "lucide-react";
import CreateProjectModal from './CreateProjectModal';
import { useSession } from 'next-auth/react';

export default function TopNav() {
    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value;
        console.log("Searching registry for:", query);
    };
    const { data: session, status } = useSession()

    console.log(session)

    const [isModalOpen, setIsModalOpen] = useState(false);

    const initializeDeployment = () => {
        console.log("Initializing new PaaS container...");
        setIsModalOpen(true)
    };

    return (
        <>
            <header className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-4 shadow-sm backdrop-blur-md">

                {/* Search Bar */}
                <div className="flex-1 max-w-xl relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                        type="text"
                        placeholder="Search Projects or Nodes..."
                        onChange={handleSearch}
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 pl-11 pr-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#00d1ff]/50 focus:ring-1 focus:ring-[#00d1ff]/50 transition-all"
                    />
                </div>

                {/* User Actions */}
                <div className="flex items-center gap-6">

                    {/* Profile Info */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/5">
                            <User className="w-5 h-5 text-zinc-300" />
                        </div>
                        <div className="hidden md:block text-right">
                            <p className="text-xs text-zinc-400">Welcome,</p>
                            <p className="text-sm font-semibold text-white">harsh@drago.ultra</p>
                        </div>
                    </div>

                    {/* Primary Action Button */}
                    <button
                        onClick={initializeDeployment}
                        className="bg-[#00d1ff] text-black font-bold text-sm px-6 py-2.5 rounded-xl shadow-[0_0_15px_rgba(0,209,255,0.4)] hover:shadow-[0_0_25px_rgba(0,209,255,0.6)] hover:scale-[1.02] transition-all"
                    >
                        CREATE PROJECT
                    </button>
                </div>
            </header>
            <CreateProjectModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
}