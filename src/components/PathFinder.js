import React, { useState, useEffect } from 'react';
import Node from './Node';
import './PathFinder.css';
import Astar from '../graphSearchAlgo/Astar';
import BFS from '../graphSearchAlgo/bfs';
import DFS from '../graphSearchAlgo/dfs';
import Dijkstra from '../graphSearchAlgo/dijkstra';

// Global variables
const cols = 30;
const rows = 15;
let startRow = 11;
let startCol = 4;
let endRow = 4;
let endCol = 26;

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
        }, 100 * i);
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
    /* const startNode = grid[startRow][startCol];
    const endNode = grid[endRow][endCol]; */

    // find the startNode and endNode from the grid
    let startNode;
    let endNode;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        let node = grid[i][j];
        if (node.isStart) {
          startNode = node;
        }
        if (node.isEnd) {
          endNode = node;
        }
      }
    }

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
      case 'djikstra':
        newRes = Dijkstra(startNode, endNode);
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
    <div className="container visualizer">
      <div className="buttons">
        <div id="algo-button" class="dropdown">
          <button
            class="btn dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Visualize Algorithm
          </button>
          <ul class="dropdown-menu">
            <li>
              <button
                class="dropdown-item"
                type="button"
                onClick={selectAlgo}
                value="Astar"
              >
                A* search
              </button>
            </li>
            <li>
              <button
                class="dropdown-item"
                type="button"
                onClick={selectAlgo}
                value="BFS"
              >
                Breadth-First Search
              </button>
            </li>
            <li>
              <button
                class="dropdown-item"
                type="button"
                onClick={selectAlgo}
                value="DFS"
              >
                Depth-First Search
              </button>
            </li>
          </ul>
        </div>

        <button type="button" id="wall-button" class="btn" onClick={createWall}>
          Generate random wall nodes
        </button>
        <button type="button" id="reset-button" class="btn" onClick={resetGrid}>
          Reset the grid
        </button>
      </div>

      <div id="grid" className="grid">
        {grid.map((row, rowId) => {
          return (
            <div key={rowId} id={`row-${rowId}`} className="row">
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
                    grid={grid}
                    setGrid={setGrid}
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
