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

        // Have Particles 'Wrap Around' The Canvas If They Go Off The Edge
        // + or - The Radius So The Particle Goes Completely Off Screen Before
        //  Wrapping
        if (par.x > this.xBound + par.radius )
            par.x = 0;
        else if (par.x < 0 - par.radius)
            par.x = this.xBound;

        if (par.y > this.yBound + par.radius)
            par.y = 0;
        else if (par.y < 0 - par.radius)
            par.y = this.yBound;

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
