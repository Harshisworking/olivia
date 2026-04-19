import dbConnect from "@/app/lib/mongodb";
import Project from "@/app/lib/modals/Container"
import { NpmBuilder } from "@/app/lib/builders";
import { GitCloner } from "@/app/lib/cloners";
import { DockerManager } from "@/app/lib/dockerbuilder";
import { NginxManager } from "@/app/lib/NginxManager";
import path from "path";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Dockerizer } from "@/app/lib/dockerizer";
import { AuthService } from "@/app/lib/auth";

export async function POST(req: Request) {
    const session = await AuthService.getBackendSession();
    console.log(session)
    if (!session || !session.user || !session.user.id) {
        console.log("Error while siginig up")
        return NextResponse.json({ err: 'User is not authenticated' });
    }

    const { url, requirements, hasEnv, env, forceBuild, autoDockerizationReq } = await req.json();

    const projectName = url.split('/').pop()?.replace('.git', '') || `repo-${Date.now()}`;

    let liveUrl: string | undefined = undefined;
    const baseDir = path.join(process.cwd(), 'deployments');

    await dbConnect();
    const gitCloner = new GitCloner(baseDir);
    const dockerManager = new DockerManager();
    const nginx = new NginxManager(dockerManager);
    const dockerizer = new Dockerizer();
    const builder = new NpmBuilder(
        dockerManager,
        nginx,
        gitCloner,
        dockerizer
    );

    try {
        await builder.build(url, hasEnv, env, requirements, forceBuild, autoDockerizationReq);
        const projectUrl = { url: `http://dragophynix.local/${projectName}` };
        const isPresent = await Project.findOne({
            projectName,
            userId: session.user.id
        })
        console.log(isPresent)
        if (isPresent.length <= 0) {
            console.log("already present")
            const result = await Project.create({
                userId: session.user.id,
                projectName: projectName,
                repoUrl: url,
            })
        }
        return NextResponse.json(
            projectUrl
        )
    } catch (err) {
        return NextResponse.json(
            err
        )
    }
}