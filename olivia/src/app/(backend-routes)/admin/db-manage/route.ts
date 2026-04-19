import { NextResponse } from 'next/server';
import { DbManager } from '@/app/lib/Db-manager';
const dbManager = new DbManager();

export async function POST(req: Request) {
    try {
        const { projectName, dbType } = await req.json();

        if (!projectName || !dbType) {
            return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
        }
        const isConnected = await dbManager.connectToNetwork(projectName);

        if (!isConnected) {
            throw new Error("Failed to bridge Docker networks");
        }
        const adminerUrl = dbManager.generateAdminerLink(projectName, dbType);

        return NextResponse.json({ url: adminerUrl });

    } catch (error) {
        console.error("DB Management Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}