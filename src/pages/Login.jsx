import { useState } from "react"; import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../components/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../utils";

// Define Zod schema for login validation
const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required")
});

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth(); // Use login function from AuthContext
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const handleLogin = async (formData) => {
    setMessage(null);
    setIsLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        credentials: 'include',
        body: JSON.stringify({
          email: formData.email.trim().toLowerCase(),
          password: formData.password
        }),
      });

      // Check response content type
      const contentType = res.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        const text = await res.text();
        throw new Error(`Server error: ${text.slice(0, 100)}`);
      }

      const responseData = await res.json();

      // Handle API errors
      if (!res.ok || !responseData.success) {
        const errorMsg = responseData.message || `Login failed (${res.status})`;
        throw new Error(errorMsg);
      }

      // Extract data from response
      const { user: userData, access_token, refresh_token } = responseData.data;

      // Update auth context
      if (login) {
        login({
          id: userData.id,
          email: userData.email,
          name: userData.name || `${userData.first_name} ${userData.last_name}`,
          role: userData.role
        });
      }

      // Store tokens and user data
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      localStorage.setItem('user_id', userData.id);
      localStorage.setItem('user_role', userData.role);
      localStorage.setItem('user_name', userData.name || `${userData.first_name} ${userData.last_name}`);
      localStorage.setItem('user_email', userData.email);

      // Show success message
      setMessage({
        type: "success",
        text: responseData.message || "Login successful! Redirecting..."
      });

      reset(); // Reset form fields
      setTimeout(() => navigate("/home"), 1500);

    } catch (error) {
      console.error("Login Error:", error);
      setMessage({
        type: "error",
        text: error.message || "An unexpected error occurred"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-blue-950 to-red-950 font-inter text-white relative overflow-hidden p-4 sm:p-6 lg:p-8">
      <div className="relative z-10 max-w-md w-full p-8 sm:p-10 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl space-y-6 animate-fade-in">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-300 mb-2 drop-shadow-lg">
            Welcome back!
          </h2>
          <p className="text-sm sm:text-base text-white/70">
            Log in to access your account.
          </p>
        </div>

        {message && (
          <div
            className={`p-3 rounded-lg text-center font-medium border ${message.type === "error"
              ? "bg-red-500/10 text-red-300 border-red-500/30"
              : "bg-green-500/10 text-green-300 border-green-500/30"
              } backdrop-blur-sm shadow-md`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-white/80 mb-1"
            >
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              placeholder="Email"
              {...register("email")}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg shadow-inner text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
            {errors.email && (
              <p className="mt-1 text-red-400 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-white/80 mb-1"
            >
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              placeholder="Password"
              {...register("password")}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg shadow-inner text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
            {errors.password && (
              <p className="mt-1 text-red-400 text-sm">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 ${isLoading ? 'bg-gray-600' : 'bg-green-600 hover:bg-red-700'
              } text-white font-semibold rounded-lg transition duration-200`}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{" "}
          <Link
            to={"/SignUp"}
            className="text-green-600 font-medium hover:underline"
          >
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
}