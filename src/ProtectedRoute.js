// src/ProtectedRoute.js
import React, { useState } from 'react';

const ProtectedRoute = ({ correctPassword, children }) => {
  const [enteredPassword, setEnteredPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    if (enteredPassword === correctPassword) {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="login-screen">
        <h2>Enter Password to Continue</h2>
        <input
          type="password"
          value={enteredPassword}
          onChange={(e) => setEnteredPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Enter</button>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
