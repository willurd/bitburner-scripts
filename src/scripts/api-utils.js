export const API_SCRIPT = 'api.js';
export const WAIT_MS = 1000;

export const sendRequest = async (ns, host, action, ...args) => {
  const responseFileName = getUniqueFileName(ns, host);
  // TODO: Should we have two response files, for success and error?

  // Execute the request on the remote host.
  while (!(await ns.exec(API_SCRIPT, host, 1, responseFileName, action, ...args))) {
    await ns.sleep(WAIT_MS);
  }

  // Wait until we get our response file.
  while (!ns.fileExists(responseFileName, host)) {
    await ns.sleep(WAIT_MS);
  }

  // Grab the response file from the server.
  ns.scp(responseFileName, host, ns.getHostname());

  // We have our response now.
  const response = ns.read(responseFileName);

  // Remove the temporary response file from our server and the target host.
  ns.rm(responseFileName);
  ns.rm(responseFileName, host);

  try {
    // Convert the response into an object if we can.
    return JSON.parse(response);
  } catch (e) {
    return response;
  }
};

// https://stackoverflow.com/a/2117523/1943957
export function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export const getUniqueFileName = (ns, host) => {
  let fileName;

  do {
    // The probability of generating the same uuid is close to zero,
    // but why take a chance when it's so easy to double check?
    fileName = uuid() + '.txt';
    // Make sure the file doesn't exist on this
  } while (ns.fileExists(fileName) || ns.fileExists(fileName, host));

  return fileName;
};
