/** @param {NS} ns **/
export async function main(ns) {
  const symbols = ns.stock.getSymbols();
  ns.tprint(symbols);
  const maxShareMap = symbols.reduce((acc, sym) => {
    acc[sym] = ns.stock.getMaxShares(sym);
    return acc;
  }, {});
  ns.tprint(maxShareMap);

  while (true) {
    for (const sym of symbols) {
      const maxShares = ns.stock.getMaxShares(sym);
      if (maxShares !== maxShareMap[sym]) {
        ns.tprint(`Max shares for stock "${sym}" changed from ${maxShareMap[sym]} to ${maxShares}`);
        maxShareMap[sym] = maxShares;
      }
    }

    await ns.sleep(3000);
  }
}
