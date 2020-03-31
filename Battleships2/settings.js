var gridNum = 7;
var gridSize = 70;
var selectorSize = gridSize * 0.6;
var boardSize = gridNum * gridSize;
var shipLengths = [4, 3, 3, 2];

document.documentElement.style.setProperty("--gridSize", gridSize.toString().concat("px"));
document.documentElement.style.setProperty("--selectorSize", selectorSize.toString().concat("px"));
document.documentElement.style.setProperty("--boardSize", boardSize.toString().concat("px"));