import { useState } from "react";
import { useAuth } from "../components/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../utils";


export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage(null);

    try {

      const res = await fetch(`${BASE_URL}/login`, {

        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("user", JSON.stringify(data.user));

        setUser(data.user); // update AuthContext
        setMessage({ type: "success", text: "Login successful!" });
        navigate("/home");
      } else {
        setMessage({ type: "error", text: data.error || "Login failed" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Network error" });
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

        <form onSubmit={handleLogin} className="space-y-4">
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
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg shadow-inner text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-green-600 hover:bg-red-700 text-white font-semibold rounded-lg transition duration-200"
          >
            Login
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

