import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import User from "../../models/User";
import Company from "../../models/company";
import { connectToDB } from "../../lib/mongodb";

export async function GET() {
    await connectToDB();
    const session = await getServerSession(authOptions);
    console.log("Session Data:", session);

    if (!session || session.user.role !== "admin") {
        return new Response(JSON.stringify({ error: "Unauthorized access" }), { status: 403 });
    }
    
    // Fetch pending companies and job seekers
    const pendingCompanies = await User.find({ role: "company", approved: false });

    const jobSeekers = await User.find({ role: "jobseeker", isBlocked: false });

    return new Response(JSON.stringify({ pendingCompanies, jobSeekers }), { status: 200 });
}

export async function POST(req) {
    await connectToDB();
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
        return new Response(JSON.stringify({ error: "Unauthorized access" }), { status: 403 });
    }

    const { action, userId } = await req.json();

    if (!userId || !["approve", "reject", "block", "remove"].includes(action)) {
        return new Response(JSON.stringify({ error: "Invalid request data" }), { status: 400 });
    }

    const user = await User.findById(userId);

    if (!user) {
        return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    switch (action) {
        case "approve":
        console.log("Before Update:", await User.findById(userId));
        await User.findByIdAndUpdate(userId, { approved: true }, { new: true });
        console.log("After Update:", await User.findById(userId));
           break;
        case "reject":
            await User.findByIdAndDelete(userId); // Since reject means deletion
            break;
        case "block":
            await User.findByIdAndUpdate(userId, { isBlocked: true });
            break;
        case "remove":
            await User.findByIdAndDelete(userId);
            return new Response(JSON.stringify({ message: "User removed successfully" }), { status: 200 });
    }
    
    
    

    await user.save();

    return new Response(JSON.stringify({ message: `User ${action} successfully` }), { status: 200 });
}
