import {canvasp5} from "./sketch.js";
$(".predictioncontainer").html("");

// initialize mapping tensor for computing centroid
let centroidMap = new Array(28);
for(let i=0; i<28; i++){
    let tempRow = new Array(28);
    for (let j=0; j<28; j++){
        tempRow[j] = [i, j];
    }
    centroidMap[i] = tempRow;
}
centroidMap = tf.tensor(centroidMap);

// instantiate model and epoch counter
const trainedModel = await tf.loadLayersModel("trained-model/model.json"); // pre-trained 3-layer NN on MNIST digits
const untrainedModel = await tf.loadLayersModel("untrained-model/model.json"); // untrained 3-layer NN on MNIST digits with random weights

export function recognize(pixels) {
  let pixelArray = Array.prototype.slice.call(pixels); //convert into JS array
  pixelArray = tf.tensor(pixelArray); //convert into tensorflow.js tensor
  pixelArray = tf.reshape(pixelArray, [canvasp5.height, canvasp5.width, 4]); //reshape
  let dummy;
  [pixelArray, dummy]  = tf.split(pixelArray, [3, 1], -1); //remove alpha channel
  pixelArray = tf.mean(pixelArray, -1).expandDims(-1); //collapse the RGB channels into a single channel via mean
  pixelArray = tf.sub(255, pixelArray);
  pixelArray = tf.div(pixelArray, 255.0); //normalize to [0, 1]
  pixelArray = tf.image.resizeBilinear(pixelArray, [28, 28]); //resize to (28, 28, 1)

  // centralise image on its centroid
  let centroidProduct = tf.sum(tf.sum(tf.mul(pixelArray, centroidMap), 1), 0);
  let pixelSum = tf.sum(tf.sum(pixelArray, 1), 0);
  let centroid = tf.round(tf.div(centroidProduct, pixelSum));
  let [centroidX, centroidY] = centroid.dataSync();
  let [imageSliceLeft, xSize] = (centroidX < 14) ? [0, centroidX] : [2 * centroidX - 28, 28 - centroidX];
  let [imageSliceTop, ySize] = (centroidY < 14) ? [0, centroidY] : [2 * centroidY - 28, 28 - centroidY];
  let croppedImage = pixelArray.slice([imageSliceTop, imageSliceLeft, 0], [2 * ySize, 2 * xSize, 1]);
  let yPad = (28 - 2*ySize) / 2;
  let xPad = (28 - 2*xSize) / 2;
  let paddedImage = croppedImage.pad([[yPad, yPad], [xPad, xPad], [0, 0]]);

  // run inference
  pixelArray = tf.expandDims(paddedImage, 0); //add batch dimension
  let outputs = ($(".modelbuttons input[id='trained']:checked").val()) ? trainedModel.predict(pixelArray) : untrainedModel.predict(pixelArray);
  return outputs;
}