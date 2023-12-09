import fs from 'fs';

type Node = {
    val: number;
    leftParent: Node | null;
    rightParent: Node | null;
};

function processRow(rowNodes: Node[]) {
    console.log(rowNodes);

    let childRow: Node[] = [];
    rowNodes.forEach((node, i) => {
        const nextNode = rowNodes[i];
        if (nextNode) {
            const diff = nextNode.val - node.val;
            const diffNode: Node = {
                val: diff,
                leftParent: node,
                rightParent: nextNode,
            };
            childRow.push(diffNode);
        }
    });

    if (!childRow.every((node) => node.val === 0)) {
        const finalDiff = processRow(childRow);
    }

    // TODO: Return a calculated node
    return;
}

const input = await fs.readFileSync('./test-input.txt', 'utf-8');
const numberRows: Node[][] = input.split('\n').map((line) =>
    line.split(' ').map((num) => ({
        val: parseInt(num),
        leftParent: null,
        rightParent: null,
    })),
);
processRow(numberRows[0]);
