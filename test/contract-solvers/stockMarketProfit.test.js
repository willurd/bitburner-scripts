import stockMarketProfit from '../../src/contract-solvers/stockMarketProfit.ns';

describe('stockMarketProfit', () => {
  test('contract-513233-Sector-12', () => {
    const prices = '112,25,122,7,9,20,188,79,20,58,70,134,193,25,163,61,57,5,126,48'.split(',').map(Number);
    const maxTransactions = prices.length - 1;
    const expected = 710;
    const profit = stockMarketProfit(prices, maxTransactions);
    expect(profit).toBe(expected);
  });
});
