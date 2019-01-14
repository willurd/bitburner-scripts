require('babel-register')({ presets: ['env'] });

const allValidIpsGivenNumber = require('../src/contract-solvers/allValidIpsGivenNumber').default;
const largestPrimeFactor = require('../src/contract-solvers/largestPrimeFactor').default;
const numberOfWaysToWriteAsSum = require('../src/contract-solvers/numberOfWaysToWriteAsSum').default;
const { default: spiralOrderMatrix, mtx } = require('../src/contract-solvers/spiralOrderMatrix');
const canJumpToLastIndex = require('../src/contract-solvers/canJumpToLastIndex').default;
const mergeOverlappingIntervals = require('../src/contract-solvers/mergeOverlappingIntervals').default;
const stockMarketProfit = require('../src/contract-solvers/stockMarketProfit').default;

const solvers = [
  {
    name: 'allValidIpsGivenNumber',
    solve: (num) => {
      const result = allValidIpsGivenNumber(num);
      console.log(`[${result.join(', ')}]`);
      console.log(JSON.stringify(result));
    },
  },
  {
    name: 'largestPrimeFactor',
    solve: (num) => {
      const result = largestPrimeFactor(parseInt(num, 10));
      console.log(result);
    },
  },
  {
    name: 'numberOfWaysToWriteAsSum',
    solve: (num) => {
      const result = numberOfWaysToWriteAsSum(parseInt(num, 10));
      console.log(result);
    },
  },
  {
    name: 'spiralOrderMatrix',
    solve: (...matrix) => {
      const result = spiralOrderMatrix(mtx([matrix.join('\n')]));
      console.log(`[${result.join(',')}]`);
    },
  },
  {
    name: 'canJumpToLastIndex',
    solve: (numsString) => {
      const nums = numsString.split(',').map(Number);
      const result = canJumpToLastIndex(nums);
      console.log(result);
    },
  },
  {
    name: 'mergeOverlappingIntervals',
    solve: (intervalsString) => {
      const intervals = JSON.parse(intervalsString);
      const result = mergeOverlappingIntervals(intervals);
      console.log(JSON.stringify(result));
    },
  },
  {
    name: 'stockMarketProfit',
    solve: (numsString, maxTransactionsString) => {
      const nums = numsString.split(',').map(Number);
      const maxTransactions = maxTransactionsString && parseInt(maxTransactionsString, 10);
      const result = stockMarketProfit(nums, maxTransactions);
      console.log(result);
    },
  },
];

const main = () => {
  const problem = process.argv[2];
  const problemRegex = new RegExp(problem, 'i');
  const args = process.argv.slice(3);
  const solver = solvers.find(({ name }) => problemRegex.test(name));

  console.log();
  if (solver) {
    solver.solve(...args);
  } else {
    console.log(`Unknown problem type: ${problem}`);
  }
  console.log();
};

main();
