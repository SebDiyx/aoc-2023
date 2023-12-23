import fs from 'fs';
import { cloneDeep } from 'lodash';

type GraphNode = {
    id: string;
    x: number;
    y: number;
    connections: { node: GraphNode; dist: number }[];
};

function printGrid(grid: string[][]) {
    console.log(grid.map((line) => line.join('')).join('\n'));
}

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

function isJunction(grid: string[][], x: number, y: number) {
    const startPoint = findStartPoint(grid);
    if (x === startPoint.x && y === startPoint.y) return true;

    const endPoint = findEndPoint(grid);
    if (x === endPoint.x && y === endPoint.y) return true;

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
    const graphNodeMap: Map<string, GraphNode> = new Map();

    // Find each junction point of the grid (each junction is a node of our graph)
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[0].length; x++) {
            if (grid[y][x] !== '#' && isJunction(grid, x, y)) {
                const node: GraphNode = {
                    id: `${x},${y}`,
                    x,
                    y,
                    connections: [],
                };
                graphNodeMap.set(`${x},${y}`, node);
            }
        }
    }

    // Connect each junction to its nearest junction in each direction
    for (const node of graphNodeMap.values()) {
        const { x: nodeX, y: nodeY } = node;

        // Perform a BFS to find the nearest node in each direction
        const queue: { x: number; y: number; path: string[] }[] = [
            { x: nodeX, y: nodeY, path: [] },
        ];
        while (queue.length) {
            const { x, y, path } = queue.shift()!;
            path.push(`${x},${y}`);

            // We've reached another node, so connect this node to that node
            if (isJunction(grid, x, y) && `${x},${y}` !== `${nodeX},${nodeY}`) {
                const connection = graphNodeMap.get(`${x},${y}`)!;
                node.connections.push({
                    node: connection,
                    dist: path.length - 1,
                });
                continue;
            }

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
                    grid[newPos.y][newPos.x] !== '#' &&
                    !path.includes(`${newPos.x},${newPos.y}`)
                ) {
                    queue.push({
                        x: newPos.x,
                        y: newPos.y,
                        path: [...path],
                    });
                }
            }
        }
    }
    return {
        start: graphNodeMap.get(`${startPoint.x},${startPoint.y}`)!,
        graphNodeMap,
    };
}

function longestPath(node: GraphNode) {
    const endPoint = findEndPoint(grid);

    const queue: { node: GraphNode; path: string[]; dist: number }[] = [
        { node, path: [], dist: 0 },
    ];
    let longest = 0;
    while (queue.length) {
        const { node, path, dist } = queue.shift()!;

        path.push(`${node.x},${node.y}`);

        if (node.x === endPoint.x && node.y === endPoint.y) {
            if (dist > longest) {
                console.log(dist);
                longest = dist;
            }
            continue;
        }

        for (const connection of node.connections) {
            if (path.includes(connection.node.id)) continue;

            queue.push({
                node: connection.node,
                path: [...path],
                dist: dist + connection.dist,
            });
        }
    }
    return longest;
}

const input = await fs.readFileSync('./input.txt', 'utf-8');
const grid = input.split('\n').map((line) => line.split(''));
const { start } = buildGraph();

const longest = longestPath(start);

console.log('DONE', longest);
