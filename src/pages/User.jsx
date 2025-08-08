import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../utils";

export function User() {
  const [first_name, setfirst_name] = useState("");
  const [last_name, setlast_name] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [phone_number, setphone_number] = useState("");
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    if (password.length < 8) {
      setMessage({ type: "error", text: "Password must be at least 8 characters" });
      return false;
    }
    if (!/\d/.test(password)) {
      setMessage({ type: "error", text: "Password must contain a number" });
      return false;
    }
    return true;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: first_name,
          last_name: last_name,
          email: email,
          password: password,
          phone_number: phone_number,
          role: 'user'  //added default role
        }),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.access_token) {
          localStorage.setItem('accessToken', data.access_token);
          localStorage.setItem('refreshToken', data.refresh_token);
        }

        setMessage({
          type: "success",
          text: data.message || "Signup successful! Redirecting to login...",
        });
        setTimeout(() => {
          setlast_name("");
          setfirst_name("");
          setemail("");
          setpassword("");
          setphone_number("");
          navigate("/login");
        }, 2000);
      } else {
        setMessage({ type: "error", text: data.message || "Signup failed" });
      }
    } catch (error) {
      setMessage({ type: "error", text: error.message || "Network error" });
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
            className={`p-3 rounded text-center font-medium ${
              message.type === "error"
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label
              htmlFor=" firstname"
              className="block text-sm font-medium text-white/80 mb-1"
            >
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder=" firstName"
              value={first_name}
              onChange={(e) => setfirst_name(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg shadow-inner text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
          </div>
          <div>
            <label
              htmlFor=" first_name"
              className="block text-sm font-medium text-white/80 mb-1"
            >
               Last_name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder=" lastName"
              value={last_name}
              onChange={(e) => setlast_name(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg shadow-inner text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-white/80 mb-1"
            >
              email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setemail(e.target.value)}
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
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setpassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg shadow-inner text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
          </div>

          <div>
            <label
              htmlFor="phone number"
              className="block text-sm font-medium text-white/80 mb-1"
            >
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Phone Number"
              value={phone_number}
              onChange={(e) => setphone_number(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg shadow-inner text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
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
          if you already have an existing account?{" "}
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
