import { NextResponse } from "next/server";
import { connectToDB } from "../../lib/mongodb";
import Job from "../../models/job";
import mongoose from 'mongoose';  // ✅ Add this import
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";


export async function GET(req) {
    try {
        await connectToDB();
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "company") {
            return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const jobId = searchParams.get("jobId");

        if (jobId) {
            // ✅ Fetch applicants for a specific job
            if (!mongoose.Types.ObjectId.isValid(jobId)) {
                console.log("❌ Invalid Job ID format");
                return NextResponse.json({ error: "Invalid job ID" }, { status: 400 });
            }

            const job = await Job.findOne({ _id: jobId, company: session.user.id }).populate('applicants.userId');
            
            if (!job) {
                console.log("❌ Job Not Found or Unauthorized");
                return NextResponse.json({ error: "Job not found" }, { status: 404 });
            }

            return NextResponse.json({ success: true, applicants: job.applicants });
        }

        // ✅ Default behavior: Fetch all jobs
        const jobs = await Job.find({ company: session.user.id });
        return NextResponse.json({ success: true, jobs });
    } catch (error) {
        console.error("❌ Job Fetch Error:", error.message);
        return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
    }
}


export async function POST(req) {
    try {
        await connectToDB();
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "company") {
            return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
        }

        const { title, description, salary, location } = await req.json();

        if (!title || !description || !salary || !location) {
            return NextResponse.json({ error: "All fields are required." }, { status: 400 });
        }

        const newJob = new Job({
            title,
            description,
            salary,
            location,
            company: session.user.id // Dynamically assign company ID from session
        });

        await newJob.save();
        return NextResponse.json({ success: true, job: newJob }, { status: 201 });
    } catch (error) {
        console.error("❌ Job Post Error:", error.message);
        return NextResponse.json({ error: "Failed to post job" }, { status: 500 });
    }
}
export async function DELETE(req) {
    try {
        await connectToDB();
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "company") {
            return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const jobId = searchParams.get("jobId");

        if (!mongoose.Types.ObjectId.isValid(jobId)) {
            console.log("❌ Invalid Job ID format");
            return NextResponse.json({ error: "Invalid job ID" }, { status: 400 });
        }

        console.log("🟡 Extracted Job ID:", jobId);

        const deletedJob = await Job.findOneAndDelete({
            _id: jobId,
            company: session.user.id
        });

        if (!deletedJob) {
            console.log("❌ Job Not Found or Unauthorized");
            return NextResponse.json({ error: "Job not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "✅ Job deleted successfully!" });
    } catch (error) {
        console.error("❌ Job Deletion Error:", error.message);
        return NextResponse.json({ error: "Failed to delete job" }, { status: 500 });
    }
}
