export function primeFactors(n) {
  const factors = [];
  const half = Math.floor(n / 2);
  let left = n;

  for (let i = 2; i <= half; i++) {
    if (left % i === 0) {
      factors.push(i);
      left /= i;
    }
  }

  return factors;
}

export default function largestPrimeFactor(n) {
  const factors = primeFactors(n);
  return factors[factors.length - 1] || n;
}
