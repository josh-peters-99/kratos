"use client"

import { useState, useEffect } from "react";
import { fetchWorkouts, createWorkout, updateWorkout, deleteWorkout } from "@/lib/api/workouts";

export default function Workout() {
    const [title, setTitle] = useState("");
    const [maxDate, setMaxDate] = useState("");
    const [workoutDate, setWorkoutDate] = useState("");
    const [workout, setWorkout] = useState(null);
    const [notes, setNotes] = useState("");
    const [typingTimeout, setTypingTimeout] = useState(null);
    const [mounted, setMounted] = useState(false);

    // Ensure component is mounted before trying to create a new workout. Prevents the creation of two workouts on page load
    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        setMaxDate(today.toISOString().split("T")[0]);

        async function loadOrCreateWorkout() {
            let storedWorkoutId = sessionStorage.getItem("tempWorkoutId");

            if (storedWorkoutId) {
                const workouts = await fetchWorkouts();
                const existingWorkout = workouts.find(w => w._id === storedWorkoutId);

                if (existingWorkout) {
                    setWorkout(existingWorkout);
                    setTitle(existingWorkout.title);
                    setWorkoutDate(existingWorkout.date);
                    setNotes(existingWorkout.notes);
                    return;
                } else {
                    sessionStorage.removeItem("tempWorkoutId"); // Cleanup if workout is missing
                }
            }

            // No stored workout, create a new one
            const newWorkout = await createWorkout({ title: "New Workout", date: new Date(), notes: "" });
            setWorkout(newWorkout);
            setTitle(newWorkout.title);
            setWorkoutDate(newWorkout.date);
            setNotes(newWorkout.notes);
            sessionStorage.setItem("tempWorkoutId", newWorkout._id);
        }

        loadOrCreateWorkout();
    }, [mounted]);

    useEffect(() => {
        if (workout) {
            if (typingTimeout) clearTimeout(typingTimeout);

            const timeout = setTimeout(async () => {
                await updateWorkout(workout._id, { title, date: workoutDate, notes });
            }, 500); // 500ms debounce

            setTypingTimeout(timeout);
        }
    }, [title, workoutDate, notes]);

    async function handleSubmit(event) {
        event.preventDefault();
        sessionStorage.removeItem("tempWorkoutId");
        alert("Workout saved!");
    }

    return (
        <section className="px-10">
            <form className="flex flex-col gap-5">
                <div>
                    <label>Workout Title</label>
                    <input 
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="workoutDate">Date</label>
                    <input 
                        type="date"
                        id="workoutDate"
                        max={maxDate}
                        value={workoutDate ? new Date(workoutDate).toISOString().split("T")[0] : ""}
                        onChange={(e) => setWorkoutDate(e.target.value)}
                        required
                    />
                </div>
                <div className="flex flex-col">
                    <label>Notes</label>
                    <textarea
                        id="notes"
                        rows={4}
                        value={notes}
                        className="text-black px-3 py-2 rounded-md"
                        onChange={(e) => setNotes(e.target.value)}
                    ></textarea>
                </div>

                <button type="submit">
                    Save Workout
                </button>
            </form>
        </section>
    )
}