/**
 * TODO: This script is terrible when you have very little money. It only really
 *       becomes viable after you have maybe $15/$20 million.
 * TODO: Implement shorting stocks when available.
 */

export const commission = { buy: 100000, sell: 100000 };
commission.total = commission.buy + commission.sell;

const units = [
  ['Q', 1e18],
  ['q', 1e15],
  ['t', 1e12],
  ['b', 1e9],
  ['m', 1e6],
];

// https://stackoverflow.com/a/14428340
const formatNumberWithCommas = (num) => {
  return num.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
};

const formatMoney = (money) => {
  for (const [unit, factor] of units) {
    if (money >= factor) {
      const amount = money / factor;
      return '$' + formatNumberWithCommas(amount) + unit;
    }
  }

  return '$' + formatNumberWithCommas(money);
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
export const sellPositions = (ns, stocks) => {
  for (const {
    symbol,
    price,
    position: [shares, averageBuyPrice],
  } of stocks) {
    if (shares > 0) {
      const ret = (price - averageBuyPrice) * shares - commission.total;
      // ns.tprint(`Selling ${shares} shares of ${symbol} at ${formatMoney(price)}, for a return of ${formatMoney(ret)}`);
      ns.stock.sellStock(symbol, shares);
    }
  }
};

const getHeldShares = (stock) => stock.position[0];
const getAveragePositionPrice = (stock) => stock.position[1];
const isStockHeld = (stock) => getHeldShares(stock) > 0;
const isStockGood = (stock) => stock.forecast >= 0.6;
const getHeldStocks = (stocks) => stocks.filter(isStockHeld);
const getGoodStocks = (stocks) => stocks.filter(isStockGood);
const getPositionValue = (stock) => getHeldShares(stock) * getAveragePositionPrice(stock);

export async function setup(ns, state) {
  state.symbols = ns.stock.getSymbols();
  state.has4sApi = ns.stock.purchase4SMarketDataTixApi();
  state.minimumCashOnHand = 1000000;
  state.minimumCashPercent = 0.01;
}

const sortStocksByForecast = (a, b) => {
  if (a.forecast === b.forecast) {
    // If the forecase is the same, get the stock that will grow faster.
    return b.volatility - a.volatility;
  } else {
    // Otherwise get the stock that is more likely to grow.
    return b.forecast - a.forecast;
  }
};

const sortStocksByPrice = (a, b) => {
  if (!isStockGood(a)) {
    return 1;
  } else if (!isStockGood(b)) {
    return -1;
  }

  if (a.price !== b.price) {
    return b.price - a.price;
  }

  return sortStocksByForecast(a, b);
};

export async function tick(ns, state) {
  const stocks = state.symbols.map((symbol) => buildStock(ns, symbol)).sort(sortStocksByPrice);
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

    const stockPurchaseCount = 2;
    const bestStocks = goodStocks.slice(0, stockPurchaseCount);
    const bestStockSymbols = bestStocks.map((s) => s.symbol);

    const otherHeldStocks = heldStocks.filter((s) => !bestStockSymbols.includes(s.symbol));
    if (otherHeldStocks.length > 0) {
      // Don't sell the best stock if we already own some. No need to incur the
      // commission on the sale because we're just going to buy it right back again.
      // ns.print(`Selling all stocks that aren't the current best.`);
      sellPositions(ns, otherHeldStocks);
    }

    for (const stock of bestStocks) {
      const currentMoney = ns.getServerMoneyAvailable('home');
      const moneyInStocks = heldStocks.reduce((acc, stock) => acc + getPositionValue(stock), 0);
      const totalMoney = currentMoney + moneyInStocks;
      const minimumCashOnHand = Math.max(state.minimumCashOnHand, totalMoney * state.minimumCashPercent);
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
            // const totalCost = sharesCost + commission.buy;
            // ns.print(
            //   `Purchasing ${shares} shares${isStockHeld(stock) ? ' more' : ''} of ${
            //     stock.symbol
            //   } at a total of ${formatMoney(totalCost)}.`,
            // );

            ns.stock.buyStock(stock.symbol, shares);
          }
        }
      }
    }
  }
}

export async function done(ns, state) {
  //
}
