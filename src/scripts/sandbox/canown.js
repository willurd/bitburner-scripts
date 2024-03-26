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

const hacks = [
  { filename: 'BruteSSH.exe', command: async (ns) => await ns.brutessh(host) },
  { filename: 'FTPCrack.exe', command: async (ns) => await ns.ftpcrack(host) },
  { filename: 'relaySMTP.exe', command: async (ns) => await ns.relaysmtp(host) },
  { filename: 'HTTPWorm.exe', command: async (ns) => await ns.httpworm(host) },
  { filename: 'SQLInject.exe', command: async (ns) => await ns.sqlinject(host) },
];

const getOwnableHosts = (ns) => {
  const ownableHosts = [];
  const hosts = getHosts(ns);

  for (const host of hosts) {
    const hackingLevel = ns.getHackingLevel();
    const requiredHackingLevel = ns.getServerRequiredHackingLevel(host);
    const availableHacks = hacks.filter(({ filename }) => ns.fileExists(filename, 'home'));
    const requiredOpenPorts = ns.getServerNumPortsRequired(host);

    if (ns.hasRootAccess(host)) {
      continue;
    }

    if (hackingLevel < requiredHackingLevel) {
      continue;
    }

    if (availableHacks.length < requiredOpenPorts) {
      continue;
    }

    ownableHosts.push(host);
  }

  return ownableHosts;
};

export async function main(ns) {
  const hosts = getOwnableHosts(ns);

  if (hosts.length === 0) {
    return ns.tprint(`There are no ownable hosts`);
  }

  for (const host of hosts) {
    const ram = ns.getServerMaxRam(host);
    const money = ns.getServerMaxMoney(host);
    ns.tprint(`${host} is ownable (${ram}GB RAM, \$${money})`);
  }
}
