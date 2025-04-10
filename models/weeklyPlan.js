import mongoose from "mongoose";

const DayPlanSchema = new mongoose.Schema({
  day: {
    type: String,
    enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    required: true
  },
  workoutTemplateId: { type: mongoose.Schema.Types.ObjectId, ref: "WorkoutTemplate" }
});

const WeeklyWorkoutPlanSchema = new mongoose.Schema({
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  weekStart:   { type: Date, required: true }, // ISO start of the week (e.g., Monday)
  days:        [DayPlanSchema]
}, { timestamps: true });

const WeeklyWorkoutPlan = mongoose.models.WeeklyWorkoutPlan || mongoose.model("WeeklyWorkoutPlan", WeeklyWorkoutPlanSchema);

export default WeeklyWorkoutPlan;
