import { config } from '../../../config/config.js';

let current = null;
const smoothing = config.tracking.data.smoothing;

let missing = 0;
const MAX_MISSING = config.tracking.data.maxMissing; 

export function track(detected) {
  if (!detected) {
    missing++;
    if (missing >= MAX_MISSING) current = null;
    return current;
  }

  missing = 0;

  if (!current) {
    current = detected;
    return current;
  }

  current.x = current.x * smoothing + detected.x * (1 - smoothing);
  current.y = current.y * smoothing + detected.y * (1 - smoothing);
  current.size = current.size * smoothing + detected.size * (1 - smoothing);

  current.confidence = detected.confidence;
  current.raw = detected.raw;

  return current;
}
