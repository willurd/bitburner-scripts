import canJumpToLastIndex from '../../src/contract-solvers/canJumpToLastIndex';

const contract = (name, arrayString, expected) => {
  test(name, () => {
    const array = arrayString.split(',').map(Number);
    const result = canJumpToLastIndex(array);
    expect(result).toEqual(expected);
  });
};

describe('canJumpToLastIndex', () => {
  contract('contract-163771', '0,7,1,4,8,7,1,0', 0);
  contract('contract-583958', '6,5,1,4,8,9,2', 1);
  contract('contract-678507', '6,8,1,6,4,0,9,6,3,2,0,6,0,0,9,0', 1);
});
