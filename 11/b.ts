import fs from 'fs';

function findEmptyRows(grid: string[][]): number[] {
    const emptyRows: number[] = [];
    for (let i = 0; i < grid.length; i++) {
        const row = grid[i];
        if (row.every((cell) => cell === '.')) {
            emptyRows.push(i);
        }
    }
    return emptyRows;
}

function findEmptyCols(grid: string[][]): number[] {
    const emptyCols: number[] = [];
    for (let i = 0; i < grid[0].length; i++) {
        const col = grid.map((row) => row[i]);
        if (col.every((cell) => cell === '.')) {
            emptyCols.push(i);
        }
    }
    return emptyCols;
}

function findGalaxiesPos(grid: string[][]) {
    const galaxies: { x: number; y: number }[] = [];
    for (let y = 0; y < grid.length; y++) {
        const row = grid[y];
        for (let x = 0; x < row.length; x++) {
            const cell = row[x];
            if (cell === '#') {
                galaxies.push({ y, x });
            }
        }
    }
    return galaxies;
}

const input = await fs.readFileSync('./input.txt', 'utf-8');
const grid = input.split('\n').map((row) => row.split(''));

console.log(grid.map((row) => row.join('')).join('\n'));
const galaxies = findGalaxiesPos(grid);
const emptyRows = findEmptyRows(grid);
const emptyCols = findEmptyCols(grid);
for (const emptyCol of emptyCols.reverse()) {
    for (const galaxy of galaxies) {
        if (galaxy.x > emptyCol) {
            galaxy.x = galaxy.x + 999999;
        }
    }
}

for (const emptyRow of emptyRows.reverse()) {
    for (const galaxy of galaxies) {
        if (galaxy.y > emptyRow) {
            galaxy.y = galaxy.y + 999999;
        }
    }
}

let total = 0;
for (let i = 0; i < galaxies.length; i++) {
    const galaxy = galaxies[i];
    for (let j = i + 1; j < galaxies.length; j++) {
        const otherGalaxy = galaxies[j];

        const xDiff = Math.abs(galaxy.x - otherGalaxy.x);
        const yDiff = Math.abs(galaxy.y - otherGalaxy.y);
        total += xDiff + yDiff;
    }
}
console.log(total);
