import fs from 'fs';

const directions = ['R', 'L', 'U', 'D'] as const;
type Dir = (typeof directions)[number];

function printGrid(grid: string[][]) {
    for (const row of grid) {
        console.log(row.join(''));
    }
    console.log();
}

const input = await fs.readFileSync('./input.txt', 'utf-8');
const digInstructions: { dir: Dir; num: number }[] = input
    .split('\n')
    .map((line) => {
        const [dir, numStr] = line.split(' ');
        return { dir: dir as Dir, num: Number(numStr) };
    });

const points = new Set<{ x: number; y: number }>();

const currPos = { x: 0, y: 0 };
for (const { dir, num } of digInstructions) {
    const { x, y } = currPos;
    const dx = dir === 'R' ? 1 : dir === 'L' ? -1 : 0;
    const dy = dir === 'U' ? -1 : dir === 'D' ? 1 : 0;

    for (let i = 0; i < num; i++) {
        points.add({ x: x + dx * i, y: y + dy * i });
    }

    currPos.x += dx * num;
    currPos.y += dy * num;
}

let minX = Infinity;
let maxX = -Infinity;
let minY = Infinity;
let maxY = -Infinity;
for (const { x, y } of points) {
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
}

// Init grid
const grid: string[][] = Array(maxY - minY + 1)
    .fill(null)
    .map(() => Array(maxX - minX + 1).fill('.'));

// Populate Grid with points
for (const { x, y } of points) {
    grid[y - minY][x - minX] = '#';
}

// Flood fill grid
function floodFill(x: number, y: number) {
    const stack: { x: number; y: number }[] = [{ x, y }];
    while (stack.length > 0) {
        const { x, y } = stack.pop()!;
        if (grid[y][x] === '.') {
            grid[y][x] = '#';
            stack.push({ x: x + 1, y });
            stack.push({ x: x - 1, y });
            stack.push({ x, y: y + 1 });
            stack.push({ x, y: y - 1 });
        }
    }
}

// find the top left point
let topLeftPoint = { x: grid[0].findIndex((cell) => cell === '#'), y: 0 };

console.log(topLeftPoint); //TODO: Seb remove <--------------

// printGrid(grid);
floodFill(topLeftPoint.x + 1, topLeftPoint.y + 1);
printGrid(grid);

let num = 0;
for (const row of grid) {
    for (const cell of row) {
        if (cell === '#') num++;
    }
}
console.log(num); //TODO: Seb remove <--------------
