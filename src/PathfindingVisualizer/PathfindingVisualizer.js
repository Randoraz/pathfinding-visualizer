import React, { useEffect, useState } from "react";
import Node from "../Node/Node";
import './PathfindingVisualizer.css';
import { dijkstra } from "../algorithm/dijkstra";

const PathfindingVisualizer = () => {
    const [gridSize, setGridSize] = useState(15);
    const [grid, setGrid] = useState([]);
    const [startNode, setStartNode] = useState({col: 2, row: 7, isStart: true, isEnd: false});
    const [endNode, setEndNode] = useState({col: 12, row: 7, isStart: false, isEnd: true});
    const [costumizingGrid, setCostumizingGrid] = useState('start');
    const [mouseIsPressed, setMouseIsPressed] = useState(false);

    useEffect(() => {
        resetGrid();
    }, [gridSize]);

    const resetGrid = () => {
        const nodesArray = [];
        for(let row = 0; row < gridSize; row++) {
            const currentRow = [];

            for(let col = 0; col < gridSize; col++) {
                const currentNode = {
                    col,
                    row,
                    isStart: compareNodes({col: col, row: row}, startNode),
                    isEnd: compareNodes({col: col, row: row}, endNode)
                };

                currentRow.push(currentNode);
            };
            
            nodesArray.push(currentRow);
        };
        
        setGrid(getInitialGrid(nodesArray));
    };

    const compareNodes = (node1, node2) => {
        return node1.col === node2.col && node1.row === node2.row;
    };

    const getInitialGrid = (nodes) => {
        const initialGrid = [];
        nodes.forEach(row => {
            const currentRow = [];
            row.forEach(node => {
                currentRow.push(createNode(node));
            });

            initialGrid.push(currentRow);
        });

        return initialGrid;
    };

    const animateDijkstra = (visitedNodesInOrder) => {
        visitedNodesInOrder.forEach((node, nodeIndex) => {
            setTimeout(() => {
                const newGrid = grid.slice();
                const newNode = {
                    ...node,
                    isVisited: true
                };
                newGrid[node.row][node.col] = newNode;
                setGrid(newGrid);
            }, 20 * nodeIndex);
        });
    };

    const visualizeDijkstra = () => {
        const functionGrid = grid.map(row => row.map(node => { return {...node};}));
        const start = functionGrid[startNode.row][startNode.col];
        const end = functionGrid[endNode.row][endNode.col];
        const visitedNodesInOrder = dijkstra(functionGrid, start, end);
        animateDijkstra(visitedNodesInOrder);
    };

    const createNode = (node) => {
        return {
            ...node,
            distance: Infinity,
            isVisited: false,
            isWall: false,
            previousNode: null
        };
    };

    const getNewGridWithWallToggled = (grid, row, col) => {
        const newGrid = grid.map(row => row.map(node => { return {...node};}));
        const node = newGrid[row][col];
        let newNode;
        if(!node.isStart && !node.isEnd) {
            newNode = {
                ...node,
                isWall: !node.isWall
            };
        };
        newGrid[row][col] = newNode;
        return newGrid;
    };

    const changeStartNode = (grid, row, col) => {
        const newGrid = grid.map(row => row.map(node => { return {...node, isStart: false};}));
        const node = newGrid[row][col];
        const newStartNode = {
            ...node,
            isWall: false,
            isStart: true
        };

        newGrid[row][col] = newStartNode;
        setStartNode(newStartNode);
        setGrid(newGrid);
    };

    const changeEndNode = (grid, row, col) => {
        const newGrid = grid.map(row => row.map(node => { return {...node, isEnd: false};}));
        const node = newGrid[row][col];
        const newEndNode = {
            ...node,
            isWall: false,
            isEnd: true
        };

        newGrid[row][col] = newEndNode;
        setEndNode(newEndNode);
        setGrid(newGrid);
    };

    const handleChange = (e) => {
        if(e.target.value > 0)
            setGridSize(+e.target.value);
        else
            setGridSize(1);
    };

    const handleOnMouseDown = (row, col) => {
        if(costumizingGrid === 'start' || costumizingGrid === 'end')
            return;
        
        const newGrid = getNewGridWithWallToggled(grid, row, col);
        setMouseIsPressed(true);
        setGrid(newGrid);
    };

    const handleOnMouseEnter = (row, col) => {
        if(!mouseIsPressed || !costumizingGrid === 'wall')
            return;

        const newGrid = getNewGridWithWallToggled(grid, row, col);
        setGrid(newGrid);
    };

    const handleOnMouseUp = () => {
        setMouseIsPressed(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    }

    const handleChoosing = (e) => {
        setCostumizingGrid(e.target.value);
    };

    const handleNodeChange = (node) => {
        switch(costumizingGrid) {
            case 'start':
                if(compareNodes(node, endNode))
                    return;

                changeStartNode(grid, node.row, node.col);
                return;
            case 'end':
                if(compareNodes(node, startNode))
                    return;
                    
                changeEndNode(grid, node.row, node.col);
            default:
                return;
        };
    };
    
    return (
        <div className="pathfinding-visualizer">
            <div className="grid" style={{gridTemplateColumns: `repeat(${gridSize}, 3rem)`, width: `calc(${gridSize}*3rem)`}}>
            {grid.map((row, rowIndex) => {
                return row.map((node, nodeIndex) => <Node node={node} 
                                                    onNodeChange={handleNodeChange}
                                                    onMouseDown={handleOnMouseDown}
                                                    onMouseEnter={handleOnMouseEnter}
                                                    onMouseUp={handleOnMouseUp}
                                                    key={`${rowIndex}${nodeIndex}`} />);
            })}
        </div>
            <form className="grid-form" onSubmit={handleSubmit}>
                <label htmlFor="grid-size-input">Grid Size</label>
                <input id="grid-size-input" type="number" min="1" onChange={handleChange} value={gridSize}></input>
                <br/>
                <label htmlFor="choose-start-node">Choose Start Node</label>
                <input id="choose-start-node" type="radio" name="costumize-grid" value="start" onClick={handleChoosing} defaultChecked></input>
                <label htmlFor="choose-end-node">Choose End Node</label>
                <input id="choose-end-node" type="radio" name="costumize-grid" value="end" onClick={handleChoosing}></input>
                <label htmlFor="draw-walls">Draw walls</label>
                <input id="draw-walls" type="radio" name="costumize-grid" value="wall" onClick={handleChoosing}></input>
                <br/>
                <button onClick={visualizeDijkstra}>Visualize</button>
                <br/>
                <button onClick={resetGrid}>Reset</button>
            </form>
        </div>
        
    );
}

export default PathfindingVisualizer;