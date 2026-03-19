import { execFile } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import path from "path";

const execFileAsync = promisify(execFile);

export class GitCloner {
    constructor(private readonly baseTempDir: string) { }

    async clone(repoUrl: string, projectId: string): Promise<string> {
        const projectPath = path.join(this.baseTempDir, projectId);

        try {
            await fs.rm(projectPath, { recursive: true, force: true });
            await fs.mkdir(projectPath, { recursive: true });

            console.log(`[GitCloner] Cloning ${repoUrl} into ${projectPath}...`);
            await execFileAsync("git", ["clone", "--depth", "1", repoUrl, projectPath]);

            return projectPath;
        } catch (error) {
            console.error(`[GitCloner] Failed to clone ${repoUrl}:`, error);
            throw new Error(`Cloning failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    async cleanup(projectId: string): Promise<void> {
        const projectPath = path.join(this.baseTempDir, projectId);
        await fs.rm(projectPath, { recursive: true, force: true });
        console.log(`[GitCloner] Cleaned up ${projectPath}`);
    }
}