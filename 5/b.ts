import fs from 'fs';

const input = await fs.readFileSync('./input.txt', 'utf-8');

const seedRanges: [number, number][] = 123;

// Dest Start, Source Start, Range
const seedSoilMap: [number, number, number][] = [];
const soilToFertilizerMap: [number, number, number][] = [];
const fertilizerToWaterMap: [number, number, number][] = [];
const waterToLightMap: [number, number, number][] = [];
const LightToTemperatureMap: [number, number, number][] = [];
const temperatureToHumidityMap: [number, number, number][] = [];
const humidityToLocationMap: [number, number, number][] = [];

const nameToMap = {
    'seed-to-soil': seedSoilMap,
    'soil-to-fertilizer': soilToFertilizerMap,
    'fertilizer-to-water': fertilizerToWaterMap,
    'water-to-light': waterToLightMap,
    'light-to-temperature': LightToTemperatureMap,
    'temperature-to-humidity': temperatureToHumidityMap,
    'humidity-to-location': humidityToLocationMap,
} as const;

const mapsOrder = [
    seedSoilMap,
    soilToFertilizerMap,
    fertilizerToWaterMap,
    waterToLightMap,
    LightToTemperatureMap,
    temperatureToHumidityMap,
    humidityToLocationMap,
];

// Populate our maps
for (const lineGroup of input.split('\n\n')) {
    // Get seeds from our input
    if (lineGroup.startsWith('seeds: ')) {
        const ranges = lineGroup.replace('seeds: ', '').match(/(\d+) (\d+)/g);

        ranges?.forEach((range, i) => {
            const [start, numSeeds] = range.split(' ').map((num) => parseInt(num));

            if (i === 0) {
                seedRanges.push([start, start + numSeeds]);
            } else {
                const prevRange = seedRanges[i - 1];
                const [prevStart, prevEnd] = prevRange;

                if (start < prevEnd) {
                    seedRanges.push([prevEnd, start + numSeeds]);
                } else {
                    seedRanges.push([start, start + numSeeds]);
                }
            }
        });
    }

    // Get our maps from our input
    if (lineGroup.includes('map:')) {
        const [mapName, ...mapLines] = lineGroup.split('\n');
        const map = nameToMap[mapName.replace(' map:', '')];

        for (const mapLine of mapLines) {
            const [destStart, sourceStart, range] = mapLine.split(' ').map((num) => parseInt(num));
            map.push([destStart, sourceStart, range]);
        }
        map.sort((a, b) => {
            return a[1] - b[1];
        });
    }
}

// let seeds = new Set<number>();
// for (const seedRange of seedRanges) {
//     const [seedStart, numSeeds] = seedRange;
//     for (let seed = seedStart; seed < seedStart + numSeeds; seed++) {
//         seeds.add(seed);
//     }
// }

// console.log(seeds);
console.log(seedRanges);
let closestLocation: number | null = null;
for (const range of seedRanges) {
    console.log(range);
    for (let seed = range[0]; seed < range[1]; seed++) {
        let val = seed;
        for (const map of mapsOrder) {
            let tempVal = val;
            for (const [destStart, sourceStart, range] of map) {
                if (val >= sourceStart && val <= sourceStart + range) {
                    const offset = val - sourceStart;
                    tempVal = destStart + offset;
                }
            }
            val = tempVal;
        }
        if (!closestLocation) {
            closestLocation = val;
        } else if (val < closestLocation) {
            closestLocation = val;
        }
    }
}

console.log('closest', closestLocation);
