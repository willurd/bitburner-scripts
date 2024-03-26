import { forEachHost } from './lib-hosts.js';

export async function main(ns) {
  const pattern = new RegExp(ns.args[0], 'ig');

  await forEachHost(ns, async (host) => {
    if (host === 'home') {
      return;
    }

    const files = await ns.ls(host);
    const matchingFiles = files.filter(f => pattern.test(f));

    if (matchingFiles.length > 0) {
      ns.tprint(`Host: ${host}`);

      for (const file of matchingFiles) {
        ns.tprint(`  - ${file}`);
      }
    }
  });
}
