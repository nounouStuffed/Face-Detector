function dist(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx*dx + dy*dy);
}

export function inferExpression(box) {
  const l = box?.landmarks;
  if (!l || l.length < 6) {
    return { label: "UNKNOWN", prob: 0 };
  }

  const rightEye = l[0];
  const leftEye  = l[1];
  const nose     = l[2];
  const mouth    = l[3];
  const earR     = l[4];
  const earL     = l[5];

  const faceW = dist(earR, earL) || dist(rightEye, leftEye) || 0.001;

  const mouthOpen = dist(mouth, nose) / faceW;
  const eyesMidY = (rightEye.y + leftEye.y) / 2;
  const smileLift = (mouth.y - eyesMidY) / faceW;

  const mouthProb = Math.min(1, Math.max(0, (mouthOpen - 0.12) / 0.15));
  const smileProb = Math.min(1, Math.max(0, (smileLift - 0.08) / 0.12));

  if (smileProb > 0.7 && mouthProb > 0.6) {
    return { label: "LAUGH", prob: Math.min(1, (smileProb + mouthProb) / 2) };
  }
  if (smileProb > 0.6) {
    return { label: "SMILE", prob: smileProb };
  }
  if (mouthProb > 0.6) {
    return { label: "MOUTH_OPEN", prob: mouthProb };
  }

  return { label: "NEUTRAL", prob: 1 - Math.max(smileProb, mouthProb) };
}
