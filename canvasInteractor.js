/**
 * Interactor That Ties Particle System To Canvas
 *
 * @param canvas
 * A Reference To The DOM Canvas
 *
 * @param [sounds]
 * Sounds For Each Actor
 *
 * @param [particleSystem] {ParticleSystem}
 * The Particle System To Draw/Update
 *
 * @constructor
 */
function CanvasInteractor(canvas, sounds, particleSystem) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this._run = true;

    this.particleSystem = particleSystem || new ParticleSystem(canvas.width, canvas.height, 500, 10, sounds);

    window.requestAnimationFrame(this.startUpdates.bind(this))
}

/**
 * Begins Animating The Particle System
 */
CanvasInteractor.prototype.startUpdates = function () {
    this.update();
    this.draw();
    if (this._run)
        window.requestAnimationFrame(this.startUpdates.bind(this));
};

/**
 * Draws The Particles And Actors In The System
 */
CanvasInteractor.prototype.draw = function () {
    this.ctx.globalCompositeOperation = "source-over";
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0,0, this.canvas.width, this.canvas.height);

    this.ctx.globalCompositeOperation = "lighter";

    this.particleSystem.particles.forEach(function (particle) {
        particle.draw(this.ctx);
    }.bind(this));

    this.particleSystem.actors.forEach(function (actor) {
        actor.draw(this.ctx);
    }.bind(this))
};

/**
 * Updates The System
 */
CanvasInteractor.prototype.update = function () {
    this.particleSystem.update();
};

/**
 * Inserts a new particle into the system
 *
 * @param p {Particle}
 * The particle to insert
 */
CanvasInteractor.prototype.insertParticle = function (p) {
    this.particleSystem.insertParticle(p)
};

/**
 * Pauses/Resumes the simulation.
 * Pauses drawing & system updates
 */
CanvasInteractor.prototype.playPause = function () {
    this._run = !this._run;
    if (this._run) {
        window.requestAnimationFrame(this.startUpdates.bind(this));
    }
};
