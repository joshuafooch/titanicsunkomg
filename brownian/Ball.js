var maxTraceLength = 700;

class Ball {
    constructor(identity, x, y, w, vx, vy, m) {
        this.identity = identity;
        this.position = createVector(x, y);
        if (this.identity == "dust") {
            this.trace = [];
            if (drawTrace == true) {
                this.trace.push(this.position.copy());
            }
        }
        this.w = w;
        this.velocity = createVector(vx, vy);
        this.m = m;
        this.colorR = random(255);
        this.colorG = random(255);
        this.colorB = random(255);
    }

    move() {
        this.position.add(this.velocity);
        if (this.identity == "dust" && drawTrace == true) {
            this.trace.push(this.position.copy());
            if (this.trace.length > maxTraceLength) {
                this.trace.shift();
            }
        }
    }

    display() {
        if (this.identity == "container") {
            fill(255, 255, 255);
            ellipse(this.position.x, this.position.y, this.w);
        } else if (this.identity == "dust") {
            //drawing trace path
            noFill();
            if (this.trace.length > 0) {
                for (let i = 1; i < this.trace.length; i++) {
                    beginShape();
                    stroke(map(i + maxTraceLength - this.trace.length, 0, maxTraceLength, 255, 50), 90);
                    strokeWeight(1);
                    vertex(this.trace[i - 1].x, this.trace[i - 1].y);
                    vertex(this.trace[i].x, this.trace[i].y);
                    endShape();
                }
            }
            noStroke();

            fill(139, 69, 19);
            ellipse(this.position.x, this.position.y, this.w);
        } else {
            if (visibleBool.checked == true) {
                fill(this.colorR, this.colorG, this.colorB);
                ellipse(this.position.x, this.position.y, this.w);
            } else {
                noStroke();
                fill(0, 0);
                ellipse(this.position.x, this.position.y, this.w);
            }
        }
    }

    checkWallCollision(container) {
        let thisnextpos = this.position.copy().add(this.velocity.copy());
        let d = thisnextpos.dist(container.position);
        if (d > (container.w / 2 - this.w / 2)) {
            this.velocity.mult(-1);
        }
    }

    checkBallCollision(other) {
        let thisnextpos = this.position.copy().add(this.velocity.copy());
        let othernextpos = other.position.copy().add(other.velocity.copy());
        let d = thisnextpos.dist(othernextpos);
        if (d < (this.w / 2 + other.w / 2)) {
            let tempthisvel1 = this.velocity.copy().mult((this.m - other.m) / (this.m + other.m));
            let tempthisvel2 = other.velocity.copy().mult(2 * other.m / (this.m + other.m));
            let tempthisvel = tempthisvel1.add(tempthisvel2);
            let tempothervel1 = this.velocity.copy().mult(2 * this.m / (this.m + other.m));
            let tempothervel2 = other.velocity.copy().mult((other.m - this.m) / (this.m + other.m));
            let tempothervel = tempothervel1.add(tempothervel2);
            this.velocity = tempthisvel;
            other.velocity = tempothervel;
        }
    }
}

class Flock {
    constructor() {
        this.list = [];
    }

    update(container) {
        for (let i in this.list) {
            for (var j = 1; j < (this.list.length - Number(i)); j++) {
                this.list[i].checkBallCollision(this.list[Number(i) + j]);
            }
            this.list[i].checkWallCollision(container);
            this.list[i].move();
            this.list[i].display();
        }
    }

}