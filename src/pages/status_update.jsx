import { useForm } from "react-hook-form";
import { ToastContainer } from "react-toastify";
//import { StatusUpdate } from "../components/StatusUpdate";""
// import "react-toastify/dist/ReactToastify.css"; // Import once in App.jsx

export function UpdateReportStatus({ reportId, access_token, reportDetails }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const statuses = ["under investigation", "rejected", "resolved"];
  const API_BASE_URL = "http://127.0.0.1:5000";

  const onSubmit = async (data) => {
    try {
      const response = await fetch(
        `${BASE_URL}/admin/reports/${reportId}/status`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
          body: JSON.stringify({
            status: data.status,
            updated_by: "", 
            status: data.status
           
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        StatusUpdate.success(
          result.message || "✅ Status updated successfully"
        );
        reset();
      } else {
        StatusUpdate.error(result.error || "❌ Failed to update status");
      }
    } catch (error) {
      StatusUpdate.error("🌐 Network error: " + error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-blue-950 to-red-950 font-inter text-white p-4 sm:p-6 lg:p-8">
      <div className="relative z-10 max-w-md w-full p-8 sm:p-10 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl space-y-6 animate-fade-in">
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-4 text-white">
            Update Status for Report ID:{" "}
            <span className="font-mono">{reportId}</span>
          </h3>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-white font-medium mb-1">
              Details:
            </label>
            <input
              type="text"
              value={reportDetails?.details || ""}
              readOnly
              className="w-full p-3 border-2 border-gray-200 rounded-full bg-gray-100 text-gray-600"
            />
          </div>
          <div>
            <label className="block text-white font-medium mb-1">
              Incident:
            </label>
            <input
              type="text"
              value={reportDetails?.incident || ""}
              readOnly
              className="w-full p-3 border-2 border-gray-200 rounded-full bg-gray-100 text-gray-600"
            />
          </div>

          <div>
            <label
              htmlFor="status"
              className="block text-white font-medium mb-1"
            >
              Status:
            </label>
            <select
              id="status"
              {...register("status", { required: "Please select a status" })}
              defaultValue=""
              className={`w-full text-black p-3 border-2 border-gray-200 rounded-full bg-white
                focus:border-red-400 focus:ring-2 focus:ring-red-100
                transition-all appearance-none cursor-pointer
                hover:border-red-300 ${
                  errors.status ? "border-red-500" : "border-gray-300"
                }`}
            >
              <option value="" disabled>
                -- Select a status --
              </option>
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            {errors.status && (
              <p className="mt-1 text-sm text-red-600">
                {errors.status.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition-colors duration-200"
          >
            Update Status
          </button>
        </form>

        <ToastContainer />
      </div>
    </div>
  );
}
