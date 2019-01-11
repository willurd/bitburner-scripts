// https://stackoverflow.com/a/14428340
export const formatMoney = (money) => {
  return '$' + money.toString().replace(/\d(?=(\d{3})+\.)/g, '$&,');
};
