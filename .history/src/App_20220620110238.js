import Board from "./components/Board";
import { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io.connect("http://localhost:3001");

function App() {
  const [showBoard, setShowBoard] = useState(false);
  const [userName, setUserName] = useState("");
  const [room, setRoom] = useState("");
  const [player, setPlayer] = useState("");

  const joinRoom = () => {
    if (userName !== "" && room !== "") {
      socket.emit("join_room", { room: room, id: socket.id });
    } else {
      alert("Please enter a username and room");
    }
  };

  useEffect(() => {
    socket.on("set_player", (data) => {
      setPlayer(data);
      setShowBoard(true);
    });
  }, []);

  return (
    <div className="">
      {showBoard ? (
        <Board
          socket={socket}
          userName={userName}
          room={room}
          player={player}
        />
      ) : (
        <div className="flex flex-col w-72 mx-auto my-60 items-center">
          <input
            className="w-full p-2 m-2 border border-purple-600 rounded focus:outline-none"
            type="text"
            placeholder="John..."
            onChange={(e) => setUserName(e.target.value)}
          />
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
