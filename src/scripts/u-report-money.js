/**
 * Prints out the monetary data for each owned host.
 *
 * TODO: This should just use `forEachHost` instead of this `owned.txt` file.
 */

const formatMoney = (money) => '$' + Math.round(money);

export async function main(ns) {
  const hosts = ns.read('owned.txt').split('\n');

  const print = async (...args) => {
    await ns.tprint(args.map(JSON.stringify).join(' '));
  };

  const values = {};

  for (const host of hosts) {
    values[host] = {
      available: await ns.getServerMoneyAvailable(host),
      max: await ns.getServerMaxMoney(host),
    };
  }

  const sorted = Object.entries(values).sort(([_a, a], [_b, b]) => b.available / b.max - a.available / a.max);
  const filtered = sorted.filter(([_, { max }]) => max > 0);

  for (const [host, { available, max }] of filtered) {
    const formattedPercent = `${Math.round((available / max) * 1000) / 10}%`;
    const moneyLabel = `${formatMoney(available)} of ${formatMoney(max)} (${formattedPercent})`;
    await print(`${host}: ${moneyLabel}`);
  }
}
