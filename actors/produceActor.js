function ProduceActor(x, y, radius, ticksPerCreation, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color || randomRgbColor();
    this.ticksPerCreation = ticksPerCreation;
    this.createTick = 0;
    this.text  = 'Pr';
    this.textColor = 'red';
    this.fontFamily = "Consolas";
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

ProduceActor.prototype._drawText = function (ctx) {
    // Save Composite Operation To Restore Later
    var oldCO = ctx.globalCompositeOperation;
    ctx.globalCompositeOperation = 'source-atop';

    ctx.fillStyle = this.textColor;
    ctx.font = this.radius + "px " + this.fontFamily;

    var textWidth = ctx.measureText(this.text).width;
    // Height May be Approximated By The Width of A Capital E
    var textHeight = ctx.measureText('E').width;

    // Draws Text In The Center of The Actor
    ctx.fillText(this.text, this.x - textWidth/2, this.y + textHeight/2);

    ctx.globalCompositeOperation = oldCO;
};

ProduceActor.prototype.draw = function (ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
    ctx.fill();
    this._drawText(ctx);
};

ActorFactory.prototype.makeProducer = function (x, y, radius, ticksPerCreation, color) {
    return new ProduceActor(x, y, radius, ticksPerCreation, color);
};
