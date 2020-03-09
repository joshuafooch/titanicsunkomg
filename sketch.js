var xmax, ymax;
var amin, amax, bmin, bmax;
var numIter;
var widthSlider;
var mp = false;
var count = 0;
var pixArray = [];
var pixToChange = [];
var mouseOriginal = [];
var mouseNow = [];
var sliderOriginal;

function setup() {
    var canvas = createCanvas(800, 800);
    // Move the canvas so it’s inside our <div id="sketch-holder">.
    canvas.parent('sketch-holder');
    background(0);
    pixelDensity(1);
    colorMode(HSB);
    loadPixels();
    widthSlider = document.getElementById("widthSlider");
    widthSlider.addEventListener("mouseup", sliderUp);
    sliderOriginal = widthSlider.value;

    xmax = width * pixelDensity();
    ymax = height * pixelDensity();
    for (i = 0; i < (xmax * ymax * 2 * 2); i++) {
        pixArray.push([0, 0, 0]);
    }


    amin = -2 / pow(2, widthSlider.value);
    amax = 2 / pow(2, widthSlider.value);
    bmin = -2 / pow(2, widthSlider.value);
    bmax = 2 / pow(2, widthSlider.value);
    numIter = 200;

    updatePixArray("setup");
    updateDrawing();
}

function draw() {
    if (mp == true) {
        if (count == 1) {
            mouseNow = [mouseX, mouseY];
            change = [mouseNow[0] - mouseOriginal[0], mouseNow[1] - mouseOriginal[1]];
            var pixArrayClone = [...pixArray];

            // To prevent index falling outside
            for (let i = 0; i < pixToChange.length; i++) {
                let newx = pixToChange[i][0] + change[0];
                let newy = pixToChange[i][1] + change[1];
                if (newx > (xmax * 2)-1) {
                    newx = (xmax * 2)-1;
                } else if (newx < 0) {
                    newx = 0;
                } else if (newy > (ymax * 2)-1) {
                    newy = (ymax * 2)-1;
                } else if (newy < 0) {
                    newy = 0;
                }
                pixToChange[i] = [newx, newy];
            }

            for (let y = 0; y < ymax * 2; y++) {
                for (let x = 0; x < xmax * 2; x++) {
                    if (x < change[0] || y < change[1] || x > xmax * 2 + change[0] || y > ymax * 2 + change[1]) {
                        pixArray[(x + y * xmax * 2)] = [0, 0, 0];
                        pixToChange.push([x, y]);
                    } else {
                        pixArray[(x + y * xmax * 2)] = pixArrayClone[((x - change[0]) + (y - change[1]) * xmax * 2)];
                    }
                }
            }
            
            let achange = map(mouseNow[0], 0, width, amin, amax) - map(mouseOriginal[0], 0, width, amin, amax);
            let bchange = map(mouseNow[1], 0, height, amin, amax) - map(mouseOriginal[1], 0, height, amin, amax);
            amin -= achange;
            amax -= achange;
            bmin -= bchange;
            bmax -= bchange;

            updateDrawing();
            count = 0;
            mouseOriginal = mouseNow; // for the next movement, use mouseNow as the new mouseOriginal
        }
        count++;
    } else {
        mouseNow = [];
        mouseOriginal = [];
        count = 0;
    }
}

function mousePressed() {
    if (mouseX <= width && mouseY <= height) {
        mp = true;
        mouseOriginal = [mouseX, mouseY];
    }
}

function mouseReleased() {
    mp = false;
    updatePixArray("move");
    updateDrawing();
    pixToChange = [];
}

function sliderUp() {
    let awidth = 4 / pow(2, sliderOriginal);
    let bwidth = 4 / pow(2, sliderOriginal);
    amin = (amin + (awidth / 2) - 2 / pow(2, widthSlider.value));
    amax = amin + (4 / pow(2, widthSlider.value));
    bmin = (bmin + (bwidth / 2) - 2 / pow(2, widthSlider.value));
    bmax = bmin + (4 / pow(2, widthSlider.value));

    sliderOriginal = widthSlider.value;

    updatePixArray("zoom");
    updateDrawing();
}

function updateDrawing() {
    for (let y = 0; y < ymax; y++) {
        for (let x = 0; x < xmax; x++) {
            try {
                var r = pixArray[(x + xmax/2) + (y + ymax/2) * (xmax * 2)][0];
            }
            catch(err) {
                console.log(pixArray, (x + xmax/2) + (y + ymax/2) * (xmax * 2), x, y, r);
            }
            let g = pixArray[(x + xmax/2) + (y + ymax/2) * (xmax * 2)][1];
            let b = pixArray[(x + xmax/2) + (y + ymax/2) * (xmax * 2)][2];
            pixels[(y * xmax * 4) + (x * 4) + 0] = round(r);
            pixels[(y * xmax * 4) + (x * 4) + 1] = round(g);
            pixels[(y * xmax * 4) + (x * 4) + 2] = round(b);
            pixels[(y * xmax * 4) + (x * 4) + 3] = 255;
        }
    }
    updatePixels();
}

function updatePixArray(type) {
    if (type == "setup" || type == "zoom") {
        for (let y = 0; y < ymax * 2; y++) {
            for (let x = 0; x < xmax * 2; x++) {
                let aoriginal = map(x, 0, xmax * 2, amin - 2 / pow(2, widthSlider.value), amax + 2 / pow(2, widthSlider.value));
                let boriginal = map(y, 0, ymax * 2, bmin - 2 / pow(2, widthSlider.value), bmax + 2 / pow(2, widthSlider.value));
                let a = aoriginal;
                let b = boriginal;
                let n = 0;

                while (n < numIter){
                    let anew = a * a - b * b + aoriginal;
                    let bnew = 2 * a * b + boriginal;
                    a = anew;
                    b = bnew;
                    n++;

                    if ((a * a + b * b) > 50) {
                        break;
                    }
                }
                
                // let normalised = map(sqrt(n), 0, sqrt(numIter), 0, 1);
                // let colorValue = map(normalised, 0, 1, 360, 255);
                // let c = color(colorValue, 100, 100);
                // let pix = [c._getRed(), c._getGreen(), c._getBlue()];
                // pixArray[x + y * xmax * 2] = pix;
                let colorValue = map(n, 0, numIter, 0, 255);
                let pix = [round(colorValue), round(colorValue), round(colorValue)];
                pixArray[x + y * xmax * 2] = pix;
            }
        }
    } else if (type == "move") {
        for (let i = 0; i < pixToChange.length; i++) {
            let aoriginal = map(pixToChange[i][0], 0, xmax * 2, amin - 2 / pow(2, widthSlider.value), amax + 2 / pow(2, widthSlider.value));
            let boriginal = map(pixToChange[i][1], 0, ymax * 2, bmin - 2 / pow(2, widthSlider.value), bmax + 2 / pow(2, widthSlider.value));
            let a = aoriginal;
            let b = boriginal;
            let n = 0;

            while (n < numIter){
                let anew = a * a - b * b + aoriginal;
                let bnew = 2 * a * b + boriginal;
                a = anew;
                b = bnew;
                n++;

                if ((a * a + b * b) > 50) {
                    break;
                }
            }
            
            // let normalised = map(sqrt(n), 0, sqrt(numIter), 0, 1);
            // let colorValue = map(normalised, 0, 1, 360, 255);
            // let c = color(colorValue, 100, 100);
            // let pix = [c._getRed(), c._getGreen(), c._getBlue()];
            // pixArray[pixToChange[i][0] + pixToChange[i][1] * xmax * 2] = pix;
            let colorValue = map(n, 0, numIter, 0, 255);
            let pix = [round(colorValue), round(colorValue), round(colorValue)];
            pixArray[pixToChange[i][0] + pixToChange[i][1] * xmax * 2] = pix;
        }
    }
}