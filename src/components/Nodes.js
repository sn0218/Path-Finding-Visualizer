import React from 'react';
import './nodes.css';

const Nodes = () => {
  return (
    <div className="container">
      <div className="nodes-instruction shadow-sm p-3 mb-3 bg-white rounded">
        <div className="node-container">
          <div id="start-node" class="node"></div>
          <p>Start Node</p>
        </div>
        <div className="node-container">
          <div id="end-node" class="node"></div>
          <p>End Node</p>
        </div>

        <div className="node-container">
          <div id="wall-node" class="node"></div>
          <p>Wall Node</p>
        </div>
        <div className="node-container">
          <div id="path-node" class="node"></div>
          <p>Path Node</p>
        </div>
        <div className="node-container">
          <div id="visited-node" class="node"></div>
          <p>Visited Node</p>
        </div>
      </div>
    </div>
  );
};

export default Nodes;
