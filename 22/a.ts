import fs from 'fs';

type Brick = {
    id: number;
    xRange: [number, number];
    yRange: [number, number];
    zRange: [number, number];
    supporting: Brick[];
    supportedBy: Brick[];
};

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
    return bricks.sort((a, b) => a.zRange[0] - b.zRange[0]);
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
    // - b is directly above a?
    // - b is within a's x range?
    // - b is within a's y range?

    // a = [1, 1]; b = [0, 2] -> true
    // a = [1, 1]; b = [2, 2] -> false

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

    return a.zRange[1] === b.zRange[0] - 1 && xOverlap && yOverlap;
}

function applyGravity(bricks: Brick[]): Brick[] {
    // TODO: If this is too inefficent then use for i, for j loops (where i < j)
    // Going bottom upwards
    for (const brick of bricks) {
        // Find all bricks that are below this brick and that overlap it
        const overlappingBricks = bricks.filter((otherBrick) => {
            if (otherBrick.id === brick.id) {
                // Don't check if a brick supports itself
                return false;
            }

            if (otherBrick.zRange[0] > brick.zRange[1]) {
                // If the other brick is below or at an equal level this brick,
                // then it can't be supported by this brick
                return false;
            }

            return doesBrickOverlapOtherBrick(brick, otherBrick);
        });

        // Out of the overlapping bricks below this one, find the highest one/s
        // This will be the new supporting brick/s
        const maxZ = Math.max(
            ...overlappingBricks.map((brick) => brick.zRange[1]),
        );
        const supportingBricks = overlappingBricks.filter(
            (brick) => brick.zRange[1] === maxZ,
        );
        if (supportingBricks.length) {
            for (const supportingBrick of supportingBricks) {
                brick.supporting.push(supportingBrick);
                supportingBrick.supportedBy.push(brick);
            }
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

    return bricks;
}

function populateRelations(bricks: Brick[]) {
    for (const brick of bricks) {
        for (const otherBrick of bricks) {
            if (doesBrickSupportOtherBrick(brick, otherBrick)) {
                brick.supporting.push(otherBrick);
                otherBrick.supportedBy.push(brick);
            }
        }
    }
}

const start = Date.now();
const input = await fs.readFileSync('./input.txt', 'utf-8');
const bricks = initialiseBricks(input);
applyGravity(bricks);
// populateRelations(bricks);

// Find bricks that are either not supporting any bricks
// Or that are not the sole supporter of any bricks
const destroyableBricks = bricks.filter((brick) => {
    if (brick.supporting.length === 0) {
        return true;
    }
    if (brick.supporting.every((brick) => brick.supportedBy.length > 1)) {
        return true;
    }
    return false;
});

const end = Date.now();
const time = end - start;
console.log(`Time taken: ${time}ms`);

console.log(
    bricks.slice(0, 10).map((brick) => {
        return {
            id: brick.id,
            xRange: brick.xRange,
            yRange: brick.yRange,
            zRange: brick.zRange,
            supporting: brick.supporting.map((brick) => brick.id),
            supportedBy: brick.supportedBy.map((brick) => brick.id),
        };
    }),
);

console.log(destroyableBricks.length); //TODO: Seb remove <--------------
