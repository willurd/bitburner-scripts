import random from 'random';

const makeIpAddress = () => {
  return Array.from({ length: 4 })
    .map(() => random.int(0, 255))
    .join('.');
};

const makeUniqueIpAddress = (existingIpAddresses) => {
  let ipAddress;

  do {
    ipAddress = makeIpAddress();
  } while (ipAddress in existingIpAddresses);

  return ipAddress;
};

global.createNs = (options) => {
  const o = {
    hosts: {},
    ...options,
  };

  const ipAddresses = {};

  const ns = {
    // Returns the hosts adjacent to the given host.
    scan(host, hostnames = true) {
      const hosts = o.hosts[host] || [];

      if (!hostnames) {
        return hosts.map((h) => {
          if (!(h in ipAddresses)) {
            ipAddresses[h] = makeUniqueIpAddress(ipAddresses);
          }
          return ipAddresses[h];
        });
      } else {
        return hosts;
      }
    },

    // Sleeps for the given number of milliseconds.
    async sleep(ms) {
      // TODO: Should this be a noop?
      await new Promise((resolve) => setTimeout(resolve, ms));
    },
  };

  return ns;
};
