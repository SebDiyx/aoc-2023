import fs from 'fs';
import { Heapq } from 'ts-heapq';

// Dikstra's algorithm?
function search() {
    const priorityQueue = new Heapq<{
        x: number;
        y: number;
        heatLoss: number;
        dx: number;
        dy: number;
        dirCount: number;
    }>(
        [{ x: 0, y: 0, heatLoss: 0, dx: 0, dy: 0, dirCount: 0 }],
        (a, b) => a.heatLoss < b.heatLoss,
    );
    const visited = new Set<string>();
    while (priorityQueue.length() > 0) {
        // Get the lowest heat loss path from the queue
        const { x, y, heatLoss, dx, dy, dirCount } = priorityQueue.pop()!;
        const isStart = x === 0 && y === 0;

        // Reached the end
        if (
            x === grid[0].length - 1 &&
            y === grid.length - 1 &&
            dirCount >= 4
        ) {
            console.log(heatLoss); //TODO: Seb remove <--------------
            break;
        }

        // Already been here
        if (visited.has(`${x},${y},${dx},${dy},${dirCount}`)) {
            continue;
        }

        visited.add(`${x},${y},${dx},${dy},${dirCount}`);

        for (const [ndx, ndy] of [
            [0, 1],
            [1, 0],
            [0, -1],
            [-1, 0],
        ]) {
            // Can't turn if we haven't gone straight at least 4 times
            if (!isStart) {
                if (dirCount < 4 && (ndx !== dx || ndy !== dy)) continue;
            }

            // Don't go back the way we came
            if (dx === -ndx && dy === -ndy) continue;

            // Don't go the same direction more than 10 times in a row
            if (dx === ndx && dy === ndy && dirCount >= 10) continue;

            const newPos = { x: x + ndx, y: y + ndy };

            // Only add if the new position is within the grid
            if (
                newPos.x >= 0 &&
                newPos.y >= 0 &&
                newPos.x < grid[0].length &&
                newPos.y < grid.length
            ) {
                priorityQueue.push({
                    x: newPos.x,
                    y: newPos.y,
                    heatLoss: heatLoss + grid[newPos.y][newPos.x],
                    dx: ndx,
                    dy: ndy,
                    dirCount: dx === ndx && dy === ndy ? dirCount + 1 : 1,
                });
            }
        }
    }
}

const input = await fs.readFileSync('./input.txt', 'utf-8');
const grid = input.split('\n').map((row) => row.split('').map(Number));

search();
