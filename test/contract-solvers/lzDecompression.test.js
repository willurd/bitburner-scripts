import lzDecompression from '../../src/contract-solvers/lzDecompression';

const contract = (name, data, expected) => {
  test(name, () => {
    const result = lzDecompression(data);
    expect(result).toEqual(expected);
  });
};

describe('lzDecompression', () => {
  contract('example-1', '5aaabb450723abb', 'aaabbaaababababaabb');
  contract('contract-549047', '7Uleg0tx655IS3lP218FYVEgqm0653iis8478LtrdDN622Nl56', 'Uleg0txeg0txeIS3lPPPFYVEgqm0Egqm0EiisEiisEiis8LtrdDNDNDNDNNlDNDNN');
});
