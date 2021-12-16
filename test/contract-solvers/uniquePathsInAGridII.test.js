import uniquePathsInAGridII from '../../src/contract-solvers/uniquePathsInAGridII';

const contract = (name, grid, expected) => {
  test(name, () => {
    const result = uniquePathsInAGridII(grid);
    expect(result).toEqual(expected);
  });
};

describe('uniquePathsInAGridII', () => {
  contract(
    'my-example-1',
    [
      [0, 0, 0],
      [0, 1, 0],
      [1, 0, 0],
    ],
    1,
  );

  contract(
    'my-example-2',
    [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 1],
    ],
    0,
  );

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
    252,
  );

  contract(
    'contract-492287',
    [
      [0, 0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 1, 1, 0, 0, 1, 0, 0],
      [0, 1, 0, 1, 0, 0, 0, 0, 0],
    ],
    145,
  );
});
