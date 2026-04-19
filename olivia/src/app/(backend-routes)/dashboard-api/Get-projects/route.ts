import dbConnect from "@/app/lib/mongodb";
import Project from "../../../lib/modals/Container"

export async function POST(req: Request) {
    const { userId } = await req.json();
    await dbConnect();

    try {
        const result = await Project.find({ userId }).limit(2);

        return Response.json(result);
    } catch (e) {
        console.log(e);
    }
}