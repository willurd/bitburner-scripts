import { BN_FLAG_FILE, log, phase, setStep, setOwned, getAdjacentHosts } from './bn-boot.js';
import { hacks } from './constants.js';

export async function main(ns) {
  await phase(ns, 3, 'owning', async () => {
    await log(ns, 'Started phase 3');
    const thisHost = await ns.getHostname();
    await log(ns, `Host name: ${thisHost}`);
    const hosts = await getAdjacentHosts(ns);
    await log(ns, `Hosts: ${hosts.join(', ')}`);
    const owned = [];

    for (const i in hosts) {
      const host = hosts[i];

      await setStep(ns, 'checking if host is owned', { i, host });

      if (await ns.fileExists(BN_FLAG_FILE, host)) {
        // This host has already been owned.
        await log(ns, `Host already owned: ${host}`);
        continue;
      }

      await setStep(ns, 'checking if we have root access on host', { i, host });

      while (await ns.hasRootAccess(thisHost)) {
        // We already have root access on this host.
        await log(ns, `We already have root access on host: ${host}`);
        continue;
      }

      await setStep(ns, 'Verifying ability to own host', { i, host });

      const hackingLevel = await ns.getHackingLevel();
      const requiredHackingLevel = await ns.getServerRequiredHackingLevel();
      // TODO: await
      const availableHacks = hacks.filter(({ filename }) => ns.fileExists(filename, HOME_HOST));
      const openablePorts = availableHacks.length;
      const requiredPorts = await ns.getServerNumPortsRequired();
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

        await log(ns, message);
        continue;
      }

      for (let i = 0; i < requiredPorts; i++) {
        const hack = hacks[i];
        await setStep(ns, `Running exe`, { exe: hack.filename, i, host });
        await hack.command(ns, host);
      }

      await setStep(ns, 'Nuking', { i, host });
      await ns.nuke(host);

      if (!(await ns.hasRootAccess(host))) {
        await setStep(ns, `Unable to own`, { i, host });
        // Something didn't work. This is probably not possible.
        continue;
      }

      owned.push(host);
      await ns.sleep(1000);
    }

    await setOwned(ns, owned);
  });
}
