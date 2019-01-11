import spiralOrderMatrix, { mtx } from '../../src/contract-solvers/spiralOrderMatrix';

const contract = (name, matrixString, expectedString) => {
  test(name, () => {
    const matrix = mtx([matrixString]);
    const expected = expectedString.split(',').map(Number);
    const result = spiralOrderMatrix(matrix);
    expect(result).toEqual(expected);
  });
};

describe('spiralOrderMatrix', () => {
  contract(
    'contract-49162',
    `
      50,24,23,11,44,
      28,19,43,19,32,
      37,26,38,1,49,
      6,31,15,33,14,
      32,39,35,47,39,
      32,49,21,28,38,
      29,25,34,23,48,
    `,
    '50,24,23,11,44,32,49,14,39,38,48,23,34,25,29,32,32,6,37,28,19,43,19,1,33,47,28,21,49,39,31,26,38,15,35',
  );

  contract(
    'contract-305323',
    `
      27,32,49,33,
      22,3,49,2,
      33,27,38,16,
      7,24,29,16,
      33,3,10,30,
      35,37,20,5,
    `,
    '27,32,49,33,2,16,16,30,5,20,37,35,33,7,33,22,3,49,38,29,10,3,24,27',
  );

  contract(
    'contract-418298',
    `
      38,5,47,22,12,
      9,46,9,38,34,
      11,35,16,25,16,
      15,11,25,5,24,
      42,49,21,20,21,
      39,15,38,34,36,
    `,
    '38,5,47,22,12,34,16,24,21,36,34,38,15,39,42,15,11,9,46,9,38,25,5,20,21,49,11,35,16,25',
  );

  contract(
    'contract-783949',
    `
      27,34,12,
      23,31,35,
      17,40,14,
    `,
    '27,34,12,35,14,40,17,23,31',
  );
});
