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

function expandGrid(grid: string[][]) {
    // For any rows or columns that are all '.' then duplicate that row/column
    // and add it to the grid.
    const emptyRows = findEmptyRows(grid);
    const emptyCols = findEmptyCols(grid);

    for (const rowIdx of emptyRows.reverse()) {
        // Insert a copy of the row right after the rowIdx.
        grid.splice(rowIdx + 1, 0, [...grid[rowIdx]]);
    }

    for (const colIdx of emptyCols.reverse()) {
        for (const row of grid) {
            // Insert a copy of the col right after the colIdx.
            row.splice(colIdx + 1, 0, '.');
        }
    }
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
expandGrid(grid);

console.log(grid.map((row) => row.join('')).join('\n'));
const galaxies = findGalaxiesPos(grid);

let total = 0;
for (const galaxy of galaxies) {
    const otherGalaxies = galaxies.filter((g) => g !== galaxy);
    for (const otherGalaxy of otherGalaxies) {
        const xDiff = Math.abs(galaxy.x - otherGalaxy.x);
        const yDiff = Math.abs(galaxy.y - otherGalaxy.y);
        total += xDiff + yDiff;
    }
}
// Div by 2 as we're double counting each pair.
console.log(total / 2);
