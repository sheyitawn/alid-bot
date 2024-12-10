import React from "react";
import "./modal.css";

const Modal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleContentClick = (e) => {
    e.stopPropagation(); // Prevent the click event from propagating to the overlay
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={handleContentClick}>
            <button className="modal-close" onClick={onClose}>
            &times;
            </button>
            <h2>run</h2>
            <ul>
                <li>select 'TEACH'</li>
                <li>ensure ball is detected in dropper</li>
                <li>open grip & add to sequence</li>
                <li>move arm to starting position with ball in hand & add to sequence</li>
                <li>close grip & add to sequence</li>
                <li>move arm to final position & add to sequence</li>
                <li>select 'drop' & add to sequence</li>
                <li>move the bot up to avoid obstruction (arm _ ) & add to sequence</li>
                <li>select 'play sequence' to test</li>
                <li>if sequence works, save sequence</li>
                <li>go to the home page</li>
                <li>select 'PLAY'</li>

            </ul>
        </div>
    </div>
  );
};

export default Modal;
