import fs from 'fs';

const input = await fs.readFileSync('./input.txt', 'utf-8');

const points = input.split('\n').map((line) => {
    const [card, numbers] = line.split(': ');
    const [winning, yours] = numbers.split(' | ').map((nums) =>
        nums
            .trim()
            .split(' ')
            .filter(Boolean)
            .map((num) => parseInt(num)),
    );

    let score = 0;
    for (const yourNum of yours) {
        if (winning.includes(yourNum)) {
            if (score === 0) {
                score = 1;
            } else {
                score = score * 2;
            }
        }
    }

    return score;
});

console.log(points.reduce((total, score) => total + score, 0));
