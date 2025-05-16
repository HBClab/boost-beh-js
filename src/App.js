import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home/Home";
import Results from "./pages/Results/Results";
import InProgress from "./pages/InProgress/InProgress";
import './App.css';

function App() {
  return (
      <Router>
        <div className="app">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/results" element={<Results />} />
            <Route path="/inprogress" element={<InProgress />} />
          </Routes>
        </div>
      </Router>
  );
}

export default App;
