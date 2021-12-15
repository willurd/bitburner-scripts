const getUnmatchedParenthesesCount = (expression) => {
  let unmatchedParenthesesCount = 0;

  for (let i = 0; i < expression.length; i++) {
    if (expression[i] === '(') {
      unmatchedParenthesesCount++;
    } else if (expression[i] === ')') {
      unmatchedParenthesesCount--;
    }
  }

  return unmatchedParenthesesCount;
};

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

const countCharInString = (str, chr) => {
  let count = 0;

  for (let i = 0; i < str.length; i++) {
    if (str[i] === chr) {
      count++;
    }
  }

  return count;
};

const removeLeading = (str, chr, beforeChar) => {
  const ret = [];
  let foundBeforeChar = false;

  for (let i = 0; i < str.length; i++) {
    if (str[i] === beforeChar) {
      foundBeforeChar = true;
    }

    if (foundBeforeChar || str[i] !== chr) {
      ret.push(str[i]);
    }
  }

  return ret.join('');
};

const removeTrailing = (str, chr, afterChar) => {
  const ret = [];
  let foundAfterChar = false;

  for (let i = str.length - 1; i >= 0; i--) {
    if (str[i] === afterChar) {
      foundAfterChar = true;
    }

    if (foundAfterChar || str[i] !== chr) {
      ret.push(str[i]);
    }
  }

  return ret.reverse().join('');
};

/**
 * Ugh, this is so gross.
 */
export const sanitizeParenthesesInExpression = (initialExpression) => {
  let expression = initialExpression;
  expression = removeLeading(expression, ')', '(');
  expression = removeTrailing(expression, '(', ')');

  const unmatchedParenthesesCount = getUnmatchedParenthesesCount(expression);
  const charToRemove = unmatchedParenthesesCount < 0 ? ')' : '(';

  const queue = [{ expr: expression, unmatched: Math.abs(unmatchedParenthesesCount) }];
  const valid = new Set();
  const seen = new Set();

  console.log({ expression, unmatchedParenthesesCount, charToRemove });

  while (queue.length > 0) {
    const { expr, unmatched } = queue.pop();

    if (unmatched === 0) {
      if (hasMatchedParentheses(expr)) {
        // This is balanced.
        valid.add(expr);
      }
      continue;
    } else if (unmatched < 0) {
      continue;
    }

    const count = countCharInString(expr, charToRemove);

    if (count < unmatched) {
      // There aren't enough chars to remove all the ones we need.
      // TODO: Is this a noop?
      continue;
    }

    for (let i = 0; i < expr.length; i++) {
      if (expr[i] === charToRemove) {
        const newExpression = expr.slice(0, i) + expr.slice(i + 1);

        if (!seen.has(newExpression)) {
          seen.add(newExpression);
          queue.push({ expr: newExpression, unmatched: unmatched - 1 });
        }
      }
    }
  }

  return Array.from(valid);
};

export default sanitizeParenthesesInExpression;

/*
Sanitize Parentheses in Expression
You are attempting to solve a Coding Contract. You have 10 tries remaining, after which the contract will self-destruct.


Given the following string:

)a)a)a))(((

remove the minimum number of invalid parentheses in order to validate the string. If there are multiple minimal ways to validate the string, provide all of the possible results. The answer should be provided as an array of strings. If it is impossible to validate the string the result should be an array with only an empty string.

IMPORTANT: The string may contain letters, not just parentheses. Examples:
"()())()" -> [()()(), (())()]
"(a)())()" -> [(a)()(), (a())()]
")(" -> [""]
*/

/*
Sanitize Parentheses in Expression
You are attempting to solve a Coding Contract. You have 10 tries remaining, after which the contract will self-destruct.


Given the following string:

(()a))a((a(()(()

remove the minimum number of invalid parentheses in order to validate the string. If there are multiple minimal ways to validate the string, provide all of the possible results. The answer should be provided as an array of strings. If it is impossible to validate the string the result should be an array with only an empty string.

IMPORTANT: The string may contain letters, not just parentheses. Examples:
"()())()" -> [()()(), (())()]
"(a)())()" -> [(a)()(), (a())()]
")( -> [""]
*/

/*
Sanitize Parentheses in Expression
You are attempting to solve a Coding Contract. You have 10 tries remaining, after which the contract will self-destruct.


Given the following string:

)()a)(aa()(a((a

remove the minimum number of invalid parentheses in order to validate the string. If there are multiple minimal ways to validate the string, provide all of the possible results. The answer should be provided as an array of strings. If it is impossible to validate the string the result should be an array with only an empty string.

IMPORTANT: The string may contain letters, not just parentheses. Examples:
"()())()" -> [()()(), (())()]
"(a)())()" -> [(a)()(), (a())()]
")( -> [""]
*/

/*
Sanitize Parentheses in Expression
You are attempting to solve a Coding Contract. You have 10 tries remaining, after which the contract will self-destruct.


Given the following string:

())aa)()a)a()

remove the minimum number of invalid parentheses in order to validate the string. If there are multiple minimal ways to validate the string, provide all of the possible results. The answer should be provided as an array of strings. If it is impossible to validate the string the result should be an array with only an empty string.

IMPORTANT: The string may contain letters, not just parentheses. Examples:
"()())()" -> [()()(), (())()]
"(a)())()" -> [(a)()(), (a())()]
")( -> [""]
*/

/*
Sanitize Parentheses in Expression
You are attempting to solve a Coding Contract. You have 10 tries remaining, after which the contract will self-destruct.


Given the following string:

()a()()(aa)

remove the minimum number of invalid parentheses in order to validate the string. If there are multiple minimal ways to validate the string, provide all of the possible results. The answer should be provided as an array of strings. If it is impossible to validate the string the result should be an array with only an empty string.

IMPORTANT: The string may contain letters, not just parentheses. Examples:
"()())()" -> [()()(), (())()]
"(a)())()" -> [(a)()(), (a())()]
")( -> [""]
*/

/*
Sanitize Parentheses in Expression
You are attempting to solve a Coding Contract. You have 8 tries remaining, after which the contract will self-destruct.


Given the following string:

(a()a())a())))))

remove the minimum number of invalid parentheses in order to validate the string. If there are multiple minimal ways to validate the string, provide all of the possible results. The answer should be provided as an array of strings. If it is impossible to validate the string the result should be an array with only an empty string.

IMPORTANT: The string may contain letters, not just parentheses. Examples:
"()())()" -> [()()(), (())()]
"(a)())()" -> [(a)()(), (a())()]
")( -> [""]
*/
