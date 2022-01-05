const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');
const safeEval = require('safe-eval');

const scenarios = {
  early: {
    new: { cash: 1e6 },
    upAndComer: { cash: 20e6, has4sApi: true },
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

  const maxSharesMap = {
    ECP: 24300000,
    MGCP: 17100000,
    BLD: 26100000,
    CLRK: 12200000,
    OMTK: 8600000,
    FSIG: 5300000,
    KGI: 14700000,
    FLCM: 13800000,
    STM: 10700000,
    DCOMM: 18700000,
    HLS: 11400000,
    VITA: 24400000,
    ICRS: 6700000,
    UNV: 7000000,
    AERO: 9300000,
    OMN: 15300000,
    SLRS: 7000000,
    GPH: 10000000,
    NVMD: 7300000,
    WDS: 11700000,
    LXO: 8700000,
    RHOC: 7700000,
    APHE: 5700000,
    SYSC: 5600000,
    CTK: 9800000,
    NTLK: 2800000,
    OMGA: 2200000,
    FNS: 2300000,
    SGC: 2800000,
    JGN: 5800000,
    CTYS: 17400000,
    MDYN: 2700000,
    TITN: 3700000,
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
    stock: {
      getSymbols: () => symbols.slice(),
      getPrice: (symbol) => getStock(symbol)[0],
      getVolatility: (symbol) => getStock(symbol)[1],
      getForecast: (symbol) => getStock(symbol)[2],
      getMaxShares: (symbol) => maxSharesMap[symbol],

      getPosition: (symbol) => {
        if (!(symbol in positions)) {
          throw new Error(`Unknown stock symbol: ${symbol}`);
        }

        const position = positions[symbol];
        return [position.playerShares, position.playerAvgPx, position.playerShortShares, position.playerAvgShortPx];
      },

      // Copied almost directly from: https://github.com/danielyxie/bitburner/blob/435d1836459ddbcac66ba96c46a6688a563bc05c/src/NetscriptFunctions.js#L1540
      buy: (symbol, sharesProp) => {
        const stock = getStock(symbol);
        const position = positions[symbol];

        if (!stock || !position) {
          throw new Error(`Invalid stock symbol passed into buyStock()`);
        }

        if (sharesProp < 0 || isNaN(sharesProp)) {
          log(`ERROR: Invalid 'shares' argument passed to buyStock(): ${sharesProp}`);
          return 0;
        }

        const shares = Math.round(sharesProp);

        if (shares === 0) {
          return 0;
        }

        const totalPrice = stock[0] * shares;
        const cost = totalPrice + STOCK_MARKET_COMMISSION;

        if (cash < cost) {
          log(`Not enough money to purchase ${shares} shares of ${symbol}. Need ${formatMoney(cost)}.`);
          return 0;
        }

        const origTotal = position.playerShares * position.playerAvgPx;
        cash -= cost;
        const newTotal = origTotal + totalPrice;
        position.playerShares += shares;
        position.playerAvgPx = newTotal / position.playerShares;

        if (canLog('buyStock')) {
          log(`Bought ${shares} shares of ${symbol} at ${formatMoney(stock[0])} per share`);
        }

        return stock[0];
      },

      // https://github.com/danielyxie/bitburner/blob/435d1836459ddbcac66ba96c46a6688a563bc05c/src/NetscriptFunctions.js#L1581
      sell: (symbol, sharesProp) => {
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
          log(
            `Sold ${shares} shares of ${symbol} at ${formatMoney(stock[0])} per share. Received ${formatMoney(gains)}.`,
          );
        }

        return stock[0];
      },

      purchase4SMarketData: () => has4sApi,
      purchase4SMarketDataTixApi: () => has4sApi,

      // TODO once I understand how this stuff works
      // shortStock(sym, shares) => Price | 0` -
      // sellShort(sym, shares) => Price | 0` -
      // placeOrder(sym, shares, price, type, pos) => boolean` -
      // cancelOrder(sym, shares, price, type, pos) => void` -
      // getOrders() => { [Symbol]: Order }` -
    },

    getServerMoneyAvailable: (server) => {
      if (server !== 'home') {
        throw new Error('submission-runner can only return the money available for "home"');
      }

      return cash;
    },
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
  const totalTicks = game.dataset.ticks.length - 1;
  // const totalTicks = 3;

  // Call the submission's `setup` function if it has one.
  if (game.submission.setup) {
    console.log('-----[ SETUP ]-----');
    await game.submission.setup(ns, submissionLocalState);
    console.log('');
  }

  // Call the submission's `tick` function on every tick in the dataset.
  console.log('-----[ SIMULATION ]-----');
  console.log('');
  while (game.state.currentTick < totalTicks) {
    const lastLogsLength = ns.getScriptLogs().length;

    await game.submission.tick(ns, submissionLocalState);
    game.state.currentTick += 1;
    const changed = ns.getScriptLogs().length !== lastLogsLength;

    if (changed) {
      console.log(`^^^ Tick ${game.state.currentTick} ^^^`);
      // console.log(ns.getServerMoneyAvailable('home'));
      console.log('');
    }
  }
  console.log('');

  // Call the submission's `done` function if it has one.
  if (game.submission.done) {
    console.log('-----[ DONE ]-----');
    await game.submission.done(ns, submissionLocalState);
    console.log('');
  }

  // TODO: Sell all positions to make it easier to calculate total cash,
  // and also to account for the sale commission.

  console.log('Selling all positions after running the submission');

  for (const symbol of ns.stock.getSymbols()) {
    const position = ns.stock.getPosition(symbol);

    if (position[0] > 0) {
      ns.stock.sell(symbol, position[0]);
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

const loadDatasets = (fileNames) => {
  const loadedDatasets = fileNames.map(loadDataset);
  return loadedDatasets.slice(1).reduce((acc, dataset) => {
    return {
      ...acc,
      ticks: [...acc.ticks, ...dataset.ticks],
    };
  }, loadedDatasets[0]);
};

const datasets = [
  // '7570ee52-d5a4-4466-9440-fd76ef222872.json'
  '8cfc27ad-c282-4c70-9751-5590f20a8ef0.json',
  '5a6fe8b8-1d6e-46bd-aed5-e1060c3c0ab4.json',
  'f92594d5-37b3-4ba9-a2cd-ac13c249a9b3.json',
  '057d90dd-c587-4526-8552-188297ecd102.json',
  'b9c65dc1-75d6-4d46-9c3a-4851d246a7fb.json',
  'd9b42f1a-9c67-4877-b1e0-eb082fae68ca.json',
  'c519aaa2-5d8d-4eef-8f16-44e2e32aa38a.json',
];
const scenario = scenarios.early.upAndComer;

const main = () => {
  const submission = process.argv[2] || 'mine-1.js';
  const game = {
    scenario: {
      has4sApi: false,
      shorting: false,
      limitStop: false,
      ...scenario,
    },
    dataset: loadDatasets(datasets),
    submission: loadSubmission(submission),
    state: {
      currentTick: 0,
      // This is state a submission can use to store data between calls.
      submissionLocalState: {},
    },
  };

  runGame(game)
    .then((report) => {
      console.log(`\n${formatMoney(report.cash)} cash on hand after ${report.ticks} ticks.`);

      if (report.cash < report.startingCash) {
        console.log(`You lost ${formatMoney(report.startingCash - report.cash)}.`);
      } else if (report.cash > report.startingCash) {
        console.log(`You gained ${formatMoney(report.cash - report.startingCash)}.`);
      } else {
        console.log(`You ended up with the same amount of cash as you started with`);
      }
    })
    .catch((e) => console.log(e));
};

main();
