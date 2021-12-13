import { WAIT_MS, phase, setStep, isCommandHost } from './bn-boot.js';

export async function main(ns) {
  await phase(ns, 5, 'hacking', async () => {
    if (await isCommandHost(ns)) {
      return;
    }

    // Perform one successful hack, just in case that does something.

    const thisHost = await ns.getHostname();
    let attempt = 1;

    while ((await ns.hack(thisHost)) === 0) {
      await setStep(ns, 'Attempting hack', { attempt });
      attempt += 1;
      await ns.sleep(WAIT_MS);
    }
  });
}
