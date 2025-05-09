import mongoose from "mongoose";

const ExerciseSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  exerciseType: {
    type: String,
    enum: ["weighted", "bodyweight", "timed", "cardio"],
    required: true
  },
  musclesWorked: {
    type: [String],
    default: []
  },
  description: { type: String },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },
  createdAt:   { type: Date, default: Date.now }
});

const Exercise = mongoose.models.Exercise || mongoose.model("Exercise", ExerciseSchema);

export default Exercise;