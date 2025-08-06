// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import {createBrowserRouter,RouterProvider,} from "react-router-dom";
// import './index.css'
// import App from './App.jsx'
// import LocationPage from './components/locationMap.jsx';
// import EmergencyContact from './pages/emergencycontacts.jsx';
// import { User } from './pages/User.jsx';
// import { Login } from './pages/Login.jsx';
//import ReportForm from './pages/report-form.jsx';
//import App from "./App.jsx";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import { AuthProvider } from "./components/AuthContext.jsx";
// pages imports
import Index from './pages/Home.jsx';
import MapPage from "./components/MapPage.jsx";
import { UpdateReportStatus } from "./pages/status_update.jsx";
import LocationPage from "./components/locationMap.jsx";
import EmergencyContact from "./pages/emergencycontacts.jsx";
import { User } from "./pages/User.jsx";
import { Login } from "./pages/Login.jsx";
import Footer from "./pages/Footer.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import MainLayout from "./MainLayout.jsx"; // ensures the pages are wrapped  to include the fixed footer and bottom padding.
import UserDashboard from "./pages/UserDash.jsx";
import ReportDetailPage from "./pages/details.jsx";
import ProtectedRoute from "./components/protectedroutes.jsx"; //this component will handle the authentication check



const router = createBrowserRouter([
  {
    element: <ProtectedRoute />, // This is the protected route parent
    children: [
      {
        path: "/AdminDashboard",
        element: (
          <MainLayout>
            <AdminDashboard />
          </MainLayout>
        ),
      },
      {
        path: "/share-location",
        element: (
          <MainLayout>
            <LocationPage />
          </MainLayout>
        ),
      },
      {
        path: "/user-dashboard",
        element: <UserDashboard />
      },
      {
        path: "/emergency-contact",
        element: (
          <MainLayout>
            <EmergencyContact />
          </MainLayout>
        ),
      },
      {
        path: "/details-page",
        element: <ReportDetailPage />
      },
      {
        path: "/UpdateReportStatus",
        element: (
          <MainLayout>
            <UpdateReportStatus />
          </MainLayout>
        ),
      },
      {
        path: "/map",
        element: (
          <MainLayout>
            <MapPage />
          </MainLayout>)
      },
    ],
  },
  
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element:<Index/>
  },
 {
    path: "/signup",
    element: (
      <MainLayout>
        <User />
      </MainLayout>
    ),
  },
  
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
