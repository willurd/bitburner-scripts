import { LinkedList } from './lib-ds.js';

export const forEachHost = async (ns, fn, sleepMs = 5) => {
  const seenHosts = new Set();
  const hostQueue = new LinkedList();

  const addHost = (host, path = []) => {
    hostQueue.addBack(path.concat([host]));
    seenHosts.add(host);
  };

  addHost('home');

  while (!hostQueue.isEmpty) {
    const hostPath = hostQueue.removeFront();
    const host = hostPath[hostPath.length - 1];
    const adjacent = ns.scan(host, true);
    const stop = await fn(host, hostPath.slice(0, hostPath.length - 1), adjacent);

    if (stop === true) {
      return;
    }

    for (const adjacentHost of adjacent) {
      if (!seenHosts.has(adjacentHost)) {
        addHost(adjacentHost, hostPath);
      }
    }

    if (sleepMs) {
      await ns.sleep(sleepMs);
    }
  }
};

export const getHostPath = async (ns, host) => {
  let hostPath;

  await forEachHost(ns, async (host, path, adjacent) => {
    if (host === searchHost) {
      hostPath = path.concat([host]);
      return true;
    }
  });

  return hostPath;
};

// TODO: Add `forEachOwnedHost`
