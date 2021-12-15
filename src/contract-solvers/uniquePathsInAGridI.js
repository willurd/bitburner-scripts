export const uniquePathsInAGridI = (rows, columns) => {
  const memo = {};

  for (let r = 1; r <= rows; r++) {
    memo[r] = {};

    for (let c = 1; c <= columns; c++) {
      if (r === 1 || c === 1) {
        memo[r][c] = 1;
      } else {
        memo[r][c] = memo[r - 1][c] + memo[r][c - 1];
      }
    }
  }

  return memo[rows][columns];
};

export default uniquePathsInAGridI;
