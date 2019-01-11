import largestPrimeFactor from '../../src/contract-solvers/largestPrimeFactor.js';

const contract = (name, num, expected) => {
  test(name, () => {
    const result = largestPrimeFactor(num);
    expect(result).toBe(expected);
  });
};

describe('largestPrimeFactor', () => {
  contract('contract-216657', 188421237, 20935693);
  contract('contract-524182', 366788486, 50957);
});
