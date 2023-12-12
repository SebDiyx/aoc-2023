import fs from 'fs';

/**
 * | is a vertical pipe connecting north and south.
 *   - Valid pipes are above and below the current tile.
 * - is a horizontal pipe connecting east and west.
 *    - Valid pipes are to the left and right of the current tile.
 * L is a 90-degree bend connecting north and east.
 *    - Valid pipes are above and to the right of the current tile.
 * J is a 90-degree bend connecting north and west.
 *    - Valid pipes are above and to the left of the current tile.
 * 7 is a 90-degree bend connecting south and west.
 *    - Valid pipes are below and to the left of the current tile.
 * F is a 90-degree bend connecting south and east.
 *    - Valid pipes are below and to the right of the current tile.
 * . is ground; there is no pipe in this tile.
 * S is the starting position of the animal; there is a pipe on this tile, but your sketch doesn't show what shape the pipe has.
 */

type StartNode = {
    value: 'S';
    paths: ListNode[]; // Should only be 2 paths
    x: number;
    y: number;
};

// Doublely linked list
type ListNode = {
    value: string;
    next: ListNode | null;
    prev: ListNode | StartNode;
    x: number;
    y: number;
};

function getStartNode(grid: string[][]) {
    // Get our start node from the map
    let startNode: StartNode | undefined;
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            if (grid[y][x] === 'S') {
                startNode = {
                    x,
                    y,
                    value: 'S',
                    paths: [],
                };

                // Find the two valid pipes next to our start node
                const left = grid[y][x - 1];
                const right = grid[y][x + 1];
                const top = grid[y - 1][x];
                const bottom = grid[y + 1][x];
                const paths: ListNode[] = [];
                if (left === '-' || left === 'L' || left === 'F') {
                    startNode.paths.push({
                        value: left,
                        next: null,
                        x: x - 1,
                        y,
                        prev: startNode,
                    });
                }
                if (right === '-' || right === 'J' || right === '7') {
                    startNode.paths.push({
                        value: right,
                        next: null,
                        x: x + 1,
                        y,
                        prev: startNode,
                    });
                }
                if (top === '|' || top === 'F' || top === '7') {
                    startNode.paths.push({
                        value: top,
                        next: null,
                        x,
                        y: y - 1,
                        prev: startNode,
                    });
                }
                if (bottom === '|' || bottom === 'L' || bottom === 'J') {
                    startNode.paths.push({
                        value: bottom,
                        next: null,
                        x,
                        y: y + 1,
                        prev: startNode,
                    });
                }

                break;
            }
        }
        if (startNode) break;
    }

    return startNode;
}

function setNextNode(node: ListNode, grid: string[][], length = 1) {
    const { x, y, value, prev } = node;

    let nextX: number | null = null;
    let nextY: number | null = null;
    switch (value) {
        case '-':
            // ['?', '-', '?']
            nextX = prev.x === x - 1 ? x + 1 : x - 1;
            nextY = y;
            break;

        case '|':
            // ['?']
            // ['|']
            // ['?']
            nextY = prev.y === y - 1 ? y + 1 : y - 1;
            nextX = x;
            break;
        case 'L':
            // ['?', '.']
            // ['L', '?']
            nextX = prev.x === x + 1 ? x : x + 1;
            nextY = prev.y === y - 1 ? y : y - 1;
            break;
        case 'J':
            // ['.', '?']
            // ['?', 'J']
            nextX = prev.x === x - 1 ? x : x - 1;
            nextY = prev.y === y - 1 ? y : y - 1;
            break;
        case '7':
            // ['?', '7']
            // ['.', '?']
            nextX = prev.x === x - 1 ? x : x - 1;
            nextY = prev.y === y + 1 ? y : y + 1;
            break;
        case 'F':
            // ['F', '?']
            // ['?', '.']
            nextX = prev.x === x + 1 ? x : x + 1;
            nextY = prev.y === y + 1 ? y : y + 1;
            break;
    }

    if (nextY !== null && nextX !== null) {
        if (grid[nextY][nextX] === 'S') {
            // We've found the end
            return length;
        }
        node.next = {
            value: grid[nextY][nextX],
            next: null,
            x: nextX,
            y: nextY,
            prev: node,
        };
        return setNextNode(node.next, grid, length + 1);
    }

    throw new Error('DEAD END?????');
}

const input = await fs.readFileSync('./input.txt', 'utf-8');
const grid = input.split('\n').map((line) => line.split(''));
const startNode = getStartNode(grid);
const length = setNextNode(startNode!.paths[0], grid);
console.log(Math.ceil(length / 2));
