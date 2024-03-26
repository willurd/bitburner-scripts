import lzCompression from '../../src/contract-solvers/lzCompression';

const contract = (name, data, expected) => {
  test(name, () => {
    const result = lzCompression(data);
    expect(result).toEqual(expected);
  });
};

describe('lzCompression', () => {
  contract('example-1', '', '');
});
