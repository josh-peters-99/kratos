import mongoose from "mongoose";

const WorkoutTemplateSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  exercises: [{
    exerciseName: { type: String, required: true },
    exerciseType: { 
      type: String, 
      enum: ["weighted_lift", "bodyweight", "timed", "cardio"], 
      required: true 
    },
    sets: [{
      setType: { 
        type: String, 
        enum: ["warmup", "working", "drop", "reverse_drop"], 
        required: true 
      },
      setCount: { type: String, required: true },
      reps: { type: Number, min: 1 },
      weight: { type: Number, min: 0 },
      time: { type: Number, min: 0 }
    }],
    cardio: {
      activity: { 
        type: String, 
        enum: ["running", "walking", "swimming", "biking", "stair stepping"] 
      },
      time: { type: Number, min: 0 },
      distance: { type: Number, min: 0 }
    }
  }]
}, { timestamps: true });

module.exports = mongoose.model("WorkoutTemplate", WorkoutTemplateSchema);
