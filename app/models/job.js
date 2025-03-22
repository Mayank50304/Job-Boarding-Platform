import mongoose from "mongoose";

const JobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    company: { type: String, required: true },   location: { type: String, required: true },
    salary: { type: String, required: true },
    applicants: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            resume: { type: String },  // Cloud storage link or file URL
            status: {
                type: String,
                enum: ["Pending", "Accepted", "Rejected"],
                default: "Pending",
            },
        },
    ],
}, { timestamps: true });

export default mongoose.models.Job || mongoose.model("Job", JobSchema);
