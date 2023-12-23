import fs from 'fs';

function printGrid(grid: string[][]) {
    for (const row of grid) {
        console.log(row.join(''));
    }
    console.log('===');
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

function populateGrid(grid: string[][], path: string[]) {
    for (const pos of path) {
        const [x, y] = pos.split(',').map((n) => Number(n));
        grid[y][x] = 'O';
    }
}

function search() {
    const startPoint = findStartPoint(grid);
    const endPoint = findEndPoint(grid);

    const stack: {
        x: number;
        y: number;
        pathLength: number;
        dx: number;
        dy: number;
        path: string[];
    }[] = [{ ...startPoint, pathLength: 1, dx: 0, dy: 0, path: [] }];
    const paths: string[][] = [];
    while (stack.length) {
        const { x, y, pathLength, dx, dy, path } = stack.pop()!;

        if (grid[y][x] === '#') {
            console.log(grid[y][x]);
            continue;
        }

        // Reached the end
        if (x === endPoint.x && y === endPoint.y) {
            // pathLengths.push(pathLength);
            paths.push(path);
        }

        // Already been here and we're not allowed to go back to exactly the same place
        if (path.includes(`${x},${y}`)) {
            continue;
        }
        path.push(`${x},${y}`);

        for (const [ndx, ndy] of [
            [0, 1],
            [1, 0],
            [0, -1],
            [-1, 0],
        ]) {
            /**
             * paths (.), forest (#), and steep slopes (^, >, v, and <).
             */

            // Don't go back the way we came
            if (dx === -ndx && dy === -ndy) continue;
            // Can only go up
            if (grid[y][x] === '^' && ndy !== -1) continue;
            // Can only go right
            if (grid[y][x] === '>' && ndx !== 1) continue;
            // Can only go down
            if (grid[y][x] === 'v' && ndy !== 1) continue;
            // Can only go left
            if (grid[y][x] === '<' && ndx !== -1) continue;

            const newPos = { x: x + ndx, y: y + ndy };

            // Only add if the new position is within the grid
            if (
                !path.includes(`${newPos.x},${newPos.y}`) &&
                newPos.x >= 0 &&
                newPos.y >= 0 &&
                newPos.x < grid[0].length &&
                newPos.y < grid.length &&
                grid[newPos.y][newPos.x] !== '#'
            ) {
                stack.push({
                    x: newPos.x,
                    y: newPos.y,
                    pathLength: pathLength + 1,
                    dx: ndx,
                    dy: ndy,
                    path: [...path],
                });
            }
        }
    }
    return paths.sort((a, b) => a.length - b.length);
}

const input = await fs.readFileSync('./input.txt', 'utf-8');
const grid = input.split('\n').map((line) => line.split(''));
const pathLengths = search();
console.log(pathLengths.map((path) => path.length));

// populateGrid(grid, pathLengths.at(-1)!);
// printGrid(grid);
