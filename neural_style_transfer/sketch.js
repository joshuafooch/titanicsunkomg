var init = 0;
$("#resetbutton").on("click", () => {
    clear();
    background(255);
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
});

window.setup = () => {
    var clientwidth = document.body.clientWidth;
    var canvaswidth = 400;
    if (clientwidth <= 410) {
        canvaswidth = int(0.95 * clientwidth);
    }
    var canvas = createCanvas(canvaswidth, canvaswidth);
    $("#sketch-holder").width(canvaswidth);
    $("#sketch-holder").height(canvaswidth);
    // Move the canvas so it’s inside our <div id="sketch-holder">.
    canvas.parent('sketch-holder');
    pixelDensity(1);
    loadPixels();
    background(255);
    noLoop();
};

window.draw = () => {
    if (init > 0) {
        let black = color(0);
        stroke(black);
        fill(black);
        ellipse(mouseX, mouseY, 20, 20);
        if (pmouseX != null && pmouseY != null) {
            strokeWeight(20);
            line(mouseX, mouseY, pmouseX, pmouseY);
            strokeWeight(1);
        }
    }
};

document.getElementById("sketch-holder").onmousedown = () => {
    init = 1;
    pmouseX = null;
    pmouseY = null;
    loop();
};

document.getElementById("sketch-holder").ontouchstart = (event) => {
    event.preventDefault();
    pmouseX = null;
    pmouseY = null;
    loop();
    init = 1;
};

document.getElementById("sketch-holder").onmouseup = () => {
    init = 0;
    pmouseX = null;
    pmouseY = null;
    loadPixels();
    noLoop();
};

document.getElementById("sketch-holder").ontouchend = () => {
    init = 0;
    pmouseX = null;
    pmouseY = null;
    loadPixels();
    noLoop();
};