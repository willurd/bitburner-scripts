/**
 * Owns the given host if possible.
 */

import { hacks } from 'constants.js';

export async function main(ns) {
  const [host] = ns.args;

  if (!host) {
    return ns.tprint('Usage: run bn-own.js &lt;host>');
  }

  ns.tprint(`Attempting to hack host "${host}"`);

  const availableHacks = hacks.filter(({ filename }) => ns.fileExists(filename, 'home'));
  const openPorts = availableHacks.length;
  const requiredOpenPorts = ns.getServerNumPortsRequired(host);

  if (openPorts < requiredOpenPorts) {
    return ns.tprint(
      `Unable to open the ${requiredOpenPorts} ports required for owning. Could only open ${openPorts}.`,
    );
  }

  for (const { portName, command } of availableHacks) {
    command(ns, host);
    ns.tprint(`Opened up the ${portName} port.`);
    await ns.sleep(20);
  }

  ns.nuke(host);
  ns.tprint(`pwned!`);
  ns.write('owned.txt', `${host}\n`, 'a');
}
