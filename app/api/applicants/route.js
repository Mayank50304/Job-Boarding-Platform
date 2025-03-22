import { NextResponse } from "next/server";
import Application from "../../models/Application";
import User from "../../models/User";
import { connectToDB } from "../../lib/mongodb";

export async function GET(req) {
    try {
        await connectToDB();

        const { searchParams } = new URL(req.url);
        const jobId = searchParams.get("jobId");

        if (!jobId) {
            return NextResponse.json({ error: "Job ID is required." }, { status: 400 });
        }

        const applications = await Application.find({ jobId });

        if (!applications.length) {
            return NextResponse.json({ applicants: [] }, { status: 200 });
        }
        const applicants = await Promise.all(
            [...new Map(
                applications
                    .filter((app) => app.userId)  // ✅ Ensure `userId` exists
                    .map((app) => [app.userId.toString(), app])
            ).values()]
            .map(async (app) => {
                const user = await User.findById(app.userId).select("name email");
                return {
                    name: user?.name || "Unknown",
                    email: user?.email || "Unknown",
                    resumeLink: app.resumeLink
                };
            })
        );
        
        return NextResponse.json({ applicants }, { status: 200 });

    } catch (error) {
        console.error("❌ API Error:", error);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}
