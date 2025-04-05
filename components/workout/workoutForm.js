import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'; 
import { Label } from '@/components/ui/label';

const WorkoutForm = () => {
  const [workoutData, setWorkoutData] = useState({
    userId: '',
    title: '',
    date: '',
    notes: '',
    exercises: [{ exerciseType: '', exerciseName: '', sets: [] }],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWorkoutData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleExerciseChange = (index, e) => {
    const { name, value } = e.target;
    const updatedExercises = [...workoutData.exercises];
    updatedExercises[index][name] = value;
    setWorkoutData((prevState) => ({
      ...prevState,
      exercises: updatedExercises,
    }));
  };

  const handleAddExercise = () => {
    setWorkoutData((prevState) => ({
      ...prevState,
      exercises: [...prevState.exercises, { exerciseType: '', exerciseName: '', sets: [] }],
    }));
  };

  const handleAddSet = (exerciseIndex) => {
    const updatedExercises = [...workoutData.exercises];
    updatedExercises[exerciseIndex].sets.push({
      setType: '',
      setCount: '',
      reps: '',
      weight: '',
      time: '',
    });
    setWorkoutData({ ...workoutData, exercises: updatedExercises });
  };

  const handleRemoveSet = (exerciseIndex, setIndex) => {
    const updatedExercises = [...workoutData.exercises];
    updatedExercises[exerciseIndex].sets.splice(setIndex, 1);
    setWorkoutData({ ...workoutData, exercises: updatedExercises });
  };

  const handleSetChange = (exerciseIndex, setIndex, e) => {
    const { name, value } = e.target;
    const updatedExercises = [...workoutData.exercises];
    updatedExercises[exerciseIndex].sets[setIndex][name] = value;
    setWorkoutData({ ...workoutData, exercises: updatedExercises });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(workoutData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-[500px]">
      <div>
        <Label htmlFor="title">Workout Title</Label>
        <Input
          type="text"
          id="title"
          name="title"
          value={workoutData.title}
          onChange={handleChange}
          required
          className="mt-2"
        />
      </div>
      <div>
        <Label htmlFor="date">Date</Label>
        <Input
          type="date"
          id="date"
          name="date"
          value={workoutData.date}
          onChange={handleChange}
          required
          className="mt-2"
        />
      </div>
      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          value={workoutData.notes}
          onChange={handleChange}
          rows="4"
          className="mt-2"
        />
      </div>

      <div>
        <Label>Exercises</Label>
        {workoutData.exercises.map((exercise, exerciseIndex) => (
          <div key={exerciseIndex} className="space-y-4">
            <div>
              <Label htmlFor={`exerciseType-${exerciseIndex}`}>Exercise Type</Label>
              <Select
                id={`exerciseType-${exerciseIndex}`}
                name="exerciseType"
                value={exercise.exerciseType}
                onChange={(e) => handleExerciseChange(exerciseIndex, e)}
                className="mt-2"
              >
                <SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weighted_lift">Weighted Lift</SelectItem>
                    <SelectItem value="bodyweight">Bodyweight</SelectItem>
                    <SelectItem value="timed">Timed</SelectItem>
                    <SelectItem value="cardio">Cardio</SelectItem>
                  </SelectContent>
                </SelectTrigger>
              </Select>
            </div>
            <div>
              <Label htmlFor={`exerciseName-${exerciseIndex}`}>Exercise Name</Label>
              <Input
                type="text"
                id={`exerciseName-${exerciseIndex}`}
                name="exerciseName"
                value={exercise.exerciseName}
                onChange={(e) => handleExerciseChange(exerciseIndex, e)}
                required
                className="mt-2"
              />
            </div>

            {/* Add Sets for the current exercise */}
            <div>
              <Label>Sets</Label>
              {exercise.sets.map((set, setIndex) => (
                <div key={setIndex} className="space-y-2">
                  <div>
                    <Label htmlFor={`setType-${exerciseIndex}-${setIndex}`}>Set Type</Label>
                    <Select
                      id={`setType-${exerciseIndex}-${setIndex}`}
                      name="setType"
                      value={set.setType}
                      onChange={(e) => handleSetChange(exerciseIndex, setIndex, e)}
                      className="mt-2"
                    >
                      <SelectTrigger>
                        <SelectContent>
                          <SelectItem value="warmup">Warmup</SelectItem>
                          <SelectItem value="working">Working</SelectItem>
                          <SelectItem value="drop">Drop</SelectItem>
                          <SelectItem value="reverse_drop">Reverse Drop</SelectItem>
                        </SelectContent>
                      </SelectTrigger>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor={`setCount-${exerciseIndex}-${setIndex}`}>Set Count</Label>
                    <Input
                      type="text"
                      id={`setCount-${exerciseIndex}-${setIndex}`}
                      name="setCount"
                      value={set.setCount}
                      onChange={(e) => handleSetChange(exerciseIndex, setIndex, e)}
                      required
                      className="mt-2"
                    />
                  </div>
                  {(exercise.exerciseType === 'weighted_lift' || exercise.exerciseType === 'bodyweight') && (
                    <div>
                      <Label htmlFor={`reps-${exerciseIndex}-${setIndex}`}>Reps</Label>
                      <Input
                        type="number"
                        id={`reps-${exerciseIndex}-${setIndex}`}
                        name="reps"
                        value={set.reps}
                        onChange={(e) => handleSetChange(exerciseIndex, setIndex, e)}
                        min="1"
                        className="mt-2"
                      />
                    </div>
                  )}
                  {(exercise.exerciseType === 'weighted_lift' || exercise.exerciseType === 'bodyweight') && (
                    <div>
                      <Label htmlFor={`weight-${exerciseIndex}-${setIndex}`}>Weight</Label>
                      <Input
                        type="number"
                        id={`weight-${exerciseIndex}-${setIndex}`}
                        name="weight"
                        value={set.weight}
                        onChange={(e) => handleSetChange(exerciseIndex, setIndex, e)}
                        min="0"
                        className="mt-2"
                      />
                    </div>
                  )}
                  {exercise.exerciseType === 'timed' && (
                    <div>
                      <Label htmlFor={`time-${exerciseIndex}-${setIndex}`}>Time (in seconds)</Label>
                      <Input
                        type="number"
                        id={`time-${exerciseIndex}-${setIndex}`}
                        name="time"
                        value={set.time}
                        onChange={(e) => handleSetChange(exerciseIndex, setIndex, e)}
                        min="0"
                        className="mt-2"
                      />
                    </div>
                  )}
                  <Button
                    type="button"
                    onClick={() => handleRemoveSet(exerciseIndex, setIndex)}
                    className="mt-2 bg-red-500 hover:bg-red-600"
                  >
                    Remove Set
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                onClick={() => handleAddSet(exerciseIndex)}
                className="mt-4 bg-blue-500 hover:bg-blue-600"
              >
                Add Set
              </Button>
            </div>
          </div>
        ))}
        <Button
          type="button"
          onClick={handleAddExercise}
          className="mt-4 bg-blue-500 hover:bg-blue-600"
        >
          Add Exercise
        </Button>
      </div>

      <Button type="submit" className="mt-4 bg-green-500 hover:bg-green-600">
        Submit Workout
      </Button>
    </form>
  );
};

export default WorkoutForm;


