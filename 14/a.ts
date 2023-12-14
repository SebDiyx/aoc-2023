import fs from 'fs';

function printGrid(grid: string[][]) {
    console.log(grid.map((row) => row.join('')).join('\n'));
    console.log(); //TODO: Seb remove <--------------
}

function findNextEmptyInColumn(
    grid: string[][],
    pos: { x: number; y: number },
) {
    // console.log(pos); //TODO: Seb remove <--------------
    for (let y = pos.y - 1; y >= 0; y--) {
        const cell = grid?.[y]?.[pos.x];

        if (cell !== '.') {
            // Found a blockage
            // Return the cell below the blockage
            return { x: pos.x, y: y + 1 };
        } else if (cell === '.' && y === 0) {
            return { x: pos.x, y: 0 };
        }
    }
    return pos;
}

const input = await fs.readFileSync('./input.txt', 'utf-8');
const grid = input.split('\n').map((row) => row.split(''));

printGrid(grid);
grid.forEach((row, y) => {
    row.forEach((cell, x) => {
        if (cell === 'O') {
            // Move O upwards to the first empty space
            const nextEmpty = findNextEmptyInColumn(grid, { x, y });
            if (nextEmpty.y !== y) {
                grid[y][x] = '.';
                grid[nextEmpty.y][nextEmpty.x] = 'O';
            }
        }
    });
});
printGrid(grid);

const height = grid.length;
let total = 0;
grid.forEach((row, y) => {
    row.forEach((cell, x) => {
        if (cell === 'O') {
            total += height - y;
        }
    });
});
console.log(total); //TODO: Seb remove <--------------
