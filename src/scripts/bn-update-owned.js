/**
 * Creates a file with an entry for each owned host.
 */

import { forEachHost } from './lib-hosts.js';

export async function main(ns) {
  const ownedHostsFile = 'owned.txt';
  const owned = [];

  // TODO: Use `forEachOwnedHost`.
  await forEachHost(ns, async (host, path, adjacent) => {
    if (await ns.hasRootAccess(host)) {
      owned.push(host);
    }
  });

  await ns.clear(ownedHostsFile);
  await ns.write(ownedHostsFile, owned.join('\n'));
  await ns.tprint(`${ownedHostsFile} updated`);
}
