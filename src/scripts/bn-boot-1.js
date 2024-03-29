import { log, BN_FLAG_FILE, CNC_HOST, phase, setStep } from './bn-boot.js';
import { forEachHost } from './lib-hosts.js';

export async function main(ns) {
  await phase(ns, 1, 'prepare', async () => {
    const thisHost = await ns.getHostname();

    if (thisHost === CNC_HOST) {
      await setStep(ns, `C&C host only: removing all flags`);

      // When `bn-flag.txt` is on a host that means that host is up-to-date.
      // Here, on the C&C host only, we remove all bn flags from all hosts
      // in the network before we send out an update, so we don't have hosts
      // constantly starting and stopping each-others processes, etc.

      await forEachHost(ns, async (host, path, adjacent) => {
        if (host === CNC_HOST) {
          return;
        }

        if (ns.fileExists(BN_FLAG_FILE, host)) {
          await log(ns, `Removing ${BN_FLAG_FILE} from host: ${host}`);
          await ns.rm(BN_FLAG_FILE, host);
        }
      });
    }
  });
}
