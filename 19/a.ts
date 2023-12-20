import fs from 'fs';

type WorkFlow = {
    op?: '>' | '<';
    num?: number;
    category?: 'x' | 'm' | 'a' | 's';
    dest: string | 'A' | 'R';
};

const input = await fs.readFileSync('./input.txt', 'utf-8');
const [workflowsStr, partsStr] = input.split('\n\n');
const workflows = new Map<string, WorkFlow[]>();
workflowsStr.split('\n').forEach((rule) => {
    const [name, checks] = rule.replace('}', '').split('{');

    const workflow: WorkFlow[] = [];
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
const parts = partsStr.split('\n').map((part) => {
    const categories = part.replace('{', '').replace('}', '').split(',');
    const partObj: { [key: string]: number } = {};
    for (const category of categories) {
        const [key, value] = category.split('=');
        partObj[key] = Number(value);
    }
    return partObj;
});
type Part = (typeof parts)[number];

const res: { A: Part[]; R: Part[] } = { A: [], R: [] };
for (const part of parts) {
    let workflow = workflows.get('in')!;

    while (workflow) {
        let dest: string | undefined;

        workflow
            .filter((check) => check.op)
            .some((check) => {
                if (check.op === '>' && part[check.category!] > check.num!) {
                    dest = check.dest;
                    return true;
                } else if (
                    check.op === '<' &&
                    part[check.category!] < check.num!
                ) {
                    dest = check.dest;
                    return true;
                }
            });

        if (!dest) {
            dest = workflow.at(-1)!.dest;
        }

        if (dest === 'A') {
            res.A.push(part);
            break;
        } else if (dest === 'R') {
            res.R.push(part);
            break;
        } else {
            workflow = workflows.get(dest)!;
        }
    }
}

let total = 0;
for (const point of res.A) {
    total += Object.values(point).reduce((a, b) => a + b, 0);
}
console.log(total); //TODO: Seb remove <--------------

/**
 * x: Extremely cool looking
 * m: Musical (it makes a noise when you hit it)
 * a: Aerodynamic
 * s: Shiny
 */

/**
 * Rule "x>10:one": If the part's x is more than 10, send the part to the workflow named one.
 * Rule "m<20:two": Otherwise, if the part's m is less than 20, send the part to the workflow named two.
 * Rule "a>30:R": Otherwise, if the part's a is more than 30, the part is immediately rejected (R).
 * Rule "A": Otherwise, because no other rules matched the part, the part is immediately accepted (A).
 */
