import Board from "./components/Board";
import { useState } from "react";

function App() {
  const [showBoard, setShowBoard] = useState(false);

  return (
    <div className="">
      {showBoard ? (
        <Board />
      ) : (
        <button onClick={() => setShowBoard(true)}>Show Board</button>
      )}
    </div>
  );
}

export default App;
