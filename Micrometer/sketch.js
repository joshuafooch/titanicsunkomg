let body;
let spindle;
let thimble;
let scaleRemainder = 0;
let scale0;
let scale1;
let scale2;
let scale3;
let scale4;
let cutoff;
let defaultX = -195;
let ImgX = defaultX;
let ImgY = 0;
let oldX;
let oldY;
let spindleXoff = 0;
let armXoff = 0;
let leftLimit = 0;
let canvasElementX;
let canvasElementY;
let rightLimit = -653;
let scaleNum = 0;
let measurementslider;
let maxCal = 25;

function preload() {
    body = loadImage("body.png");
    spindle = loadImage("spindle.png");
    thimble = loadImage("thimble.png");
    scale0 = loadImage("scale0.png");
    scale1 = loadImage("scale1.png");
    scale2 = loadImage("scale2.png");
    scale3 = loadImage("scale3.png");
    scale4 = loadImage("scale4.png");
    cutoff = loadImage("cutoff.png");
}

function setup() {
    var canvas = createCanvas(800, 600);
    // Move the canvas so it’s inside our <div id="sketch-holder">.
    canvas.parent('sketch-holder');
    canvasElementX = document.getElementById("sketch-holder").offsetLeft;
    canvasElementY = document.getElementById("sketch-holder").offsetTop;
    measurementslider = document.getElementById("measurementslider");
}

function draw() {
    measurementslider.oninput = function () {
        document.getElementById("measurement").value = this.value;
        update();
    }
    document.getElementById("zeroerror").oninput = function () {
        maxCal = 25 - this.value;
        measurementslider.max = maxCal;
    }

    if (ImgX >= leftLimit) ImgX = leftLimit;
    if (ImgX <= rightLimit) ImgX = rightLimit;
    background(255);
    textSize(25);
    fill(0);
    image(spindle, ImgX + spindleXoff, ImgY);
    image(body, ImgX, ImgY);
    image(thimble, ImgX + armXoff, ImgY);
    if (scaleRemainder == 0) {
        let temp = scaleNum - 5;
        if (scaleNum == 0) temp = 50 + scaleNum - 5;
        image(scale0, ImgX + armXoff, ImgY);
        text(temp, 650 + ImgX + armXoff, 208);
        text(scaleNum, 650 + ImgX + armXoff, 148);
        text(scaleNum + 5, 650 + ImgX + armXoff, 88);
    } else if (scaleRemainder == 1) {
        let temp = scaleNum - 6;
        if (scaleNum == 1) temp = 49 + scaleNum - 5;
        image(scale1, ImgX + armXoff, ImgY);
        text(temp, 650 + ImgX + armXoff, 218);
        text(scaleNum - 1, 650 + ImgX + armXoff, 158);
        text(scaleNum + 4, 650 + ImgX + armXoff, 98);
    } else if (scaleRemainder == 2) {
        image(scale2, ImgX + armXoff, ImgY);
        text(scaleNum - 2, 650 + ImgX + armXoff, 173);
        text(scaleNum + 3, 650 + ImgX + armXoff, 113);
    } else if (scaleRemainder == 3) {
        image(scale3, ImgX + armXoff, ImgY);
        text(scaleNum - 3, 650 + ImgX + armXoff, 183);
        text(scaleNum + 2, 650 + ImgX + armXoff, 123);
    } else if (scaleRemainder == 4) {
        let temp = scaleNum + 6;
        if (scaleNum == 49) temp = scaleNum - 50 + 6;
        image(scale4, ImgX + armXoff, ImgY);
        text(scaleNum - 4, 650 + ImgX + armXoff, 198);
        text(scaleNum + 1, 650 + ImgX + armXoff, 138);
        text(temp, 650 + ImgX + armXoff, 78);
    }
    image(cutoff, ImgX + armXoff, ImgY);
}

function mousePressed() {
    oldX = mouseX;
    oldY = mouseY;
}

function mouseDragged() {
    if (mouseX > canvasElementX && mouseX < canvasElementX + width && mouseY > canvasElementY && mouseY < canvasElementY + height) {
        if (ImgX <= leftLimit && ImgX >= rightLimit) {
            let change = [mouseX - oldX, mouseY - oldY];
            ImgX += change[0];
            oldX = mouseX;
            oldY = mouseY;
        }
    }
}

function update() {
    let zeroerror = Number(document.getElementById("zeroerror").value);
    let measurement = Number(document.getElementById("measurement").value);
    measurementslider.value = measurement;
    if (measurement > maxCal) document.getElementById("measurement").value = maxCal;
    else document.getElementById("measurement").value = Math.round(measurement * 100) / 100;
    if (measurement < 0) measurement = 0;
    spindleXoff = Math.floor(measurement * 10) * 0.95;
    armXoff = Math.floor((measurement + zeroerror) * 10);
    if (armXoff > 250) armXoff = 250;
    ImgX = defaultX - armXoff;
    if (measurement > maxCal) {
        scaleRemainder = 0;
        scaleNum = 0;
    } else {
        scaleRemainder = (Math.round((measurement + zeroerror) * 100) - armXoff * 10) % 5;
        scaleNum = Math.floor(Math.round(((measurement + zeroerror) - Math.floor(measurement + zeroerror)) * 100) % 50);
    }
}

function checkCrop() {
    if (document.getElementById("cropCheckbox").checked) {
        resizeCanvas(600, 280);
        ImgY = 0;
        defaultX = -295;
        ImgX -= 100;
        document.getElementById("sketch-holder").classList.toggle("cropped");
        leftLimit = 0;
    } else {
        resizeCanvas(800, 600);
        ImgY = 0;
        defaultX = -195;
        ImgX += 100;
        document.getElementById("sketch-holder").classList.toggle("cropped");
        leftLimit = 0;
    }
}