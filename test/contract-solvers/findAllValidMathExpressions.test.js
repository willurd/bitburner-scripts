import findAllValidMathExpressions from '../../src/contract-solvers/findAllValidMathExpressions';

const contract = (name, numberString, targetValue, expected) => {
  test(name, () => {
    const result = findAllValidMathExpressions(numberString, targetValue);
    expect(result).toEqual(expected);
  });
};

describe('canJumpToLastIndex', () => {
  contract('example-1', '123', 6, ['1+2+3', '1*2*3']);
  contract('example-2', '105', 5, ['1*0+5', '10-5']);
  contract('contract-204735', '61957', -74, []);
  contract('contract-664868', '6932929', 82, [
    '6*9+3+2*9-2+9',
    '6*9+3-2+9*2+9',
    '6*9+3-2+9+2*9',
    '6-9*3+2+92+9',
    '6+9*3+29*2-9',
  ]);
  // contract('contract-454301', '994399492243', -4, []);
  contract('contract-121927', '1344', 85, []);
  // contract('contract-52858', '3021578465', 44, []);
  contract('contract-872927', '462564', -63, ['4-62+5-6-4']);
  // contract('contract-652226', '6361837195', 80, []);
  //   contract('contract-252324', '60020257', -40, []);
});
