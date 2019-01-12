import { phase, setStep, isCommandHost } from 'bn-boot.js';
import { updateDb, setDbKeys } from 'bn-utils.js';
import { hacks } from 'constants.js';

export async function main(ns) {
  if (ns.args[0] === 'size') {
    const script = ns.getScriptName();
    return ns.tprint(`${script} => ${ns.getScriptRam(script)}`);
  }

  await phase(ns, 4, 'owning', async () => {
    if (isCommandHost(ns)) {
      return;
    }

    // Now that we've propagated this script to all adjacent hosts, it's
    // time to own this box.

    const thisHost = ns.getHostname();

    while (!ns.hasRootAccess()) {
      let canOwn = false;

      do {
        setStep(ns, 'Verifying ability to own this host');

        const hackingLevel = ns.getHackingLevel();
        const requiredHackingLevel = ns.getServerRequiredHackingLevel();
        const availableHacks = hacks.filter(({ filename }) => ns.fileExists(filename, HOME_HOST));
        const openablePorts = availableHacks.length;
        const requiredPorts = ns.getServerNumPortsRequired();
        const canNuke = hackingLevel >= requiredHackingLevel;
        const canOpenPorts = openablePorts >= requiredPorts;
        canOwn = canOpenPorts && canNuke;

        if (!canOwn) {
          setDbKeys({
            requiredHackingLevel,
            hackingLevel,
            requiredPorts,
            availablePortHacks,
            canOpenPorts,
            canNuke,
          });

          await ns.sleep(WAIT_MS);
        }
      } while (!canOwn);

      const requiredPorts = ns.getServerNumPortsRequired();
      for (let i = 0; i < requiredPorts; i++) {
        const hack = hacks[i];
        setStep(ns, `Running exe`, { exe: hack.filename });
        await hack.command(ns, thisHost);
      }

      // 5. Own the box.
      setStep(ns, 'Nuking');
      ns.nuke(thisHost);

      if (!ns.hasRootAccess()) {
        setStep(ns, `Unable to own. Trying again in ${WAIT_MS}ms.`);
        // Something didn't work. This is probably not possible.
        await ns.sleep(WAIT_MS);
      }
    }

    setStep(ns, 'Owned! Removing debug data from db.');
    updateDb((db) => {
      const newDb = Object.assign({}, db);
      delete newDb.requiredHackingLevel;
      delete newDb.hackingLevel;
      delete newDb.requiredPorts;
      delete newDb.availablePortHacks;
      delete newDb.canOpenPorts;
      delete newDb.canNuke;
      return newDb;
    });
  });
}
