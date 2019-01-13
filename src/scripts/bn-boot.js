import { setDbKeys, updateDb } from './bn-utils.js';
import { forEachHost } from './lib-hosts.js';

/**
 * TODO: This is pretty much an FSM. Write some nice utilities for FSMs.
 */

// This is the host from which the initial boot sequence is run.
export const CNC_HOST = 'home';

// This is the home host.
export const HOME_HOST = 'home';

// If a step fails, wait this long before trying again.
export const WAIT_MS = 10000;

// Files that may need to be references explicitly.
export const BN_FLAG_FILE = 'bn-flag.txt';
export const BN_WEAKEN_FILE = 'bn-weaken.js';
export const BN_HACK_FILE = 'bn-hack.js';
export const BN_GETMONEY_FILE = 'bn-getmoney.js';

// All files that need to be propagated throughout the network.
export const BN_FILES = [
  BN_FLAG_FILE,
  'constants.js',
  'lib-ds.js',
  'lib-hosts.js',
  'api.js',
  'bn-utils.js',
  'bn-boot.js',
  'bn-boot-1.js',
  'bn-boot-2.js',
  'bn-boot-3.js',
  'bn-boot-4.js',
  'bn-boot-5.js',
  'bn-boot-6.js',
  BN_WEAKEN_FILE,
  BN_HACK_FILE,
  BN_GETMONEY_FILE,
];

// The sequence of boot scripts.
export const BOOT_SCRIPT_GRAPH = {
  'bn-boot.js': 'bn-boot-1.js',
  'bn-boot-1.js': 'bn-boot-2.js',
  'bn-boot-2.js': 'bn-boot-3.js',
  'bn-boot-3.js': 'bn-boot-4.js',
  'bn-boot-4.js': 'bn-boot-5.js',
  'bn-boot-5.js': 'bn-boot-6.js',
  'bn-boot-6.js': null, // This is the final boot step.
};

export const log = (ns, message) => {
  const thisHost = ns.getHostname();
  const fullMessage = `[bn:${thisHost}] ${message}`;
  ns.tprint(fullMessage);
  addToLog(ns, fullMessage);
};

export const clearLog = (ns) => {
  return setDbKeys(ns, { log: [] });
};

export const addToLog = (ns, message) => {
  return updateDb(ns, (db) => {
    const log = (db.log || []).slice();
    log.push(message);
    return Object.assign({}, db, { log });
  });
};

export const isCommandHost = (ns) => {
  const thisHost = ns.getHostname();
  return thisHost === CNC_HOST || thisHost === HOME_HOST;
};

export const getAdjacentHosts = (ns) => {
  return ns.scan().filter((h) => h !== CNC_HOST);
};

export const setPhase = (ns, number, name) => {
  return setDbKeys(ns, { phase: `${number} (${name})` });
};

export const setStep = (ns, step, data = {}) => {
  log(ns, `Step: ${step}, ${JSON.stringify(data)}`);
  return setDbKeys(ns, {
    step,
    stepData: data,
  });
};

export const setPropagatedTo = (ns, propagatedTo) => {
  return setDbKeys(ns, { propagatedTo });
};

export const setOwned = (ns, owned) => {
  return setDbKeys(ns, { owned });
};

export const phase = async (ns, number, name, fn) => {
  log(ns, `Entering phase ${number} (${name}).`);
  setPhase(ns, number, name);
  const ret = await fn(ns);
  log(ns, `Phase ${number} (${name}) complete.`);
  setStep(ns, 'done');
  nextBootPhase(ns);
};

export const nextBootPhase = (ns) => {
  const thisScript = ns.getScriptName();
  const nextScript = BOOT_SCRIPT_GRAPH[thisScript];

  if (nextScript) {
    log(ns, `Spawning next script in the boot sequence: ${nextScript}`);
    ns.spawn(nextScript, 1);
  }
};

export async function main(ns) {
  if (ns.args[0] === 'size') {
    for (const script of Object.keys(BOOT_SCRIPT_GRAPH)) {
      ns.tprint(`${script} => ${ns.getScriptRam(script)}`);
    }
  } else {
    clearLog(ns);
    log(ns, 'Initiating botnet boot sequence');
    nextBootPhase(ns);
  }
}
