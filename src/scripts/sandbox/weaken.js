export async function main(ns) {
  const host = ns.args[0] || ns.getHostname();

  while (true) {
    await ns.weaken(host);
  }
}
