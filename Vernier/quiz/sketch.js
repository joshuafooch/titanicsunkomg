let vernierBodycm;
let vernierMovingcm;
let vernierBodymm;
let vernierMovingmm;
let ImgX = 0;
let ImgY = -60;
let oldX;
let oldY;
let selectcmBool = true;
let selectmmBool = false;
let armXoff = 0;
let scaleXoff = 0;
let defaultX = 0;
let canvasElementX;
let canvasElementY;
let rightLimit = -1423;
let measurement;
let maxVern = 1522;
let streak = 0;

function preload() {
    vernierBody = loadImage("../vernierbody.png");
    vernierBodycm = loadImage("../vernierbodycm2.png");
    vernierMovingcm = loadImage("../verniermovingcm2.png");
    vernierBodymm = loadImage("../vernierbodymm2.png");
    vernierMovingmm = loadImage("../verniermovingmm2.png");
}

function setup() {
    let newWidth;
    let newHeight;
    var canvas = createCanvas(600, 350);
    // Move the canvas so it’s inside our <div id="sketch-holder">.
    canvas.parent('sketch-holder');
    canvasElementX = document.getElementById("sketch-holder").offsetLeft;
    canvasElementY = document.getElementById("sketch-holder").offsetTop;
    randomReading();
    update();

    //setup canvas size
    if (screen.width >= 900) {
        newWidth = 0.40 * screen.width;
        newHeight = 0.40 * screen.width / 4 * 3 / 0.75 * 297.5 / 510;
    } else {
        newWidth = screen.width;
        newHeight = screen.width / 4 * 3 / 0.75 * 297.5 / 510;
    }
    resizing(newWidth, newHeight);
}

function windowResized() {
    let newWidth;
    let newHeight;
    if (screen.width >= 900) {
        newWidth = 0.40 * screen.width;
        newHeight = 0.40 * screen.width / 4 * 3 / 0.75 * 297.5 / 510;
    } else {
        newWidth = screen.width;
        newHeight = screen.width / 4 * 3 / 0.75 * 297.5 / 510;
    }
    resizing(newWidth, newHeight);
}

function draw() {
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

function update() {
    if (selectcmBool) {
        armXoff = Math.round(measurement * 100);
        if (armXoff > maxVern) armXoff = maxVern;
    } else if (selectmmBool) {
        armXoff = Math.round(measurement * 10);
        if (armXoff > maxVern) armXoff = maxVern;
    }
    ImgX = defaultX - armXoff;
}

function randomReading() {
    let dice = Math.random();
    if (dice <= 0.5) { // cm reading
        measurement = Math.round(Math.random() * 1310) / 100;
        selectcmBool = true;
        selectmmBool = false;
        $(".unit").html(" cm");
    } else {
        measurement = Math.round(Math.random() * 1310) / 10;
        selectcmBool = false;
        selectmmBool = true;
        $(".unit").html(" mm");
    }
}


function submit() {
    let userinput = $(".readinginput").val();
    let userinputNum = Number(userinput);
    if (selectcmBool) {
        if (userinputNum.toFixed(2) == userinput) { // check 2 dp
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
    } else if (selectmmBool) {
        if (userinputNum.toFixed(1) == userinput) { // check 1 dp
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