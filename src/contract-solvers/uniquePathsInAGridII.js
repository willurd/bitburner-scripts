export const uniquePathsInAGridII = (grid) => {
  const memo = {};
  const rows = grid.length;
  const columns = grid[0].length;

  for (let r = rows; r >= 1; r--) {
    memo[r] = {};

    for (let c = columns; c >= 1; c--) {
      const cell = grid[r - 1][c - 1];
      const blocked = cell === 1;

      if (blocked) {
        memo[r][c] = 0;
      } else if (r === rows) {
        memo[r][c] = blocked || memo[r][c + 1] === 0 ? 0 : 1;
      } else if (c === columns) {
        memo[r][c] = blocked || memo[r + 1][c] === 0 ? 0 : 1;
      } else {
        memo[r][c] = memo[r + 1][c] + memo[r][c + 1];
      }
    }
  }

  return memo[1][1];
};

export default uniquePathsInAGridII;
