const calc = (operation, ...values) => {
  return operation(values);
}

const sum = (values) => {
  return values.reduce((a, b) => a + b, 0);
}

const subtract = (values) => {
  const first = values.shift();
  return values.reduce((a, b) => a - b, first);
}

const isGreater = (values) => {
  return values[0] > values[1];
}

const isSmaller = (values) => {
  return values[0] < values[1];
}

export {
  calc,
  sum,
  subtract,
  isGreater,
  isSmaller
}
