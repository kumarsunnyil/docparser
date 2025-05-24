// src/components/UploadForm.jsx
import React, { useState } from "react";
import { Button, TextField, LinearProgress, Container } from "@mui/material";
import axios from "axios";

const UploadForm = ({ onResult }) => {
  const [resume, setResume] = useState(null);
  const [jd, setJd] = useState("");
  const [progress, setProgress] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("jobDescription", jd);



    try {
      const result = await uploadWithRetry(formData);
      onResult(result);
    } catch (error) {
      alert(
        "Upload failed: " + (error.response?.data?.message || "Unknown error")
      );
    }
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const uploadWithRetry = async (formData, retries = 3, backoff = 1000) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/resume/upload`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
      } catch (error) {
        if (error.response?.status === 429 && attempt < retries) {
          console.warn(`Rate limited. Retrying in ${backoff}ms...`);
          await delay(backoff);
          backoff *= 2; 
        } else {
          throw error;
        }
      }
    }
  };

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={(e) => setResume(e.target.files[0])} />
        <TextField
          label="Job Description"
          multiline
          rows={4}
          value={jd}
          onChange={(e) => setJd(e.target.value)}
          fullWidth
        />
        <Button type="submit" variant="contained">
          Upload & Match
        </Button>
        {progress > 0 && (
          <LinearProgress variant="determinate" value={progress} />
        )}
      </form>
    </Container>
  );
};

export default UploadForm;
