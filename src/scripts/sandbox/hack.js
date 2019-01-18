const noop = () => {};

const runUntil = (fn, predicate, beforeAll = noop, afterAll = noop) => {
  return async (ns, ...args) => {
    await beforeAll(ns, ...args);

    while (!(await predicate(ns, ...args))) {
      await fn(ns, ...args);
    }

    await afterAll(ns, ...args);
  };
};

const getMoneyPercent = (ns, host) => {
  const money = ns.getServerMoneyAvailable(host);
  const maxMoney = ns.getServerMaxMoney(host);
  return money / maxMoney;
};

const grow = runUntil(
  async (ns, host) => await ns.grow(host),
  async (ns, host) => getMoneyPercent(ns, host) >= 0.95,
  async (ns, host) => ns.print(`Starting to grow ${host}`),
  async (ns, host) => ns.print(`Finished grow ${host}`),
);

const hack = runUntil(
  async (ns, host) => await ns.hack(host),
  async (ns, host) => getMoneyPercent(ns, host) <= 0.9,
  async (ns, host) => ns.print(`Starting to hack ${host}`),
  async (ns, host) => ns.print(`Finished hacking ${host}`),
);

export async function main(ns) {
  const host = ns.args[0] || ns.getHostname();

  while (true) {
    await grow(ns, host);
    await hack(ns, host);
  }
}
