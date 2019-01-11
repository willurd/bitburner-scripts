import canJumpToLastIndex from '../../src/contract-solvers/canJumpToLastIndex';

const contract = (name, arrayString, expected) => {
  test(name, () => {
    const array = arrayString.split(',').map(Number);
    const result = canJumpToLastIndex(array);
    expect(result).toBe(expected);
  });
};

describe('canJumpToLastIndex', () => {
  contract('contract-163771', '0,7,1,4,8,7,1,0', 0);
  contract('contract-583958', '6,5,1,4,8,9,2', 1);
});
