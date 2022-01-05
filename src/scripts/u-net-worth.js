import { loadConfig, buildStock } from './sm-utils.js';
import { formatMoney } from './lib-money.js';

const getHeldShares = (stock) => stock.position[0];

const getAveragePositionPrice = (stock) => stock.position[1];

const isStockHeld = (stock) => getHeldShares(stock) > 0;

const getHeldStocks = (stocks) => stocks.filter(isStockHeld);

const getPositionValue = (stock) => getHeldShares(stock) * getAveragePositionPrice(stock);

const getMoneyInStocks = async (ns) => {
  const config = loadConfig(ns);
  const stocks = config.symbols.map((symbol) => buildStock(ns, symbol));
  const heldStocks = getHeldStocks(stocks);
  return heldStocks.reduce((acc, stock) => acc + getPositionValue(stock), 0);
};

/** @param {NS} ns **/
export async function main(ns) {
  const cashOnHand = ns.getServerMoneyAvailable('home');
  const moneyInStocks = await getMoneyInStocks(ns);
  const netWorth = cashOnHand + moneyInStocks;

  ns.tprint(`Cash on hand: ${formatMoney(cashOnHand)}`);
  ns.tprint(`Value in stocks: ${formatMoney(moneyInStocks)}`);
  ns.tprint(`Net worth: ${formatMoney(netWorth)}`);
}
