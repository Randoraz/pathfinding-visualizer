import React from "react";
import './Node.css';

const Node = ({node, onNodeChange, onMouseDown, onMouseEnter, onMouseUp}) => {
    const row = node.row;
    const col = node.col;
    const type = node.type;
    const isVisited = node.isVisited;

    return (
        <div 
            id={`node-${row}-${col}`}
            className={`node ${type === 'start' ? 'start-node' : 
                                type === 'end' ? 'end-node' : 
                                type === 'wall' ? 'wall-node' : 
                                isVisited ? 'visited-node' : ''}`}
            onClick={() => onNodeChange(node)}
            onMouseDown={() => onMouseDown(node.row, node.col)}
            onMouseEnter={() => onMouseEnter(node.row, node.col)}
            onMouseUp={() => onMouseUp()}></div>
    );
};

export default Node;