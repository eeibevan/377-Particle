/**
 * Actor The Creates A New Particle After A Specified Number of Ticks
 *
 * @param x {number}
 * The X Location of The Actor In The System
 *
 * @param y {number}
 * The Y Location of The Actor In The System
 *
 * @param radius {number}
 * Width/Height of The Actor
 *
 * @param [ticksPerCreation] {number}
 * @default 200
 * Number of act() Calls Required To Produce A Particle
 *
 * @param [color] {string}
 * @default Random RGB Color
 * The Color of The Actor
 *
 * @constructor
 */
function ProduceActor(x, y, radius, ticksPerCreation, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color || randomRgbColor();
    this.ticksPerCreation = ticksPerCreation || 200;
    this.createTick = 0;
    this.text  = 'Pr';
    this.textColor = 'red';
    this.fontFamily = "Consolas";
}

/**
 * Produces A Particle Every ticksPerCreation Calls
 *
 * @param system {ParticleSystem}
 * The System To Make The Particle In
 */
ProduceActor.prototype.act = function (system) {
    if (++this.createTick === this.ticksPerCreation) {
        system.particles.push(
            new Particle(this.x + this.radius*2, this.y + this.radius*2, Math.random(), Math.random())
        );
        this.createTick = 0;
    }
};

/**
 * Tests If A Point Is Within This Actor
 *
 * @param x {number}
 * The X Location In The System
 *
 * @param y {number}
 * The Y Location In The System
 *
 * @returns {boolean}
 * If (x,y) Is Inside This Actor
 */
ProduceActor.prototype.isInBounds = function (x, y) {
    var dx = this.x - x;
    var dy = this.y - y;
    var distance = Math.sqrt(dx*dx + dy*dy);
    return distance <= this.radius;
};

/**
 * Reflects Particles That Make Contact
 *
 * @param particle {Particle}
 * The Particle That Made Contact
 */
ProduceActor.prototype.onContact = function (particle) {
    particle.deltaX *= -1;
    particle.deltaY *= -1;
};

/**
 * Draws The Text In The Center of The Actor
 *
 * @param ctx {CanvasRenderingContext2D}
 * The Context The Actor Is In
 *
 * @private
 */
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

/**
 * Draws This Actor
 *
 * @param ctx {CanvasRenderingContext2D}
 * The Context To Draw The Actor On
 */
ProduceActor.prototype.draw = function (ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
    ctx.fill();
    this._drawText(ctx);
};

/**
 * Creates A Producer Actor
 *
 * @param x {number}
 * The X Location of The Actor In The System
 *
 * @param y {number}
 * The Y Location of The Actor In The System
 *
 * @param radius {number}
 * Width/Height of The Actor
 *
 * @param [ticksPerCreation] {number}
 * @default 200
 * Number of act() Calls Required To Produce A Particle
 *
 * @param [color] {string}
 * @default Random RGB Color
 * The Color of The Actor
 *
 * @returns {ProduceActor}
 */
ActorFactory.prototype.makeProducer = function (x, y, radius, ticksPerCreation, color) {
    return new ProduceActor(x, y, radius, ticksPerCreation, color || 'green');
};
