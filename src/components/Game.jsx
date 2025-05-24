import React, { useState } from "react";
import "../style/Game.css";
import App from "./App.jsx";

const Game = () => {
  const [startGame, setStartGame] = useState(false);

  const handleStart = () => {
    setStartGame(true);
  };

  const handleExit = () => {
    setStartGame(false);
  };

  return (
    <div>
      {startGame ? (
        <App onExit={handleExit} />
      ) : (
        <div className="Game-Container">
          <h5 className="Welcome-Game">Welcome to Snake game</h5>
          <button className="Game-start" onClick={handleStart}>
            Start
          </button>
        </div>
      )}
    </div>
  );
};

export default Game;
