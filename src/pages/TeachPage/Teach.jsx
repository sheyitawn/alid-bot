import React, { useState, useEffect } from 'react';
import newRequest from '../../utils/newRequest';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MdArrowBackIosNew } from "react-icons/md";
import { Link } from "react-router-dom";

import './teach.css'

const Teach = () => {
  const [ws, setWs] = useState(null);

  const [arm0, setArm0] = useState(0);
  const [arm1, setArm1] = useState(0);
  const [arm2, setArm2] = useState(0);

  const [base, setBase] = useState(0);

  const [grip, setGrip] = useState(0);


  const [sequence, setSequence] = useState([]);
  // var sequence = JSON.parse(localStorage.getItem("sequence"))


  const addToSequence = () => {
    const newSequence = [arm0, base]
    console.log("🚀 ~ addToSequence ~ newSequence:", newSequence)
    setSequence((prev) => [...prev, ...[newSequence]]);
    toast.success('adding to sequence');
  }

  const playSequence = () => {
    console.log("🚀 ~ sequence:", sequence)
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ servoId: 99, sequence })); // command to play the sequence
      toast.success(`playing sequence`);
    }
  }

  const saveSequence = () => {
    localStorage.setItem("sequence", JSON.stringify(sequence));
    toast.success(`saving...`);
  }

  const resetSequence = () => {
    setSequence([])
    console.log("🚀 ~ sequence:", sequence)
    toast.success(`resetting...`);
  }

  const handleBaseChange = async (value, servoId) => {
    const newPos = parseInt(value, 10);
    setBase(newPos);

    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ servoId, value: newPos }));
    }  else {
      toast.error('Unable to send base position')
    }
  };

  const handleArm0Change = async (value, servoId) => {
    const newPos = parseInt(value, 10);
    setArm0(newPos);
    console.log("🚀 ~ handleArm0Change ~ newPos:", newPos)


    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ servoId, value: newPos }));
      console.log("sending state")

    }  else {
      toast.error('Unable to send arm 0 position')
    }
  };

  const handleArm1Change = async (value, servoId) => {
    const newPos = parseInt(value, 10);
    setArm1(newPos);

    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ servoId, value: newPos }));
    }  else {
      toast.error('Unable to send arm 1 position')
    }
  };

  useEffect(() => {
    const webSocket = new WebSocket("ws://localhost:8080");
    setWs(webSocket);

    return () => {
      if (webSocket) {
        webSocket.close();
      }
    };


    // return () => {
    //   if (webSocket.readyState === 1) { // <-- This is important
    //     webSocket.close();
    //   }
    // }
  }, []);

  

  return (
    <div className='teach'>
      <ToastContainer />

      <div className="header">
        <Link to="/">
          <div className='back_button'><MdArrowBackIosNew /></div>
        </Link>
        <p>alid.bot</p>
      </div>

      <h1>Teach Mode</h1>
      <div className="teach_sections">
        <div className="teach-arms">
          <div className="teach-arms_a0">
            <h3>Arm 0</h3>
            <input
              type="range"
              min="0"
              max="180"
              value={arm0}
              onChange={(e) => handleArm0Change(e.target.value, 0)}
            />
            <p>{arm0}°</p>
          </div>

          <div className="teach-arms_a1">
            <h3>Arm 1</h3>
            <input
              type="range"
              min="0"
              max="180"
              value={arm1}
              onChange={(e) => handleArm1Change(e.target.value, 0)}
            />
            <p>{arm1}°</p>
          </div>          


          <div className="teach-arms_a2">
            <h3>Arm 2</h3>
            <input
              type="range"
              min="0"
              max="180"
              value={arm2}
              onChange={(e) => setArm2(parseInt(e.target.value))}
            />
            <p>{arm2}°</p>
          </div>
          
        </div>
        <div className="teach-base">
          <h3>Base</h3>

          <input
            type="range"
            min="0"
            max="180"
            value={base}
            onChange={(e) => handleBaseChange(e.target.value, 3)}
          />
          <p>{base}°</p>

        </div>
        <div className="teach-grip">
          <h3>Grip</h3>

          <input
            type="range"
            min="500"
            max="2500"
            value={grip}
          />
          <p>{grip}°</p>
        </div>
        
      </div>
      <div className='teach-buttons'>
        <button onClick={addToSequence}>add to sequence</button>
        <button onClick={playSequence}>play sequence</button>
        <button onClick={saveSequence}>save</button>
        <button onClick={resetSequence}>reset</button>
      </div>


    </div>
  )
}

export default Teach