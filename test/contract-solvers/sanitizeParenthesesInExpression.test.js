import sanitizeParenthesesInExpression from '../../src/contract-solvers/sanitizeParenthesesInExpression';

const contract = (name, input, expected) => {
  test(name, () => {
    const result = sanitizeParenthesesInExpression(input);
    expect(result).toEqual(expected);
  });
};

describe('sanitizeParenthesesInExpression', () => {
  contract('example-1', '()())()', ['(())()', '()()()']);
  contract('example-2', '(a)())()', ['(a())()', '(a)()()']);
  contract('contract-925545', '()((a)())', ['()((a)())']);

  contract('contract-685696', '(a()a())a())))))', [
    '(a(a(a())))',
    '(a(a()a()))',
    '(a(a())a())',
    '(a()a(a()))',
    '(a()a()a())',
    '(a()a())a()',
  ]);

  contract('contract-345886', '(()a))a((a(()(()', [
    '((a))aa()()',
    '((a))aa(())',
    '((a))a(a)()',
    '((a))a(a())',
    '((a))a((a))',
    '(()a)aa()()',
    '(()a)aa(())',
    '(()a)a(a)()',
    '(()a)a(a())',
    '(()a)a((a))',
  ]);

  contract('contract-710159', ')()a)(aa()(a((a', ['(a)aa()aa', '(a)(aa)aa', '()aaa()aa', '()a(aa)aa']);
});
