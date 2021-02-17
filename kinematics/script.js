//window information
var windowWidth = window.innerWidth;
// var windowHeight = window.innerHeight;
// var graphicWidth = document.getElementById("topbox").clientWidth;
// var graphsWidth = document.getElementById("graphs").clientWidth;
// var skydiverWidth = Number(window.getComputedStyle(document.getElementById("manimg")).width.replace("px", ""));

var anim;
var elem = document.getElementById("movingbox");
var convFactor;
var m1 = 0;
var m2 = 0;
var s1 = 0;
var s2 = 0;
var ms1 = 0;
var ms2 = 0;
var defaultPos;
if (windowWidth < 900) {
    defaultPos = (-50 / 900 * 0.5 * windowWidth) - 3;
    convFactor = windowWidth / 948 * 45.;
    $(".allbuttonsspace").css("height", $(".allbuttons").height());
} else {
    defaultPos = -2;
    convFactor = 45.;
}
var pos = defaultPos;
var moveBool = false; //Boolean for whether the object is moving
var counter = 0;
var plotcounter = 0;
$(".plotselector").hide();
$(".dtgraphcontainer").hide();
$(".vtgraphcontainer").hide();

var disslider = document.getElementById("disslider");
var velslider = document.getElementById("velslider");
var accslider = document.getElementById("accslider");
var vel = velslider.value * convFactor;
var acc = accslider.value * convFactor;
$(".timer").html("<b>Timer: </b>" + "<font size='6'>" + m1 + m2 + ":" + s1 + s2 + ":" + ms1 + ms2 + "</font>");
$(".disdisplay").html("<b>Initial Position: </b>" + "<font size='6'>" + disslider.value + " cm</font>");
$(".veldisplay").html("<b>Initial Velocity: </b>" + "<font size='6'>" + velslider.value + " cm/s</font>");
$(".accdisplay").html("<b>Acceleration: </b>" + "<font size='6'>" + accslider.value + " cm/s<sup>2</sup></font>");
$(".disslider").on('input', function() {
    $(".disdisplay").html("<b>Initial Position: </b>" + "<font size='6'>" + this.value + " cm</font>");
    if (moveBool == false) {
        pos = defaultPos + this.value * convFactor;
        elem.style.left = pos + "px";
    } else {
        return;
    }
});
$(".velslider").on('input', function() {
    $(".veldisplay").html("<b>Initial Velocity: </b>" + "<font size='6'>" + this.value + " cm/s</font>");
    vel = this.value * convFactor;
});
$(".accslider").on('input', function() {
    $(".accdisplay").html("<b>Acceleration: </b>" + "<font size='6'>" + this.value + " cm/s<sup>2</sup></font>");
    acc = this.value * convFactor;
});

document.body.onkeydown = function (e) {
    if (e.keyCode == 32) { //spacebar pressed
        if (moveBool == false) {
            myMove();
        } else {
            pause();
        }
    } else if (e.keyCode == 37) { //left button pressed
        if (moveBool == false) {
            leftStep();
        } else {
            return;
        }
    } else if (e.keyCode == 39) { //right button pressed
        if (moveBool == false) {
            rightStep();
        } else {
            return;
        }
    } else if (e.keyCode == 82) { //'R' button pressed
        reset();
    } else if (e.keyCode == 80) { //'P' button pressed
        plotPoints();
    }
}


function myMove() {
    clearInterval(anim);
    anim = setInterval(frame, 10); // This is a repetition loop
}

function frame(step = 0) {
    if (document.getElementById("autograph").checked == true) { //for plotting points
        var steplength = Number(document.getElementById("stepinput").value) * 100; //step length based on input
        if (plotcounter == steplength) {
            plotcounter = 0;
        }
        if (plotcounter == 0) {
            plotPoints();
            plotcounter++;
        } else {
            plotcounter++;
        }
    }
    if (step != 0) { //For steps left or right
        if (counter < step) {
            if (vel >= 0) { //For positive velocity, check right limit
                if (pos >= 940) {
                    moveBool = false;
                    clearInterval(anim);
                } else {
                    moveBool = true;
                    pos += vel / 100.;
                    vel += acc / 100.;
                    elem.style.left = pos + "px";
                    myTimer();
                    counter++;
                }
            } else { //For negative velocity, check left limit
                if (pos < -10) {
                    moveBool = false;
                    clearInterval(anim);
                } else {
                    moveBool = true;
                    pos += vel / 100.;
                    vel += acc / 100.;
                    elem.style.left = pos + "px";
                    myTimer();
                    counter++;
                }
            }
        } else {
            moveBool = false;
            clearInterval(anim);
        }
    } else { //For normal Play
        if (vel >= 0) { //For positive velocity, check right limit
            if (pos >= 940) {
                moveBool = false;
                clearInterval(anim);
            } else {
                moveBool = true;
                pos += vel / 100.;
                vel += acc / 100.;
                elem.style.left = pos + "px";
                myTimer();
            }
        } else { //For negative velocity, check left limit
            if (pos < -10) {
                moveBool = false;
                clearInterval(anim);
            } else {
                moveBool = true;
                pos += vel / 100.;
                vel += acc / 100.;
                elem.style.left = pos + "px";
                myTimer();
            }
        }
    }
}

function reverseFrame(step) {
    if (vel > 0) { //For positive velocity, check left limit for reverse step //
        if (m1 == 0 && m2 == 0 && s1 == 0 && s2 == 0 && ms1 == 0 && ms2 == 0) {
            moveBool = false;
            clearInterval(anim);
        } else if (pos < -10) {
            moveBool = false;
            clearInterval(anim);
        } else {
            if (counter < step) {
                moveBool = true;
                vel -= acc / 100.;
                pos -= vel / 100.;
                elem.style.left = pos + "px";
                reverseTimer();
                counter++;
            } else {
                moveBool = false;
                clearInterval(anim);
            }
        }
    } else if (vel == 0.) {
        if (m1 == 0 && m2 == 0 && s1 == 0 && s2 == 0 && ms1 == 0 && ms2 == 0) {
            moveBool = false;
            clearInterval(anim);
        } else if (pos < 0) {
            moveBool = false;
            clearInterval(anim);
        } else {
            if (counter < step) {
                moveBool = true;
                vel -= acc / 100.;
                pos -= vel / 100.;
                elem.style.left = pos + "px";
                reverseTimer();
                counter++;
            } else {
                moveBool = false;
                clearInterval(anim);
            }
        }
    } else { //For negative velocity, check right limit for reverse step //
        if (m1 == 0 && m2 == 0 && s1 == 0 && s2 == 0 && ms1 == 0 && ms2 == 0) {
            moveBool = false;
            clearInterval(anim);
        } else if (pos >= 940) {
            moveBool = false;
            clearInterval(anim);
        } else {
            if (counter < step) {
                moveBool = true;
                vel -= acc / 100.;
                pos -= vel / 100.;
                elem.style.left = pos + "px";
                reverseTimer();
                counter++;
            } else {
                moveBool = false;
                clearInterval(anim);
            }
        }
    }
}

function myTimer() {
    ms2++;
    if (ms2 == 10) {
        ms1++;
        ms2 = 0;
    }
    if (ms1 == 10) {
        s2++;
        ms1 = 0;
    }
    if (s2 == 10) {
        s1++;
        s2 = 0;
    }
    if (s1 == 6) {
        m2++;
        s1 = 0;
    }
    if (m2 == 10) {
        m1++;
        m2 = 0;
    }
    $(".timer").html("<b>Timer: </b>" + "<font size='6'>" + m1 + m2 + ":" + s1 + s2 + ":" + ms1 + ms2 + "</font>");
}

function reverseTimer() {
    ms2--;
    if (ms2 == -1) {
        ms1--;
        ms2 = 9;
    }
    if (ms1 == -1) {
        s2--;
        ms1 = 9;
    }
    if (s2 == -1) {
        s1--;
        s2 = 9;
    }
    if (s1 == -1) {
        m2--;
        s1 = 9;
    }
    if (m2 == -1) {
        m1--;
        m2 = 9;
    }
    if (m1 == -1) {
        m1 = 0;
    }
    document.getElementById("timer").innerHTML = "<b>Timer: </b>" + "<font size='6'>" + m1 + m2 + ":" + s1 + s2 + ":" + ms1 + ms2 + "</font>";
}

function pause() {
    moveBool = false;
    clearInterval(anim);
}

function reset() {
    moveBool = false;
    clearInterval(anim);
    m1 = 0;
    m2 = 0;
    s1 = 0;
    s2 = 0;
    ms1 = 0;
    ms2 = 0;
    counter = 0;
    plotcounter = 0;
    $(".timer").html("<b>Timer: </b>" + "<font size='6'>" + m1 + m2 + ":" + s1 + s2 + ":" + ms1 + ms2 + "</font>");
    disslider = document.getElementById("disslider");
    velslider = document.getElementById("velslider");
    accslider = document.getElementById("accslider");
    pos = defaultPos + disslider.value * convFactor;
    elem.style.left = pos + "px";
    vel = velslider.value * convFactor;
    acc = accslider.value * convFactor;
    tdata = [];
    dtydata = [];
    vtydata = [];
    Plotly.newPlot(dtgraph, [{
        x: tdata,
        y: dtydata
    }], {
        margin: {
            t: 0
        }
    });
    Plotly.newPlot(vtgraph, [{
        x: tdata,
        y: vtydata
    }], {
        margin: {
            t: 0
        }
    });
}

function rightStep() {
    if (moveBool == true) {
        return;
    } else {
        var steplength = Number(document.getElementById("stepinput").value) * 100; //step length based on input
        counter = 0;
        anim = setInterval(frame, 10, steplength); // 10ms per frame, i.e. 100 frames per second
    }
}

function leftStep() {
    if (moveBool == true) {
        return;
    } else {
        var steplength = Number(document.getElementById("stepinput").value) * 100; //step length based on input
        counter = 0;
        anim = setInterval(reverseFrame, 10, steplength); // 10ms per frame, i.e. 100 frames per second
    }
}

function graphCheck() {
    if (document.getElementById("showgraph").checked == true) {
        $(".plotselector").show();
        $(".dtgraphcontainer").show();
        $(".vtgraphcontainer").show();
    } else {
        $(".plotselector").hide();
        $(".dtgraphcontainer").hide();
        $(".vtgraphcontainer").hide();
    }
}

var tdata = [];
var dtydata = [];
var vtydata = [];
dtgraph = document.getElementById('dtgraph');
vtgraph = document.getElementById('vtgraph');
Plotly.newPlot(dtgraph, [{
    x: tdata,
    y: dtydata
}], {
    margin: {
        t: 0
    }
});
Plotly.newPlot(vtgraph, [{
    x: tdata,
    y: vtydata
}], {
    margin: {
        t: 0
    }
});

function plotPoints() {
    var t = (ms2 / 100.) + (ms1 / 10.) + s2 + s1 * 10. + m2 * 60. + m1 * 10 * 60.;
    var d = (pos - defaultPos) / convFactor;
    var v = vel / convFactor;
    tdata.push(t);
    dtydata.push(d);
    vtydata.push(v);
    Plotly.newPlot(dtgraph, [{
        x: tdata,
        y: dtydata
    }], {
        margin: {
            t: 0
        }
    });
    Plotly.newPlot(vtgraph, [{
        x: tdata,
        y: vtydata
    }], {
        margin: {
            t: 0
        }
    });
}