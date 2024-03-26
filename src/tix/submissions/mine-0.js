export async function setup(ns, state) {
  state.symbols = ns.stock.getSymbols();
  state.has4sApi = ns.stock.purchase4SMarketDataTixApi();
}

export async function tick(ns, state) {
  ns.stock.buyStock(state.symbols[0], 1);
}

export async function done(ns, state) {
  ns.tprint(`Done`);
}
