export const generateEnvs = (projectName: string, hasDB: boolean, projectEnvs: Record<string, Record<string, string>>): Record<string, Record<string, string>> => {

    const flattenedEnvs: Record<string, string> = {};

    Object.values(projectEnvs).forEach(serviceEnvMap => {
        Object.assign(flattenedEnvs, serviceEnvMap);
    });

    const user = flattenedEnvs.DB_USER || "myuser";
    const pass = flattenedEnvs.DB_PASSWORD || "example_password";
    const name = flattenedEnvs.DB_NAME || "mydatabase";


    const envsWithoutDB = {
        PROJECT_NAME: projectName,
        REACT_APP_API_URL: `http://dragophynix.local/${projectName}-api`,
        NEXT_PUBLIC_WS_URL: `ws://dragophynix.local/${projectName}-ws/`,
        VITE_API_URL: `http://dragophynix.local/${projectName}-api`
    }

    const DBenvs = {
        DATABASE_URL: `postgres://${user}:${pass}@db:5432/${name}`,
    }

    let reusltEnvs = hasDB ? { ...envsWithoutDB, ...DBenvs } : { ...envsWithoutDB }

    return { systemEnvs: reusltEnvs, flattendedEnvs: flattenedEnvs }
};