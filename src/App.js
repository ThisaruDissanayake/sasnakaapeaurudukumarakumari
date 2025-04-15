// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import PhotoCompetitionApp from './PhotoCompetitionApp';
import ProtectedRoute from './ProtectedRoute';
import Login from './Login.js';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Login Page */}
        <Route path="/login" element={<Login />} />

        {/* Home and Competition Routes are Protected */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/kumara"
          element={
            <ProtectedRoute>
              <PhotoCompetitionApp competition="kumara" />
            </ProtectedRoute>
          }
        />

        <Route
          path="/kumari"
          element={
            <ProtectedRoute>
              <PhotoCompetitionApp competition="kumari" />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
