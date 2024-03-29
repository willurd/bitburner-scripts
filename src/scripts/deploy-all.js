const SCRIPTS = [
  'api.js',
  'api-utils.js',
  'basic-hack.js',
  'big-own.js',
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
  'bn-not-ownable.js',
  'bn-own.js',
  'bn-own-ownable.js',
  'bn-propagate.js',
  'bn-report.js',
  'bn-update-owned.js',
  'bn-utils.js',
  'bn-weaken.js',
  'constants.js',
  'contracts.js',
  'contract-solutions.js',
  'deploy-all.js',
  'dev-deploy.js',
  'dev-server-ram.js',
  'empty.js',
  'hacknet.js',
  'hud.js',
  'infiltration.js',
  'lib-ds.js',
  'lib-hosts.js',
  'lib-inject.js',
  'lib-money.js',
  'own-daemon.js',
  'play.js',
  'sm-daemon.js',
  'sm-deploy.js',
  'sm-max-shares.js',
  'sm-sell-all.js',
  'sm-simulation-data-daemon.js',
  'sm-update-config.js',
  'sm-utils.js',
  'test-api.js',
  'u-canown.js',
  'u-exec.js',
  'u-find.js',
  'u-get-lits.js',
  'u-go.js',
  'u-hostpath.js',
  'u-net-worth.js',
  'u-nls.js',
  'u-report-money.js',
];

const EMPTY_SCRIPT = 'empty.js';

const joinPath = (...parts) => parts.join('/');

// TODO: Abstract out the downloading of a list of scripts.
export async function main(ns) {
  const deployEmptyScripts = (ns.args[0] || 0) === 1;
  const scriptServer = ns.args[1] || 'http://localhost:8080';
  const scriptRoot = 'scripts';

  if (deployEmptyScripts) {
    ns.tprint('DEPLOYING EMPTY SCRIPTS');
  }

  for (const script of SCRIPTS) {
    const actualScript = script === 'deploy-all.js' ? script : deployEmptyScripts ? EMPTY_SCRIPT : script;
    const url = joinPath(scriptServer, scriptRoot, actualScript);

    await ns.rm(script);

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
