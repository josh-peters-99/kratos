"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchWorkouts, createWorkout, updateWorkout, deleteWorkout } from "@/lib/api/workouts";

export default function Workout() {
    const router = useRouter();
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
        router.push("/");
    }

    return (
        <section className="px-10 mt-8">
            <div className="flex w-full justify-between items-center">
                <h1 className="font-bold text-3xl">New Workout</h1>
                <div>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="h-8 w-8 fill-current text-white">
                    <path d="M8 256a56 56 0 1 1 112 0A56 56 0 1 1 8 256zm160 0a56 56 0 1 1 112 0 56 56 0 1 1 -112 0zm216-56a56 56 0 1 1 0 112 56 56 0 1 1 0-112z"/>
                </svg>
                </div>
            </div>
            <form className="flex flex-col gap-5 mt-5" onSubmit={handleSubmit}>
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
                    Finish Workout
                </button>
            </form>
        </section>
    )
}