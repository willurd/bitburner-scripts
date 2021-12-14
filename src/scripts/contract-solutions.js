export const mergeOverlappingIntervals = (intervals) => {
  const clonedIntervals = intervals.map((i) => i.slice());
  const sortedIntervals = clonedIntervals.sort((a, b) => a[0] - b[0]);

  let mergedIntervals = [];
  let lastInterval;

  for (const interval of sortedIntervals) {
    if (!lastInterval || interval[0] > lastInterval[1]) {
      mergedIntervals.push(interval);
      lastInterval = interval;
    } else if (interval[1] > lastInterval[1]) {
      lastInterval[1] = interval[1];
    }
  }

  return mergedIntervals;
};

export const arrayJumpingGame = (array) => {
  let jumpDistance = 0;

  for (let i = 0; i < array.length; i++) {
    jumpDistance = Math.max(jumpDistance, array[i]);

    if (jumpDistance <= 0) {
      return 0;
    }
  }

  return 1;
};

const stockMarketProfit = (stocks, maxTransactions = stocks.length - 1) => {
  const n = stocks.length;
  const k = maxTransactions;
  const table = Array.from({ length: k + 1 }, () => Array.from({ length: n + 1 }, () => 0));

  // For each number of transactions.
  for (let t = 1; t <= k; t++) {
    // For each day.
    for (let d = 1; d < n; d++) {
      let max = Number.NEGATIVE_INFINITY;

      // For each day up to this day.
      for (let l = 0; l < d; l++) {
        // Take the current max, or the profit from this sale plus the maximum profit
        // of t-1 transactions up until this point.
        max = Math.max(max, stocks[d] - stocks[l] + table[t - 1][l]);
      }

      // But don't go backward (in case this is a negative transaction).
      table[t][d] = Math.max(max, table[t][d - 1]);
    }
  }

  return table[k][n - 1];
};

export const algorithmicStockTraderI = (stocks) => stockMarketProfit(stocks, 1);

export const algorithmicStockTraderII = (stocks) => stockMarketProfit(stocks, stocks.length - 1);

export const algorithmicStockTraderIII = (stocks) => stockMarketProfit(stocks, 2);

export const algorithmicStockTraderIV = ([k, stocks]) => stockMarketProfit(stocks, k);

const getPrimeFactors = (n) => {
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
};

export const findLargestPrimeFactor = (n) => {
  const factors = getPrimeFactors(n);
  return factors[factors.length - 1];
};

// This function is pretty ugly. I wonder if there's a nicer way
// to do this.
export const generateIPAddresses = (num, size = 4) => {
  if (size <= 0) {
    return [];
  } else if (size === 1) {
    if (num.length <= 3 && parseInt(num, 10) <= 255) {
      return [num];
    } else {
      return [];
    }
  }

  let ips = [];

  for (let i = 0; i <= 2 && i < num.length; i++) {
    // Valid IP address include valid IP segments + valid
    // "IP addresses" of a smaller size.
    const segment = num.slice(0, i + 1);

    // A segment can't start with '0' unless the segment is exactly '0'.
    if (segment.length > 1 && segment[0] === '0') {
      continue;
    }

    if (segment.length <= 3 && parseInt(segment, 10) <= 255) {
      ips = ips.concat(generateIPAddresses(num.slice(i + 1), size - 1).map((ip) => `${segment}.${ip}`));
    }
  }

  return ips;
};

export const spiralizeMatrix = (matrix) => {
  const array = [];
  const cols = matrix[0].length;
  const rows = matrix.length;
  let top = 0;
  let right = cols - 1;
  let bottom = rows - 1;
  let left = 0;

  while (left <= right && top <= bottom) {
    // Add top row
    for (let col = left; col <= right; col++) {
      array.push(matrix[top][col]);
    }
    top++;

    // Add right column
    for (let row = top; row <= bottom; row++) {
      array.push(matrix[row][right]);
    }
    right--;

    if (top <= bottom) {
      // Add bottom row
      for (let col = right; col >= left; col--) {
        array.push(matrix[bottom][col]);
      }
      bottom--;
    }

    if (left <= right) {
      // Add left column
      for (let row = bottom; row >= top; row--) {
        array.push(matrix[row][left]);
      }
      left++;
    }
  }

  return array;
};

const subArraySum = (array, start, end) => {
  let sum = 0;

  for (let i = start; i < end; i++) {
    sum += array[i];
  }

  return sum;
};

// TODO: Can the runtime be improved?
export const subarrayWithMaximumSum = (array) => {
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
};

const getMathExpressions = (numberString) => {
  if (!numberString) {
    return [];
  } else if (numberString.length === 1) {
    return [numberString];
  }

  const expressions = [];

  for (let i = 1; i <= numberString.length; i++) {
    if (i > 1 && numberString[0] === '0') {
      break;
    }

    const digit = numberString.slice(0, i);

    for (const subExpression of getMathExpressions(numberString.slice(i))) {
      expressions.push(digit + '+' + subExpression);
      expressions.push(digit + '-' + subExpression);
      expressions.push(digit + '*' + subExpression);
    }
  }

  return expressions;
};

export const findAllValidMathExpressions = ([numberString, targetValue]) => {
  const expressions = getMathExpressions(numberString);
  return expressions.filter((expression) => {
    try {
      return eval(expression) === targetValue;
    } catch (e) {
      return false;
    }
  });
};
