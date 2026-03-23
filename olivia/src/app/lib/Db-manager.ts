import { execSync } from "child_process";

export class DbManager {
    private readonly adminerName: string = "master-adminer";
    public async connectToNetwork(projectName: string): Promise<boolean> {
        const networkName = `${projectName}_internal-bridge`;
        try {
            const inspect = execSync(`docker inspect ${this.adminerName}`).toString();

            // Check if the bridge already exists
            if (inspect.includes(networkName)) {
                console.log(`[DbManager] ${this.adminerName} is already on ${networkName}`);
                return true; // Still a success!
            }

            // If not connected, connect it
            execSync(`docker network connect ${networkName} ${this.adminerName}`);
            console.log(`[DbManager] Connected ${this.adminerName} to ${networkName}`);
            return true;

        } catch (e: any) {
            // Log the actual Docker error (e.g., "network not found")
            console.error("[DbManager] Docker Error:", e.stderr?.toString() || e.message);
            return false; // Only return false if the command actually failed
        }
    }


    disconnectFromNetwork(projectName: string) {
        const networkName = `${projectName}_internal-bridge`;
        try {
            const inspect = execSync(`docker inspect ${this.adminerName}`).toString();
            if (inspect.includes(networkName)) {
                execSync(`docker network disconnect ${networkName} ${this.adminerName} --force`);
            }
        } catch (e) {
            console.log(e);
        }
    }

    generateAdminerLink(projectName: string, type: string): string {
        const baseUrl = "http://dragophynix.local/db-manager/";
        const server = `${projectName}-db`;
        const user = type === 'pgsql' ? 'myuser' : 'admin';

        // This query string pre-fills the Adminer login form
        return `${baseUrl}?${type}=${server}&username=${user}`;
    }
}