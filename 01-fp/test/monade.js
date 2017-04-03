import test from 'ava';
import path from 'path';
import monade from '../lib/monade';

test('sum', t => {
  const mon = monade(11);
  mon.add(22).add(44);
  t.is(mon.result, 77);
})

test('subtract', t => {
  const mon = monade(110);
  mon.subtract(22).subtract(55);
  t.is(mon.result, 33);
})

test('isGreater', t => {
  const mon = monade(110);
  t.is(mon.subtract(22).subtract(55).isGreaterThan(32), true);
  t.is(mon.subtract(22).subtract(55).isGreaterThan(34), false);
})

test('isSmaller', t => {
  const mon = monade(110);
  t.is(mon.subtract(22).subtract(55).isSmallerThan(32), false);
  t.is(mon.subtract(22).subtract(55).isSmallerThan(34), true);
})
