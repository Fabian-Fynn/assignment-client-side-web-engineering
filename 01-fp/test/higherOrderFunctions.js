import test from 'ava';
import path from 'path';
import * as hof from '../lib/higherOrderFunctions';

test('sum', t => {
  t.is(hof.calc(hof.sum, 11, 22, 33), 66);
})

test('subtract', t => {
  t.is(hof.calc(hof.subtract, 110, 22, 33), 55);
})

test('isGreater', t => {
  t.is(hof.calc(hof.isGreater, 33, 11), true);
  t.is(hof.calc(hof.isGreater, 11, 33), false);
})

test('isSmaller', t => {
  t.is(hof.calc(hof.isSmaller, 33, 11), false);
  t.is(hof.calc(hof.isSmaller, 11, 33), true);
})
