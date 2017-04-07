/**
 * A System For Simulating PArticle Movement And
 * Actor Interaction
 *
 * @param xBound {number}
 * The X Boundary of The System
 *
 * @param yBound {number}
 * The Y Boundary of The System
 *
 * @param [n] {number}
 * @default 0
 * Number of Particles To Seed The System With
 *
 * @param [numActors] {number}
 * @default 10
 * Number of Random Actors To Seed The System With
 *
 * @param allowRndActors {boolean}
 * @default true
 * Flag To Allow Creation of Random Actors
 *
 * @constructor
 */
function ParticleSystem(xBound, yBound, n, numActors, allowRndActors) {
    this.particles = [];
    this.actors = [];
    this.xBound = xBound;
    this.yBound = yBound;
    this.actorFactor = new ActorFactory();
    this.allowRndActors = allowRndActors || true;
    this.seed(n || 0, numActors || 10)
}

ParticleSystem.prototype.seed = function (n, actors) {
    for (var i = 0; i < n; i++)
        this.particles.push(
            new Particle(randomRange(10, this.xBound),
                randomRange(2, this.yBound),
                randomRange(-2, 2),
                randomRange(-2, 2)
            ));

    for (var j = actors; j > 0; j--) {
        var rnd = Math.floor(Math.random() * 5);

        switch (rnd) {
            case 0:
                this.actors.push(this.actorFactor.makeNull(randomRange(30, this.xBound-30), randomRange(30, this.yBound-30), 20));
                break;
            case 1:
                this.actors.push(this.actorFactor.makeProducer(randomRange(30, this.xBound-35), randomRange(30, this.yBound-35), 25, 200));
                break;
            case 2:
                this.actors.push(this.actorFactor.makeKill(randomRange(30, this.xBound-40), randomRange(30, this.yBound-40), 30));
                break;
            case 3:
                this.actors.push(this.actorFactor.makeExplode(randomRange(30, this.xBound-50), randomRange(30, this.yBound-50) , 40));
                break;
            default:
                this.actors.push(this.actorFactor.makeNull(randomRange(30, this.xBound-30), randomRange(30, this.yBound-30), 20));
                break;
        }
    }
};

/**
 * Sorts All Particles By Their X Position
 * @private
 */
ParticleSystem.prototype._sortX = function () {
    for (var i = 0; i < this.particles.length; i++) {
        var tmp = this.particles[i];
        for (var j = i - 1; j >= 0 && (this.particles[j].x > tmp.x); j--) {
            this.particles[j + 1] = this.particles[j];
        }
        this.particles[j + 1] = tmp;
    }
};

/**
 * Advances The System State
 * Calculates Particle Movement, Particle Collision,
 * Particle Bursting, Actors Actions, And Actor/Particle Death
 */
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


    // Collision Detection
    // Achieves Order n In Most Cases
    this._sortX();
    for (var l = 0; l < this.particles.length; l++) {
        var part = this.particles[l];

        // Skip Detection For Dead Particles
        if (part.isToDie)
            continue;

        // Forward Check For Collision On This Particle
        // Only Forward is Necessary Because, If Collision
        // Was To Happen On The Left, Then That Particle Would
        // Detect It
        //
        // Only Checks Particles That Are Close Enough
        // On The X Direction To Collide
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

    // Removes Actors Flagged For Death
    for (var m = 0; m < this.actors.length; m++) {
        this.actors[m].act(this);
        // Unlike Particles, Actors Do Not All Have An isToDie Flag
        // So We Make Sure They Have One Before Accessing It
        if (this.actors[m].hasOwnProperty('isToDie') && this.actors[m].isToDie) {
            this.actors.splice(m, 1);
            m--;
        }
    }

    if (this.allowRndActors) {
        // Rarely Create Random Explode Actors
        var rnd = Math.floor(randomRange(1, 500));
        if (rnd === 15) {
            this.actors.push(this.actorFactor.makeExplode(randomRange(30, this.xBound-50), randomRange(30, this.yBound-50) , 40));
        }
    }
};
