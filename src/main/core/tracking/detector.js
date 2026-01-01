import { FaceDetection } from "@mediapipe/face_detection";
import { config } from '../../../config/config.js';


let detector = null;
let lastBox = null;
let lastCanvasW = 0;
let lastCanvasH = 0;

let minConfidence = config.tracking.data.minDetecConfidence;
let model = config.tracking.data.model;


function getConfidence(d) {
  const s = d?.score;
  if (Array.isArray(s)) return s[0] ?? 0;
  if (typeof s === "number") return s;

  const ga = d?.V?.[0]?.ga;
  if (typeof ga === "number") return ga;

  return 1;
}

function parseBoundingBox(d, canvasW, canvasH) {
  const bb = d?.locationData?.relativeBoundingBox || d?.boundingBox || d?.BoundingBox;
  if (!bb) return null;

  const widthN = bb.width;
  const heightN = bb.height;

  const xMinN =
    bb.xMin ?? bb.xmin ?? (bb.xCenter != null ? (bb.xCenter - widthN / 2) : null);
  const yMinN =
    bb.yMin ?? bb.ymin ?? (bb.yCenter != null ? (bb.yCenter - heightN / 2) : null);

  if (xMinN == null || yMinN == null || widthN == null || heightN == null) return null;

  const confidence = getConfidence(d);

  const w = widthN * canvasW;
  const h = heightN * canvasH;
  const size = Math.max(w, h);

  const x = xMinN * canvasW;
  const y = yMinN * canvasH;

  const cx = (x + w / 2) / canvasW;
  const cy = (y + h / 2) / canvasH;
  const s = size / Math.min(canvasW, canvasH);

  if (![x, y, size, confidence, cx, cy, s].every(Number.isFinite)) return null;

  return {
    x,
    y,
    size,
    confidence,
    raw: { p: confidence, cx, cy, s }
  };
}

export async function loadModel() {
  if (detector) return;

  detector = new FaceDetection({
    locateFile: (file) =>
      new URL(
        `../../../../node_modules/@mediapipe/face_detection/${file}`,
        import.meta.url
      ).toString(),
  });

  detector.setOptions({
    model: model,              
    minDetectionConfidence: minConfidence,
  });

  detector.onResults((res) => {
    const dets = res?.detections || [];
    if (!dets.length) {
      lastBox = null;
      return;
    }
    lastBox = parseBoundingBox(dets[0], lastCanvasW, lastCanvasH);
  });

  console.log("[detector] MediaPipe FaceDetection ready");
}

export async function detectFaceFromVideo(videoEl, canvasW, canvasH) {
  if (!detector) return null;
  if (!videoEl || videoEl.readyState < 2) return null;

  lastCanvasW = canvasW;
  lastCanvasH = canvasH;

  await detector.send({ image: videoEl });
  return lastBox;
}
