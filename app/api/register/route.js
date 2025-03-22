import { hash } from "bcryptjs";
import { connectToDB } from "../../lib/mongodb";
import User from "../../models/User";

export async function POST(req) {
    try {
        const body = await req.json();
        const { name, email, password, role } = body;

        if (!name || !email || !password || !role) {
            return new Response(
                JSON.stringify({ error: "All fields are required" }),
                { status: 400 }
            );
        }

        await connectToDB();

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return new Response(
                JSON.stringify({ error: "User already exists" }),
                { status: 400 }
            );
        }

        const hashedPassword = await hash(password, 10);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
            approved: role === "admin" // ✅ Auto-approve admins
        });

        return new Response(JSON.stringify({ success: true, user: newUser }), { status: 201 });
    } catch (error) {
        console.error("❌ Registration Error:", error);
        return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
    }
}
