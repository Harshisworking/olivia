import { buildStrategy } from "./interfaces";
import { DockerManager } from "./dockerbuilder";
import { NginxManager } from "./NginxManager";
import { GitCloner } from "./cloners";
import { Dockerizer } from "./dockerizer";

export class NpmBuilder implements buildStrategy {
    constructor(
        private docker: DockerManager,
        private nginx: NginxManager,
        private cloner: GitCloner,
        private dockerizer: Dockerizer
    ) { }

    async build(
        url: string,
        hasEnv: boolean,
        projectEnvs: Record<string, Record<string, string>>,
        requirments: string[],
        forceBuild: boolean,
        autoDockerizationReq: boolean
    ) {
        const projectName = url.split('/').pop()?.replace('.git', '') || "";
        const repoPath = await this.cloner.clone(url, projectName);
        const hasDB = requirments.includes("db-pg");

        // Ensure system variables are injected even if projectEnvs is {}
        this.injectSystemVariables(projectName, projectEnvs, requirments, hasDB);

        if (autoDockerizationReq) {
            this.dockerizer.DockerFileBuild(projectName, projectEnvs, requirments);
            this.dockerizer.ComposeFileBuild(projectName, projectEnvs, requirments, hasDB);
        }

        await this.docker.build(projectName, repoPath, hasEnv, projectEnvs, forceBuild, hasDB);
        await this.nginx.applyConfig(projectName, requirments, projectEnvs, hasDB);
    }

    private injectSystemVariables(
        projectName: string,
        projectEnvs: Record<string, Record<string, string>>,
        requirements: string[],
        hasDB: boolean
    ): void {
        // Initialize required keys if missing
        requirements.forEach(req => {
            if (!projectEnvs[req]) {
                projectEnvs[req] = {};
            }
        });

        // 1. Frontend Logic
        if (projectEnvs["frontend"]) {
            projectEnvs["frontend"] = {
                ...projectEnvs["frontend"],
                REACT_APP_API_URL: `http://dragophynix.local/${projectName}-api`,
                VITE_API_URL: `http://dragophynix.local/${projectName}-api`
            };
        }

        // 2. WS Logic
        if (projectEnvs["ws-server"]) {
            projectEnvs["ws-server"].NEXT_PUBLIC_WS_URL = `ws://dragophynix.local/${projectName}-ws/`;
        }

        // 3. Database & API Logic
        if (hasDB) {
            // Ensure the db-pg key exists
            if (!projectEnvs["db-pg"]) {
                projectEnvs["db-pg"] = {};
            }

            const dbPart = projectEnvs["db-pg"];

            // Set default values if not provided by user
            dbPart.POSTGRES_USER = dbPart.POSTGRES_USER || "myuser";
            dbPart.POSTGRES_PASSWORD = dbPart.POSTGRES_PASSWORD || "example_password";
            dbPart.POSTGRES_DB = dbPart.POSTGRES_DB || "mydatabase";

            const dbUrl = `postgres://${dbPart.POSTGRES_USER}:${dbPart.POSTGRES_PASSWORD}@db:5432/${dbPart.POSTGRES_DB}`;

            // Inject DATABASE_URL into api-server for the backend connection
            if (projectEnvs["api-server"]) {
                projectEnvs["api-server"].DATABASE_URL = dbUrl;
            }


        }

        // 4. Global PROJECT_NAME injection
        Object.keys(projectEnvs).forEach(key => {
            projectEnvs[key].PROJECT_NAME = projectName;
        });
    }
}