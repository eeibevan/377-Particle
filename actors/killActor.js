/**
 * An Actor That Kills Particles On Contact
 *
 * @param x {number}
 * The X Location of The Actor In The System
 *
 * @param y {number}
 * The Y Location of The Actor In The System
 *
 * @param width {number}
 * Width/Height of The Actor
 *
 * @param [color] {string}
 * @default 'yellow'
 * The Color of The Actor
 *
 * @constructor
 */
function KillActor(x, y, width, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.color = color || 'yellow';
    this.particlesKilled = 0;
    this.maxKills = 50;
    this.isToNull = false;
    this.text  = 'Ki';
    this.textColor = 'black';
    this.fontFamily = "Consolas";
}

/**
 * Do Nothing (Function Required By Each Actor)
 *
 * @param system {ParticleSystem}
 * The System To Do Nothing In...
 */
KillActor.prototype.act = function (system) {
    // Kill Actor Does Nothing
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
KillActor.prototype.isInBounds = function (x, y) {
    var isInX = x > this.x && x < this.x + this.width;
    var isInY = y > this.y && y < this.y + this.width;
    return isInX && isInY;
};

/**
 * Flags Non-Invulnerable Particles To Die
 * On Contact
 *
 * @param particle {Particle}
 * The Particle To Flag For Death
 */
KillActor.prototype.onContact = function (particle) {
    if (particle.isInvulnerable() || this.isToNull)
        return;

    particle.isToDie = true;
    if (++this.particlesKilled >= this.maxKills)
        this.isToNull = true;
};

/**
 * Draws The Text In The Center of The Actor
 *
 * @param ctx {CanvasRenderingContext2D}
 * The Context The Actor Is In
 *
 * @private
 */
KillActor.prototype._drawText = function (ctx) {
    // Save Composite Operation To Restore Later
    var oldCO = ctx.globalCompositeOperation;

    ctx.globalCompositeOperation = 'source-atop';
    ctx.fillStyle = this.textColor;
    ctx.font = Math.ceil(this.width/2) + "px " + this.fontFamily;

    var textWidth = ctx.measureText(this.text).width;
    // Height May be Approximated By The Width of A Capital E
    var textHeight = ctx.measureText('E').width;

    // Draws Text In The Center of The Actor
    ctx.fillText(this.text, this.x + textWidth/2, this.y + textHeight*2);

    ctx.globalCompositeOperation = oldCO;
};

/**
 * Draws This Actor
 *
 * @param ctx {CanvasRenderingContext2D}
 * The Context To Draw The Actor On
 */
KillActor.prototype.draw = function (ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.width);
    this._drawText(ctx);
};

/**
 * Creates A Kill Actor
 *
 * @param x {number}
 * The X Location of The Actor In The System
 *
 * @param y {number}
 * The Y Location of The Actor In The System
 *
 * @param width {number}
 * Width/Height of The Actor
 *
 * @param [color] {string}
 * @default 'yellow'
 * The Color of The Actor
 *
 * @returns {KillActor}
 */
ActorFactory.prototype.makeKill = function (x, y, width, color) {
    return new KillActor(x, y, width, color);
};
