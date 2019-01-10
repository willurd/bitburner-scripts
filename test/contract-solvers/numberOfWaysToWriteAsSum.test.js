import numberOfWaysToWriteAsSum from '../../src/contract-solvers/numberOfWaysToWriteAsSum.ns';

describe('numberOfWaysToWriteAsSum', () => {
  test('contract-754728-BladeIndustries', () => {
    const num = 99;
    const expected = 169229874;
    const result = numberOfWaysToWriteAsSum(num);
    expect(result).toBe(expected);
  });
});
