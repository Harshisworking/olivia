import { DockerManager } from "./dockerbuilder";
import { NGINX_TEMPLATES } from "./config";
import fs from "fs";
import path from "path";

export class NginxManager {
    // HOST path (Olivia's local storage)
    private readonly localConfigDir = "/home/dragophynix/nginx-gateway/conf.d/projects";
    // CONTAINER path (Inside master-nginx)
    private readonly containerConfigPath = "/etc/nginx/conf.d/projects";

    constructor(
        private readonly docker: DockerManager
    ) { }

    async applyConfig(
        projectName: string,
        requirements: string[],
        env: Record<string, Record<string, string>>, // Nested record
        hasDB: boolean
    ): Promise<string> {
        const fileName = `${projectName}.conf`;
        const localPath = path.join(this.localConfigDir, fileName);
        const remotePath = path.join(this.containerConfigPath, fileName);

        this.ensureDirectoryExists();

        // 1. Flatten the environment for templates that expect a single Record<string, string>
        const flattenedEnv: Record<string, string> = {};
        Object.values(env).forEach(serviceMap => {
            Object.assign(flattenedEnv, serviceMap);
        });

        // 2. Render templates using both the flattened and raw versions
        let vhostConfig = "";
        requirements.forEach(requirement => {
            const template = NGINX_TEMPLATES[requirement];
            if (template) {
                // Ensure your template's render() accepts these 4 arguments
                vhostConfig += template.render({
                    env: flattenedEnv,
                    projectName,
                    hasDB
                }) + "\n";
            } else {
                console.warn(`[NginxManager] No template found for requirement: ${requirement}`);
            }
        });

        // 3. File System Operations & Docker Sync
        try {
            // Write to Olivia's host filesystem
            fs.writeFileSync(localPath, vhostConfig);
            console.log(`📝 Local config created: ${localPath}`);

            // Copy the file into the master-nginx container
            // This is the step that makes 'nginx -t' actually work
            await this.docker.copyToMaster(localPath, remotePath);

            await this.reloadOrRollback(localPath, remotePath);
            return localPath;
        } catch (error) {
            const msg = error instanceof Error ? error.message : String(error);
            console.error("❌ Nginx applyConfig failed:", msg);
            throw new Error(`Nginx Config Error: ${msg}`);
        }
    }

    private ensureDirectoryExists(): void {
        if (!fs.existsSync(this.localConfigDir)) {
            fs.mkdirSync(this.localConfigDir, { recursive: true });
        }
    }

    private async reloadOrRollback(localPath: string, remotePath: string): Promise<void> {
        try {
            console.log("[NginxManager] Validating config in container...");
            await this.docker.executeInMaster("nginx -t");

            console.log("[NginxManager] Reloading master-nginx...");
            await this.docker.executeInMaster("nginx -s reload");
            console.log("✅ Nginx reloaded successfully.");
        } catch (error) {
            console.error("[NginxManager] Validation failed! Rolling back files...");

            // Cleanup local file
            if (fs.existsSync(localPath)) fs.unlinkSync(localPath);

            // Cleanup container file
            try {
                await this.docker.executeInMaster(`rm ${remotePath}`);
                await this.docker.executeInMaster("nginx -s reload");
            } catch (rmError) {
                console.error("[NginxManager] Critical: Failed to cleanup remote config.");
            }

            throw error;
        }
    }
}