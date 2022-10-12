import React, { useState } from 'react';
import './Node.css';

const cols = 30;
const rows = 15;

const Node = ({ isStart, isEnd, isWall, row, col, grid, setGrid }) => {
  const [down, setDown] = useState(false);
  const extraClass = isStart
    ? 'node-start'
    : isEnd
    ? 'node-end'
    : isWall
    ? 'node-wall'
    : '';

  const handleDragStart = (e) => {
    e.dataTransfer.setData('id', e.target.id);
    e.dataTransfer.setData('className', e.target.className);
  };
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();

    let originalNodeID = e.dataTransfer.getData('id');
    let originalNodeClassName = e.dataTransfer.getData('className');
    let targetClassName = e.target.className;

    // swap the className of two nodes after drag and drop
    let target = document.getElementById(`${e.target.id}`);
    let origin = document.getElementById(`${originalNodeID}`);

    // cannot drag to wall node, path nodes and visited nodes
    if (
      origin.className !== 'node node-wall' &&
      target.className !== 'node node-wall' &&
      origin.className !== 'node node-visited' &&
      target.className !== 'node node-visited' &&
      origin.className !== 'node node-shortest-path' &&
      target.className !== 'node node-shortest-path'
    ) {
      target.setAttribute('class', originalNodeClassName);
      origin.setAttribute('class', targetClassName);
    } else {
      console.log('You cannot drag to wall!');
      return;
    }

    // get the row and col of the original and target nodes
    let originalRow = parseInt(originalNodeID.split('-')[1]);
    let originalCol = parseInt(originalNodeID.split('-')[2]);
    let targetRow = parseInt(e.target.id.split('-')[1]);
    let targetCol = parseInt(e.target.id.split('-')[2]);

    let newGrid = [...grid];

    // update the state of grid after the drag and drop
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        let node = newGrid[i][j];
        if (
          node.x === targetRow &&
          node.y === targetCol &&
          String(targetClassName.split('-')[1]) !== 'start' &&
          String(targetClassName.split('-')[1]) !== 'end' &&
          String(originalNodeClassName.split('-')[1]) === 'start'
        ) {
          node.isStart = true;
        }
        if (
          node.x === targetRow &&
          node.y === targetCol &&
          String(targetClassName.split('-')[1]) !== 'start' &&
          String(targetClassName.split('-')[1]) !== 'end' &&
          String(originalNodeClassName.split('-')[1]) === 'end'
        ) {
          node.isEnd = true;
          console.log('2' + node);
        }
        if (
          node.x === originalRow &&
          node.y === originalCol &&
          String(originalNodeClassName.split('-')[1]) === 'start'
        ) {
          node.isStart = false;
        }
        if (
          node.x === originalRow &&
          node.y === originalCol &&
          String(originalNodeClassName.split('-')[1]) === 'end'
        ) {
          node.isEnd = false;
        }
      }
    }

    // clear previous visualization after changing start or end node
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
  };

  const handleDown = (e) => {
    setDown(true);

    let targetRow = parseInt(e.target.id.split('-')[1]);
    let targetCol = parseInt(e.target.id.split('-')[2]);

    let newGrid = [...grid];
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        let node = newGrid[i][j];
        if (
          node === newGrid[targetRow][targetCol] &&
          !node.isStart &&
          !node.isEnd
        ) {
          node.isWall = !isWall;
        }
      }
    }
    setGrid(newGrid);
  };

  const handleUp = (e) => {
    setDown(false);
  };

  return (
    <div
      id={`node-${row}-${col}`}
      className={`node ${extraClass}`}
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onMouseDown={handleDown}
      onMouseUp={handleUp}
    ></div>
  );
};

export default Node;
