const calc = function(input) {
  let result;
  
  const add = function(value) {
    input += value;
    this.result = input;
    return this;
  }
  
  const subtract = function(value) {
    input -= value;
    this.result = input;
    return this;
  }
  
  const isGreaterThan = function(value) {
    return this.result > value;
  }
  
  const isSmallerThan = function(value) {
    return this.result < value;
  }
  
  return {
    add,
    subtract,
    isGreaterThan,
    isSmallerThan
  }
}

export default calc;
