import { createServer } from "http";
import { Server } from "socket.io";
import { spawn } from "child_process";
import { data } from "framer-motion/client";
const httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});
io.on("connection", (socket) => {
    socket.on("watch_container", (containerName) => {
        const dockerStats = spawn("docker", ["stats", "--format", "{{json .}}", containerName]);
        dockerStats.stdout.on("data", (data) => {
            socket.emit("stats-update", data.toString());
        });
        dockerStats.stderr.on("data", (err) => {
            console.error(`Docker Error: ${err}`);
        });
        socket.emit("stats-update", data.toString());
        socket.on("disconnect", () => {
            dockerStats.kill();
        });
    });
});
httpServer.listen(4000, () => {
    console.log("Socket server running on port 4000");
});
//# sourceMappingURL=index.js.map