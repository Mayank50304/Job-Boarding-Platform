import connectToDB from "../../lib/mongodb";
import Job from "../../models/job";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

export async function POST(req) {
    await connectToDB();
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "company") {
        return new Response(JSON.stringify({ error: "Unauthorized access" }), { status: 403 });
    }

    const { title, description, salary, location } = await req.json();

    const newJob = new Job({
        title,
        description,
        salary,
        location,
        company: session.user.id,
    });

    await newJob.save();
    return new Response(JSON.stringify(newJob), { status: 201 });
}

export async function GET(req) {
    try {
        await connectToDB();  // Fixed typo here
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "company") {
            return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
        }

        const companyId = req.nextUrl.searchParams.get("companyId");

        const jobs = await Job.find({ company: companyId });
        return NextResponse.json({ success: true, jobs });
    } catch (error) {
        console.error("❌ Job Fetch Error:", error.message);
        return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
    }
}