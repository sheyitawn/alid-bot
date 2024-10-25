import React from 'react'
import './play.css'
import { Dot } from 'react-animated-dots';
import { MdArrowBackIosNew } from "react-icons/md";
import { Link } from "react-router-dom";

const Play = () => {
  var sequence = JSON.parse(localStorage.getItem("sequence"))
  console.log("🚀 ~ Play ~ sequence:", sequence)
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