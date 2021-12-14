/**
 * "ls" over all hosts in the network.
 */

import { forEachHost } from './lib-hosts.js';
import {
  algorithmicStockTraderI,
  algorithmicStockTraderII,
  algorithmicStockTraderIII,
  algorithmicStockTraderIV,
  arrayJumpingGame,
  findAllValidMathExpressions,
  findLargestPrimeFactor,
  generateIPAddresses,
  mergeOverlappingIntervals,
  spiralizeMatrix,
  subarrayWithMaximumSum,
} from './contract-solutions.js';

/** @param {NS} ns */
const unknownSolver = async (ns, host, file) => {
  // const contractType = ns.codingcontract.getContractType(file, host);
  // ns.tprint(`The contract type "${contractType}" is unknown.`);
};

/** @param {NS} ns */
const unsolvedSolver = async (ns, host, file) => {
  // const contractType = ns.codingcontract.getContractType(file, host);
  // ns.tprint(`The contract type "${contractType}" is unsolved.`);
};

const printContractInformation = (ns, host, file) => {
  const contractType = ns.codingcontract.getContractType(file, host);
  const input = ns.codingcontract.getData(file, host);
  const numTriesLeft = ns.codingcontract.getNumTriesRemaining(file, host);
  const minTriesRemaining = MIN_TRIES_REMAINING[contractType] || defaultMinTriesRemaining;

  ns.tprint(`Host: ${host}`);
  ns.tprint(`File: ${file}`);
  ns.tprint(`Type: ${contractType}`);
  ns.tprint(`Input: ${JSON.stringify(input)}`);
  ns.tprint(`Attempts Left: ${numTriesLeft}`);
  ns.tprint(`Minimum Attempts Left Required: ${minTriesRemaining}`);
};

const makeSolver = (solution, isSimulated) => {
  return async (ns, host, file, force = false) => {
    try {
      printHeading(ns, 'Solving Contract');
      printContractInformation(ns, host, file);

      const input = ns.codingcontract.getData(file, host);
      const answer = solution(input, ns);
      ns.tprint(`Output: ${JSON.stringify(answer)}`);

      if (isSimulated) {
        ns.tprint('SIMULATED');
      } else {
        if (!force && !(await canAttempt(ns, host, file))) {
          ns.tprint(`Cannot attempt contract.`);
          return;
        }

        const result = ns.codingcontract.attempt(answer, file, host, { returnReward: true });

        if (!result?.trim()) {
          ns.tprint(`Attempt failed.`);
        } else {
          ns.tprint(`Attempt succeeded. Reward: ${result}`);
        }
      }
    } catch (e) {
      ns.tprint(`Error: ${e}`);
    }
  };
};

const SOLVERS = {
  'Algorithmic Stock Trader I': makeSolver(algorithmicStockTraderI),
  'Algorithmic Stock Trader II': makeSolver(algorithmicStockTraderII),
  'Algorithmic Stock Trader III': makeSolver(algorithmicStockTraderIII),
  'Algorithmic Stock Trader IV': makeSolver(algorithmicStockTraderIV),
  'Array Jumping Game': makeSolver(arrayJumpingGame),
  // 'Find All Valid Math Expressions': makeSolver(findAllValidMathExpressions),
  'Find All Valid Math Expressions': unsolvedSolver,
  'Find Largest Prime Factor': makeSolver(findLargestPrimeFactor),
  'Generate IP Addresses': makeSolver(generateIPAddresses),
  'Merge Overlapping Intervals': makeSolver(mergeOverlappingIntervals),
  'Minimum Path Sum in a Triangle': makeSolver(minimumPathSumInATriangle, true),
  'Sanitize Parentheses in Expression': unsolvedSolver,
  'Spiralize Matrix': makeSolver(spiralizeMatrix),
  'Subarray with Maximum Sum': makeSolver(subarrayWithMaximumSum),
  'Unique Paths in a Grid I': unsolvedSolver,
  'Unique Paths in a Grid II': unsolvedSolver,
};

const defaultMinTriesRemaining = 9;

const MIN_TRIES_REMAINING = {
  'Array Jumping Game': 1,
};

const printHeading = (ns, heading) => {
  ns.tprint(`-----[ ${heading} ]-----`);
};

const canAttempt = async (ns, host, file) => {
  const contractType = ns.codingcontract.getContractType(file, host);
  const numTriesLeft = ns.codingcontract.getNumTriesRemaining(file, host);
  const minTriesRemaining = MIN_TRIES_REMAINING[contractType] || defaultMinTriesRemaining;
  return numTriesLeft >= minTriesRemaining;
};

/** @param {NS} ns */
const getSolverFromContractType = (contractType) => {
  return SOLVERS[contractType] || unknownSolver;
};

/** @param {NS} ns */
const getSolver = (ns, host, file) => {
  const contractType = ns.codingcontract.getContractType(file, host);
  return getSolverFromContractType(contractType);
};

/** @param {NS} ns */
const forEachContract = async (ns, fn) => {
  await forEachHost(ns, async (host, path, adjacent) => {
    const contractFiles = await ns.ls(host, '.cct');

    for (const file of contractFiles) {
      await fn(host, file);
    }
  });
};

/** @param {NS} ns */
const printContractTypes = async (ns) => {
  const contractTypes = new Set();

  await forEachContract(ns, async (host, file) => {
    const contractType = ns.codingcontract.getContractType(file, host);
    contractTypes.add(contractType);
  });

  ns.tprint(
    Array.from(contractTypes)
      .map((contractType) => {
        const solver = getSolverFromContractType(contractType);
        const label = solver === unknownSolver ? 'unknown' : solver === unsolvedSolver ? 'unsolved' : 'solved';
        return `${contractType} (${label})`;
      })
      .join('\n'),
  );
};

/** @param {NS} ns */
const printInputsByContractType = async (ns) => {
  const typeToInputMap = new Map();

  await forEachContract(ns, async (host, file) => {
    const contractType = ns.codingcontract.getContractType(file, host);
    const data = ns.codingcontract.getData(file, host);

    if (!typeToInputMap.has(contractType)) {
      typeToInputMap.set(contractType, []);
    }

    typeToInputMap.get(contractType).push(data);
  });

  for (const [type, inputArray] of typeToInputMap.entries()) {
    printHeading(ns, type);
    for (const input of inputArray) {
      ns.tprint(JSON.stringify(input));
    }
    ns.tprint(``);
  }
};

/** @param {NS} ns */
const printContract = async (ns, host, file) => {
  const description = ns.codingcontract.getDescription(file, host);
  printContractInformation(ns, host, file);
  ns.tprint('');
  ns.tprint(description);
};

/** @param {NS} ns */
const printContracts = async (ns) => {
  const contractsByType = new Map();

  await forEachContract(ns, async (host, file) => {
    const contractType = ns.codingcontract.getContractType(file, host);

    if (!contractsByType.has(contractType)) {
      contractsByType.set(contractType, []);
    }

    contractsByType.get(contractType).push([host, file]);
  });

  const entries = Array.from(contractsByType.entries()).sort((a, b) => {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  });

  for (const [contractType, contracts] of entries) {
    printHeading(ns, contractType);

    for (const [host, file] of contracts) {
      ns.tprint(`${file} (${host})`);
    }
  }
};

/** @param {NS} ns */
const solveContract = async (ns, host, file, force = false) => {
  const solver = getSolver(ns, host, file);
  return await solver(ns, host, file, force);
};

/** @param {NS} ns */
const solveAllContracts = async (ns) => {
  await forEachContract(ns, async (host, file) => {
    if (await canAttempt(ns, host, file)) {
      await solveContract(ns, host, file);
    }
  });
};

/** @param {NS} ns */
export async function main(ns) {
  const [command, ...rest] = ns.args;

  if (command === 'types') {
    await printContractTypes(ns);
  } else if (command === 'inputs') {
    await printInputsByContractType(ns);
  } else if (command === 'contracts') {
    await printContracts(ns);
  } else if (command === 'contract') {
    const [host, file] = rest;
    await printContract(ns, host, file);
  } else if (command === 'solve-all') {
    await solveAllContracts(ns);
  } else if (command === 'solve') {
    const [host, file, force] = rest;
    await solveContract(ns, host, file, force === 1);
    // } else if (command === 'daemon') {
    //   // TODO
  } else if (command?.trim()) {
    ns.tprint(`Unknown command: ${command?.trim()}`);
  } else {
    ns.tprint('Please enter a command');
  }

  ns.tprint('Done');
}
