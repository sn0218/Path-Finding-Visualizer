import React, { useState } from 'react';
import './Node.css';

const Node = ({ isStart, isEnd, isWall, row, col }) => {
  const extraClass = isStart
    ? 'node-start'
    : isEnd
    ? 'node-end'
    : isWall
    ? 'node-wall'
    : '';
  return <div id={`node-${row}-${col}`} className={`node ${extraClass}`}></div>;
};

export default Node;
