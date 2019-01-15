const SCRIPTS = [
  'constants.js',
  'lib-ds.js',
  'lib-hosts.js',
  'bn-utils.js',
  'api-utils.js',
  'api.js',
  'bn-flag.txt',
  'bn-deploy.js',
  'bn-boot.js',
  'bn-boot-1.js',
  'bn-boot-2.js',
  'bn-boot-3.js',
  'bn-boot-4.js',
  'bn-boot-5.js',
  'bn-boot-6.js',
  'bn-getmoney.js',
  'bn-hack.js',
  'bn-own.js',
  'bn-propagate.js',
  'bn-report.js',
  'bn-update-owned.js',
  'bn-weaken.js',
];

const joinPath = (...parts) => parts.join('/');

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

  ns.tprint('Botnet deployed');
}
