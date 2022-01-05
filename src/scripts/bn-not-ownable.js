class LinkedListNode {
  constructor(value, next) {
    this.value = value;
    this.next = next;
  }
}

export class LinkedList {
  constructor(...values) {
    this.length = 0;
    this.head = undefined;
    this.tail = undefined;

    for (const value of values) {
      this.addBack(value);
    }
  }

  get isEmpty() {
    return this.length === 0;
  }

  toArray() {
    let array = [];

    for (let node = this.head; node; node = node.next) {
      array.push(node.value);
    }

    return array;
  }

  removeFront() {
    if (this.isEmpty) {
      throw new Error(`removeFront() called on empty LinkedList`);
    }

    const node = this.head;

    if (this.head === this.tail) {
      this.head = this.tail = undefined;
    } else {
      this.head = this.head.next;
    }

    this.length -= 1;
    return node.value;
  }

  addFront(value) {
    const node = new LinkedListNode(value, this.head);

    if (!this.head) {
      this.head = this.tail = node;
    } else {
      this.head = node;
    }

    this.length += 1;
    return value;
  }

  addBack(value) {
    const node = new LinkedListNode(value);

    if (!this.head) {
      this.head = this.tail = node;
    } else {
      this.tail.next = node;
      this.tail = node;
    }

    this.length += 1;
    return value;
  }
}

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

export const hacks = [
  {
    filename: 'BruteSSH.exe',
    portName: 'SSH',
    command: async (ns, host) => await ns.brutessh(host),
  },
  {
    filename: 'FTPCrack.exe',
    portName: 'FTP',
    command: async (ns, host) => await ns.ftpcrack(host),
  },
  {
    filename: 'relaySMTP.exe',
    portName: 'SMTP',
    command: async (ns, host) => await ns.relaysmtp(host),
  },
  {
    filename: 'HTTPWorm.exe',
    portName: 'HTTP',
    command: async (ns, host) => await ns.httpworm(host),
  },
  {
    filename: 'SQLInject.exe',
    portName: 'SQL',
    command: async (ns, host) => await ns.sqlinject(host),
  },
];

const BN_OWN_SCRIPT = 'bn-own.js';
// const BN_PROPAGATE_SCRIPT = 'bn-propagate.js';

export async function main(ns) {
  // TODO: Accept an optional hostname argument. If given, only check that host.

  let notOwnableHostCount = 0;

  await forEachHost(ns, async (host, path, adjacent) => {
    if (ns.hasRootAccess(host)) {
      return;
    }

    const hackingLevel = ns.getHackingLevel();
    const requiredHackingLevel = ns.getServerRequiredHackingLevel(host);
    const availableHacks = hacks.filter(({ filename }) => ns.fileExists(filename, 'home'));
    const openPorts = availableHacks.length;
    const requiredOpenPorts = ns.getServerNumPortsRequired(host);
    const hasRequiredHackingLevel = hackingLevel >= requiredHackingLevel;
    const hasRequiredPorts = openPorts >= requiredOpenPorts;
    const isOwnable = hasRequiredHackingLevel && hasRequiredPorts;

    if (!isOwnable) {
      notOwnableHostCount += 1;
      const hackingLevelReport = hasRequiredHackingLevel
        ? ''
        : `Hacking level too low (requires ${requiredHackingLevel}).`;
      const portsReport = hasRequiredPorts ? '' : `Not enough hackable ports (requires ${requiredOpenPorts})`;
      ns.tprint(`${host} is not ownable. ${hackingLevelReport} ${portsReport}`);
    }
  });

  if (notOwnableHostCount === 0) {
    ns.tprint('There are no hosts that are not ownable');
  }
}
