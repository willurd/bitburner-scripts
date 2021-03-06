/**
 * Creates a file with an entry for each owned host.
 */

import { forEachHost } from './lib-hosts.js';

export async function main(ns) {
  const ownedHostsFile = 'owned.txt';
  const owned = [];

  // TODO: Use `forEachOwnedHost`.
  await forEachHost(ns, async (host, path, adjacent) => {
    if (ns.hasRootAccess(host)) {
      owned.push(host);
    }
  });

  ns.clear(ownedHostsFile);
  ns.write(ownedHostsFile, owned.join('\n'));
  ns.tprint(`${ownedHostsFile} updated`);
}
