import { connectToDB } from "../../lib/mongodb";
import { NextResponse } from "next/server";

import Job from "../..//models/job";
import { getSession } from "next-auth/react";

export async function POST(req) {
    const session = await getSession({ req });
    if (!session || session.user.role !== "company" || !session.user.approved) {
        return Response.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const { title, description, location, salary } = await req.json();

    if (!title || !description) {
        return Response.json({ error: "Title and description are required" }, { status: 400 });
    }

    try {
        await connectToDB();
        const job = await Job.create({ title, description, location, salary, company: session.user.id });
        return Response.json({ message: "Job posted successfully", job }, { status: 201 });
    } catch (error) {
        return Response.json({ error: "Failed to post job" }, { status: 500 });
    }
}

export async function GET() {
    try {
        await connectToDB();
        console.log("✅ Database connected successfully");  // Debug log
        const jobs = await Job.find({});
        console.log("✅ Jobs fetched:", jobs);  // Debug log
        return NextResponse.json({ success: true, jobs });
    } catch (error) {
        console.error("❌ Job Fetch Error:", error.message);
        return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
    }
}

