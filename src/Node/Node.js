import React from "react";
import './Node.css';

const Node = ({node, onNodeChange, onMouseDown, onMouseEnter, onMouseUp}) => {
    const isVisited = node.isVisited;
    const isStart = node.isStart;
    const isEnd = node.isEnd;
    const isWall = node.isWall;

    return (
        <div className={`node ${isStart ? 'start-node' : isEnd ? 'end-node' : isWall ? 'wall-node' : isVisited ? 'visited-node' : ''}`}
            onClick={() => onNodeChange(node)}
            onMouseDown={() => onMouseDown(node.row, node.col)}
            onMouseEnter={() => onMouseEnter(node.row, node.col)}
            onMouseUp={() => onMouseUp()}></div>
    );
}

export default Node;