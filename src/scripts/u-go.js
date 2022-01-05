import { cmd } from './lib-inject.js';
import { getHostPath } from './lib-hosts.js';

/** @param {NS} ns */
export async function main(ns) {
  const [host] = ns.args;

  if (!host) {
    return ns.tprint('Usage: run u-go.js &lt;host>');
  }

  const path = await getHostPath(ns, host);

  if (!path) {
    return ns.tprint(`Could not find the path to host "${host}"`);
  }

  path.shift();
  const command = `home; ${path.map((p) => `connect ${p}`).join('; ')};`;
  cmd(ns, command);
}

export function autocomplete(data, args) {
  return data.servers;
}
