import MinHeap from './MinHeap';
require('./MinHeap');

export const dijkstra = (grid, startNode, endNode) => {
    const visitedNodesInOrder = [];
    startNode.distance = 0;
    const unvisitedNodes = getAllNodes(grid);
    //const unvisitedNodesHeap = new MinHeap();
    unvisitedNodes.forEach(node => getNeighbors(node, grid));
    //unvisitedNodesHeap.add(startNode);
    while (!!unvisitedNodes.length) {
        sortNodesByDistance(unvisitedNodes);
        const closestNode = unvisitedNodes.shift();
        //const closestNode = unvisitedNodesHeap.popMin();

        if (closestNode.type === 'wall') continue;
        
        if (closestNode.distance === Infinity) return visitedNodesInOrder;

        closestNode.isVisited = true;
        visitedNodesInOrder.push(closestNode);

        if (closestNode === endNode) return visitedNodesInOrder;

        updateUnvisitedNeighbors(closestNode, grid);
        // closestNode.neighbors.forEach(neighbor => {
        //     if(!neighbor.isVisited)
        //         unvisitedNodesHeap.add(neighbor);
        // });
    };
};

const getAllNodes = (grid) => {
    const nodes = [];
    grid.forEach(row => {
        row.forEach(node => {
            nodes.push(node);
        });
    });

    return nodes;
};

const sortNodesByDistance = (unvisitedNodes) => {
    unvisitedNodes.sort((node1, node2) => node1.distance - node2.distance);
};

const updateUnvisitedNeighbors = (node) => {
    const unvisitedNeighbors = node.neighbors.filter(neighbor => !neighbor.isVisited);
    unvisitedNeighbors.forEach(neighbor => {
        neighbor.distance = node.distance + 1;
        neighbor.previousNode = node;
    });
};

const getNeighbors = (node, grid) => {
    const {col, row} = node;
    if (row > 0) node.neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) node.neighbors.push(grid[row + 1][col]);
    if (col > 0) node.neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) node.neighbors.push(grid[row][col + 1]);
};

export const getNodesInShortestPathOrder = (finishNode) => {
    const nodesInShortestPathOrder = [];
    let currentNode = finishNode;
    while (currentNode !== null) {
        nodesInShortestPathOrder.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
}
