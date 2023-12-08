import fs from 'fs';

const input = await fs.readFileSync('./input.txt', 'utf-8');

const powers = input
    .split('\n')
    .map((line) => {
        const [_, pullsPart] = line.split(': ');

        let maxRed = 0;
        let maxGreen = 0;
        let maxBlue = 0;

        // Get total number of cubes from line for each colour
        for (const pulls of pullsPart.split('; ')) {
            for (const cube of pulls.split(', ')) {
                const [amountStr, colour] = cube.split(' ');
                const amount = parseInt(amountStr);
                switch (colour) {
                    case 'red':
                        if (amount > maxRed) maxRed = amount;
                        break;
                    case 'green':
                        if (amount > maxGreen) maxGreen = amount;
                        break;
                    case 'blue':
                        if (amount > maxBlue) maxBlue = amount;
                        break;
                }
            }
        }

        return maxRed * maxGreen * maxBlue;
    })
    .filter(Boolean);

console.log(powers.reduce((total, game) => total + game, 0));
