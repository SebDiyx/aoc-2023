import { sign } from 'crypto';
import fs from 'fs';
import { get } from 'http';

/**
 * Flip-flop modules (prefix %) are either on or off; they are initially off.
 * If a flip-flop module receives a high pulse, it is ignored and nothing happens.
 * However, if a flip-flop module receives a low pulse, it flips between on and off.
 * If it was off, it turns on and sends a high pulse.
 * If it was on, it turns off and sends a low pulse.
 *
 * Conjunction modules (prefix &) remember the type of the most recent pulse received from each of their connected input modules;
 * they initially default to remembering a low pulse for each input.
 * When a pulse is received, the conjunction module first updates its memory for that input.
 * Then, if it remembers high pulses for all inputs, it sends a low pulse;
 * otherwise, it sends a high pulse.
 *
 * There is a single broadcast module (named broadcaster).
 * When it receives a pulse, it sends the same pulse to all of its destination modules.
 */

type Signal = 'Low' | 'High';
type ModuleType = '%' | '&' | 'broadcaster';
type Module = {
    name: string | 'broadcaster';
    type: ModuleType;
    inputs: Module[];
    outputs: Module[];
    state: boolean;
    memory: { [key: string]: Signal };
};
type Queue = { module: Module; signal: Signal; senderName: string }[];

function processLine(line: string) {
    const [typeAndName, outputsStr] = line.split(' -> ');

    let type: ModuleType = 'broadcaster';
    let name = 'broadcaster';
    if (typeAndName !== 'broadcaster') {
        type = typeAndName.at(0)! as '%' | '&';
        name = typeAndName.slice(1);
    }
    const outputs = outputsStr.split(', ');

    return { type, name, outputs };
}

function buildGraph(input: string) {
    const moduleMap = new Map<string, Module>();

    // Record each graph node (each module is a node)
    for (const line of input.split('\n')) {
        const { type, name } = processLine(line);
        const module: Module = {
            name,
            type,
            inputs: [],
            outputs: [],
            state: type === '%' ? false : true, // Flip flops are initially off
            memory: {},
        };
        moduleMap.set(name, module);
    }

    // Connect each node to its outputs
    let rx: Module | undefined;
    for (const line of input.split('\n')) {
        const { name, outputs } = processLine(line);
        const module = moduleMap.get(name)!;
        for (const output of outputs) {
            const outputModule = moduleMap.get(output);

            if (outputModule) {
                module.outputs.push(outputModule);
                outputModule.inputs.push(module);

                // Initialize our memory for conjunctions
                if (outputModule.type === '&') {
                    outputModule.memory[name] = 'Low';
                }
            } else {
                rx = {
                    name: output,
                    type: 'broadcaster', // Don't care about type
                    inputs: [module],
                    outputs: [],
                    state: true,
                    memory: {},
                };
                module.outputs.push(rx);
            }
        }
    }

    return {
        broadcaster: moduleMap.get('broadcaster')!,
        rx: rx!,
    };
}

function pushButton(broadcaster: Module, rxConjunctions: Module[]) {
    const queue: Queue = [
        { module: broadcaster, signal: 'Low', senderName: 'button' },
    ];
    let lowCount = 0;
    let highCount = 0;

    const rxConjunctionNames = rxConjunctions.map((c) => c.name);
    const rxConjunctionsTriggered: Module[] = [];
    while (queue.length) {
        const { module, signal, senderName } = queue.shift()!;

        if (signal === 'Low') {
            lowCount++;
        } else {
            highCount++;
        }
        if (module.type === 'broadcaster') {
            // Broadcaster
            for (const output of module.outputs) {
                queue.push({
                    module: output,
                    signal,
                    senderName: 'broadcaster',
                });
            }
        } else if (module.type === '%') {
            // Flip Flop
            if (signal === 'Low') {
                module.state = !module.state;
                for (const output of module.outputs) {
                    queue.push({
                        module: output,
                        signal: module.state ? 'High' : 'Low',
                        senderName: module.name,
                    });
                }
            }
        } else if (module.type === '&') {
            // Conjunction
            module.memory[senderName] = signal;
            const allHigh = Object.values(module.memory).every(
                (senderLastSignal) => senderLastSignal === 'High',
            );
            const signalToSend = allHigh ? 'Low' : 'High';

            if (
                signalToSend === 'High' &&
                rxConjunctionNames.includes(module.name)
            ) {
                rxConjunctionsTriggered.push(module);
            }

            for (const output of module.outputs) {
                queue.push({
                    module: output,
                    signal: signalToSend,
                    senderName: module.name,
                });
            }
        }
    }
    return rxConjunctionsTriggered;
}

function getRxConjunctions(rx: Module) {
    // We know rx only has 1 input and its a conjunction
    // rx's input has 4 inputs all conjunctions
    return rx.inputs[0].inputs;
}

const input = await fs.readFileSync('./input.txt', 'utf-8');
const { broadcaster, rx } = buildGraph(input);

console.log(getRxConjunctions(rx));

// Press the button 1000 times and count the number of low and high pulses sent
const rxConjunctionPressesToTrigger: Record<string, number> = {};

let buttonPresses = 0;
while (true) {
    buttonPresses++;
    const rxConjunctionsTriggered = pushButton(
        broadcaster,
        getRxConjunctions(rx),
    );
    for (const conjunction of rxConjunctionsTriggered) {
        if (!rxConjunctionPressesToTrigger[conjunction.name]) {
            console.log('Found new conjunction', conjunction.name);
            rxConjunctionPressesToTrigger[conjunction.name] = buttonPresses;
        }
    }
    console.log(buttonPresses);
    if (Object.values(rxConjunctionPressesToTrigger).length === 4) break;
}

// LCM of all the conjunctions
function gcd(a: number, b: number): number {
    if (b === 0) {
        return a;
    }
    return gcd(b, a % b);
}
function lcm(a: number, b: number): number {
    return (a * b) / gcd(a, b);
}

const triggerPoints = Object.values(rxConjunctionPressesToTrigger);
let lcmVal = triggerPoints[0];
for (let i = 1; i < triggerPoints.length; i++) {
    lcmVal = lcm(lcmVal, triggerPoints[i]);
}
console.log(lcmVal);
