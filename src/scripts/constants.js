export const hacks = [
  {
    filename: 'BruteSSH.exe',
    portName: 'SSH',
    command: (ns, host) => ns.brutessh(host),
  },
  {
    filename: 'FTPCrack.exe',
    portName: 'FTP',
    command: (ns, host) => ns.ftpcrack(host),
  },
  {
    filename: 'relaySMTP.exe',
    portName: 'SMTP',
    command: (ns, host) => ns.relaysmtp(host),
  },
  {
    filename: 'HTTPWorm.exe',
    portName: 'HTTP',
    command: (ns, host) => ns.httpworm(host),
  },
  {
    filename: 'SQLInject.exe',
    portName: 'SQL',
    command: (ns, host) => ns.sqlinject(host),
  },
];
