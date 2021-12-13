/**
 * This script calls static or effectively static TIX API functions
 * and saves their values to `sm-config.txt`, saving precious GBs of
 * RAM in `sm-daemon.js`.
 */

import { loadConfig, saveConfig } from './sm-utils.js';

/**
* @param {NS} ns
*/
export async function main(ns) {
  const config = await loadConfig(ns);
  config.purchase4SMarketData = ns.stock.purchase4SMarketData();
  config.purchase4SMarketDataTixApi = ns.stock.purchase4SMarketDataTixApi();
  config.symbols = ns.stock.getSymbols();

  ns.tprint(`Saving new stock market configuration:\n${JSON.stringify(config, null, 2)}`);
  await saveConfig(ns, config);
}
