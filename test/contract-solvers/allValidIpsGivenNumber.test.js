import allValidIpsGivenNumber from '../../src/contract-solvers/allValidIpsGivenNumber';

const contract = (name, num, expected) => {
  test(name, () => {
    const result = allValidIpsGivenNumber(num.toString());
    expect(result).toEqual(expected);
  });
};

describe('allValidIpsGivenNumber', () => {
  contract('example-1', 25525511135, ['255.255.11.135', '255.255.111.35']);
  contract('example-2', 1938718066, ['193.87.180.66']);
  contract('contract-171069', 2507282126, ['250.72.82.126']);
  contract('contract-278276', 1701225238, [
    '170.1.225.238',
    '170.12.25.238',
    '170.12.252.38',
    '170.122.5.238',
    '170.122.52.38',
  ]);
  contract('contract-419046', 1061234377, ['106.123.43.77']);
  contract('contract-537131', 229140157164, ['229.140.157.164']);
  contract('contract-544930', 2339939200, ['233.99.39.200']);
  contract('contract-830662', 41025368, ['4.10.253.68', '4.102.53.68', '41.0.253.68']);
  contract('contract-863407', 21830200188, ['218.30.200.188']);
  contract('contract-250005', 6728246244, ['67.28.246.244']);
});
