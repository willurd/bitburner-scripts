/**
 * Owns the given host if possible.
 */

import { hacks } from './constants.js';

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
      `${host}: Unable to open the ${requiredOpenPorts} ports required for owning. Could only open ${openPorts}.`,
    );
  }

  for (const { portName, command } of availableHacks) {
    command(ns, host);
    ns.tprint(`${host}: Opened up the ${portName} port.`);
    await ns.sleep(20);
  }

  ns.nuke(host);
  ns.tprint(`${host}: pwned!`);

  // ns.tprint(`${host}: hacking...`);
  // while ((await ns.hack(host)) === 0) {
  //   ns.tprint(`${host}: hack failed`);
  //   ns.sleep(50);
  // }
  // ns.tprint(`${host}: hacked!`);

  // ns.write('owned.txt', `${host}\n`, 'a');
}

export function autocomplete(data, args) {
  return data.servers;
}
