/**
 * Due to there being a shortage of methods for inter-host communication,
 * this script lets you make a request of a remote server and receive
 * a response to that request.
 *
 * How this works:
 *
 *   - Callers invoke `sendRequest`, an async function from `api-utils.js`.
 *   - `sendRequest` generates a unique file name that will be used to
 *     transfer the response data to the caller's host once the request
 *     is completed.
 *   - `sendRequest` invokes `api.js` on the target host, with the name
 *     of the unique response file name, the action to invoke, and the
 *     arguments to that action. (Note that the design of "action" +
 *     "arguments" is arbitary. You can interpret this script's arguments
 *     any way you'd like in order to fulfill requests).
 *   - `api.js` on the remote host starts up, interprets its arguments,
 *     fullfills the request, and then writes its response to the given
 *     unique response file name *on its own server* (the target server).
 *   - Meanwhile, `sendRequest` is in an infinite loop waiting for that
 *     response file to exist on the target server.
 *   - Once the response has been written, `sendRequest` scp's the response
 *     file to the caller's server, reads the contents to memory, and
 *     deletes the response files on both the caller's and target servers.
 *   - The response is then interpreted as JSON, if possible, and returned
 *     to the caller via `const response = await sendRequest(...)`.
 *
 * Problems with this approach:
 *
 *   - It's slow! It starts up a script for each API call, which is slow.
 *     Luckily reading files, writing files, deleting files, and copying
 *     files over the network are all effectively instantaneous operations.
 *   - It's a script, so it takes up RAM, which means you'll need to leave
 *     enough RAM available on target hosts.
 *   - Your api.js file will grow in RAM usage as you add more actions to
 *     it. You'll likely want to start spawning individual scripts to
 *     handle each action so you don't have to leave large chunks of RAM
 *     free on each server.
 *
 * Other methods of remote communication I explored:
 *
 *   - Communicating over ports. Unfortunately you can't connect to a port on
 *     a remote host. This would be super nice though!
 *   - Reading and writing files on remote hosts. Sadly this just isn't
 *     possible. It makes sense why it isn't, but the lack something like
 *     `ns.http` built into the game makes this desirable.
 *   - Reading a remote script's logs. In truth I didn't explore this one too
 *     thoroughly, but, while possible at a glance, it doesn't seem like it
 *     could be too robust.
 */

export async function main(ns) {
  const [responseFileName, action, ...args] = ns.args;
  let result;
  let ok = true;

  switch (action) {
    case 'date':
      // You could spawn() a new script and pass it `responseFileName` if you
      // needed to keep this script light on RAM usage. As long as
      // `responseFileName` gets written, the request will complete.
      result = new Date().toString();
      break;

    default:
      ok = false;
      result = 'An unknown action was requested';
  }

  // This could be any value. I choose JSON as a "universal" format for
  // all of my responses, but you could pass around XML, YAML, or anything
  // else that can be serialized to a string.
  const response = JSON.stringify({
    action,
    ok,
    result,
  });

  // Once this file is written, the requester should see it shortly after,
  // read it, and then delete it.
  ns.write(responseFileName, response, 'w');
}
