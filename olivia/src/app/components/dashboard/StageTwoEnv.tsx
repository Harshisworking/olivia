import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Server } from 'lucide-react';

interface StageTwoProps {
    requirements: string[]; // E.g., ['frontend', 'api-server']
    envData: Record<string, Record<string, string>>; // The new nested structure
    onAddEnv: (service: string, key: string, value: string) => void;
    onRemoveEnv: (service: string, key: string) => void;
}

export default function StageTwoEnv({ requirements, envData, onAddEnv, onRemoveEnv }: StageTwoProps) {
    // Default to the first requirement selected in Stage 1
    const [selectedService, setSelectedService] = useState(requirements[0] || "");
    const [envKey, setEnvKey] = useState("");
    const [envValue, setEnvValue] = useState("");

    // Failsafe: If requirements change, ensure selectedService is valid
    useEffect(() => {
        if (!requirements.includes(selectedService)) {
            setSelectedService(requirements[0] || "");
        }
    }, [requirements, selectedService]);

    const handleAdd = () => {
        if (selectedService && envKey.trim() && envValue.trim()) {
            onAddEnv(selectedService, envKey.trim(), envValue.trim());
            setEnvKey("");
            setEnvValue("");
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="bg-[#00d1ff]/10 border border-[#00d1ff]/20 p-3 rounded-lg">
                <p className="text-xs text-[#00d1ff]">Assign environment variables to specific containers.</p>
            </div>

            {/* Inputs Area */}
            <div className="flex gap-2">
                {/* Dropdown to select container/service */}
                <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-1/3 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00d1ff]/50"
                >
                    {requirements.map(req => (
                        <option key={req} value={req} className="bg-[#0f1523]">{req}</option>
                    ))}
                </select>

                <input
                    type="text" placeholder="KEY (e.g. PORT)" value={envKey} onChange={e => setEnvKey(e.target.value)}
                    className="w-1/3 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00d1ff]/50"
                />
                <input
                    type="text" placeholder="VALUE" value={envValue} onChange={e => setEnvValue(e.target.value)}
                    className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00d1ff]/50"
                />
                <button onClick={handleAdd} className="bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg px-3 flex items-center justify-center transition-colors">
                    <Plus className="w-5 h-5 text-white" />
                </button>
            </div>

            {/* Render Grouped Environment Variables */}
            <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2">
                {Object.keys(envData).length === 0 ? (
                    <p className="text-center text-xs text-zinc-500 py-4">No environment variables added yet.</p>
                ) : (
                    Object.entries(envData).map(([serviceName, variables]) => (
                        <div key={serviceName} className="space-y-2">
                            {/* Group Header */}
                            <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">
                                <Server className="w-3 h-3" /> {serviceName}
                            </div>

                            {/* Variables for this specific service */}
                            {Object.entries(variables).map(([key, value]) => (
                                <div key={key} className="flex justify-between items-center bg-black/20 border border-white/5 p-3 rounded-lg ml-2">
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-[#00d1ff]">{key}</span>
                                        <span className="text-sm text-zinc-300 font-mono mt-0.5">{value}</span>
                                    </div>
                                    <button onClick={() => onRemoveEnv(serviceName, key)} className="text-red-400 hover:text-red-300 p-2">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}