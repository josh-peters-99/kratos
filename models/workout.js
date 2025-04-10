import mongoose from "mongoose";

const SetSchema = new mongoose.Schema({
  setType: {
    type: String,
    enum: ["warmup", "working", "drop", "reverse-drop"],
    required: true
  },
  count:     { type: String }, // e.g., "1", "1a", "WU", etc.
  reps:      { type: Number },
  weight:    { type: Number },
  time:      { type: Number }  // in seconds
});

const ExerciseSchema = new mongoose.Schema({
  exerciseType: {
    type: String,
    enum: ["weighted", "bodyweight", "timed", "cardio"],
    required: true
  },
  name:      { type: String, required: true },
  sets:      [SetSchema],  // For all except cardio
  cardioType: {
    type: String,
    enum: ["running", "walking", "swimming", "biking", "stair-stepping"]
  },
  distance:  { type: Number }, // in meters or km
  time:      { type: Number }  // in seconds
});

const WorkoutSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title:     { type: String, required: true },
  date:      { type: Date, required: true },
  notes:     { type: String },
  exercises: [ExerciseSchema]
}, { timestamps: true });

const Workout = mongoose.models.Workout || mongoose.model("Workout", WorkoutSchema);

export default Workout;
