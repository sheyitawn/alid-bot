import React, { useState, useEffect } from 'react';
import newRequest from '../../utils/newRequest';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MdArrowBackIosNew } from "react-icons/md";
import { Link } from "react-router-dom";
import Modal from '../../components/Modal/Modal';
import './teach.css'

const Teach = () => {
  const [ws, setWs] = useState(null);

  const [arm0, setArm0] = useState(0);
  const [arm1, setArm1] = useState(0);
  const [arm2, setArm2] = useState(0);

  const [base, setBase] = useState(0);

  const [grip, setGrip] = useState(0);

  const [IRValue, setIRValue] = useState(null);


  const [sequence, setSequence] = useState([]);
  // var sequence = JSON.parse(localStorage.getItem("sequence"))

  const [openModal, setOpenModal] = useState(null); // Track which modal is open

  const openSpecificModal = () => setOpenModal(true);
  const closeModal = () => setOpenModal(null);

  const addToSequence = () => {
    const newSequence = [base, arm0, arm1, grip]
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

  const handleGripChange = async (servoId) => {
    // const newPos = parseInt(value, 10);
    setGrip((prevGrip) => (prevGrip === 0 ? 100 : 0));

    // setGrip(newPos);
    

    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ servoId, value: grip }));
    }  else {
      toast.error('Unable to send grip position')
    }
  };

  const dropBall = async () => {
    const servoId = 4;
    const clearance = 20;   // how much before the ball leaves grip
    const value = grip + clearance;

    const newPos = parseInt(grip, 10);
    const newClr = parseInt(value, 10);
    setArm1(newPos);
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ servoId, value: newClr })); // swap if opening the wrong way
      ws.send(JSON.stringify({ servoId, value: newPos }));
    }  else {
      toast.error('Unable to drop ball')
    }
  };

  useEffect(() => {
    const webSocket = new WebSocket("ws://localhost:3003");
    setWs(webSocket);

    webSocket.onmessage = (event) => {
      setIRValue(event.data);

    };

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
        <p onClick={openSpecificModal}>alid.bot</p>
      </div>
      <Modal isOpen={openModal} onClose={closeModal}>
      </Modal>
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
              onChange={(e) => handleArm0Change(e.target.value, 1)}
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
              onChange={(e) => handleArm1Change(e.target.value, 2)}
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
            onChange={(e) => handleBaseChange(e.target.value, 0)}
          />
          <p>{base}°</p>

        </div>
        <div className="teach-grip">
          <h3>Grip</h3>

          {/* <input
            type="range"
            min="500"
            max="2500"
            value={grip}
          />
          <p>{grip}°</p> */}


          <label class="teach-switch">
            <input 
              type="checkbox" 
              checked={grip === 0}
              onChange={(e) => handleGripChange(4)}
            /> 
            <span class="teach-slider teach-round"></span>
          </label>

          <p>{grip === 0 ? <>open</>: <>closed</>}</p>
        </div>

        <div className="teach-ball">
          <div className="teach-ball_indicator">
            <h3>Ball</h3> 
              <div
                className="teach-ball_indicator-light"
                style={{background: IRValue === '1' ? 'rgb(30, 255, 0)' : 'rgb(78, 0, 0)'}}>
                {/* {IRValue} */}
              </div>
          </div>
          <div className='teach-buttons'>
            <button onClick={dropBall}>drop</button>
          </div>
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