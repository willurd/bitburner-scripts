import lzCompression from '../../src/contract-solvers/lzCompression';

const contract = (name, data, expected) => {
  test(name, () => {
    const result = lzCompression(data);
    expect(result).toEqual(expected);
  });
};

describe('lzCompression', () => {
  contract('example-1', 'abracadabra', '7abracad47');
  contract('example-2', 'mississippi', '4miss433ppi');
  contract('example-4', '2718281828', '627182844');
  contract('example-5', 'abcdefghijk', '9abcdefghi02jk');
  // contract('contract-150165', 'R11B5TbbbbbrUu333333333rpm000000000jX0jX0jX0jGM80jX0jGM8jX0jG5GM8jX0jGGM', '7R11B5Tb414rUu3814rpm0812jX833GM88805715892GM');
});
