import fs from 'fs';

const ACCELERATION = 1;

function getNumWinningHoldTimes(time: number, maxDistance: number) {
    let numWinningHoldTimes = 0;

    for (let holdTime = 0; holdTime < time; holdTime++) {
        const speed = holdTime * ACCELERATION;
        const distance = speed * (time - holdTime);

        if (distance > maxDistance) {
            numWinningHoldTimes++;
        }
    }

    return numWinningHoldTimes;
}

const input = await fs.readFileSync('./input.txt', 'utf-8');
const [times, maxDistances] = input.split('\n').map((line) =>
    line
        .split(' ')
        .filter(Boolean)
        .map((num) => Number(num))
        .filter((num) => !isNaN(num)),
);

const res = times.reduce((total, time, i) => {
    const maxDistance = maxDistances[i];
    const numWinningHoldTimes = getNumWinningHoldTimes(time, maxDistance);
    return total * numWinningHoldTimes;
}, 1);

console.log(res);
