import { buildStrategy } from "./interfaces";
import { execFile } from "child_process";
import { promisify } from "util";
import { DockerManager } from "./dockerbuilder";
import { NginxManager } from "./NginxManager";
import { GitCloner } from "./cloners";

const execFilesync = promisify(execFile);

export class NpmBuilder implements buildStrategy {
    constructor(
        private docker: DockerManager,
        private nginx: NginxManager,
        private cloner: GitCloner
    ) { }

    async build(url: string, hasEnv: boolean, projectEnvs: Record<string, string>, requirments: string[]) {

        const projectName = url.split('/').pop()?.replace('.git', '') || "";
        const repoPath = await this.cloner.clone(url, projectName);

        await this.docker.build(projectName, repoPath, hasEnv, projectEnvs);

        await this.nginx.applyConfig(projectName, requirments, repoPath);
    }
}
