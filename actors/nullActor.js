if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    var ActorFactory = require('../actorFactory')
}

/**
 * An Actor That Does Nothing
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
 * @default random RGB Color
 * The Color of The Actor
 *
 * @constructor
 */
function NullActor(x, y, width, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.color = color || randomRgbColor();
    this.text  = 'Nu';
    this.textColor = 'black';
    this.fontFamily = "Consolas";
}

/**
 * Do Nothing (Function Required By Each Actor)
 *
 * @param system {ParticleSystem}
 * The System To Do Nothing In...
 */
NullActor.prototype.act = function (system) {
    // Null Actor Does Nothing
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
NullActor.prototype.isInBounds = function (x, y) {
    var isInX = x > this.x && x < this.x + this.width;
    var isInY = y > this.y && y < this.y + this.width;
    return isInX && isInY;
};

/**
 * Reflects/Refracts Particles That Make Contact
 *
 * @param particle {Particle}
 * The Particle That Made Contact
 */
NullActor.prototype.onContact = function (particle) {
    // TODO: Figure Out How To Make Bouncing Off Realistic
    var lowX = this.x - this.width;
    var highX = this.x;
    var leftY = this.y;
    var rightY = this.y + this.width;

    var oldPosX = particle.x - particle.velocity.x;
    var oldPosY = particle.y - particle.velocity.y;

    if (oldPosX < lowX || oldPosX > highX)
        particle.velocity.invertX();
    if (oldPosY < leftY || oldPosY > rightY)
        particle.velocity.invertY();
};

/**
 * Draws The Text In The Center of The Actor
 *
 * @param ctx {CanvasRenderingContext2D}
 * The Context The Actor Is In
 *
 * @private
 */
NullActor.prototype._drawText = function (ctx) {
    // Save Composite Operation To Restore Later
    var oldCO = ctx.globalCompositeOperation;
    ctx.globalCompositeOperation = 'source-atop';

    ctx.fillStyle = this.textColor;
    ctx.font = Math.ceil(this.width/2) + "px " + this.fontFamily;

    var textWidth = ctx.measureText(this.text).width;
    // Height May be Approximated By The Width of A Capital E
    var textHeight = ctx.measureText('E').width;

    // Draws Text In The Center of The Actor
    // For Some Reason textWidth/3 Gives Us The Middle Here
    ctx.fillText(this.text, this.x + textWidth/3, this.y + textHeight*2);

    ctx.globalCompositeOperation = oldCO;
};

/**
 * Draws This Actor
 *
 * @param ctx {CanvasRenderingContext2D}
 * The Context To Draw The Actor On
 */
NullActor.prototype.draw = function (ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.width);
    this._drawText(ctx);
};

/**
 * Creates A Null Actor
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
 * @default White
 * The Color of The Actor
 * @returns {NullActor}
 */
ActorFactory.prototype.makeNull = function (x, y, width, color) {
    return new NullActor(x, y, width, color || 'white');
};

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = NullActor;
