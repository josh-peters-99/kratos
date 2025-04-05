import mongoose from "mongoose";

const WeeklyPlanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  weekStartDate: { type: Date, required: true },  // Start date of the week
  workouts: [{
    day: { 
      type: String, 
      enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      required: true 
    },
    workoutTemplateId: { type: mongoose.Schema.Types.ObjectId, ref: "WorkoutTemplate" }
  }]
}, { timestamps: true });

module.exports = mongoose.model("WeeklyPlan", WeeklyPlanSchema);
