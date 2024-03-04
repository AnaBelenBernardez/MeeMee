import React, { useState } from "react";
import "./style.css";

function CustomRightArrow() {
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
    <div className="right-arrow">
      <button
        className={`arrow-button-green ${clicked ? "clicked" : ""}`}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        <div className="black-triangle-inside"></div>
      </button>
    </div>
  );
}

export default CustomRightArrow;
