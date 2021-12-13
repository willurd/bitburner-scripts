/**
 * "ls" over all hosts in the network.
 */

import { forEachHost } from './lib-hosts.js';

const minTriesRemaining = 9;

const unknownSolver = async (ns, host, file) => {
  const contractType = ns.codingcontract.getContractType(file, host);
  ns.tprint(`The contract type "${contractType}" is unknown.`);
};

const SOLVERS = {
  'Find All Valid Math Expressions': unknownSolver,
  'Unique Paths in a Grid I': unknownSolver,
  'Sanitize Parentheses in Expression': unknownSolver,
  'Unique Paths in a Grid II': unknownSolver,
  'Merge Overlapping Intervals': unknownSolver,
};

const getSolver = (ns, host, file) => {
  const contractType = ns.codingcontract.getContractType(file, host);
  return SOLVERS[contractType] || unknownSolver;
};

const forEachContract = async (ns, fn) => {
  const test = /^contract-.*\.cct$/;

  await forEachHost(ns, async (host, path, adjacent) => {
    const files = await ns.ls(host);
    const contractFiles = files.filter((f) => test.test(f));

    for (const file of contractFiles) {
      await fn(host, file);
    }
  });
};

/** @param {NS} ns */
const solveContract = async (ns, host, file) => {
  const contractType = ns.codingcontract.getContractType(file, host);
  const data = ns.codingcontract.getData(file, host);
  // const description = ns.codingcontract.getDescription(file, host);
  ns.tprint(`Attempting to solve "${file}" on ${host}`);

  const solver = getSolver(ns, host, file);
  await solver(ns, host, file);
};

const printContractTypes = async (ns) => {
  const contractTypes = new Set();

  await forEachContract(ns, async (host, file) => {
    const contractType = ns.codingcontract.getContractType(file, host);
    contractTypes.add(contractType);
  });

  ns.tprint(Array.from(contractTypes).join('\n'));
};

const solveAllContracts = async (ns) => {
  await forEachContract(ns, async (host, file) => {
    const numTriesLeft = ns.codingcontract.getNumTriesRemaining(file, host);

    if (numTriesLeft >= minTriesRemaining) {
      await solveContract(ns, host, file);
    }
  });
};

/** @param {NS} ns */
export async function main(ns) {
  const [command] = ns.args;

  if (command === 'print-types') {
    await printContractTypes(ns);
  } else {
    await solveAllContracts(ns);
  }
}
