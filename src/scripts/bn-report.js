/**
 * This script gives you a full report of the botnet. For each host
 * you get what step of the owning they are in.
 */

import { forEachHost } from 'lib-hosts.js';

const BN_FLAG_FILE = 'bn-flag.txt';

export async function main(ns) {
  await forEachHost(ns, (host, path, adjacent) => {
    if (!ns.fileExists(BN_FLAG_FILE, host)) {
      return;
    }

    // This is an owned host.
    ns.tprint(`Owned! ${host}`);
  });
}
