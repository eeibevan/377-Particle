function ProduceActor(x, y, radius, ticksPerCreation, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color || randomRgbColor();

    this.ticksPerCreation = ticksPerCreation;
    this.createTick = 0;
}

ProduceActor.prototype.act = function (system) {
    if (++this.createTick === this.ticksPerCreation) {
        system.particles.push(
            new Particle(this.x + this.radius*2, this.y + this.radius*2, Math.random(), Math.random())
        );
        this.createTick = 0;
    }
};

ProduceActor.prototype.isInBounds = function (x, y) {
    var isInX = x > this.x && x < this.x + this.radius * 2;
    var isInY = y > this.y && y < this.y + this.radius * 2;
    return isInX && isInY;
};

ProduceActor.prototype.onContact = function (particle) {
    particle.deltaX *= -1;
    particle.deltaY *= -1;
};

ProduceActor.prototype.draw = function (ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
    ctx.fill();
};
