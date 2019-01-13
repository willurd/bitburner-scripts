// https://stackoverflow.com/a/14428340
export const formatMoney = (money) => {
  return '$' + money.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
};
