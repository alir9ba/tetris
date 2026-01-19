import { useState, useCallback } from 'react';
import { TETROMINOS, randomTetromino } from '../constants/tetrominos';
import { useInterval } from './useInterval';

const ROWS = 20;
const COLS = 10;

// Helper: Create an empty grid
const createStage = () =>
  Array.from(Array(ROWS), () =>
    new Array(COLS).fill([0, 'clear'])
  );

// Helper: Check for collisions
const checkCollision = (player, stage, { x: moveX, y: moveY }) => {
  for (let y = 0; y < player.tetromino.length; y += 1) {
    for (let x = 0; x < player.tetromino[y].length; x += 1) {
      // 1. Check we're on a Tetromino cell
      if (player.tetromino[y][x] !== 0) {
        if (
          // 2. Check bounds (height, bottom)
          !stage[y + player.pos.y + moveY] ||
          // 3. Check bounds (width, left/right)
          !stage[y + player.pos.y + moveY][x + player.pos.x + moveX] ||
          // 4. Check if cell is not 'clear' (already filled)
          stage[y + player.pos.y + moveY][x + player.pos.x + moveX][1] !== 'clear'
        ) {
          return true;
        }
      }
    }
  }
  return false;
};

export const useTetris = () => {
  const [stage, setStage] = useState(createStage());
  const [score, setScore] = useState(0);
  const [rowsCleared, setRowsCleared] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [dropTime, setDropTime] = useState(null);

  const [player, setPlayer] = useState({
    pos: { x: 0, y: 0 },
    tetromino: TETROMINOS[0].shape,
    collided: false,
  });

  const movePlayer = (dir) => {
    if (!checkCollision(player, stage, { x: dir, y: 0 })) {
      setPlayer(prev => ({ ...prev, pos: { x: prev.pos.x + dir, y: prev.pos.y } }));
    }
  };

  const startGame = () => {
    setStage(createStage());
    setDropTime(1000); // 1 second drop speed
    setGameOver(false);
    setScore(0);
    setRowsCleared(0);
    setPlayer({
      pos: { x: COLS / 2 - 2, y: 0 },
      tetromino: randomTetromino().shape,
      collided: false,
    });
  };

  // Rotate Logic
  const rotate = (matrix, dir) => {
    // Transpose then reverse
    const rotated = matrix[0].map((_, index) =>
      matrix.map(col => col[index])
    );
    if (dir > 0) return rotated.map(row => row.reverse());
    return rotated.reverse();
  };

  const playerRotate = () => {
    const clonedPlayer = JSON.parse(JSON.stringify(player));
    clonedPlayer.tetromino = rotate(clonedPlayer.tetromino, 1);
    
    // Wall kick (basic): If rotation puts us in wall, don't rotate
    if (!checkCollision(clonedPlayer, stage, { x: 0, y: 0 })) {
      setPlayer(clonedPlayer);
    }
  };

  const drop = () => {
    // Increase level/speed logic can go here
    if (!checkCollision(player, stage, { x: 0, y: 1 })) {
      setPlayer(prev => ({ ...prev, pos: { x: prev.pos.x, y: prev.pos.y + 1 } }));
    } else {
      // Game Over check
      if (player.pos.y < 1) {
        setGameOver(true);
        setDropTime(null);
      }
      setPlayer(prev => ({ ...prev, collided: true }));
    }
  };

  // This runs every 'tick'
  useInterval(() => {
    if (!gameOver) drop();
  }, dropTime);

  // Effect: Handle merging and clearing rows when piece collides
  useInterval(() => {
    if (player.collided) {
      // 1. Merge piece into stage
      const newStage = stage.map(row => row.map(cell => cell));
      player.tetromino.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value !== 0) {
            // Safety check
            if (newStage[y + player.pos.y] && newStage[y + player.pos.y][x + player.pos.x]) {
              newStage[y + player.pos.y][x + player.pos.x] = [value, 'merged'];
            }
          }
        });
      });

      // 2. Sweep rows
      const sweptRows = newStage.reduce((ack, row) => {
        if (row.findIndex(cell => cell[0] === 0) === -1) {
          setRowsCleared(prev => prev + 1);
          setScore(prev => prev + 100);
          ack.unshift(new Array(newStage[0].length).fill([0, 'clear']));
          return ack;
        }
        ack.push(row);
        return ack;
      }, []);

      setStage(sweptRows);

      // 3. Reset Player
      setPlayer({
        pos: { x: COLS / 2 - 2, y: 0 },
        tetromino: randomTetromino().shape,
        collided: false,
      });
    }
  }, player.collided ? 0 : null); // Run immediately if collided

  return { stage, player, score, gameOver, movePlayer, playerRotate, startGame };
};