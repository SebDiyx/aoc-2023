import fs from 'fs';

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

function count(ranges: Ranges, name: string) {
    if (name === 'R') return 0;
    if (name === 'A') {
        let product = 1;
        for (const [min, max] of Object.values(ranges)) {
            product *= max - min + 1;
        }
        return product;
    }

    const allChecks = workflows.get(name)!;
    const fallback = allChecks.find((check) => !check.op);
    const checks = allChecks.filter((check) => check !== fallback);

    let total = 0;
    let breakLoop = false;
    for (const { dest, category, num, op } of checks) {
        let passingRange: [number, number] | undefined;
        let failingRange: [number, number] | undefined;
        const [min, max] = ranges[category!];
        if (op === '>') {
            passingRange = [Math.max(num! + 1, min), max];
            failingRange = [min, Math.min(num!, max)];
        } else if (op === '<') {
            passingRange = [min, Math.min(num! - 1, max)];
            failingRange = [Math.max(num!, min), max];
        }

        if (passingRange![0] <= passingRange![1]) {
            const newRanges = { ...ranges, [category!]: passingRange }!;
            total += count(newRanges, dest);
        }
        if (failingRange![0] <= failingRange![1]) {
            const newRanges = { ...ranges, [category!]: failingRange }!;
            // total += count(newRanges, fallback.dest);
        } else {
            breakLoop = true;
            break;
        }
    }
    if (breakLoop && fallback) {
        total += count(ranges, fallback.dest);
    }

    return total;
}

console.log(count(defaultRanges, 'in')); //TODO: Seb remove <--------------

// console.log(res.A); //TODO: Seb remove <--------------

// let total = 0;
// for (const ranges of res.A) {
//     total += Object.values(ranges).reduce((total, [min, max]) => {
//         if (min === 1 && max === 4000) return total;
//         return total * (max - min);
//     }, 1);
// }
// console.log(total); //TODO: Seb remove <--------------
