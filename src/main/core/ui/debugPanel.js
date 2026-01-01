import { config } from "../../../config/config.js";

let el = null;

let fpsFrames = 0;
let fpsLastT = performance.now();
let fpsValue = 0;

export function initDebugUI() {
  const enabled = !!config?.debug?.metrics;
  document.body.dataset.mode = enabled ? "debug" : "normal";

  if (!enabled) {
    el = null;
    return;
  }

  el = {
    camStatus: document.getElementById("camStatus"),
    fps: document.getElementById("fps"),
    modelStatus: document.getElementById("modelStatus"),
    faceStatus: document.getElementById("faceStatus"),
    confidence: document.getElementById("confidence"),
    progress: document.getElementById("progress"),
    rawP: document.getElementById("rawP"),
    rawCX: document.getElementById("rawCX"),
    rawCY: document.getElementById("rawCY"),
    rawS: document.getElementById("rawS"),
  };
}

function setText(node, text, cls) {
  if (!node) return;
  node.textContent = text ?? "-";
  node.classList.remove("ok", "bad", "warn", "dim");
  if (cls) node.classList.add(cls);
}

function pct01(x) {
  if (x == null || !Number.isFinite(x)) return "-";
  return `${Math.round(x * 100)}%`;
}

function num3(x) {
  if (x == null || !Number.isFinite(x)) return "-";
  return x.toFixed(3);
}

export function updateDebugUI(state = {}) {
  if (!el) return;

  fpsFrames++;
  const now = performance.now();
  const dt = now - fpsLastT;
  if (dt > 500) {
    fpsValue = Math.round((fpsFrames * 1000) / dt);
    fpsFrames = 0;
    fpsLastT = now;
  }

  const cameraReady = !!state.cameraReady;
  const modelLoaded = !!state.modelLoaded;

  const minC = config?.tracking?.data?.minConfidence ?? 0.3;      
  const reqC = config?.tracking?.data?.reqConfidence ?? 0.7;      

  const conf = state.box?.confidence ?? 0;

  let faceLabel = "NO";
  let faceCls = "bad";
  let confCls = "bad";

  if (!state.box) {
    faceLabel = "NO";
    faceCls = "bad";
    confCls = "bad";
  } else if (conf >= reqC) {
    faceLabel = "YES";
    faceCls = "ok";
    confCls = "ok";
  } else if (conf >= minC) {
    faceLabel = "LIKELY";
    faceCls = "warn";
    confCls = "warn";
  } else {
    faceLabel = "NO";
    faceCls = "bad";
    confCls = "bad";
  }

  setText(el.camStatus, cameraReady ? "YES" : "NO", cameraReady ? "ok" : "bad");
  setText(el.fps, String(fpsValue), fpsValue >= 20 ? "ok" : (fpsValue >= 10 ? "warn" : "bad"));
  setText(el.modelStatus, modelLoaded ? "YES" : "NO", modelLoaded ? "ok" : "bad");

  setText(el.faceStatus, faceLabel, faceCls);
  setText(el.confidence, `${pct01(conf)}`, confCls);

  
  let progress = 0;
  if (cameraReady) progress += 25;
  if (modelLoaded) progress += 25;
  if (state.inferBusy === false) progress += 25;
  if (state.box && conf >= minC) progress += 25;

  setText(
    el.progress,
    `${progress}%`,
    progress >= 75 ? "ok" : (progress >= 50 ? "warn" : "bad")
  );

  const raw = state.box?.raw;
  setText(el.rawP, raw ? num3(raw.p) : "-", raw ? confCls : "dim");
  setText(el.rawCX, raw ? num3(raw.cx) : "-", "dim");
  setText(el.rawCY, raw ? num3(raw.cy) : "-", "dim");
  setText(el.rawS, raw ? num3(raw.s) : "-", "dim");
}

