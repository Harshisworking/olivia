import { DOCKER_TEMPLATES } from "./config";

export class DockerfileBuilder {

    build(projectName: string, env: Record<string, string>, fileType: string): string {
        let dockerConfig = DOCKER_TEMPLATES[fileType].render({ projectName, env });

        return dockerConfig
    }
}