import mongoose from "mongoose";

const ExerciseSchema = new mongoose.Schema({
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name:        { type: String, required: true },
  exerciseType: {
    type: String,
    enum: ["weighted", "bodyweight", "timed", "cardio"],
    required: true
  },
  createdAt:   { type: Date, default: Date.now }
});

const Exercise = mongoose.models.Exercise || mongoose.model("Exercise", ExerciseSchema);

export default Exercise;
