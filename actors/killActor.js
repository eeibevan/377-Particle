function KillActor(x, y, width, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.color = color || randomRgbColor();
}

KillActor.prototype.act = function (system) {
    // Kill Actor Does Nothing
};

KillActor.prototype.isInBounds = function (x, y) {
    var isInX = x > this.x && x < this.x + this.width;
    var isInY = y > this.y && y < this.y + this.width;
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

ActorFactory.prototype.makeKill = function (x, y, width, color) {
    return new KillActor(x, y, width, color);
};
