import { DOCKER_COMPOSE_TEMPLATES } from "./config"

export class ComposeManger {
    public build(projectName: string, env: Record<string, Record<string, string>>, requirements: string[], hasDB: boolean): string {
        console.log("Inside Compose manager: file started building")
        let composeConfig = ''
        requirements.forEach(requirement => {
            let envReq = env[requirement];

            if (envReq === undefined) envReq = {};
            composeConfig += `${DOCKER_COMPOSE_TEMPLATES[requirement].render({ env: envReq, projectName, hasDB })} \n`
            console.log(`${requirement}=== ${composeConfig}`)
        })
        return composeConfig;
    }
}