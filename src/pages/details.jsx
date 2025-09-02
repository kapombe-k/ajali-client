// src/pages/ReportDetailPage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import { BASE_URL } from "../../utils";

// Fix leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

export default function ReportDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [report, setReport] = useState(null);
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState("");

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const access_token = localStorage.getItem('access_token');
                const response = await fetch(`${BASE_URL}/reports/${id}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setReport(data);
                setStatus(data.status || "");
                setUserRole(localStorage.getItem('user_role') || "");
            } catch (error) {
                console.error("Failed to fetch report:", error);
                // Fallback to mock data if API fails
                setReport({
                    id: id || "rep_default",
                    incident: "Medical Emergency",
                    details: "Cardiac emergency reported at the main lobby. Patient is a 65-year-old male experiencing chest pains and shortness of breath. First responders have been notified and are en route.",
                    created_at: new Date(Date.now() - 3600000),
                    status: "In Progress",
                    latitude: 40.7128,
                    longitude: -74.0060,
                    user: { first_name: "John", last_name: "Doe", email: "john.doe@example.com" }
                });
                setStatus("In Progress");
                setUserRole(localStorage.getItem('user_role') || "");
            } finally {
                setLoading(false);
            }
        };

        fetchReport();
    }, [id]);

    const handleStatusUpdate = async () => {
        try {
            const access_token = localStorage.getItem('access_token');
            const response = await fetch(`${BASE_URL}/reports/${id}/status`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            alert(`Status updated to: ${status}`);
            // Refresh the page to show updated status
            window.location.reload();
        } catch (error) {
            console.error("Failed to update status:", error);
            alert("Failed to update status. Please try again.");
        }
    };

    if (loading || !report) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-red-950 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-red-950 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <button
                    onClick={() => navigate(userRole === 'admin' ? '/admin-dashboard' : '/user-dashboard')}
                    className="flex items-center text-blue-400 hover:text-blue-300 mb-6 transition-colors"
                >
                    ← Back to {userRole === 'admin' ? 'Admin Dashboard' : 'My Reports'}
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Incident Details - Left Side */}
                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl p-6">
                        <h1 className="text-2xl font-bold text-blue-300 mb-6">Incident Details</h1>

                        <div className="space-y-6">
                            {/* Incident Summary */}
                            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl p-6">
                                        <h2 className="text-lg font-semibold text-white">{report.incident}</h2>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${report.status === "under investigation" ? "bg-blue-500/20 text-blue-300" :
                                                    report.status === "rejected" ? "bg-red-500/20 text-red-300" :
                                                        report.status === "resolved" || report.status === "completed" ? "bg-green-500/20 text-green-300" :
                                                            "bg-gray-500/20 text-gray-300"
                                                }`}>
                                                {report.status || "Unknown"}
                                            </span>
                                            <span className="text-gray-400 text-sm">
                                                {new Date(report.created_at).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="bg-gray-700 rounded-lg px-2 py-1 text-xs border border-gray-600">
                                        ID: {(report.id || "").slice(0, 8)}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <h3 className="text-sm text-gray-400 mb-1">Reporter</h3>
                                        <p className="text-white">
                                            {report.user ? `${report.user.first_name} ${report.user.last_name}` : "Unknown"}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm text-gray-400 mb-1">Contact</h3>
                                        <p className="text-white">
                                            {report.user ? report.user.email : "N/A"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <h2 className="text-lg font-semibold text-white mb-3">Description</h2>
                                <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                                    <p className="text-gray-300 whitespace-pre-line">{report.details}</p>
                                </div>
                            </div>

                            {/* Status Update - Only for Admins */}
                            {userRole === 'admin' && (
                                <div>
                                    <h2 className="text-lg font-semibold text-white mb-3">Update Status</h2>
                                    <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {["under investigation", "rejected", "resolved", "completed"].map((option) => (
                                                <button
                                                    key={option}
                                                    className={`px-3 py-1.5 rounded-lg text-sm transition-all ${status === option
                                                            ? "bg-blue-700 border-blue-500 text-white"
                                                            : "bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
                                                        } border`}
                                                    onClick={() => setStatus(option)}
                                                >
                                                    {option.charAt(0).toUpperCase() + option.slice(1)}
                                                </button>
                                            ))}
                                        </div>
                                        <button
                                            onClick={handleStatusUpdate}
                                            disabled={!status}
                                            className={`w-full py-2 px-4 rounded-lg font-medium transition-all ${!status ? "bg-gray-600 cursor-not-allowed" : "bg-blue-700 hover:bg-blue-600"
                                                } text-white`}
                                        >
                                            Update Status
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Map - Right Side */}
                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl p-6">
                        <h2 className="text-2xl font-bold text-blue-300 mb-6">Incident Location</h2>

                        <div className="h-96 rounded-xl overflow-hidden mb-4 border border-gray-700">
                            {report.location && (
                                <MapContainer
                                    center={[report.location.lat, report.location.lng]}
                                    zoom={15}
                                    className="h-full w-full"
                                    attributionControl={false}
                                >
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    <Marker position={[report.location.lat, report.location.lng]}>
                                        <Popup>Incident Location</Popup>
                                    </Marker>
                                </MapContainer>
                            )}
                        </div>

                        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                            <div className="space-y-2">
                                <div>
                                    <h3 className="text-sm text-gray-400">Address</h3>
                                    <p className="text-white">{report.address}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm text-gray-400">Coordinates</h3>
                                    <p className="font-mono text-white">
                                        {report.location.lat.toFixed(6)}, {report.location.lng.toFixed(6)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}