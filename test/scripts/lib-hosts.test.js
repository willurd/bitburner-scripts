import { forEachHost } from '../../src/scripts/lib-hosts.js';

describe('forEachHost', () => {
  it('calls the given function for each host in the network', async () => {
    const ns = createNs({
      hosts: {
        home: ['1', '2', '3'],
        '1': ['1.1', '1.2'],
        '1.1': ['1.2', '1.1.1'],
        '1.2': ['1.1', '1.2.1', '2'],
        '2': ['2.2'],
        '2.2': ['2.2.1'],
      },
    });

    const hostsDfs = [];
    const expectedHostsDfs = ['home', '1', '2', '3', '1.1', '1.2', '2.2', '1.1.1', '1.2.1', '2.2.1'];

    await forEachHost(ns, (host, path, adjacent) => hostsDfs.push(host));
    expect(hostsDfs).toEqual(expectedHostsDfs);
  });

  // TODO:
  // it('passes the correct paths from "home" for each host');
});
