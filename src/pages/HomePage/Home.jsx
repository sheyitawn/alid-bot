import React from "react";
import { Link } from "react-router-dom";
import './home.css';


function Home() {
  
  return (
    <div className="home">
        <h1>alid.bot</h1>
      <Link to="/play">
        <button>PLAY</button>
      </Link>
      <Link to="/teach">
        <button>TEACH</button>
      </Link>
    </div>
  );
}

export default Home;
