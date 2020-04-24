class Cloud {
    constructor (i, left) {
        this.i = i;
        this.left = left;
        this.pos = 800;
        $("#cloud" + this.i).css("left", this.left);
    }

    move() {
        this.pos -= vel / timestepFactor * 7;
    }

    destroy() {
        if (this.pos <= -200) {
            $("#cloud" + this.i).hide();
        }
    }

    update() {
        $("#cloud" + this.i).css("top", this.pos);
    }
}