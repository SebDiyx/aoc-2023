import fs from 'fs';

type Node = {
    val: number;
};

function processRow(rowNodes: Node[]): number {
    let childRow: Node[] = [];
    rowNodes.forEach((node, i) => {
        const nextNode = rowNodes[i + 1];
        if (nextNode) {
            const diff = nextNode.val - node.val;
            const diffNode: Node = {
                val: diff,
            };
            childRow.push(diffNode);
        }
    });

    if (!childRow.every((node) => node.val === 0)) {
        const diff = processRow(childRow);
        return diff + childRow.at(-1)!.val;
    }

    return childRow.at(-1)!.val;
}

const input = await fs.readFileSync('./input.txt', 'utf-8');
const numberRows: Node[][] = input.split('\n').map((line) =>
    line.split(' ').map((num) => ({
        val: parseInt(num),
    })),
);

let total = 0;
for (const row of numberRows) {
    const diff = processRow(row);
    total = total + diff + row.at(-1)!.val;
}
console.log(total);
