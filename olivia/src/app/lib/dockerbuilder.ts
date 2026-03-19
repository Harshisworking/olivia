import { execFile } from "child_process";
import { promisify } from "util";
const execFilesync = promisify(execFile);

export class DockerManager {
    async build(projectName: string, repoPath: string, hasEnv: boolean, projectEnvs: Record<string, string>): Promise<void> {

        const systemEnvs = {
            PROJECT_NAME: projectName,
            NEXT_PUBLIC_API_URL: `http://dragophynix.local/${projectName}-api`,
            NEXT_PUBLIC_WS_URL: `ws://dragophynix.local/${projectName}-ws/`
        };

        const completeEnvs = hasEnv ? { ...systemEnvs, ...projectEnvs } : systemEnvs;

        const args = [
            "compose",
            "-p", projectName,
            "-f", "docker-compose.yml",
            "up", "-d", "--build",
            "--remove-orphans"
        ];

        console.log(`Building containers for ${projectName}...`);
        await execFilesync("docker", args, {
            cwd: repoPath,
            env: {
                ...process.env,
                ...completeEnvs
            }
        });
    }
    async copyToMaster(source: string, destination: string): Promise<void> {
        await execFilesync("docker", ["cp", source, `master-nginx:${destination}`]);
    }

    async executeInMaster(command: string): Promise<void> {
        await execFilesync("docker", ["exec", "master-nginx", "sh", "-c", command]);
    }
}