import React, { useState } from "react";

import UploadForm from "./UploadForm";
import { Box, Typography, Paper } from "@mui/material";

function App() {
  const apiUrl = process.env.REACT_APP_API_URL;
   const [result, setResult] = useState("");

  return (
    <Box sx={{ mt: 4 }}>
      <UploadForm onResult={setResult} />

      {result && (
        <Paper elevation={3} sx={{ p: 3, mt: 4, background: "#f9f9f9" }}>
          <Typography variant="h6" gutterBottom>
            Highlighted Content
          </Typography>
          <div
            dangerouslySetInnerHTML={{ __html: result }}
            style={{ whiteSpace: "pre-wrap", lineHeight: "1.5" }}
          />
        </Paper>
      )}
    </Box>
  );
}

export default App;
