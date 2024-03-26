import { buildStock, loadConfig, sellPositions } from './sm-utils.js';

const getHeldShares = (stock) => stock.position[0];
const isStockHeld = (stock) => getHeldShares(stock) > 0;
const getHeldStocks = (stocks) => stocks.filter(isStockHeld);

/**
 * @param {NS} ns
 */
export async function main(ns) {
  const config = loadConfig(ns);
  const stocks = config.symbols.map((symbol) => buildStock(ns, symbol));
  const heldStocks = getHeldStocks(stocks);

  if (heldStocks.length > 0) {
    ns.tprint('DEBUG: Selling all positions');
    sellPositions(ns, heldStocks);
  }

  ns.tprint('Exiting sm-daemon.js');
}
