const SCRIPTS = [
  'api.js',
  'api-utils.js',
  'bn-boot.js',
  'bn-boot-1.js',
  'bn-boot-2.js',
  'bn-boot-3.js',
  'bn-boot-4.js',
  'bn-boot-5.js',
  'bn-boot-6.js',
  'bn-deploy.js',
  'bn-flag.txt',
  'bn-getmoney.js',
  'bn-hack.js',
  'bn-own.js',
  'bn-report.js',
  'bn-update-owned.js',
  'bn-utils.js',
  'bn-weaken.js',
  'constants.js',
  'deploy-all.js',
  'dev-deploy.js',
  'dev-server-ram.js',
  'lib-ds.js',
  'lib-hosts.js',
  'lib-inject.js',
  'lib-money.js',
  'sm-daemon.js',
  'sm-deploy.js',
  'sm-update-config.js',
  'sm-utils.js',
  'test-api.js',
  'u-canown.js',
  'u-exec.js',
  'u-go.js',
  'u-hostpath.js',
  'u-nls.js',
  'u-report-money.js',
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

  ns.tprint('All scripts deployed');
}
