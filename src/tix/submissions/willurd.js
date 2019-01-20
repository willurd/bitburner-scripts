export async function setup(ns, state) {
  state.symbols = ns.getStockSymbols();
  state.has4sApi = ns.purchase4SMarketDataTixApi();
}

export async function tick(ns, state) {
  ns.buyStock(state.symbols[0], 1);
}

export async function done(ns, state) {
  ns.tprint(`Done`);
}
