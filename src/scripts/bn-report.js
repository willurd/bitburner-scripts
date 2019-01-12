/**
 * This script gives you a full report of the botnet. For each host
 * you get what step of the owning they are in.
 */

import { forEachHost } from 'lib-hosts.js';
import { sendRequest } from 'api-utils.js';

const BN_FLAG_FILE = 'bn-flag.txt';
const BN_DB_FILE = 'bn-db.txt';
const BN_HACK_SCRIPT = 'bn-hack.js';

const printHostReport = async (ns, host) => {
  if (
    host === 'home' ||
    !ns.hasRootAccess(host) ||
    !ns.fileExists(BN_FLAG_FILE, host) ||
    !ns.fileExists(BN_DB_FILE, host)
  ) {
    return;
  }

  const response = await sendRequest(ns, host, 'readFile', BN_DB_FILE);
  const { phase, step, stepData } = JSON.parse(response.result);

  if (phase === '0 (boot-complete)') {
    const scriptIncome = ns.getScriptIncome(BN_HACK_SCRIPT, host);
    ns.tprint(`${host} => ${BN_HACK_SCRIPT} income: ${scriptIncome}`);
  } else {
    ns.tprint(`${host} => Phase: ${phase}, Step: ${step}, Step Data: ${JSON.stringify(stepData)}`);
  }
};

export async function main(ns) {
  const [requestedHost] = ns.args;

  if (requestedHost) {
    if (ns.serverExists(requestedHost)) {
      await printHostReport(ns, requestedHost);
    } else {
      ns.tprint(`Unknown host: ${requestedHost}`);
    }
  } else {
    await forEachHost(ns, async (host, path, adjacent) => {
      await printHostReport(ns, host);
    });
  }
}
