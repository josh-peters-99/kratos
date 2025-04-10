import mongoose from "mongoose";

const SetSchema = new mongoose.Schema({
  setType:    { type: String, enum: ["warmup", "working", "drop", "reverse-drop"] },
  count: { type: String },
  reps:       { type: Number },
  weight:     { type: Number },
  time:       { type: Number }
});

const ExerciseTemplateSchema = new mongoose.Schema({
  exerciseType:  { type: String, enum: ["weighted", "bodyweight", "timed", "cardio"], required: true },
  name:          { type: String, required: true },
  sets:          [SetSchema],
  cardioType:    { type: String, enum: ["running", "walking", "swimming", "biking", "stair-stepping"] },
  distance:      { type: Number },
  time:          { type: Number }
});

const WorkoutTemplateSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title:     { type: String, required: true },
  notes:     { type: String },
  exercises: [ExerciseTemplateSchema]
}, { timestamps: true });

const WorkoutTemplate = mongoose.models.WorkoutTemplate || mongoose.model("WorkoutTemplate", WorkoutTemplateSchema);

export default WorkoutTemplate;
