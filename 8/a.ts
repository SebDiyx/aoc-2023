import fs from 'fs';

const LEFT = 0;
const RIGHT = 1;
const START = 'AAA';
const END = 'ZZZ';

type Node = {
    name: string;
    children: Node[];
};

const input = await fs.readFileSync('./input.txt', 'utf-8');
const [instructionsStr, mapStr] = input.split('\n\n');
const instructions = instructionsStr.split('');

function buildMapGraph(mapStr: string) {
    let start;
    // Build a map of the nodes before we build the graph
    const nodeMap = new Map<string, Node>();
    mapStr.split('\n').forEach((line) => {
        const name = line.split(' = ')[0];
        nodeMap.set(name, { name, children: [] });
    });

    // Build the graph
    mapStr.split('\n').forEach((line) => {
        const [name, childrenStr] = line.split(' = ');
        const children = childrenStr.replace('(', '').replace(')', '').split(', ');
        const node = nodeMap.get(name)!;
        node.children = children.map((childName) => nodeMap.get(childName)!);
    });

    return nodeMap.get(START);
}

function traverseGraph(startNode: Node, instructions: string[]) {
    let instructionsCopy = [...instructions];
    let currentNode = startNode;
    let currentInstruction = instructionsCopy.shift()!;
    let steps = 0;
    while (currentNode.name !== END) {
        const nextNode = currentNode.children[currentInstruction === 'L' ? LEFT : RIGHT];
        if (nextNode) {
            currentNode = nextNode;
            steps += 1;
        }
        currentInstruction = instructionsCopy.shift()!;
        console.log(currentInstruction, currentNode.name);
        if (instructionsCopy.length === 0) {
            instructionsCopy = [...instructions];
        }
    }
    return steps;
}

const startNode = buildMapGraph(mapStr);
console.log(traverseGraph(startNode!, instructions));
// console.log({instructions, mapStr})
