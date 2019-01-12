import { BN_WEAKEN_FILE, BN_HACK_FILE, log, phase, setPhase, isCommandHost } from 'bn-boot.js';

export async function main(ns) {
  await phase(ns, 6, 'starting', async (ns) => {
    // TODO: Figure out how security levels and weakening actually work!

    if (isCommandHost(ns)) {
      setStep(ns, `Starting ${BN_WEAKEN_FILE}`);

      while (!ns.exec(BN_WEAKEN_FILE)) {
        await ns.sleep(WAIT_MS);
      }

      return;
    }

    setPhase(ns, 0, 'boot-complete');
    log(ns, 'Boot sequence complete');

    const thisHost = ns.getHostname();

    if (isCommandHost(ns)) {
      // Terminate this script and spawn the bn-hack.js script.
      const serverRam = ns.getServerRam(thisHost)[0];
      const weakenRam = ns.getScriptRam(BN_WEAKEN_FILE, thisHost);
      const hackRam = ns.getScriptRam(BN_HACK_FILE, thisHost);
      const availableHackRam = serverRam - weakenRam;
      const availableHackThreads = Math.floor(availableHackRam / hackRam);

      log(ns, `Spawning ${BN_HACK_FILE} with ${availableHackThreads} threads`);
      ns.spawn(BN_HACK_FILE, availableHackThreads);
    }
  });
}
