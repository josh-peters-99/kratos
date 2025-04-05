import mongoose from "mongoose";

const ExerciseSchema = new mongoose.Schema({
  workoutId: { type: mongoose.Schema.Types.ObjectId, ref: "Workout", required: true },
  exerciseType: { 
    type: String, 
    enum: ["weighted_lift", "bodyweight", "timed", "cardio"], 
    required: true 
  },
  exerciseName: { type: String, required: true },
  sets: [{
    setType: { 
      type: String, 
      enum: ["warmup", "working", "drop", "reverse_drop"], 
      required: true 
    },
    setCount: { type: String, required: true },  // WU, 1, 1a, 1b, etc.
    reps: { type: Number, min: 1 },   // Only for weighted_lift & bodyweight
    weight: { type: Number, min: 0 }, // Only for weighted_lift & bodyweight
    time: { type: Number, min: 0 }    // Only for timed exercises
  }],
  cardio: {  
    activity: { 
      type: String, 
      enum: ["running", "walking", "swimming", "biking", "stair stepping"] 
    },
    time: { type: Number, min: 0 },    // In minutes
    distance: { type: Number, min: 0 } // In miles or km
  }
}, { timestamps: true });

module.exports = mongoose.model("Exercise", ExerciseSchema);
