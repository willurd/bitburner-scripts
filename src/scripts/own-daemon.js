import { forEachHost } from './lib-hosts.js';
import { hacks } from './constants.js';

const BN_OWN_SCRIPT = 'bn-own.js';
const BN_PROPAGATE_SCRIPT = 'bn-propagate.js';

const own = async (ns, host) => {
  if (!(await ns.run(BN_OWN_SCRIPT, 1, host))) {
    ns.tprint(`Unable to run ${BN_OWN_SCRIPT} for host: ${host}`);
    return;
  }

  while (ns.isRunning(BN_OWN_SCRIPT, ns.getHostname(), host)) {
    await ns.sleep(10);
  }
};

const propagate = async (ns, host) => {
  if (!(await ns.run(BN_PROPAGATE_SCRIPT, 1, host))) {
    ns.tprint(`Unable to run ${BN_PROPAGATE_SCRIPT} for host: ${host}`);
    return;
  }

  while (ns.isRunning(BN_PROPAGATE_SCRIPT, ns.getHostname(), host)) {
    await ns.sleep(1000);
  }
};

const ownAndPropagate = async (ns, host) => {
  await own(ns, host);
  await propagate(ns, host);
};

const canOwnHost = async (ns, host) => {
  if (ns.hasRootAccess(host)) {
    return null;
  }

  const hackingLevel = ns.getHackingLevel();
  const requiredHackingLevel = ns.getServerRequiredHackingLevel(host);
  const availableHacks = hacks.filter(({ filename }) => ns.fileExists(filename, 'home'));
  const openPorts = availableHacks.length;
  const requiredOpenPorts = ns.getServerNumPortsRequired(host);

  return hackingLevel >= requiredHackingLevel && openPorts >= requiredOpenPorts;
};

const ownOwnableHosts = async (ns) => {
  await forEachHost(ns, async (host) => {
    if (await canOwnHost(ns, host)) {
      await ownAndPropagate(ns, host);
    }
  });
};

/** @param {NS} ns **/
export async function main(ns) {
  while (true) {
    await ownOwnableHosts(ns);
    await ns.sleep(10000);
  }
}
