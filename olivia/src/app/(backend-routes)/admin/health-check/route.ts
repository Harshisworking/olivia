import { execFile } from "child_process";
import { NextResponse } from "next/server";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

export async function POST(req: Request) {
    const { container_names } = await req.json();

    const { stdout, stderr } = await execFileAsync('docker', ['inspect', ...container_names]);

    if (stderr) {
        console.error("Standard Error:", stderr);
    }

    const data = JSON.parse(stdout)

    const results = data.map((container: any) => {
        // 1. Clean the name (removes the leading '/')
        const cleanName = container.Name.replace(/^\//, '');

        // 2. Return an object with a dynamic key [cleanName]
        return {
            [cleanName]: {
                status: container.State.Status,
                running: container.State.Running,
                pid: container.State.Pid,
                startedAt: container.State.StartedAt
            }
        };
    });

    return NextResponse.json(
        results
    )

}