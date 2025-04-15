// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import CompetitionPage from './CompetitionPage';
import './App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/kumara" element={<CompetitionPage competition="kumara" />} />
        <Route path="/kumari" element={<CompetitionPage competition="kumari" />} />
      </Routes>
    </Router>
  );
};

export default App;
