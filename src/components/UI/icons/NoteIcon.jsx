import React from 'react'
import lottie from "lottie-web";
import { defineElement } from "@lordicon/element";
defineElement(lottie.loadAnimation);

function NoteIcon() {
  return (
    <div className="icon">
      <lord-icon
        style={{ width: "50px", height: "50px" }}
        trigger="loop"
        colors="primary:#121331,secondary:#FFEFE5"
        stroke="bold"
        load="lazy"
        speed="0.2"
        src="/wired-flat-56-document.json"
      ></lord-icon>
    </div>
  );
}

export default NoteIcon