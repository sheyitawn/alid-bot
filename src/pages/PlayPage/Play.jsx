import React, { useState, useEffect } from 'react';
import './play.css'
import { Dot } from 'react-animated-dots';
import { MdArrowBackIosNew } from "react-icons/md";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import Modal from '../../components/Modal/Modal';

import 'react-toastify/dist/ReactToastify.css';

const Play = () => {
  const [ws, setWs] = useState(null);

  const [IRValue, setIRValue] = useState(null);

  const [openModal, setOpenModal] = useState(null); // Track which modal is open

  const openSpecificModal = () => setOpenModal(true);
  const closeModal = () => setOpenModal(null);

  var sequence = JSON.parse(localStorage.getItem("sequence"))
  
  console.log("🚀 ~ Play ~ sequence:", sequence)

  const playSequence = () => {
    console.log("🚀 ~ sequence:", sequence)
    console.log("🚀 ~ playSequence ~ ws:", ws)

    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ servoId: 99, sequence })); // command to play the sequence
      toast.success(`playing sequence`);
    }
  }

  useEffect(() => {
    const webSocket = new WebSocket("ws://localhost:3003"); // connect to websocket
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

  useEffect(() => {
    if (IRValue == 1) {   // if ball is detected
      playSequence()  // play the sequence

    }

 },[IRValue]);

  return (
    <div className="play">
      <div className="header">
          <Link to="/">
            <div className='back_button'><MdArrowBackIosNew /></div>
          </Link>
          <p onClick={openSpecificModal}>alid.bot</p>
      </div>
      <div className='play_player'>
        <h2>in progress</h2>
          <Dot className='dot'>.</Dot>
          <Dot className='dot'>.</Dot>
          <Dot className='dot'>.</Dot>
      </div>
      <Modal isOpen={openModal} onClose={closeModal}>
      </Modal>

      <div className="play_indicator">
        BALL
        <div
          className="play_indicator-light"
          style={{background: IRValue === '1' ? 'rgb(30, 255, 0)' : 'rgb(78, 0, 0)'}}>
        </div>

      </div>
    </div>

  )
}

export default Play