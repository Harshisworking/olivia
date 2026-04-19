import React from 'react';
import { GitBranch } from 'lucide-react';

// UPDATED: The 'env' property now perfectly matches the parent component
export interface ProjectFormData {
    url: string;
    requirements: string[];
    hasEnv: boolean;
    env: Record<string, Record<string, string>>; // <-- THIS IS THE FIX
    forceBuild: boolean;
    autoDockerizationReq: boolean;
}

interface StageOneProps {
    formData: ProjectFormData;
    updateForm: (updates: Partial<ProjectFormData>) => void;
}

export default function StageOneForm({ formData, updateForm }: StageOneProps) {

    const toggleRequirement = (req: string) => {
        const newReqs = formData.requirements.includes(req)
            ? formData.requirements.filter(r => r !== req)
            : [...formData.requirements, req];
        updateForm({ requirements: newReqs });
    };

    return (
        <div className="p-6 space-y-6">
            {/* Repo Input */}
            <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider">Repository URL</label>
                <div className="relative">
                    <GitBranch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                        type="text"
                        placeholder="https://github.com/username/repo.git"
                        value={formData.url}
                        onChange={(e) => updateForm({ url: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[#00d1ff]/50 focus:ring-1 focus:ring-[#00d1ff]/50 transition-all"
                    />
                </div>
            </div>

            {/* Requirements Selection */}
            <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider">System Requirements</label>
                <div className="flex flex-wrap gap-2">
                    {['frontend', 'api-server', 'db-pg'].map(req => (
                        <button
                            key={req}
                            onClick={() => toggleRequirement(req)}
                            className={`px-4 py-2 rounded-lg text-xs font-medium border transition-all ${formData.requirements.includes(req)
                                    ? 'bg-[#00d1ff]/10 border-[#00d1ff] text-[#00d1ff]'
                                    : 'bg-white/5 border-white/10 text-zinc-400 hover:border-white/30'
                                }`}
                        >
                            {req}
                        </button>
                    ))}
                </div>
            </div>

            {/* Toggles */}
            <div className="space-y-3 pt-2">
                <label className="flex items-center justify-between cursor-pointer p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04]">
                    <span className="text-sm text-zinc-300">Force Rebuild</span>
                    <input type="checkbox" checked={formData.forceBuild} onChange={(e) => updateForm({ forceBuild: e.target.checked })} className="accent-[#00d1ff] w-4 h-4" />
                </label>
                <label className="flex items-center justify-between cursor-pointer p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04]">
                    <span className="text-sm text-zinc-300">Auto Dockerization</span>
                    <input type="checkbox" checked={formData.autoDockerizationReq} onChange={(e) => updateForm({ autoDockerizationReq: e.target.checked })} className="accent-[#00d1ff] w-4 h-4" />
                </label>
                <label className="flex items-center justify-between cursor-pointer p-3 rounded-xl border border-[#00d1ff]/30 bg-[#00d1ff]/5">
                    <span className="text-sm font-medium text-white">Project requires Environment Variables</span>
                    <input type="checkbox" checked={formData.hasEnv} onChange={(e) => updateForm({ hasEnv: e.target.checked })} className="accent-[#00d1ff] w-4 h-4" />
                </label>
            </div>
        </div>
    );
}