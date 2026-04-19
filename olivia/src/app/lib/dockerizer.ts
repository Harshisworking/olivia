import { DockerfileBuilder } from "./DfileBuilder";
import path from "path"
import fs from "fs"
import { ComposeManger } from "./ComposeManager";

export class Dockerizer {
    private DManager = new DockerfileBuilder();
    private Composer = new ComposeManger();

    public DockerFileBuild(projectName: string, env: Record<string, Record<string, string>>, requirements: string[]): void {
        const basePath = `/home/dragophynix/Documents/Projects7shines/SecondShine/olivia/deployments/${projectName}`;

        requirements.forEach(service => {
            if (["frontend", "api-server", "ws-server"].includes(service)) {
                // Map api-server to backend folder if that's your naming convention
                const folderName = service === "api-server" ? "backend" : service;
                const serviceDir = path.join(basePath, folderName);
                const writePath = path.join(serviceDir, 'Dockerfile');

                const serviceEnv = env[service] || {};
                const dockerConfig = this.DManager.build(projectName, serviceEnv, service);

                try {
                    // FIX: Ensure the folder exists before writing the file
                    if (!fs.existsSync(serviceDir)) {
                        fs.mkdirSync(serviceDir, { recursive: true });
                    }
                    fs.writeFileSync(writePath, dockerConfig);
                    console.log(`Successfully updated: ${writePath}`);
                } catch (err) {
                    console.error(`Failed to write to ${writePath}:`, err);
                }
            }
        });
    }

    public ComposeFileBuild(
        projectName: string,
        env: Record<string, Record<string, string>>,
        requirements: string[],
        hasDB: boolean
    ): void {
        const basePath = `/home/dragophynix/Documents/Projects7shines/SecondShine/olivia/deployments/${projectName}`;
        const writePath = path.join(basePath, 'docker-compose.yml');

        const effectiveRequirements = [...requirements];
        if (hasDB && !effectiveRequirements.includes("db-pg")) {
            effectiveRequirements.push("db-pg");
        }

        const rawServices = this.Composer.build(projectName, env, effectiveRequirements, hasDB);

        // CRITICAL FIX: Indent every line of rawServices by 2 spaces
        // This moves 'frontend:', 'api-server:', etc. under the 'services:' key
        const indentedServices = rawServices
            .split('\n')
            .map(line => line.trim() === '' ? '' : `  ${line}`)
            .join('\n');

        const headerConfig = "version: '3.8'\n\nservices:";

        const networkAndVolumeConfig = `
networks:
  internal-bridge:
    driver: bridge
  web-gateway:
    external: true

${hasDB ? "volumes:\n  db_data: {}" : ""}`;

        // Combine sections with clean spacing
        const composeConfig = [
            headerConfig,
            indentedServices,
            networkAndVolumeConfig
        ].join('\n');

        try {
            if (!fs.existsSync(basePath)) {
                fs.mkdirSync(basePath, { recursive: true });
            }
            // Use trim() to avoid leading/trailing whitespace issues
            fs.writeFileSync(writePath, composeConfig.trim());
            console.log(`Successfully updated Docker Compose: ${writePath}`);
        } catch (err) {
            console.error(`Failed to write to ${writePath}:`, err);
        }
    }
}