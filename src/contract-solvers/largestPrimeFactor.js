export function primeFactors(n) {
  const factors = [];
  let left = n;

  // No need to check all the way up to n/2, if we get half
  // way to whatever value is left after factoring out all the
  // other prime factors, then what's left is the largest prime
  // factor. This works when n is prime as well.
  for (let i = 2; i <= left / 2; i++) {
    // `i` can be a factor multiple times.
    while (left % i === 0) {
      factors.push(i);
      left /= i;
    }
  }

  factors.push(left);

  return factors;
}

export default function largestPrimeFactor(n) {
  const factors = primeFactors(n);
  return factors[factors.length - 1];
}
