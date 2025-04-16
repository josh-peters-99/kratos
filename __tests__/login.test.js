import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from "@testing-library/user-event"
import { signIn } from 'next-auth/react'
import { Login3 } from '@/components/auth/loginForm'

jest.mock("next-auth/react");
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
  }),
}));

 
describe('Login Page', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Reset mock before each test
    });
    
    it('renders the sign-in form correctly', () => {
        render(<Login3 />)

        expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/enter your username/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/enter your password/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();    
    })

    it("allows the user to type into input fields", async () => {
        render(<Login3 />);

        const usernameInput = screen.getByPlaceholderText(/enter your username/i);
        const passwordInput = screen.getByPlaceholderText(/enter your password/i);

        await userEvent.type(usernameInput, "JohnDoe");
        await userEvent.type(passwordInput, "Test@123");

        expect(usernameInput).toHaveValue("JohnDoe");
        expect(passwordInput).toHaveValue("Test@123");
    })

    it("calls signIn when form is submitted", async () => {
        signIn.mockResolvedValueOnce({ ok: true });
    
        render(<Login3 />);
    
        await userEvent.type(screen.getByPlaceholderText(/enter your username/i), "JohnDoe");
        await userEvent.type(screen.getByPlaceholderText(/enter your password/i), "Test@123");
        await userEvent.click(screen.getByRole("button", { name: /log in/i }));
    
        expect(signIn).toHaveBeenCalledWith("credentials", {
          userName: "JohnDoe",
          password: "Test@123",
          redirect: false,
          // callbackUrl: "/",
        });
      });
    
      it("handles sign-in errors properly", async () => {
        signIn.mockResolvedValueOnce({ error: "Invalid credentials" });
    
        render(<Login3 />);
    
        await userEvent.type(screen.getByPlaceholderText(/enter your username/i), "wrongusername");
        await userEvent.type(screen.getByPlaceholderText(/enter your password/i), "wrongpassword");
        await userEvent.click(screen.getByRole("button", { name: /log in/i }));
    
        expect(signIn).toHaveBeenCalled();
        // You may need to modify your SignIn component to show an error message for this to work.
      });
})