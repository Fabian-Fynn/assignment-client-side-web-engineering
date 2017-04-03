const checkValue = (i) => {
  if (typeof i !== 'number') {
    throw new Error('Input must be of type number');
  }
}

const sum = (a) => {
  checkValue(a);

  return (b) => {
    checkValue(b);

    return a + b;
  }
}

const subtract = (a) => {
  checkValue(a);
  
  return (b) => {
    checkValue(b);
    
    return a - b;
  }
}

const isGreater = (a) => {
  checkValue(a);
  
  return (b) => {
    checkValue(b);
    
    return a > b;
  }
}

const isSmaller = (a) => {
  checkValue(a);
  
  return (b) => {
    checkValue(b);
    
    return a < b;
  }
}

export {
  sum,
  subtract,
  isGreater,
  isSmaller
}
