import fs from 'fs';

function getPossibleArrangements(row: string[]) {
    const arrangements = [row];
    const possibleArrangements: string[][] = [];

    while (arrangements.length > 0) {
        const arr = arrangements.pop()!;
        if (!arr.includes('?')) {
            possibleArrangements.push(arr);
        } else {
            const pos = arr.indexOf('?');
            const op1 = [...arr];
            const op2 = [...arr];
            op1[pos] = '.';
            op2[pos] = '#';
            arrangements.push(op1);
            arrangements.push(op2);
        }
    }
    return possibleArrangements;
}

function isValidArrangement(arrangement: string[], numbers: number[]) {
    let numPos = 0;
    let chainCount = 0;
    for (const spring of [...arrangement, '.']) {
        if (spring === '#') {
            chainCount++;

            // Invalid if chainCount is greater than the number of allowed springs in a chain
            if (chainCount > numbers[numPos]) {
                return false;
            }
        } else if (spring === '.') {
            if (chainCount > 0 && chainCount !== numbers[numPos]) {
                return false;
            }

            if (chainCount) {
                numPos++;
                chainCount = 0;
            }
        }
    }
    return numPos === numbers.length;
}

const input = await fs.readFileSync('./test-input.txt', 'utf-8');
const rows = input.split('\n').map((line) => {
    const [hotSpringsStr, numbersStr] = line.split(' ');
    const numbers = numbersStr.split(',').map((num) => Number(num));
    const hotSprings = hotSpringsStr.split('');
    return { hotSprings, numbers };
});

let total = 0;
for (const row of rows) {
    const possibleArrangements = getPossibleArrangements(row.hotSprings);
    for (const arrangement of possibleArrangements) {
        if (isValidArrangement(arrangement, row.numbers)) {
            total++;
        }
    }
}
console.log(total);
