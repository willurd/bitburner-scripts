const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');

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
    // shortStock(sym, shares) => Price | 0` -
    // sellShort(sym, shares) => Price | 0` -
    // placeOrder(sym, shares, price, type, pos) => boolean` -
    // cancelOrder(sym, shares, price, type, pos) => void` -
    // getOrders() => { [Symbol]: Order }` -
    // getStockVolatility(sym) => number` -
    // getStockForecast(sym) => number` -
    // purchase4SMarketData() => boolean` -
    // purchase4SMarketDataTixApi() => boolean`;

    getServerMoneyAvailable: (server) => {
      if (server !== 'home') {
        throw new Error('submission-runner can only return the money available for "home"');
      }

      return cash;
    },
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
  // const totalTicks = game.dataset.ticks.length;
  const totalTicks = 10;

  while (game.state.currentTick < totalTicks) {
    await game.submissionTickFunction(ns, game.state.submissionLocalState);
    game.state.currentTick += 1;
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
  const context = {
    exports: {},
    window: {},
    global: {},
  };
  context.window.exports = context.exports;
  context.global.exports = context.exports;

  function evalInContext() {
    with (context) {
      eval(transpiled);
    }
  }

  evalInContext.call(context);

  if (typeof context.exports.tick !== 'function') {
    throw new Error('Submission does not export a `tick` function');
  }

  return context.exports.tick;
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
    submissionTickFunction: loadSubmission(submission),
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
