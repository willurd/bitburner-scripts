import uniquePathsInAGridII from '../../src/contract-solvers/uniquePathsInAGridII';

const contract = (name, grid, expected) => {
  test(name, () => {
    const result = uniquePathsInAGridII(grid);
    expect(result).toEqual(expected);
  });
};

describe('uniquePathsInAGridII', () => {
  contract(
    'contract-499744',
    [
      [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
      [1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1],
      [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
    ],
    654,
  );
});
