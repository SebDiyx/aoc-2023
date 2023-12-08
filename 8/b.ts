import fs from 'fs';

const LEFT = 0;
const RIGHT = 1;

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
    const startNodes: Node[] = [];
    mapStr.split('\n').forEach((line) => {
        const name = line.split(' = ')[0];
        nodeMap.set(name, { name, children: [] });
        if (name.endsWith('A')) {
            startNodes.push(nodeMap.get(name)!);
        }
    });

    // Build the graph
    mapStr.split('\n').forEach((line) => {
        const [name, childrenStr] = line.split(' = ');
        const children = childrenStr.replace('(', '').replace(')', '').split(', ');
        const node = nodeMap.get(name)!;
        node.children = children.map((childName) => nodeMap.get(childName)!);
    });

    return startNodes;
}

function traverseGraph(startNodes: Node[], instructions: string[]) {
    let instructionsCopy = [...instructions];
    let currentNodes = startNodes;
    let currentInstruction = instructionsCopy.shift()!;
    let steps = 0;
    while (currentNodes.some((node) => !node.name.endsWith('Z'))) {
        const nextNodes = currentNodes.map(
            (node) => node.children[currentInstruction === 'L' ? LEFT : RIGHT],
        );
        console.log(nextNodes.map((node) => node.name));
        currentNodes = nextNodes;
        steps += 1;

        currentInstruction = instructionsCopy.shift()!;
        if (instructionsCopy.length === 0) {
            instructionsCopy = [...instructions];
        }
    }
    return steps;
}

function traverseGraphSingle(startNode: Node, instructions: string[], reachEnds: number) {
    let instructionsCopy = [...instructions];
    let currentNode = startNode;
    let currentInstruction = instructionsCopy.shift()!;
    let steps = 0;
    let endsReached: number[] = [];
    while (reachEnds > endsReached.length) {
        const nextNode = currentNode.children[currentInstruction === 'L' ? LEFT : RIGHT];
        if (nextNode) {
            currentNode = nextNode;
            steps += 1;
        }
        if (currentNode.name.endsWith('Z')) {
            endsReached.push(steps);
        }
        currentInstruction = instructionsCopy.shift()!;
        if (instructionsCopy.length === 0) {
            instructionsCopy = [...instructions];
        }
    }
    return endsReached!;
}

const startNodes = buildMapGraph(mapStr);
let endPoints = startNodes.map((startNode) => traverseGraphSingle(startNode, instructions, 1)[0]);

// Find LCM of endPoints
function gcd(a: number, b: number): number {
    if (b === 0) {
        return a;
    }
    return gcd(b, a % b);
}
function lcm(a: number, b: number): number {
    return (a * b) / gcd(a, b);
}
console.log(endPoints);
let lcmVal = endPoints[0];
for (let i = 1; i < endPoints.length; i++) {
    lcmVal = lcm(lcmVal, endPoints[i]);
}
console.log(lcmVal);
