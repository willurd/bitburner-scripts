/**
 * Prints out the path, from `home`, that is required to connect
 * to the given host.
 */

import { getHostPath } from './lib-hosts.js';

export async function main(ns) {
  const [searchHost] = ns.args;

  if (!searchHost) {
    return ns.tprint(`Usage: run hostpath.js &lt;host>`);
  }

  const path = await getHostPath(ns, searchHost);

  if (!path) {
    return ns.tprint(`Unable to find host "${searchHost}"`);
  }

  path.shift();
  ns.tprint(path.join(' > '));
  ns.tprint('home; ' + path.map((h) => `connect ${h}`).join('; ') + ';');
}
