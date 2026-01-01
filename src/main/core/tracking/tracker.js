let current = null;
const smoothing = 0.85;

export function track(detected) {
  if (!detected) return current;

  if (!current) {
    current = detected;
    return current;
  }

  current.x = current.x * smoothing + detected.x * (1 - smoothing);
  current.y = current.y * smoothing + detected.y * (1 - smoothing);
  current.size = current.size * smoothing + detected.size * (1 - smoothing);

  return current;
}
