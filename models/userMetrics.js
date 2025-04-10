import mongoose from "mongoose";

const PersonalBestSchema = new mongoose.Schema({
  exerciseName:  { type: String, required: true },
  bestWeight:    { type: Number, default: 0 },
  bestReps:      { type: Number, default: 0 },
  bestTime:      { type: Number, default: 0 },
  bestDistance:  { type: Number, default: 0 }
});

const GoalSchema = new mongoose.Schema({
  exerciseName: { type: String, required: true },
  goalType: {
    type: String,
    enum: ["weight", "reps", "time", "distance"],
    required: true
  },
  targetValue:  { type: Number, required: true },
  currentValue: { type: Number, default: 0 },
  deadline:     { type: Date },
  achieved:     { type: Boolean, default: false },
  createdAt:    { type: Date, default: Date.now }
});

const UserMetricsSchema = new mongoose.Schema({
  userId:            { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  totalWorkouts:     { type: Number, default: 0 },
  yearlyWorkouts:    { type: Map, of: Number, default: {} },   // e.g., { "2025": 40 }
  monthlyWorkouts:   { type: Map, of: Number, default: {} },   // e.g., { "2025-04": 8 }
  weeklyWorkouts:    { type: Map, of: Number, default: {} },   // e.g., { "2025-W14": 3 }
  personalBests:     [PersonalBestSchema],
  goals:             [GoalSchema]
}, { timestamps: true });

const UserMetrics = mongoose.models.UserMetrics || mongoose.model("UserMetrics", UserMetricsSchema);

export default UserMetrics;

