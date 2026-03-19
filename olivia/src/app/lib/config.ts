// config.ts
export const NGINX_TEMPLATES: Record<string, (projectName: string) => string> = {
    "frontend": (projectName: string) => `
location /${projectName}/ {
    resolver 127.0.0.11 valid=10s;
    set $target http://${projectName}-frontend:3000;
    proxy_pass $target;
    proxy_set_header Host $host;
}`,

    "api-server": (projectName: string) => `
location /${projectName}-api/ {
    resolver 127.0.0.11 valid=10s;
    set $target http://${projectName}-api-server:5000;
    rewrite ^/${projectName}-api/(.*) /$1 break;
    proxy_pass $target;
    proxy_set_header Host $host;
}`,

    "ws-server": (projectName: string) => `
location /${projectName}-ws/ {
    resolver 127.0.0.11 valid=10s;
    set $target http://${projectName}-ws-server:8080;
    proxy_pass $target;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_read_timeout 86400;
}`
};