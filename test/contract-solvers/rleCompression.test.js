import rleCompression from '../../src/contract-solvers/rleCompression';

const contract = (name, data, expected) => {
  test(name, () => {
    const result = rleCompression(data);
    expect(result).toEqual(expected);
  });
};

describe('rleCompression', () => {
  contract('example-1', 'aaaaabccc', '5a1b3c');
  contract('example-2', 'aAaAaA', '1a1A1a1A1a1A');
  contract('example-3', '111112333', '511233');
  contract('example-4', 'zzzzzzzzzzzzzzzzzzz', '9z9z1z');
  contract('contract-175380', 'bTTTeezhhhhhhhhhNNNNNNNNNNNNNN7727GGrrffffyyKtOOOAAAAAAA22338ZZyyyyyyyyyyyyyyeeK66666666qUUUUU', '1b3T2e1z9h9N5N2712172G2r4f2y1K1t3O7A2223182Z9y5y2e1K861q5U');
});
