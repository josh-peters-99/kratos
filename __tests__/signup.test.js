import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Signup1 } from '@/components/auth/signUpForm';
import { useRouter } from 'next/navigation';

// Mock fetch
global.fetch = jest.fn();

// Mock useRouter
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('Signup1 Form', () => {
  const push = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useRouter.mockReturnValue({ push });
  });

  it('renders the signup form with all fields', () => {
    render(<Signup1 />);

    expect(screen.getByRole('heading', { name: /signup/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/first name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/last name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create an account/i })).toBeInTheDocument();
  });

  it('updates state when typing in inputs', async () => {
    render(<Signup1 />);

    await userEvent.type(screen.getByPlaceholderText(/username/i), 'testuser');
    await userEvent.type(screen.getByPlaceholderText(/first name/i), 'John');
    await userEvent.type(screen.getByPlaceholderText(/last name/i), 'Doe');
    await userEvent.type(screen.getByPlaceholderText(/email/i), 'john@example.com');
    await userEvent.type(screen.getByPlaceholderText(/password/i), 'secret123');

    expect(screen.getByDisplayValue('testuser')).toBeInTheDocument();
    expect(screen.getByDisplayValue('John')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('secret123')).toBeInTheDocument();
  });

  it('submits successfully and redirects on success', async () => {
    fetch.mockResolvedValueOnce({ ok: true });

    render(<Signup1 />);

    await userEvent.type(screen.getByPlaceholderText(/username/i), 'testuser');
    await userEvent.type(screen.getByPlaceholderText(/first name/i), 'John');
    await userEvent.type(screen.getByPlaceholderText(/last name/i), 'Doe');
    await userEvent.type(screen.getByPlaceholderText(/email/i), 'john@example.com');
    await userEvent.type(screen.getByPlaceholderText(/password/i), 'secret123');
    await userEvent.click(screen.getByRole('button', { name: /create an account/i }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/auth/signup', expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: 'testuser',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          password: 'secret123',
        }),
      }));
      expect(push).toHaveBeenCalledWith('/auth/login');
    });
  });

  it('shows error message when API call fails', async () => {
    fetch.mockResolvedValueOnce({ ok: false });

    render(<Signup1 />);

    await userEvent.type(screen.getByPlaceholderText(/username/i), 'testuser');
    await userEvent.type(screen.getByPlaceholderText(/first name/i), 'John');
    await userEvent.type(screen.getByPlaceholderText(/last name/i), 'Doe');
    await userEvent.type(screen.getByPlaceholderText(/email/i), 'john@example.com');
    await userEvent.type(screen.getByPlaceholderText(/password/i), 'secret123');
    await userEvent.click(screen.getByRole('button', { name: /create an account/i }));

    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });
  });

  it('shows validation error when required fields are missing', async () => {
    render(<Signup1 />);

    await userEvent.click(screen.getByRole('button', { name: /create an account/i }));

    await waitFor(() => {
      expect(screen.getByText(/please provide all fields/i)).toBeInTheDocument();
    });
  });
});
