import NavBar from "./pages/improvednav.jsx";
import Footer from "./pages/Footer.jsx";

export default function MainLayout({ children }) {
  return (
    <div className="pb-0">
      <NavBar />
      {children}

      <Footer />
    </div>
  );
}
