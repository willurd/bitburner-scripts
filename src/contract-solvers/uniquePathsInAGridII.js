export const uniquePathsInAGridII = (grid) => {
  const memo = {};
  const rows = grid.length;
  const columns = grid[0].length;

  for (let r = 1; r <= rows; r++) {
    memo[r] = {};

    for (let c = 1; c <= columns; c++) {
      if (grid[r - 1][c - 1] === 1) {
        memo[r][c] = 0;
      } else if (r === 1 || c === 1) {
        memo[r][c] = 1;
      } else {
        memo[r][c] = memo[r - 1][c] + memo[r][c - 1];
      }
    }
  }

  return memo[rows][columns];
};

export default uniquePathsInAGridII;

/*

0,0,0,
0,1,0,
1,0,0,
= 1

------

0,0,0,
0,0,0,
0,0,1,
= 0

0,0,0,
0,0,0,
0,1,0,
= 3

0,0,0,
0,0,0,
1,0,0,
= 5

------

0,0,0,
0,0,0,
0,0,1,
= 0

0,0,0,
0,0,1,
0,0,0,
= 3

0,0,1,
0,0,0,
0,0,0,
= 5

------

0,0,1,
0,0,0,
0,0,0,
= 5

0,1,0,
0,0,0,
0,0,0,
= 3

1,0,0,
0,0,0,
0,0,0,
= 0

------

0,0,0,
0,0,1,
0,0,0,
= 3

0,0,0,
0,1,0,
0,0,0,
= 2

0,0,0,
1,0,0,
0,0,0,
= 3

*/

/*
Unique Paths in a Grid II
You are attempting to solve a Coding Contract. You have 10 tries remaining, after which the contract will self-destruct.


You are located in the top-left corner of the following grid:

0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,1,0,1,
0,0,0,0,0,0,0,0,0,0,0,1,
0,0,1,0,0,1,1,1,0,0,0,0,
1,0,1,0,0,0,0,0,0,1,0,0,
0,0,0,0,0,0,0,0,0,0,1,0,
0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,1,1,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,1,0,0,0,0,1,0,1,0,
0,0,0,0,0,1,1,1,0,1,0,0,

You are trying reach the bottom-right corner of the grid, but you can only move down or right on each step. Furthermore, there are obstacles on the grid that you cannot move onto. These obstacles are denoted by '1', while empty spaces are denoted by 0.

Determine how many unique paths there are from start to finish.

NOTE: The data returned for this contract is an 2D array of numbers representing the grid.
*/
