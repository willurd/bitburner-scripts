/**
 * "ls" over all hosts in the network.
 */

import { forEachHost } from './lib-hosts.js';

export async function main(ns) {
  const [testString] = ns.args;
  const test = testString && new RegExp(testString);
  let filesFound = false;

  await forEachHost(ns, async (host) => {
    if (host === 'home') {
      return;
    }

    const files = await ns.ls(host);
    const filteredFiles = test ? files.filter((f) => test.test(f)) : files;

    if (filteredFiles.length) {
      filesFound = true;
      ns.tprint(`Host: ${host}`);

      for (const file of filteredFiles) {
        ns.tprint(`  - ${file}`);
      }
    }
  });

  if (filesFound === false) {
    if (testString) {
      ns.tprint(`No files found matching: ${testString}`);
    } else {
      ns.tprint(`No files found`);
    }
  }
}
