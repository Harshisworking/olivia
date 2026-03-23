import { NextResponse } from 'next/server';
import { DbManager } from '@/app/lib/Db-manager'; // Adjust path to your class

const dbManager = new DbManager();

export async function POST(req: Request) {
    try {
        const { projectName, dbType } = await req.json();

        if (!projectName || !dbType) {
            return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
        }

        // 1. Bridge the isolated project network to the Central Adminer
        const isConnected = await dbManager.connectToNetwork(projectName);

        if (!isConnected) {
            throw new Error("Failed to bridge Docker networks");
        }

        // 2. Generate the URL with pre-filled query parameters
        const adminerUrl = dbManager.generateAdminerLink(projectName, dbType);

        // 3. Send the URL back to the user
        return NextResponse.json({ url: adminerUrl });

    } catch (error) {
        console.error("DB Management Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}