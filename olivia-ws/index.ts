import { createServer } from "http";
import { Server } from "socket.io";
import { spawn } from "child_process";

const httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on("watch_container", (containerName: string) => {
        console.log(`Watching container: ${containerName}`);

        // Spawn the docker stats process
        const dockerStats = spawn("docker", ["stats", "--format", "{{json .}}", containerName]);

        dockerStats.stdout.on("data", (data) => {
            // Send the raw string data to the client
            socket.emit("stats-update", data.toString());
        });

        dockerStats.stderr.on("data", (err) => {
            console.error(`Docker Error: ${err.toString()}`);
        });

        // Kill the specific docker process when the user disconnects
        socket.on("disconnect", () => {
            console.log(`Client ${socket.id} disconnected. Killing process...`);
            dockerStats.kill();
        });
    });
});

httpServer.listen(4000, () => {
    console.log("Socket server running on port 4000");
});