var balls;
var container;
var ballNum = 300;
var dustNum = 1;
var dustMass = 75;
var dustSize = 20;
var vLimit = 10;
var visibleBool;
var drawTrace = false;

function setup() {
    var canvas = createCanvas(800, 800);
    // Move the canvas so it’s inside our <div id="sketch-holder">.
    canvas.parent('sketch-holder');

    $(".airvalue").text(ballNum);
    $("#airslider").on("input", function () {
        $(".airvalue").text(this.value);
        ballNum = this.value;
        reset();
    });
    balls = new Flock();
    container = new Ball("container", 400, 400, 800, 0, 0, 1);
    visibleBool = document.getElementById("visible");

    for (i = 0; i < dustNum; i++) {
        x = 400 + 50 * sin(2 * PI / dustNum * i);
        y = 400 + 50 * cos(2 * PI / dustNum * i);
        balls.list.push(new Ball("dust", x, y, dustSize, 0, 0, dustMass));
    }

    for (i = 0; i < ballNum; i++) {
        let m = 1;
        let w = 5 * m;
        let x;
        let y;
        if (i < (ballNum / 2)) {
            x = 400 + 300 * sin(2 * PI / (ballNum / 2) * i);
            y = 400 + 300 * cos(2 * PI / (ballNum / 2) * i);
        } else {
            x = 400 + 200 * sin(2 * PI / (ballNum / 2) * i);
            y = 400 + 200 * cos(2 * PI / (ballNum / 2) * i);
        }
        let vx = random(-vLimit, vLimit);
        let vy = random(-vLimit, vLimit);
        balls.list.push(new Ball("air", x, y, w, vx, vy, m));
    }
}

function draw() {
    background(0);
    container.display();
    balls.update(container);
}

function brownian() {
    dustNum = 1;
    reset();
}

function diffusion() {
    dustNum = 10;
    reset();
}

function traceClick() {
    drawTrace = document.getElementById("trace").checked;
    for (let i = 0; i < dustNum; i++) {
        balls.list[i].trace = [];
    }
}

function reset() {
    balls = new Flock();
    container = new Ball("container", 400, 400, 800, 0, 0, 1);
    visibleBool = document.getElementById("visible");

    for (i = 0; i < dustNum; i++) {
        x = 400 + 50 * sin(2 * PI / dustNum * i);
        y = 400 + 50 * cos(2 * PI / dustNum * i);
        balls.list.push(new Ball("dust", x, y, dustSize, 0, 0, dustMass));
    }

    for (i = 0; i < ballNum; i++) {
        let m = 1;
        let w = 5 * m;
        let x;
        let y;
        if (i < (ballNum / 2)) {
            x = 400 + 300 * sin(2 * PI / (ballNum / 2) * i);
            y = 400 + 300 * cos(2 * PI / (ballNum / 2) * i);
        } else {
            x = 400 + 200 * sin(2 * PI / (ballNum / 2) * i);
            y = 400 + 200 * cos(2 * PI / (ballNum / 2) * i);
        }
        let vx = random(-vLimit, vLimit);
        let vy = random(-vLimit, vLimit);
        balls.list.push(new Ball("air", x, y, w, vx, vy, m));
    }
}

function slowmo() {
    if (document.getElementById("slowmo").checked == false) {
        frameRate(60);
    } else {
        frameRate(15);
    }
}