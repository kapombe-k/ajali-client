import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../utils";
import { useAuth } from "../components/AuthContext";

// Define Zod schema for form validation
const signUpSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.email("Invalid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/\d/, "Password must contain at least one number")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter"),
  phoneNumber: z.string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^\d{10}$/, "Phone number must be exactly 10 digits")
});

export function User() {
  const navigate = useNavigate();
  const { login } = useAuth(); // Get login function from AuthContext
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize react-hook-form with Zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phoneNumber: ""
    }
  });

  const handleSignup = async (formData) => {
    setMessage(null);
    setIsLoading(true);

    try {
      // Prepare payload with snake_case keys
      const payload = {
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        phone_number: formData.phoneNumber.trim(),
        role: 'user'
      };

      const res = await fetch(`${BASE_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        credentials: 'include',
        body: JSON.stringify(payload),
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
        const errorMsg = responseData.message || `Signup failed (${res.status})`;
        throw new Error(errorMsg);
      }

      // Extract data from response
      const { user: userData, access_token, refresh_token } = responseData.data;

      // Update auth context
      if (login) {
        login({
          id: userData.id,
          email: userData.email,
          name: `${userData.first_name} ${userData.last_name}`,
          role: userData.role
        });
      }

      // Store tokens and user data
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      localStorage.setItem('user_id', userData.id);
      localStorage.setItem('user_role', userData.role);
      localStorage.setItem('user_name', `${userData.first_name} ${userData.last_name}`);
      localStorage.setItem('user_email', userData.email);

      // Show success message
      setMessage({
        type: "success",
        text: responseData.message || "Signup successful! Redirecting..."
      });

      // Redirect based on role
      const dashboardPath = userData.role === 'admin'
        ? '/admin-dashboard'
        : '/user-dashboard';

      reset(); // Reset form fields
      setTimeout(() => navigate(dashboardPath), 1500);

    } catch (error) {
      console.error("Signup Error:", error);
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
          <h2 className="text-3xl font-bold text-red-700 mb-2">
            Welcome to Ajali!
          </h2>
          <p className="text-sm text-gray-500">
            Sign-up to report an emergency instantly!
          </p>
        </div>

        {message && (
          <div
            className={`p-3 rounded text-center font-medium ${message.type === "error"
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
              }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit(handleSignup)} className="space-y-4">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-white/80 mb-1"
            >
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="First Name"
              {...register("firstName")}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg shadow-inner text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
            {errors.firstName && (
              <p className="mt-1 text-red-400 text-sm">{errors.firstName.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-white/80 mb-1"
            >
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Last Name"
              {...register("lastName")}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg shadow-inner text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
            {errors.lastName && (
              <p className="mt-1 text-red-400 text-sm">{errors.lastName.message}</p>
            )}
          </div>

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

          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-white/80 mb-1"
            >
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Phone Number"
              {...register("phoneNumber")}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg shadow-inner text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
            {errors.phoneNumber && (
              <p className="mt-1 text-red-400 text-sm">{errors.phoneNumber.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 ${isLoading ? 'bg-gray-500' : 'bg-green-600 hover:bg-red-700'} text-white font-semibold rounded-lg transition duration-200`}
          >
            {isLoading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link
            to={"/Login"}
            className="text-green-600 font-medium hover:underline"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}