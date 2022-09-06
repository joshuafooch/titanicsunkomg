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
let ImgY = -55;
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
    let newWidth;
    let newHeight;
    var canvas = createCanvas(800, 500);
    // Move the canvas so it’s inside our <div id="sketch-holder">.
    canvas.parent('sketch-holder');
    canvasElementX = document.getElementById("sketch-holder").offsetLeft;
    canvasElementY = document.getElementById("sketch-holder").offsetTop;
    measurementslider = document.getElementById("measurementslider");

    //setup canvas size
    if (screen.width >= 900) {
        newWidth = 0.40 * screen.width;
        newHeight = 0.40 * screen.width / 8 * 5;
        checkCrop();
    } else {
        newWidth = screen.width;
        newHeight = screen.width / 600 * 280;
        $("#cropCheckbox").prop("checked", true);
        checkCrop();
    }
    resizing(newWidth, newHeight);
}

function windowResized() {
    let newWidth;
    let newHeight;
    if (screen.width >= 900) {
        newWidth = 0.40 * screen.width;
        newHeight = 0.40 * screen.width / 8 * 5;
        $("#cropCheckbox").prop("checked", false);
        checkCrop();
    } else {
        newWidth = screen.width;
        newHeight = screen.width / 600 * 280;
        $("#cropCheckbox").prop("checked", true);
        checkCrop();
    }
    resizing(newWidth, newHeight);
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
        let temp1 = scaleNum - 5;
        let temp2 = scaleNum + 5;
        if (temp1 < 0) temp1 = temp1 + 50;
        if (temp2 >= 50) temp2 = temp2 - 50;
        if (scaleNum == 0) temp = 50 + scaleNum - 5;
        image(scale0, ImgX + armXoff, ImgY);
        text(temp1, 650 + ImgX + armXoff, 208 + ImgY);
        text(scaleNum, 650 + ImgX + armXoff, 148 + ImgY);
        text(temp2, 650 + ImgX + armXoff, 88 + ImgY);
    } else if (scaleRemainder == 1) {
        let temp1 = scaleNum - 6;
        let temp2 = scaleNum + 4;
        if (temp1 < 0) temp1 = temp1 + 50;
        if (temp2 >= 50) temp2 = temp2 - 50;
        if (scaleNum == 1) temp = 49 + scaleNum - 5;
        image(scale1, ImgX + armXoff, ImgY);
        text(temp1, 650 + ImgX + armXoff, 218 + ImgY);
        text(scaleNum - 1, 650 + ImgX + armXoff, 158 + ImgY);
        text(temp2, 650 + ImgX + armXoff, 98 + ImgY);
    } else if (scaleRemainder == 2) {
        let temp2 = scaleNum + 3;
        if (temp2 >= 50) temp2 = temp2 - 50;
        image(scale2, ImgX + armXoff, ImgY);
        text(scaleNum - 2, 650 + ImgX + armXoff, 173 + ImgY);
        text(temp2, 650 + ImgX + armXoff, 113 + ImgY);
    } else if (scaleRemainder == 3) {
        let temp2 = scaleNum + 2;
        if (temp2 >= 50) temp2 = temp2 - 50;
        image(scale3, ImgX + armXoff, ImgY);
        text(scaleNum - 3, 650 + ImgX + armXoff, 183 + ImgY);
        text(temp2, 650 + ImgX + armXoff, 123 + ImgY);
    } else if (scaleRemainder == 4) {
        let temp1 = scaleNum + 1;
        let temp2 = scaleNum + 6;
        if (temp1 >= 50) temp1 = temp1 - 50;
        if (temp2 >= 50) temp2 = temp2 - 50;
        if (scaleNum == 49) temp = scaleNum - 50 + 6;
        image(scale4, ImgX + armXoff, ImgY);
        text(scaleNum - 4, 650 + ImgX + armXoff, 198 + ImgY);
        text(temp1, 650 + ImgX + armXoff, 138 + ImgY);
        text(temp2, 650 + ImgX + armXoff, 78 + ImgY);
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
    let newWidth = 0.40 * screen.width;
    let newHeight = 0.40 * screen.width / 8 * 5;
    if (document.getElementById("cropCheckbox").checked) {
        resizeCanvas(600, 280);
        defaultX = -295;
        ImgX -= 100;
        document.getElementById("sketch-holder").classList.toggle("cropped");
        leftLimit = 0;
        $("#defaultCanvas0").css({
            'height': 280 / 500 * newHeight + "px"
        });
        $("#defaultCanvas0").css({
            'width': 0.75 * newWidth + "px"
        });
        $("#sketch-holder").css({
            'height': 280 / 500 * newHeight + "px"
        });
        $("#sketch-holder").css({
            'width': 0.75 * newWidth + "px"
        });
    } else {
        resizeCanvas(800, 500);
        defaultX = -195;
        ImgX += 100;
        document.getElementById("sketch-holder").classList.toggle("cropped");
        leftLimit = 0;
        resizing(newWidth, newHeight);
    }
}


function resizing(width, height) {
    $("#defaultCanvas0").css({
        'height': height + "px"
    });
    $("#defaultCanvas0").css({
        'width': width + "px"
    });
    $("#sketch-holder").css({
        'height': height + "px"
    });
    $("#sketch-holder").css({
        'width': width + "px"
    });
    $(".sketchcontainer").css({
        'height': height + "px"
    });
    $(".sketchcontainer").css({
        'width': width + "px"
    });
}