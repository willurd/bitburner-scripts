import spiralOrderMatrix, { mtx } from '../../src/contract-solvers/spiralOrderMatrix.ns';

describe('spiralOrderMatrix', () => {
  test('contract-418298', () => {
    const matrix = mtx`
      38,5,47,22,12,
      9,46,9,38,34,
      11,35,16,25,16,
      15,11,25,5,24,
      42,49,21,20,21,
      39,15,38,34,36,
    `;
    const expected = '38,5,47,22,12,34,16,24,21,36,34,38,15,39,42,15,11,9,46,9,38,25,5,20,21,49,11,35,16,25'
      .split(',')
      .map(Number);
    const result = spiralOrderMatrix(matrix);
    expect(result).toEqual(expected);
  });
});
