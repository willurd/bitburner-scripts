/**
 * Prints out the monetary data for each owned host.
 *
 * TODO: This should just use `forEachHost` instead of this `owned.txt` file.
 */

import { formatMoney } from './lib-money.js';
import { forEachOwnedHost } from './lib-hosts.js';

export async function main(ns) {
  const values = {};

  await forEachOwnedHost(ns, async (host, path, adjacent) => {
    values[host] = {
      available: ns.getServerMoneyAvailable(host),
      max: ns.getServerMaxMoney(host),
    };
  });

  const sorted = Object.entries(values).sort(([_a, a], [_b, b]) => b.available / b.max - a.available / a.max);
  const filtered = sorted.filter(([_, { max }]) => max > 0);

  for (const [host, { available, max }] of filtered) {
    const formattedPercent = `${Math.round((available / max) * 1000) / 10}%`;
    const moneyLabel = `${formatMoney(available)} of ${formatMoney(max)} (${formattedPercent})`;
    ns.tprint(`${host}: ${moneyLabel}`);
  }
}
