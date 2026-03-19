import { DockerManager } from "./dockerbuilder";
import { NGINX_TEMPLATES } from "./config";
import fs from "fs"
import path from "path";

export class NginxManager {
    constructor(
        private docker: DockerManager
    ) { }

    async applyConfig(projectName: string, requirments: string[], repoPath: string): Promise<string> {
        const remotePath = `/etc/nginx/conf.d/projects/${projectName}.conf`
        let vhostConfig = ""

        requirments.forEach(requirement => {
            if (NGINX_TEMPLATES[requirement]) {
                vhostConfig += NGINX_TEMPLATES[requirement](projectName)
            }
        })

        fs.writeFileSync(path.join(repoPath, "vhost.conf"), vhostConfig);

        await this.docker.copyToMaster(path.join(repoPath, "vhost.conf"), remotePath);
        await this.reloadOrRollback(remotePath);

        return remotePath;
    }

    private async reloadOrRollback(remotePath: string): Promise<void> {
        try {
            console.log("[NginxManager] Validating and Reloading...");
            await this.docker.executeInMaster("nginx -t");
            await this.docker.executeInMaster("nginx -s reload");
        } catch (error) {
            console.error("[NginxManager] Validation failed! Rolling back...");
            await this.docker.executeInMaster(`rm ${remotePath}`);
            await this.docker.executeInMaster("nginx -s reload");
            throw error;
        }
    }
}