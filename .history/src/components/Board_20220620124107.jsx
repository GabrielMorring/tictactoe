import React, { useState, useEffect } from "react";
import Square from "./Square";

function checkWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function Board({ socket, userName, room }) {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [isX, setIsX] = useState(false);
  const [turn, setTurn] = useState(isX ? true : false);

  useEffect(() => {
    socket.on("set_player", (data) => {
      setIsX(data.player1);
    });
  }, [socket]);

  useEffect(() => {
    socket.on("receive_move", (data) => {
      setSquares(data);
      setTurn(true);
    });
  }, [socket]);

  const handleClick = (i) => {
    if (turn) {
      return;
    }
    squares[i] = isX ? "X" : "O";
    setSquares(squares);
    socket.emit("do_move", { squares: squares });
    setTurn(false);
  };

  let winner = checkWinner(squares);
  let status;

  if (winner) {
    status = `${winner} won!`;
  } else {
    status = (isX ? "X" : "O") + "'s turn";
  }

  if (squares.every((square) => square !== null)) {
    status = "You Tied, BORING!";
  }

  const handleRestart = () => {
    setIsX(true);
    setSquares(Array(9).fill(null));
  };

  return (
    <div className="m-auto max-w-md mt-8 ">
      <h1>You are player {isX ? "X" : "O"}</h1>
      <div className="flex">
        <Square value={squares[0]} onClick={() => handleClick(0)} />
        <Square value={squares[1]} onClick={() => handleClick(1)} />
        <Square value={squares[2]} onClick={() => handleClick(2)} />
      </div>
      <div className="flex">
        <Square value={squares[3]} onClick={() => handleClick(3)} />
        <Square value={squares[4]} onClick={() => handleClick(4)} />
        <Square value={squares[5]} onClick={() => handleClick(5)} />
      </div>
      <div className="flex">
        <Square value={squares[6]} onClick={() => handleClick(6)} />
        <Square value={squares[7]} onClick={() => handleClick(7)} />
        <Square value={squares[8]} onClick={() => handleClick(8)} />
      </div>
      <div className="my-5 font-sans font-bold text-lg">{status}</div>
      {status !== "X's turn" && status !== "O's turn" && (
        <button
          className="bg-slate-500 p-3 rounded hover:bg-slate-700 hover:text-white focus:outline-none"
          onClick={() => handleRestart()}
        >
          Restart
        </button>
      )}
    </div>
  );
}

export default Board;
