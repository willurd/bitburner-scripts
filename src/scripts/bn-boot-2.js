import { log, phase } from './bn-boot.js';

export async function main(ns) {
  await phase(ns, 2, 'setup', async () => {
    // TODO: This phase is no longer necessary because phase is now
    // responsible for copying all files to hosts is is propagating to.
    await log(ns, 'This phase does nothing.');
  });
}
