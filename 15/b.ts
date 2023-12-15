import fs from 'fs';
// Convert char in to ascii code
const charToAscii = (char: string) => char.charCodeAt(0);

function getCodeValue(code: string) {
    let currTotal = 0;
    code.split('').forEach((char) => {
        /**
         * Determines the ASCII code for the current character of the string.
         * Increase the current value by the ASCII code you just determined.
         * Set the current value to itself multiplied by 17.
         * Set the current value to the remainder of dividing itself by 256.
         */
        let curr = charToAscii(char);
        currTotal += curr;
        currTotal *= 17;
        currTotal %= 256;
    });
    return currTotal;
}

const codes = await fs.readFileSync('./input.txt', 'utf-8').split(',');
const boxes = new Map<number, [string, number][]>();
codes.forEach((code) => {
    const removeOrAdd = code.includes('=') ? 'Add' : 'Remove';

    if (removeOrAdd === 'Remove') {
        /**
         * If the operation character is a dash (-), go to the relevant box and remove the lens with the given label if it is present in the box. Then, move any remaining lenses as far forward in the box as they can go without changing their order, filling any space made by removing the indicated lens. (If no lens in that box has the given label, nothing happens.)
         */
        const [name] = code.split('-');
        const boxNum = getCodeValue(name);

        if (boxes.has(boxNum)) {
            const box = boxes.get(boxNum)!;
            const index = box.findIndex(([lenseName]) => lenseName === name);
            if (index !== -1) {
                box.splice(index, 1);
                if (box.length === 0) boxes.delete(boxNum);
            }
        }
    } else {
        /**
         * - If there is already a lens in the box with the same label,
         *   replace the old lens with the new lens: remove the old lens and put the new lens in its place,
         *   not moving any other lenses in the box.
         *
         * - If there is not already a lens in the box with the same label,
         *   add the lens to the box immediately behind any lenses already in the box.
         *   Don't move any of the other lenses when you do this.
         *   If there aren't any lenses in the box, the new lens goes all the way to the front of the box.
         */
        const [name, numStr] = code.split('=');
        const boxNum = getCodeValue(name);
        const focalLength = Number(numStr);

        if (boxes.has(boxNum)) {
            const box = boxes.get(boxNum)!;
            const lense = box.find(([lenseName]) => lenseName === name);
            if (lense) {
                // Replace lense focal length with new focal length
                lense[1] = focalLength;
            } else {
                // Add to the end of the box
                box.push([name, focalLength]);
            }
        } else {
            boxes.set(boxNum, [[name, focalLength]]);
        }
    }
});

let total = 0;
for (const [boxNum, lenses] of boxes.entries()) {
    lenses.forEach(([_, focalLength], i) => {
        total += (boxNum + 1) * (i + 1) * focalLength;
    });
}
console.log(total);
