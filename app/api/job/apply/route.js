import { NextResponse } from "next/server";
import Application from "../../../models/Application";
import User from "../../../models/User";
import Job from "../../../models/job";  // ✅ Add this import

import { connectToDB } from "../../../lib/mongodb";


export async function GET(req) {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get("jobId");
    const companyId = searchParams.get("companyId"); // Get companyId from request

    if (!jobId) {
        return NextResponse.json({ error: "Job ID is required." }, { status: 400 });
    }

    const applications = await Application.find({ jobId });

    if (!applications.length) {
        return NextResponse.json({ applicants: [] }, { status: 200 });
    }

    const applicants = await Promise.all(
        applications
            .filter((app) => app.userId.toString() !== companyId) // Exclude company's own applications
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
}



export async function POST(req) {
    try {
        const body = await req.json();
        console.log("📩 Incoming Data:", body);

        const { jobId, userId, resumeLink } = body;

        if (!jobId || !userId || !resumeLink) {
            return NextResponse.json({ error: "All fields are required." }, { status: 400 });
        }

        const application = new Application({ jobId, userId, resumeLink });
        await application.save();

        // ✅ Add applicant to the `Job` schema
        await Job.findByIdAndUpdate(jobId, {
            $push: {
                applicants: { userId, resume: resumeLink }  // Matches Job schema structure
            }
        });

        return NextResponse.json({ success: true, application }, { status: 201 });
    } catch (error) {
        console.error("❌ Application Error:", error.message);
        return NextResponse.json({ error: "Failed to apply for job" }, { status: 500 });
    }
}