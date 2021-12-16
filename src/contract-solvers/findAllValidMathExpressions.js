const getMathExpressions = (numberString) => {
  if (!numberString) {
    return [];
  } else if (numberString.length === 1) {
    return [numberString];
  }

  const expressions = [];
  const digit = numberString.slice(0, 1);
  const rest = numberString.slice(1);

  for (const subExpression of getMathExpressions(rest)) {
    // This is "concatenation".
    expressions.push(digit + '' + subExpression);
    expressions.push(digit + '+' + subExpression);
    expressions.push(digit + '-' + subExpression);
    expressions.push(digit + '*' + subExpression);
  }

  return expressions;
};

export const findAllValidMathExpressions = (numberString, targetValue) => {
  const expressions = getMathExpressions(numberString);
  return expressions.filter((expression) => {
    try {
      return eval(expression) === targetValue;
    } catch (e) {
      return false;
    }
  });
};

export default findAllValidMathExpressions;
