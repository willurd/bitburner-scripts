import largestPrimeFactor from '../../src/contract-solvers/largestPrimeFactor';

const contract = (name, num, expected) => {
  test(name, () => {
    const result = largestPrimeFactor(num);
    expect(result).toEqual(expected);
  });
};

describe('largestPrimeFactor', () => {
  contract('17', 17, 17);
  contract('contract-216657', 188421237, 20935693);
  contract('contract-232934', 268719724, 401);
  contract('contract-313555', 696879955, 2089);
  contract('contract-524182', 366788486, 50957);
  contract('contract-645899', 467197123, 28573);
});
