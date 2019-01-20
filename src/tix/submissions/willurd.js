console.log(require('fs'));

export async function setup(ns, state) {
  state.symbols = ns.getStockSymbols();
  state.has4sApi = ns.purchase4SMarketDataTixApi();
}

export async function tick(ns, state) {
  ns.tprint(`\$${ns.getServerMoneyAvailable('home')}`);
}

export async function done(ns, state) {
  ns.tprint(`Done`);
}
