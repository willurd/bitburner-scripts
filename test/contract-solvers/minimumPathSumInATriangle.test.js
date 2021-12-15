import minimumPathSumInATriangle from '../../src/contract-solvers/minimumPathSumInATriangle';

const contract = (name, rows, expected) => {
  test(name, () => {
    const result = minimumPathSumInATriangle(rows);
    expect(result).toEqual(expected);
  });
};

describe('minimumPathSumInATriangle', () => {
  contract('example-1', [[2], [3, 4], [6, 5, 7], [4, 1, 8, 3]], 11);

  contract(
    'contract-877869',
    [
      [9],
      [7, 8],
      [7, 4, 5],
      [4, 2, 1, 3],
      [8, 9, 7, 3, 4],
      [4, 7, 7, 5, 6, 7],
      [4, 4, 8, 6, 8, 8, 2],
      [3, 2, 3, 4, 4, 6, 2, 1],
    ],
    39,
  );

  contract(
    'contract-125433',
    [
      [5],
      [3, 1],
      [3, 4, 2],
      [9, 5, 5, 3],
      [4, 3, 2, 1, 4],
      [5, 5, 5, 6, 9, 9],
      [7, 6, 1, 3, 7, 1, 9],
      [1, 6, 4, 9, 3, 6, 4, 4],
      [5, 6, 2, 7, 7, 1, 7, 3, 4],
    ],
    25,
  );

  contract('contract-613343', [[8], [2, 7], [6, 5, 4], [9, 3, 7, 3], [9, 4, 1, 3, 4]], 19);

  contract(
    'contract-701837',
    [
      [9],
      [3, 8],
      [1, 7, 6],
      [4, 1, 3, 6],
      [8, 1, 5, 3, 4],
      [7, 7, 9, 9, 7, 6],
      [9, 1, 8, 2, 5, 3, 4],
      [9, 7, 7, 6, 5, 9, 1, 7],
      [1, 7, 2, 2, 7, 4, 7, 3, 2],
    ],
    32,
  );
});
