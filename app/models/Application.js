import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema({
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    resumeLink: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Application || mongoose.model("Application", ApplicationSchema);
