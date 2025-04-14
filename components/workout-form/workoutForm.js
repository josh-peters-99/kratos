"use client"

import { useState, useEffect } from "react";
import WorkoutTitleInput from "./workoutTitleInput";
import ExerciseNameInput from "./exerciseNameInput";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "../ui/separator";
import WeightedSet from "./sets/weightedSet";
import BodyweightSet from "./sets/bodyweightSet";
import TimedSet from "./sets/timedSet";
import CardioSet from "./sets/cardioSet";

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

  const handleDeleteSet = (exerciseIndex, indexToRemove) => {
    const updatedExercises = [...formState.exercises];
    const currentSets = updatedExercises[exerciseIndex].sets;
    const updatedSets = currentSets.filter((_, i) => i !== indexToRemove);
    updatedExercises[exerciseIndex].sets = updatedSets;
    setFormState(prev => ({
      ...prev,
      exercises: updatedExercises,
    }));
  };

  const renderSets = (exercise, exerciseIndex) => {
    switch (exercise.exerciseType) {
      case "weighted":
        return exercise.sets.map((set, setIndex) => (
          <WeightedSet
            key={setIndex}
            index={setIndex}
            set={set}
            sets={exercise.sets}
            onChange={(newSet) =>
              updateSet(exerciseIndex, setIndex, newSet)
            }
            onDelete={() => handleDeleteSet(exerciseIndex, setIndex)}
          />
        ));
      case "bodyweight":
        return exercise.sets.map((set, setIndex) => (
          <BodyweightSet
            key={setIndex}
            index={setIndex}
            set={set}
            onChange={(newSet) =>
              updateSet(exerciseIndex, setIndex, newSet)
            }
            onDelete={() => handleDeleteSet(exerciseIndex, setIndex)}
          />
        ));
      case "timed":
        return exercise.sets.map((set, setIndex) => (
          <TimedSet
            key={setIndex}
            index={setIndex}
            set={set}
            onChange={(newSet) =>
              updateSet(exerciseIndex, setIndex, newSet)
            }
            onDelete={() => handleDeleteSet(exerciseIndex, setIndex)}
          />
        ));
      case "cardio":
        return exercise.sets.map((set, setIndex) => (
          <CardioSet
            key={setIndex}
            index={setIndex}
            set={set}
            onChange={(newSet) =>
              updateSet(exerciseIndex, setIndex, newSet)
            }
            onDelete={() => handleDeleteSet(exerciseIndex, setIndex)}
          />
        ));
      default:
        return null;
    }
  };  

  const updateSet = (exerciseIndex, setIndex, updatedSet) => {
    const updatedExercises = [...formState.exercises];
    updatedExercises[exerciseIndex].sets[setIndex] = updatedSet;
    setFormState((prev) => ({ ...prev, exercises: updatedExercises }));
  };
  
  const addSet = (exerciseIndex) => {
    const updatedExercises = [...formState.exercises];
    const type = updatedExercises[exerciseIndex].exerciseType;
  
    let newSet = {};
    switch (type) {
      case "weighted":
        newSet = { reps: "", weight: "" };
        break;
      case "bodyweight":
        newSet = { reps: "", weight: "" };
        break;
      case "timed":
        newSet = { hours: "", minutes: "", seconds: "" };
        break;
      case "cardio":
        newSet = { distance: "", units: "", hours: "", minutes: "", seconds: "" };
        break;
      default:
        return;
    }
  
    updatedExercises[exerciseIndex].sets.push(newSet);
    setFormState((prev) => ({ ...prev, exercises: updatedExercises }));
  };

  const exerciseTypeStyles = {
    weighted: {
      icon: <Weight size={14} className="mr-1" />,
      bgColor: "bg-green-200",
    },
    bodyweight: {
      icon: <PersonStanding size={14} className="mr-1" />,
      bgColor: "bg-blue-200",
    },
    timed: {
      icon: <Timer size={14} className="mr-1" />,
      bgColor: "bg-yellow-200",
    },
    cardio: {
      icon: <HeartPulse size={14} className="mr-1" />,
      bgColor: "bg-purple-200",
    }
  }

  const types = ["weighted", "bodyweight", "timed", "cardio"];
  

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
            <div key={index}>
              <div className="mb-4">
                <div>
                  <div className="flex justify-between">

                    <Label className="flex-1" htmlFor={`exerciseName-${index}`}>Exercise Name</Label>
                    
                    <div className="flex justify-between gap-3 items-center">
                      <div>
                        {exercise.exerciseType && (
                          <p
                            className={`flex items-center px-2 py-0.5 ${
                              exerciseTypeStyles[exercise.exerciseType]?.bgColor || "bg-gray-200"
                            } rounded-2xl text-xs text-black font-bold`}
                          >
                            {exerciseTypeStyles[exercise.exerciseType]?.icon}
                            {exercise.exerciseType.charAt(0).toUpperCase() + exercise.exerciseType.slice(1)}
                          </p>                    
                        )}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="cursor-pointer px-2">
                          <Ellipsis />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel>Exercise Options</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            Exercise Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => deleteExercise(index)}>
                            Delete Exercise
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                  </div>

                  <div className="flex gap-3">
                    <ExerciseNameInput
                      value={exercise.name}
                      onSelectExercise={(exercise) => updateExercise(index, { name: exercise.name, exerciseType: exercise.exerciseType })}
                    />

                    <div className="mt-1">
                      <Button type="button" variant="secondary" onClick={() => setSetsIsOpen(!setsIsOpen)}>
                        {setsIsOpen ? <ChevronUp /> : <ChevronDown />}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {setsIsOpen && (
                <div>
                  <div>
                    {renderSets(exercise, index)}
                  </div>

                  <div className="flex flex-col items-center justify-center mb-8 mt-6">
                    <Button type="button" onClick={() => addSet(index)}>
                      <Plus />
                    </Button>
                  </div>
                </div>
              )}
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
