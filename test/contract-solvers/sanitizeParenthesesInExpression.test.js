import sanitizeParenthesesInExpression from '../../src/contract-solvers/sanitizeParenthesesInExpression';

const contract = (name, input, expected) => {
  test(name, () => {
    const result = sanitizeParenthesesInExpression(input);
    expect(result).toEqual(expected);
  });
};

describe('sanitizeParenthesesInExpression', () => {
  contract('example-1', '()())()', ['()()()', '(())()']);
  // contract('example-2', '(a)())()', ['(a)()()', '(a())()']);
});
