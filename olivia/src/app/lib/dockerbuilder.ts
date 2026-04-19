import { execFile } from "child_process";
import { promisify } from "util";
import path from "path";
import { generateEnvs } from "./systemEnvConf";

const execFilesync = promisify(execFile);

export class DockerManager {
    /**
     * Refactored to handle nested environment records:
     * projectEnvs: { "frontend": { "KEY": "VAL" }, "api-server": { "KEY": "VAL" } }
     */
    async build(
        projectName: string,
        repoPath: string,
        hasEnv: boolean,
        projectEnvs: Record<string, Record<string, string>>, // Changed to nested record
        forceBuild: boolean,
        hasDB: boolean
    ): Promise<void> {


        const { flattenedEnvs, systemEnvs } = generateEnvs(projectName, hasDB, projectEnvs)

        // 3. Merge: System variables override project variables
        const completeEnvs = { ...flattenedEnvs, ...systemEnvs };

        const baseArgs = ["compose", "-p", projectName, "-f", "docker-compose.yml"];
        const execOptions = {
            cwd: repoPath,
            env: { ...process.env, ...completeEnvs }
        };

        // 4. Execution Steps
        try {
            if (forceBuild) {
                console.log(`🛠️ [Olivia] Force-rebuilding ${projectName} (No Cache)...`);
                await execFilesync("docker", [...baseArgs, "build", "--no-cache"], execOptions);
            } else {
                await execFilesync("docker", [...baseArgs, "build"], execOptions);
            }

            console.log(`📡 [Olivia] Starting containers for ${projectName}...`);
            await execFilesync("docker", [...baseArgs, "up", "-d", "--remove-orphans"], execOptions);
        } catch (error) {
            console.error(`[Olivia] Deployment failed for ${projectName}:`, error);
            throw error;
        }
    }

    async copyToMaster(source: string, destination: string): Promise<void> {
        await execFilesync("docker", ["cp", source, `master-nginx:${destination}`]);
    }

    async executeInMaster(command: string): Promise<void> {
        await execFilesync("docker", ["exec", "master-nginx", "sh", "-c", command]);
    }
}