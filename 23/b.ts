import fs from 'fs';

type GraphNode = {
    x: number;
    y: number;
    next: { node: GraphNode; dist: number }[];
    prev: { node: GraphNode; dist: number }[];
};

function findStartPoint(grid: string[][]) {
    for (let x = 0; x < grid[0].length; x++) {
        if (grid[0][x] === '.') {
            return { x, y: 0 };
        }
    }
    throw new Error('No start point found');
}

function findEndPoint(grid: string[][]) {
    for (let x = 0; x < grid[0].length; x++) {
        if (grid[grid.length - 1][x] === '.') {
            return { x, y: grid.length - 1 };
        }
    }
    throw new Error('No end point found');
}

// const cache = new Map<string, Omit<StackItem, 'path' | 'pathLength'>[]>();
// function getNextPositions(
//     grid: string[][],
//     item: Omit<StackItem, 'path' | 'pathLength'>,
// ) {
//     const { x, y } = item;

//     if (cache.has(`${x},${y}`)) {
//         return cache.get(`${x},${y}`)!;
//     }

//     const nextPositions: Omit<StackItem, 'path' | 'pathLength'>[] = [];
//     for (const [ndx, ndy] of [
//         [0, 1],
//         [1, 0],
//         [0, -1],
//         [-1, 0],
//     ]) {
//         /**
//          * paths (.), forest (#), and steep slopes (^, >, v, and <).
//          */

//         // Don't go back the way we came
//         const newPos = { x: x + ndx, y: y + ndy };

//         // Only add if the new position is within the grid

//         if (
//             newPos.x >= 0 &&
//             newPos.y >= 0 &&
//             newPos.x < grid[0].length &&
//             newPos.y < grid.length &&
//             grid[newPos.y][newPos.x] !== '#'
//         ) {
//             nextPositions.push({
//                 x: newPos.x,
//                 y: newPos.y,
//             });
//         }
//     }

//     cache.set(`${x},${y}`, nextPositions);

//     return nextPositions;
// }

function isJunction(grid: string[][], x: number, y: number) {
    let count = 0;
    for (const [ndx, ndy] of [
        [0, 1],
        [1, 0],
        [0, -1],
        [-1, 0],
    ]) {
        const newPos = { x: x + ndx, y: y + ndy };
        if (
            newPos.x >= 0 &&
            newPos.y >= 0 &&
            newPos.x < grid[0].length &&
            newPos.y < grid.length &&
            grid[newPos.y][newPos.x] !== '#'
        ) {
            count++;
        }
    }
    return count > 2;
}

function buildGraph() {
    const startPoint = findStartPoint(grid);
    const endPoint = findEndPoint(grid);
    const graphNodeMap: Map<string, GraphNode> = new Map();
    graphNodeMap.set(`${startPoint.x},${startPoint.y}`, {
        x: startPoint.x,
        y: startPoint.y,
        next: [],
        prev: [],
    });
    graphNodeMap.set(`${endPoint.x},${endPoint.y}`, {
        x: endPoint.x,
        y: endPoint.y,
        next: [],
        prev: [],
    });

    // Find each node of sds graph (all the walkable positions)
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[0].length; x++) {
            if (grid[y][x] !== '#' && isJunction(grid, x, y)) {
                const node: GraphNode = {
                    x,
                    y,
                    next: [],
                    prev: [],
                };
                graphNodeMap.set(`${x},${y}`, node);
            }
        }
    }

    // Connect each node to its neighbours
    for (const node of graphNodeMap.values()) {
        const { x, y } = node;
        for (const [ndx, ndy] of [
            [0, 1],
            [1, 0],
            [0, -1],
            [-1, 0],
        ]) {
            const newPos = { x: x + ndx, y: y + ndy };
            if (graphNodeMap.has(`${newPos.x},${newPos.y}`)) {
                const nextNode = graphNodeMap.get(`${newPos.x},${newPos.y}`)!;
                node.next.push({
                    node: nextNode,
                    dist: 1,
                });
                nextNode.prev.push({ node, dist: 1 });
            }
            node.prev.push({ node, dist: 1 });
        }
    }
    return graphNodeMap.get(`${startPoint.x},${startPoint.y}`)!;
}

function longestPath(node: GraphNode) {
    const { x: endX, y: endY } = findEndPoint(grid);
    const queue: { node: GraphNode; path: string[] }[] = [{ node, path: [] }];
    let longest = 0;
    while (queue.length) {
        const { node, path } = queue.shift()!;
        if (path.includes(`${node.x},${node.y}`)) {
            continue;
        }
        path.push(`${node.x},${node.y}`);

        if (node.x === endX && node.y === endY) {
            if (path.length > longest) {
                console.log(path.length);
                longest = path.length;
            }
            continue;
        }

        for (const { node: nextNode, dist: nextDist } of node.next) {
            queue.push({ node: nextNode, path: [...path] });
        }
    }
    return longest;
}
// const queue: { x: number; y: number }[] = [startPoint];
// const visited = new Set<string>();
// while (queue.length) {
//     const { x, y } = queue.shift()!;

//     // Already been here and we're not allowed to go back to exactly the same place
//     if (visited.includes(`${x},${y}`)) {
//         continue;
//     }
//     path.push(`${x},${y}`);

//     // Reached the end
//     if (x === endPoint.x && y === endPoint.y) {
//         if (pathLength > longest) {
//             console.log(pathLength);
//             longest = pathLength;
//         }
//         continue;
//     }

//     const next = getNextPositions(grid, { x, y }).filter(
//         (pos) => !(pos.x === x && pos.y === y),
//     );
//     for (const pos of next) {
//         queue.push({
//             ...pos,
//             pathLength: pathLength + 1,
//             path: [...path],
//         });
//     }
// }
// return longest;

const input = await fs.readFileSync('./input.txt', 'utf-8');
const grid = input.split('\n').map((line) => line.split(''));
const node = buildGraph();

console.log('DONE', node);

console.log(longestPath(node));
console.log('DONE');

// populateGrid(grid, pathLengths.at(-1)!);
// printGrid(grid);
