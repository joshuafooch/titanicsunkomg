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
let measurement;
let maxCal = 25;
let streak = 0;

function preload() {
    body = loadImage("../body.png");
    spindle = loadImage("../spindle.png");
    thimble = loadImage("../thimble.png");
    scale0 = loadImage("../scale0.png");
    scale1 = loadImage("../scale1.png");
    scale2 = loadImage("../scale2.png");
    scale3 = loadImage("../scale3.png");
    scale4 = loadImage("../scale4.png");
    cutoff = loadImage("../cutoff.png");
}

function setup() {
    let newWidth;
    let newHeight;
    var canvas = createCanvas(600, 280);
    ImgY = 0;
    defaultX = -295;
    ImgX -= 100;
    leftLimit = 0;
    // Move the canvas so it’s inside our <div id="sketch-holder">.
    canvas.parent('sketch-holder');
    canvasElementX = document.getElementById("sketch-holder").offsetLeft;
    canvasElementY = document.getElementById("sketch-holder").offsetTop;
    randomReading();
    update();

    //setup canvas size
    if (screen.width >= 900) {
        newWidth = 0.40 * screen.width;
        newHeight = 0.40 * screen.width / 600 * 280;
    } else {
        newWidth = screen.width;
        newHeight = screen.width / 600 * 280;
    }
    resizing(newWidth, newHeight);
}

function windowResized() {
    let newWidth;
    let newHeight;
    if (screen.width >= 900) {
        newWidth = 0.40 * screen.width;
        newHeight = 0.40 * screen.width / 600 * 280;
    } else {
        newWidth = screen.width;
        newHeight = screen.width / 600 * 280;
    }
    resizing(newWidth, newHeight);
}

function draw() {
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
    spindleXoff = Math.floor(measurement * 10) * 0.95;
    armXoff = Math.floor((measurement) * 10);
    ImgX = defaultX - armXoff;
    scaleRemainder = (Math.round((measurement) * 100) - armXoff * 10) % 5;
    scaleNum = Math.floor(Math.round(((measurement) - Math.floor(measurement)) * 100) % 50);
}

function randomReading() {
    measurement = Math.round(Math.random() * 2500) / 100;
}

function submit() {
    let userinput = $(".readinginput").val();
    let userinputNum = Number(userinput);
    if (userinputNum.toFixed(2) == userinput) {
        if (userinput == measurement) {
            correctAnswer();
            randomReading();
            redraw();
            update();
        } else {
            wrongAnswer();
        }
    } else {
        wrongDP();
    }
}

function correctAnswer() {
    streak += 1;
    $(".remarks").html("Correct! Try another one :)");
    $(".remarks").addClass("correct");
    $(".remarks").removeClass("wrong");
    $(".streak").html("Your streak: " + streak);
    $(".readinginput").val("");
}

function wrongAnswer() {
    streak = 0;
    $(".remarks").html("Incorrect, please try again!");
    $(".remarks").addClass("wrong");
    $(".remarks").removeClass("correct");
    $(".streak").html("Your streak: " + streak);
}

function wrongDP() {
    streak = 0;
    $(".remarks").html("Your number of d.p. is incorrect!");
    $(".remarks").addClass("wrong");
    $(".remarks").removeClass("correct");
    $(".streak").html("Your streak: " + streak);
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