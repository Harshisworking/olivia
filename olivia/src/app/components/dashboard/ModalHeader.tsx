import React from 'react';
import { Settings, X } from 'lucide-react';

interface ModalHeaderProps {
    step: number;
    hasEnv: boolean;
    onClose: () => void;
}

export default function ModalHeader({ step, hasEnv, onClose }: ModalHeaderProps) {
    return (
        <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/[0.02]">
            <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Settings className="w-5 h-5 text-[#00d1ff]" />
                    Initialize New Project
                </h2>
                <p className="text-xs text-zinc-500 mt-1">Stage {step} of {hasEnv ? 2 : 1}</p>
            </div>
            <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
                <X className="w-5 h-5" />
            </button>
        </div>
    );
}