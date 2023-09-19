import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import VideoCall from './components/VideoCall';
import HomePage from './components/HomePage';
import './styles.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/video/:roomId" element={<VideoCall />} />
      </Routes>
    </Router>
  );
}

export default App;
