import { loadModel, detectFaceFromVideo } from "./tracking/detector.js";
import { track } from "./tracking/tracker.js";
import { drawBox } from "./tracking/overlay.js";
import { drawVideoCover } from "./ui/canvas.js";
import { initDebugUI, updateDebugUI } from "./ui/debugPanel.js";

import { config } from "../../config/config.js";

let video, canvas, ctx;
let currentBox = null;

let inferBusy = false; 
let lastInfer = 0;
const INFER_EVERY_MS = config?.tracking?.data?.inferPeriod ?? 120;

let cameraReady = false;
let modelLoaded = false;

async function start() {
  video = document.getElementById("video");
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d", { alpha: false });

  initDebugUI();

  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  video.srcObject = stream;
  await video.play();

  cameraReady = true;

  await loadModel();
  modelLoaded = true;

  requestAnimationFrame(loop);
}

function loop(t) {
  drawVideoCover(ctx, video, canvas);
  drawBox(ctx, currentBox);

  updateDebugUI({
    cameraReady,
    modelLoaded,
    box: currentBox,
    inferBusy,
    inferPeriod: INFER_EVERY_MS,
  });

  if (!inferBusy && (t - lastInfer) > INFER_EVERY_MS) {
    lastInfer = t;
    inferBusy = true;

    detectFaceFromVideo(video, canvas.width, canvas.height)
      .then((box) => {
        currentBox = track(box);
      })
      .catch((e) => console.warn("mp detect error", e))
      .finally(() => {
        inferBusy = false;
      });
  }

  requestAnimationFrame(loop);
}

window.addEventListener("DOMContentLoaded", () => start().catch(console.error));
