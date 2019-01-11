require('babel-register')({ presets: ['env'] });

const allValidIpsGivenNumber = require('../src/contract-solvers/allValidIpsGivenNumber').default;
const largestPrimeFactor = require('../src/contract-solvers/largestPrimeFactor').default;
const numberOfWaysToWriteAsSum = require('../src/contract-solvers/numberOfWaysToWriteAsSum').default;
const { default: spiralOrderMatrix, mtx } = require('../src/contract-solvers/spiralOrderMatrix');

const solvers = [
  {
    name: 'allValidIpsGivenNumber',
    solve: (num) => {
      const result = allValidIpsGivenNumber(num);
      console.log(`[${result.join(', ')}]`);
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
