/**
 * NOTE: Have to run this with node instead of bun due to the z3-solver package
 * With bun you'll get the following error:
 *   Can't find variable: initZ3 
 *   ReferenceError: Can't find variable: initZ3
 */


import fs from 'fs';
import {init} from 'z3-solver';

// Initialise the solver
const { Context } = await init();
const Z3 = new Context('main');

const input = await fs.readFileSync('./input.txt', 'utf-8');
const hailstones = input.split('\n').map((line, i) => {
    // x, y, z @ dx, dy, dz
    // e.g. 19, 13, 30 @ -2,  1, -2
    const [posStr, velocityStr] = line.split(' @ ');
    const [x, y, z] = posStr.split(', ').map((str) => Number(str));
    const [dx, dy, dz] = velocityStr.split(', ').map((str) => Number(str));
    return { id: i + 1, x, y, z, dx, dy, dz };
});

const x = Z3.Real.const('x');
const y = Z3.Real.const('y');
const z = Z3.Real.const('z');

const dx = Z3.Real.const('vx');
const dy = Z3.Real.const('vy');
const dz = Z3.Real.const('vz');

const solver = new Z3.Solver();

for (const hailstone of hailstones) {
    const t = Z3.Real.const(`t${hailstone.id}`);

    solver.add(t.ge(0));
    solver.add(x.add(dx.mul(t)).eq(t.mul(hailstone.dx).add(hailstone.x)));
    solver.add(y.add(dy.mul(t)).eq(t.mul(hailstone.dy).add(hailstone.y)));
    solver.add(z.add(dz.mul(t)).eq(t.mul(hailstone.dz).add(hailstone.z)));
}

await solver.check();

const model = solver.model();
const resX = Number(model.eval(x));
const resY = Number(model.eval(y));
const resZ = Number(model.eval(z));
console.log(resX + resY + resZ); 
