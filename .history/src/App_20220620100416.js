import Board from "./components/Board";
import { useState } from "react";
import io from "socket.io-client";

const socket = io.connect("http://localhost:3001");

function App() {
  const [showBoard, setShowBoard] = useState(false);
  const [userName, setUserName] = useState("");
  const [room, setRoom] = useState("");

  const joinRoom = () => {
    if (userName !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowBoard(true);
    } else {
      alert("Please enter a username and room");
    }
  };

  return (
    <div className="">
      {showBoard ? (
        <Board socket={socket} userName={userName} room={room} />
      ) : (
        <div className="flex flex-col w-72">
          <input
            type="text"
            placeholder="John..."
            onChange={(e) => setUserName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Room ID..."
            onChange={(e) => setRoom(e.target.value)}
          />
          <button onClick={joinRoom}>Join A Room</button>
        </div>
      )}
    </div>
  );
}

export default App;
