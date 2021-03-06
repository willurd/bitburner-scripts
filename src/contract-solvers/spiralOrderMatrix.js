export const mtx = ([string]) => {
  return string
    .trim()
    .split('\n')
    .map((s) => {
      return s
        .trim()
        .split(',')
        .filter((v) => v)
        .map((v) => parseInt(v, 10));
    });
};

export default function spiralOrderMatrix(matrix) {
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
}
