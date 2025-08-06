import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { BASE_URL } from "../../utils";

export default function ReportForm({ locationData, setLocationData }) {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    incident: "",
    details: "",
  });
  const [mediaFiles, setMediaFiles] = useState([]);
  const [reportId, setReportId] = useState(null);
  const [submittedReport, setSubmittedReport] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const user_id = localStorage.getItem('user_id');
  const access_token = localStorage.getItem('access_token');

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setLocationData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    const validFiles = files.filter(
      (file) => file.type.startsWith("image/") || file.type.startsWith("video/")
    );

    setMediaFiles((prev)=>[...prev, ...validFiles]); // Add new files to the existing list
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      //const user_id = localStorage.getItem('user_id');
      
      if (!user_id || !access_token) throw new Error('Please log in to submit a report.');

      // Debug: Log what we're sending
      console.log("Creating report with:", {
        user_id,
        ...formData,
        ...locationData
      });

      // Step 1: Create report
      const reportResponse = await axios.post(`${BASE_URL}/reports`, {
        user_id: user_id,
        incident: formData.incident,
        details: formData.details,
        latitude: locationData.latitude,
        longitude: locationData.longitude,
      }, {
        headers: {
          'Content-Type': 'application/json',
           Authorization: `Bearer ${access_token}`,
        }
      });

      const report = reportResponse.data;
      console.log("Report created:", report);

      // Step 2: Handle media uploads
      if (mediaFiles.length > 0) {
        console.log(`Preparing to upload ${mediaFiles.length} files`);

        const uploadFormData = new FormData();
        mediaFiles.forEach((file) => {
          uploadFormData.append('media', file);
          console.log("Added file:", file.name);
        });

        // Debug: Show FormData contents
        for (let [key, value] of uploadFormData.entries()) {
          console.log(key, value);
        }

        const uploadResponse = await axios.post(
          `${BASE_URL}/reports/${report.id}/media`,
          uploadFormData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${access_token}`,
            }
          }
        );
        console.log("Upload response:", uploadResponse.data);
      }

      // Reset form on success
      setFormData({ incident: "", details: "" });
      setMediaFiles([]);
      setLocationData({ latitude: "", longitude: "" });
      if (fileInputRef.current) fileInputRef.current.value = "";

      setSubmittedReport(report);
      setReportId(report.id);

    } catch (error) {
      console.error("Submission error:", {
        message: error.message,
        response: error.response?.data,
        config: error.config
      });
      // User feedback here (e.g., toast notification)
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    if (lat && lng) {
      setLocationData({ latitude: lat, longitude: lng });
    }
  }, [searchParams]);

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl p-6">
        <div className="flex items-center mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-red-400 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h2 className="text-2xl font-bold text-blue-300">Report an Emergency</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="incident" className="block text-sm font-medium text-blue-300 mb-2">
              Incident Type
            </label>
            <select
              id="incident"
              name="incident"
              value={formData.incident}
              onChange={handleTextChange}
              required
              className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
            >
              <option value="">Select an incident</option>
              <option value="Fire">🔥 Fire</option>
              <option value="Traffic accident">🚦 Traffic Accident</option>
              <option value="Infrastructure accident">🏗️ Infrastructure</option>
              <option value="Workplace">🏢 Workplace</option>
            </select>
          </div>

          <div>
            <label htmlFor="details" className="block text-sm font-medium text-blue-300 mb-2">
              Details
            </label>
            <textarea
              id="details"
              placeholder="e.g. Accident on 42nd Avenue involving two vehicles, Fire at Mjengo Apartments etc."
              name="details"
              value={formData.details}
              onChange={handleTextChange}
              required
              rows={3}
              className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-300 mb-2">
              Location Coordinates
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <input
                  type="text"
                  name="longitude"
                  className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                  placeholder="Longitude"
                  value={locationData?.longitude || ""}
                  onChange={handleLocationChange}
                />
              </div>
              <div>
                <input
                  type="text"
                  name="latitude"
                  className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                  placeholder="Latitude"
                  value={locationData?.latitude || ""}
                  onChange={handleLocationChange}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-300 mb-2">
              Attach Media (Photos/Videos)
            </label>
            <div
              className={`border-2 border-dashed ${isDragging ? 'border-blue-400 bg-blue-500/10' : 'border-white/20'} rounded-xl p-4 text-center transition-all cursor-pointer`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current.click()}
            >
              <input
                type="file"
                name="media"
                accept="image/*,video/*"
                multiple
                onChange={handleMediaChange}
                ref={fileInputRef}
                className="hidden"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 mx-auto text-blue-300 mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-blue-300 text-sm font-medium mb-1">
                {isDragging ? 'Drop files here' : 'Click to upload or drag and drop'}
              </p>
              <p className="text-gray-400 text-xs">
                PNG, JPG, GIF up to 10MB
              </p>
            </div>
          </div>

          {mediaFiles.length > 0 && (
            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
              <h3 className="text-xs font-medium text-blue-300 mb-2 uppercase tracking-wider">
                Selected Files ({mediaFiles.length})
              </h3>
              <ul className="space-y-1 max-h-32 overflow-y-auto text-xs">
                {mediaFiles.map((file, index) => (
                  <li key={index} className="flex items-center text-gray-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 mr-1 text-blue-300 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <span className="truncate flex-1">{file.name}</span>
                    <span className="text-gray-400 ml-2">({Math.round(file.size / 1024)}KB)</span>
                    <button
                      type="button"
                      onClick={() => {
                        setMediaFiles(prev => prev.filter((_, i) => i !== index));
                      }}
                      className="ml-2 text-red-400 hover:text-red-300 text-xs"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors text-sm"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </button>
        </form>
      </div>

      {reportId && (
        <UpdateReportStatus
          reportId={reportId}
          access_token={localStorage.getItem("access_token")}
          reportDetails={submittedReport}
        />
      )}
    </div>
  );
}