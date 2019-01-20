export async function tick(ns, state) {
  ns.tprint(`\$${ns.getServerMoneyAvailable('home')}`);
}
