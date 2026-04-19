import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface ModalFooterProps {
    step: number;
    hasEnv: boolean;
    onClose: () => void;
    onBack: () => void;
    onNext: () => void;
    onSubmit: () => void;
}

export default function ModalFooter({ step, hasEnv, onClose, onBack, onNext, onSubmit }: ModalFooterProps) {
    return (
        <div className="p-6 border-t border-white/10 bg-black/20 flex justify-between items-center">
            {step === 1 ? (
                <button onClick={onClose} className="text-sm text-zinc-400 hover:text-white px-4 py-2">Cancel</button>
            ) : (
                <button onClick={onBack} className="text-sm text-zinc-400 hover:text-white flex items-center gap-1 px-4 py-2">
                    <ArrowLeft className="w-4 h-4" /> Back
                </button>
            )}

            <button
                onClick={step === 1 && hasEnv ? onNext : onSubmit}
                className="bg-[#00d1ff] text-black font-bold text-sm px-6 py-2.5 rounded-xl shadow-[0_0_15px_rgba(0,209,255,0.4)] hover:shadow-[0_0_25px_rgba(0,209,255,0.6)] transition-all flex items-center gap-2"
            >
                {step === 1 && hasEnv ? (
                    <>Next <ArrowRight className="w-4 h-4" /></>
                ) : (
                    'DEPLOY NODE'
                )}
            </button>
        </div>
    );
}