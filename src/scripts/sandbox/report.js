const getHosts = (ns) => {
  const hosts = [];
  const seen = new Set();
  const queue = ['home'];

  while (queue.length > 0) {
    const host = queue.shift();
    const adjacent = ns.scan(host);

    hosts.push(host);

    for (const adjacentHost of adjacent) {
      if (!seen.has(adjacentHost)) {
        seen.add(adjacentHost);
        queue.push(adjacentHost);
      }
    }
  }

  return hosts;
};

export async function main(ns) {
  const hosts = getHosts(ns);
  const reportHosts = [];

  for (const host of hosts) {
    if (!ns.hasRootAccess(host)) {
      continue;
    }

    const maxMoney = ns.getServerMaxMoney(host);

    if (maxMoney === 0) {
      continue;
    }

    const money = ns.getServerMoneyAvailable(host);
    const moneyPercent = ((money / maxMoney) * 100).toFixed(2);

    reportHosts.push({
      host,
      money,
      maxMoney,
      moneyPercent,
    });
  }

  if (reportHosts.length === 0) {
    return ns.tprint('Nothing to report');
  }

  reportHosts.sort((a, b) => b.moneyPercent - a.moneyPercent);

  for (const { host, money, maxMoney, moneyPercent } of reportHosts) {
    ns.tprint(`${host} has \$${money.toFixed(2)} of \$${maxMoney.toFixed(2)} (${moneyPercent}%)`);
  }
}
