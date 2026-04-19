"use client"
import React, { useState } from 'react';
import { AuthInput } from './AuthInput';
import { signIn } from 'next-auth/react';
import axios from "axios"
import { useRouter } from 'next/navigation';

export const AuthCard: React.FC = () => {
    const [mode, setMode] = useState<'signin' | 'signup'>('signin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    async function handleLoginSubmit(e: React.FormEvent) {
        e.preventDefault();

        // 1. Trigger the sign-in
        const result = await signIn('credentials', {
            redirect: false, // CRITICAL: Prevents the automatic jump to /api/auth/error
            email,
            password,
        });

        // 2. Handle the response manually
        if (result?.error) {
            // Now this will actually show up in your browser console!
            console.error("Login Failed:", result.error);

            // Suggestion: Set a state variable here to show a red message in your UI
            // setAuthError("Access Denied: Invalid Node Credentials");
        } else {
            console.log(result)
            console.log("Login Success! Initializing Dashboard...");

            // 3. Manually move the user to the home page
            router.push('/');
            router.refresh();
        }
    }

    async function handleSignUpSubmit(e: React.FormEvent) {
        e.preventDefault();
        const result = await axios.post("/SignUp", {
            email,
            password
        })

        if (!result.status) {
            return Response.json({
                error: "Error while sending data to backend"
            })
        }
    }

    return (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[40px] p-10 shadow-2xl flex flex-col items-center">
            <header className="text-center mb-8">
                <h1 className="text-3xl font-black text-sky-400 tracking-tighter">OLIVIA PROJECT</h1>
                <p className="text-[10px] text-slate-400 font-bold tracking-[0.3em] uppercase mt-1">Authentication Node</p>
            </header>

            {/* Mode Switcher */}
            <div className="flex bg-black/40 p-1.5 rounded-2xl w-full mb-8">
                <button
                    onClick={() => setMode('signin')}
                    className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${mode === 'signin' ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30' : 'text-slate-500 hover:text-white'}`}
                >
                    SIGN IN
                </button>
                <button
                    onClick={() => setMode('signup')}
                    className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${mode === 'signup' ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30' : 'text-slate-500 hover:text-white'}`}
                >
                    SIGN UP
                </button>
            </div>

            <p className="text-xs text-slate-300 font-medium mb-6 uppercase tracking-wider">
                {mode === 'signin' ? 'Sign in to your Olivia account' : 'Register a new account'}
            </p>

            {/* Inputs */}
            <form className="w-full space-y-4" onSubmit={mode === 'signin' ? handleLoginSubmit : handleSignUpSubmit}>
                <AuthInput
                    type="email"
                    placeholder="your.name@drago.ultra"
                    label="Email Address"
                    icon="@"
                    changing={setEmail}
                />
                <AuthInput
                    type="password"
                    placeholder="••••••••"
                    label="Password"
                    icon="🔒"
                    isPassword
                    changing={setPassword}
                />

                <div className="text-right">
                    <a href="#" className="text-[10px] text-slate-500 hover:text-sky-400 transition-colors underline underline-offset-4">Forgot Password?</a>
                </div>

                <button type='submit' className="w-full py-4 mt-4 bg-sky-500 hover:bg-sky-400 text-[#0b0f1a] font-black text-sm rounded-2xl transition-all shadow-lg shadow-sky-500/20 active:scale-95 uppercase tracking-widest">
                    Access PaaS
                </button>
            </form>

            <p className="mt-8 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                Don't have an account? <span className="text-sky-400 cursor-pointer hover:underline underline-offset-4">Create One</span>
            </p>
        </div>
    );
};