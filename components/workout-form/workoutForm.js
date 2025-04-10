"use client"

import { useState, useEffect } from "react";
import WorkoutTitleInput from "./workoutTitleInput";
import ExerciseNameInput from "./exerciseNameInput";
import { DatePicker } from "./datePicker";
import { TimePicker } from "./timePicker";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Plus, ClipboardX, Save, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "../ui/separator";

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

  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("workoutForm", JSON.stringify(formState));
  }, [formState]);

  const updateField = (field, value) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  };

  const addExercise = () => {
    setFormState(prev => ({
      ...prev,
      exercises: [...prev.exercises, { name: "", sets: "", reps: "" }]
    }));
  };

  const updateExercise = (index, field, value) => {
    const updatedExercises = [...formState.exercises];
    updatedExercises[index] = { ...updatedExercises[index], [field]: value };
    setFormState(prev => ({ ...prev, exercises: updatedExercises }));
  }

  const deleteExercise = (index) => {
    const updatedExercises = formState.exercises.filter((_, i) => i !== index);
    setFormState(prev => ({ ...prev, exercises: updatedExercises}));
  }

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
            <div>
              <div key={index} className="mb-4 flex justify-between">
                <div className="mr-3">
                  <Label htmlFor={`exerciseName-${index}`}>Exercise Name</Label>
                  <ExerciseNameInput
                    value={exercise.name}
                    onSetType={(type) => updateExercise(index, "exerciseType", type)}
                    onNameChange={(name) => updateExercise(index, "name", name)}
                  />
                </div>
                <div>
                  <Label>Exercise Type</Label>
                  <div className="flex justify-between mt-1">
                    <Select>
                      <SelectTrigger className="w-[115px] md:w-[150px]">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weighted">Weighted Lift</SelectItem>
                        <SelectItem value="bodyweight">Bodyweight</SelectItem>
                        <SelectItem value="timed">Timed</SelectItem>
                        <SelectItem value="cardio">Cardio</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="ml-3 mt-1">
                  <Label className="invisible">Delete</Label>
                  <Button onClick={() => deleteExercise(index)}>
                    <Trash2 />
                  </Button>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center mb-8 mt-6">
                <Button>
                  <Plus />
                </Button>
                <p className="text-xs text-muted-foreground italic mt-1">(add set)</p>
              </div>
              <Separator className="mb-8"/>
            </div>
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
        <Button>
          <ClipboardX />
          Discard Workout
        </Button>
        <Button onClick={saveWorkout}>
          <Save />
          Save Workout
        </Button>
      </div>
    </section>
  )
}

