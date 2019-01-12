import { loadDb, saveDb, updateDb, setDbKeys } from 'bn-utils.js';
import { forEachHost } from 'lib-hosts.js';
import { hacks } from 'constants.js';

/**
 * TODO: This is pretty much an FSM. Write some nice utilities for FSMs.
 */

let THIS_HOST;
let THIS_SCRIPT;
let CURRENT_PHASE;
let CURRENT_STEP;
const CNC_HOST = 'home';
const HOME_HOST = 'home';
const PHASES = [];
let NEXT_PHASE_NUMBER = 1;
const WAIT_MS = 10000;
const BN_FLAG_FILE = 'bn-flag.txt';
const BN_WEAKEN_FILE = 'bn-weaken.ns';
const BN_HACK_FILE = 'bn-hack.ns';
const BN_GETMONEY_FILE = 'bn-getmoney.ns';
const BN_FILES = [
  BN_FLAG_FILE,
  'constants.js',
  'bn-utils.js',
  'lib-hosts.js',
  'lib-ds.js',
  'bn-boot-1.js',
  'bn-boot-2.js',
  'bn-boot-3.js',
  'bn-boot-4.js',
  'bn-boot-5.js',
  BN_WEAKEN_FILE,
  BN_HACK_FILE,
  BN_GETMONEY_FILE,
];

const BOOT_SCRIPT_GRAPH = {
  'bn-boot-1.js': 'bn-boot-2.js',
  'bn-boot-2.js': 'bn-boot-3.js',
  'bn-boot-3.js': 'bn-boot-4.js',
  'bn-boot-4.js': 'bn-boot-5.js',
};

export const shouldHack = () => THIS_HOST !== CNC_HOST && THIS_HOST !== HOME_HOST;
export const getAdjacentHosts = (ns) => ns.scan().filter((h) => h !== CNC_HOST);

export const nextBootPhase = (ns) => {
  const thisScript = ns.getScriptName();
  const nextScript = BOOT_SCRIPT_GRAPH[thisScript];

  if (!nextScript) {
    log(ns, `Unable to find boot script in sequence after: ${thisScript}`);
  } else {
    ns.spawn(nextScript, 1);
  }
};

export const setPhase = (ns, number, name) => {
  const phase = `${number}~${name}`;
  CURRENT_PHASE = phase;
  setDbKeys(ns, { phase });
};

export const setStep = (ns, step, data = {}) => {
  CURRENT_STEP = { step, data };
  log(ns, `Phase: ${CURRENT_PHASE}, Step: ${step}, ${JSON.stringify(data)}`);
  setDbKeys(ns, {
    step,
    stepData: data,
  });
};

export const setPropagatedTo = (propagatedTo) => setDbKeys({ propagatedTo });
export const log = (ns, message) => ns.tprint(`[bn:${THIS_HOST}] ${message}`);

export const phase = (name, fn) => {
  const number = NEXT_PHASE_NUMBER++;
  PHASES.push(async (ns) => {
    log(ns, `Entering phase ${number} (${name}).`);
    setPhase(ns, number, name);
    const ret = await fn(ns);
    log(ns, `Phase ${number} (${name}) complete.`);
    await ns.sleep(1000);
    return ret;
  });
};

export const getFilesFromHosts = (ns, hosts, files) => {
  // Search adjacent hosts for files.
  for (const host of hosts) {
    for (const file of files) {
      if (ns.fileExists(file, host)) {
        log(`Host "${host}" has file "${file}". Downloading.`);
        ns.scp(file, host, THIS_HOST);
      }
    }
  }
};

export const allFilesExist = (ns, host, files) => {
  for (const file of files) {
    if (ns.fileExists(file, host)) {
      continue;
    }
    return false;
  }
  return true;
};

phase('prepare', async (ns) => {
  if (THIS_HOST === CNC_HOST) {
    setStep(ns, `C&C host only: removing all flags`);

    // When `bn-flag.txt` is on a host that means that host is up-to-date.
    // Here, on the C&C host only, we remove all bn flags from all hosts
    // in the network before we send out an update, so we don't have hosts
    // constantly starting and stopping each-others processes, etc.

    await forEachHost(ns, async (host, path, adjacent) => {
      ns.rm(BN_FLAG_FILE, host);
    });
  }
});

phase('setup', async (ns) => {
  if (!shouldHack()) {
    return;
  }

  let hasAllFiles = false;

  setStep(ns, 'downloading bn files');

  while (!hasAllFiles) {
    const hosts = getAdjacentHosts(ns);
    getFilesFromHosts(ns, hosts, BN_FILES);
    hasAllFiles = allFilesExist(ns, THIS_HOST, BN_FILES);

    if (!hasAllFiles) {
      await ns.sleep(WAIT_MS);
    }
  }
});

phase('propagation', async (ns) => {
  const hosts = getAdjacentHosts(ns);
  const propagatedTo = [];

  for (const i in hosts) {
    const host = hosts[i];

    setStep(ns, 'checking if host is owned', { i, host });
    if (ns.fileExists(BN_FLAG_FILE, host)) {
      // This host has already been owned.
      continue;
    }

    setStep(ns, 'killing all processes', { i, host });
    await ns.killall(host);

    const files = ns.ls(host);
    setStep(ns, 'removing all files', { i, host, files });
    for (const file of files) {
      await ns.rm(file, host);
    }

    setStep(ns, `propagating ${THIS_SCRIPT}`, { i, host });
    while (!(await ns.scp(THIS_SCRIPT, THIS_HOST, host))) {
      await ns.sleep(WAIT_MS);
    }

    setStep(ns, `executing remote ${THIS_SCRIPT}`, { i, host });
    while (!(await ns.exec(THIS_SCRIPT, host, 1))) {
      await ns.sleep(WAIT_MS);
    }

    propagatedTo.push(host);
  }

  setPropagatedTo(propagatedTo);
});

phase('owning', async (ns) => {
  if (!shouldHack()) {
    return;
  }

  // Now that we've propagated this script to all adjacent hosts, it's
  // time to own this box.

  while (!ns.hasRootAccess()) {
    let canOwn = false;

    do {
      setStep(ns, 'Verifying ability to own this host');

      const hackingLevel = ns.getHackingLevel();
      const requiredHackingLevel = ns.getServerRequiredHackingLevel();
      const availableHacks = hacks.filter(({ filename }) => ns.fileExists(filename, HOME_HOST));
      const openablePorts = availableHacks.length;
      const requiredPorts = ns.getServerNumPortsRequired();
      const canNuke = hackingLevel >= requiredHackingLevel;
      const canOpenPorts = openablePorts >= requiredPorts;
      canOwn = canOpenPorts && canNuke;

      if (!canOwn) {
        setDbKeys({
          requiredHackingLevel,
          hackingLevel,
          requiredPorts,
          availablePortHacks,
          canOpenPorts,
          canNuke,
        });

        await ns.sleep(WAIT_MS);
      }
    } while (!canOwn);

    const requiredPorts = ns.getServerNumPortsRequired();
    for (let i = 0; i < requiredPorts; i++) {
      const hack = hacks[i];
      setStep(ns, `Running exe`, { exe: hack.filename });
      await hack.command(ns, THIS_HOST);
    }

    // 5. Own the box.
    setStep(ns, 'Nuking');
    ns.nuke(THIS_HOST);

    if (!ns.hasRootAccess()) {
      setStep(ns, `Unable to own. Trying again in ${WAIT_MS}ms.`);
      // Something didn't work. This is probably not possible.
      await ns.sleep(WAIT_MS);
    }
  }

  setStep(ns, 'Owned! Removing debug data from db.');
  updateDb((db) => {
    const newDb = Object.assign({}, db);
    delete newDb.requiredHackingLevel;
    delete newDb.hackingLevel;
    delete newDb.requiredPorts;
    delete newDb.availablePortHacks;
    delete newDb.canOpenPorts;
    delete newDb.canNuke;
    return newDb;
  });
});

phase('hacking', async (ns) => {
  if (!shouldHack()) {
    return;
  }

  // Perform one successful hack, just in case that does something.

  let attempt = 1;

  while (ns.hack(THIS_HOST) === 0) {
    setStep(ns, 'Attempting hack', { attempt });
    attempt += 1;
    await ns.sleep(WAIT_MS);
  }
});

phase('starting', async (ns) => {
  // TODO: Figure out how security levels and weakening actually work!

  if (shouldHack()) {
    setStep(ns, `Starting ${BN_WEAKEN_FILE}`);

    while (!ns.exec(BN_WEAKEN_FILE)) {
      await ns.sleep(WAIT_MS);
    }

    return;
  }

  setPhase(ns, 0, 'boot-complete');
  log(ns, 'Boot sequence complete');

  if (shouldHack()) {
    // Terminate this script and spawn the bn-hack.js script.
    const serverRam = ns.getServerRam(THIS_HOST)[0];
    const weakenRam = ns.getScriptRam(BN_WEAKEN_FILE, THIS_HOST);
    const hackRam = ns.getScriptRam(BN_HACK_FILE, THIS_HOST);
    const availableHackRam = serverRam - weakenRam;
    const availableHackThreads = Math.floor(availableHackRam / hackRam);

    log(ns, `Spawning ${BN_HACK_FILE} with ${availableHackThreads} threads`);
    ns.spawn(BN_HACK_FILE, availableHackThreads);
  }
});

export async function main(ns) {
  THIS_HOST = ns.getHostname();
  THIS_SCRIPT = ns.getScriptName();

  log(ns, 'Initiating botnet boot sequence');

  for (const phase of PHASES) {
    // The last phase terminates this script.
    await phase(ns);
  }
}
