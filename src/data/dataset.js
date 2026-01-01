export function sampleNegative(width, height, size) {
  return {
    x: Math.random() * (width - size),
    y: Math.random() * (height - size),
    size
  };
}
