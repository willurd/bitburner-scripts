/**
 * Prints out the path, from `home`, that is required to connect
 * to the given host.
 */

import { forEachHost } from 'lib-hosts.js';

export async function main(ns) {
  const [searchHost] = ns.args;

  if (!searchHost) {
    return ns.tprint(`Usage: run hostpath.js &lt;host>`);
  }

  // TODO: Use `await getPath(host)` from `lib-hosts.js`.
  let foundHost = false;

  await forEachHost(ns, async (host, path, adjacent) => {
    if (host === searchHost) {
      const fullPath = path.concat([host]);
      fullPath.shift();
      ns.tprint(fullPath.join(' > '));
      ns.tprint('home; ' + fullPath.map((h) => `connect ${h}`).join('; ') + ';');
      foundHost = true;
      return true;
    }
  });

  if (!foundHost) {
    ns.tprint(`Unable to find host "${searchHost}"`);
  }
}
