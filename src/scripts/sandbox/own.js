const hacks = [
  { filename: 'BruteSSH.exe', command: async (ns) => await ns.brutessh(host) },
  { filename: 'FTPCrack.exe', command: async (ns) => await ns.ftpcrack(host) },
  { filename: 'relaySMTP.exe', command: async (ns) => await ns.relaysmtp(host) },
  { filename: 'HTTPWorm.exe', command: async (ns) => await ns.httpworm(host) },
  { filename: 'SQLInject.exe', command: async (ns) => await ns.sqlinject(host) },
];

export async function main(ns) {
  const [host] = ns.args;

  if (!host) {
    return ns.tprint(`Usage: run ${ns.getScriptName()} &lt;host>`);
  }

  const hackingLevel = ns.getHackingLevel();
  const requiredHackingLevel = ns.getServerRequiredHackingLevel(host);

  if (hackingLevel < requiredHackingLevel) {
    return ns.tprint(
      `${host} Hacking level ${hackingLevel} lower than required hacking level of ${requiredHackingLevel}`,
    );
  }

  const availableHacks = hacks.filter(({ filename }) => ns.fileExists(filename, 'home'));
  const requiredOpenPorts = ns.getServerNumPortsRequired(host);

  if (availableHacks.length < requiredOpenPorts) {
    return ns.tprint(
      `${host} Not enough hacks (${
        availableHacks.length
      }) available to open the required number of ports (${requiredOpenPorts})`,
    );
  }

  for (const hack of availableHacks) {
    await hack.command(ns);
    ns.tprint(`${host} Ran ${hack.filename}`);
  }

  await ns.nuke(host);
  ns.tprint(`${host}: owned`);
}
