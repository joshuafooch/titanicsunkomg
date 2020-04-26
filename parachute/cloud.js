class Cloud {
    constructor(i, type) {
        this.i = i;
        if (type == 0) { //beginning clouds
            this.left = -200;
            this.pos = 20 + Math.floor(Math.random() * 200);
            $("#cloud" + this.i).css("top", this.pos);
        } else if (type == 1) { //clouds during falling
            this.left = Math.floor(Math.random() * (graphicWidth + 200)) - 200;
            this.pos = 800;
            $("#cloud" + this.i).css("left", this.left);
        }
    }

    movex() {
        this.left += 30 / timestepFactor * 7;
    }

    movey() {
        this.pos -= vel / timestepFactor * 7;
    }

    destroy() {
        if (this.pos <= -200 || this.left >= graphicWidth) {
            $("#cloud" + this.i).remove();
            return true;
        } else return false;
    }

    updatex() {
        $("#cloud" + this.i).css("left", this.left);
    }

    updatey() {
        $("#cloud" + this.i).css("top", this.pos);
    }
}