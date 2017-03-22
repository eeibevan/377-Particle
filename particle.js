/**
 * Builds A Random rgba String
 *
 * @returns {string}
 * A rgba String With The Following Ranges
 * rgba([0-255],[0-255],[0-255],1)
 */
function randomRgbColor() {
    var r = Math.floor(Math.random() * 256);
    var g = Math.floor(Math.random() * 256);
    var b = Math.floor(Math.random() * 256);
    var a = .5;
    return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
}

function Particle(x, y, deltaX, deltaY, radius, color) {
    this.x = x || 0;
    this.y = y || 0 ;
    this.deltaX = deltaX || 0;
    this.deltaY = deltaY || 0;
    this.radius = radius || Math.floor(Math.random() * 20);
    this.color = color || randomRgbColor();
}

Particle.prototype.updateLocation = function (xBound, yBound) {
    this.x += this.deltaX;
    this.y += this.deltaY;
    if (this.x > xBound) {
        this.x = xBound;
        this.deltaX = -this.deltaX;
    } else if (this.x < 0) {
        this.x = 0;
        this.deltaX = -this.deltaX;
    }

    if (this.y > yBound) {
        this.y = yBound;
        this.deltaY = -this.deltaY;
    } else if (this.y < 0) {
        this.y = 0;
        this.deltaY = -this.deltaY;
    }
};

function ParticleSystem(n, xBound, yBound) {
    this.particles = [];
    this.xBound = xBound;
    this.yBound = yBound;
    this.seed(n)
}

ParticleSystem.prototype.seed = function (n) {
    for (var i = 0; i < n; i++)
        this.particles.push(new Particle(1, 1, Math.random(), Math.random()));
};

ParticleSystem.prototype.update = function () {
    for (var i = 0; i < this.particles.length; i++)
        this.particles[i].updateLocation(this.xBound, this.yBound);
};

function CanvasInteractor(canvas, particleSystem) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    this.particleSystem = particleSystem || new ParticleSystem(50, canvas.width, canvas.height);

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

    //Lets blend the particle with the BG
	this.ctx.globalCompositeOperation = "lighter";
    this.particleSystem.particles.forEach(function (particle) {
        this.ctx.beginPath();
        var gradient = this.ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.radius);
        gradient.addColorStop(0, "white");
        gradient.addColorStop(0.4, "white");
        gradient.addColorStop(0.4, particle.color);
        gradient.addColorStop(1, "black");

        this.ctx.fillStyle = gradient;
        this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI*2, false);
        this.ctx.fill();
    }.bind(this));

};

CanvasInteractor.prototype.update = function () {
    this.particleSystem.update();
};