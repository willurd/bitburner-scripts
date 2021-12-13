import { setDbKeys, updateDb } from './bn-utils.js';

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

export const log = async (ns, message) => {
  const thisHost = await ns.getHostname();
  const fullMessage = `[bn:${thisHost}] ${message}`;
  await ns.tprint(fullMessage);
  await addToLog(ns, fullMessage);
};

export const clearLog = async (ns) => {
  return await setDbKeys(ns, { log: [] });
};

export const addToLog = async (ns, message) => {
  return await updateDb(ns, (db) => {
    const log = (db.log || []).slice();
    log.push(message);
    return Object.assign({}, db, { log });
  });
};

export const isCommandHost = async (ns) => {
  const thisHost = await ns.getHostname();
  return thisHost === CNC_HOST || thisHost === HOME_HOST;
};

export const getAdjacentHosts = async (ns) => {
  return await ns.scan().filter((h) => h !== CNC_HOST);
};

export const setPhase = async (ns, number, name) => {
  return await setDbKeys(ns, { phase: `${number} (${name})` });
};

export const setStep = async (ns, step, data = {}) => {
  await log(ns, `Step: ${step}, ${JSON.stringify(data)}`);
  return await setDbKeys(ns, {
    step,
    stepData: data,
  });
};

export const setPropagatedTo = async (ns, propagatedTo) => {
  return await setDbKeys(ns, { propagatedTo });
};

export const setOwned = async (ns, owned) => {
  return await setDbKeys(ns, { owned });
};

export const phase = async (ns, number, name, fn) => {
  await log(ns, `Entering phase ${number} (${name}).`);
  await setPhase(ns, number, name);
  await fn(ns);
  await log(ns, `Phase ${number} (${name}) complete.`);
  await setStep(ns, 'done');
  await nextBootPhase(ns);
};

export const nextBootPhase = async (ns) => {
  const thisScript = await ns.getScriptName();
  const nextScript = BOOT_SCRIPT_GRAPH[thisScript];

  if (nextScript) {
    await log(ns, `Spawning next script in the boot sequence: ${nextScript}`);
    ns.spawn(nextScript, 1);
  }
};

export async function main(ns) {
  if (ns.args[0] === 'size') {
    for (const script of Object.keys(BOOT_SCRIPT_GRAPH)) {
      await ns.tprint(`${script} => ${ns.getScriptRam(script)}`);
    }
  } else {
    await clearLog(ns);
    log(ns, 'Initiating botnet boot sequence');
    await nextBootPhase(ns);
  }
}
