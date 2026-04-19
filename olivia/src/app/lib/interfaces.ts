export interface coloneStrategy {
    clone(url: string): Promise<string>
}

export interface buildStrategy {
    build(url: string, hasEnv: boolean, projectEnvs: Record<string, Record<string, string>>, requirments: string[], forceBuild: boolean, autoDockerizationReq: boolean): Promise<void>;
}
