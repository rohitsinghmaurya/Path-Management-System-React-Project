import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Result = () => {
  const location = useLocation();
  const { path } = location.state || {}; 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (path) {
      setLoading(false);
    } else {
      setLoading(false); 
    }
  }, [path]);

  if (loading) {
    return <div>Loading path data...</div>;
  }

  if (!path || path.length === 0) {
    return <div>No path data available. Please try again.</div>;
  }

  return (
    <div>
      <h1>Shortest Path</h1>
      <ul>
        {path.map((location, index) => (
          <li key={index}>{location.name}</li> 
        ))}
      </ul>
    </div>
  );
};

export default Result;
