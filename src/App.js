import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./pages/HomePage/Home";
import Play from "./pages/PlayPage/Play";
import Teach from "./pages/TeachPage/Teach";
import './App.css'; 

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/play" element={<Play />} />
          <Route path="/teach" element={<Teach />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
