/**
 * An Actor That Explodes On Contact
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
 * @default 'red'
 * The Color of The Actor
 *
 * @param [explodeTicks] {number}
 * @default 50
 * Number of act() Calls Required To Explode The Actor After Contact
 *
 * @param [isFuseLit] {boolean}
 * @default false
 * Flag To Create The Actor Ticking Down To Explosion of Not
 *
 * @param [sound] {HTMLAudioElement}
 * @default undefined
 * Sound to play when the actor explodes. If undefined, then no sound is played
 *
 * @constructor
 */
function ExplodeActor(x, y, width, color, explodeTicks, isFuseLit, sound) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.color = color || 'red';
    this.explodeTicks = explodeTicks || 50;
    this._isFuseLit = isFuseLit || false;
    this._playExplodeAnimation = false;
    this._flash = false;
    this.sound = sound;
    this.explosion = {
        width: width,
        growth: 17,
        frames: 10,
        color: 'white'
    };
    this.isToDie = false;
    this.text  = 'Ex';
    this.textColor = 'white';
    this.fontFamily = "Consolas";
}

/**
 * Kills All Non-Invulnerable Particles
 * In Range of The Explosion Animation
 *
 * @param system {ParticleSystem}
 * The System To Kill The Particles In
 */
ExplodeActor.prototype.explode = function (system) {
    if (this.sound !== undefined)
        this.sound.play();

    var particles = system.particles;
    var distance = 0;
    for (var i = 0; i < particles.length; i++) {
        var particle = particles[i];
        var dx = this.x - particle.x;
        var dy = this.y - particle.y;
        distance = Math.sqrt( dx * dx + dy * dy);
        if (distance < this.explosion.growth * this.explosion.frames && !particle.isInvulnerable())
            particle.isToDie = true;
    }
};

/**
 * If The Fuse Is Lit, Ticks Down To Explosion
 * Otherwise, Does Nothing
 *
 * @param system
 * The System To Perform The Explosion In (If At All)
 */
ExplodeActor.prototype.act = function (system) {
    if (this._isFuseLit)
        if (--this.explodeTicks <= 0) {
            this.explode(system);
            this._isFuseLit = false;
            this._playExplodeAnimation = true;
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
ExplodeActor.prototype.isInBounds = function (x, y) {
    var isInX = x > this.x && x < this.x + this.width;
    var isInY = y > this.y && y < this.y + this.width;
    return isInX && isInY;
};

/**
 * Ignites The Fuse On Contact
 *
 * @param particle {Particle}
 * The Particle That Made Contact
 */
ExplodeActor.prototype.onContact = function (particle) {
    this._isFuseLit = true;
};

/**
 * Draws The Text In The Center of The Actor
 *
 * @param ctx {CanvasRenderingContext2D}
 * The Context The Actor Is In
 *
 * @private
 */
ExplodeActor.prototype._drawText = function (ctx) {
    // Save Composite Operation To Restore Later
    var oldCO = ctx.globalCompositeOperation;
    ctx.globalCompositeOperation = 'source-atop';

    ctx.fillStyle = this.textColor;
    ctx.font = Math.ceil(this.width/2) + "px " + this.fontFamily;

    var textWidth = ctx.measureText(this.text).width;
    // Height May be Approximated By The Width of A Capital E
    var textHeight = ctx.measureText('E').width;

    // Draws Text In The Center of The Actor
    // Divide By Three Gives Us Slightly Better Centering
    ctx.fillText(this.text, this.x + textWidth/3, this.y + textHeight*2);

    ctx.globalCompositeOperation = oldCO;
};

/**
 * Draws This Actor &
 * Plays Explosion Animation When Relevant
 *
 * @param ctx {CanvasRenderingContext2D}
 * The Context To Draw The Actor On
 */
ExplodeActor.prototype.draw = function (ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.color;

    // Alternate Flashing If Fuse Is Lit
    if (this._isFuseLit) {
        if (this._flash) {
            ctx.fillStyle = 'white';
            this._flash = false
        } else
            this._flash = true;
    }

    ctx.fillRect(this.x, this.y, this.width, this.width);
    this._drawText(ctx);

    if (this._playExplodeAnimation && this.explosion.frames > 0) {
        this.drawExplosionFrame(ctx);
        this.explosion.width += this.explosion.growth;
        this.explosion.frames--;
    }

    if (this.explosion.frames < 1) {
        this._playExplodeAnimation = false;
        this.isToDie = true;
    }
};

/**
 * Draws The Current Explosion State
 *
 * @param ctx {CanvasRenderingContext2D}
 * The Context To Draw The Explosion On
 */
ExplodeActor.prototype.drawExplosionFrame = function (ctx) {
    ctx.beginPath();
    // Save Composite Operation To Restore Later
    var oldCO = ctx.globalCompositeOperation;
    ctx.globalCompositeOperation = "lighter";

    var centerx = this.width/2 + this.x;
    var centery = this.width/2 + this.y;

    var gradient = ctx.createRadialGradient(centerx, centery, 0, centerx, centery, this.explosion.width);
    gradient.addColorStop(0, "white");
    gradient.addColorStop(0.4, "white");
    gradient.addColorStop(0.4, this.explosion.color);
    gradient.addColorStop(1, "black");

    ctx.fillStyle = gradient;
    ctx.arc(centerx, centery, this.explosion.width, 0, Math.PI*2, false);
    ctx.fill();

    ctx.globalCompositeOperation = oldCO;
};

/**
 * Creates An Explosion Actor
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
 * @default 'red'
 * The Color of The Actor
 *
 * @param [explodeTicks] {number}
 * @default 50
 * Number of act() Calls Required To Explode The Actor After Contact
 *
 * @param [isFuseLit] {boolean}
 * @default false
 * Flag To Create The Actor Ticking Down To Explosion of Not
 *
 * @returns {ExplodeActor}
 */
ActorFactory.prototype.makeExplode = function (x, y, width, color, explodeTicks, isFuseLit) {
    if (this.sounds !== undefined && this.sounds.explode !== undefined)
        return new ExplodeActor(x, y, width, color, explodeTicks, isFuseLit, this.sounds.explode);

    return new ExplodeActor(x, y, width, color, explodeTicks, isFuseLit);
};
