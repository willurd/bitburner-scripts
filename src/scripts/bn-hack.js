const error = 0.00001;

const formatMoney = (money) => '$' + Math.round(money);

async function createApp(ns, host, maxMoneyPercent, minMoneyPercent) {
  const currentMoney = async () => ns.getServerMoneyAvailable(host);
  const currentMoneyLabel = async () => formatMoney(await currentMoney());
  // Can this value change?
  const maxMoney = async () => ns.getServerMaxMoney(host);
  const maxMoneyLabel = async () => formatMoney(await maxMoney());
  const moneyLabel = async () => `${await currentMoneyLabel()} of ${await maxMoneyLabel()}`;
  const currentMoneyPercent = async () => (await currentMoney()) / (await maxMoney());
  const currentMoneyPercentLabel = async () => `${Math.round((await currentMoneyPercent()) * 1000) / 10}%`;
  const moneyWithPercentLabel = async () => `${await moneyLabel()} (${await currentMoneyPercentLabel()})`;

  async function print(...args) {
    await ns.print(`[${host}] ${args.map((json) => JSON.stringify(json)).join(' ')}`);
  }

  async function report() {
    await print('REPORT:', {
      currentMoney: await currentMoney(),
      maxMoney: await maxMoney(),
      // serverSecurityLevel: await ns.getServerSecurityLevel(host),
      // minSecurityLevel: await ns.getServerMinSecurityLevel(host),
    });
  }

  async function doneGrowing() {
    const moneyPercent = await currentMoneyPercent();
    return maxMoneyPercent - moneyPercent <= error;
  }

  async function grow() {
    await print(`Starting to grow at ${await moneyWithPercentLabel()}.`);

    while (true) {
      if (await doneGrowing()) {
        return await print(`Done growing at ${await moneyWithPercentLabel()}.`);
      }

      await print(`Growing at ${await moneyWithPercentLabel()}.`);
      await ns.grow(host);
      await print(`Grew to ${await moneyWithPercentLabel()}.`);
    }
  }

  async function doneHacking() {
    const moneyPercent = await currentMoneyPercent();
    return moneyPercent - minMoneyPercent <= error;
  }

  async function hack() {
    await print(`Starting to hack at ${await moneyWithPercentLabel()}.`);

    while (true) {
      if (await doneHacking()) {
        return await print(`Done hacking at ${await moneyWithPercentLabel()}.`);
      }

      await print(`Hacking at ${await moneyWithPercentLabel()}.`);
      await ns.hack(host);
      await print(`Hacked to ${await moneyWithPercentLabel()}.`);
    }
  }

  async function run() {
    await print(
      `Running with parameters: ` +
        `host: ${host}, ` +
        `maxMoneyPercent: ${maxMoneyPercent}, ` +
        `minMoneyPercent: ${minMoneyPercent}.`,
    );

    await print(
      `This script will keep server money within the range of ` +
        `\$${(await ns.getServerMaxMoney(host)) * minMoneyPercent} and ` +
        `\$${(await ns.getServerMaxMoney(host)) * maxMoneyPercent}`,
    );

    while (true) {
      await report();
      // Grow until we go above maxMoneyPercent, then hack
      // until we go below minMoneyPercent.
      await grow();
      await hack();
    }
  }

  return {
    run,
  };
}

export async function main(ns) {
  const host = ns.args[0] || (await ns.getHostname());
  const maxMoneyPercent = ns.args[1] || 0.99;
  const minMoneyPercent = ns.args[2] || 0.75;
  const app = await createApp(ns, host, maxMoneyPercent, minMoneyPercent);

  await app.run();
}
