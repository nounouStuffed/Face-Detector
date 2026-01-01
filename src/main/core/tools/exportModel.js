import * as tf from "@tensorflow/tfjs";
import { createFaceModel } from "../../../model/faceModel.js";

document.getElementById("export").onclick = async () => {
  const model = createFaceModel();
  await model.save("downloads://face");
  console.log("[export] downloaded model.json + .bin");
};
