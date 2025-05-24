// src/components/MatchResults.jsx
import React from 'react';
import { Chip, Typography } from '@mui/material';

const MatchResults = ({ data }) => (
  <div>
    <Typography variant="h6">Match Score: {data.matchScore.toFixed(1)}%</Typography>
    <Typography>Matched Skills:</Typography>
    {data.matched.map(skill => <Chip key={skill} label={skill} color="success" />)}
    <Typography>Missing Skills:</Typography>
    {data.missing.map(skill => <Chip key={skill} label={skill} color="error" />)}
  </div>
);

export default MatchResults;
