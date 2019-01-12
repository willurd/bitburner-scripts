import { WAIT_MS, BN_FILES, BN_FLAG_FILE, phase, setStep, setPropagatedTo, getAdjacentHosts } from 'bn-boot.js';

export async function main(ns) {
  await phase(ns, 3, 'propagation', async () => {
    const thisHost = ns.getHostname();
    const bootScript = 'bn-boot.js';
    const hosts = getAdjacentHosts(ns);
    const propagatedTo = [];

    for (const i in hosts) {
      const host = hosts[i];

      setStep(ns, 'checking if host is owned', { i, host });
      if (ns.fileExists(BN_FLAG_FILE, host)) {
        // This host has already been owned.
        continue;
      }

      setStep(ns, 'killing all remote processes', { i, host });
      await ns.killall(host);

      const files = ns.ls(host);
      setStep(ns, 'removing all remote files', { i, host, files });
      for (const file of files) {
        await ns.rm(file, host);
      }

      setStep(ns, `propagating botnet files`, { i, host });
      for (const bnFile of BN_FILES) {
        while (!(await ns.scp(bnFile, thisHost, host))) {
          await ns.sleep(WAIT_MS);
        }
      }

      setStep(ns, `executing remote ${bootScript}`, { i, host });

      await ns.exec(bootScript, host, 1);
      propagatedTo.push(host);

      await ns.sleep(1000);
    }

    setPropagatedTo(ns, propagatedTo);
  });
}
