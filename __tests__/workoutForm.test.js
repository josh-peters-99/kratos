/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import WorkoutForm from "@/components/form/workoutForm";
import { useRouter } from "next/navigation";

// Mock child components
jest.mock("@/components/form/workoutTitleInput", () => (props) => (
  <input
    data-testid="title-input"
    value={props.title}
    onChange={(e) => props.setTitle(e.target.value)}
  />
));
jest.mock("@/components/form/datePicker", () => ({
  DatePicker: ({ date, setDate }) => (
    <input
      data-testid="date-picker"
      value={date || ""}
      onChange={(e) => setDate(e.target.value)}
    />
  ),
}));
jest.mock("@/components/form/timePicker", () => ({
  TimePicker: ({ time, setTime }) => (
    <input
      data-testid="time-picker"
      value={time || ""}
      onChange={(e) => setTime(e.target.value)}
    />
  ),
}));
jest.mock("@/components/form/exerciseCard", () => () => (
  <div data-testid="exercise-card">ExerciseCard</div>
));

// Mock API and router
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));
jest.mock("@/lib/api/workout", () => ({
  createWorkout: jest.fn(() => Promise.resolve({ id: "mockWorkoutId" })),
}));

describe("WorkoutForm", () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    useRouter.mockReturnValue({ push: pushMock });
    localStorage.clear();
    pushMock.mockClear();
  });

  it("renders without crashing after hydration", async () => {
    render(<WorkoutForm />);
    await waitFor(() => {
      expect(screen.getByText("Create a New Workout")).toBeInTheDocument();
    });
  });

  it("loads and saves to localStorage", async () => {
    render(<WorkoutForm />);

    const titleInput = screen.getByTestId("title-input");
    fireEvent.change(titleInput, { target: { value: "Test Workout" } });

    await waitFor(() => {
      const saved = JSON.parse(localStorage.getItem("workoutForm"));
      expect(saved.title).toBe("Test Workout");
    });
  });

  it("adds an exercise", async () => {
    render(<WorkoutForm />);

    const addButton = screen.getByText(/Exercise/i);
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByTestId("exercise-card")).toBeInTheDocument();
    });
  });

  it("saves workout to the database and clears localStorage", async () => {
    const workoutData = {
      title: "Workout A",
      date: "2024-01-01",
      time: "10:00",
      notes: "Leg day",
      exercises: [],
    };
    localStorage.setItem("workoutForm", JSON.stringify(workoutData));

    render(<WorkoutForm />);

    const saveButton = screen.getByText(/Save Workout/i);
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(localStorage.getItem("workoutForm")).toBeNull();
      expect(pushMock).toHaveBeenCalledWith("/");
    });
  });

  it("discards the workout and navigates home", async () => {
    localStorage.setItem("workoutForm", JSON.stringify({ title: "Temp" }));

    render(<WorkoutForm />);
    const discardButton = screen.getByText(/Discard Workout/i);
    fireEvent.click(discardButton);

    await waitFor(() => {
      expect(localStorage.getItem("workoutForm")).toBeNull();
      expect(pushMock).toHaveBeenCalledWith("/");
    });
  });
});
