import mongoose from "mongoose";

const GoalSchema = new mongoose.Schema({
  exerciseName: { type: String, required: true }, // e.g. "Bench Press"
  goalType: {
    type: String,
    enum: ["weight", "reps", "time", "distance"],
    required: true
  },
  targetValue: { type: Number, required: true }, // e.g. 225 lbs, 15 reps, 60 sec, etc.
  currentValue: { type: Number, default: 0 },     // Optional for tracking progress
  deadline: { type: Date },                       // Optional deadline
  achieved: { type: Boolean, default: false },    // Optional status flag
  createdAt: { type: Date, default: Date.now }
});

const UserMetricsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  // Workout counts
  totalWorkouts: { type: Number, default: 0 },
  yearlyWorkouts: { type: Map, of: Number, default: {} },
  monthlyWorkouts: { type: Map, of: Number, default: {} },
  weeklyWorkouts: { type: Map, of: Number, default: {} },

  // Personal bests
  personalBests: [{
    exerciseName: { type: String, required: true },
    bestWeight: { type: Number, default: 0 },
    bestReps: { type: Number, default: 0 },
    bestTime: { type: Number, default: 0 },
    bestDistance: { type: Number, default: 0 }
  }],

  // Exercise goals
  goals: [GoalSchema]
}, { timestamps: true });

module.exports = mongoose.model("UserMetrics", UserMetricsSchema);

