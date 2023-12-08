import fs from 'fs';
import { parse } from 'url';

const MAX_RED_CUBES = 12;
const MAX_GREEN_CUBES = 13;
const MAX_BLUE_CUBES = 14;

const input = await fs.readFileSync('./input.txt', 'utf-8');

const validGames = input
    .split('\n')
    .map((line) => {
        const [gamePart, pullsPart] = line.split(': ');

        // Get game number from line
        const cleanGamePart = gamePart.replace('Game ', '');
        const game = parseInt(cleanGamePart);

        // Get total number of cubes from line for each colour
        for (const pulls of pullsPart.split('; ')) {
            for (const cube of pulls.split(', ')) {
                const [amount, colour] = cube.split(' ');
                switch (colour) {
                    case 'red':
                        if (parseInt(amount) > MAX_RED_CUBES) return null;
                        break;
                    case 'green':
                        if (parseInt(amount) > MAX_GREEN_CUBES) return null;
                        break;
                    case 'blue':
                        if (parseInt(amount) > MAX_BLUE_CUBES) return null;
                        break;
                }
            }
        }

        return game;
    })
    .filter(Boolean) as number[];

console.log(validGames.reduce((total, game) => total + game, 0));
