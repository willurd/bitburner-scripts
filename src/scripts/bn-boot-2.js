import { WAIT_MS, BN_FILES, log, phase, setStep, isCommandHost, getAdjacentHosts } from 'bn-boot.js';

const getFilesFromHosts = async (ns, hosts, files) => {
  const thisHost = ns.getHostname();

  // Search adjacent hosts for files.
  for (const host of hosts) {
    for (const file of files) {
      if (ns.fileExists(file, host)) {
        log(`Host "${host}" has file "${file}". Downloading.`);
        await ns.scp(file, host, thisHost);
      }
    }
  }
};

export const allFilesExist = (ns, host, files) => {
  for (const file of files) {
    if (ns.fileExists(file, host)) {
      continue;
    }
    return false;
  }
  return true;
};

export async function main(ns) {
  await phase(ns, 2, 'setup', async () => {
    if (isCommandHost(ns)) {
      return;
    }

    const thisHost = ns.getHostname();
    let hasAllFiles = false;

    setStep(ns, 'downloading bn files');

    while (!hasAllFiles) {
      const hosts = getAdjacentHosts(ns);
      await getFilesFromHosts(ns, hosts, BN_FILES);
      hasAllFiles = allFilesExist(ns, thisHost, BN_FILES);

      if (!hasAllFiles) {
        await ns.sleep(WAIT_MS);
      }
    }
  });
}
