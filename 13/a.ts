import fs from 'fs';

// ash (.) and rocks (#)

// add up the number of columns to the left of each vertical line of reflection;
// also add 100 multiplied by the number of rows above each horizontal line of reflection.
function printPattern(pattern: string[][]) {
    console.log();
    console.log(pattern.map((r) => r.join('')).join('\n'));
    console.log();
}

const input = await fs.readFileSync('./input.txt', 'utf-8');
const patterns = input
    .split('\n\n')
    .map((pattern) => pattern.split('\n').map((row) => row.split('')));

let total = 0;
for (const pattern of patterns) {
    const columns = pattern[0].map((_, i) => pattern.map((row) => row[i]));
    const rows = pattern.map((row) => row.join(''));

    printPattern(pattern);
    let midColumn = 0;
    for (let mid = 1; mid < columns.length; mid++) {
        let leftCols = columns.slice(0, mid);
        let rightCols = columns.slice(mid, mid + leftCols.length).reverse();
        let smallest = Math.min(leftCols.length, rightCols.length);
        if (leftCols.length > rightCols.length) {
            leftCols = leftCols.slice(-smallest);
        } else if (leftCols.length < rightCols.length) {
            rightCols = rightCols.slice(0, smallest + 1);
        }

        if (leftCols.join('\n') === rightCols.join('\n')) {
            midColumn = mid;
        }
    }

    if (midColumn !== 0) {
        total += midColumn;
    }

    let midRow = 0;
    for (let mid = 1; mid < rows.length; mid++) {
        let leftRows = rows.slice(0, mid);
        let rightRows = rows.slice(mid, mid + leftRows.length).reverse();
        let smallest = Math.min(leftRows.length, rightRows.length);
        if (leftRows.length > rightRows.length) {
            leftRows = leftRows.slice(-smallest);
        } else if (leftRows.length < rightRows.length) {
            rightRows = rightRows.slice(smallest - 1);
        }

        if (leftRows.join('\n') === rightRows.join('\n')) {
            midRow = mid;
        }
    }

    if (midRow !== 0) {
        total += midRow * 100;
    }
}

console.log(total);
