"use client";

import { useState } from "react";
import WeightedSet from "./sets/weightedSet";
import BodyweightSet from "./sets/bodyweightSet";
import TimedSet from "./sets/timedSet";
import CardioSet from "./sets/cardioSet";
import ExerciseNameInput from "./exerciseNameInput";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import {
  Plus,
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

export default function ExerciseCard({
  exercise,
  index,
  formState,
  setFormState,
  updateExercise,
}) {
  const [setsIsOpen, setSetsIsOpen] = useState(false);

  const handleDeleteSet = (exerciseIndex, indexToRemove) => {
    const updatedExercises = [...formState.exercises];
    const currentSets = updatedExercises[exerciseIndex].sets;
    const updatedSets = currentSets.filter((_, i) => i !== indexToRemove);
    updatedExercises[exerciseIndex].sets = updatedSets;
    setFormState((prev) => ({
      ...prev,
      exercises: updatedExercises,
    }));
  };

  const deleteExercise = (index) => {
    const updatedExercises = formState.exercises.filter((_, i) => i !== index);
    setFormState((prev) => ({ ...prev, exercises: updatedExercises }));
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

  const renderSets = (exercise, exerciseIndex) => {
    switch (exercise.exerciseType) {
      case "weighted":
        return exercise.sets.map((set, setIndex) => (
          <WeightedSet
            key={setIndex}
            index={setIndex}
            set={set}
            sets={exercise.sets}
            onChange={(newSet) => updateSet(exerciseIndex, setIndex, newSet)}
            onDelete={() => handleDeleteSet(exerciseIndex, setIndex)}
          />
        ));
      case "bodyweight":
        return exercise.sets.map((set, setIndex) => (
          <BodyweightSet
            key={setIndex}
            index={setIndex}
            set={set}
            onChange={(newSet) => updateSet(exerciseIndex, setIndex, newSet)}
            onDelete={() => handleDeleteSet(exerciseIndex, setIndex)}
          />
        ));
      case "timed":
        return exercise.sets.map((set, setIndex) => (
          <TimedSet
            key={setIndex}
            index={setIndex}
            set={set}
            onChange={(newSet) => updateSet(exerciseIndex, setIndex, newSet)}
            onDelete={() => handleDeleteSet(exerciseIndex, setIndex)}
          />
        ));
      case "cardio":
        return exercise.sets.map((set, setIndex) => (
          <CardioSet
            key={setIndex}
            index={setIndex}
            set={set}
            onChange={(newSet) => updateSet(exerciseIndex, setIndex, newSet)}
            onDelete={() => handleDeleteSet(exerciseIndex, setIndex)}
          />
        ));
      default:
        return null;
    }
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
    },
  };

  return (
    <div key={index}>
      <div className="mb-4">
        <div>
          <div className="flex justify-between">
            <Label className="flex-1" htmlFor={`exerciseName-${index}`}>
              Exercise Name
            </Label>

            <div className="flex justify-between gap-3 items-center">
              <div>
                {exercise.exerciseType && (
                  <p
                    className={`flex items-center px-2 py-0.5 ${
                      exerciseTypeStyles[exercise.exerciseType]?.bgColor || "bg-gray-200"
                    } rounded-2xl text-xs text-black font-bold`}
                  >
                    {exerciseTypeStyles[exercise.exerciseType]?.icon}
                    {exercise.exerciseType.charAt(0).toUpperCase() +
                      exercise.exerciseType.slice(1)}
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
                  <DropdownMenuItem>Exercise Details</DropdownMenuItem>
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
              onSelectExercise={(exerciseData) =>
                updateExercise(index, {
                  name: exerciseData.name,
                  exerciseType: exerciseData.exerciseType,
                })
              }
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
          <div>{renderSets(exercise, index)}</div>

          <div className="flex flex-col items-center justify-center mb-8 mt-6">
            <Button type="button" onClick={() => addSet(index)}>
              <Plus />
            </Button>
          </div>
        </div>
      )}
      <Separator className="mb-8" />
    </div>
  );
}