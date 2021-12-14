export const mergeOverlappingIntervals = (intervals) => {
  const clonedIntervals = intervals.map((i) => i.slice());
  const sortedIntervals = clonedIntervals.sort((a, b) => a[0] - b[0]);

  let mergedIntervals = [];
  let lastInterval;

  for (const interval of sortedIntervals) {
    if (!lastInterval || interval[0] > lastInterval[1]) {
      mergedIntervals.push(interval);
      lastInterval = interval;
    } else if (interval[1] > lastInterval[1]) {
      lastInterval[1] = interval[1];
    }
  }

  return mergedIntervals;
};

export const arrayJumpingGame = (array) => {
  let jumpDistance = 0;

  for (let i = 0; i < array.length; i++) {
    jumpDistance = Math.max(jumpDistance, array[i]);

    if (jumpDistance <= 0) {
      return 0;
    }
  }

  return 1;
};
