const hasMatchedParentheses = (expression) => {
  let unmatchedParenthesesCount = 0;

  for (let i = 0; i < expression.length; i++) {
    if (expression[i] === '(') {
      unmatchedParenthesesCount++;
    } else if (expression[i] === ')') {
      unmatchedParenthesesCount--;
    }

    if (unmatchedParenthesesCount < 0) {
      return false;
    }
  }

  return unmatchedParenthesesCount === 0;
};

export const sanitizeParenthesesInExpression = (initialExpression) => {
  const queue = [initialExpression];
  const valid = new Set();
  const seen = new Set([initialExpression]);
  let longestExpressionLength = -1;

  while (queue.length > 0) {
    const expression = queue.shift();

    if (expression.length === 0) {
      continue;
    }

    if (hasMatchedParentheses(expression)) {
      longestExpressionLength = Math.max(longestExpressionLength, expression.length);
      valid.add(expression);
    } else {
      for (let i = 0; i < expression.length; i++) {
        const expr = expression.slice(0, i) + expression.slice(i + 1);

        if (!seen.has(expr)) {
          seen.add(expr);
          queue.push(expr);
        }
      }
    }
  }

  const results = Array.from(valid);
  return results.filter((r) => r.length === longestExpressionLength);
};

export default sanitizeParenthesesInExpression;
