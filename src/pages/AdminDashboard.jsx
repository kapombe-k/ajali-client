import { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from '../../utils';

export default function AdminDashboard() {
  const [reports, setReports] = useState([]);
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch reports
  useEffect(() => {
    setLoading(true);
    fetch(`${BASE_URL}/admin/reports`, {
      method: "GET",
    })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        setReports(data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Failed to fetch reports. " + error.message);
        toast.error("Failed to fetch reports: " + error.message);
        setLoading(false);
      });
  }, []);

  // Update status
  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    if (!selectedReportId || !newStatus) return;

    try {
      await axios.patch(
        `${BASE_URL}/admin/reports/${selectedReportId}/status`,
        { status: newStatus }
      );

      setReports((prev) =>
        prev.map((r) =>
          r.id === selectedReportId ? { ...r, status: newStatus } : r
        )
      );
      toast.success("Status updated successfully!");
      setSelectedReportId(null);
      setNewStatus("");
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      setError("Failed to update status. " + msg);
      toast.error("Failed to update status: " + msg);
    }
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
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-white/10">
                <thead className="bg-white/5">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">
                      ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">
                      Incident
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">
                      Details
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">
                      Location
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-blue-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {reports.map((report) => (
                    <tr key={report.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-300">
                        {report.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        {report.incident}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300 max-w-xs truncate">
                        {report.details}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {report.latitude?.toFixed(4)}, {report.longitude?.toFixed(4)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${report.status === "under investigation" ? "bg-blue-500/20 text-blue-300" :
                            report.status === "rejected" ? "bg-red-500/20 text-red-300" :
                              report.status === "resolved" || report.status === "completed" ? "bg-green-500/20 text-green-300" :
                                "bg-gray-500/20 text-gray-300"
                          }`}>
                          {report.status || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => {
                            setSelectedReportId(report.id);
                            setNewStatus(report.status || "");
                          }}
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          Update
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedReportId && (
          <div className="mt-8 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl p-6 max-w-2xl">
            <h2 className="text-xl font-bold text-blue-300 mb-4">
              Update Status for Report #{selectedReportId}
            </h2>

            <form onSubmit={handleStatusUpdate} className="space-y-4">
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-400 mb-2">
                  New Status
                </label>
                <select
                  id="status"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  required
                  className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select status</option>
                  <option value="under investigation">Under Investigation</option>
                  <option value="rejected">Rejected</option>
                  <option value="resolved">Resolved</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-blue-700 hover:bg-blue-600 text-white py-2 px-6 rounded-lg transition-colors"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedReportId(null)}
                  className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-6 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
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