import React from "react";

function BtnPrimary(props) {
  return (
    <button
      className={`w-${props.width} btn btn-error bg-[#EF846A] text-sm text-white`}
      type={props.type}
    >
      {props.children}
    </button>
  );
}

export default BtnPrimary;
