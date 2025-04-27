'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { useSession } from 'next-auth/react';
import { fetchWorkouts } from '@/lib/api/workout';

export default function WorkoutHistoryPage() {
  const [workouts, setWorkouts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();
  const { data: session } = useSession();

  const userId = session?.user.id; // Replace with dynamic userId if needed
  const limit = 5; // Workouts per page

  const lastWorkoutRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    const getWorkouts = async () => {
      const data = await fetchWorkouts();
      setWorkouts(data);
    //   setLoading(true);
    //   try {
    //     const res = await fetch(`/api/workouts?userId=${userId}&page=${page}&limit=${limit}`);
    //     const data = await res.json();

    //     if (data.length < limit) {
    //       setHasMore(false);
    //     }

    //     setWorkouts((prev) => [...prev, ...data]);
    //   } catch (error) {
    //     console.error('Failed to fetch workouts', error);
    //   } finally {
    //     setLoading(false);
    //   }
    };

    getWorkouts();
  }, [page, userId]);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Workout History</h1>

      {workouts.map((workout, index) => {
        const isLastWorkout = workouts.length === index + 1;

        return (
          <Card
            key={workout._id}
            ref={isLastWorkout ? lastWorkoutRef : null}
            className="mb-4"
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">{workout.title}</h2>
                <span className="text-sm text-gray-500">
                  {format(new Date(workout.date), 'PPP')}
                </span>
              </div>

              <p className="text-sm text-gray-600 mt-1">Time: {workout.time}</p>

              <div className="mt-4">
                {workout.exercises.map((exercise) => (
                  <div key={exercise._id} className="mb-2">
                    <p className="font-medium">{exercise.name}</p>
                    <ul className="text-sm text-gray-600 ml-4">
                      {exercise.sets.map((set) => (
                        <li key={set._id}>
                          {exercise.exerciseType === 'bodyweight'
                            ? `${set.reps} reps`
                            : `${set.reps} reps @ ${set.weight} lbs`}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {loading && (
        <div className="space-y-4">
          <Skeleton className="h-32 w-full rounded-lg" />
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>
      )}

      {!hasMore && !loading && (
        <p className="text-center text-gray-500 mt-6">No more workouts to show.</p>
      )}
    </div>
  );
}
