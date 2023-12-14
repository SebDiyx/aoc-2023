import fs from 'fs';

const CYCLES = 1_000_000_000;

function findNextEmpty(
    grid: string[][],
    pos: { x: number; y: number },
    dir: 'up' | 'down' | 'left' | 'right',
) {
    if (dir === 'up') {
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
    }
    if (dir === 'down') {
        for (let y = pos.y + 1; y < grid.length; y++) {
            const cell = grid?.[y]?.[pos.x];

            if (cell !== '.') {
                // Found a blockage
                // Return the cell above the blockage
                return { x: pos.x, y: y - 1 };
            } else if (cell === '.' && y === grid.length - 1) {
                return { x: pos.x, y: grid.length - 1 };
            }
        }
    }

    if (dir === 'left') {
        for (let x = pos.x - 1; x >= 0; x--) {
            const cell = grid[pos.y][x];

            if (cell !== '.') {
                // Found a blockage
                // Return the cell to the right of the blockage
                return { x: x + 1, y: pos.y };
            } else if (cell === '.' && x === 0) {
                return { x: 0, y: pos.y };
            }
        }
    }

    if (dir === 'right') {
        for (let x = pos.x + 1; x < grid[pos.y].length; x++) {
            const cell = grid[pos.y][x];

            if (cell !== '.') {
                // Found a blockage
                // Return the cell to the left of the blockage
                return { x: x - 1, y: pos.y };
            } else if (cell === '.' && x === grid[pos.y].length - 1) {
                return { x: grid[pos.y].length - 1, y: pos.y };
            }
        }
    }

    return pos;
}

const cache = new Map<string, string>();
function performCycle(gridStr: string) {
    if (cache.has(gridStr)) {
        return cache.get(gridStr)!;
    }

    const grid = gridStr.split('\n').map((row) => row.split(''));

    for (const dir of ['up', 'left', 'down', 'right'] as const) {
        // If up or left then start in the top left
        if (dir === 'up' || dir === 'left') {
            grid.forEach((row, y) => {
                row.forEach((cell, x) => {
                    if (cell === 'O') {
                        // Move O upwards to the first empty space
                        const nextEmpty = findNextEmpty(grid, { x, y }, dir);
                        if (nextEmpty.y !== y || nextEmpty.x !== x) {
                            grid[y][x] = '.';
                            grid[nextEmpty.y][nextEmpty.x] = 'O';
                        }
                    }
                });
            });
        }

        // if down or right then start in the bottom right
        if (dir === 'down') {
            for (let y = grid.length - 1; y >= 0; y--) {
                const row = grid[y];
                row.forEach((cell, x) => {
                    if (cell === 'O') {
                        // Move O downwards to the first empty space
                        const nextEmpty = findNextEmpty(grid, { x, y }, dir);
                        if (nextEmpty.y !== y || nextEmpty.x !== x) {
                            grid[y][x] = '.';
                            grid[nextEmpty.y][nextEmpty.x] = 'O';
                        }
                    }
                });
            }
        }

        // if down or right then start in the bottom right
        if (dir === 'right') {
            grid.forEach((row, y) => {
                for (let x = row.length - 1; x >= 0; x--) {
                    const cell = row[x];
                    if (cell === 'O') {
                        // Move O east to the first empty space
                        const nextEmpty = findNextEmpty(grid, { x, y }, dir);
                        if (nextEmpty.y !== y || nextEmpty.x !== x) {
                            grid[y][x] = '.';
                            grid[nextEmpty.y][nextEmpty.x] = 'O';
                        }
                    }
                }
            });
        }
    }

    const newGridStr = grid.map((row) => row.join('')).join('\n');
    cache.set(gridStr, newGridStr);

    return newGridStr;
}

let gridStr = await fs.readFileSync('./input.txt', 'utf-8');
for (let i = 0; i < CYCLES; i++) {
    gridStr = performCycle(gridStr);

    if (i % 10000000 === 0) {
        console.log(`${(i / CYCLES) * 100}%`);
    }
}

const grid = gridStr.split('\n').map((row) => row.split(''));
const height = grid.length;
let total = 0;
grid.forEach((row, y) => {
    row.forEach((cell, x) => {
        if (cell === 'O') {
            total += height - y;
        }
    });
});
console.log(total);
