import NavBar from "./pages/improvednav.jsx";
import Footer from "./pages/Footer.jsx";
import { useAuth } from "./components/AuthContext";

export default function MainLayout({ children }) {
  const { user } = useAuth();
  
  return (
    <div className="pb-0">
      <NavBar isLoggedIn= {!!user} isAdmin={user?.role === 'admin'} />
      {children}

      <Footer />
    </div>
  );
}
