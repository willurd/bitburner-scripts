/**
 * NOTES:
 *
 * - It looks like a forecast of 0.5 means no change, > 0.5 means positive forecast, and < 0.5 means negative forecast.
 */

export async function setup(ns, state) {
  state.symbols = ns.stock.getSymbols();
  state.has4sApi = ns.stock.purchase4SMarketDataTixApi();
  state.minimumCashOnHand = 1000000;
  state.minimumCashPercent = 0.01;
  state.hasPosition = false;
}

export const commission = { buy: 100000, sell: 100000 };
commission.total = commission.buy + commission.sell;

export const formatMoney = (money) => {
  return '$' + money.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
};

/**
 * @param {NS} ns
 */
export const buildStock = (ns, symbol) => ({
  symbol,
  price: ns.stock.getPrice(symbol),
  position: ns.stock.getPosition(symbol),
  volatility: ns.stock.getVolatility(symbol),
  forecast: ns.stock.getForecast(symbol),
});

/**
 * @param {NS} ns
 */
const sellPosition = (ns, stock) => {
  const {
    symbol,
    price,
    position: [shares, averageBuyPrice],
  } = stock;

  if (shares > 0) {
    const totalPriceChange = (price - averageBuyPrice) * shares;
    const returnValue = totalPriceChange - commission.total;
    ns.tprint(
      `Selling ${shares} shares of ${symbol} at ${formatMoney(price)}, for a return of ${formatMoney(returnValue)}`,
    );
    ns.stock.sell(symbol, shares);
  }
};

const getHeldShares = (stock) => stock.position[0];
const getAveragePositionPrice = (stock) => stock.position[1];
const isStockHeld = (stock) => getHeldShares(stock) > 0;
const isStockGood = (stock) => stock.forecast >= 0.65;
const getHeldStocks = (stocks) => stocks.filter(isStockHeld);
const getGoodStocks = (stocks) => stocks.filter(isStockGood);
const getPositionValue = (stock) => getHeldShares(stock) * getAveragePositionPrice(stock);
const buildStocks = (ns, symbols) =>
  symbols
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

/**
 * Sell all unviable positions (positions in the "-").
 *
 * @param {NS} ns
 */
const sellUnviablePositions = (ns, state, stocks) => {
  const heldStocks = getHeldStocks(stocks);
  let soldCount = 0;

  for (const stock of heldStocks) {
    if (!isStockGood(stock)) {
      sellPosition(ns, stock);
    }
  }

  //   We still have a position if we didn't sell all of our stocks.
  state.hasPosition = soldCount < heldStocks.length;
};

/**
 * @param {NS} ns
 */
const purchaseAllPossibleViableSharesOfStock = (ns, state, stocks, stock) => {
  const heldStocks = getHeldStocks(stocks);
  const currentMoney = ns.getServerMoneyAvailable('home');
  const moneyInStocks = heldStocks.reduce((acc, s) => acc + getPositionValue(s), 0);
  const totalMoney = currentMoney + moneyInStocks;
  const minimumCashOnHand = Math.max(state.minimumCashOnHand, totalMoney * state.minimumCashPercent) + commission.buy;
  const availableMoney = currentMoney - minimumCashOnHand;

  // ns.print(`Available money to purchase shares of ${stock.symbol}: ${formatMoney(availableMoney)}`);

  if (availableMoney <= 0) {
    // ns.print(
    //   `You only have ${formatMoney(currentMoney)}, less than the configured minimum cash on hand of ${formatMoney(
    //     minimumCashOnHand,
    //   )}. Cannot purchase shares of ${stock.symbol}.`,
    // );
    return;
  }

  const maxPurchaseableShares = ns.stock.getMaxShares(stock.symbol) - getHeldShares(stock);
  const shares = Math.min(maxPurchaseableShares, Math.floor(availableMoney / stock.price));

  if (shares > 0) {
    const sharesCost = shares * stock.price;

    if (sharesCost >= commission.total * 10 && availableMoney >= sharesCost) {
      // Don't waste commission money buying stocks worth less than the commission.
      const totalCost = sharesCost + commission.buy;
      ns.print(
        `Purchasing ${shares} shares${isStockHeld(stock) ? ' more' : ''} of ${stock.symbol} at a total of ${formatMoney(
          totalCost,
        )}.`,
      );

      ns.stock.buy(stock.symbol, shares);
      state.hasPosition = true;
    }
  }
};

/**
 * Purchase as many shares as possible of all viable positions, from some minimum (e.g. 100x commission fee).
 *
 * @param {NS} ns
 */
const purchaseBestStock = (ns, state, stocks) => {
  const goodStocks = getGoodStocks(stocks);

  if (goodStocks.length === 0) {
    // ns.print(`There are no stocks worth holding. Selling all current positions.`);
    return;
  }

  const bestStock = goodStocks[0];
  purchaseAllPossibleViableSharesOfStock(ns, state, stocks, bestStock);
};

/**
 * @param {NS} ns
 */
export async function tick(ns, state) {
  const stocks = buildStocks(ns, state.symbols);

  if (state.hasPosition) {
    sellUnviablePositions(ns, state, stocks);
  }

  if (!state.hasPosition) {
    purchaseBestStock(ns, state, stocks);
  }
}

/**
 * @param {NS} ns
 */
export async function done(ns, state) {
  //
}
