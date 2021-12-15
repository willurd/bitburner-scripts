import uniquePathsInAGridI from '../../src/contract-solvers/uniquePathsInAGridI';

const contract = (name, rows, columns, expected) => {
  test(name, () => {
    const result = uniquePathsInAGridI(rows, columns);
    expect(result).toEqual(expected);
  });
};

describe('uniquePathsInAGridI', () => {
  contract('contract-619431', 13, 12, 1352078);
});
