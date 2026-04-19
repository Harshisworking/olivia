import React from 'react';
import { DeploymentStep } from '../../types';

const steps: DeploymentStep[] = [
    { label: 'Code Push', status: 'completed' },
    { label: 'Olivia Build', status: 'completed' },
    { label: 'Container Launch', status: 'active', subtext: 'on DragoUltra' },
];

export const DeploymentFlow: React.FC = () => {
    return (
        <div className="flow-container">
            <h3>READY TO DEPLOY?</h3>
            <div className="steps">
                {steps.map((step, i) => (
                    <React.Fragment key={i}>
                        <div className={`step-card ${step.status}`}>
                            {step.label}
                            {step.subtext && <span className="sub">{step.subtext}</span>}
                        </div>
                        {i < steps.length - 1 && <span className="arrow">→</span>}
                    </React.Fragment>
                ))}
            </div>

            <style jsx>{`
        .flow-container { margin-top: 4rem; padding-bottom: 4rem; }
        h3 { font-size: 1.2rem; color: #fff; margin-bottom: 1.5rem; letter-spacing: 1px; }
        .steps { display: flex; align-items: center; gap: 1rem; }
        .step-card { background: #1e293b; border: 1px solid #334155; padding: 12px 24px; border-radius: 8px; color: #94a3b8; position: relative; }
        .step-card.active { border-color: #10b981; color: #fff; }
        .sub { display: block; font-size: 0.7rem; color: #10b981; margin-top: 4px; }
        .arrow { color: #38bdf8; font-weight: bold; }
      `}</style>
        </div>
    );
};