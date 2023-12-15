import fs from 'fs';
// Convert char in to ascii code
const charToAscii = (char: string) => char.charCodeAt(0);

function getCodeValue(code: string) {
    let currTotal = 0;
    code.split('').forEach((char) => {
        let curr = charToAscii(char);
        console.log('curr', curr); //TODO: Seb remove <--------------
        currTotal += curr;
        currTotal *= 17;
        currTotal %= 256;
    });
    return currTotal;
}

/**
 * Determine the ASCII code for the current character of the string.
 * Increase the current value by the ASCII code you just determined.
 * Set the current value to itself multiplied by 17.
 * Set the current value to the remainder of dividing itself by 256.
 */

const codes = await fs.readFileSync('./input.txt', 'utf-8').split(',');

let total = 0;
codes.forEach((code) => {
    total += getCodeValue(code);
});

console.log(total); //TODO: Seb remove <--------------
