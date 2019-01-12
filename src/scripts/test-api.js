/**
 * Example run:
 *
 *   [home ~]> scp api.js foodnstuff
 *   api.js copied over to foodnstuff
 *   [home ~]> run test-api.js
 *   Running script with 1 thread(s) and args: [].
 *   May take a few seconds to start up the process...
 *   test-api.js: Request 1:
 *   test-api.js:
 *   {
 *     "action": "some-action",
 *     "ok": false,
 *     "result": "An unknown action was requested"
 *   }
 *   test-api.js: Request 2:
 *   test-api.js:
 *   {
 *     "action": "date",
 *     "ok": true,
 *     "result": "Fri Jan 11 2019 23:21:29 GMT-0800 (Pacific Standard Time)"
 *   }
 */

import { sendRequest } from 'api-utils.js';

export async function main(ns) {
  let response;

  ns.tprint('Request 1:');
  response = await sendRequest(ns, 'foodnstuff', 'some-action', 'one', 2, 'three');
  ns.tprint(`\n${JSON.stringify(response, null, 2)}`);

  ns.tprint('Request 2:');
  response = await sendRequest(ns, 'foodnstuff', 'date');
  ns.tprint(`\n${JSON.stringify(response, null, 2)}`);
}
