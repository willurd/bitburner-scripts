/**
 * A *very basic* script for getting money from a host. Can be throttled
 * if you don't want to get money too quickly.
 */

export async function main(ns) {
  const host = ns.args[0] || ns.getHostname();
  const sleepMs = parseInt(ns.args[1] || '5000', 10);

  while (true) {
    await ns.hack(host);

    if (sleepMs) {
      await ns.sleep(sleepMs);
    }
  }
}
