export default function canJumpToLastIndex(array) {
  let jumpDistance = 0;

  for (let i = 0; i < array.length; i++) {
    jumpDistance = Math.max(jumpDistance, array[i]);

    if (jumpDistance <= 0) {
      return 0;
    }
  }

  return 1;
}
