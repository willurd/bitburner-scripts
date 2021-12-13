import { formatMoney } from './lib-money.js';

export const updaterScript = 'sm-update-config.js';
export const configFile = 'sm-config.txt';
export const commission = { buy: 100000, sell: 100000 };
commission.total = commission.buy + commission.sell;

export const configDefaults = {
  tickTime: 3000,
  minimumCashOnHand: 2e7, // 20 million
  minimumCashPercent: 0.05, // 5 percent
  purchase4SMarketData: false,
  purchase4SMarketDataTixApi: false,
  symbols: null,
};

export const loadConfig = (ns) => {
  try {
    const content = ns.read(configFile);
    const json = JSON.parse(content);
    return Object.assign({}, configDefaults, json);
  } catch (e) {
    ns.tprint(e.toString());
    return Object.assign({}, configDefaults);
  }
};

export const saveConfig = (ns, config) => {
  ns.clear(configFile);
  ns.write(configFile, JSON.stringify(config, null, 2));
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
export const sellPositions = (ns, stocks, isSimulated) => {
  for (const {
    symbol,
    price,
    position: [shares, averageBuyPrice],
  } of stocks) {
    if (shares > 0) {
      const ret = (price - averageBuyPrice) * shares - commission.total;
      ns.tprint(`Selling ${shares} shares of ${symbol} at ${formatMoney(price)}, for a return of ${formatMoney(ret)}`);

      if (!isSimulated) {
        ns.stock.sell(symbol, shares);
      }
    }
  }
};
