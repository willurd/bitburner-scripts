export async function main(ns) {
  // Defines the "target server", which is the server
  // that we're going to hack. In this case, it's "foodnstuff"
  const target = ns.getHostname();
  ns.print(`Starting naive hacking script on ${target}`);

  // Defines how much money a server should have before we hack it
  // In this case, it is set to 75% of the server's max money
  const moneyThreshold = ns.getServerMaxMoney(target) * 0.75;

  // Defines the maximum security level the target server can
  // have. If the target's security level is higher than this,
  // we'll weaken it before doing anything else
  const securityThreshold = ns.getServerMinSecurityLevel(target) + 5;

  if (ns.fileExists('BruteSSH.exe', 'home')) {
    await ns.brutessh(target);
  }

  await ns.nuke(target);

  while (true) {
    if (ns.getServerSecurityLevel(target) > securityThreshold) {
      await ns.weaken(target);
    } else if (ns.getServerMoneyAvailable(target) < moneyThreshold) {
      await ns.grow(target);
    } else {
      await ns.hack(target);
    }
  }
}
