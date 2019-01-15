import { loadConfig, saveConfig, updaterScript, commission, buildStock, sellPositions } from './sm-utils.js';
import { formatMoney } from './lib-money.js';
import { getUniqueFileName } from './api-utils.js';

const canUseScript = (ns) => {
  const config = loadConfig(ns);
  let canUse = true;

  if (!config.purchase4SMarketData) {
    canUse = false;
    ns.tprint(`You do not have access to 4S market data. Purchase access and run ${updaterScript}.`);
  }

  if (!config.purchase4SMarketDataTixApi) {
    canUse = false;
    ns.tprint(`You do not have access to the TIX API. Purchase access and run ${updaterScript}.`);
  }

  if (!config.symbols || config.symbols.length === 0) {
    canUse = false;
    ns.tprint(`Unable to find stock symbol data. Please run ${updaterScript}.`);
  }

  return canUse;
};

// TODO: Move to a utils file.
const request = async (ns, path, data = {}) => {
  const responseFileName = getUniqueFileName(ns, ns.getHostname(), 'sm-simulation-data-daemon-');
  const url = `https://localhost:8082/${path}?data=${JSON.stringify(data)}`;
  const ok = await ns.wget(url, responseFileName);
  let response;

  if (ok) {
    const content = ns.read(responseFileName);

    try {
      response = JSON.parse(content);
    } catch (e) {
      response = content;
    }
  }

  if (!ns.rm(responseFileName)) {
    ns.tprint(`Unable to delete API response file: ${responseFileName}`);
  }

  return response;
};

const areStockListsEqual = (a, b) => {
  // This assumes stock object key order will remain the same.
  return JSON.stringify(a) === JSON.stringify(b);
};

const tick = async (ns, state, config) => {
  const stocks = config.symbols.map((symbol) => {
    const stock = buildStock(ns, symbol);
    delete stock.position;
    return stock;
  });

  if (areStockListsEqual(stocks, state.stocks)) {
    return;
  }

  const response = await request(ns, '/simulation/tick', { stocks });
  ns.tprint(`Tick: ${JSON.stringify(response)}`);
};

export async function main(ns) {
  if (!canUseScript(ns)) {
    return;
  }

  // Start a new simulation run.
  const config = loadConfig(ns);
  const response = await request(ns, '/simulation/new', { symbols: config.symbols });
  ns.tprint(`New simulation: ${JSON.stringify(response)}`);

  // Values that are shared across ticks.
  const state = {};

  while (true) {
    const config = loadConfig(ns);
    await tick(ns, state, config);
    await ns.sleep(1000);
  }

  ns.tprint(`Exiting ${ns.getScriptName()}`);
}
