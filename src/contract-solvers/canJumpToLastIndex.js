export default function canJumpToLastIndex(array) {
  let jumpDistance = array[0];

  for (let i = 1; i < array.length && jumpDistance > 0; i++) {
    if (jumpDistance <= 0) {
      return 0;
    }

    jumpDistance = Math.max(jumpDistance, array[i]);
  }

  return 1;
}
