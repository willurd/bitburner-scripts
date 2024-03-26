import { forEachHost } from './lib-hosts.js';

export async function main(ns) {
  await forEachHost(ns, async (host) => {
    ns.tprint(`${host} => ${ns.getServerUsedRam(host)} or ${ns.getServerMaxRam(host)}GB`);
  });
}
