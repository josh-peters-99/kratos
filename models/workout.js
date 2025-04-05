import mongoose from "mongoose";

const WorkoutSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    date: { type: Date, default: Date.now },
    notes: { type: String },
    exercises: [{ type: mongoose.Schema.Types.ObjectId, ref: "Exercise" }]
}, { timestamps: true });

module.exports = mongoose.model("Workout", WorkoutSchema);