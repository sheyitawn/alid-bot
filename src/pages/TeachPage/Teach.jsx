import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MdArrowBackIosNew } from "react-icons/md";
import { Link } from "react-router-dom";
import Modal from '../../components/Modal/Modal';
import './teach.css'

const Teach = () => {
  const [ws, setWs] = useState(null); // set websocket to null

  const [arm0, setArm0] = useState(80);
  const [arm1, setArm1] = useState(80);
  const [arm2, setArm2] = useState(80);

  const [base, setBase] = useState(135);

  const [grip, setGrip] = useState(0);


  const [drop, setDrop] = useState(0);  // 0 false, 1 true

  const [IRValue, setIRValue] = useState(null);


  const [sequence, setSequence] = useState([]);

  const [openModal, setOpenModal] = useState(null); // track the current open modal

  const openSpecificModal = () => setOpenModal(true); // function to open modal
  const closeModal = () => setOpenModal(null); // function to close modal

  const addToSequence = () => {
    const newSequence = [base, arm0, arm1, arm2, grip]
    console.log("🚀 ~ addToSequence ~ newSequence:", newSequence)
    setSequence((prev) => [...prev, ...[newSequence]]); // add to sequence
    toast.success('adding to sequence');   // send confirmaton message
  }

  const playSequence = () => {
    console.log("🚀 ~ sequence:", sequence)
    if (ws && ws.readyState === WebSocket.OPEN) { // check that websocket is open
      ws.send(JSON.stringify({ servoId: 99, sequence })); // command to play the sequence
      toast.success(`playing sequence`); // send confirmation message
    }
  }

  const saveSequence = () => {
    localStorage.setItem("sequence", JSON.stringify(sequence)); // save to local storage
    toast.success(`saving...`); // send confirmation message
  }

  const resetSequence = () => {
    setSequence([]) // empty sequence
    console.log("🚀 ~ sequence:", sequence)
    toast.success(`resetting...`); // send confirmation message
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

  const handleArm2Change = async (value, servoId) => {
    const newPos = parseInt(value, 10);
    setArm2(newPos);

    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ servoId, value: newPos }));
    }  else {
      toast.error('Unable to send arm 2 position')
    }
  };

  const handleGripChange = async (servoId, newValue) => {
    const gripValue = newValue ? 0 : 100; 
    setGrip(gripValue);
  
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ servoId, value: gripValue }));
    } else {
      toast.error('Unable to send grip position');
    }
  };

  const dropBall = async () => {
    const servoId = 4; // servoid of the grip
    const clearance = 20;   // how much before the ball leaves grip
    const value = grip + clearance;

    const newPos = parseInt(grip, 10);
    const newClr = parseInt(value, 10);

    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ servoId, value: newPos })); // swap if opening the wrong way
      ws.send(JSON.stringify({ servoId, value: newClr }));
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
            forwards --- backwards
            
            <input
              className='teach-round_slider'
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
            upwards --- downwards

            <input
              className='teach-round_slider'
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
            wrist down --- wrist up

            <input
              className='teach-round_slider'
              type="range"
              min="0"
              max="180"
              value={arm2}
              onChange={(e) => handleArm2Change(e.target.value, 3)}
            />
            <p>{arm2}°</p>
          </div>
          
        </div>
        <div className="teach-base">
          <h3>Base</h3>
          ccw --- cw
          <input
            className='teach-round_slider'
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
          <label class="teach-switch">
            <input 
              type="checkbox" 
              checked={grip === 0}
              onChange={(e) => handleGripChange(4, e.target.checked)} 
            /> 
            <span class="teach-switch-slider teach-round"></span>
          </label>

          <p>{grip === 0 ? <>open</>: <>closed</>}</p>
        </div>

        <div className="teach-ball">
          <div className="teach-ball_indicator">
            <h3>Ball</h3> 
              <div
                className="teach-ball_indicator-light"
                style={{background: IRValue === '1' ? 'rgb(30, 255, 0)' : 'rgb(78, 0, 0)'}}>
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