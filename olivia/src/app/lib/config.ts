export interface TemplateContext {
    projectName: string;
    env: Record<string, string>;
    hasDB?: boolean;
}

abstract class BaseTemplate {
    /**
     * Formats environment variables for Docker Compose 'environment' block (List format)
     */
    protected formatEnvAsList(env: Record<string, string>): string {
        return Object.entries(env)
            .map(([key, value]) => `      - ${key}=${value}`)
            .join('\n');
    }

    /**
     * Formats environment variables for Docker Compose 'build.args' block (Mapping format)
     */
    protected formatEnvAsArgs(env: Record<string, string>): string {
        return Object.entries(env)
            .map(([key, value]) => `        ${key}: "${value}"`)
            .join('\n');
    }

    /**
     * Formats environment variables for Dockerfile (ARG/ENV format)
     */
    protected formatDockerEnv(env: Record<string, string>): string {
        return Object.keys(env)
            .map(key => `ARG ${key}\nENV ${key}=$${key}`)
            .join('\n');
    }

    abstract render(ctx: TemplateContext): string;
}

/* --- Nginx Templates --- */
class NginxFrontend extends BaseTemplate {
    render({ projectName }: TemplateContext): string {
        return `
location /${projectName}/ {
    resolver 127.0.0.11 valid=10s;
    set $target http://${projectName}-frontend:3000;
    proxy_pass $target;
    proxy_set_header Host $host;
}`;
    }
}

class NginxApi extends BaseTemplate {
    render({ projectName }: TemplateContext): string {
        return `
location /${projectName}-api/ {
    resolver 127.0.0.11 valid=10s;
    set $target http://${projectName}-api-server:5000;
    rewrite ^/${projectName}-api/(.*) /$1 break;
    proxy_pass $target;
    proxy_set_header Host $host;
}`;
    }
}

/* --- Dockerfile Templates --- */
class DockerFrontend extends BaseTemplate {
    render({ env }: TemplateContext): string {
        return `
FROM node:20-alpine
WORKDIR /app
${this.formatDockerEnv(env)}
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]`.trim();
    }
}

class DockerBackend extends BaseTemplate {
    private port: number;
    constructor(port: number = 5000) { super(); this.port = port; }

    render({ env }: TemplateContext): string {
        return `
FROM node:20-alpine
WORKDIR /app
${this.formatDockerEnv(env)}
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE ${this.port}
CMD ["node", "index.js"]`.trim();
    }
}

/* --- Docker Compose Templates --- */
class ComposeFrontend extends BaseTemplate {
    render({ env, projectName }: TemplateContext): string {
        const hasEnv = Object.keys(env).length > 0;

        let buildBlock = `    build:
      context: ./frontend
      dockerfile: Dockerfile`;

        if (hasEnv) {
            buildBlock += `\n      args:\n${this.formatEnvAsArgs(env)}`;
        }

        const envBlock = hasEnv
            ? `\n    environment:\n${this.formatEnvAsList(env)}`
            : "";

        return `
  frontend:
${buildBlock}
    container_name: ${projectName}-frontend${envBlock}
    stdin_open: true
    tty: true
    networks:
      - internal-bridge
      - web-gateway
    depends_on:
      - api-server`.trim();
    }
}

class ComposeApi extends BaseTemplate {
    render({ env, projectName }: TemplateContext): string {
        const hasEnv = Object.keys(env).length > 0;

        const envBlock = hasEnv
            ? `\n    environment:\n${this.formatEnvAsList(env)}`
            : "";

        return `
  api-server:
    build:
      context: ./backend
    container_name: ${projectName}-api-server${envBlock}
    networks:
      - internal-bridge
      - web-gateway
    restart: on-failure`.trim();
    }
}

class ComposePostgres extends BaseTemplate {
    render({ projectName, env }: TemplateContext): string {
        const hasEnv = Object.keys(env).length > 0;

        const envBlock = hasEnv
            ? `\n    environment:\n${this.formatEnvAsList(env)}`
            : "";

        return `
  db:
    image: postgres:alpine
    container_name: ${projectName}-db${envBlock}
    volumes:
      - db_data:/var/lib/postgresql/data
    networks:
      internal-bridge:
        aliases:
          - db
    restart: always`.trim();
    }
}

/* --- Registry Exports --- */
export const NGINX_TEMPLATES: Record<string, BaseTemplate> = {
    "frontend": new NginxFrontend(),
    "api-server": new NginxApi()
};

export const DOCKER_TEMPLATES: Record<string, BaseTemplate> = {
    "frontend": new DockerFrontend(),
    "api-server": new DockerBackend(5000),
    "ws-server": new DockerBackend(8080)
};

export const DOCKER_COMPOSE_TEMPLATES: Record<string, BaseTemplate> = {
    "frontend": new ComposeFrontend(),
    "api-server": new ComposeApi(),
    "db-pg": new ComposePostgres()
};