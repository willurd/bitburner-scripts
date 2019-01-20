export async function setup(ns, state) {
  state.symbols = ns.getStockSymbols();
  state.has4sApi = ns.purchase4SMarketDataTixApi();
}

export async function tick(ns, state) {
  ns.tprint('\nTick');
  ns.tprint(`\$${ns.getServerMoneyAvailable('home')}`);
  ns.tprint(`Price: ${ns.getStockPrice(state.symbols[0])}`);
  ns.tprint(`Volatility: ${ns.getStockVolatility(state.symbols[0])}`);
  ns.tprint(`Forecast: ${ns.getStockForecast(state.symbols[0])}`);
}

export async function done(ns, state) {
  ns.tprint(`Done`);
}
