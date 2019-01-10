// TODO: Can the runtime be improved?
export default function largestSubArraySum(array) {
  const len = array.length;
  let largestSum = Number.NEGATIVE_INFINITY;

  for (let i = 0; i < len; i++) {
    for (let j = i + 1; j <= len; j++) {
      const sum = subArraySum(array, i, j);

      if (sum > largestSum) {
        largestSum = sum;
      }
    }
  }

  return largestSum;
}

function subArraySum(array, start, end) {
  let sum = 0;

  for (let i = start; i < end; i++) {
    sum += array[i];
  }

  return sum;
}
