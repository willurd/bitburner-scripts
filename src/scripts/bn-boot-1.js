import { phase, nextBootPhase } from 'bn-boot.js';
import { forEachHost } from 'lib-hosts.js';

export async function main(ns) {
  if (THIS_HOST === CNC_HOST) {
    setStep(ns, `C&C host only: removing all flags`);

    // When `bn-flag.txt` is on a host that means that host is up-to-date.
    // Here, on the C&C host only, we remove all bn flags from all hosts
    // in the network before we send out an update, so we don't have hosts
    // constantly starting and stopping each-others processes, etc.

    await forEachHost(ns, async (host, path, adjacent) => {
      ns.rm(BN_FLAG_FILE, host);
    });
  }

  nextBootPhase(ns);
}
