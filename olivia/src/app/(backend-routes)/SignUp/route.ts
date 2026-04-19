import { User } from "@/app/lib/modals/Container";
import bcrypt from "bcrypt";
import dbConnect from "@/app/lib/mongodb";

export async function POST(req: Request) {
    // 1. Establish database connection
    await dbConnect();

    try {
        const { email, password } = await req.json();

        // 2. Check if user exists
        const isPresent = await User.findOne({ email });

        if (isPresent) {
            return Response.json({
                error: "Email already in use"
            }, { status: 400 });
        }

        // 3. Hash the password (must await this)
        const hashPassword = await bcrypt.hash(password, 10);

        // 4. Create the user
        const results = await User.create({
            email,
            password: hashPassword,
        });

        if (results) {
            return Response.json({
                status: "User created successfully"
            }, { status: 201 });
        }

    } catch (e) {
        console.error("Registration error:", e);
        return Response.json({
            error: "Error occurred while creating user"
        }, { status: 500 });
    }
}