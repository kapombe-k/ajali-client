import { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from '../../utils';
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch reports
  const fetchReports = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/reports`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setReports(data);
    } catch (error) {
      setError("Failed to fetch reports.");
      } finally {
      setLoading(false);
    };
  };

  useEffect(() => {
    setLoading(true);
    fetchReports();
  }, []);

  // View report details
  const viewReportDetails = (reportId) => {
    navigate(`/reports/${reportId}`);
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-red-950 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-red-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl p-6 mb-8">
          <h1 className="text-3xl font-bold text-blue-300 mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Manage and update incident reports</p>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        {reports.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-xl font-medium text-gray-300 mb-2">No reports found</h3>
            <p className="text-gray-400">There are currently no incident reports to display</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
              <div key={report.id} className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden hover:border-blue-500/50 transition-all">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-white truncate">
                      {report.incident || "Untitled Report"}
                    </h3>
                    <span className="bg-gray-700 rounded-lg px-2 py-1 text-xs border border-gray-600">
                      ID: {(report.id || "").slice(0, 6)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${report.status === "under investigation" ? "bg-blue-500/20 text-blue-300" :
                        report.status === "rejected" ? "bg-red-500/20 text-red-300" :
                          report.status === "resolved" || report.status === "completed" ? "bg-green-500/20 text-green-300" :
                            "bg-gray-500/20 text-gray-300"
                      }`}>
                      {report.status || "Unknown"}
                    </span>
                    <span className="text-gray-400 text-sm">
                      {new Date(report.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                    {report.details || "No details provided"}
                  </p>

                  <div className="text-xs text-gray-400 mb-4">
                    📍 {report.latitude?.toFixed(4)}, {report.longitude?.toFixed(4)}
                  </div>

                  <button
                    onClick={() => viewReportDetails(report.id)}
                    className="w-full bg-blue-700 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors text-sm"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}


        <ToastContainer
          position="top-right"
          autoClose={3000}
          toastClassName="bg-white/5 backdrop-blur-xl border border-white/10"
          progressClassName="bg-blue-500"
          bodyClassName="text-white"
        />
      </div>
    </div>
  );
}