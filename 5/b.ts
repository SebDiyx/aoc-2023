import fs from 'fs';

const input = await fs.readFileSync('./input.txt', 'utf-8');
const [seedsLine, ...blocks] = input.split('\n\n');

let seedRanges: [number, number][] = seedsLine
    .replace('seeds: ', '')
    .match(/(\d+) (\d+)/g)!
    .map((range) => {
        const [start, numSeeds] = range.split(' ').map((num) => parseInt(num));
        return [start, start + numSeeds];
    });

for (const block of blocks) {
    const ranges = block
        .split('\n')
        .slice(1)
        .map((line) => line.split(' ').map((num) => parseInt(num)))
        .sort((a, b) => a[0] - b[0]);

    const mappedRanges: [number, number][] = [];
    while (seedRanges.length > 0) {
        const [start, end] = seedRanges.pop()!;
        let addedToMappedRanges = false;
        for (const [destStart, sourceStart, range] of ranges) {
            const overlapStart = Math.max(start, sourceStart);
            const overlapEnd = Math.min(end, sourceStart + range);
            if (overlapStart < overlapEnd) {
                mappedRanges.push([
                    overlapStart - sourceStart + destStart,
                    overlapEnd - sourceStart + destStart,
                ]);
                if (overlapStart > start) {
                    seedRanges.push([start, overlapStart]);
                }
                if (end > overlapEnd) {
                    seedRanges.push([overlapEnd, end]);
                }
                addedToMappedRanges = true;
                break;
            }
        }
        if (!addedToMappedRanges) {
            mappedRanges.push([start, end]);
        }
    }
    seedRanges = mappedRanges;
}

console.log(Math.min(...seedRanges.map(([a, b]) => Math.min(a, b))));
