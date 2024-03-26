import shortestPathInGrid from '../../src/contract-solvers/shortestPathInGrid';

const contract = (name, grid, expected) => {
  test(name, () => {
    const result = shortestPathInGrid(grid);
    expect(result).toEqual(expected);
  });
};

describe('shortestPathInGrid', () => {
  contract('example-1', [[0,1,0,0,0],[0,0,0,1,0]], 'DRRURRD');
  contract('example-2', [[0,1],[1,0]], '');
  contract('contract-509493', [
    [0,0,1,0,0,0,0,1,1,1,0,1],
    [0,0,0,0,1,1,1,1,0,0,0,0],
    [0,0,0,1,1,1,1,0,1,0,0,0],
    [0,0,0,0,1,0,1,0,1,0,0,1],
    [0,1,0,0,0,0,0,0,0,0,0,0],
    [1,0,1,0,1,0,0,1,1,0,0,0]], '');
});
