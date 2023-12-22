import fs from 'fs';

const STEPS = 26501365;

type Queue = {
    x: number;
    y: number;
    steps: number;
}[];

function printGrid(grid: string[][]) {
    console.log(grid.map((row) => row.join('')).join('\n'));
}

function getStartPoint(grid: string[][]) {
    let x = 0;
    let y = 0;
    grid.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            if (cell === 'S') {
                x = colIndex;
                y = rowIndex;
            }
        });
    });
    return { x, y };
}

/**
 * starting position (S),
 * garden plots (.), and
 * rocks (#)
 *
 * The Elf starts at the starting position (S) which also counts as a garden plot
 */
function traverseGrid(grid: string[][], goal: number) {
    const startPoint = getStartPoint(grid);

    const visited = new Set<string>();
    const queue: Queue = [{ x: startPoint.x, y: startPoint.y, steps: 0 }];
    const endPoints = new Set<string>();
    while (queue.length) {
        const { x, y, steps } = queue.shift()!;

        let safeX = x;
        if (x >= 0) {
            safeX = x % grid[0].length;
        } else {
            safeX = (grid[0].length + (x % grid[0].length)) % grid[0].length;
        }

        let safeY = y;
        if (y >= 0) {
            safeY = y % grid.length;
        } else {
            safeY = (grid.length + (y % grid.length)) % grid.length;
        }

        // console.log({
        //     x,
        //     y,
        //     safeX,
        //     safeY,
        //     width: grid[0].length,
        //     height: grid.length,
        // }); //TODO: Seb remove <--------------
        const cell = grid[safeY][safeX];
        if (cell === '#') continue;

        if (steps === goal) {
            endPoints.add(`${x},${y}`);
            continue;
        }
        if (!visited.has(`${x + 1},${y},${steps + 1}`)) {
            queue.push({ x: x + 1, y, steps: steps + 1 });
            visited.add(`${x + 1},${y},${steps + 1}`);
        }
        if (!visited.has(`${x - 1},${y},${steps + 1}`)) {
            queue.push({ x: x - 1, y, steps: steps + 1 });
            visited.add(`${x - 1},${y},${steps + 1}`);
        }
        if (!visited.has(`${x},${y + 1},${steps + 1}`)) {
            queue.push({ x, y: y + 1, steps: steps + 1 });
            visited.add(`${x},${y + 1},${steps + 1}`);
        }
        if (!visited.has(`${x},${y - 1},${steps + 1}`)) {
            queue.push({ x, y: y - 1, steps: steps + 1 });
            visited.add(`${x},${y - 1},${steps + 1}`);
        }
    }

    return [...endPoints].length;
}

const input = await fs.readFileSync('./input.txt', 'utf-8');
const grid = input.split('\n').map((row) => row.split(''));
const a0 = 3917; // traverseGrid(grid, 65);
const a1 = 34920; // traverseGrid(grid, 131 + 65);
const a2 = 96829; // traverseGrid(grid, 262 + 65);
const b0 = a0;
const b1 = a1 - a0;
const b2 = a2 - a1;
const n = Math.floor(STEPS / grid.length);
const ans = b0 + b1 * n + Math.floor((n * (n - 1)) / 2) * (b2 - b1);
console.log(ans);
