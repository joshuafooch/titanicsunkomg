import {recognize} from "./script.js";

// Initialize variables
let init = 0;
let inputHeight;
let inputY;
let layer1Height;
let layer1Y;

$("#resetbutton").on("click", () => {
    resetCanvases();
});

$("#trained").on("click", () => {
    init = 1;
    illustrationp5.loop();
    init = 0;
    illustrationp5.noLoop();
});

$("#untrained").on("click", () => {
    init = 1;
    illustrationp5.loop();
    init = 0;
    illustrationp5.noLoop();
});

function resetCanvases() {
    canvasp5.clear();
    canvasp5.background(255);
    illustrationp5.setup();
    $(".predictioncontainer").html("");
    $(".tooltip").removeClass("tooltipreceived");
    $(".explanationcontainer").removeClass("explanationreceived");
    $(".submitted").hide();
    if ($("#showprocessing").prop("checked")) {
        $(".unsubmitted").show();
        $(".notshown").hide();
      } else {
        $(".unsubmitted").hide();
        $(".notshown").show();
      }
}

// Instantiate sketch canvas
let canvas = function(p) {
    p.setup = () => {
        var clientwidth = document.body.clientWidth;
        var canvaswidth = 300;
        if (clientwidth <= 310) {
            canvaswidth = Math.round(0.95 * clientwidth);
        }
        p.createCanvas(canvaswidth, canvaswidth);
        $("#sketch-holder").width(canvaswidth);
        $("#sketch-holder").height(canvaswidth);
    
        p.pixelDensity(1);
        p.loadPixels();
        p.background(255);
        p.noLoop();
    };
    
    p.draw = () => {
        if (init > 0) {
            let black = p.color(0);
            p.stroke(black);
            p.fill(black);
            p.ellipse(p.mouseX, p.mouseY, 20, 20);
            if (p.pmouseX != null && p.pmouseY != null) {
                p.strokeWeight(20);
                p.line(p.mouseX, p.mouseY, p.pmouseX, p.pmouseY);
                p.strokeWeight(1);
            }
        }
    };
    
}

export var canvasp5 = new p5(canvas, 'sketch-holder');

// Instantiate illustration canvas
let illustration = async function(p) {
    p.setup = () => {
        var clientwidth = document.body.clientWidth;
        var canvaswidth = 300;
        if (clientwidth <= 310) {
            canvaswidth = Math.round(0.95 * clientwidth);
        }
        p.createCanvas(450, canvaswidth);
        $("#illustration-holder").width(450);
        $("#illustration-holder").height(canvaswidth);
    
        p.pixelDensity(20);
        p.loadPixels();
        p.background(255);
        p.noLoop();
        p.frameRate(5); // 5 inferences per second

        // Draw layers and units
        // Input layer
        p.strokeWeight(3);
        inputHeight = Math.floor(0.95 * canvaswidth);
        inputY = Math.floor(0.025 * canvaswidth);
        layer1Height = Math.floor(0.95 * canvaswidth);
        layer1Y = Math.floor(0.025 * canvaswidth);
        p.rect(50, inputY, 40, inputHeight);
        p.push();
            p.fill(0);
            p.textSize(30);
            p.translate(80, 250);
            p.rotate(p.radians(270));
            p.text("Flattened input", 0, 0);
        p.pop();
        for(let i=0; i<10; i++) {
            for(let j=0; j<10; j++) {
                p.push();
                p.stroke(100);
                p.strokeWeight(1);
                p.line(100, layer1Y+16+i*28, 140, layer1Y+16+j*28);
                p.pop();
            }
        }
        // Layer 1
        p.strokeWeight(3);
        p.rect(150, layer1Y, 40, layer1Height);
        for(let i=0; i<10; i++) {
            p.strokeWeight(3);
            p.circle(170, layer1Y+16 + i*28, 25);
            for(let j=0; j<10; j++) {
                p.push();
                p.stroke(100);
                p.strokeWeight(1);
                p.line(200, layer1Y+16+i*28, 240, layer1Y+16+j*28);
                p.pop();
            }
        }
        // Layer 2
        p.strokeWeight(3);
        p.rect(250, layer1Y, 40, layer1Height);
        for(let i=0; i<10; i++) {
            p.strokeWeight(3);
            p.circle(270, layer1Y+16 + i*28, 25);
            for(let j=0; j<10; j++) {
                p.push();
                p.stroke(100);
                p.strokeWeight(1);
                p.line(300, layer1Y+16+i*28, 340, inputY+16+j*28);
                p.pop();
            }
        }
        // Layer 3 (Output)
        p.strokeWeight(3);
        p.rect(350, inputY, 40, inputHeight);
        for(let i=0; i<10; i++) {
            p.strokeWeight(3);
            p.fill(255);
            p.circle(370, inputY+16 + i*28, 25);
            p.textAlign('CENTER');
            p.fill(0);
            p.text(i, 367, inputY+16+i*28+4);
        }
    };
    
    p.draw = async () => {
        if (init > 0) {
            canvasp5.loadPixels();
            let [activations1, activations2, predictions] = await recognize(canvasp5.pixels);
            let prediction = tf.argMax(predictions, -1).dataSync()[0];
            $(".predictioncontainer").html('Prediction: ' + prediction);
            activations1 = activations1.dataSync();
            activations2 = activations2.dataSync();
            predictions = predictions.dataSync();
            let greenColorMap1 = activations1.map((x) => Math.round(x * 255));
            let greenColorMap2 = activations2.map((x) => Math.round(x * 255));
            let greenColorMap3 = predictions.map((x) => Math.round(x * 255));
            // Layer 1
            p.strokeWeight(3);
            p.fill(255);
            p.rect(150, layer1Y, 40, layer1Height);
            for(let i=0; i<10; i++) {
                p.strokeWeight(3);
                p.fill(p.color(0, greenColorMap1[i], 0, 100));
                p.circle(170, layer1Y+16 + i*28, 25);
            }
            // Layer 2
            p.strokeWeight(3);
            p.fill(255);
            p.rect(250, layer1Y, 40, layer1Height);
            for(let i=0; i<10; i++) {
                p.strokeWeight(3);
                p.fill(p.color(0, greenColorMap2[i], 0, 100));
                p.circle(270, layer1Y+16 + i*28, 25);
            }
            // Layer 3 (Output)
            p.strokeWeight(3);
            p.fill(255);
            p.rect(350, inputY, 40, inputHeight);
            for(let i=0; i<10; i++) {
                p.strokeWeight(3);
                p.fill(p.color(0, greenColorMap3[i], 0, 100));
                p.circle(370, inputY+16 + i*28, 25);
                p.textAlign('CENTER');
                p.fill(0);
                p.text(i, 367, inputY+16+i*28+4);
            }
        }
    };
    
}

let illustrationp5 = new p5(illustration, 'illustration-holder');

// Setup mouse/touch events for sketch canvas
document.getElementById("sketch-holder").onmousedown = () => {
    init = 1;
    canvasp5.pmouseX = null;
    canvasp5.pmouseY = null;
    canvasp5.loop();
    illustrationp5.loop();
};

document.getElementById("sketch-holder").ontouchstart = (event) => {
    event.preventDefault();
    canvasp5.pmouseX = null;
    canvasp5.pmouseY = null;
    canvasp5.loop();
    illustrationp5.loop();
    init = 1;
};

document.getElementById("sketch-holder").onmouseup = () => {
    init = 0;
    canvasp5.pmouseX = null;
    canvasp5.pmouseY = null;
    canvasp5.loadPixels();
    canvasp5.noLoop();
    illustrationp5.noLoop();
};

document.getElementById("sketch-holder").ontouchend = () => {
    init = 0;
    canvasp5.pmouseX = null;
    canvasp5.pmouseY = null;
    canvasp5.loadPixels();
    canvasp5.noLoop();
    illustrationp5.noLoop();
};
