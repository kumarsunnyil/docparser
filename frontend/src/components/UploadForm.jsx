import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  LinearProgress,
  Container,
  Typography,
  Paper,
} from "@mui/material";
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
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/resume/upload`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress: (e) => {
              const percent = Math.round((e.loaded * 100) / e.total);
              setProgress(percent);
            },
          }
        );
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
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" mb={3} textAlign="center">
          Upload Resume & Match Job Description
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Button
            variant="outlined"
            component="label"
            fullWidth
            sx={{ mb: 2 }}
          >
            {resume ? resume.name : "Choose Resume (PDF)"}
            <input
              type="file"
              hidden
              accept="application/pdf"
              onChange={(e) => setResume(e.target.files[0])}
            />
          </Button>

          <TextField
            label="Job Description"
            multiline
            rows={4}
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            fullWidth
            required
            sx={{ mb: 3 }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={!resume || !jd}
          >
            Upload & Match
          </Button>

          {progress > 0 && progress < 100 && (
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{ mt: 2 }}
            />
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default UploadForm;
