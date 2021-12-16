import findAllValidMathExpressions from '../../src/contract-solvers/findAllValidMathExpressions';

const contract = (name, numberString, targetValue, expected) => {
  test(name, () => {
    const result = findAllValidMathExpressions(numberString, targetValue);
    expect(result).toEqual(expected);
  });
};

const xcontract = () => {};

describe('findAllValidMathExpressions', () => {
  // contract('example-1', '123', 6, ['1+2+3', '1*2*3']);
  // contract('example-2', '105', 5, ['1*0+5', '10-5']);
  // contract('contract-204735', '61957', -74, []);
  // contract('contract-664868', '6932929', 82, [
  //   '6-9*3+2+92+9',
  //   '6*9+3+2*9-2+9',
  //   '6*9+3-2+9*2+9',
  //   '6+9*3+29*2-9',
  //   '6*9+3-2+9+2*9',
  // ]);
  // contract('contract-121927', '1344', 85, []);
  // contract('contract-872927', '462564', -63, ['4-6-2+5-64', '4-62+5-6-4']);
  // contract('contract-252324', '60020257', -40, []);
  contract('asdf', '93914220', -35, []);
  xcontract('contract-52858', '3021578465', 44, [
    '3*0*2-15*7+84+65',
    '3+0+2+1+57-84+65',
    '3-0+2+1+57-84+65',
    '30+21+5+7-84+65',
    '30*2+1-5+7-84+65',
    '30-2*1+5*7-84+65',
    '30-2+1*5*7-84+65',
    '3+0+21-57+8+4+65',
    '3-0+21-57+8+4+65',
    '3*0-21-5-7+8+4+65',
    '3+0-2+1-5*7+8+4+65',
    '3-0-2+1-5*7+8+4+65',
    '3+0*2-1-5*7+8+4+65',
    '3-0*2-1-5*7+8+4+65',
    '3*0+2*1-5*7+8+4+65',
    '3*0+2-1*5*7+8+4+65',
    '3+0+2-15-7-8+4+65',
    '3-0+2-15-7-8+4+65',
    '3*0-2*1*5-7-8+4+65',
    '30+2*1-57+8-4+65',
    '30+2-1*57+8-4+65',
    '3*0-21+5+7-8-4+65',
    '3+0*21-5-7-8-4+65',
    '3-0*21-5-7-8-4+65',
    '3*0+2+1-5-7-8-4+65',
    '3+0*2*1-5-7-8-4+65',
    '3-0*2*1-5-7-8-4+65',
    '3+0*2-1*5-7-8-4+65',
    '3-0*2-1*5-7-8-4+65',
    '3+0*2+1-57+8*4+65',
    '3-0*2+1-57+8*4+65',
    '3+0+2-1-57+8*4+65',
    '3-0+2-1-57+8*4+65',
    '3+0-21-5*7+8*4+65',
    '3-0-21-5*7+8*4+65',
    '3*0-2+1+5+7-8*4+65',
    '3*0*2-1+5+7-8*4+65',
    '30-21-5+7-8*4+65',
    '3+0*2+15-7-8*4+65',
    '3-0*2+15-7-8*4+65',
    '3+0*2+15+7+84-65',
    '3-0*2+15+7+84-65',
    '30-2-1+5-7+84-65',
    '30*2*1-5*7+84-65',
    '30*2-1*5*7+84-65',
    '30+2*1-5+78+4-65',
    '30+2-1*5+78+4-65',
    '3*0*2+15*7+8-4-65',
    '3*0-215+7-8+4*65',
    '3+0+21+5*7*8-4*65',
    '3-0+21+5*7*8-4*65',
    '3*0-2-1-5-7+8+46+5',
    '3*0-2+1-5+7-8+46+5',
    '3*0*2-1-5+7-8+46+5',
    '3+0*21+5-7-8+46+5',
    '3-0*21+5-7-8+46+5',
    '3*0+2+1+5-7-8+46+5',
    '3+0*2*1+5-7-8+46+5',
    '3-0*2*1+5-7-8+46+5',
    '3+0*2+1*5-7-8+46+5',
    '3-0*2+1*5-7-8+46+5',
    '3+0-2+1+5+78-46+5',
    '3-0-2+1+5+78-46+5',
    '3+0*2-1+5+78-46+5',
    '3-0*2-1+5+78-46+5',
    '3*0+2*1+5+78-46+5',
    '3*0+2+1*5+78-46+5',
    '3+0+21+5+7*8-46+5',
    '3-0+21+5+7*8-46+5',
    '302+15*7-8*46+5',
    '3+0+2+1-57+84+6+5',
    '3-0+2+1-57+84+6+5',
    '30*2*1+57-84+6+5',
    '30*2+1*57-84+6+5',
    '3+0+2*1*57-84+6+5',
    '3-0+2*1*57-84+6+5',
    '30-21+5+7+8+4+6+5',
    '30+2+1-5-7+8+4+6+5',
    '3*0+2*15+7-8+4+6+5',
    '3+0-2+1+5*7-8+4+6+5',
    '3-0-2+1+5*7-8+4+6+5',
    '3+0*2-1+5*7-8+4+6+5',
    '3-0*2-1+5*7-8+4+6+5',
    '3*0+2*1+5*7-8+4+6+5',
    '3*0+2+1*5*7-8+4+6+5',
    '3+0-2*15+7*8+4+6+5',
    '3-0-2*15+7*8+4+6+5',
    '30-2-1-5+7+8-4+6+5',
    '30+2-1+5-7+8-4+6+5',
    '30+2+1+5+7-8-4+6+5',
    '3*0-2+1-5+7+8*4+6+5',
    '3*0*2-1-5+7+8*4+6+5',
    '3+0*21+5-7+8*4+6+5',
    '3-0*21+5-7+8*4+6+5',
    '3*0+2+1+5-7+8*4+6+5',
    '3+0*2*1+5-7+8*4+6+5',
    '3-0*2*1+5-7+8*4+6+5',
    '3+0*2+1*5-7+8*4+6+5',
    '3-0*2+1*5-7+8*4+6+5',
    '3*0+21+5+7+8+4-6+5',
    '30+2-1-5+7+8+4-6+5',
    '30+2*1*5-7+8+4-6+5',
    '3*0-2*1+5*7+8+4-6+5',
    '3*0-2+1*5*7+8+4-6+5',
    '30+21+5-7-8+4-6+5',
    '30*2+1-5-7-8+4-6+5',
    '3*0*2-15+7*8+4-6+5',
    '30-2+1+5+7+8-4-6+5',
    '3+0+2+1+5*7+8-4-6+5',
    '3-0+2+1+5*7+8-4-6+5',
    '3*0*21+57-8-4-6+5',
    '3+0-2-1+57-8-4-6+5',
    '3-0-2-1+57-8-4-6+5',
    '3*0*2*1+57-8-4-6+5',
    '3*0*2+1*57-8-4-6+5',
    '30*2-1+5-7-8-4-6+5',
    '3*0-2*1-5+7*8-4-6+5',
    '3*0-2-1*5+7*8-4-6+5',
    '3+0-2*1*5+7*8-4-6+5',
    '3-0-2*1*5+7*8-4-6+5',
    '3*0+21*5-7*8-4-6+5',
    '3*0*2+1+5+7+8*4-6+5',
    '3*0+2-1+5+7+8*4-6+5',
    '3+0-2*1+5+7+8*4-6+5',
    '3-0-2*1+5+7+8*4-6+5',
    '3+0-2+1*5+7+8*4-6+5',
    '3-0-2+1*5+7+8*4-6+5',
    '3+0+2+15-7+8*4-6+5',
    '3-0+2+15-7+8*4-6+5',
    '30-2*1*5-7+8*4-6+5',
    '3*0*215+7+8+4*6+5',
    '30-2*15+7+8+4*6+5',
    '3*0*2*15+7+8+4*6+5',
    '3+0+2*1-5+7+8+4*6+5',
    '3-0+2*1-5+7+8+4*6+5',
    '3*0*21*5+7+8+4*6+5',
    '3+0+2-1*5+7+8+4*6+5',
    '3-0+2-1*5+7+8+4*6+5',
    '3*0*2*1*5+7+8+4*6+5',
    '30-21+5-7+8+4*6+5',
    '3+0-2+15+7-8+4*6+5',
    '3-0-2+15+7-8+4*6+5',
    '3*0+21-5+7-8+4*6+5',
    '3*0+2*15-7-8+4*6+5',
    '3*0*2-15+78-4*6+5',
    '3*0-2*1+57+8-4*6+5',
    '3*0-2+1*57+8-4*6+5',
    '30*2-1+5+7-8-4*6+5',
    '3+0-2+1+5+7*8-4*6+5',
    '3-0-2+1+5+7*8-4*6+5',
    '3+0*2-1+5+7*8-4*6+5',
    '3-0*2-1+5+7*8-4*6+5',
    '3*0+2*1+5+7*8-4*6+5',
    '3*0+2+1*5+7*8-4*6+5',
    '3+0*21578+46-5',
    '3-0*21578+46-5',
    '3+0*2*1578+46-5',
    '3-0*2*1578+46-5',
    '3+0*21*578+46-5',
    '3-0*21*578+46-5',
    '3+0*2*1*578+46-5',
    '3-0*2*1*578+46-5',
    '30-21*5+78+46-5',
    '3+0*215*78+46-5',
    '3-0*215*78+46-5',
    '3+0*2*15*78+46-5',
    '3-0*2*15*78+46-5',
    '3+0*21*5*78+46-5',
    '3-0*21*5*78+46-5',
    '3+0*2*1*5*78+46-5',
    '3-0*2*1*5*78+46-5',
    '3+0*2-15+7+8+46-5',
    '3-0*2-15+7+8+46-5',
    '3*0-2-1+5-7+8+46-5',
    '3*0-2+1+5+7-8+46-5',
    '3*0*2-1+5+7-8+46-5',
    '30-21-5+7-8+46-5',
    '3+0*2+15-7-8+46-5',
    '3-0*2+15-7-8+46-5',
    '3+0*2157*8+46-5',
    '3-0*2157*8+46-5',
    '3+0*2*157*8+46-5',
    '3-0*2*157*8+46-5',
    '3+0*21*57*8+46-5',
    '3-0*21*57*8+46-5',
    '3+0*2*1*57*8+46-5',
    '3-0*2*1*57*8+46-5',
    '3+0*215*7*8+46-5',
    '3-0*215*7*8+46-5',
    '3+0*2*15*7*8+46-5',
    '3-0*2*15*7*8+46-5',
    '3+0*21*5*7*8+46-5',
    '3-0*21*5*7*8+46-5',
    '3+0*2*1*5*7*8+46-5',
    '3-0*2*1*5*7*8+46-5',
    '3*0+2+15+78-46-5',
    '30+2-15+78-46-5',
    '3*0-2+15*7-8-46-5',
    '30-2+1-5+7+8+4+6-5',
    '30+2+1+5-7+8+4+6-5',
    '30+2*1*5+7-8+4+6-5',
    '30*2-1-5-7-8+4+6-5',
    '3*0-2-15+7*8+4+6-5',
    '3+0-21+57+8-4+6-5',
    '3-0-21+57+8-4+6-5',
    '30-2-1+5+7+8-4+6-5',
    '30+21-5-7+8-4+6-5',
    '3+0*2+1+5*7+8-4+6-5',
    '3-0*2+1+5*7+8-4+6-5',
    '3+0+2-1+5*7+8-4+6-5',
    '3-0+2-1+5*7+8-4+6-5',
    '3*0-2*1+57-8-4+6-5',
    '3*0-2+1*57-8-4+6-5',
    '3*0-2+1+5+7+8*4+6-5',
    '3*0*2-1+5+7+8*4+6-5',
    '30-21-5+7+8*4+6-5',
    '3+0*2+15-7+8*4+6-5',
    '3-0*2+15-7+8*4+6-5',
    '30-2*1-57+84-6-5',
    '30-2-1*57+84-6-5',
    '3+0+2+1-5*7+84-6-5',
    '3-0+2+1-5*7+84-6-5',
    '3+0-2*15+78+4-6-5',
    '3-0-2*15+78+4-6-5',
    '30+2-1+5+7+8+4-6-5',
    '3+0-2+1+57-8+4-6-5',
    '3-0-2+1+57-8+4-6-5',
    '3+0*2-1+57-8+4-6-5',
    '3-0*2-1+57-8+4-6-5',
    '3*0+2*1+57-8+4-6-5',
    '3*0+2+1*57-8+4-6-5',
    '30*2+1+5-7-8+4-6-5',
    '3+0+21+5*7-8+4-6-5',
    '3-0+21+5*7-8+4-6-5',
    '3*0*21-5+7*8+4-6-5',
    '3+0-2-1-5+7*8+4-6-5',
    '3-0-2-1-5+7*8+4-6-5',
    '3*0*2*1-5+7*8+4-6-5',
    '3*0*2-1*5+7*8+4-6-5',
    '30+2*15+7-8-4-6-5',
    '30+2*1+5*7-8-4-6-5',
    '30+2+1*5*7-8-4-6-5',
    '3+0*215+7*8-4-6-5',
    '3-0*215+7*8-4-6-5',
    '3+0*2*15+7*8-4-6-5',
    '3-0*2*15+7*8-4-6-5',
    '3*0-2*1+5+7*8-4-6-5',
    '3+0*21*5+7*8-4-6-5',
    '3-0*21*5+7*8-4-6-5',
    '3*0-2+1*5+7*8-4-6-5',
    '3+0*2*1*5+7*8-4-6-5',
    '3-0*2*1*5+7*8-4-6-5',
    '3+0-2+15+7+8*4-6-5',
    '3-0-2+15+7+8*4-6-5',
    '3*0+21-5+7+8*4-6-5',
    '3*0+2*15-7+8*4-6-5',
    '3+0+2*1+5+7+8+4*6-5',
    '3-0+2*1+5+7+8+4*6-5',
    '3+0+2+1*5+7+8+4*6-5',
    '3-0+2+1*5+7+8+4*6-5',
    '3*0+2*1*5+7+8+4*6-5',
    '30-2+1-5-7+8+4*6-5',
    '3+0-21+5*7+8+4*6-5',
    '3-0-21+5*7+8+4*6-5',
    '3*0+21+5+7-8+4*6-5',
    '30+2-1-5+7-8+4*6-5',
    '30+2*1*5-7-8+4*6-5',
    '3*0-2*1+5*7-8+4*6-5',
    '3*0-2+1*5*7-8+4*6-5',
    '3*0*21-5+78-4*6-5',
    '3+0-2-1-5+78-4*6-5',
    '3-0-2-1-5+78-4*6-5',
    '3*0*2*1-5+78-4*6-5',
    '3*0*2-1*5+78-4*6-5',
    '3+0+21+57-8-4*6-5',
    '3-0+21+57-8-4*6-5',
    '3*0+2+15+7*8-4*6-5',
    '30+2-15+7*8-4*6-5',
    '30-215+7-8+46*5',
    '302-1-5*7+8-46*5',
    '3+0+215+7*8-46*5',
    '3-0+215+7*8-46*5',
    '3*0-2*1*5*7+84+6*5',
    '3*0+21*5-7-84+6*5',
    '30*2-1-57+8+4+6*5',
    '3*0*21-5+7+8+4+6*5',
    '3+0-2-1-5+7+8+4+6*5',
    '3-0-2-1-5+7+8+4+6*5',
    '3*0*2*1-5+7+8+4+6*5',
    '3*0*2-1*5+7+8+4+6*5',
    '3+0*2+1+5-7+8+4+6*5',
    '3-0*2+1+5-7+8+4+6*5',
    '3+0+2-1+5-7+8+4+6*5',
    '3-0+2-1+5-7+8+4+6*5',
    '3+0+2+1+5+7-8+4+6*5',
    '3-0+2+1+5+7-8+4+6*5',
    '30*2+1+5-7*8+4+6*5',
    '3+0*215+7+8-4+6*5',
    '3-0*215+7+8-4+6*5',
    '3+0*2*15+7+8-4+6*5',
    '3-0*2*15+7+8-4+6*5',
    '3*0-2*1+5+7+8-4+6*5',
    '3+0*21*5+7+8-4+6*5',
    '3-0*21*5+7+8-4+6*5',
    '3*0-2+1*5+7+8-4+6*5',
    '3+0*2*1*5+7+8-4+6*5',
    '3-0*2*1*5+7+8-4+6*5',
    '3*0+2+15-7+8-4+6*5',
    '30+2-15-7+8-4+6*5',
    '3+0+21-5+7-8-4+6*5',
    '3-0+21-5+7-8-4+6*5',
    '3+0+2*15-7-8-4+6*5',
    '3-0+2*15-7-8-4+6*5',
    '30-2*1+5-7-8-4+6*5',
    '30-2+1*5-7-8-4+6*5',
    '30*2+1-5*7-8-4+6*5',
    '3*0-2-15+7+84-6*5',
    '3+0-2+1-5-7+84-6*5',
    '3-0-2+1-5-7+84-6*5',
    '3+0*2-1-5-7+84-6*5',
    '3-0*2-1-5-7+84-6*5',
    '3*0+2*1-5-7+84-6*5',
    '3*0+2-1*5-7+84-6*5',
    '3+0-2+157-84-6*5',
    '3-0-2+157-84-6*5',
    '3*0-2-1-5+78+4-6*5',
    '3+0+2*1+57+8+4-6*5',
    '3-0+2*1+57+8+4-6*5',
    '3+0+2+1*57+8+4-6*5',
    '3-0+2+1*57+8+4-6*5',
    '30*2*1-5+7+8+4-6*5',
    '30*2-1*5+7+8+4-6*5',
    '30-2-1+5*7+8+4-6*5',
    '3*0+21+57-8+4-6*5',
    '30-21+5+7*8+4-6*5',
    '3*0*215+78-4-6*5',
    '30-2*15+78-4-6*5',
    '3*0*2*15+78-4-6*5',
    '3+0+2*1-5+78-4-6*5',
    '3-0+2*1-5+78-4-6*5',
    '3*0*21*5+78-4-6*5',
    '3+0+2-1*5+78-4-6*5',
    '3-0+2-1*5+78-4-6*5',
    '3*0*2*1*5+78-4-6*5',
    '3*0+2*1*5*7+8-4-6*5',
    '30-2+1+57-8-4-6*5',
    '30+21+5*7-8-4-6*5',
    '30-2-1-5+7*8-4-6*5',
    '3+0-2+15*7-8*4-6*5',
    '3-0-2+15*7-8*4-6*5',
    '302+1-5-7*8*4-6*5',
    '3*0-2-1+5-78+4*6*5',
    '30-2*1*57+8+4*6*5',
    '30-21*5+7-8+4*6*5',
    '3+0+21*5+7*8-4*6*5',
    '3-0+21*5+7*8-4*6*5',
  ]);
  xcontract('contract-454301', '994399492243', -4, []);
  // contract('contract-652226', '6361837195', 80, []);   // ?
});
