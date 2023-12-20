import fs from 'fs';
import { exit } from 'process';

const directions = ['R', 'L', 'U', 'D'] as const;
type Dir = (typeof directions)[number];

function getDigInstructionFromLine(line: string) {
    const [_dir, _num, hexStr] = line
        .replace('(', '')
        .replace(')', '')
        .split(' ');

    // Take out last char from hexStr
    const amount = hexStr.slice(1, -1);
    const dirNumStr = hexStr.slice(-1) as '0' | '1' | '2' | '3';

    const dirMap = {
        '0': 'R',
        '1': 'D',
        '2': 'L',
        '3': 'U',
    } as const;

    // Convert hexidecimal number to decimal
    const num = parseInt(amount, 16);

    return { dir: dirMap[dirNumStr], num };
}

function getPointsForInstructions(
    digInstructions: { dir: Dir; num: number }[],
) {
    let length = 0;
    const points: {
        x: number;
        y: number;
    }[] = [];
    const currPos = { x: 0, y: 0, prev: null };
    for (const { dir, num } of digInstructions) {
        const { x, y } = currPos;
        const dx = dir === 'R' ? 1 : dir === 'L' ? -1 : 0;
        const dy = dir === 'U' ? -1 : dir === 'D' ? 1 : 0;

        currPos.x += dx * num;
        currPos.y += dy * num;
        points.push({ x: currPos.x, y: currPos.y });

        length += num;
    }

    return [points, length] as const;
}

const input = await fs.readFileSync('./test-input.txt', 'utf-8');
const digInstructions = input
    .split('\n')
    .map((line) => getDigInstructionFromLine(line));
const [points, length] = getPointsForInstructions(digInstructions);

// Shoelace Formula to find the area
let area = 0;
for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    area += curr.x * prev.y - prev.x * curr.y;
}
area = Math.abs(area / 2);

// Pick's Theorem to find the inner area
const innerArea = area - length / 2 + 1;

console.log(innerArea + length);
