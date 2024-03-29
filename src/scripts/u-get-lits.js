/**
 * "ls" over all hosts in the network.
 */

import { forEachHost } from './lib-hosts.js';

export async function main(ns) {
  await forEachHost(ns, async (host) => {
    if (host === 'home') {
      return;
    }

    const files = await ns.ls(host, '.lit');

    for (const file of files) {
      ns.tprint(`Copying file "${file}" from host "${host}" to home`);

      if (await ns.scp(file, 'home', host)) {
        ns.rm(file, host);
      } else {
        ns.tprint(`Unable to copy file "${file}" from host "${host}" to home`);
      }
    }
  });

  ns.tprint(`All .lit files moved to home`);
}
