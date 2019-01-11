/**
 * This script calls static or effectively static TIX API functions
 * and saves their values to `sm-config.txt`, saving precious GBs of
 * RAM in `sm-daemon.js`.
 */

import { loadConfig, saveConfig } from './sm-utils.js';

export async function main(ns) {
  const config = loadConfig(ns);
  config.purchase4SMarketData = ns.purchase4SMarketData();
  config.purchase4SMarketDataTixApi = ns.purchase4SMarketDataTixApi();
  config.symbols = ns.getStockSymbols();

  ns.tprint(`Saving new stock market configuration:\n${JSON.stringify(config, null, 2)}`);
  saveConfig(ns, config);
}
