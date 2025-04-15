export async function fetchWorkout() {
  const res = await fetch("/api/workouts");
  if (!res.ok) throw new Error("Failed to fetch workouts");
  return res.json();
}

export async function createWorkout(data) {
  const res = await fetch("/api/workouts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}