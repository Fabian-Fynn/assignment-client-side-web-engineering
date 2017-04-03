import test from 'ava';
import path from 'path';
import * as curry from '../lib/curry';

test('sum', t => {
  t.is(curry.sum(11)(22), 33);
})

test('subtract', t => {
  t.is(curry.subtract(110)(22), 88);
})

test('isGreater', t => {
  t.is(curry.isGreater(33)(11), true);
  t.is(curry.isGreater(11)(33), false);
})

test('isSmaller', t => {
  t.is(curry.isSmaller(33)(11), false);
  t.is(curry.isSmaller(11)(33), true);
})
