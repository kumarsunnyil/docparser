import React, { useState } from 'react';
import UploadForm from './components/UploadForm';
import MatchResults from './components/MatchResults';

const App = () => {
  const [result, setResult] = useState(null);
  return (
    <div style={{ padding: 20 }}>
      <UploadForm onResult={setResult} />
      {result && <MatchResults data={result} />}
    </div>
  );
};

export default App;
