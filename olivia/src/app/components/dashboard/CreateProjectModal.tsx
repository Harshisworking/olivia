"use client";
import React, { useState } from 'react';
import ModalHeader from './ModalHeader';
import StageOneForm from './StageOneForm';
import StageTwoEnv from './StageTwoEnv';
import ModalFooter from './ModalFooter';
import axios from "axios"

// 1. UPDATED INTERFACE: env is now a Record of Records
export interface ProjectFormData {
    url: string;
    requirements: string[];
    hasEnv: boolean;
    env: Record<string, Record<string, string>>;
    forceBuild: boolean;
    autoDockerizationReq: boolean;
}

const INITIAL_STATE: ProjectFormData = {
    url: "",
    requirements: [],
    hasEnv: false,
    env: {},
    forceBuild: true,
    autoDockerizationReq: true
};

export default function CreateProjectModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<ProjectFormData>(INITIAL_STATE);

    if (!isOpen) return null;

    const updateForm = (updates: Partial<ProjectFormData>) => {
        setFormData(prev => ({ ...prev, ...updates }));
    };

    // 2. UPDATED: Now takes a 'service' argument
    const handleAddEnv = (service: string, key: string, value: string) => {
        setFormData(prev => {
            const currentServiceEnv = prev.env[service] || {};
            return {
                ...prev,
                env: {
                    ...prev.env,
                    [service]: { ...currentServiceEnv, [key]: value }
                }
            };
        });
    };

    // 3. UPDATED: Now takes a 'service' argument to delete from the specific group
    const handleRemoveEnv = (service: string, keyToRemove: string) => {
        setFormData(prev => {
            const currentServiceEnv = { ...prev.env[service] };
            delete currentServiceEnv[keyToRemove];

            const newEnv = { ...prev.env };

            // If that service has no more env vars, delete the service key entirely
            if (Object.keys(currentServiceEnv).length === 0) {
                delete newEnv[service];
            } else {
                newEnv[service] = currentServiceEnv;
            }

            return { ...prev, env: newEnv };
        });
    };

    const submitDeployment = async () => {
        console.log("Sending to backend:", formData);
        const result = await axios.post("http://localhost:3000/admin/url-hosting", formData)
        onClose();
        setTimeout(() => {
            setStep(1);
            setFormData(INITIAL_STATE);
        }, 300);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-[#0f1523] border border-white/10 rounded-2xl w-full max-w-xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)]">

                <ModalHeader step={step} hasEnv={formData.hasEnv} onClose={onClose} />

                {step === 1 ? (
                    <StageOneForm formData={formData} updateForm={updateForm} />
                ) : (
                    <StageTwoEnv
                        requirements={formData.requirements} // Passed so we know which services exist
                        envData={formData.env}
                        onAddEnv={handleAddEnv}
                        onRemoveEnv={handleRemoveEnv}
                    />
                )}

                <ModalFooter
                    step={step}
                    hasEnv={formData.hasEnv}
                    onClose={onClose}
                    onBack={() => setStep(1)}
                    onNext={() => {
                        if (!formData.url) return alert("Please enter a repository URL");
                        if (formData.requirements.length === 0) return alert("Please select at least one requirement.");
                        setStep(2);
                    }}
                    onSubmit={submitDeployment}
                />

            </div>
        </div>
    );
}