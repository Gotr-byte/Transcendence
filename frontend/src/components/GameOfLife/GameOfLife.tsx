import './GameOfLife.css';
import { FC, useState, useCallback, useRef } from "react";
import useInterval from "./useInterval";
import { Button, Spacer } from '@chakra-ui/react';

const numRows = 25;
const numCols = 35;
const positions = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0],
];

const randomTiles = (): number[][] => {
  const rows = [];
  for ( let i = 0; i < numRows; i++)
  {
    rows.push(Array.from(Array(numCols), () => (Math.random() > 0.7 ? 1 : 0))); // returns a live cell 70% of the time
  }
  return rows;
}

const GameOfLife: FC = () => {
  const [running, setRunning] = useState(false);
  const [grid, setGrid] = useState(() => {
    return randomTiles();
  });

  const runningRef = useRef(running);
  runningRef.current = running;

  const runSimulation = useCallback((grid: any) => {
    if (!runningRef.current) {
      return;
    }

    let gridCopy = JSON.parse(JSON.stringify(grid));
    for (let i = 0; i < numRows; i++) {
      for (let j = 0; j < numCols; j++) {
        let neighbors = 0;

        positions.forEach(([x, y]) => {
          const newI = i + x;
          const newJ = j + y;

          if (newI >= 0 && newI < numRows && newJ >= 0 && newJ < numCols) {
            neighbors += grid[newI][newJ];
          }
        });

        if (neighbors < 2 || neighbors > 3) {
          gridCopy[i][j] = 0;
        } else if (grid[i][j] === 0 && neighbors === 3) {
          gridCopy[i][j] = 1;
        }
      }
    }

    setGrid(gridCopy);
  }, []);
  useInterval(() => {
    runSimulation(grid);
  }, 150);

  const generateEmptyGrid = (): number[][] => {
    const rows = [];
    for ( let i = 0; i < numRows; i++) {
      rows.push(Array.from(Array(numCols), () => 0));
    }
    return rows;
  }
  return (
    <div
    style={{
      display: "grid",
      gridTemplateColumns: `repeat(${numCols}, 20px)`,
      width: "fit-content",
      margin: "0 auto",
    }}>
    {grid.map((rows, i) =>
      rows.map((col, k) => (
        <div
        key={`${i} - ${k}`} 
        onClick={() => {
          let newGrid = JSON.parse(JSON.stringify(grid));
          newGrid[i][k] = grid[i][k] ? 0 : 1;
          setGrid(newGrid);
        }}
          style={{
            width: 20,
            height: 20,
            backgroundColor: grid[i][k] ? "#F68E5F" : undefined,
            border: "1px solid #595959",
          }}
        />
      ))
    )}
<Button
  onClick={() => {
    setRunning(!running);
    if (!running) {
      runningRef.current = true;
    }
    setInterval(() => {
      runSimulation(grid);
    }, 1000);
  }}
>
  {running ? "||" : ">"}
</Button>
<Spacer/>
<Button
onClick = {() => {
  setGrid(generateEmptyGrid());
}}
>
  0
</Button>
<Spacer/>
<Button
  onClick={() => {
    setGrid(randomTiles());
  }}
>
  X
</Button>
  </div>
  );
};

export default GameOfLife;