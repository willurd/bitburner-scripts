const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');
const safeEval = require('safe-eval');

const scenarios = {
  early: {
    new: { cash: 1e6 },
    upAndComer: { cash: 50e6 },
    inTheKnow: { cash: 50e6, has4sApi: true },
    justWokeUp: { cash: 1e6, has4sApi: true },
  },
  late: {
    inTheKnow: { cash: 50e6, has4sApi: true, shorting: true, limitStop: true },
    justWokeUp: { cash: 1e6, has4sApi: true, shorting: true, limitStop: true },
  },
};

// https://github.com/danielyxie/bitburner/blob/2945025eb2b20d28f807920b066cfa5a55e4c447/src/Constants.ts#L133
const STOCK_MARKET_COMMISSION = 100e3;

const createNs = (game) => {
  const symbols = game.dataset.symbols;
  const has4sApi = game.scenario.has4sApi;
  let cash = game.scenario.cash;

  const getTick = () => game.dataset.ticks[game.state.currentTick];
  const getStock = (symbol) => getTick().stocks[symbol];
  const positions = symbols.reduce((map, symbol) => {
    map[symbol] = {
      playerShares: 0,
      playerAvgPx: 0,
      playerShortShares: 0,
      playerAvgShortPx: 0,
    };
    return map;
  }, {});

  const loggingFlags = {};
  const logs = [];
  const canLog = (fn) => loggingFlags[fn] !== false;

  const log = (message) => {
    console.log(message);
    logs.push(message);
  };

  const ns = {
    // General API methods.
    print: (message) => canLog('print') && log(String(message)),
    tprint: (message) => canLog('tprint') && log(String(message)),
    sleep: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
    clearLog: () => (logs = []), // noop
    disableLog: (fn) => {
      if (fn === 'ALL') {
        Object.keys(ns).forEach((key) => (loggingFlags[key] = false));
      } else {
        loggingFlags[fn] = false;
      }
    },
    enableLog: (fn) => (fn === 'ALL' ? (loggingFlags = {}) : (loggingFlags[fn] = true)),
    isLogEnabled: (fn) => loggingFlags[fn] !== false,
    getScriptLogs: () => logs.slice(),

    // TIX API methods.
    getStockSymbols: () => symbols.slice(),
    getStockPrice: (symbol) => getStock(symbol)[0],
    getStockVolatility: (symbol) => getStock(symbol)[1],
    getStockForecast: (symbol) => getStock(symbol)[2],

    getStockPosition: (symbol) => {
      if (!(symbol in positions)) {
        throw new Error(`Unknown stock symbol: ${symbol}`);
      }

      const position = positions[symbol];
      return [position.playerShares, position.playerAvgPx, position.playerShortShares, position.playerAvgShortPx];
    },

    // Copied almost directly from: https://github.com/danielyxie/bitburner/blob/435d1836459ddbcac66ba96c46a6688a563bc05c/src/NetscriptFunctions.js#L1540
    buyStock: (symbol, sharesProp) => {
      const stock = getStock(symbol);
      const position = positions[symbol];

      if (!stock || !position) {
        throw new Error(`Invalid stock symbol passed into buyStock()`);
      }

      if (sharesProp < 0 || isNaN(sharesProp)) {
        log("ERROR: Invalid 'shares' argument passed to buyStock()");
        return 0;
      }

      const shares = Math.round(sharesProp);

      if (shares === 0) {
        return 0;
      }

      const totalPrice = stock[0] * shares;
      const cost = totalPrice + STOCK_MARKET_COMMISSION;

      if (cash < cost) {
        log(`Not enough money to purchase ${shares} shares of ${symbol}. Need \$${cost}.`);
        return 0;
      }

      const origTotal = position.playerShares * position.playerAvgPx;
      cash -= cost;
      const newTotal = origTotal + totalPrice;
      position.playerShares += shares;
      position.playerAvgPx = newTotal / position.playerShares;

      if (canLog('buyStock')) {
        log(`Bought ${shares} shares of ${symbol} at \$${stock[0]} per share`);
      }

      return stock[0];
    },

    // https://github.com/danielyxie/bitburner/blob/435d1836459ddbcac66ba96c46a6688a563bc05c/src/NetscriptFunctions.js#L1581
    sellStock: (symbol, sharesProp) => {
      const stock = getStock(symbol);
      const position = positions[symbol];

      if (!stock || !position) {
        throw new Error(`Invalid stock symbol passed into sellStock()`);
      }

      if (sharesProp < 0 || isNaN(sharesProp)) {
        log("ERROR: Invalid 'shares' argument passed to sellStock()");
        return 0;
      }

      const shares = Math.min(Math.round(sharesProp), position.playerShares);

      if (shares === 0) {
        return 0;
      }

      const gains = stock[0] * shares - STOCK_MARKET_COMMISSION;
      cash += gains;

      position.playerShares -= shares;

      if (position.playerShares == 0) {
        position.playerAvgPx = 0;
      }

      if (canLog('sellStock')) {
        log(`Sold ${shares} shares of ${symbol} at \$${stock[0]} per share. Gained \$${gains}.`);
      }

      return stock[0];
    },

    // TODO once I understand how this stuff works
    // shortStock(sym, shares) => Price | 0` -
    // sellShort(sym, shares) => Price | 0` -
    // placeOrder(sym, shares, price, type, pos) => boolean` -
    // cancelOrder(sym, shares, price, type, pos) => void` -
    // getOrders() => { [Symbol]: Order }` -

    getServerMoneyAvailable: (server) => {
      if (server !== 'home') {
        throw new Error('submission-runner can only return the money available for "home"');
      }

      return cash;
    },

    purchase4SMarketData: () => has4sApi,
    purchase4SMarketDataTixApi: () => has4sApi,
  };

  return ns;
};

const compileReport = (ns, game) => {
  return {
    // The final amount of cash after running the submission.
    startingCash: game.scenario.cash,
    cash: ns.getServerMoneyAvailable('home'),
    ticks: game.state.currentTick,
  };
};

const runGame = async (game) => {
  const ns = createNs(game);
  const submissionLocalState = game.state.submissionLocalState;
  // const totalTicks = game.dataset.ticks.length;
  const totalTicks = 3;

  // Call the submission's `setup` function if it has one.
  if (game.submission.setup) {
    await game.submission.setup(ns, submissionLocalState);
  }

  // Call the submission's `tick` function on every tick in the dataset.
  while (game.state.currentTick < totalTicks) {
    await game.submission.tick(ns, submissionLocalState);
    game.state.currentTick += 1;
    // console.log(ns.getServerMoneyAvailable('home'));
  }

  // Call the submission's `done` function if it has one.
  if (game.submission.done) {
    await game.submission.done(ns, submissionLocalState);
  }

  // TODO: Sell all positions to make it easier to calculate total cash,
  // and also to account for the sale commission.

  console.log('Selling all positions after running the submission');

  for (const symbol of ns.getStockSymbols()) {
    const position = ns.getStockPosition(symbol);

    if (position[0] > 0) {
      ns.sellStock(symbol, position[0]);
    }
  }

  return compileReport(ns, game);
};

const loadSubmission = (fileName) => {
  const fullPath = path.join(__dirname, 'submissions', fileName);
  const content = fs.readFileSync(fullPath).toString();
  const transform = babel.transformSync(content, {
    plugins: ['transform-es2015-modules-commonjs'],
  });
  const transpiled = transform.code;
  const useInstead = (from, to) => {
    return () => console.log(`Please use ${to} instead of ${from}`);
  };
  const context = {
    exports: {},
    console: {
      log: useInstead('console.log', 'ns.tprint'),
      error: useInstead('console.error', 'ns.tprint'),
      info: useInstead('console.info', 'ns.tprint'),
      dir: useInstead('console.dir', 'ns.tprint'),
      table: useInstead('console.table', 'ns.tprint'),
      trace: useInstead('console.trace', 'ns.tprint'),
      warn: useInstead('console.warn', 'ns.tprint'),
    },
  };

  safeEval(transpiled, context);

  if (typeof context.exports.tick !== 'function') {
    throw new Error('Submission does not export a `tick` function');
  }

  return {
    setup: context.exports.setup,
    tick: context.exports.tick,
    done: context.exports.done,
  };
};

const loadDataset = (fileName) => {
  const fullPath = path.join('data/tix-simulations', fileName);
  const content = fs.readFileSync(fullPath).toString();
  return JSON.parse(content);
};

const dataset = '7570ee52-d5a4-4466-9440-fd76ef222872.json';
const submission = 'willurd.js';
const scenario = scenarios.early.new;

const main = () => {
  const game = {
    scenario: {
      has4sApi: false,
      shorting: false,
      limitStop: false,
      ...scenario,
    },
    dataset: loadDataset(dataset),
    submission: loadSubmission(submission),
    state: {
      currentTick: 0,
      // This is state a submission can use to store data between calls.
      submissionLocalState: {},
    },
  };

  runGame(game)
    .then((report) => {
      console.log(`\n\$${report.cash} cash on hand after ${report.ticks} ticks.`);

      if (report.cash < report.startingCash) {
        console.log(`You lost \$${report.startingCash - report.cash}.`);
      } else if (report.cash > report.startingCash) {
        console.log(`You gained \$${report.cash - report.startingCash}.`);
      } else {
        console.log(`You ended up with the same amount of cash as you started with`);
      }
    })
    .catch((e) => console.log(e));
};

main();
