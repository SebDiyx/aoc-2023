import fs from 'fs';

const input = await fs.readFileSync('./input.txt', 'utf-8');

const seeds: number[] = [];

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
        const seedStrs = lineGroup.replace('seeds: ', '').split(' ');
        for (const seedStr of seedStrs) {
            seeds.push(parseInt(seedStr));
        }
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

let closestLocation: number | null = null;
for (const seed of seeds) {
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

console.log(closestLocation);
