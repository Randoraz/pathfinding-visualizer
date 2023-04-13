import React, { useEffect, useState } from "react";
import Node from "../Node/Node";
import './PathfindingVisualizer.css';
import { dijkstra, getNodesInShortestPathOrder } from "../algorithm/dijkstra";

const PathfindingVisualizer = () => {
    const [gridSize, setGridSize] = useState(15);
    const [grid, setGrid] = useState([]);
    const [startNode, setStartNode] = useState({col: 2, row: 7, type: 'start'});
    const [endNode, setEndNode] = useState({col: 12, row: 7, type: 'end'});
    const [costumizingGrid, setCostumizingGrid] = useState('start');
    const [isAnimating, setIsAnimating] = useState(false);
    const [mouseIsPressed, setMouseIsPressed] = useState(false);

    useEffect(() => {
        const nodesArray = [];

        if(grid.length > 0) {
            for(let row = 0; row < gridSize; row++) {
                const currentRow = [];
                for(let col = 0; col < gridSize; col++) {
                    if(grid[row] !== undefined && grid[row][col] !== undefined) {
                        const currentNode = {
                            col: grid[row][col].col,
                            row: grid[row][col].row,
                            type: grid[row][col].type
                        };
                        currentRow.push(currentNode);

                    } else {
                        const currentNode = {
                            col,
                            row,
                            type: compareNodes({col: col, row: row}, startNode) ? 'start' : compareNodes({col: col, row: row}, endNode) ? 'end' : 'normal'
                        };
                        currentRow.push(currentNode);
                    };
                };
                
                nodesArray.push(currentRow);
            };
        } else {
            for(let row = 0; row < gridSize; row++) {
                const currentRow = [];
    
                for(let col = 0; col < gridSize; col++) {
                    const currentNode = {
                        col,
                        row,
                        type: compareNodes({col: col, row: row}, startNode) ? 'start' : compareNodes({col: col, row: row}, endNode) ? 'end' : 'normal'
                    };
    
                    currentRow.push(currentNode);
                };
                
                nodesArray.push(currentRow);
            };
        };
        
        setGrid(getInitialGrid(nodesArray));
       // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gridSize]);

    const resetGrid = () => {
        const newGrid = grid.map(row => {
            return row.map(node => {
                if(node.type === 'start') {
                    document.getElementById(`node-${node.row}-${node.col}`).className = 'node start-node';
                    return {
                        ...node,
                        type: 'start'
                    };
                }
                else if(node.type === 'end') {
                    document.getElementById(`node-${node.row}-${node.col}`).className = 'node end-node';
                    return {
                        ...node,
                        type: 'end'
                    };
                }
                else if(node.type === 'wall') {
                    document.getElementById(`node-${node.row}-${node.col}`).className = 'node wall-node';
                    return {
                        ...node,
                        type: 'wall'
                    };
                }
                else {
                    document.getElementById(`node-${node.row}-${node.col}`).className = 'node';
                    return {
                        ...node,
                        type: 'normal'
                    };
                };
            });
        });
        setGrid(newGrid);
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

    const animateDijkstra = (visitedNodesInOrder, nodesInShortestPathOrder) => {
        setIsAnimating(true);
        visitedNodesInOrder.forEach((node, nodeIndex) => {
            if(nodeIndex === visitedNodesInOrder.length - 1) {
                setTimeout(() => {
                    animateShortestPath(nodesInShortestPathOrder);
                }, 20 * nodeIndex);
                return;
            };

            setTimeout(() => {
                // const newGrid = grid.slice();
                // const newNode = {
                //     ...node,
                //     isVisited: true
                // };
                // newGrid[node.row][node.col] = newNode;
                //setGrid(newGrid);
                if(node.type !== 'start' && node.type !== 'end')
                    document.getElementById(`node-${node.row}-${node.col}`).className = 'node visited-node';
            }, 15 * nodeIndex);
        });
    };

    const animateShortestPath = (nodesInShortestPathOrder) => {
        nodesInShortestPathOrder.forEach((node, nodeIndex) => {
            setTimeout(() => {
                if(node.type !== 'start' && node.type !== 'end')
                    document.getElementById(`node-${node.row}-${node.col}`).className = 'node path-node';
            }, 20 * nodeIndex);

            if(nodeIndex === nodesInShortestPathOrder.length - 1)
                setIsAnimating(false);
        });
    };

    const visualizeDijkstra = () => {
        const functionGrid = grid.map(row => row.map(node => { return {...node};}));
        const start = functionGrid[startNode.row][startNode.col];
        const end = functionGrid[endNode.row][endNode.col];
        const visitedNodesInOrder = dijkstra(functionGrid, start, end);
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(end);
        animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
    };

    const createNode = (node) => {
        return {
            ...node,
            neighbors: [],
            isVisited: false,
            distance: Infinity,
            previousNode: null
        };
    };

    const getNewGridWithWallToggled = (grid, row, col) => {
        // const newGrid = grid.map(row => row.map(node => { return {...node};}));
        // const node = newGrid[row][col];
        // const newNode = {
        //     ...node,
        //     type: node.type === 'wall' ? 'normal' : 'wall'
        // };
        // newGrid[row][col] = newNode;
        // return newGrid;
        grid[row][col].type = grid[row][col].type === 'wall' ? 'normal' : 'wall';

        if(grid[row][col].type === 'wall')
            document.getElementById(`node-${row}-${col}`).className = 'node wall-node';
        else
            document.getElementById(`node-${row}-${col}`).className = 'node';
    };
    
    // const handleChange = (e) => {
    //     if(e.target.value > 0)
    //         setGridSize(+e.target.value);
    //     else
    //         setGridSize(1);
    // };

    const handleOnMouseDown = (row, col) => {
        if(costumizingGrid !== 'wall' || isAnimating || grid[row][col].type === 'start' || grid[row][col].type === 'end')
            return;
        
        getNewGridWithWallToggled(grid, row, col);
        setMouseIsPressed(true);
        //setGrid(newGrid);
    };

    const handleOnMouseEnter = (row, col) => {
        if(!mouseIsPressed || costumizingGrid !== 'wall' || isAnimating || grid[row][col].type === 'start' || grid[row][col].type === 'end')
            return;

        getNewGridWithWallToggled(grid, row, col);
        //setGrid(newGrid);
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
                return;
            default:
                break;
        };
    };

    const changeStartNode = (grid, row, col) => {
        const newGrid = grid.map(row => row.map(node => {
            if(node.type === 'start')
                return {...node, type: 'normal'};
            else
                return {...node};
        }));
        const node = newGrid[row][col];
        const newStartNode = {
            ...node,
            type: 'start'
        };

        newGrid[row][col] = newStartNode;
        setStartNode(newStartNode);
        setGrid(newGrid);
    };

    const changeEndNode = (grid, row, col) => {
        const newGrid = grid.map(row => row.map(node => {
            if(node.type === 'end')
                return {...node, type: 'normal'};
            else
                return {...node};
        }));
        const node = newGrid[row][col];
        const newEndNode = {
            ...node,
            type: 'end'
        };

        newGrid[row][col] = newEndNode;
        setEndNode(newEndNode);
        setGrid(newGrid);
    };

    const increaseGridsize = () => {
        if(gridSize >= 25)
            return;

            setTimeout(() => {
                setGridSize(gridSize + 1);
            }, 500);
    };

    const decreaseGridsize = () => {
        if(gridSize <= 1)
            return;

        for(let row = 0; row < gridSize; row++) {
            document.getElementById(`node-${row}-${gridSize - 1}`).className = 'node destroy-node';
        }

        for(let col = 0; col < gridSize; col++) {
            document.getElementById(`node-${gridSize - 1}-${col}`).className = 'node destroy-node';
        }

        setTimeout(() => {
            setGridSize(gridSize - 1);
        }, 500);
    };
    
    return (
        <div className="pathfinding-visualizer">
            <h1>Pathfinding Visualizer</h1>
            <div className="grid" onMouseLeave={handleOnMouseUp} style={{gridTemplateColumns: `repeat(${gridSize}, 3rem)`, width: `calc(${gridSize}*3rem)`}}>
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
                <div className="costumize-grid-options">
                    {/* <label className="gridsize-label" htmlFor="grid-size-input">Grid Size</label>
                    <input id="grid-size-input" type="number" min="1" onChange={handleChange} value={gridSize}></input> */}
                    <p>Grid Size</p>
                    <div className="adjust-gridsize">
                        <button onClick={increaseGridsize}>+</button>
                        <p>{gridSize}</p>
                        <button onClick={decreaseGridsize}>-</button>
                    </div>

                    <label className="radio-label" htmlFor="choose-start-node">Choose Start Node</label>
                    <input id="choose-start-node" type="radio" name="costumize-grid" value="start" onClick={handleChoosing} defaultChecked></input>

                    <label className="radio-label" htmlFor="choose-end-node">Choose End Node</label>
                    <input id="choose-end-node" type="radio" name="costumize-grid" value="end" onClick={handleChoosing}></input>

                    <label className="radio-label" htmlFor="draw-walls">Draw walls</label>
                    <input id="draw-walls" type="radio" name="costumize-grid" value="wall" onClick={handleChoosing}></input>
                </div>
                <button onClick={visualizeDijkstra}>Visualize</button>
                <button onClick={resetGrid}>Reset</button>
            </form>
        </div>
        
    );
}

export default PathfindingVisualizer;