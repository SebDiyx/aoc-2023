import fs from 'fs';
import { cloneDeep } from 'lodash';

type Check = {
    op?: '>' | '<';
    num?: number;
    category?: 'x' | 'm' | 'a' | 's';
    dest: string | 'A' | 'R';
};

const input = await fs.readFileSync('./input.txt', 'utf-8');
const [workflowsStr] = input.split('\n\n');
const workflows = new Map<string, Check[]>();
workflowsStr.split('\n').forEach((rule) => {
    const [name, checks] = rule.replace('}', '').split('{');

    const workflow: Check[] = [];
    for (const check of checks.split(',')) {
        if (!check.includes('>') && !check.includes('<')) {
            workflow.push({ dest: check });
        } else {
            const [compStr, dest] = check.split(':');
            workflow.push({
                op: compStr[1] as '>' | '<',
                num: Number(compStr.slice(2)),
                category: compStr[0] as 'x' | 'm' | 'a' | 's',
                dest,
            });
        }
    }

    workflows.set(name, workflow);
});

const defaultRanges = {
    x: [1, 4000] as [number, number],
    m: [1, 4000] as [number, number],
    a: [1, 4000] as [number, number],
    s: [1, 4000] as [number, number],
} as const;
type Ranges = {
    x: [number, number];
    m: [number, number];
    a: [number, number];
    s: [number, number];
};

function count(ranges: Ranges, name = 'in') {
    if (name === 'R') return 0;
    if (name === 'A') {
        let product = 1;
        for (const [min, max] of Object.values(ranges)) {
            product *= max - min + 1; // Do we need a +1 here?
        }
        return product;
    }

    const allChecks = workflows.get(name)!;
    const fallback = allChecks.find((check) => !check.op);
    const checks = allChecks.filter((check) => check !== fallback);

    let total = 0;
    let breakLoop = false;
    for (const { dest, category, num, op } of checks) {
        let passingRange: [number, number] = [0, 0];
        let failingRange: [number, number] = [0, 0];
        const [min, max] = ranges[category!];
        if (op === '<') {
            passingRange = [min, Math.min(num! - 1, max)];
            failingRange = [Math.max(num!, min), max];
        } else if (op === '>') {
            passingRange = [Math.max(num! + 1, min), max];
            failingRange = [min, Math.min(num!, max)];
        }

        if (passingRange![0] <= passingRange![1]) {
            const newRanges = cloneDeep(ranges);
            newRanges[category!] = passingRange;
            total += count(newRanges, dest);
        }
        if (failingRange![0] <= failingRange![1]) {
            ranges = cloneDeep(ranges);
            ranges[category!] = failingRange;
        } else {
            breakLoop = true;
            break;
        }
    }
    if (!breakLoop && fallback) {
        total += count(ranges, fallback.dest);
    }

    return total;
}

console.log(count(defaultRanges)); //TODO: Seb remove <--------------
