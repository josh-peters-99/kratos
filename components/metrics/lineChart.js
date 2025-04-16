"use client"

import { TrendingUp, TrendingDown } from "lucide-react"
import { CartesianGrid, Dot, Line, LineChart, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import ExerciseNameInput from "../workout-form/exerciseNameInput";
import { useState, useEffect, useMemo } from "react";
import { fetchWorkouts } from "@/lib/api/workout";
import { format } from "date-fns";

const chartConfig = {
  weighted: {
    label: "Weight",
    color: "var(--color-visitors)"
  },
  cardio: {
    label: "Distance",
  },
  bodyweight: {
    label: "Reps",
  },
  timed: {
    label: "Duration",
  }
}

export function CustomLineChart() {
  const [workouts, setWorkouts] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedExerciseName, setSelectedExerciseName] = useState("");
  const [chartData, setChartData] = useState(null);
  const [selectedExerciseType, setSelectedExerciseType] = useState("");
  const [chartMargin, setChartMargin] = useState({ top: 24, left: 24, right: 24 });

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

  useEffect(() => {
    const handleResize = () => {
      setChartMargin({
        top: 24,
        left: window.innerWidth < 640 ? 16 : 24,
        right: 24,
      });
    };
  
    handleResize(); // set initial margin
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Step 1: Determine most logged exercise once workouts are loaded
  useEffect(() => {
    if (!workouts || selectedExerciseName) return;

    const exerciseCount = workouts.flatMap(workout => workout.exercises)
      .reduce((acc, ex) => {
        acc[ex.name] = (acc[ex.name] || 0) + 1;
        return acc;
      }, {});

    const mostLogged = Object.entries(exerciseCount)
      .sort((a, b) => b[1] - a[1])[0]?.[0];

    if (mostLogged) {
      const matchingExercise = workouts.flatMap(w => w.exercises)
        .find(ex => ex.name === mostLogged);
      setSelectedExerciseName(mostLogged);
      setSelectedExerciseType(matchingExercise?.exerciseType || "weighted");
    }
  }, [workouts, selectedExerciseName]);

  // Step 2: Once name + type are set, update chart
  useEffect(() => {
    if (!selectedExerciseName || !selectedExerciseType || !workouts) return;

    const selectedChartData = getChartDataForExercise(workouts, selectedExerciseName, selectedExerciseType);
    setChartData(selectedChartData);
  }, [selectedExerciseName, selectedExerciseType, workouts]);

  const getChartDataForExercise = (workouts, exerciseName, exerciseType) => {
    if (!workouts) return [];

    console.log(exerciseType)
  
    return workouts
      .flatMap(workout => {
        const date = new Date(workout.date).toISOString().split("T")[0];
        return workout.exercises
          .filter(ex => ex.name === exerciseName)
          .map(ex => {
            switch (exerciseType) {
              case "cardio": {
                const maxDist = ex.sets.reduce((max, s) =>
                  s.distance > (max?.distance ?? 0) ? s : max, null
                );
                return {
                  date,
                  distance: maxDist?.distance ?? 0,
                  duration: ((ex.hours * 3600) + (ex.minutes * 60) + (ex.seconds))
                };
              }
              case "weighted": {
                const maxSet = ex.sets.reduce((max, s) =>
                  s.weight > (max?.weight ?? 0) ? s : max, null
                );
                return {
                  date,
                  weight: maxSet?.weight ?? 0,
                  reps: maxSet?.reps ?? 0,
                };
              }
              case "bodyweight": {
                const maxReps = ex.sets.reduce((max, s) =>
                  s.reps > (max?.reps ?? 0) ? s : max, null
                );
                return {
                  date,
                  reps: maxReps?.reps ?? 0,
                };
              }
              case "timed": {
                return {
                  date,
                  duration: ((ex.hours * 3600) + (ex.minutes * 60) + (ex.seconds))
                };
              }
              default:
                return null;
            }
          });
      })
      .filter(Boolean)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }; 

  const dateRange = useMemo(() => {
    if (!chartData || chartData.length === 0) return null;
  
    const firstDate = format(new Date(chartData[0].date), "MMMM d, yyyy");
    const lastDate = format(new Date(chartData[chartData.length - 1].date), "MMMM d, yyyy");
  
    return `${firstDate} - ${lastDate}`;
  }, [chartData]);

  const { trendText, trendValue } = useMemo(() => {
    if (!chartData || chartData.length < 2) {
      return { trendText: "Not enough data yet", trendValue: 0 };
    }
    const key = selectedExerciseType === "cardio"
      ? "distance"
      : selectedExerciseType === "weighted"
      ? "weight"
      : selectedExerciseType === "bodyweight"
      ? "reps"
      : selectedExerciseType === "timed"
      ? "duration"
      : "weight"; // fallback
    const first = chartData[0][key];
    const last = chartData[chartData.length - 1][key];
    const diff = last - first;
    const percent = ((diff / first) * 100).toFixed(1);
    const trendText = diff >= 0
      ? `Up ${percent}% since your first log`
      : `Down ${Math.abs(percent)}% since your first log`;
    return { trendText, trendValue: diff };
  }, [chartData, selectedExerciseName]);

  const maxWeight = chartData?.length
  ? Math.max(...chartData.map(d => d.weight))
  : 0;

  const maxDistance = chartData?.length
  ? Math.max(...chartData.map(d => d.distance))
  : 0;

  const avgReps = chartData?.length
  ? Math.round(chartData.reduce((sum, d) => sum + d.reps, 0) / chartData.length)
  : 0;

  const nameKeyMap = {
    cardio: "cardio",
    weight: "weighted",
    bodyweight: "bodyweight",
    timed: "timed"
  };

  return (
    <Card className="mt-5 w-full bg-background">
      <CardHeader>
        <CardTitle>Exercise Progression</CardTitle>
        <ExerciseNameInput
            value={selectedExerciseName}
            onSelectExercise={(exerciseData) => {
              const { name, exerciseType } = exerciseData;
              setSelectedExerciseName(name);
              setSelectedExerciseType(exerciseType);

              const updateChartData = getChartDataForExercise(
                workouts,
                exerciseData.name,
                exerciseData.exerciseType
              );
              setChartData(updateChartData);
            }}
          />
        <CardDescription>
          <span className="font-bold">{selectedExerciseName}</span> | <span className="italic">{dateRange || "No date available. Search for an exercise."}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0 md:px-6">
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={chartMargin}
          >
            <CartesianGrid vertical={false} />

            <YAxis
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
              tickFormatter={(value) => {
                switch (selectedExerciseType) {
                  case "cardio":
                    return `${value} mi`;
                  case "weighted":
                    return `${value} lbs`;
                  case "bodyweight":
                    return `${value} reps`;
                  case "timed":
                    const mins = Math.floor(value / 60);
                    const secs = value % 60;
                    return `${mins}m ${secs}s`;
                  default:
                    return value;
                }
              }}              
              domain={['dataMin - 5', 'dataMax + 5']}
              ticks={generateTicks(chartData, 5)}
            />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="line"
                  nameKey={nameKeyMap[selectedExerciseType] || "weighted"}
                  hideLabel
                />
              }
            />
            <Line
              dataKey={
                selectedExerciseType === "cardio" ? "distance" :
                selectedExerciseType === "weighted" ? "weight" :
                selectedExerciseType === "bodyweight" ? "reps" :
                selectedExerciseType === "timed" ? "duration" :
                "weight"
              }
              type="natural"
              stroke="var(--foreground)"
              strokeWidth={2}
              dot={({ payload, ...props }) => {
                return (
                  <Dot
                    key={payload.date}
                    r={5}
                    cx={props.cx}
                    cy={props.cy}
                    fill={"var(--foreground)"}
                    stroke={payload.fill}
                  />
                )
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          {trendText}
          {trendValue < 0 ? (
            <TrendingDown className="h-4 w-4 text-red-500" />
          ) : (
            <TrendingUp className="h-4 w-4 text-green-500" />
          )}
        </div>
        <div className="leading-none text-muted-foreground">
          {selectedExerciseType === "cardio"
            ? `Longest distance: ${maxDistance} mi`
            : selectedExerciseType === "weighted"
            ? `Highest weight: ${maxWeight} lbs | Avg reps: ${avgReps}`
            : selectedExerciseType === "bodyweight"
            ? `Max reps: ${Math.max(...chartData.map(d => d.reps || 0))}`
            : selectedExerciseType === "timed"
            ? `Longest duration: ${Math.max(...chartData.map(d => d.duration || 0))} seconds`
            : null}
        </div>
      </CardFooter>
    </Card>
  )
}

const generateTicks = (data, interval = 5) => {
  if (!data || data.length === 0) return [];

  const weights = data.map(d => d.weight);
  const min = Math.floor(Math.min(...weights) / interval) * interval;
  const max = Math.ceil(Math.max(...weights) / interval) * interval;

  const ticks = [];
  for (let i = min; i <= max; i += interval) {
    ticks.push(i);
  }

  return ticks;
};



// const chartData = [
//   { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
//   { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
//   { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
//   { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
//   { browser: "other", visitors: 90, fill: "var(--color-other)" },
// ]

  // const getChartDataForExercise = (workouts, exerciseName, exerciseType) => {
  //   if (!workouts) return [];
  
  //   return workouts
  //     .flatMap(workout => {
  //       const date = new Date(workout.date).toISOString().split("T")[0];
  //       return workout.exercises
  //         .filter(ex => ex.name === exerciseName)
  //         .map(ex => {
  //           const isCardio = exerciseType === "cardio";
  //           if (isCardio) {
  //             const maxDist = ex.sets.reduce((max, s) =>
  //               s.distance > (max?.distance ?? 0) ? s : max, null
  //             );
  //             return {
  //               date,
  //               distance: maxDist?.distance ?? 0,
  //               duration: ((ex.hours * 3600) + (ex.minutes * 60) + (ex.seconds))
  //             };
  //           } else {
  //             const maxSet = ex.sets.reduce((max, s) =>
  //               s.weight > (max?.weight ?? 0) ? s : max, null
  //             );
  //             return {
  //               date,
  //               weight: maxSet?.weight ?? 0,
  //               reps: maxSet?.reps ?? 0,
  //             };
  //           }
  //         });
  //     })
  //     .sort((a, b) => new Date(a.date) - new Date(b.date));
  // }; 