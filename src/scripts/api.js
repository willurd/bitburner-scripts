/**
 * Due to there being a shortage of methods for inter-host communication,
 * this script lets you make a request of a remote server and receive
 * a response to that request.
 *
 * This works by generating a random file name
 */

export async function main(ns) {
  const [responseFileName, action, ...args] = ns.args;

  // ns.tprint(`Response file name: ${responseFileName}`);
  // ns.tprint(`Action: ${action}`);
  // ns.tprint(`Args: ${args.join(', ')}`);

  const response = JSON.stringify({
    responseFileName,
    action,
    args,
  });

  // Once this file is written, the requester should see it shortly after,
  // read it, and then delete it.
  ns.write(responseFileName, response, 'w');
}
