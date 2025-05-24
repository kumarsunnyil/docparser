import React, { useState } from "react";
import axios from "axios";

const UploadForm = ({ onResult }) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [file, setFile] = useState(null);
  const [keywords, setKeywords] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || !keywords) {
      alert("Please select a file and enter keywords.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("keywords", keywords);

    setLoading(true);
    setProgress(0);

    try {
        console.log("API URL= ", apiUrl);
      const response = await axios.post(`${apiUrl}/document/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          const percent = Math.round((e.loaded * 100) / e.total);
          setProgress(percent);
        },
      });

      onResult(response.data); // Expecting highlighted content
    } catch (error) {
      alert("Upload failed. Check server logs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm">
      <div className="mb-3">
        <label className="form-label">Select PDF File</label>
        <input
          type="file"
          className="form-control"
          onChange={(e) => setFile(e.target.files[0])}
        />
        {file && <div className="form-text">Selected: {file.name}</div>}
      </div>

      <div className="mb-3">
        <label className="form-label">Keywords</label>
        <input
          type="text"
          className="form-control"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          placeholder="e.g., react, nestjs, jwt"
        />
      </div>

      {loading && (
        <div className="mb-3">
          <div className="progress">
            <div
              className="progress-bar"
              role="progressbar"
              style={{ width: `${progress}%` }}
              aria-valuenow={progress}
              aria-valuemin="0"
              aria-valuemax="100"
            >
              {progress}%
            </div>
          </div>
        </div>
      )}

      <button
        type="submit"
        className="btn btn-primary"
        disabled={loading}
      >
        {loading ? "Uploading..." : "Upload & Highlight"}
      </button>
    </form>
  );
};

export default UploadForm;
