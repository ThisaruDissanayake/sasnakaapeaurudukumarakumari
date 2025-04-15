// src/Login.js
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebaseConfig';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // <-- add this new CSS file
import logo from './assets/logosT.png';
import bgImage from './assets/Bg.png';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  };

  return (
    <div className="login-wrapper" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="login-box">
        <img src={logo} alt="Sasnaka Logo" className="login-logo" />
        <h2>සස්නක සංසද Login</h2>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
}
