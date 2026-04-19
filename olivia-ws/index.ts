import { createServer } from "http";
import { Server } from "socket.io";
import { spawn, exec } from "child_process";
import os from "os"; // Node's built-in OS module (No npm install needed)

const httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // --- NEW SYSTEM WATCHER ---
    socket.on("watch_system", () => {
        console.log(`Watching host system for ${socket.id}`);

        // Poll the system every 2 seconds
        const intervalId = setInterval(() => {
            try {
                // 1. Calculate RAM %
                const totalMem = os.totalmem();
                const freeMem = os.freemem();
                const ramPercent = (((totalMem - freeMem) / totalMem) * 100).toFixed(0);

                // 2. Calculate CPU %
                const cpuCount = os.cpus().length || 1; // Fallback to 1 to prevent division by zero
                const loadAvg = os.loadavg()[0] || 0;
                let cpuPercent = ((loadAvg / cpuCount) * 100).toFixed(0);
                if (Number(cpuPercent) > 100) cpuPercent = "100";

                // 3. Safe Disk Calculation
                // If you are coding on Windows, skip the Linux command to prevent crashes
                if (os.platform() === "win32") {
                    const systemData = {
                        cpu: Number(cpuPercent),
                        ram: Number(ramPercent),
                        disk: 0 // Default to 0 on Windows
                    };
                    console.log("Sending System Data:", systemData); // Verify in server terminal
                    socket.emit("system-stats-update", JSON.stringify(systemData));
                } else {
                    // If on Linux/Ubuntu, safely run the command with a 1-second timeout limit
                    exec("df / | awk 'NR==2 {print $5}'", { timeout: 1000 }, (err, stdout) => {
                        let diskPercent = "0";
                        if (!err && stdout) {
                            diskPercent = stdout.trim().replace('%', '');
                        }

                        const systemData = {
                            cpu: Number(cpuPercent),
                            ram: Number(ramPercent),
                            disk: Number(diskPercent) || 0 // Fallback to 0 if parsing fails
                        };

                        console.log("Sending System Data:", systemData); // Verify in server terminal
                        socket.emit("system-stats-update", JSON.stringify(systemData));
                    });
                }
            } catch (error) {
                console.error("System watcher interval error:", error);
            }
        }, 500);

        // Stop polling when the client disconnects from this stream
        socket.on("disconnect", () => {
            clearInterval(intervalId);
            console.log(`System watcher stopped for ${socket.id}`);
        });
    });

    // --- EXISTING CONTAINER WATCHER ---
    socket.on("watch_container", (containerName: string) => {
        console.log(`Watching container: ${containerName}`);

        const dockerStats = spawn("docker", ["stats", "--format", "{{json .}}", containerName]);

        dockerStats.stdout.on("data", (data) => {
            socket.emit("stats-update", data.toString());
        });

        dockerStats.stderr.on("data", (err) => {
            console.error(`Docker Error: ${err.toString()}`);
        });

        socket.on("disconnect", () => {
            console.log(`Client ${socket.id} disconnected. Killing process...`);
            dockerStats.kill();
        });
    });
});

httpServer.listen(4000, () => {
    console.log("Socket server running on port 4000");
});