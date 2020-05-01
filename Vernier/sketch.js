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
}

function draw() {
    if (ImgX >= defaultX) ImgX = defaultX;
    if (ImgX <= -1389) ImgX = -1389;
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
        if (ImgX <= defaultX && ImgX >= -1389) {
            let change = [mouseX - oldX, mouseY - oldY];
            ImgX += change[0];
            // ImgY += change[1];
            oldX = mouseX;
            oldY = mouseY;
        }
    }
}

function selectcm() {
    selectmmBool = false;
    selectcmBool = true;
    let zerotemp = document.getElementById("zeroerror").value;
    let measuretemp = document.getElementById("measurement").value;
    if (zerotemp == 0) document.getElementById("zeroerror").value = "0.00";
    if (measuretemp == 0) document.getElementById("measurement").value = "0.00";
}

function selectmm() {
    selectcmBool = false;
    selectmmBool = true;
    let zerotemp = document.getElementById("zeroerror").value;
    let measuretemp = document.getElementById("measurement").value;
    if (zerotemp == 0) document.getElementById("zeroerror").value = "0.0";
    else document.getElementById("zeroerror").value *= 10;
    if (measuretemp == 0) document.getElementById("measurement").value = "0.0";
    else document.getElementById("measurement").value *= 10;
}

function update() {
    let zeroerror = document.getElementById("zeroerror").value;
    let measurement = document.getElementById("measurement").value;
    if (measurement < 0) measurement = 0;
    if (selectcmBool) {
        scaleXoff = Math.floor(Math.abs(zeroerror) * 100);
        if (zeroerror > 0) scaleXoff *= -1;
        armXoff = Math.floor(measurement * 100);
        if (armXoff > 1522) armXoff = 1522;
        ImgX = defaultX - armXoff;
    } else if (selectmmBool) {
        scaleXoff = -1 * Math.floor(zeroerror * 10);
        armXoff = Math.floor(measurement * 10);
        if (armXoff > 1522) armXoff = 1522;
        ImgX = defaultX - armXoff;
    }
}

function checkCrop() {
    if (document.getElementById("cropCheckbox").checked) {
        resizeCanvas(600, 350);
        ImgY = -60;
        defaultX = 0;
        update();
        document.getElementById("sketch-holder").classList.toggle("cropped");
    } else {
        resizeCanvas(800, 600);
        ImgY = 0;
        defaultX = 100;
        update();
        document.getElementById("sketch-holder").classList.toggle("cropped");
    }
}