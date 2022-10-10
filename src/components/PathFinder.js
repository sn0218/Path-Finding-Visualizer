import React, { useState, useEffect } from 'react';
import Node from './Node';
import './PathFinder.css';
import Astar from '../graphSearchAlgo/Astar';
import BFS from '../graphSearchAlgo/bfs';
import DFS from '../graphSearchAlgo/dfs';

const cols = 15;
const rows = 15;
let startRow = 12;
let startCol = 2;
let endRow = 2;
let endCol = 13;

const PathFinder = () => {
  const [grid, setGrid] = useState([]);
  const [res, setRes] = useState([]);

  useEffect(() => {
    // first render of grid
    createGrid(rows, cols);
  }, []);

  // rerender the grid if the result has pathNodes and visited nodes
  useEffect(() => {
    if (res.pathNodes && res.visited) {
      visualizeShortestPath();
    }
  }, [res]);

  // Point object for each node component
  class Point {
    constructor(row, col) {
      this.x = row;
      this.y = col;
      this.isStart = this.x === startRow && this.y === startCol;
      this.isEnd = this.x === endRow && this.y === endCol;
      this.f = 0;
      this.g = 0;
      this.h = 0;
      this.parent = null;
      this.neighbours = [];
      this.isWall = false;
    }

    addNeighbour(grid) {
      let i = this.x;
      let j = this.y;

      // add up, down, left, right neighbours
      if (i > 0) this.neighbours.push(grid[i - 1][j]);
      if (i < rows - 1) this.neighbours.push(grid[i + 1][j]);
      if (j > 0) this.neighbours.push(grid[i][j - 1]);
      if (j < cols - 1) this.neighbours.push(grid[i][j + 1]);
    }
  }

  const createGrid = (rows, cols) => {
    // create 2d array for the grid
    let grid = new Array(rows);
    for (let i = 0; i < rows; i++) {
      grid[i] = new Array(cols);
    }

    // initailize the grid
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        grid[i][j] = new Point(i, j);
      }
    }

    // add neighbours of each node
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        grid[i][j].addNeighbour(grid);
      }
    }

    // update the state of grid
    setGrid(grid);

    /* // set startNode and endNode
    const startNode = grid[startRow][startCol];
    const endNode = grid[endRow][endCol];
    startNode.isWall = false;
    endNode.isWall = false;

    // get the result from A* search
    //let initRes = Astar(startNode, endNode);
    //let initRes = BFS(startNode, endNode);

    // update the state of res
    //setRes(initRes); */
  };

  // create maze by randomly creating wall nodes
  const createWall = () => {
    // set startNode and endNode
    let newGrid = [...grid];
    const startNode = grid[startRow][startCol];
    const endNode = grid[endRow][endCol];
    startNode.isWall = false;
    endNode.isWall = false;

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (newGrid[i][j] !== startNode && newGrid[i][j] !== endNode) {
          if (Math.random(1) < 0.25) {
            newGrid[i][j].isWall = true;
          }
        }
      }
    }

    setGrid(newGrid);
  };

  /* Animation by update node className*/
  const animateShortestPath = (pathNodes) => {
    if (pathNodes.length > 0) {
      for (let i = 0; i < pathNodes.length; i++) {
        setTimeout(() => {
          const node = pathNodes[i];
          // set the visited nodes with new className
          document.querySelector(`#node-${node.x}-${node.y}`).className =
            'node node-shortest-path';
        }, 50 * i);
      }
    } else {
      console.log('No path!');
    }
  };

  const animatedVisitedNode = (node, i) => {
    setTimeout(() => {
      if (!node.isStart && !node.isEnd) {
        // set the visited nodes with new className
        document.querySelector(`#node-${node.x}-${node.y}`).className =
          'node node-visited';
      }
    }, 50 * i);
  };

  const visualizeShortestPath = () => {
    for (let i = 0; i <= res.visited.length; i++) {
      // finish traversing all the visited nodes
      if (i === res.visited.length) {
        setTimeout(() => {
          let nodes = res.pathNodes.slice(0, res.pathNodes.length - 1);
          animateShortestPath(nodes);
        }, 50 * i);
      }
      // traverse each visited node
      else {
        animatedVisitedNode(res.visited[i], i);
      }
    }
  };

  const selectAlgo = (e) => {
    const startNode = grid[startRow][startCol];
    const endNode = grid[endRow][endCol];

    // clear the previous algo visualization
    let newGrid = [...grid];
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        let node = newGrid[i][j];
        if (!node.isStart && !node.isEnd && !node.isWall) {
          // reset className
          document.querySelector(`#node-${node.x}-${node.y}`).className =
            'node ';
        }
      }
    }
    setGrid(newGrid);

    // get the selected algorithm from event value
    const algo = e.target.value;

    let newRes;
    switch (algo) {
      case 'BFS':
        newRes = BFS(startNode, endNode);
        break;
      case 'DFS':
        newRes = DFS(startNode, endNode);
        break;
      case 'Astar':
        newRes = Astar(startNode, endNode);
        break;
      default:
        console.log('No algorithm is chosen!');
    }

    setRes(newRes);
  };

  const resetGrid = () => {
    // clear the result
    setRes([]);

    // reset nodes className
    let newGrid = [...grid];
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        let node = newGrid[i][j];
        if (!node.isStart && !node.isEnd) {
          // reset className
          document.querySelector(`#node-${node.x}-${node.y}`).className =
            'node ';
        }
      }
    }
    setGrid(newGrid);

    // reinitialize the grid
    createGrid(rows, cols);
  };

  return (
    <div className="visualizer">
      <button onClick={selectAlgo} value="Astar">
        Visualize A* search
      </button>
      <button onClick={selectAlgo} value="BFS">
        Visualize BFS
      </button>
      <button onClick={selectAlgo} value="DFS">
        Visualize DFS
      </button>
      <button onClick={createWall}>Generate wall</button>
      <button onClick={resetGrid}>Reset</button>
      <div className="grid">
        {grid.map((row, rowId) => {
          return (
            <div key={rowId} className="row">
              {row.map((col, colId) => {
                const { isStart, isEnd, isWall } = col;
                return (
                  <Node
                    key={colId}
                    isStart={isStart}
                    isEnd={isEnd}
                    isWall={isWall}
                    row={rowId}
                    col={colId}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PathFinder;
