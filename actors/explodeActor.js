function ExplodeActor(x, y, width, explodeTicks, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.explodeTicks = explodeTicks;
    this.color = color || randomRgbColor();
}

ExplodeActor.prototype.explode = function (system) {
    //TODO: Implement
};

ExplodeActor.prototype.act = function (system) {
    if (--this.explodeTicks <= 0) {
        this.explode(system);
    }
};

ExplodeActor.prototype.isInBounds = function (x, y) {
    var isInX = x > this.x && x < this.x + this.width;
    var isInY = y > this.y && y < this.y + this.width;
    return isInX && isInY;
};

ExplodeActor.prototype.onContact = function (particle) {
    // Nothing On Contact
};

ExplodeActor.prototype.draw = function (ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.width)
};

ActorFactory.prototype.makeExplode = function (x, y, width, color) {
    return new ExplodeActor(x, y, width, color);
};
