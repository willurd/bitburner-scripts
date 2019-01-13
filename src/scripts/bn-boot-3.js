import { BN_FLAG_FILE, log, phase, setStep, setOwned, getAdjacentHosts } from './bn-boot.js';
import { hacks } from './constants.js';

export async function main(ns) {
  await phase(ns, 3, 'owning', async () => {
    const thisHost = ns.getHostname();
    const bootScript = 'bn-boot.js';
    const hosts = getAdjacentHosts(ns);
    const owned = [];

    for (const i in hosts) {
      const host = hosts[i];

      setStep(ns, 'checking if host is owned', { i, host });
      if (ns.fileExists(BN_FLAG_FILE, host)) {
        // This host has already been owned.
        log(ns, `Host already owned: ${host}`);
        continue;
      }

      setStep(ns, 'checking if we have root access on host', { i, host });
      while (ns.hasRootAccess(thisHost)) {
        // We already have root access on this host.
        log(ns, `We already have root access on host: ${host}`);
        continue;
      }

      setStep(ns, 'Verifying ability to own host', { i, host });

      const hackingLevel = ns.getHackingLevel();
      const requiredHackingLevel = ns.getServerRequiredHackingLevel();
      const availableHacks = hacks.filter(({ filename }) => ns.fileExists(filename, HOME_HOST));
      const openablePorts = availableHacks.length;
      const requiredPorts = ns.getServerNumPortsRequired();
      const canNuke = hackingLevel >= requiredHackingLevel;
      const canOpenPorts = openablePorts >= requiredPorts;
      const canOwn = canOpenPorts && canNuke;

      if (!canOwn) {
        // We are unable to own this host.
        let message = `Unable to own host: ${host}.`;

        if (!canNuke) {
          message += ` Hacking level too low (${hackingLevel} < ${requiredHackingLevel}).`;
        }

        if (!canOpenPorts) {
          message += ` Not enough openable ports (${openablePorts} < ${requiredPorts}).`;
        }

        log(ns, message);
        continue;
      }

      for (let i = 0; i < requiredPorts; i++) {
        const hack = hacks[i];
        setStep(ns, `Running exe`, { exe: hack.filename, i, host });
        await hack.command(ns, host);
      }

      setStep(ns, 'Nuking', { i, host });
      ns.nuke(host);

      if (!ns.hasRootAccess(host)) {
        setStep(ns, `Unable to own`, { i, host });
        // Something didn't work. This is probably not possible.
        continue;
      }

      owned.push(host);
      await ns.sleep(1000);
    }

    setOwned(ns, owned);
  });
}
