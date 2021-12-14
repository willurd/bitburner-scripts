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
