import React, { useState } from 'react';
import './teach.css'

const Teach = () => {



  const [arm0, setArm0] = useState(0);
  const [arm1, setArm1] = useState(0);
  const [arm2, setArm2] = useState(0);

  const [base, setBase] = useState(0);

  const [grip, setGrip] = useState(0);


  return (
    <div className='teach'>
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
              onChange={(e) => setArm0(e.target.value)}
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
              onChange={(e) => setArm1(e.target.value)}
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
              onChange={(e) => setArm2(e.target.value)}
            />
            <p>{arm2}°</p>
          </div>
          
        </div>
        <div className="teach-base">
          <h3>Base</h3>

          <input
            type="range"
            min="0"
            max="360"
            value={base}
            onChange={(e) => setBase(e.target.value)}
          />
          <p>{base}°</p>

        </div>
        <div className="teach-grip">
          <h3>Grip</h3>

          <input 
            type="checkbox" 
            checked={grip}
            onChange={(e) => setGrip(e.target.checked)}
          />
          <p>
            {grip ? 'open' : 'closed'}
          </p>
        </div>
        
      </div>
      {/* <button>teach</button> */}


    </div>
  )
}

export default Teach