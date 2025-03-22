import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ["jobseeker", "admin", "company"],
        default: "jobseeker",
    },
    approved: { type: Boolean, default: false }, // ✅ Ensure this exists
    isBlocked: { type: Boolean, default: false },
}, { strict: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);
