// src/pages/ReportDetailPage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from 'leaflet';

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

    useEffect(() => {
        // Simulated data fetch
        setTimeout(() => {
            setReport({
                id: id || "rep_default",
                incidentType: "Medical Emergency",
                description: "Cardiac emergency reported at the main lobby. Patient is a 65-year-old male experiencing chest pains and shortness of breath. First responders have been notified and are en route.",
                date: Date.now() - 3600000,
                status: "In Progress",
                location: {
                    lat: 40.7128,
                    lng: -74.0060
                },
                reporter: "John Doe",
                contact: "john.doe@example.com",
                severity: "High",
                address: "123 Main Street, New York, NY 10001"
            });
            setStatus("In Progress");
            setLoading(false);
        }, 600);
    }, [id]);

    const handleStatusUpdate = () => {
        alert(`Status updated to: ${ status }`);
        navigate("/reports");
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
                    onClick={() => navigate('/AdminDashboard')}
                    className="flex items-center text-blue-400 hover:text-blue-300 mb-6 transition-colors"
                >
                    ← Back to Reports
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
                                        <h2 className="text-lg font-semibold text-white">{report.incidentType}</h2>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${report.status === "Pending" ? "bg-yellow-500/20 text-yellow-300" :
                                                    report.status === "In Progress" ? "bg-blue-500/20 text-blue-300" :
                                                        report.status === "Resolved" ? "bg-green-500/20 text-green-300" :
                                                            "bg-red-500/20 text-red-300"
                                                }`}>
                                                {report.status}
                                            </span>
                                            <span className="text-gray-400 text-sm">
                                                {new Date(report.date).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="bg-gray-700 rounded-lg px-2 py-1 text-xs border border-gray-600">
                                        ID: {(report.id || "").slice(0, 8)}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <h3 className="text-sm text-gray-400 mb-1">Severity</h3>
                                        <p className="text-white">{report.severity}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm text-gray-400 mb-1">Reporter</h3>
                                        <p className="text-white">{report.reporter}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm text-gray-400 mb-1">Contact</h3>
                                        <p className="text-white">{report.contact}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <h2 className="text-lg font-semibold text-white mb-3">Description</h2>
                                <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                                    <p className="text-gray-300 whitespace-pre-line">{report.description}</p>
                                </div>
                            </div>

                            {/* Status Update */}
                            <div>
                                <h2 className="text-lg font-semibold text-white mb-3">Update Status</h2>
                                <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {["Pending", "In Progress", "Resolved"].map((option) => (
                                            <button
                                                key={option}
                                                className={`px-3 py-1.5 rounded-lg text-sm transition-all ${status === option
                                                        ? "bg-blue-700 border-blue-500 text-white"
                                                        : "bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
                                                    } border`}
                                                onClick={() => setStatus(option)}
                                            >
                                                {option}
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