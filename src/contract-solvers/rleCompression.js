export default function rleCompression(data) {
  if (data.length === 0) {
    return data;
  }

  const output = [];
  let char = undefined;
  let count = 0;

  for (let i = 0, len = data.length; i <= len; i++) {
    if (i === len || count === 9 || data[i] !== char) {
      if (char) {
        output.push(count.toString() + char);
      }

      char = data[i];
      count = 1;
    } else {
      count++;
    }
  }

  return output.join('');
}
