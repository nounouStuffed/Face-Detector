import { config } from "../../../config/config.js";

let lastFrameTime = performance.now();
let fps = 0;

function setStatus(el, isOk, okText = "YES", badText = "NO") {
  if (!el) return;
  el.textContent = isOk ? okText : badText;
  el.classList.remove("ok", "bad", "warn", "dim");
  el.classList.add(isOk ? "ok" : "bad");
}

function setPercent(el, value01) {
  if (!el) return;
  const pct = Math.round((value01 ?? 0) * 100);
  el.textContent = `${pct}%`;
  el.classList.remove("ok", "bad", "warn", "dim");

  if (pct >= 70) el.classList.add("ok");
  else if (pct >= 40) el.classList.add("warn");
  else el.classList.add("bad");
}

function setNumber(el, v, digits = 3) {
  if (!el) return;
  el.textContent = (v === null || v === undefined || Number.isNaN(v)) ? "-" : Number(v).toFixed(digits);
  el.classList.remove("ok", "bad", "warn", "dim");
  el.classList.add("dim");
}

export function initDebugUI(canvas, video) {
  document.body.dataset.mode = config.debug?.metrics ? "debug" : "normal";

  if (config.debug?.metrics) {
    canvas.width = config.debug.dataWidth ?? 1280;
    canvas.height = config.debug.dataHeight ?? 720;
  } else {
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
  }
}

export function updateFPS() {
  const now = performance.now();
  fps = Math.round(1000 / (now - lastFrameTime));
  lastFrameTime = now;
  return fps;
}

export function updateDebugPanel({
  cam,
  model,
  detected,
  confidence01,
  progressPct,
  raw 
}) {
  if (!config.debug?.metrics) return;

  setStatus(document.getElementById("camStatus"), !!cam, "OK", "NO");
  setStatus(document.getElementById("modelStatus"), !!model, "YES", "NO");
  setStatus(document.getElementById("faceStatus"), !!detected, "YES", "NO");

  const fpsEl = document.getElementById("fps");
  if (fpsEl) {
    fpsEl.textContent = String(fps);
    fpsEl.classList.remove("ok", "bad", "warn", "dim");
    if (fps >= 24) fpsEl.classList.add("ok");
    else if (fps >= 12) fpsEl.classList.add("warn");
    else fpsEl.classList.add("bad");
  }

  setPercent(document.getElementById("confidence"), confidence01 ?? 0);

  const progressEl = document.getElementById("progress");
  if (progressEl) {
    progressEl.textContent = `${progressPct ?? 0}%`;
    progressEl.classList.remove("ok", "bad", "warn", "dim");
    if ((progressPct ?? 0) >= 80) progressEl.classList.add("ok");
    else if ((progressPct ?? 0) >= 50) progressEl.classList.add("warn");
    else progressEl.classList.add("bad");
  }

  const bar = document.getElementById("progressBar");
  if (bar) bar.style.width = `${progressPct ?? 0}%`;

  setNumber(document.getElementById("rawP"), raw?.p, 3);
  setNumber(document.getElementById("rawCX"), raw?.cx, 3);
  setNumber(document.getElementById("rawCY"), raw?.cy, 3);
  setNumber(document.getElementById("rawS"), raw?.s, 3);
}
