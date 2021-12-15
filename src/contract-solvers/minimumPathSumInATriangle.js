/**
 * Example:
 *
 * rows =
 *      8
 *     2 7
 *    6 5 4
 *   9 3 7 3
 *  9 4 1 3 4
 *
 * path = 8 -> 2 -> 5 -> 3 -> 1
 *
 * answer = 19
 */
export const minimumPathSumInATriangle = (rows) => {
  let allPaths = [{ lastIndex: 0, value: rows[0][0] }];
  let minValue = Number.POSITIVE_INFINITY;

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const paths = allPaths;
    allPaths = [];
    minValue = Number.POSITIVE_INFINITY;

    for (let j = 0; j < paths.length; j++) {
      const path = paths[j];
      const aIndex = path.lastIndex;
      const bIndex = path.lastIndex + 1;
      const a = path.value + row[aIndex];
      const b = path.value + row[bIndex];
      allPaths.push({ lastIndex: aIndex, value: a });
      allPaths.push({ lastIndex: bIndex, value: b });
      minValue = Math.min(Math.min(a, b), minValue);
    }
  }

  return minValue;
};

export default minimumPathSumInATriangle;
