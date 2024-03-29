const TargetNodeCount = 9;
const MaxInitialNodeLevel = 80;

export async function main(ns) {
  const currentMoney = ns.getServerMoneyAvailable('home');

  if (currentMoney < 1000000) {
    ns.tprint(`Can't init hacknet with only \$${ns.formatNumber(currentMoney, 2)}`);
    return;
  }

  while (ns.hacknet.numNodes() < TargetNodeCount) {
    ns.hacknet.purchaseNode();
  }

  let i = 0;
  while (ns.hacknet.getLevelUpgradeCost(i, 1) <= ns.getServerMoneyAvailable('home')) {
    if (ns.hacknet.getNodeStats(i).level >= MaxInitialNodeLevel) {
      break;
    }

    ns.hacknet.upgradeLevel(i, 1);
    i = (i + 1) % TargetNodeCount;
  }

  for (let i = 0; i < TargetNodeCount; i++) {
    ns.tprint(`Initialized acknet node ${i} to level ${ns.hacknet.getNodeStats(i).level}`);
  }
}
