import * as tf from "@tensorflow/tfjs";

export function createFaceModel() {
  const input = tf.input({ shape: [64, 64, 3] });

  let x = tf.layers.conv2d({ filters: 16, kernelSize: 3, activation: "relu" }).apply(input);
  x = tf.layers.maxPooling2d({ poolSize: 2 }).apply(x);

  x = tf.layers.conv2d({ filters: 32, kernelSize: 3, activation: "relu" }).apply(x);
  x = tf.layers.maxPooling2d({ poolSize: 2 }).apply(x);

  x = tf.layers.flatten().apply(x);
  x = tf.layers.dense({ units: 64, activation: "relu" }).apply(x);

  const output = tf.layers.dense({ units: 4, activation: "sigmoid" }).apply(x);

  return tf.model({ inputs: input, outputs: output });
}
