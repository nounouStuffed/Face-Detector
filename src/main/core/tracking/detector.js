import * as tf from "@tensorflow/tfjs";
import { frameToTensor } from "../../../vision/tensor.js"; 

let faceModel = null;

export async function loadModel() {
  try {
    faceModel = await tf.loadLayersModel("/models/face/model.json");
    console.log("[detector] Model loaded");
  } catch (e) {
    console.warn("[detector] Model load failed, fallback naive", e);
    faceModel = null;
  }
}


function naiveDetect(imageData) {
  const { width, height, data } = imageData;

  let best = null;
  let bestScore = 0;
  const size = Math.floor(Math.min(width, height) * 0.4);

  for (let y = height * 0.2; y < height * 0.6; y += 20) {
    for (let x = width * 0.2; x < width * 0.6; x += 20) {
      let score = 0;
      for (let j = 0; j < size; j += 10) {
        for (let i = 0; i < size; i += 10) {
          const idx = ((y + j) * width + (x + i)) * 4;
          const r = data[idx], g = data[idx + 1], b = data[idx + 2];
          score += Math.abs(r - g) + Math.abs(g - b);
        }
      }
      if (score > bestScore) {
        bestScore = score;
        best = { x, y, size };
      }
    }
  }

  return best;
}

/**
 * Detect face in a canvas frame
 * @param {CanvasRenderingContext2D} ctx
 * @param {object} prevBox Optional previous box (for fallback / tracking)
 * @returns {object} { x, y, size } bounding box or null
 */
export async function detectFace(ctx, prevBox = null) {
  if (!ctx) return null;

  const W = ctx.canvas.width;
  const H = ctx.canvas.height;

  const imageData = ctx.getImageData(0, 0, W, H);

  if (faceModel) {
    try {
      const sizeSq = Math.min(W, H);
      const x0 = Math.floor((W - sizeSq) / 2);
      const y0 = Math.floor((H - sizeSq) / 2);

      const tensor = frameToTensor(ctx, x0, y0, sizeSq);
      const output = await faceModel.predict(tensor).data();
      tensor.dispose();

      const [p, cx, cy, s] = output;

      if (p < 0.6) {
        const fallback = prevBox || naiveDetect(imageData);
        return fallback ? { ...fallback, confidence: p, raw: { p, cx, cy, s } } : null;
      }

      // Convert normalized outputs to pixels
      const size = Math.max(30, s * sizeSq);
      const x = (x0 + cx * sizeSq) - size / 2;
      const y = (y0 + cy * sizeSq) - size / 2;

      return { x, y, size, confidence: p, raw: { p, cx, cy, s } };
    } catch (err) {
      console.warn("[detector] Model inference failed, fallback to naive", err);
      return naiveDetect(imageData);
    }
  }

  // No model loaded → fallback
  return naiveDetect(imageData);
}

