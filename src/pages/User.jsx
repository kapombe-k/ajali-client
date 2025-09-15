import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../utils";

export function User() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    // Client-side validation to match backend requirements
    if (password.length < 8) {
      setMessage({ type: "error", text: "Password must be at least 8 characters" });
      return false;
    }
    if (!/\d/.test(password)) {
      setMessage({ type: "error", text: "Password must contain at least one digit" });
      return false;
    }
    if (!/[A-Z]/.test(password)) {
      setMessage({ type: "error", text: "Password must contain at least one uppercase letter" });
      return false;
    }
    
    // Email format validation
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      setMessage({ type: "error", text: "Please enter a valid email address" });
      return false;
    }

    // Phone number validation (basic)
    if (phoneNumber.length < 10) {
      setMessage({ type: "error", text: "Please enter a valid phone number" });
      return false;
    }

    return true;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage(null);
    
    const payload = {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim().toLowerCase(),
          password: password,
          phoneNumber: phoneNumber.trim(),
          role: 'user'
    }

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const responseData = await res.json();
      console.log("Signup response:", responseData); // Debug log

      if (res.ok) {
        // Handle the optimized backend response structure
        if (responseData.success) {
          const userData = responseData.data;
          
          // Store tokens and user data
          if (userData.access_token && userData.refresh_token) {
            localStorage.setItem('access_token', userData.access_token);
            localStorage.setItem('refresh_token', userData.refresh_token);
            
            // Store user data
            if (userData.user) {
              localStorage.setItem('user_id', userData.user.id);
              localStorage.setItem('user_name', userData.user.firstName);
              localStorage.setItem('user_role', userData.user.role);
              localStorage.setItem('user_email', userData.user.email);
            }
          }

          setMessage({
            type: "success",
            text: responseData.message || "Signup successful! Redirecting...",
          });

          // Clear form and redirect
          setTimeout(() => {
            setFirstName("");
            setLastName("");
            setEmail("");
            setPassword("");
            setPhoneNumber("");
            
            // Navigate to dashboard or login based on your app flow
            // Since tokens are stored, you might want to go directly to dashboard
            navigate("/dashboard"); // or "/login" if you prefer
          }, 2000);
        } else {
          // Backend returned success: false
          setMessage({ 
            type: "error", 
            text: responseData.message || "Signup failed" 
          });
        }
      } else {
        // HTTP error status
        if (responseData.success === false) {
          setMessage({ 
            type: "error", 
            text: responseData.message || "Signup failed" 
          });
        } else {
          // Handle cases where backend doesn't follow the expected format
          setMessage({ 
            type: "error", 
            text: `Signup failed: ${res.status} ${res.statusText}` 
          });
        }
      }
    } catch (error) {
      console.error("Signup error:", error);
      setMessage({ 
        type: "error", 
        text: "Network error. Please check your connection and try again." 
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
            className={`p-3 rounded text-center font-medium transition-all duration-300 ${
              message.type === "error"
                ? "bg-red-500/20 border border-red-500/30 text-red-300"
                : "bg-green-500/20 border border-green-500/30 text-green-300"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label
              htmlFor="first_name"
              className="block text-sm font-medium text-white/80 mb-1"
            >
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              id="first_name"
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg shadow-inner text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
          </div>
          
          <div>
            <label
              htmlFor="last_name"
              className="block text-sm font-medium text-white/80 mb-1"
            >
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              id="last_name"
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg shadow-inner text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
          </div>
          
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-white/80 mb-1"
            >
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg shadow-inner text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
          </div>
          
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-white/80 mb-1"
            >
              Password <span className="text-red-500">*</span>
            </label>
            <input
              id="password"
              type="password"
              placeholder="Password (8+ chars, 1 number, 1 uppercase)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg shadow-inner text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
          </div>

          <div>
            <label
              htmlFor="phone_number"
              className="block text-sm font-medium text-white/80 mb-1"
            >
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              id="phone_number"
              type="tel"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg shadow-inner text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 font-semibold rounded-lg transition duration-200 ${
              isLoading 
                ? 'bg-gray-500 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700 active:bg-green-800'
            } text-white`}
          >
            {isLoading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>
        
        <p className="text-center text-sm text-gray-400 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-green-400 font-medium hover:text-green-300 hover:underline transition-colors"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}