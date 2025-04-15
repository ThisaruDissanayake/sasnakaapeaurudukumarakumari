import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import PhotoCompetitionApp from './PhotoCompetitionApp';
import ProtectedRoute from './ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        
        <Route
          path="/kumara"
          element={
            <ProtectedRoute correctPassword="kumara2025">
              <PhotoCompetitionApp competition="kumara" />
            </ProtectedRoute>
          }
        />

        <Route
          path="/kumari"
          element={
            <ProtectedRoute correctPassword="kumari2025">
              <PhotoCompetitionApp competition="kumari" />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
