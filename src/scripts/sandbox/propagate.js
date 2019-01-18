const hasRunningProcesses = (ns, host) => {
  const usedMemory = ns.getServerRam(host)[1];
  return usedMemory > 0;
};

const scpAndRun = async (ns, host, script, threads) => {
  if (!(await ns.scp(script, ns.getHostname(), host))) {
    ns.tprint(`${host}: Unable to scp ${script}`);
    return false;
  }

  const [maxRam, usedRam] = ns.getServerRam(host);
  const availableRam = maxRam - usedRam;
  const scriptRam = ns.getScriptRam(script, host);
  const maxThreads = Math.floor(availableRam / scriptRam);
  const actualThreads = Math.min(threads, maxThreads);

  if (!(await ns.exec(script, host, actualThreads))) {
    ns.tprint(`${host}: Unable to execute ${script}`);
    return false;
  }

  while (!hasRunningProcesses(ns, host)) {
    await ns.sleep(1000);
  }

  ns.tprint(`${host}: Executed ${script} with ${actualThreads} threads`);

  return true;
};

export async function main(ns) {
  const [host] = ns.args;

  if (!host) {
    return ns.tprint(`Usage: run ${ns.getScriptName()} &lt;host>`);
  }

  // Kill all the currently running processes.
  await ns.killall(host);

  while (hasRunningProcesses(ns, host)) {
    await ns.sleep(1000);
  }

  // SCP and start weaken.js
  if (!(await scpAndRun(ns, host, 'weaken.js', 1))) {
    return;
  }

  // SCP and start hack.js will all available RAM
  await scpAndRun(ns, host, 'hack.js', Number.MAX_VALUE);
}
