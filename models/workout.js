import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const WorkoutSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  date: { type: Date, required: true },
  notes: { type: String },
  exercises: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Exercise" // This can be referenced to another schema if needed
  }],
  
  // Likes
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Users who liked this workout

  // Comments
  comments: [CommentSchema] // Comments made on the workout
  
}, { timestamps: true });

module.exports = mongoose.model("Workout", WorkoutSchema);
