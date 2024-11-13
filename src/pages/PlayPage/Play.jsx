import React, { useState, useEffect } from 'react';
import './play.css'
import { Dot } from 'react-animated-dots';
import { MdArrowBackIosNew } from "react-icons/md";
import { Link } from "react-router-dom";

const Play = () => {
  const [ws, setWs] = useState(null);
  var sequence = JSON.parse(localStorage.getItem("sequence"))
  console.log("🚀 ~ Play ~ sequence:", sequence)

  // const playSequence = () => {
    console.log("🚀 ~ sequence:", sequence)
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ servoId: 99, sequence })); // command to play the sequence
      // toast.success(`playing sequence`);
    }
  // }

  useEffect(() => {
    const webSocket = new WebSocket("ws://localhost:8080");
    setWs(webSocket);

    return () => {
      if (webSocket) {
        webSocket.close();
      }
    };
  }, []);

  return (
    <div className="play">
      <div className="header">
          <Link to="/">
            <div className='back_button'><MdArrowBackIosNew /></div>
          </Link>
          <p>alid.bot</p>
        </div>
      <div className='play_player'>
        <h2>in progress</h2>
          <Dot className='dot'>.</Dot>
          <Dot className='dot'>.</Dot>
          <Dot className='dot'>.</Dot>
      </div>
    </div>

  )
}

export default Play