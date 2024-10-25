import React, { useState } from 'react';
import newRequest from '../../utils/newRequest';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MdArrowBackIosNew } from "react-icons/md";
import { Link } from "react-router-dom";

import './teach.css'

const Teach = () => {



  const [arm0, setArm0] = useState(0);
  const [arm1, setArm1] = useState(0);
  const [arm2, setArm2] = useState(0);

  const [base, setBase] = useState(1700); // 1700

  const [grip, setGrip] = useState(0);


  const [sequence, setSequence] = useState([]);


  const handleBaseChange = async (event) => {
    const newPos = parseInt(event.target.value);
    const currServo = 0;   // base servo is 0
    setBase(newPos)

    try {
      const response = await newRequest.post('/control', {
        servo: currServo,
        position: newPos,
      });
      toast.success(`Servo ${currServo} moved to position ${newPos}`);
    } catch (error) {
      console.error('Error moving servo:', error);
    }
  };

  const handleGripChange = async (event) => {
    const newPos = parseInt(event.target.value);
    const currServo = 0;   // base servo is 0
    setGrip(newPos)

    try {
      const response = await newRequest.post('/control', {
        servo: currServo,
        position: newPos,
      });
      toast.success(`Servo ${currServo} moved to position ${newPos}`);
    } catch (error) {
      console.error('Error moving servo:', error);
    }
  };

  const addToSequence = () => {
    const newSequence = [arm0, arm1, arm2, base, grip]
    console.log("🚀 ~ addToSequence ~ newSequence:", newSequence)
    setSequence((prev) => [...prev, ...[newSequence]]);
    toast.success('adding to sequence');
  }

  const playSequence = () => {
    console.log("🚀 ~ sequence:", sequence)
    toast.success(`playing sequence`);
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
              max="360"
              value={arm0}
              onChange={(e) => setArm0(parseInt(e.target.value))}
            />
            <p>{arm0}°</p>
          </div>

          <div className="teach-arms_a1">
            <h3>Arm 1</h3>
            <input
              type="range"
              min="0"
              max="360"
              value={arm1}
              onChange={(e) => setArm1(parseInt(e.target.value))}
            />
            <p>{arm1}°</p>
          </div>          


          <div className="teach-arms_a2">
            <h3>Arm 2</h3>
            <input
              type="range"
              min="0"
              max="360"
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
            min="500"
            max="2500"
            value={base}
            onChange={handleBaseChange}
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
            onChange={handleGripChange}
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