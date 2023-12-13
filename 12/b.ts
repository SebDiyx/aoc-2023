import fs from 'fs';

const cache = new Map<string, number>();
function getNumValidArrangementsRecc(row: string, numbers: number[]) {
    // Check if our row is empty and we have no numbers left
    if (row === '') {
        if (numbers.length === 0) {
            // If we have no numbers left and our row is empty, we have a valid arrangement
            return 1;
        } else {
            // Otherwise if we have numbers left but our row is empty, we have an invalid arrangement
            return 0;
        }
    }

    // Check if we have no numbers left but our row is not empty
    if (numbers.length === 0) {
        if (row.includes('#')) {
            // If we have any remaining #, the arrangement is invalid
            return 0;
        } else {
            // Otherwise, the arrangement is valid
            return 1;
        }
    }

    const cacheKey = `${row},${numbers.join(',')}`;
    if (cache.has(cacheKey)) {
        return cache.get(cacheKey)!;
    }
    let res: number = 0;
    // Treat the first spring as working spring (either . or ?)
    if (row[0] === '.' || row[0] === '?') {
        // Since we're treating the first character as a working spring,
        // we can just move on to the next spring
        res += getNumValidArrangementsRecc(row.slice(1), numbers);
    }

    // Treat first spring as a broken spring (either # or ?)
    if (row[0] === '#' || row[0] === '?') {
        const [number, ...restNumbers] = numbers;
        // Check if we have a valid run of springs
        // For a valid run:
        //  - The row must be long enough to contain the run
        //  - The run must be made of only # or ?
        //  - The character after the run must be a . or ? or undefined (as this would be outside the row)
        const rowIsLongEnough = row.length >= numbers[0];
        const runIsAllBroken = row
            .slice(0, number)
            .split('')
            .every((char) => char !== '.');
        const afterRunIsWorking =
            row[number] !== '#' || row[number] === undefined;
        if (rowIsLongEnough && runIsAllBroken && afterRunIsWorking) {
            // +1 as we've already checked the next character after run to ensure its a .
            const remainingRow = row.slice(number + 1);
            res += getNumValidArrangementsRecc(remainingRow, restNumbers);
        }
    }

    // Cache our result for future runs
    cache.set(cacheKey, res);

    return res;
}

const input = await fs.readFileSync('./input.txt', 'utf-8');
const rows = input.split('\n').map((line) => {
    const [hotSprings, numbersStr] = line.split(' ');
    const numbers = numbersStr.split(',').map((num) => Number(num));

    const expandedHotSprings: string = [
        hotSprings,
        hotSprings,
        hotSprings,
        hotSprings,
        hotSprings,
    ].join('?');
    const expandedNumbers: number[] = [
        ...numbers,
        ...numbers,
        ...numbers,
        ...numbers,
        ...numbers,
    ];
    return { hotSprings: expandedHotSprings, numbers: expandedNumbers };
});

let total = 0;
for (const row of rows) {
    console.log(row.hotSprings); //TODO: Seb remove <--------------
    const start = Date.now();
    const numValid = getNumValidArrangementsRecc(row.hotSprings, row.numbers);
    console.log(numValid); //TODO: Seb remove <--------------
    total += numValid;
    console.log('time', Date.now() - start, 'ms\n'); //TODO: Seb remove <--------------
}
console.log(); //TODO: Seb remove <--------------
console.log(total);
