import fs from 'fs';

// const MIN = 7;
// const MAX = 27;
const MIN = 200000000000000;
const MAX = 400000000000000;

type Hailstone = {
    id: number;
    dx: number;
    dy: number;
    dz: number;
    x: number;
    y: number;
    z: number;
};

// https://math.stackexchange.com/questions/4038413/intersection-of-two-vectors-with-tails
function getCrossingTimes(a: Hailstone, b: Hailstone) {
    const d = a.dx * b.dy - a.dy * b.dx;
    if (d === 0) return null;
    const t = (b.dy * (b.x - a.x) - b.dx * (b.y - a.y)) / d;
    const s = (a.dy * (b.x - a.x) - a.dx * (b.y - a.y)) / d;
    if (t < 0 || s < 0) return null;
    return { t, s };
}

function getPointAtTime(hailstone: Hailstone, t: number) {
    return {
        x: hailstone.x + hailstone.dx * t,
        y: hailstone.y + hailstone.dy * t,
        z: hailstone.z + hailstone.dz * t,
    };
}

const input = await fs.readFileSync('./input.txt', 'utf-8');
const hailstones: Hailstone[] = input.split('\n').map((line, i) => {
    // x, y, z @ dx, dy, dz
    // e.g. 19, 13, 30 @ -2,  1, -2
    const [posStr, velocityStr] = line.split(' @ ');
    const [x, y, z] = posStr.split(', ').map((str) => Number(str));
    const [dx, dy, dz] = velocityStr.split(', ').map((str) => Number(str));
    return { id: i + 1, x, y, z, dx, dy, dz };
});

let total = 0;
for (let i = 0; i < hailstones.length; i++) {
    const a = hailstones[i];
    for (let j = i + 1; j < hailstones.length; j++) {
        const b = hailstones[j];
        const crossingTimes = getCrossingTimes(a, b);
        if (!crossingTimes) continue;
        const intersection = getPointAtTime(a, crossingTimes.t);
        if (
            intersection.x >= MIN &&
            intersection.x <= MAX &&
            intersection.y >= MIN &&
            intersection.y <= MAX
        ) {
            total++;
        }
    }
}
console.log(total);
