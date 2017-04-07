function CanvasInteractor(canvas, particleSystem) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    this.particleSystem = particleSystem || new ParticleSystem(canvas.width, canvas.height, 500);

    window.requestAnimationFrame(this.startUpdates.bind(this))
}

CanvasInteractor.prototype.startUpdates = function () {
    this.update();
    this.draw();
    window.requestAnimationFrame(this.startUpdates.bind(this));
};

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

CanvasInteractor.prototype.update = function () {
    this.particleSystem.update();
};
