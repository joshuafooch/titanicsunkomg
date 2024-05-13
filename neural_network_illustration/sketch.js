import {recognize} from "./script.js";

// Initialize variables
let init = 0;
let inputHeight;
let inputY;
let layer1Height;
let layer1Y;
let startingX = 10;

$("#resetbutton").on("click", () => {
    resetCanvases();
});

$("#trained").on("click", () => {
    init = 1;
    illustrationp5.draw();
    init = 0;
});

$("#untrained").on("click", () => {
    init = 1;
    illustrationp5.draw();
    init = 0;
});

$("#centroid").on("click", () => {
    if (!$("#centroid:checked").val() && $("#resize:checked").val()) {
        $("#resize").prop("checked", false);
    }
    init = 1;
    illustrationp5.draw();
    init = 0;
});

$("#resize").on("click", () => {
    $("#centroid").prop("checked", true);
    init = 1;
    illustrationp5.draw();
    init = 0;
});

function resetCanvases() {
    canvasp5.clear();
    canvasp5.background(255);
    illustrationp5.setup();
    $(".predictioncontainer").html("");
}

// Instantiate sketch canvas
let canvas = function(p) {
    p.setup = () => {
        let canvaswidth = 300;
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

export let canvasp5 = new p5(canvas, 'sketch-holder');

// Instantiate illustration canvas
let illustration = async function(p) {
    p.setup = () => {
        let canvasheight = 300;
        p.createCanvas(360, canvasheight);
        $("#illustration-holder").width(360);
        $("#illustration-holder").height(canvasheight);
        if (window.innerWidth > 700) p.pixelDensity(20);
        else p.pixelDensity(5); // limit canvas pixels rendered for mobile devices which have a maximum limit
        p.loadPixels();
        p.background(255);
        p.noLoop();
        // p.frameRate(5); // 5 inferences per second

        // Draw layers and units
        // Input layer
        p.strokeWeight(3);
        inputHeight = Math.floor(0.95 * canvasheight);
        inputY = Math.floor(0.025 * canvasheight);
        layer1Height = Math.floor(0.95 * canvasheight);
        layer1Y = Math.floor(0.025 * canvasheight);

        p.rect(startingX, inputY, 40, inputHeight);
        p.push();
            p.fill(0);
            p.textSize(30);
            p.translate(startingX + 30, 250);
            p.rotate(p.radians(270));
            p.text("Flattened input", 0, 0);
        p.pop();
        for(let i=0; i<10; i++) {
            for(let j=0; j<10; j++) {
                p.push();
                p.stroke(100);
                p.strokeWeight(1);
                p.line(startingX + 50, layer1Y+16+i*28, startingX + 90, layer1Y+16+j*28);
                p.pop();
            }
        }
        // Layer 1
        p.strokeWeight(3);
        p.rect(startingX + 100, layer1Y, 40, layer1Height);
        for(let i=0; i<10; i++) {
            p.strokeWeight(3);
            p.circle(startingX + 120, layer1Y+16 + i*28, 25);
            for(let j=0; j<10; j++) {
                p.push();
                p.stroke(100);
                p.strokeWeight(1);
                p.line(startingX + 150, layer1Y+16+i*28, startingX + 190, layer1Y+16+j*28);
                p.pop();
            }
        }
        // Layer 2
        p.strokeWeight(3);
        p.rect(startingX + 200, layer1Y, 40, layer1Height);
        for(let i=0; i<10; i++) {
            p.strokeWeight(3);
            p.circle(startingX + 220, layer1Y+16 + i*28, 25);
            for(let j=0; j<10; j++) {
                p.push();
                p.stroke(100);
                p.strokeWeight(1);
                p.line(startingX + 250, layer1Y+16+i*28, startingX + 290, inputY+16+j*28);
                p.pop();
            }
        }
        // Layer 3 (Output)
        p.strokeWeight(3);
        p.rect(startingX + 300, inputY, 40, inputHeight);
        for(let i=0; i<10; i++) {
            p.strokeWeight(3);
            p.fill(255);
            p.circle(startingX + 320, inputY+16 + i*28, 25);
            p.textAlign('CENTER');
            p.fill(0);
            p.text(i, startingX + 317, inputY+16+i*28+4);
        }
    };
    
    p.draw = async () => {
        if (init > 0) {
            canvasp5.loadPixels();
            let [activations1, activations2, predictions] = await tf.tidy(() => {
                return recognize(canvasp5.pixels);
            });
            let prediction = tf.argMax(predictions, -1);
            $(".predictioncontainer").html('Prediction: ' + prediction.dataSync()[0]);
            prediction.dispose();
            let activations1Array = activations1.dataSync();
            activations1.dispose();
            let activations2Array = activations2.dataSync();
            activations2.dispose();
            let predictionsArray = predictions.dataSync();
            predictions.dispose();
            let greenColorMap1 = activations1Array.map((x) => Math.round(x * 255));
            let greenColorMap2 = activations2Array.map((x) => Math.round(x * 255));
            let greenColorMap3 = predictionsArray.map((x) => Math.round(x * 255));
            // Layer 1
            p.strokeWeight(3);
            p.fill(255);
            p.rect(startingX + 100, layer1Y, 40, layer1Height);
            for(let i=0; i<10; i++) {
                p.strokeWeight(3);
                p.fill(p.color(0, greenColorMap1[i], 0, 100));
                p.circle(startingX + 120, layer1Y+16 + i*28, 25);
            }
            // Layer 2
            p.strokeWeight(3);
            p.fill(255);
            p.rect(startingX + 200, layer1Y, 40, layer1Height);
            for(let i=0; i<10; i++) {
                p.strokeWeight(3);
                p.fill(p.color(0, greenColorMap2[i], 0, 100));
                p.circle(startingX + 220, layer1Y+16 + i*28, 25);
            }
            // Layer 3 (Output)
            p.strokeWeight(3);
            p.fill(255);
            p.rect(startingX + 300, inputY, 40, inputHeight);
            for(let i=0; i<10; i++) {
                p.strokeWeight(3);
                p.fill(p.color(0, greenColorMap3[i], 0, 100));
                p.circle(startingX + 320, inputY+16 + i*28, 25);
                p.textAlign('CENTER');
                p.fill(0);
                p.text(i, startingX + 317, inputY+16+i*28+4);
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
