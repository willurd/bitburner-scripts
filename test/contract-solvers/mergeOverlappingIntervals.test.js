import mergeOverlappingIntervals from '../../src/contract-solvers/mergeOverlappingIntervals';

const contract = (name, array, expected) => {
  test(name, () => {
    const result = mergeOverlappingIntervals(array);
    expect(result).toEqual(expected);
  });
};

describe('mergeOverlappingIntervals', () => {
  contract(
    'contract-251962',
    [[8, 18], [19, 20], [8, 16], [6, 14], [23, 26], [5, 8], [3, 9], [1, 10]],
    [[1, 18], [19, 20], [23, 26]],
  );

  contract(
    'contract-572922',
    [
      [9, 10],
      [25, 27],
      [3, 6],
      [2, 8],
      [6, 11],
      [19, 24],
      [15, 25],
      [23, 30],
      [22, 28],
      [4, 7],
      [19, 28],
      [5, 10],
      [18, 26],
    ],
    [[2, 11], [15, 30]],
  );

  contract(
    'contract-915858',
    [
      [2, 4],
      [3, 5],
      [3, 12],
      [9, 15],
      [1, 10],
      [20, 24],
      [8, 10],
      [2, 9],
      [13, 18],
      [11, 19],
      [4, 7],
      [20, 24],
      [9, 10],
      [16, 18],
    ],
    [[1, 19], [20, 24]],
  );
});
