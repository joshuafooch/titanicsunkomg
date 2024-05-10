// instantiate transfer button and slider
$("#transferbutton").on("click", () => {
  generatedImage = transferStyleTraining(trueContentImage, trueStyleImage, generatedImage, 1e-4, 4e-4, model, $("#epochslider").val(), 0.5);
  // transferStyle();
});

$("#epochslider").on("input", () => {
  $(".epochtext").text("Epochs: " + $("#epochslider").val());
})

// load displayed images
var displayedContentImage = document.createElement("img");
displayedContentImage.src = "dog.jpg";
displayedContentImage.classList.add("contentimage");
document.getElementById("contentimage").appendChild(displayedContentImage);

var displayedStyleImage = document.createElement("img");
displayedStyleImage.src = "style_images/starry_night.jpg";
displayedStyleImage.classList.add("styleimage");
document.getElementById("styleimage").appendChild(displayedStyleImage);

// load true images for processing; necessary since displayed images have been resized for the view window
var trueContentImage = document.createElement("img");
trueContentImage.src = displayedContentImage.src;
var trueStyleImage = document.createElement("img");
trueStyleImage.src = displayedStyleImage.src;
var generatedImage = document.createElement("img");
generatedImage.src = displayedContentImage.src;

// get canvas height and width
const canvasContainer = document.getElementById("styledimagecontainer");
const canvas = document.getElementById("styledimagecanvas");
const canvasHeight = canvasContainer.offsetHeight;
const canvasWidth = canvasContainer.offsetWidth;

// instantiate model and epoch counter
const model = await tf.loadLayersModel("web_model/model.json"); // pre-trained VGG19 feature extractor
const NUM_CONTENT_LAYERS = 1;
const NUM_STYLE_LAYERS = 6;
var epochNum = 1;
// model.summary();

// utility functions
function loadImage(imageObject){
  const image = tf.browser.fromPixels(imageObject);
  return image;
}

function preprocessInput(imageTensor){ // adapted from keras.applications.imagenet_utils documentation
  const reversedImageTensor = imageTensor.reverse(-1); // RGB -> BGR
  const means = tf.tensor([[[103.939, 116.779, 123.68]]]);
  const centeredImageTensor = reversedImageTensor.sub(means); // zero-center the image based on imagenet dataset means
  return centeredImageTensor;
}

function preprocessImage(imageTensor){
  const castImageTensor = tf.cast(imageTensor, "float32");
  const preprocessedImageTensor = preprocessInput(castImageTensor);
  return preprocessedImageTensor.expandDims();
}


// helper functions
function getContentTargets(image, model){
  image = preprocessImage(image);
  const outputs = model.predict(image);
  const contentTargets = outputs.slice(0, NUM_CONTENT_LAYERS);
  return contentTargets;
}

function getStyleTargets(image, model){
    image = preprocessImage(image);
    const outputs = model.predict(image);
    const styleTargets = outputs.slice(NUM_CONTENT_LAYERS, outputs.length);
    return styleTargets;
}

function getContentLoss(generatedImage, contentTargets, model){
    const contentFeatures = getContentTargets(generatedImage, model);
    var loss = tf.tensor([0]);
    for (var i = 0; i<contentTargets.length; i++){
      var loss_i = tf.mul(0.5, tf.sum(tf.square(tf.sub(contentFeatures[i], contentTargets[i]))));
      loss = tf.add(loss, loss_i);
    }
    return loss;
}

function getStyleLoss(generatedImage, styleTargets, model){
  const styleFeatures = getStyleTargets(generatedImage, model);
  const styleFeatureGrams = styleFeatures.map(gramMatrix);
  const styleTargetGrams = styleTargets.map(gramMatrix);
  var loss = tf.tensor([0]);
  for (var i = 0; i<styleTargets.length; i++){
    var loss_i = tf.mean(tf.square(tf.sub(styleFeatureGrams[i], styleTargetGrams[i])));
    loss = tf.add(loss, loss_i);
  }
  return loss;
}

function gramMatrix(inputTensor){
  const inputShape = inputTensor.shape;
  const t_Nchw = inputTensor.transpose([0, 3, 1, 2]);
  const t_Ncl = t_Nchw.reshape([inputShape[0], inputShape[3], -1]);
  const t_Nlc = t_Ncl.transpose([0, 2, 1]);
  const result = tf.matMul(t_Ncl, t_Nlc);

  const numLocations = tf.cast(inputShape[1] * inputShape[2], "float32");
  return result.div(numLocations);
}

function getTotalLoss(generatedImage, contentTargets, styleTargets, contentWeight, styleWeight, model){
  const contentLoss = getContentLoss(generatedImage, contentTargets, model);
  const styleLoss = getStyleLoss(generatedImage, styleTargets, model);
  const loss = tf.add(tf.mul(contentLoss, contentWeight), tf.mul(styleLoss, styleWeight));
  // return tf.scalar(loss.dataSync()[0]);
  return loss;
}

function transferStyleTraining(trueContentImage, trueStyleImage, generatedImage, contentWeight, styleWeight, model, epochs=10, learningRate=0.5){
  const optimizer = tf.train.adam(20, 0.50);

  const contentTargets = getContentTargets(trueContentImage, model);
  const styleTargets = getStyleTargets(trueStyleImage, model);
  for (let index = 0; index < epochs; index++) {
    $("#transferbutton").text("Epoch: " + String(index+epochNum));
    const totalLoss = (generatedImage) => getTotalLoss(generatedImage, contentTargets, styleTargets, contentWeight, styleWeight, model);
    const valueAndGrad = tf.valueAndGrad(totalLoss);
    const {value, grad} = valueAndGrad(generatedImage);
    const decayedLearningRate = learningRate * 0.5 ** ((index+epochNum)/10);
    generatedImage = tf.sub(generatedImage, tf.mul(0.3, grad));
    console.log("Epoch: " + String(index+epochNum) + " Loss: " + String(value.dataSync([0])));
  }
  epochNum += epochs;
  $("#transferbutton").text("Completed!");
  // const grads = tf.variableGrads(totalLoss, [generatedImage]);
  // const grads = optimizer.computeGradients(totalLoss);
  // optimizer.applyGradients([grads(generatedImage), generatedImage]);
  generatedImage = tf.clipByValue(generatedImage, 0, 255);
  generatedImage = tf.cast(generatedImage, "int32");
  const generatedImageHeight = generatedImage.shape[0];
  const generatedImageWidth = generatedImage.shape[1];
  if ((canvasHeight/canvasWidth) > (generatedImageHeight/generatedImageWidth)){
    if (window.innerWidth > 600) canvas.style.width = "50vw";
    else canvas.style.width = "80vw";
  } else {
    if (window.innerWidth > 600) canvas.style.height = "60vh";
    else canvas.style.height = "40vh";
  }
  tf.browser.toPixels(generatedImage, canvas);
  return generatedImage;
}

function transferStyle(){
  var contentTargets = getContentTargets(trueContentImage, model);
  var styleTargets = getStyleTargets(trueStyleImage, model);
  var styleLoss = getStyleLoss(generatedImage, contentTargets, model);
  console.log(styleLoss);
}

// load content, style and generated images as tensors
trueContentImage = loadImage(trueContentImage);
trueStyleImage = loadImage(trueStyleImage);
generatedImage = tf.variable(loadImage(generatedImage));