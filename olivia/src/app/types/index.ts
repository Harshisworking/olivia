export interface FeatureItem {
    title: string;
    description: string;
}

export type StepStatus = 'idle' | 'completed' | 'active';

export interface DeploymentStep {
    label: string;
    status: StepStatus;
    subtext?: string;
}