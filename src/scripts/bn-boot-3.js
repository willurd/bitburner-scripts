import { WAIT_MS, BN_FLAG_FILE, phase, setStep, getAdjacentHosts } from 'bn-boot.js';

export async function main(ns) {
  await phase(ns, 3, 'propagation', async (ns) => {
    const thisHost = ns.getHostname();
    const thisScript = ns.getScriptName();
    const hosts = getAdjacentHosts(ns);
    const propagatedTo = [];

    for (const i in hosts) {
      const host = hosts[i];

      setStep(ns, 'checking if host is owned', { i, host });
      if (ns.fileExists(BN_FLAG_FILE, host)) {
        // This host has already been owned.
        continue;
      }

      setStep(ns, 'killing all processes', { i, host });
      await ns.killall(host);

      const files = ns.ls(host);
      setStep(ns, 'removing all files', { i, host, files });
      for (const file of files) {
        await ns.rm(file, host);
      }

      setStep(ns, `propagating ${thisScript}`, { i, host });
      while (!(await ns.scp(thisScript, thisHost, host))) {
        await ns.sleep(WAIT_MS);
      }

      setStep(ns, `executing remote ${thisScript}`, { i, host });
      while (!(await ns.exec(thisScript, host, 1))) {
        await ns.sleep(WAIT_MS);
      }

      propagatedTo.push(host);
    }

    setPropagatedTo(propagatedTo);
  });
}
