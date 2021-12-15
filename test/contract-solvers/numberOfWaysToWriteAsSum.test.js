import numberOfWaysToWriteAsSum from '../../src/contract-solvers/numberOfWaysToWriteAsSum';

const contract = (name, num, expected) => {
  test(name, () => {
    const result = numberOfWaysToWriteAsSum(num);
    expect(result).toEqual(expected);
  });
};

describe('numberOfWaysToWriteAsSum', () => {
  contract('contract-987748', 67, 2679688);
  contract('contract-302652', 74, 7089499);
  contract('contract-656860', 78, 12132163);
  contract('contract-459615', 91, 64112358);
  contract('contract-754728', 99, 169229874);
});
