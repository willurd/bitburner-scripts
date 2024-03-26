import { forEachOwnedHost } from './lib-hosts.js';
import { formatMoney } from './lib-money.js';

export const BASIC_HACK_SCRIPT = 'basic-hack.js';

const getAvailableRam = (ns, host) => {
  const maxRam = ns.getServerMaxRam(host);
  const usedRam = ns.getServerUsedRam(host);
  return maxRam - usedRam;
};

const getHostThreadsForScript = async (ns, host, script) => {
  const availableRam = getAvailableRam(ns, host);
  const scriptRam = ns.getScriptRam(script);
  const maxThreads = Math.floor(availableRam / scriptRam);
  const minThreads = 1;
  return Math.max(minThreads, maxThreads);
};

const bigOwn = async (ns, host) => {
  const thisHost = ns.getHostname();
  const script = BASIC_HACK_SCRIPT;
  const threads = await getHostThreadsForScript(ns, thisHost, script);
  const actualThreads = Math.max(1, Math.floor(threads * 0.99)); // Only use 99% of available threads.

  if (ns.getServerMaxMoney(host) === 0) {
    ns.tprint(`Host "${host}" has no money to hack`);
    return;
  }

  await ns.run(script, actualThreads, host);
};

const getHostToOwn = async (ns) => {
  const values = {};

  await forEachOwnedHost(ns, async (host) => {
    values[host] = {
      available: ns.getServerMoneyAvailable(host),
      max: ns.getServerMaxMoney(host),
    };
  });

  const sorted = Object.entries(values).sort(([_a, a], [_b, b]) => b.max - a.max);
  const filtered = sorted.filter(([_, { max }]) => max > 0);

  if (filtered.length === 0) {
    return null;
  }

  return filtered[0][0];
};

export async function main(ns) {
  const [host] = ns.args;
  const hostToOwn = host || (await getHostToOwn(ns)) || 'sigma-cosmetics';
  ns.tprint(`Owning ${hostToOwn} with max money ${formatMoney(ns.getServerMaxMoney(hostToOwn))}`);
  await bigOwn(ns, hostToOwn);
}
