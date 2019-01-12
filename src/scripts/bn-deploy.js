const SCRIPTS = [
  'api.js',
  'api-utils.js',
  'bn-boot-1.js',
  'bn-boot-2.js',
  'bn-boot-3.js',
  'bn-boot-4.js',
  'bn-boot-5.js',
  'bn-boot-6.js',
  'bn-boot.js',
  'bn-deploy.js',
  'bn-getmoney.js',
  'bn-hack.js',
  'bn-own.js',
  'bn-report.js',
  'bn-update-owned.js',
  'bn-utils.js',
  'bn-weaken.js',
  'constants.js',
  'lib-ds.js',
  'lib-hosts.js',
];

const joinPath = (...parts) => {
  return parts.join('/').replace('//', '/');
};

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
  }

  ns.tprint('Botnet deployed');
}
