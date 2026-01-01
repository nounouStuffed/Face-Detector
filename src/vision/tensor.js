import * as tf from "@tensorflow/tfjs";

export function frameToTensor(ctx, x, y, size) {
  const W = ctx.canvas.width;
  const H = ctx.canvas.height;

  const xi = Math.max(0, Math.floor(x));
  const yi = Math.max(0, Math.floor(y));
  const si = Math.max(1, Math.floor(Math.min(size, W - xi, H - yi)));

  const imageData = ctx.getImageData(xi, yi, si, si);

  return tf.tidy(() =>
    tf.browser
      .fromPixels(imageData)
      .resizeBilinear([64, 64])
      .toFloat()
      .div(255)
      .expandDims(0)
  );
}

