

export async function fetchUserMetrics() {
  const res = await fetch("/api/userMetrics");
  if (!res.ok) throw new Error("Failed to fetch user metrics");
  return res.json();
}