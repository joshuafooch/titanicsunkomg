//window information
var windowWidth = window.innerWidth;
var graphicWidth = document.getElementById("graphic").clientWidth;
var graphsWidth = document.getElementById("graphs").clientWidth;
var skydiverWidth = Number(window.getComputedStyle(document.getElementById("manimg")).width.replace("px", ""));

var planePos = 0.5 * graphicWidth - 150;
var planeTop = 50;
var skydiverPos = 70;
var moveoffInterval;
var coeffChangeInterval;
var simulation;
var counter = 0;
var currentParachute = 0;
var beginningclouds = [];
var clouds = [];
var cloudCount = 0;
var cloudCounter = 0;
var noResistance = false;

var timestepFactor = 35;
var time = 0;
var pos = 0;
var vel = 0;
var acc = 10;
var mass = 80;
var grav = 10;
$(".massvalue").text("80 kg");
$("#massslider").on("input", function () {
    $(".massvalue").text(this.value + " kg");
    mass = this.value;
    document.getElementById("weightValue").innerHTML = (mass * grav) + " N";
});
var drag = 0;
var dragcoeff = 0.08 / 0.4356; //default drag coefficient of man
var dragcoeffStep;
var dragCounter = 0;
var dragChangeTime = 2000; //It takes 2 seconds for the parachute to fully
var arrowFactor = 15;
$(".resistancebody").css("height", (mass * drag / arrowFactor) + "px");

var weightLength;

$(".skydiver").hide();
$(".parachute1").hide();
$(".parachute2").hide();
document.getElementById("weightValue").innerHTML = (mass * grav) + " N";
$(".weight").hide();
$(".airresistance").hide();
document.getElementById("smallParachuteButton").disabled = true;
document.getElementById("largeParachuteButton").disabled = true;

//Beginning clouds
var beginningCloudInterval = setInterval(() => {
    let checkNum = Math.random() * Math.pow(cloudCounter, 2) * 0.5;
    if (checkNum > 600) {
        cloudCount++;
        generateCloud(cloudCount, clouds, 0);
        cloudCounter = 0;
    }
    cloudCounter++;

    for (cloud of clouds) {
        cloud.movex();
        cloud.updatex();
        cloud.destroy();
    }
}, 1000 / timestepFactor);


//Initialise graph
var tdata = [];
var dtydata = [];
var vtydata = [];
var dtgraph = document.getElementById('dtgraph');
var vtgraph = document.getElementById('vtgraph');
var layout = {
    autosize: false,
    width: graphsWidth,
    height: 300,
    margin: {
        l: 50,
        r: 50,
        b: 50,
        t: 0,
        pad: 0
    }
};
Plotly.newPlot(dtgraph, [{
    x: tdata,
    y: dtydata
}], layout);
Plotly.newPlot(vtgraph, [{
    x: tdata,
    y: vtydata
}], layout);

function smallChute() {
    clearInterval(coeffChangeInterval);
    let dragcoeffMax = 0.8 / 0.4356;
    let dragcoeffChange = dragcoeffMax - dragcoeff;
    dragcoeffStep = dragcoeffChange / (dragChangeTime / timestepFactor);
    coeffChangeInterval = setInterval(coeffChange, dragChangeTime / timestepFactor);
    $(".parachute2").hide();
    $(".parachute1").show();

    if (noResistance == false) {
        if (currentParachute == 0) {
            $(".skydiver").addClass("pullback");
            setTimeout(() => $(".skydiver").removeClass("pullback"), 5000);
        } else if (currentParachute == 2) {
            $(".skydiver").addClass("rushdown");
            setTimeout(() => $(".skydiver").removeClass("rushdown"), 5000);
        }
    }
    currentParachute = 1;
}

function largeChute() {
    clearInterval(coeffChangeInterval);
    let dragcoeffMax = 8 / 0.4356;
    let dragcoeffChange = dragcoeffMax - dragcoeff;
    dragcoeffStep = dragcoeffChange / (dragChangeTime / timestepFactor);
    coeffChangeInterval = setInterval(coeffChange, dragChangeTime / timestepFactor);
    $(".parachute1").hide();
    $(".parachute2").show();

    if (noResistance == false) {
        if (currentParachute == 0 || currentParachute == 1) {
            $(".skydiver").addClass("pullback");
            setTimeout(() => $(".skydiver").removeClass("pullback"), 5000);
        }
    }
    currentParachute = 2;
}

function coeffChange() {
    dragcoeff += dragcoeffStep;
    dragCounter++;
    if (dragCounter >= (dragChangeTime / timestepFactor)) {
        clearInterval(coeffChangeInterval);
        dragCounter = 0;
    }
}

function startOff() {
    setTimeout(() => clearInterval(beginningCloudInterval), 2500);
    plotPoints();
    simulation = setInterval(play, 1000 / timestepFactor);
    moveoffInterval = setInterval(planeMoveOff, 1000 / timestepFactor);
    $(".skydiver").show();
    document.getElementById("smallParachuteButton").disabled = false;
    document.getElementById("largeParachuteButton").disabled = false;
    document.getElementById("massslider").disabled = true;
    $("#massslider").removeClass("sliderhover");
    document.getElementById("startButton").disabled = true;
    document.getElementById("noresistance").disabled = true;

    //initiate weight arrow length
    weightLength = mass * grav / arrowFactor;
    $(".weightbody").css("height", weightLength + "px");
}

function planeMoveOff() {
    if (windowWidth > 900) { //For large devices
        if (planePos > -300) { //When plane is still in sight
            planePos -= 2 * 100 / timestepFactor;
            planeTop -= 1.5 * 100 / timestepFactor;
            skydiverPos += 3 * 100 / timestepFactor;
            $(".plane").css("left", planePos + "px");
            $(".plane").css("top", planeTop + "px");
            $(".skydiver").css("top", skydiverPos + "px");
        }

        if (planePos <= -300) { //When plane is out of sight
            if (counter > timestepFactor / 2) {
                skydiverPos -= 5;
                $(".skydiver").css("top", skydiverPos + "px");
                if (skydiverPos <= 400) {
                    clearInterval(moveoffInterval);
                    $(".plane").hide();
                }
            }
            counter++;
        }
    } else { //For smaller devices
        if (planePos > -300) { //When plane is still in sight
            planePos -= 2 * 100 / timestepFactor;
            skydiverPos += 1.75 * 100 / timestepFactor;
            $(".plane").css("left", planePos + "px");
            $(".skydiver").css("top", skydiverPos + "px");
        }

        if (planePos <= -300) { //When plane is out of sight
            if (counter > timestepFactor / 2) {
                skydiverPos -= 5;
                $(".skydiver").css("top", skydiverPos + "px");
                if (skydiverPos <= 300) {
                    clearInterval(moveoffInterval);
                    $(".plane").hide();
                }
            }
            counter++;
        }
    }

}

function reset() {
    clearInterval(beginningCloudInterval);
    clearInterval(moveoffInterval);
    clearInterval(simulation);
    document.getElementById("smallParachuteButton").disabled = true;
    document.getElementById("largeParachuteButton").disabled = true;
    document.getElementById("startButton").disabled = false;
    document.getElementById("noresistance").disabled = false;

    planePos = 0.5 * graphicWidth - 150;
    planeTop = 50;
    skydiverPos = 70;
    counter = 0;
    currentParachute = 0;

    time = 0;
    pos = 0;
    vel = 0;
    acc = 10;
    mass = 80;
    document.getElementById("massslider").disabled = false;
    document.getElementById("massslider").value = mass;
    $("#massslider").addClass("sliderhover");
    $(".massvalue").text("80 kg");

    $(".parachute1").hide();
    $(".parachute2").hide();
    drag = 0;
    dragcoeff = 0.08 / 0.4356;

    $(".plane").css("left", planePos + "px");
    $(".plane").css("top", planeTop + "px");
    $(".skydiver").css("top", skydiverPos + "px");

    $(".plane").show();
    $(".skydiver").hide();

    tdata = [];
    dtydata = [];
    vtydata = [];

    Plotly.newPlot(dtgraph, [{
        x: tdata,
        y: dtydata
    }], layout);
    Plotly.newPlot(vtgraph, [{
        x: tdata,
        y: vtydata
    }], layout);

    //Remove clouds
    for (let i = 1; i <= cloudCount; i++) {
        let element = document.getElementById("cloud" + i);
        element.parentNode.removeChild(element);
    }
    clouds = [];
    cloudCount = 0;
    cloudCounter = 0;

    //Beginning clouds
    beginningCloudInterval = setInterval(() => {
        let checkNum = Math.random() * Math.pow(cloudCounter, 2) * 0.5;
        if (checkNum > 600) {
            cloudCount++;
            generateCloud(cloudCount, clouds, 0);
            cloudCounter = 0;
        }
        cloudCounter++;

        for (cloud of clouds) {
            cloud.movex();
            cloud.updatex();
            cloud.destroy();
        }
    }, 1000 / timestepFactor);
}

function play() {
    //calculate acceleration
    if (noResistance == false) {
        drag = dragcoeff * Math.pow(vel, 2) / mass;
        acc = grav - drag;
    } else {
        acc = grav;
    }

    //update velocity
    vel += acc / timestepFactor;

    //update position
    pos += vel / timestepFactor;

    //update time
    time += 1. / timestepFactor;

    //plot points
    Plotly.extendTraces(dtgraph, {
        x: [
            [time]
        ],
        y: [
            [pos]
        ]
    }, [0]);

    Plotly.extendTraces(vtgraph, {
        x: [
            [time]
        ],
        y: [
            [vel]
        ]
    }, [0]);

    //update arrow lengths and value
    $(".resistancebody").css("height", (mass * drag / arrowFactor) + "px");
    document.getElementById("resistanceValue").innerHTML = Math.round((drag * mass)) + " N";

    //generate clouds
    let checkNum = Math.random() * cloudCounter * vel;
    if (checkNum > 600) {
        cloudCount++;
        generateCloud(cloudCount, clouds, 1);
        cloudCounter = 0;
    }
    cloudCounter++;

    //update clouds
    for (cloud of clouds) {
        cloud.movey();
        cloud.updatey();
        cloud.destroy();
    }
}

function plotPoints() {
    tdata.push(time);
    dtydata.push(pos);
    vtydata.push(vel);
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

function generateCloud(i, array, type) { //type 0 for beginning horizontal moving clouds, type 1 for clouds during falling
    let newcloud = document.createElement("div");
    let randomNum1 = Math.floor(Math.random() * 7) + 1;
    let randomNum2 = Math.floor(Math.random() * 5) + 1;
    newcloud.className = "cloud";
    newcloud.id = "cloud" + i;
    document.getElementById("graphic").appendChild(newcloud);
    document.getElementById("cloud" + i).innerHTML = "<img src='cloud" + randomNum1 + ".png'>";
    $("#cloud" + i).css("z-index", randomNum2);
    array.push(new Cloud(i, type));
}

function forceCheck() {
    if (document.getElementById("showforces").checked == true) {
        if (document.getElementById("noresistance").checked == false) {
            $(".weight").show();
            $(".airresistance").show();
        } else {
            $(".weight").show();
            $(".airresistance").hide();
        }
    } else {
        $(".weight").hide();
        $(".airresistance").hide();
    }
}

function resistanceCheck() {
    if (document.getElementById("noresistance").checked == true) {
        noResistance = true;
    } else {
        noResistance = false;
    }
    forceCheck();
}