"use client";

import React from 'react';
import { AuthCard } from '../components/auth/AuthCard';
import herobg from "../components/home/Gemini_Generated_Image_a5jgoma5jgoma5jg(1).jpeg";

const AuthPage: React.FC = () => {
    return (
        <main
            className="min-h-screen w-full flex items-center justify-center bg-cover bg-center p-6 relative overflow-hidden"
            style={{ backgroundImage: `url('${herobg.src}')` }}
        >
            {/* Dark Overlay to make the glass pop */}
            <div className="absolute inset-0 bg-[#0b0f1a]/60 backdrop-blur-[2px]" />

            <div className="relative z-10 w-full max-w-md">
                <AuthCard />
            </div>

            <footer className="absolute bottom-6 w-full text-center text-slate-500 text-xs tracking-widest">
                © 2026 OLIVIA PROJECT
            </footer>
        </main>
    );
};

export default AuthPage;