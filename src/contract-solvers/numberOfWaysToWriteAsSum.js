export default function numberOfWaysToWriteAsSum(n) {
  const memo = Array.from({ length: n }).fill(0);
  memo[0] = 1;

  for (let i = 1; i < n; i++) {
    for (let j = i; j <= n; j++) {
      memo[j] = memo[j] || 0;
      memo[j] += memo[j - i];
    }
  }

  return memo[n];
}
