let vernierBodycm;
let vernierMovingcm;
let vernierBodymm;
let vernierMovingmm;
let ImgX = 100;
let ImgY = 0;
let oldX;
let oldY;
let selectcmBool = true;
let selectmmBool = false;
let armXoff = 0;
let scaleXoff = 0;
let defaultX = 100;
let canvasElementX;
let canvasElementY;
let rightLimit = -1423;
let measurementslider;
let maxVern = 1522;

function preload() {
    vernierBody = loadImage("vernierbody.png");
    vernierBodycm = loadImage("vernierbodycm2.png");
    vernierMovingcm = loadImage("verniermovingcm2.png");
    vernierBodymm = loadImage("vernierbodymm2.png");
    vernierMovingmm = loadImage("verniermovingmm2.png");
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
        let factor;
        if (selectcmBool) factor = 100;
        else factor = 10;
        maxVern = 1522 - this.value * factor;
        measurementslider.max = maxVern / factor;
    }
    if (ImgX >= defaultX) ImgX = defaultX;
    if (ImgX <= rightLimit) ImgX = rightLimit;
    background(255);
    image(vernierBody, ImgX, ImgY);
    if (selectcmBool) {
        image(vernierBodycm, ImgX + scaleXoff, ImgY);
        image(vernierMovingcm, ImgX + armXoff, ImgY);
    } else if (selectmmBool) {
        image(vernierBodymm, ImgX + scaleXoff, ImgY);
        image(vernierMovingmm, ImgX + armXoff, ImgY);
    }
}

function mousePressed() {
    oldX = mouseX;
    oldY = mouseY;
}

function mouseDragged() {
    if (mouseX > canvasElementX && mouseX < canvasElementX + width && mouseY > canvasElementY && mouseY < canvasElementY + height) {
        if (ImgX <= defaultX && ImgX >= rightLimit) {
            let change = [mouseX - oldX, mouseY - oldY];
            ImgX += change[0];
            oldX = mouseX;
            oldY = mouseY;
        }
    }
}

function selectcm() {
    measurementslider.max = maxVern / 100;
    selectmmBool = false;
    selectcmBool = true;
    let zerotemp = document.getElementById("zeroerror").value;
    let measuretemp = document.getElementById("measurement").value;
    if (zerotemp == 0) document.getElementById("zeroerror").value = "0.00";
    if (measuretemp == 0) document.getElementById("measurement").value = "0.00";
}

function selectmm() {
    measurementslider.max = maxVern / 10;
    selectcmBool = false;
    selectmmBool = true;
    let zerotemp = document.getElementById("zeroerror").value;
    let measuretemp = document.getElementById("measurement").value;
    if (zerotemp == 0) document.getElementById("zeroerror").value = "0.0";
    if (measuretemp == 0) document.getElementById("measurement").value = "0.0";
}

function update() {
    let zeroerror = document.getElementById("zeroerror").value;
    let measurement = document.getElementById("measurement").value;
    measurementslider.value = measurement;
    let factor;
    if (selectcmBool) factor = 100;
    else factor = 10;
    if (measurement > maxVern / factor) document.getElementById("measurement").value = maxVern / factor;
    else document.getElementById("measurement").value = Math.round(measurement * factor) / factor;
    if (document.getElementById("cropCheckbox").checked) rightLimit = -1523 + zeroerror * factor;
    else rightLimit = -1423 + zeroerror * factor;
    if (measurement < 0) measurement = 0;
    if (selectcmBool) {
        scaleXoff = Math.round(Math.abs(zeroerror) * 100);
        if (zeroerror > 0) scaleXoff *= -1;
        armXoff = Math.round(measurement * 100);
        if (armXoff > maxVern) armXoff = maxVern;
    } else if (selectmmBool) {
        scaleXoff = -1 * Math.round(zeroerror * 10);
        armXoff = Math.round(measurement * 10);
        if (armXoff > maxVern) armXoff = maxVern;
    }
    ImgX = defaultX - armXoff;
}

function checkCrop() {
    if (document.getElementById("cropCheckbox").checked) {
        resizeCanvas(600, 350);
        ImgY = -60;
        defaultX = 0;
        ImgX -= 100;
        document.getElementById("sketch-holder").classList.toggle("cropped");
        let factor;
        if (selectcmBool) factor = 100;
        else factor = 10;
        rightLimit = -1523 + document.getElementById("zeroerror").value * factor;
    } else {
        resizeCanvas(800, 600);
        ImgY = 0;
        defaultX = 100;
        ImgX += 100;
        document.getElementById("sketch-holder").classList.toggle("cropped");
        let factor;
        if (selectcmBool) factor = 100;
        else factor = 10;
        rightLimit = -1423 + document.getElementById("zeroerror").value * factor;
    }
}