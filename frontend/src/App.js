import React, { useState } from "react";
import UploadForm from "./UploadForm";

function App() {
    const [htmlContent, setHtmlContent] = useState("");
  const apiUrl = process.env.REACT_APP_API_URL;

  console.log("API URL:", apiUrl);

  return (
  <div className="container mt-5">
      <h2 className="mb-4">PDF Keyword Highlighter</h2>

      <UploadForm onResult={setHtmlContent} />

      {htmlContent && (
        <div className="mt-5">
          <h4>Highlighted Content</h4>
          <div
            className="border rounded p-3 bg-light"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </div>
      )}
    </div>
  );
}

export default App;
