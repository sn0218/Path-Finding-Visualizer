import React, { useState } from 'react';
import './Node.css';

const Node = ({ isStart, isEnd, isWall, row, col, grid, setGrid }) => {
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

    // cannot drag to wall node
    if (
      target.className !== 'node node-wall' &&
      origin.className !== 'node node-wall' &&
      target.className !== 'node node-visited' &&
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

    // update the state of grid after the drag and drop
    let newGrid = [...grid];

    const cols = 30;
    const rows = 15;

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
          console.log('1' + node);
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
          console.log('3' + node);
        }
        if (
          node.x === originalRow &&
          node.y === originalCol &&
          String(originalNodeClassName.split('-')[1]) === 'end'
        ) {
          node.isEnd = false;
          console.log('4' + node);
        }
      }
    }

    setGrid(newGrid);
  };

  return (
    <div
      id={`node-${row}-${col}`}
      className={`node ${extraClass}`}
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    ></div>
  );
};

export default Node;
