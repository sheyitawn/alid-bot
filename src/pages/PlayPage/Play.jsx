import React from 'react'
import './play.css'
import { Dot } from 'react-animated-dots';

const Play = () => {
  return (
    <div className='play'>
      <h2>in progress</h2>
        <Dot className='dot'>.</Dot>
        <Dot className='dot'>.</Dot>
        <Dot className='dot'>.</Dot>
    </div>
  )
}

export default Play