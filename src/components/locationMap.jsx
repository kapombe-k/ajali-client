import "../App.css";
import NavBar from "../pages/NavBar";

import  { useState } from "react";
// import "./App.css";


const LocationSharePage = () => {
  
  const [locationLink, setLocationLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGetLocation = () => {
    setLoading(true);
    setError("");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const link = `https://www.google.com/maps?q=${lat},${lng}`;
          setLocationLink(link);
          setLoading(false);
        },
        (err) => {
          setError("❌ Failed to get location. Please allow location access.");
          setLoading(false);
        }
      );
    } else {
      setError("❌ Geolocation is not supported by your browser.");
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(locationLink);
    alert("📋 Location link copied to clipboard!");
  };

  const handleAutoShare = () => {
    const message = `🚨 I need help! Here's my location: ${locationLink}`;
    const whatsappLink = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappLink, "_blank");
  };

  return (
    <div className="location-share-wrapper">
      <NavBar />
      <h2>Emergency Location Sharing</h2>
      <p>
        If you’re in an accident or unsafe situation, send your live location
        now.
      </p>

      <button
        className="share-btn"
        onClick={handleGetLocation}
        disabled={loading}
      >
        {loading ? "Fetching location..." : "Get My Current Location"}
      </button>

      {locationLink && (
        <div className="location-output">
          <p>📍 Your location link:</p>
          <a href={locationLink} target="_blank" rel="noopener noreferrer">
            {locationLink}
          </a>

          <div className="share-options">
            <button onClick={handleAutoShare}>🚨 Share Location</button>
            <button onClick={handleCopy}>📋 Copy Link</button>
          </div>
        </div>
      )}

      {error && <p className="error-text">{error}</p>}
    </div>
  );
};

export default LocationSharePage;
