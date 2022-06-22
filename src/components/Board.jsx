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

function Board({ socket, room }) {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [isX, setIsX] = useState(false);
  const [turn, setTurn] = useState(false);

  useEffect(() => {
    socket.on("set_player", (data) => {
      setIsX(true);
      setTurn(true);
    });
  }, [socket]);

  useEffect(() => {
    socket.on("receive_move", (data) => {
      setSquares(data.squares);

      setTurn(true);
    });
  }, [socket]);

  useEffect(() => {
    socket.on("receive_restart", (data) => {
      console.log(`recieved restart`);
      handleRestart(false);
    });
  }, [socket]);

  const handleClick = (i) => {
    if (!squares[i] && turn) {
      squares[i] = isX ? "X" : "O";
      setSquares(squares);
      console.log(squares);
      socket.emit("do_move", { squares: squares, room: room, isGame: true });
      setTurn(false);
    }
  };

  let winner = checkWinner(squares);
  let status;

  if (winner) {
    status = `${winner} won!`;
  } else if (isX) {
    status = (turn ? "X" : "O") + "'s turn";
  } else if (!isX) {
    status = (!turn ? "X" : "O") + "'s turn";
  }

  if (squares.every((square) => square !== null) && !winner) {
    status = "You Tied, BORING!";
  }

  function handleRestart(clicked = true) {
    if (isX) {
      setTurn(true);
    } else if (!isX) {
      setTurn(false);
    }

    setSquares(Array(9).fill(null));
    if (clicked) {
      socket.emit("send_restart", { room: room });
    }
  }

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
      {status !== "X's turn" && status !== "O's turn" && isX === true && (
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
