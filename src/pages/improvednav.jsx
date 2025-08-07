import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const NavBar = ({ isLoggedIn = false, isAdmin = false }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();
    const isLandingPage = location.pathname === "/";

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    // Render minimal navbar for landing page
    if (isLandingPage) {
        return (
            <nav className="bg-gradient-to-r from-gray-950 to-blue-950 border-b border-white/10 backdrop-blur-xl z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <span className="text-2xl font-bold text-blue-300">
                            Ajali!
                        </span>

                        <div className="flex items-center space-x-2">
                            <Link to="/login">
                                <button className="text-blue-300 hover:bg-blue-500/20 px-3 py-2 rounded-md text-sm font-medium transition-colors border border-white/10">
                                    Login
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>
        );
    }

    return (
        <nav className="bg-gradient-to-r from-gray-950 to-blue-950 border-b border-white/10 backdrop-blur-xl z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Brand + Links */}
                    <div className="flex items-center space-x-6">
                        <span className="text-2xl font-bold text-red-300">
                            Ajali!
                        </span>
                        <div className="hidden md:flex space-x-1">
                            <Link
                                to="/"
                                className="text-gray-300 hover:text-blue-300 hover:bg-white/5 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                Home
                            </Link>

                            {/* Reports link for all logged in users */}
                            {isLoggedIn && (
                                <Link
                                    to="/reports"
                                    className="text-gray-300 hover:text-blue-300 hover:bg-white/5 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    Reports
                                </Link>
                            )}

                            {/* Regular user links */}
                            {isLoggedIn && !isAdmin && (
                                <>
                                    <Link
                                        to="/map"
                                        className="text-gray-300 hover:text-blue-300 hover:bg-white/5 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                    >
                                        Map
                                    </Link>
                                    <Link
                                        to="/emergency-contact"
                                        className="text-gray-300 hover:text-blue-300 hover:bg-white/5 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                    >
                                        Emergency Contacts
                                    </Link>
                                </>
                            )}

                            {/* Admin-specific links */}
                            {isLoggedIn && isAdmin && (
                                <Link
                                    to="/users"
                                    className="text-gray-300 hover:text-blue-300 hover:bg-white/5 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    Users
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Auth buttons */}
                    <div className="hidden md:flex items-center space-x-2">
                        {isLoggedIn ? (
                            <button className="text-red-300 hover:bg-red-500/20 px-3 py-2 rounded-md text-sm font-medium transition-colors border border-white/10">
                                Logout
                            </button>
                        ) : (
                            <Link to="/login">
                                <button className="text-blue-300 hover:bg-blue-500/20 px-3 py-2 rounded-md text-sm font-medium transition-colors border border-white/10">
                                    Login
                                </button>
                            </Link>
                        )}
                    </div>

                    {/* Mobile hamburger */}
                    <div className="md:hidden">
                        <button
                            onClick={toggleMobileMenu}
                            className="text-gray-300 hover:text-blue-300 p-2 rounded-md hover:bg-white/5 transition-colors"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Dropdown */}
            <div className={`md:hidden ${mobileMenuOpen ? "block" : "hidden"} bg-white/5 backdrop-blur-xl border-b border-white/10`}>
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    <Link
                        to="/"
                        className="text-gray-300 hover:text-blue-300 hover:bg-white/5 block px-3 py-2 rounded-md text-base font-medium transition-colors"
                    >
                        Home
                    </Link>

                    {/* Reports link for all logged in users */}
                    {isLoggedIn && (
                        <Link
                            to="/reports"
                            className="text-gray-300 hover:text-blue-300 hover:bg-white/5 block px-3 py-2 rounded-md text-base font-medium transition-colors"
                        >
                            Reports
                        </Link>
                    )}

                    {/* Regular user mobile links */}
                    {isLoggedIn && !isAdmin && (
                        <>
                            <Link
                                to="/map"
                                className="text-gray-300 hover:text-blue-300 hover:bg-white/5 block px-3 py-2 rounded-md text-base font-medium transition-colors"
                            >
                                Map
                            </Link>
                            <Link
                                to="/emergency-contact"
                                className="text-gray-300 hover:text-blue-300 hover:bg-white/5 block px-3 py-2 rounded-md text-base font-medium transition-colors"
                            >
                                Emergency Contacts
                            </Link>
                        </>
                    )}

                    {/* Admin-specific mobile links */}
                    {isLoggedIn && isAdmin && (
                        <Link
                            to="/users"
                            className="text-gray-300 hover:text-blue-300 hover:bg-white/5 block px-3 py-2 rounded-md text-base font-medium transition-colors"
                        >
                            Users
                        </Link>
                    )}

                    <div className="pt-2 border-t border-white/10">
                        {isLoggedIn ? (
                            <button className="text-red-300 hover:bg-red-500/20 block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors">
                                Logout
                            </button>
                        ) : (
                            <Link
                                to="/login"
                                className="text-blue-300 hover:bg-blue-500/20 block px-3 py-2 rounded-md text-base font-medium transition-colors"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;