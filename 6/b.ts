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
const [time, maxDistance] = input
    .split('\n')
    .map((line) => Number(line.split(':')[1].replaceAll(' ', '')));

const res = getNumWinningHoldTimes(time, maxDistance);
console.log(res);
