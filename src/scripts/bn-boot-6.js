import { BN_WEAKEN_FILE, BN_HACK_FILE, log, phase, setPhase, setStep, isCommandHost } from 'bn-boot.js';

export async function main(ns) {
  await phase(ns, 6, 'starting', async () => {
    // TODO: Figure out how security levels and weakening actually work!

    const thisHost = ns.getHostname();

    if (!isCommandHost(ns)) {
      setStep(ns, `Starting ${BN_WEAKEN_FILE}`);

      while (!(await ns.exec(BN_WEAKEN_FILE, thisHost))) {
        await ns.sleep(WAIT_MS);
      }
    }

    setPhase(ns, 0, 'boot-complete');
    log(ns, 'Boot sequence complete');

    if (!isCommandHost(ns)) {
      // Terminate this script and spawn the bn-hack.js script.
      const serverRam = ns.getServerRam(thisHost)[0];
      const weakenRam = ns.getScriptRam(BN_WEAKEN_FILE, thisHost);
      const hackRam = ns.getScriptRam(BN_HACK_FILE, thisHost);
      // Leave this much ram for making API requests.
      const apiRam = 3;
      const availableHackRam = serverRam - weakenRam - apiRam;
      const availableHackThreads = Math.floor(availableHackRam / hackRam);

      log(ns, `Spawning ${BN_HACK_FILE} with ${availableHackThreads} threads`);
      ns.spawn(BN_HACK_FILE, availableHackThreads);
    }
  });
}
