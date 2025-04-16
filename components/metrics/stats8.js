"use client"

import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchUserMetrics } from "@/lib/api/userMetrics";

const Stats8 = ({
  heading = "Timeline Stats",
  description = "Ensuring stability and scalability for all users",
  link = {
    text: "Read the full impact report",
    url: "https://www.shadcnblocks.com",
  }
}) => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getMetrics = async () => {
      try {
        const data = await fetchUserMetrics();
        setMetrics(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load metrics");
      } finally {
        setLoading(false);
      }
    };

    getMetrics();
  }, []);

  function getCurrentISOWeek() {
    const now = new Date();
    const year = now.getUTCFullYear();
  
    // Get the ISO week number
    const jan1 = new Date(Date.UTC(year, 0, 1));
    const dayOfYear = Math.floor((now - jan1 + (jan1.getUTCDay() + 6) % 7 * 86400000) / 86400000);
    const week = Math.ceil((dayOfYear + 1) / 7);
  
    // Pad week with leading zero if necessary
    const weekStr = `W${String(week).padStart(2, "0")}`;
    return `${year}-${weekStr}`;
  };  

  function getCurrentMonthKey() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0"); // zero-padded
    return `${year}-${month}`; // e.g., "2025-04"
  }
  
  function getCurrentYearKey() {
    return new Date().getFullYear().toString(); // e.g., "2025"
  }  

  const currentWeekKey = getCurrentISOWeek();
  const currentMonthKey = getCurrentMonthKey();
  const currentYearKey = getCurrentYearKey();

  const dynamicStats = metrics
  ? [
      {
        id: "stat-1",
        value: metrics.totalWorkouts ?? 0,
        label: "Total Workouts Logged",
      },
      {
        id: "stat-2",
        value: metrics?.yearlyWorkouts?.[currentYearKey] ?? 0,
        label: "Workouts This Year",
      },
      {
        id: "stat-3",
        value: metrics?.monthlyWorkouts?.[currentMonthKey] ?? 0,
        label: "Workouts This Month",
      },
      {
        id: "stat-4",
        value: metrics.weeklyWorkouts?.[currentWeekKey] ?? 0,
        label: "Workouts This Week",
      },
    ]
  : [];

  return (
    <section className="py-10">
      <div className="">
        {/* <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold md:text-4xl">{heading}</h2>
        </div> */}
        <div className="mt-14 grid gap-x-5 gap-y-8 md:grid-cols-2 lg:grid-cols-4">
          {loading && <p>Loading stats...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading &&
            !error &&
            dynamicStats.map((stat) => (
              <div key={stat.id} className="flex flex-col gap-5">
                <div className="text-6xl font-bold">{stat.value}</div>
                <p>{stat.label}</p>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export { Stats8 };
