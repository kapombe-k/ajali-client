import NavBar from "./NavBar";
import { Link } from "react-router-dom";

const Index = () => {
  const handleContactUs = () => {
    console.log("Contact us clicked");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex flex-col">
      
      <NavBar />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-8 animate-fade-in">
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                <span className="text-red-500 animate-pulse">AJALI</span>
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-blue-500">
                  Emergency Response
                </span>
                <span className="block">When Seconds Matter</span>
              </h1>

              <p className="text-xl sm:text-2xl text-white/80 max-w-2xl mx-auto lg:mx-0">
                Instant emergency reporting with direct connection to first
                responders.
                <span className="block mt-2 font-medium text-white">
                  Help is just one tap away.
                </span>
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="Login">
                <button
                  //   onClick={handleLogin}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-lg text-lg shadow-lg hover:shadow-red-500/30 transition-all duration-300 transform hover:scale-105 min-w-[160px] flex items-center justify-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Login
                </button>
              </Link>

              <Link to="SignUp">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg shadow-lg hover:shadow-blue-500/30 transition-all duration-300 transform hover:scale-105 min-w-[160px] flex items-center justify-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6z" />
                  </svg>
                  SignUp
                </button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="pt-8 border-t border-white/20">
              <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-white/80 text-sm">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-full">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span>24/7 Live Support</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-full">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>90% Faster Response</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-full">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>End-to-End Encrypted</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative hidden lg:block">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl border border-white/10">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-blue-500/10 rounded-2xl"></div>
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1605106702734-205df224ecce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')] bg-cover bg-center mix-blend-overlay opacity-30 rounded-2xl"></div>
              <div className="relative h-[500px] flex items-center justify-center p-8">
                <div className="text-center space-y-6">
                  <div className="inline-flex items-center justify-center p-4 bg-red-500/20 rounded-full border border-red-500/30">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 text-red-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8a1 1 0 10-2 0v3a1 1 0 002 0V8zm-1 6a1 1 0 100 2h1a1 1 0 100-2h-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
       
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/10 bg-gradient-to-r from-transparent via-white/5 to-transparent">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-white/60 text-sm flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-red-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8a1 1 0 10-2 0v3a1 1 0 002 0V8zm-1 6a1 1 0 100 2h1a1 1 0 100-2h-1z"
                clipRule="evenodd"
              />
            </svg>
            © 2025 Ajali Inc. All rights reserved.
          </div>

          <button
            onClick={handleContactUs}
            className="text-white/80 hover:text-white transition-colors duration-200 text-sm font-medium flex items-center gap-1 group"
          >
            <span className="group-hover:text-red-400">
              Need immediate help?
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Index;

