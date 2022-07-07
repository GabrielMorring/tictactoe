import Board from "./components/Board";
import { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io.connect("https://gm-tictactoe-server.herokuapp.com/");

function App() {
  const [showBoard, setShowBoard] = useState(false);
  const [room, setRoom] = useState("");

  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", { room: room, id: socket.id });
      setShowBoard(true);
    } else {
      alert("Please enter a username and room");
    }
  };

  return (
    <div className="">
      {showBoard ? (
        <Board socket={socket} room={room} />
      ) : (
        <div className="flex flex-col w-72 mx-auto my-60 items-center">
          <input
            className="w-full p-2 m-2 border border-purple-600 rounded focus:outline-none"
            type="text"
            placeholder="Room ID..."
            onChange={(e) => setRoom(e.target.value)}
          />
          <button
            className="bg-purple-600 px-8 py-1 m-2 rounded text-white hover:bg-purple-700"
            onClick={joinRoom}
          >
            Join A Room
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
