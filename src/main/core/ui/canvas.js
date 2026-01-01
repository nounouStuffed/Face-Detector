import { config } from '../../../config/config.js';

export function applyUIModeFromConfig() {
  const enabled = !!config?.debug?.metrics;     
  document.body.dataset.mode = enabled ? "debug" : "normal";
}

export function drawVideoCover(ctx, video, canvas) {
  const cw = canvas.width;
  const ch = canvas.height;
  const vw = video.videoWidth;
  const vh = video.videoHeight;
  if (!vw || !vh) return;

  const scale = Math.max(cw / vw, ch / vh);
  const sw = vw * scale;
  const sh = vh * scale;
  const dx = (cw - sw) / 2;
  const dy = (ch - sh) / 2;

  ctx.drawImage(video, dx, dy, sw, sh);
}
