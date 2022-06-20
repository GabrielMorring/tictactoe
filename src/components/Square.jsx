import React from "react";

function Square({ value, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-slate-500 border-solid border-2 border-gray-900 w-40 h-40 text-9xl text-center "
    >
      {value}
    </button>
  );
}

export default Square;
