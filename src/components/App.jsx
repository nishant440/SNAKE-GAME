import React, { useEffect, useState, useRef } from "react";
import "../style/App.css";

const BOARD_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 8, y: 8 },
  { x: 7, y: 8 },
];

const App = ({ onExit }) => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(generateFood(INITIAL_SNAKE));
  const [direction, setDirection] = useState({ x: 1, y: 0 });
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const boardRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isGameOver || isPaused) return;
      switch (e.key) {
        case "ArrowUp":
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case "ArrowDown":
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case "ArrowLeft":
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case "ArrowRight":
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [direction, isGameOver, isPaused]);

  useEffect(() => {
    if (isGameOver || isPaused) return;
    const interval = setInterval(moveSnake, 200);
    return () => clearInterval(interval);
  }, [snake, direction, isGameOver, isPaused]);

  function moveSnake() {
    let newHead = {
      x: snake[0].x + direction.x,
      y: snake[0].y + direction.y,
    };

    if (newHead.x < 0) newHead.x = BOARD_SIZE - 1;
    else if (newHead.x >= BOARD_SIZE) newHead.x = 0;
    if (newHead.y < 0) newHead.y = BOARD_SIZE - 1;
    else if (newHead.y >= BOARD_SIZE) newHead.y = 0;

    if (snake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
      setIsGameOver(true);
      return;
    }

    const newSnake = [newHead, ...snake];

    if (newHead.x === food.x && newHead.y === food.y) {
      setScore(score + 1);
      setFood(generateFood(newSnake));
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  }

  function generateFood(snakeArr) {
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * BOARD_SIZE),
        y: Math.floor(Math.random() * BOARD_SIZE),
      };
    } while (snakeArr.some((s) => s.x === newFood.x && s.y === newFood.y));
    return newFood;
  }

  const handleRestart = () => {
    setSnake(INITIAL_SNAKE);
    setFood(generateFood(INITIAL_SNAKE));
    setDirection({ x: 1, y: 0 });
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
  };

  const togglePause = () => setIsPaused(!isPaused);

  return (
    <div className="game-container">
      <h1>🐍 Snake Game</h1>
      <div className="score">Score: {score}</div>

      <div className="controls">
        <button onClick={togglePause} className="control-btn">
          {isPaused ? "▶️ Play" : "⏸ Pause"}
        </button>
        <button onClick={handleRestart} className="control-btn">
          🔄 Restart
        </button>
        <button onClick={onExit} className="control-btn">
          🔙 Back
        </button>
      </div>

      {isGameOver && (
        <div className="game-over-section">
          <div className="game-over">Game Over 😢</div>
        </div>
      )}

      <div className="board" ref={boardRef}>
        {renderCells()}
      </div>
    </div>
  );

  function renderCells() {
    const cells = [];
    for (let y = 0; y < BOARD_SIZE; y++) {
      for (let x = 0; x < BOARD_SIZE; x++) {
        let className = "cell";
        if (snake.some((s) => s.x === x && s.y === y)) className += " snake";
        if (food.x === x && food.y === y) className += " food";
        cells.push(<div key={`${x}-${y}`} className={className} />);
      }
    }
    return cells;
  }
};

export default App;
