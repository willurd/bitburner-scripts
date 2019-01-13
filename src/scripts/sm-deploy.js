const SCRIPTS = [
  'lib-money.js',
  'sm-utils.js',
  'sm-update-config.js',
  'sm-daemon.js',
  'sm-deploy.js',
];

const joinPath = (...parts) => parts.join('/');

// TODO: Abstract out the downloading of a list of scripts.
export async function main(ns) {
  const scriptServer = ns.args[0] || 'http://localhost:8080';
  const scriptRoot = 'scripts';

  for (const script of SCRIPTS) {
    const url = joinPath(scriptServer, scriptRoot, script);

    ns.tprint(`Downloading ${script}`);
    const success = await ns.wget(url, script);

    if (!success) {
      ns.tprint(`Unable to download script from url: ${url}`);
    }

    // Wait a little while to give the RAM calculations some time
    // to finish.
    // await ns.sleep(1000);
  }

  ns.tprint('Stock Market daemon deployed');
}
