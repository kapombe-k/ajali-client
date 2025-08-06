// src/layouts/MainLayout.jsx
import NavBar from "./pages/improvednav";
import Footer from "./pages/Footer";

export default function MainLayout({ children }) {
  return (
    <div className="pb-0">
      <NavBar />
      {children}

      <Footer />
    </div>
  );
}
