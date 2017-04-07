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

function randomRange(min, max) {
    return Math.random() * (max - min) + min;
}

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

function ParticleSystem(n, xBound, yBound) {
    this.particles = [];
    this.actors = [];
    this.xBound = xBound;
    this.yBound = yBound;
    this.actorFactor = new ActorFactory();
    this.seed(n)
}

ParticleSystem.prototype.seed = function (n, actors) {
    for (var i = 0; i < n; i++)
        this.particles.push(
            new Particle(randomRange(10, this.xBound),
                randomRange(2, this.yBound),
                randomRange(-2, 2),
                randomRange(-2, 2)
            ));

    for (var j = actors || 10; j > 0; j--) {
        var rnd = Math.floor(Math.random() * 5);

        switch (rnd) {
            case 0:
                this.actors.push(this.actorFactor.makeNull(randomRange(30, this.xBound-30), randomRange(30, this.yBound-30), 20, 'white'));
                break;
            case 1:
                this.actors.push(this.actorFactor.makeProducer(randomRange(30, this.xBound-35), randomRange(30, this.yBound-35), 25, 200, 'green'));
                break;
            case 2:
                this.actors.push(this.actorFactor.makeKill(randomRange(30, this.xBound-40), randomRange(30, this.yBound-40), 30));
                break;
            case 3:
                this.actors.push(this.actorFactor.makeExplode(randomRange(30, this.xBound-50), randomRange(30, this.yBound-50) , 40));
                break;
            default:
                this.actors.push(this.actorFactor.makeNull(randomRange(30, this.xBound-30), randomRange(30, this.yBound-30), 20, 'white'));
                break;
        }
    }
};

ParticleSystem.prototype._sortX = function () {
    for (var i = 0; i < this.particles.length; i++) {
        var tmp = this.particles[i];
        for (var j = i - 1; j >= 0 && (this.particles[j].x > tmp.x); j--) {
            this.particles[j + 1] = this.particles[j];
        }
        this.particles[j + 1] = tmp;
    }
};

ParticleSystem.prototype.update = function () {
    var spliceParticles = false;
    var spliceActors = false;
    for (var i = 0; i < this.particles.length; i++) {
        var par = this.particles[i];
        par.x += par.deltaX;
        par.y += par.deltaY;

        for (var j = 0; j < this.actors.length; j++) {
            if (this.actors[j].isInBounds(par.x, par.y)) {
                this.actors[j].onContact(par);
            }
        }


        // Reset x and y to 0 When Out of Bounds
        // So They Get Stuck Out of Bounds
        if (par.x > this.xBound || par.x < 0) {
            par.deltaX = -par.deltaX;
            par.x = 0;
        }
        if (par.y > this.yBound || par.y < 0) {
            par.deltaY = -par.deltaY;
            par.y = 0
        }

        if (par.isToDie) {
            spliceParticles = true;
        } else {
            par.tick();
        }
    }


    this._sortX();
    for (var l = 0; l < this.particles.length; l++) {
        var part = this.particles[l];

        // Skip Detection For Dead Particles
        if (part.isToDie)
            continue;

        var nextIndex = l + 1;
        while (nextIndex < this.particles.length &&
                this.particles[nextIndex].x - this.particles[nextIndex].radius < part.x + part.radius) {
            var nextP = this.particles[nextIndex];
            if (!nextP.isToDie) {
                if (part.isInBounds(nextP.x, nextP.y)) {
                    part.absorb(nextP);
                    if (part.isToBurst)
                        spliceParticles = true;
                }
            }
            nextIndex++;
        }
    }

    if (spliceParticles) {
        for (var k = 0; k < this.particles.length; k++) {
            if (this.particles[k].isToBurst) {
                var newPars = Math.floor(this.particles[k].radius/10);
                for (; newPars > 0; newPars--) {
                    this.particles.push(
                        new Particle(
                            this.particles[k].x, this.particles[k].y,
                            randomRange(-2,2), randomRange(-2,2))
                    );
                }
                this.particles[k].isToDie = true;
            }
            if (this.particles[k].isToDie) {
                this.particles.splice(k, 1);
                k--;
            }
        }
    }

    for (var m = 0; m < this.actors.length; m++) {
        this.actors[m].act(this);
        if (this.actors[m].hasOwnProperty('isToDie') && this.actors[m].isToDie) {
            delete this.actors[m];
            spliceActors = true;
        }
    }

    if (spliceActors) {
        for (var n = 0; n < this.actors.length; n++) {
            if (this.actors[n] === undefined) {
                this.actors.splice(n, 1);
                n--;
            }
        }
    }
};

function CanvasInteractor(canvas, particleSystem) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    this.particleSystem = particleSystem || new ParticleSystem(0, canvas.width, canvas.height);

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
        particle.draw(this.ctx);
    }.bind(this));

    this.particleSystem.actors.forEach(function (actor) {
        actor.draw(this.ctx);
    }.bind(this))
};

CanvasInteractor.prototype.update = function () {
    this.particleSystem.update();
};