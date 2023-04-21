import React, { useEffect, useState, useRef } from "react";
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

    const refsArray = useRef([]);

    useEffect(() => {
        //Creates an Array to keep all the nodes' refs
        if(refsArray.current.length !== 25) {
            for(let i = 0; i < 25; i++) {
                refsArray.current.push([]);
                for(let j = 0; j < 25; j++) {
                    refsArray.current[i].push(null);
                };
            };
        };

        const nodesArray = [];

        //If grid is already defined, only apply the necessary changes to it
        if(grid.length > 0) {
            if(gridSize < grid.length) {

                const newGrid = grid.map(row => row.map(node => { return {...node};}));
                newGrid.pop();
                newGrid.forEach(row => row.pop());
                setGrid(newGrid);

            } else if(gridSize > grid.length) {
                const newGrid = grid.map(row => row.map(node => { return {...node};}));
                newGrid.push(new Array(gridSize - 1).fill(null));
                newGrid[newGrid.length - 1] = newGrid[newGrid.length - 1].map((node, nodeIndex) => {
                    const newNode = {
                        col: nodeIndex,
                        row: newGrid.length - 1,
                        type: compareNodes({col: nodeIndex, row: newGrid.length - 1}, startNode) ? 'start' : compareNodes({col: nodeIndex, row: newGrid.length - 1}, endNode) ? 'end' : 'normal'
                    };
                    return newNode;
                });
                newGrid.forEach((row, rowIndex) => row.push({
                    col: newGrid.length - 1,
                    row: rowIndex,
                    type: compareNodes({col: newGrid.length - 1, row: rowIndex}, startNode) ? 'start' : compareNodes({col: newGrid.length - 1, row: rowIndex}, endNode) ? 'end' : 'normal'
                }));

                setGrid(getInitialGrid(newGrid));
            };

        //Else, create the grid from scratch
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

            setGrid(getInitialGrid(nodesArray));
        };
        
       // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gridSize]);


    //Resets the grid when the button Reset is pushed, but keeps start, end and wall nodes
    const resetGrid = () => {
        const newGrid = grid.map(row => {
            return row.map(node => {
                if(node.type === 'start') {
                    refsArray.current[node.row][node.col].className = 'node start-node';
                    return {
                        ...node,
                        type: 'start'
                    };
                }
                else if(node.type === 'end') {
                    refsArray.current[node.row][node.col].className = 'node end-node';
                    return {
                        ...node,
                        type: 'end'
                    };
                }
                else if(node.type === 'wall') {
                    refsArray.current[node.row][node.col].className = 'node wall-node';
                    return {
                        ...node,
                        type: 'wall'
                    };
                }
                else {
                    refsArray.current[node.row][node.col].className = 'node';
                    return {
                        ...node,
                        type: 'normal'
                    };
                };
            });
        });
        setGrid(newGrid);
    };

    //Compares two nodes according to their position on the grid
    const compareNodes = (node1, node2) => {
        return node1.col === node2.col && node1.row === node2.row;
    };

    //Creates the initial grid containing nodes with all necessary properties
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

    //Adds the properties needed to run the algorithm to the node object
    const createNode = (node) => {
        return {
            ...node,
            neighbors: [],
            isVisited: false,
            distance: Infinity,
            previousNode: null
        };
    };

    //Animates the visited nodes in the order in which they were checked by the algorithm
    //Then, calls "animateShortestPath" once it gets to the last visited node
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
                if(node.type !== 'start' && node.type !== 'end')
                    refsArray.current[node.row][node.col].className = 'node visited-node';
            }, 15 * nodeIndex);
        });
    };

    //Animates the nodes that make the shortest path in the order in which they were checked by the algorithm
    const animateShortestPath = (nodesInShortestPathOrder) => {
        nodesInShortestPathOrder.forEach((node, nodeIndex) => {
            setTimeout(() => {
                if(node.type !== 'start' && node.type !== 'end')
                    refsArray.current[node.row][node.col].className = 'node path-node';
            }, 20 * nodeIndex);

            if(nodeIndex === nodesInShortestPathOrder.length - 1)
                setIsAnimating(false);
        });
    };

    //Runs the algorithm, gets the result and calls "animateDijkstra" with it
    const visualizeDijkstra = () => {
        const functionGrid = grid.map(row => row.map(node => { return {...node};}));
        const start = functionGrid[startNode.row][startNode.col];
        const end = functionGrid[endNode.row][endNode.col];
        const visitedNodesInOrder = dijkstra(functionGrid, start, end);
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(end);
        animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
    };

    //Toggles whether the node is a wall or not
    const getNewGridWithWallToggled = (grid, row, col) => {        
        grid[row][col].type = grid[row][col].type === 'wall' ? 'normal' : 'wall';

        if(grid[row][col].type === 'wall')
            refsArray.current[row][col].className = 'node wall-node';
        else
            refsArray.current[row][col].className = 'node';
    };

    const handleOnMouseDown = (row, col) => {
        if(costumizingGrid !== 'wall' || isAnimating || grid[row][col].type === 'start' || grid[row][col].type === 'end')
            return;
        
        getNewGridWithWallToggled(grid, row, col);
        setMouseIsPressed(true);
    };

    const handleOnMouseEnter = (row, col) => {
        if(!mouseIsPressed || costumizingGrid !== 'wall' || isAnimating || grid[row][col].type === 'start' || grid[row][col].type === 'end')
            return;

        getNewGridWithWallToggled(grid, row, col);
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
    
    // const handleChange = (e) => {
    //     if(e.target.value > 0)
    //         setGridSize(+e.target.value);
    //     else
    //         setGridSize(1);
    // };

    const increaseGridsize = () => {
        if(gridSize >= 25)
            return;
            
        setGridSize(gridSize + 1);
    };

    const decreaseGridsize = () => {
        if(gridSize <= 1)
            return;

        for(let row = 0; row < gridSize; row++) {
            refsArray.current[row][gridSize - 1].className = 'node destroy-node';
        }

        for(let col = 0; col < gridSize; col++) {
            refsArray.current[gridSize - 1][col].className = 'node destroy-node';
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
                                                    ref={el => refsArray.current[rowIndex][nodeIndex] = el}
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