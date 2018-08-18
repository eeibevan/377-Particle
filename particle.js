
// If In A node Environment, handle imports
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    var randomRgbColor = require('./util').randomRgbColor;
    var Vector = require('./vector');
}

/**
 * Basic Unit of The Particle System
 * Moves About And Interacts With Actors
 *
 * @param [x] {number}
 * @default 0
 * The X Location of The Particle In The System
 *
 * @param [y] {number}
 * @default 0
 * The Y Location of The Particle In The System
 *
 * @param [deltaX] {number}
 * @default 0
 * The Change In x For Every Particle System Update
 * Positive & Negative Implies Direction
 *
 * @param [deltaY] {number}
 * @default 0
 * The Change In y For Every Particle System Update
 * Positive & Negative Implies Direction
 *
 * @param [radius] {number}
 * @default Random Int Between 1 And 20
 * Width/Height of The Particle
 *
 * @param [color] {String}
 * @default Random RGB Color
 * The CSS Color of The Particle
 *
 * @constructor
 */
function Particle(x, y, deltaX, deltaY, radius, color) {
    this.x = x || 0;
    this.y = y || 0 ;
    // this.deltaX = deltaX || 0;
    // this.deltaY = deltaY || 0;
    this.velocity = new Vector(deltaX || 0, deltaY || 0);

    this.radius = radius || Math.ceil(Math.random() * 20);
    this.color = color || randomRgbColor();
    this.invulnerabilityTicks = 30;
    this.isToBurst = false;
    this.burstRadius = 50;
    this.isToDie = false;
}

/**
 * Tests If The Particle Should Be Allowed To Die
 * @returns {boolean}
 * If Actors Should Not Kill This Particle (true).
 * False otherwise
 */
Particle.prototype.isInvulnerable = function () {
    return this.invulnerabilityTicks > 0;
};

/**
 * Advances Particle State (Not Movement)
 */
Particle.prototype.tick = function () {
    if (this.invulnerabilityTicks > 0)
        this.invulnerabilityTicks--;
};

/**
 * Applies The Particle's Velocity To It's Position
 */
Particle.prototype.applyVelocity = function () {
    this.x += this.velocity.x;
    this.y += this.velocity.y;
};

/**
 * Attempts To Absorb Another Particle(particle)
 * If The Other Particle Is Invulnerable It Will
 * Not Be Absorbed. <br />
 *
 * If This Particle Absorbs Too Many Particles And
 * Its width Exceeds burstRadius, Then It Will Be Flagged To Burst
 * And Cannot Absorb Any More Particles
 *
 * The Absorbed Particle (If We Pass All of The Above Tests)
 * Will Be Flagged To Die And This Particle's width
 * Will Be Grown By particle 's Width
 *
 * @param particle {Particle}
 * The Particle To Attempt To Absorb
 * May Be Marked For Death By This Method
 */
Particle.prototype.absorb = function (particle) {
    // Don't Absorb Invulnerable Particles
    // or Particles already being absorbed
    if (particle.isToDie || particle.isInvulnerable())
        return;

    // Don't Absorb Any More It We're About To Burst
    if (this.isToBurst)
        return;

    this.radius += particle.radius;

    if (this.radius > this.burstRadius)
        this.isToBurst = true;
    else
        this.velocity.add(particle.velocity);

    particle.isToDie = true;
};

/**
 * Tests If A Point Is Within This Particle
 *
 * @param x {number}
 * The X Location In The System
 *
 * @param y {number}
 * The Y Location In The System
 *
 * @returns {boolean}
 * If (x,y) Is Inside This Particle
 */
Particle.prototype.isInBounds = function (x, y) {
    var dx = this.x - x;
    var dy = this.y - y;
    var distance = Math.sqrt(dx*dx + dy*dy);
    return distance <= this.radius;
};

/**
 * Draws This Particle
 *
 * @param ctx {CanvasRenderingContext2D}
 * The Context To Draw The Particle On
 * Best Results Are Achieved By
 * globalCompositeOperation = "lighter"
 * For Particles
 */
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

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = Particle;
