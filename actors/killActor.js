function KillActor(x, y, length, color) {
    this.x = x;
    this.y = y;
    this.length = length;
    this.color = color || randomRgbColor();
}

KillActor.prototype.act = function (system) {
    // Kill Actor Does Nothing
};

KillActor.prototype.isInBounds = function (x, y) {
    var isInX = x > this.x && x < this.x + this.length;
    var isInY = y > this.y && y < this.y + this.length;
    return isInX && isInY;
};

KillActor.prototype.onContact = function (particle) {
    particle.isToDie = true;
};

KillActor.prototype.draw = function (ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.width)
};

ActorFactory.prototype.makeKill = function (x, y, length, color) {
    return new KillActor(x, y, length, color);
};
