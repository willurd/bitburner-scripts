export default function stockMarketProfit(stocks, maxTransactions = stocks.length - 1) {
  const n = stocks.length;
  const k = maxTransactions;
  const table = Array.from({ length: k + 1 }, () => Array.from({ length: n + 1 }, () => 0));

  // For each number of transactions.
  for (let t = 1; t <= k; t++) {
    // For each day.
    for (let d = 1; d < n; d++) {
      let max = Number.NEGATIVE_INFINITY;

      // For each day up to this day.
      for (let l = 0; l < d; l++) {
        // Take the current max, or the profit from this sale plus the maximum profit
        // of t-1 transactions up until this point.
        max = Math.max(max, stocks[d] - stocks[l] + table[t - 1][l]);
      }

      // But don't go backward (in case this is a negative transaction).
      table[t][d] = Math.max(max, table[t][d - 1]);
    }
  }

  return table[k][n - 1];
}
