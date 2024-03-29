import { forEachHost } from './lib-hosts.js';

export const BN_WEAKEN_SCRIPT = 'bn-weaken.js';
export const BN_HACK_SCRIPT = 'bn-hack.js';

export const BASIC_HACK_SCRIPT = 'basic-hack.js';

const debug = false;

const getAvailableRam = (ns, host) => {
  const maxRam = ns.getServerMaxRam(host);
  const usedRam = ns.getServerUsedRam(host);
  return maxRam - usedRam;
};

const hasScriptsRunning = (ns, host) => {
  const usedRam = ns.getServerUsedRam(host);
  return usedRam > 0;
};

const scpAndRun = async (ns, host, script, threads = 1, ...args) => {
  const thisHost = ns.getHostname();

  if (!(await ns.scp(script, host, thisHost))) {
    ns.tprint(`${host}: Unable to copy ${script}.`);
    return false;
  }

  if (debug) {
    ns.tprint(`${host}: ${script} copied.`);
  }

  const availableRam = getAvailableRam(ns, host);
  const scriptRam = ns.getScriptRam(script);
  const maxThreads = Math.floor(availableRam / scriptRam);
  const minThreads = 1;
  const actualThreads = Math.max(minThreads, Math.min(threads, maxThreads));

  if (debug) {
    ns.tprint(`Available ram: ${availableRam}GB`);
    ns.tprint(`${script} ram: ${scriptRam}GB`);
    ns.tprint(`Available threads for ${script}: ${maxThreads}`);
    ns.tprint(`Executing with ${actualThreads} threads.`);
  }

  if (!(await ns.exec(script, host, actualThreads, ...args))) {
    if (debug) {
      ns.tprint(`${host}: Unable to execute ${script}}`);
    }
    await ns.rm(script, host);
    return false;
  }

  ns.tprint(`${host}: ${script} executed.`);
  return true;
};

export const propagateToHost = async (ns, host) => {
  if (debug) {
    ns.tprint(`${host}: Killing all processes`);
  }
  await ns.killall(host);

  while (hasScriptsRunning(ns, host)) {
    await ns.sleep(1000);
  }

  // // Copy the weaken script.
  // await scpAndRun(ns, host, BN_WEAKEN_SCRIPT);
  // while (!hasScriptsRunning(ns, host)) {
  //   await ns.sleep(1000);
  // }

  // Copy the hack script, but only if the server has money to hack.
  if (ns.getServerMaxMoney(host) > 0) {
    if (debug) {
      ns.tprint(`${host}: Host has money to hack`);
    }
    // await scpAndRun(ns, host, BN_HACK_SCRIPT, Number.MAX_SAFE_INTEGER);
    await scpAndRun(ns, host, BASIC_HACK_SCRIPT, Number.MAX_SAFE_INTEGER);
  } else {
    // TODO: If a server has no money, does `grow` still give hacking XP?
    if (debug) {
      ns.tprint(`${host}: Host has no money to hack`);
    }
  }
};

export async function main(ns) {
  const [host] = ns.args;

  if (host) {
    await propagateToHost(ns, host);
  } else {
    await forEachHost(ns, async (host) => {
      if (host !== 'home') {
        await propagateToHost(ns, host);
      }
    });
  }
}
