import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true }
}, { timestamps: true, versionKey: false });

export default mongoose.model('User', userSchema);