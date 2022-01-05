const units = [
  ['Q', 1e18],
  ['q', 1e15],
  ['t', 1e12],
  ['b', 1e9],
  ['m', 1e6],
];

// https://stackoverflow.com/a/14428340
const formatNumberWithCommas = (num) => {
  return num.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
};

export const formatMoney = (money) => {
  for (const [unit, factor] of units) {
    if (money >= factor) {
      const amount = money / factor;
      return '$' + formatNumberWithCommas(amount) + unit;
    }
  }

  return '$' + formatNumberWithCommas(money);
};
