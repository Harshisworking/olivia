import dbConnect from "@/app/lib/mongodb";
import Projects from "@/app/lib/modals/Container"
import { NpmBuilder } from "@/app/lib/builders";
import { GitCloner } from "@/app/lib/cloners";
import { DockerManager } from "@/app/lib/dockerbuilder";
import { NginxManager } from "@/app/lib/NginxManager";
import path from "path";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
    // const session = await getServerSession();
    // if (!session || !session.user || !session.user.id) {
    //     return NextResponse.json({ err: 'User is not authenticated' });
    // }

    const { url, requirements, hasEnv, env } = await req.json();

    const projectName = url.split('/').pop()?.replace('.git', '') || `repo-${Date.now()}`;

    let liveUrl: string | undefined = undefined;
    const baseDir = path.join(process.cwd(), 'deployments');

    // await dbConnect();
    const gitCloner = new GitCloner(baseDir);
    const dockerManager = new DockerManager();
    const nginx = new NginxManager(dockerManager);
    const builder = new NpmBuilder(
        dockerManager,
        nginx,
        gitCloner
    );

    try {
        await builder.build(url, hasEnv, env, requirements);
        const projectUrl = { url: `http://dragophynix.local/${projectName}` };
        // const result = await Projects.create({
        //     userId: session.user.id,
        //     projectName: projectName,
        //     repoUrl: url,
        // })
        return NextResponse.json(
            projectUrl
        )
    } catch (err) {
        return NextResponse.json(
            err
        )
    }
}