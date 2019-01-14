// This function is pretty ugly. I wonder if there's a nicer way
// to do this.
export default function allValidIpsGivenNumber(num, size = 4) {
  if (size <= 0) {
    return [];
  } else if (size === 1) {
    if (num.length <= 3 && parseInt(num, 10) <= 255) {
      return [num];
    } else {
      return [];
    }
  }

  let ips = [];

  for (let i = 0; i <= 2 && i < num.length; i++) {
    // Valid IP address include valid IP segments + valid
    // "IP addresses" of a smaller size.
    const segment = num.slice(0, i + 1);

    // A segment can't start with '0' unless the segment is exactly '0'.
    if (segment.length > 1 && segment[0] === '0') {
      continue;
    }

    if (segment.length <= 3 && parseInt(segment, 10) <= 255) {
      ips = ips.concat(allValidIpsGivenNumber(num.slice(i + 1), size - 1).map((ip) => `${segment}.${ip}`));
    }
  }

  return ips;
}
