import largestSubArraySum from '../../src/contract-solvers/largestSubArraySum.ns';

const contract = (name, arrayString, expected) => {
  test(name, () => {
    const array = arrayString.split(',').map(Number);
    const result = largestSubArraySum(array);
    expect(result).toBe(expected);
  });
};

describe('largestSubArraySum', () => {
  contract('contract-315871', '-10,1,-8,6,-3,9,0,-8,-1,-6,3,-3,-7,-8,1', 12);
});
