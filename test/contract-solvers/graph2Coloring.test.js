import graph2Coloring from '../../src/contract-solvers/graph2Coloring';

const contract = (name, data, expected) => {
  test(name, () => {
    const result = graph2Coloring(data);
    expect(result).toEqual(expected);
  });
};

describe('graph2Coloring', () => {
  contract('example-1', [4, [[0, 2], [0, 3], [1, 2], [1, 3]]], [0, 0, 1, 1]);
  contract('example-2', [3, [[0, 1], [0, 2], [1, 2]]], []);
  contract('contract-304396', [12,[[7,11],[1,4],[4,10],[1,6],[0,5],[7,8],[9,11],[4,11],[7,10],[0,2],[6,10],[2,9],[3,10],[5,6],[9,10],[4,8]]], []);
});
