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

function NullActor(x, y, width, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.color = color || randomRgbColor();
}

NullActor.prototype.act = function (system) {
    // Null Actor Does Nothing
};

NullActor.prototype.isInBounds = function (x, y) {
    var isInX = x > this.x && x < this.x + this.width;
    var isInY = y > this.y && y < this.y + this.width;
    return isInX && isInY;
};

NullActor.prototype.onContact = function (particle) {
    // TODO: Figure Out How To Make Bouncing Off Realistic
    var lowX = this.x - this.width;
    var highX = this.x;
    var leftY = this.y;
    var rightY = this.y + this.width;

    var oldPosX = particle.x - particle.deltaX;
    var oldPosY = particle.y - particle.deltaY;

    if (oldPosX < lowX || oldPosX > highX)
        particle.deltaX *= -1;
    if (oldPosY < leftY || oldPosY > rightY)
        particle.deltaY *= -1;
};

function ProduceActor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color || randomRgbColor();

    this.createOnTick = 20;
    this.createTick = 0;
}

ProduceActor.prototype.act = function (system) {
    if (++this.createTick === this.createOnTick) {
        system.particles.push(new Particle(this.x + this.radius, this.y + this.radius, 1, 1));
        this.createTick = 0;
    }
};

ProduceActor.prototype.isInBounds = function () {
    return false;
};

ProduceActor.prototype.onContact = function () {

};

ProduceActor.prototype.draw = function (ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
    ctx.fill();
};

NullActor.prototype.draw = function (ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.width);
};

function ParticleSystem(n, xBound, yBound) {
    this.particles = [];
    this.actors = [];
    this.xBound = xBound;
    this.yBound = yBound;
    this.seed(n)
}

ParticleSystem.prototype.seed = function (n) {
    for (var i = 0; i < n; i++)
        this.particles.push(new Particle(1, 1, Math.random(), Math.random()));
    this.actors.push(new NullActor(this.xBound/2 - 10, this.yBound/2 - 10 , 20, 'white'));
    this.actors.push(new ProduceActor(20, 20, 5, 'green'));
};

ParticleSystem.prototype.update = function () {
    for (var i = 0; i < this.particles.length; i++) {
        var par = this.particles[i];
        par.x += par.deltaX;
        par.y += par.deltaY;

        for (var j = 0; j < this.actors.length; j++) {
            if (this.actors[j].isInBounds(par.x, par.y)) {
                this.actors[j].onContact(par);
            }
        }

        if (par.x > this.xBound || par.x < 0)
            par.deltaX = -par.deltaX;
        if (par.y > this.yBound || par.y < 0)
            par.deltaY = -par.deltaY;
    }

    for (var k = 0; k < this.actors.length; k++) {
        this.actors[k].act(this);
    }
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

    this.particleSystem.actors.forEach(function (actor) {
        actor.draw(this.ctx);
    }.bind(this))
};

CanvasInteractor.prototype.update = function () {
    this.particleSystem.update();
};