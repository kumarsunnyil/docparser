import React, { useState } from "react";
import axios from "axios";
import {
  Button,
  TextField,
  Typography,
  LinearProgress,
  Box,
  Container,
} from "@mui/material";

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
      const response = await axios.post(`${apiUrl}/document/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          const percent = Math.round((e.loaded * 100) / e.total);
          setProgress(percent);
        },
      });

      onResult(response.data); // Expecting highlighted HTML
    } catch (error) {
      alert("Upload failed. Check server logs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ p: 4, border: "1px solid #ccc", borderRadius: 2, boxShadow: 1 }}
      >
        <Typography variant="h6" gutterBottom>
          Upload PDF and Enter Keywords
        </Typography>

        <Button variant="outlined" component="label" fullWidth sx={{ mb: 2 }}>
          {file ? file.name : "Choose File"}
          <input
            type="file"
            hidden
            onChange={(e) => setFile(e.target.files[0])}
          />
        </Button>

        <TextField
          fullWidth
          label="Keywords"
          placeholder="e.g., react, nestjs, jwt"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          margin="normal"
        />

        {loading && (
          <Box sx={{ my: 2 }}>
            <LinearProgress variant="determinate" value={progress} />
            <Typography variant="caption">{progress}%</Typography>
          </Box>
        )}

        <Button
          variant="contained"
          color="primary"
          type="submit"
          fullWidth
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload & Highlight"}
        </Button>
      </Box>
    </Container>
  );
};

export default UploadForm;
