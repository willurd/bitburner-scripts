import allValidIpsGivenNumber from '../../src/contract-solvers/allValidIpsGivenNumber';

const contract = (name, num, expected) => {
  test(name, () => {
    const result = allValidIpsGivenNumber(num.toString());
    expect(result).toEqual(expected);
  });
};

describe('allValidIpsGivenNumber', () => {
  contract('contract-419046', 1061234377, ['106.123.43.77']);
  contract('contract-537131', 229140157164, ['229.140.157.164']);
  contract('contract-544930', 2339939200, ['233.99.39.200']);
  contract('contract-830662', 41025368, ['4.10.253.68', '4.102.53.68', '41.0.253.68']);
});
