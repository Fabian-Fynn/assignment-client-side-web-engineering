import * as curry from './curry.js';

let a = curry.sum(10);
console.log(a(12));

let b = curry.subtract(100);
console.log(b(12));
