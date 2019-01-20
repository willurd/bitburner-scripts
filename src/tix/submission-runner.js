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

const createNs = (game) => {
  const symbols = game.dataset.symbols;
  const has4sApi = game.scenario.has4sApi;
  let cash = game.scenario.cash;

  // gameState.currentTick

  return {
    print: (message) => console.log(String(message)),
    tprint: (message) => console.log(String(message)),
    getStockSymbols: () => symbols,

    // getStockPrice(sym) => number` -
    // getStockPosition(sym) => [Shares, AvgPrice, SharesShort, AvgPriceShort]` -
    // buyStock(sym, shares) => Price | 0` -
    // sellStock(sym, shares) => Price | 0` -

    // TODO:
    // shortStock(sym, shares) => Price | 0` -
    // sellShort(sym, shares) => Price | 0` -
    // placeOrder(sym, shares, price, type, pos) => boolean` -
    // cancelOrder(sym, shares, price, type, pos) => void` -
    // getOrders() => { [Symbol]: Order }` -
    // getStockVolatility(sym) => number` -
    // getStockForecast(sym) => number` -

    getServerMoneyAvailable: (server) => {
      if (server !== 'home') {
        throw new Error('submission-runner can only return the money available for "home"');
      }

      return cash;
    },

    purchase4SMarketData: () => has4sApi,
    purchase4SMarketDataTixApi: () => has4sApi,
  };
};

const compileReport = (ns, game) => {
  return {
    // The final amount of cash after running the submission.
    cash: ns.getServerMoneyAvailable('home'),
    ticks: game.state.currentTick,
  };
};

const runGame = async (game) => {
  const ns = createNs(game);
  const submissionLocalState = game.state.submissionLocalState;
  // const totalTicks = game.dataset.ticks.length;
  const totalTicks = 10;

  // Call the submission's `setup` function if it has one.
  if (game.submission.setup) {
    await game.submission.setup(ns, submissionLocalState);
  }

  // Call the submission's `tick` function on every tick in the dataset.
  while (game.state.currentTick < totalTicks) {
    await game.submission.tick(ns, submissionLocalState);
    game.state.currentTick += 1;
  }

  // Call the submission's `done` function if it has one.
  if (game.submission.done) {
    await game.submission.done(ns, submissionLocalState);
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
      console.log(`\$${report.cash} cash on hand after ${report.ticks} ticks`);
    })
    .catch((e) => console.log(e));
};

main();
