/**
 * TODO: Rename this file to something more descriptive.
 */

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
