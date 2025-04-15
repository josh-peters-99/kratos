"use client"

import { useState, useEffect } from "react";
import WorkoutTitleInput from "./workoutTitleInput";
import { DatePicker } from "./datePicker";
import { TimePicker } from "./timePicker";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { 
  Plus, 
  ClipboardX, 
  Save, 
  Ellipsis, 
  ChevronDown, 
  ChevronUp, 
  Weight, 
  PersonStanding, 
  Timer, 
  HeartPulse,
} from "lucide-react";
import { Separator } from "../ui/separator";
import ExerciseCard from "./exerciseCard";
import { createWorkout } from "@/lib/api/workout";

export default function WorkoutForm() {
  const [formState, setFormState] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("workoutForm");
      return saved ? JSON.parse(saved) : {
        title: "",
        date: null,
        time: null,
        notes: "",
        exercises: []
      };
    }
    return {
      title: "",
      date: null,
      time: null,
      notes: "",
      exercises: []
    };
  });
  const [setsIsOpen, setSetsIsOpen] = useState(false);

  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    console.log("formState updated: ", formState);
    localStorage.setItem("workoutForm", JSON.stringify(formState));
  }, [formState]);

  const updateField = (field, value) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  };

  const addExercise = () => {
    setFormState(prev => ({
      ...prev,
      exercises: [...prev.exercises, { name: "", exerciseType: "", sets: [] }]
    }));
  };

  const updateExercise = (index, newFields) => {
    const updatedExercises = [...formState.exercises];
    updatedExercises[index] = {
      ...updatedExercises[index],
      ...newFields,
    };
    setFormState(prev => ({ ...prev, exercises: updatedExercises }));
  };

  const saveWorkout = async () => {
    try {
      const res = await axios.post("/api/workouts/create", formState);
      if (res.status === 200) {
        localStorage.removeItem("workoutForm");
        alert("Workout saved!");
        // TODO: reset form here
      }
    } catch (error) {
      console.error("Failed to save workout:", error);
      alert("Something went wrong.");
    }
  }

  const saveWorkoutToDatabase = async () => {
    try {
      const workoutJSON = localStorage.getItem("workoutForm");
      if (!workoutJSON) {
        console.error("No workout found in localStorage");
        return;
      }

      const workout = JSON.parse(workoutJSON);

      const savedWorkout = await createWorkout(workout);
      console.log("Workout saved:", savedWorkout);
      
      localStorage.removeItem("workoutForm");
    } catch (error) {
      console.error("Error saving workout:", error);
    }
  }

  const discardWorkout = async () => {
    localStorage.removeItem("workoutForm");
  }
  

  if (!isHydrated) return null; // Prevent SSR mismatch by delaying rendering

  return (
    <section className="w-[370px] md:w-[450px]">
      <div className="flex flex-col text-center">
        <h1 className="text-3xl font-extrabold lg:text-4xl">Create a New Workout</h1>
      </div>
      <form className="md:w-[450px] flex flex-col mt-8">
        <div className="flex flex-col">
          <div className="flex flex-col gap-3">
            <div>
              <Label htmlFor="workoutTitle">Workout Title</Label>
              <WorkoutTitleInput 
                setTitle={(title) => updateField("title", title)} 
                title={formState.title} 
              />
            </div>
            <div className="flex justify-between">
              <DatePicker date={formState.date} setDate={(e) => updateField("date", e)} />
              <TimePicker time={formState.time} setTime={(e) => updateField("time", e)} />
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div>
          {formState.exercises.map((exercise, index) => (
            <ExerciseCard 
              key={index}
              index={index}
              exercise={exercise}
              formState={formState}
              setFormState={setFormState}
              updateExercise={updateExercise}
            />
          ))}
        </div>
      </form>

      <div className="flex w-full justify-center mt-8">
        <Button onClick={addExercise}>
          <Plus />
          Exercise
        </Button>
      </div>
      <div className="mt-8">
        <Label>Workout Notes</Label>
        <Textarea 
          className="mt-1" 
          value={formState.notes} 
          onChange={(e) => updateField("notes", e.target.value)} 
        />
      </div>
      <div className="flex w-full justify-evenly mt-10">
        <Button onClick={discardWorkout}>
          <ClipboardX />
          Discard Workout
        </Button>
        <Button onClick={saveWorkoutToDatabase}>
          <Save />
          Save Workout
        </Button>
      </div>
    </section>
  )
}
