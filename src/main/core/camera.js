import { detectFace, loadModel } from "./tracking/detector.js";
import { track } from "./tracking/tracker.js";
import { drawBox } from "./tracking/overlay.js";
import { initDebugUI, updateDebugPanel, updateFPS } from "./ui/debugPanel.js";
import { attachCanvasAutoResize, drawVideoCover } from "./ui/canvas.js";


let video, canvas, ctx;
let currentBox = null;
let modelLoaded = false;

async function start() {
  video = document.getElementById("video");
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");

  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  video.srcObject = stream;
  await video.play();

  initDebugUI(canvas, video);

  await loadModel();
  modelLoaded = true;

  requestAnimationFrame(loop);
}

async function loop() {
  drawVideoCover(ctx, video, canvas);

  const box = await detectFace(ctx, currentBox);
  currentBox = track(box);

  const progressPct =
  (true ? 20 : 0) +
  (modelLoaded ? 20 : 0) +
  (currentBox ? 20 : 0) +
  (currentBox ? 20 : 0) +
  ((currentBox?.confidence ?? 0) > 0.6 ? 20 : 0);

  drawBox(ctx, currentBox);

  updateFPS();
  updateDebugPanel({
    cam: true,
    model: modelLoaded,
    detected: !!currentBox,
    confidence01: currentBox?.confidence ?? 0,
    progressPct,
    raw: currentBox?.raw
  });


  requestAnimationFrame(loop);
}

window.addEventListener("DOMContentLoaded", () => {
  start().catch(console.error);
});
