export async function main(ns) {
  const [host, file, threads = 1, ...args] = ns.args;

  if (!host || !file) {
    return ns.tprint('Usage: run exec.js &lt;host> &lt;file> [&lt;threads>] [&lt;...args>]');
  }

  await ns.exec(file, host, threads, ...args);
}
