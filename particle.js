function Particle(x, y, deltaX, deltaY, radius, color) {
    this.x = x || 0;
    this.y = y || 0 ;
    this.deltaX = deltaX || 0;
    this.deltaY = deltaY || 0;
    this.radius = radius || Math.floor(Math.random() * 20);
    this.color = color || randomRgbColor();
    this.invulnerabilityTicks = 30;
    this.isToBurst = false;
    this.burstRadius = 50;
    this.isToDie = false;
}

Particle.prototype.isInvulnerable = function () {
    return this.invulnerabilityTicks > 0;
};

Particle.prototype.tick = function () {
    if (this.invulnerabilityTicks > 0)
        this.invulnerabilityTicks--;
};

Particle.prototype.absorb = function (particle) {
    // Don't Absorb Invulnerable Particles
    if (particle.isInvulnerable())
        return;

    // Don't Absorb Any More It We're About To Burst
    if (this.isToBurst)
        return;

    this.radius += particle.radius;

    if (this.radius > this.burstRadius)
        this.isToBurst = true;

    particle.isToDie = true;
};

Particle.prototype.isInBounds = function (x, y) {
    var dx = this.x - x;
    var dy = this.y - y;
    var distance = Math.sqrt(dx*dx + dy*dy);
    return distance <= this.radius;
};

Particle.prototype.draw = function (ctx) {
    var gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
    gradient.addColorStop(0, "white");
    gradient.addColorStop(0.4, "white");
    gradient.addColorStop(0.4, this.color);
    gradient.addColorStop(1, "black");

    ctx.beginPath();
    ctx.fillStyle = gradient;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
    ctx.fill();
};
