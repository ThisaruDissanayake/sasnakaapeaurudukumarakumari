// src/Home.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import logo from './assets/logosT.png';
import { auth } from './firebaseConfig'; // 🔹 Add this
import { signOut } from 'firebase/auth'; // 🔹 And this

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <div className="home-container">
      <img src={logo} alt="Sasnaka Logo" className="home-logo" />
      <p className="home-subtitle">සස්නක සංසද "අවුරුදු කුමරා සහ කුමාරි - 2025" 🌞🙏</p>

      {/* Navigation buttons */}
      <div className="competition-select">
        <button className="competition-button" onClick={() => navigate('/kumara')}>
          🎉 අවුරුදු කුමරා - 2025
        </button>
        <button className="competition-button" onClick={() => navigate('/kumari')}>
          🌸 අවුරුදු කුමාරි - 2025
        </button>
      </div>

      {/* 🔹 Logout Button */}
      <div className="logout-section">
        <button className="logout-button" onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>
    </div>
  );
};

export default Home;
