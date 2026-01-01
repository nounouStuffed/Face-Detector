export function attachCanvasAutoResize(canvas, onResized) {
  const dpr = () => window.devicePixelRatio || 1;

  function applySize() {
    const rect = canvas.getBoundingClientRect();
    const w = Math.round(rect.width * dpr());
    const h = Math.round(rect.height * dpr());

    if (w <= 0 || h <= 0) return;

    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      onResized?.(w, h);
    }
  }

  const ro = new ResizeObserver(() => applySize());
  ro.observe(canvas);

  window.addEventListener("resize", applySize);

  requestAnimationFrame(applySize);

  return () => {
    ro.disconnect();
    window.removeEventListener("resize", applySize);
  };
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
