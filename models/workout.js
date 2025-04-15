import mongoose from "mongoose";

const SetSchema = new mongoose.Schema({
  reps:      { type: Number },
  weight:    { type: Number },
  distance: { type: Number },
  hours: { type: Number },
  minutes: { type: Number },
  seconds: { type: Number },
  units: {
    type: String,
    enum: ["miles", "kilometers", "meters"]
  }
});

const ExerciseSchema = new mongoose.Schema({
  exerciseType: {
    type: String,
    enum: ["weighted", "bodyweight", "timed", "cardio"],
    required: true
  },
  name:      { type: String, required: true },
  sets:      [SetSchema],  // For all except cardio
});

const WorkoutSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title:     { type: String, required: true },
  date:      { type: Date, required: true },
  time:      { type: String },
  notes:     { type: String },
  exercises: [ExerciseSchema]
}, { timestamps: true });

const Workout = mongoose.models.Workout || mongoose.model("Workout", WorkoutSchema);

export default Workout;