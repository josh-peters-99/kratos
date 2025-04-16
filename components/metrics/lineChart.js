"use client"

import { TrendingUp } from "lucide-react"
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
  visitors: {
    label: "Visitors",
    color: "hsl(var(--chart-2))",
  },
  chrome: {
    label: "Chrome",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "Firefox",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "Edge",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
  weight: {
    label: "Weight",
    color: "var(--color-visitors)"
  },
  cardio: {
    label: "Distance",
  }
}

export function CustomLineChart() {
  const [workouts, setWorkouts] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedExerciseName, setSelectedExerciseName] = useState("");
  const [chartData, setChartData] = useState(null);
  const [selectedExerciseType, setSelectedExerciseType] = useState("");

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
    const selectedChartData = getChartDataForExercise(workouts, selectedExerciseName, selectedExerciseType);
    setChartData(selectedChartData);

    if (!workouts || selectedExerciseName) return;

    // Count exercises
    const exerciseCount = workouts.flatMap(workout => workout.exercises)
      .reduce((acc, ex) => {
        acc[ex.name] = (acc[ex.name] || 0) + 1;
        return acc;
      }, {});
  
    // Find most logged exercise
    const mostLogged = Object.entries(exerciseCount)
      .sort((a, b) => b[1] - a[1])[0]?.[0];
  
    if (mostLogged) {
      setSelectedExerciseName(mostLogged);
    }
  }, [selectedExerciseName, workouts]);

  const getChartDataForExercise = (workouts, exerciseName, exerciseType) => {
    if (!workouts) return [];
  
    return workouts
      .flatMap(workout => {
        const date = new Date(workout.date).toISOString().split("T")[0];
        return workout.exercises
          .filter(ex => ex.name === exerciseName)
          .map(ex => {
            const isCardio = exerciseType === "cardio";
            if (isCardio) {
              const maxDist = ex.sets.reduce((max, s) =>
                s.distance > (max?.distance ?? 0) ? s : max, null
              );
              return {
                date,
                distance: maxDist?.distance ?? 0,
                duration: ((ex.hours * 3600) + (ex.minutes * 60) + (ex.seconds))
              };
            } else {
              const maxSet = ex.sets.reduce((max, s) =>
                s.weight > (max?.weight ?? 0) ? s : max, null
              );
              return {
                date,
                weight: maxSet?.weight ?? 0,
                reps: maxSet?.reps ?? 0,
              };
            }
          });
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };  

  const dateRange = useMemo(() => {
    if (!chartData || chartData.length === 0) return null;
  
    const firstDate = format(new Date(chartData[0].date), "MMMM d, yyyy");
    const lastDate = format(new Date(chartData[chartData.length - 1].date), "MMMM d, yyyy");
  
    return `${firstDate} - ${lastDate}`;
  }, [chartData]);

  const trendText = useMemo(() => {
    if (!chartData || chartData.length < 2) return "Not enough data yet";
    const key = selectedExerciseType === "cardio" ? "distance" : "weight";
    const first = chartData[0][key];
    const last = chartData[chartData.length - 1][key];
    const diff = last - first;
    const percent = ((diff / first) * 100).toFixed(1);
    return diff >= 0
      ? `Up ${percent}% since your first log`
      : `Down ${Math.abs(percent)}% since your first log`;
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
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 24,
              left: 24,
              right: 24,
            }}
          >
            <CartesianGrid vertical={false} />

            <YAxis
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
              tickFormatter={(value) =>
                selectedExerciseType === "cardio" ? `${value} mi` : `${value} lbs`
              }
              domain={['dataMin - 5', 'dataMax + 5']}
              ticks={generateTicks(chartData, 5)}
            />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="line"
                  nameKey={selectedExerciseType === "cardio" ? "cardio" : "weight"}
                  hideLabel
                />
              }
            />
            <Line
              dataKey={selectedExerciseType === "cardio" ? "distance" : "weight"}
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
          {trendText} <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          {/* Based on {chartData?.length ?? 0} workout logs */}
          {selectedExerciseType === "cardio"
            ? `Longest distance: ${maxDistance} mi`
            : `Highest weight: ${maxWeight} lbs | Avg reps: ${avgReps}`
          }
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