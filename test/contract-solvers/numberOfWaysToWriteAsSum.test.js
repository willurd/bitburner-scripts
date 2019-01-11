import numberOfWaysToWriteAsSum from '../../src/contract-solvers/numberOfWaysToWriteAsSum.js';

const contract = (name, num, expected) => {
  test(name, () => {
    const result = numberOfWaysToWriteAsSum(num);
    expect(result).toBe(expected);
  });
};

describe('numberOfWaysToWriteAsSum', () => {
  contract('contract-987748', 67, 2679688);
  contract('contract-302652', 74, 7089499);
  contract('contract-459615', 91, 64112358);
  contract('contract-754728', 99, 169229874);
});
