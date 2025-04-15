// src/Home.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import logo from './assets/logosT.png';
import logo2 from './assets/aurudulogo.jpeg';  // 👈 adjust path as needed

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <img src={logo} alt="Sasnaka Logo" className="home-logo" />
      
      <p className="home-subtitle">සස්නක සංසද "අවුරුදු කුමරා සහ කුමරිය - 2025" 🌞🙏</p>

      <div className="competition-select">
        <button className="competition-button" onClick={() => navigate('/kumara')}>
          🎉 අවුරුදු කුමරා - 2025
        </button>
        <button className="competition-button" onClick={() => navigate('/kumari')}>
          🌸 අවුරුදු කුමාරි - 2025
        </button>
      </div>
    </div>
  );
};

export default Home;
