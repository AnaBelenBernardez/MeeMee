import React, { useState } from "react";
import "./style.css";

function ArrowButton() {
  const [clicked, setClicked] = useState(false);

  const handleMouseDown = () => {
    setClicked(true);
    setTimeout(() => {
      setClicked(false);
    }, 5000);
  };

  const handleMouseUp = () => {
    setClicked(false);
  };

  return (
    <div className="arrow-element">
      <button
        className={`arrow-button ${clicked ? "clicked" : ""}`}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        <div className="triangles-container">
          <div className="black-triangle">
            <div className="green-triangle"></div>
          </div>
        </div>
      </button>
    </div>
  );
}

export default ArrowButton;
