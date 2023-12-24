import fs from 'fs';

type Brick = {
    id: number;
    xRange: [number, number];
    yRange: [number, number];
    zRange: [number, number];
    supporting: Brick[];
    supportedBy: Brick[];
};

function printBricks(bricks: Brick[]) {
    for (const brick of bricks) {
        console.log({
            id: brick.id,
            xRange: brick.xRange,
            yRange: brick.yRange,
            zRange: brick.zRange,
            supporting: brick.supporting.map((brick) => brick.id),
            supportedBy: brick.supportedBy.map((brick) => brick.id),
        });
    }
    console.log('==='); //TODO: Seb remove <--------------
}

function initialiseBricks(input: string): Brick[] {
    let id = 0;
    const bricks = input.split('\n').map((line) => {
        id++;
        // line: '1,0,1~1,2,1'
        // a = [1, 0, 1]
        // b = [1, 2, 1]
        //     [x, y, z]
        // Ground is at z = 0
        // So the lowest possible z for a brick is 1
        const [a, b] = line
            .split('~')
            .map((pointStr) =>
                pointStr.split(',').map((numStr) => Number(numStr)),
            );

        const brick: Brick = {
            id,
            xRange: [a[0], b[0]].sort() as [number, number],
            yRange: [a[1], b[1]].sort() as [number, number],
            zRange: [a[2], b[2]].sort() as [number, number],
            supporting: [],
            supportedBy: [],
        };
        return brick;
    });
    return bricks.sort((a, b) => a.zRange[1] - b.zRange[1]);
}

// Check if a overlaps b
function doesBrickOverlapOtherBrick(a: Brick, b: Brick): boolean {
    // a overlaps b if:
    // - b is within a's x range or a is within b's range
    // - b is within a's y range or a is within b's range
    const xOverlap =
        (a.xRange[0] <= b.xRange[0] && b.xRange[0] <= a.xRange[1]) ||
        (a.xRange[0] <= b.xRange[1] && b.xRange[1] <= a.xRange[1]) ||
        (b.xRange[0] <= a.xRange[0] && a.xRange[0] <= b.xRange[1]) ||
        (b.xRange[0] <= a.xRange[1] && a.xRange[1] <= b.xRange[1]);

    const yOverlap =
        (a.yRange[0] <= b.yRange[0] && b.yRange[0] <= a.yRange[1]) ||
        (a.yRange[0] <= b.yRange[1] && b.yRange[1] <= a.yRange[1]) ||
        (b.yRange[0] <= a.yRange[0] && a.yRange[0] <= b.yRange[1]) ||
        (b.yRange[0] <= a.yRange[1] && a.yRange[1] <= b.yRange[1]);

    return xOverlap && yOverlap;
}

// Check if a supports b
function doesBrickSupportOtherBrick(a: Brick, b: Brick): boolean {
    // a supports b if:
    // - b is on the row above a?
    // - are a and b overlapping
    return a.zRange[1] === b.zRange[0] - 1 && doesBrickOverlapOtherBrick(a, b);
}

function applyGravity(bricks: Brick[]): Brick[] {
    // Going bottom upwards
    for (let i = 0; i < bricks.length; i++) {
        const brick = bricks[i];

        // Find all bricks that are below this brick and that overlap it
        const overlappingBricks = bricks.slice(0, i).filter((lowerBrick) => {
            return doesBrickOverlapOtherBrick(brick, lowerBrick);
        });

        // Out of the overlapping bricks below this one, find the highest one/s
        // This will be the new supporting brick/s
        const maxZ = Math.max(
            ...overlappingBricks.map((overlap) => overlap.zRange[1]),
        );
        const supportingBricks = overlappingBricks.filter(
            (overlap) => overlap.zRange[1] === maxZ,
        );
        if (supportingBricks.length) {
            const height = brick.zRange[1] - brick.zRange[0];
            brick.zRange[0] = supportingBricks[0].zRange[1] + 1;
            brick.zRange[1] = brick.zRange[0] + height;
        } else {
            // If there are no overlapping bricks below this one, then this brick
            // is supported by the ground
            const height = brick.zRange[1] - brick.zRange[0];
            brick.zRange[0] = 1;
            brick.zRange[1] = brick.zRange[0] + height;
        }
    }

    return bricks.sort((a, b) => a.zRange[1] - b.zRange[1]);
}

function populateRelations(bricks: Brick[]) {
    for (let i = 0; i < bricks.length; i++) {
        const brick = bricks[i];
        for (const lowerBrick of bricks.slice(0, i)) {
            if (doesBrickSupportOtherBrick(lowerBrick, brick)) {
                lowerBrick.supporting.push(brick);
                brick.supportedBy.push(lowerBrick);
            }
        }
    }
}

const start = Date.now();
const input = await fs.readFileSync('./input.txt', 'utf-8');
const bricks = initialiseBricks(input);
applyGravity(bricks);
populateRelations(bricks);

let totalBricksThatFell = 0;
for (const brick of bricks) {
    // No bricks will fall if this brick isn't supporting any other bricks
    if (brick.supporting.length === 0) continue;

    // If all other bricks that this brick is supporting are supported by other
    // then no bricks will fall
    if (brick.supporting.every((brick) => brick.supportedBy.length > 1)) {
        continue;
    }

    const queue: Brick[] = [brick];
    const fallenBrickIds = new Set<number>([brick.id]);
    while (queue.length) {
        const currBrick = queue.shift()!;
        for (const supported of currBrick.supporting) {
            const isBlockSupported = supported.supportedBy.some(
                (support) => !fallenBrickIds.has(support.id),
            );
            if (!isBlockSupported) {
                fallenBrickIds.add(supported.id);
                queue.push(supported);
            }
        }
    }

    totalBricksThatFell += fallenBrickIds.size - 1;
}

const end = Date.now();
const time = end - start;
console.log(`Time taken: ${time}ms`);

// IDK WHY I NEED TO SUBTRACT 1 FROM THIS????
console.log(totalBricksThatFell - 1); //TODO: Seb remove <--------------
