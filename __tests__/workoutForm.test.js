import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WorkoutForm from '@/components/workout-form/workoutForm';
import { useRouter } from 'next/navigation';
import { createWorkout } from '@/lib/api/workout';

// Mock fetch and createWorkout
global.fetch = jest.fn();

// Mock useRouter
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock createWorkout
jest.mock('../lib/api/workout.js', () => ({
  createWorkout: jest.fn(),
}));

describe('WorkoutForm', () => {
  const push = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useRouter.mockReturnValue({ push });
    localStorage.clear();
  });

  it('renders the workout form fields', async () => {
    render(<WorkoutForm />);

    expect(await screen.findByRole('heading', { name: /create a new workout/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/workout title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/workout notes/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /exercise/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /discard workout/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save workout/i })).toBeInTheDocument();
  });

  it('updates workout title and notes', async () => {
    render(<WorkoutForm />);

    const titleInput = screen.getByLabelText(/workout title/i);
    const notesInput = screen.getByLabelText(/workout notes/i);

    await userEvent.type(titleInput, 'Leg Day');
    await userEvent.type(notesInput, 'Heavy squats and lunges');

    expect(titleInput).toHaveValue('Leg Day');
    expect(notesInput).toHaveValue('Heavy squats and lunges');
  });

  it('adds a new exercise when clicking "Exercise" button', async () => {
    render(<WorkoutForm />);

    await userEvent.click(screen.getByRole('button', { name: /exercise/i }));

    expect(await screen.findAllByText(/exercise name/i)).toHaveLength(1);
  });

  it('saves workout and redirects on success', async () => {
    createWorkout.mockResolvedValueOnce({ id: 'workout123' });

    render(<WorkoutForm />);

    const titleInput = screen.getByLabelText(/workout title/i);
    const notesInput = screen.getByLabelText(/workout notes/i);

    await userEvent.type(titleInput, 'Push Day');
    await userEvent.type(notesInput, 'Chest, shoulders, triceps');

    await userEvent.click(screen.getByRole('button', { name: /save workout/i }));

    await waitFor(() => {
      expect(createWorkout).toHaveBeenCalled();
      expect(push).toHaveBeenCalledWith('/');
    });
  });

  it('discards workout and redirects', async () => {
    render(<WorkoutForm />);

    await userEvent.click(screen.getByRole('button', { name: /discard workout/i }));

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith('/');
    });
  });
});

