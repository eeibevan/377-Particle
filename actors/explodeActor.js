function ExplodeActor(x, y, width, explodeTicks, isFuseLit, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.explodeTicks = explodeTicks || 50;
    this._isFuseLit = isFuseLit || false;
    this.color = color || randomRgbColor();
}

ExplodeActor.prototype.explode = function (system) {
    var particles = system.particles;
    var distance = 0;
    for (var i = 0; i < particles.length; i++) {
        var particle = particles[i];
        distance = Math.sqrt((this.x - particle.x) + (this.y - particle.y));
        if (distance < 100)
            particle.isToDie = true;
    }
};

ExplodeActor.prototype.act = function (system) {
    if (this._isFuseLit)
        if (--this.explodeTicks <= 0)
            this.explode(system);
};

ExplodeActor.prototype.isInBounds = function (x, y) {
    var isInX = x > this.x && x < this.x + this.width;
    var isInY = y > this.y && y < this.y + this.width;
    return isInX && isInY;
};

ExplodeActor.prototype.onContact = function (particle) {
    this._isFuseLit = true;
};

ExplodeActor.prototype.draw = function (ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.width)
};

ActorFactory.prototype.makeExplode = function (x, y, width, color) {
    return new ExplodeActor(x, y, width, color);
};
