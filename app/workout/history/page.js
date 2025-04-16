"use client"

import { useState, useEffect, useMemo } from "react";
import { fetchWorkouts } from "@/lib/api/workout";
import { format } from "date-fns";

export default function WorkoutHistory() {
  const [workouts, setWorkouts] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getWorkouts = async () => {
      try {
        const data = await fetchWorkouts();
        setWorkouts(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load workouts")
      } finally {
        setLoading(false);
      }
    };

    getWorkouts();
  }, []);

  return (
    <div>

    </div>
  )
}