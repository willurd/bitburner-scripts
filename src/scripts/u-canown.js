/**
 * Prints out all hosts that are ownable, but not currently owned.
 */

import { forEachHost } from './lib-hosts.js';
import { hacks } from './constants.js';

export async function main(ns) {
  // TODO: Accept an optional hostname argument. If given, only check that host.

  let ownableHostCount = 0;

  await forEachHost(ns, async (host, path, adjacent) => {
    if (ns.hasRootAccess(host)) {
      return;
    }

    const hackingLevel = ns.getHackingLevel();
    const requiredHackingLevel = ns.getServerRequiredHackingLevel(host);
    const availableHacks = hacks.filter(({ filename }) => ns.fileExists(filename, 'home'));
    const openPorts = availableHacks.length;
    const requiredOpenPorts = ns.getServerNumPortsRequired(host);

    if (hackingLevel >= requiredHackingLevel && openPorts >= requiredOpenPorts) {
      ns.tprint(
        `Host "${host}" is hackable with a required hacking level of ${requiredHackingLevel}, and required open ports of ${requiredOpenPorts}.`,
      );
      ownableHostCount += 1;
    }
  });

  if (ownableHostCount === 0) {
    ns.tprint('There are no hosts that are currently ownable');
  }
}
