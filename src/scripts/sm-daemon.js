/**
 * This script runs in the background constantly looking for the best
 * position to hold in the stock market.
 *
 * These functions must be called in this script because their values
 * change over time:
 *
 *   - `read(file)` - 1 GB
 *   - `getServerMoneyAvailable('home')` - 0.1 GB
 *   - `getStockPrice(sym)` - 2 GB
 *   - `getStockPosition(sym)` - 2 GB
 *   - `buyStock(sym, shares)` - 2.5 GB
 *   - `sellStock(sym, shares)` - 2.5 GB
 *   - `getStockVolatility(sym)` - 2.5 GB
 *   - `getStockForecast(sym)` - 2.5 GB
 *
 * These functions return data that either never changes or changes very
 * rarely. Run `sm-update-config.js` to call these and save their outputs
 * to `sm-config.txt`.
 *
 *   - `getStockSymbols()` - 2 GB
 *   - `purchase4SMarketData()` - 2.5 GB
 *   - `purchase4SMarketDataTixApi()` - 2.5 GB
 *   - Total: 7 GB saved in this script.
 *
 * TODO: This script is terrible when you have very little money. It only really
 *       becomes viable after you have maybe $15/$20 million.
 * TODO: Implement shorting stocks when available.
 */

import { loadConfig, updaterScript, commission, buildStock, sellPositions } from './sm-utils.js';
import { formatMoney } from './lib-money.js';

const canUseScript = (ns) => {
  const config = loadConfig(ns);
  let canUse = true;

  if (!config.purchase4SMarketData) {
    canUse = false;
    ns.tprint(`You do not have access to 4S market data. Purchase access and run ${updaterScript}.`);
  }

  if (!config.purchase4SMarketDataTixApi) {
    canUse = false;
    ns.tprint(`You do not have access to the TIX API. Purchase access and run ${updaterScript}.`);
  }

  if (!config.symbols || config.symbols.length === 0) {
    canUse = false;
    ns.tprint(`Unable to find stock symbol data. Please run ${updaterScript}.`);
  }

  return canUse;
};

const calculateNetWorth = (ns) => {
  const currentMoney = ns.getServerMoneyAvailable('home');
  const heldStocks = ns.stock
    .getSymbols()
    .map((symbol) => buildStock(ns, symbol))
    .filter(isStockHeld);
  const moneyInStocks = heldStocks.reduce((acc, stock) => acc + getPositionValue(stock), 0);
  return currentMoney + moneyInStocks;
};

const getHeldShares = (stock) => stock.position[0];
const getAveragePositionPrice = (stock) => stock.position[1];
const isStockHeld = (stock) => getHeldShares(stock) > 0;
const isStockGood = (stock) => stock.forecast >= 0.58;
const getHeldStocks = (stocks) => stocks.filter(isStockHeld);
const getGoodStocks = (stocks) => stocks.filter(isStockGood);
const getPositionValue = (stock) => getHeldShares(stock) * getAveragePositionPrice(stock);

const tick = async (ns, state, config, iteration, isSimulated) => {
  const stocks = config.symbols
    .map((symbol) => buildStock(ns, symbol))
    .sort((a, b) => {
      if (a.forecast === b.forecast) {
        // If the forecase is the same, get the stock that will grow faster.
        return b.volatility - a.volatility;
      } else {
        // Otherwise get the stock that is more likely to grow.
        return b.forecast - a.forecast;
      }
    });
  const heldStocks = getHeldStocks(stocks);
  const goodStocks = getGoodStocks(stocks);

  if (goodStocks.length === 0) {
    // Nothing looks good. Just sell everything and wait.
    if (heldStocks.length > 0) {
      ns.print(`There are no stocks worth holding. Selling all current positions.`);
      sellPositions(ns, heldStocks);
    }
  } else {
    // ns.print(`Stocks worth holding:`);
    // for (const { symbol, price, position, volatility, forecast } of goodStocks) {
    //   ns.print(`${symbol} - price=${price}, position=${position}, volatility=${volatility}, forecast=${forecast}`);
    // }

    const stockPurchaseCount = 3;
    const bestStocks = goodStocks.slice(0, stockPurchaseCount);
    const bestStockSymbols = bestStocks.map((s) => s.symbol);

    const otherHeldStocks = heldStocks.filter((s) => !bestStockSymbols.includes(s.symbol));
    if (otherHeldStocks.length > 0) {
      // Don't sell the best stock if we already own some. No need to incur the
      // commission on the sale because we're just going to buy it right back again.
      ns.print(`Selling all stocks that aren't the current best.`);
      sellPositions(ns, otherHeldStocks);
      state.stocksChanged = true;
    }

    for (const stock of bestStocks) {
      const currentMoney = ns.getServerMoneyAvailable('home');
      const moneyInStocks = heldStocks.reduce((acc, stock) => acc + getPositionValue(stock), 0);
      const totalMoney = currentMoney + moneyInStocks;
      const minimumCashOnHand = Math.max(config.minimumCashOnHand, totalMoney * config.minimumCashPercent);
      const availableMoney = currentMoney - minimumCashOnHand - commission.buy;

      // TODO: Sell some shares if I need more cash on hand, given the config.

      if (availableMoney <= 0) {
        if (!isStockHeld(stock)) {
          ns.print(
            `You only have ${formatMoney(currentMoney)}, less than the configured minimum cash on hand of ${formatMoney(
              minimumCashOnHand,
            )}`,
          );
        }
      } else {
        const maxPurchaseableShares = ns.stock.getMaxShares(stock.symbol) - getHeldShares(stock);
        const shares = Math.min(maxPurchaseableShares, Math.floor(availableMoney / stock.price));

        if (shares > 0) {
          const sharesCost = shares * stock.price;

          if (!isStockHeld(stock) || sharesCost >= commission.total * 100) {
            // Don't waste commission money buying stocks worth less than the commission.
            const totalCost = sharesCost + commission.buy;
            ns.print(
              `Purchasing ${shares} shares${isStockHeld(stock) ? ' more' : ''} of ${
                stock.symbol
              } at a total of ${formatMoney(totalCost)}.`,
            );

            if (!isSimulated) {
              ns.stock.buy(stock.symbol, shares);
              state.stocksChanged = true;
            }
          }
        }
      }
    }
  }

  const netWorth = calculateNetWorth(ns);

  if (state.stocksChanged && netWorth !== state.netWorth) {
    ns.print(`Net worth: ${formatMoney(netWorth)} (${formatMoney(netWorth - state.netWorth)})`);
    state.netWorth = netWorth;
    state.stocksChanged = false;
  }
};

/**
 * @param {NS} ns
 */
export async function main(ns) {
  const isSimulated = ns.args[0] === 1;
  const maxIterations = Number.POSITIVE_INFINITY;
  let iteration = 0;

  ns.tprint(`Running in simulation mode: ${isSimulated ? 'YES' : 'NO'}`);

  if (!canUseScript(ns)) {
    return;
  }

  // Values that are shared across ticks.
  const state = {
    netWorth: calculateNetWorth(ns),
  };

  while (true && iteration < maxIterations) {
    iteration += 1;
    // ns.tprint(`Iteration ${iteration}`);
    const config = loadConfig(ns);
    await tick(ns, state, config, iteration, isSimulated);
    await ns.sleep(config.tickTime);
  }

  const config = loadConfig(ns);
  const stocks = config.symbols.map((symbol) => buildStock(ns, symbol));
  const heldStocks = getHeldStocks(stocks);

  if (heldStocks.length > 0) {
    ns.tprint('DEBUG: Selling all positions');
    sellPositions(ns, heldStocks, isSimulated);
  }

  ns.tprint('Exiting sm-daemon.js');
}
