require('babel-register')({ presets: ['env'] });

const allValidIpsGivenNumber = require('../src/contract-solvers/allValidIpsGivenNumber').default;
const largestPrimeFactor = require('../src/contract-solvers/largestPrimeFactor').default;
const numberOfWaysToWriteAsSum = require('../src/contract-solvers/numberOfWaysToWriteAsSum').default;
const { default: spiralOrderMatrix, mtx } = require('../src/contract-solvers/spiralOrderMatrix');
const canJumpToLastIndex = require('../src/contract-solvers/canJumpToLastIndex').default;
const mergeOverlappingIntervals = require('../src/contract-solvers/mergeOverlappingIntervals').default;
const stockMarketProfit = require('../src/contract-solvers/stockMarketProfit').default;
const largestSubArraySum = require('../src/contract-solvers/largestSubArraySum').default;

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
  {
    name: 'largestSubArraySum',
    solve: (numsString) => {
      const nums = numsString.split(',').map(Number);
      const result = largestSubArraySum(nums);
      console.log(result);
    },
  },
];

const getSolverByName = (name) => {
  const nameRegex = new RegExp(name, 'i');
  const args = process.argv.slice(3);
  return solvers.find(({ name }) => nameRegex.test(name));
};

const getSolverNames = () => {
  return solvers.map((solver) => solver.name);
};

const usage = () => {
  console.log('yarn solve {problem} [...args]');
  process.exit(1);
};

const main = () => {
  const [problem, ...args] = process.argv.slice(2);

  if (!problem?.trim()) {
    console.error('Please provide a problem to solve. Choose one of:');
    console.log(getSolverNames().join(', '));
    usage();
  }

  const solver = getSolverByName(problem);

  if (!solver) {
    console.error(`Unknown solver "${problem}". Choose one of:`);
    console.log(getSolverNames().join(', '));
    usage();
  }

  console.log();
  if (solver) {
    solver.solve(...args);
  } else {
    console.log(`Unknown problem type: ${problem}`);
  }
  console.log();
};

main();
