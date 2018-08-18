// If In A node Environment, handle imports
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    var randomRange = require('./util').randomRange;
    var Vector = require('./vector');
    var Particle = require('./particle');
    var ExplodeActor = require('./actors/explodeActor');
    var KillActor = require('./actors/killActor');
    var NullActor = require('./actors/nullActor');
    var ProducerActor = require('./actors/produceActor');
    var ActorFactory = require('./actorFactory');
}

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
 * @default 0
 * Number of Random Actors To Seed The System With
 *
 * @param [sounds]
 * Sounds For Each Actor
 *
 * @param [allowRndActors] {boolean}
 * @default true
 * Flag To Allow Creation of Random Actors
 *
 * @constructor
 */
function ParticleSystem(xBound, yBound, n, numActors, sounds, allowRndActors) {
    this.particles = [];
    this.actors = [];
    this.xBound = xBound;
    this.yBound = yBound;
    this.actorFactor = new ActorFactory(sounds);
    
    if (allowRndActors === undefined)
        this.allowRndActors = true;
    else
        this.allowRndActors = allowRndActors;

    this.seed(n || 0, numActors || 0)
}

/**
 * Seed Random Particles And Actors Into The System
 *
 * @param n {number}
 * Number of Particles To Seed
 *
 * @param actors
 * Number of Actors To Seed
 */
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
 * Inserts a new particle into the system
 *
 * @param p {Particle}
 * The particle to insert
 */
ParticleSystem.prototype.insertParticle = function (p) {
    this.particles.push(p);
};

/**
 * Insert a new actor into the system
 *
 * @param actor
 * The actor to insert
 */
ParticleSystem.prototype.insertActor = function (actor) {
    this.actors.push(actor);
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
    for (var i = 0; i < this.particles.length; i++) {
        var par = this.particles[i];
        par.applyVelocity();

        for (var j = 0; j < this.actors.length; j++) {
            if (this.actors[j].isInBounds(par.x, par.y)) {
                this.actors[j].onContact(par);
            }
        }

        // Bounce Off Or Edges
        if (par.x > this.xBound + par.radius ) {
            par.x = this.xBound + par.radius - 1 ;
            par.velocity.invertX();
        }
        else if (par.x < 0 - par.radius) {
            par.x = 1 - par.radius;
            par.velocity.invertX();
        }

        if (par.y > this.yBound + par.radius) {
            par.y = this.yBound + par.radius - 1;
            par.velocity.invertY();
        }
        else if (par.y < 0 - par.radius) {
            par.y = 1 - par.radius;
            par.velocity.invertY();
        }

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
                    spliceParticles = true;
                }
            }
            nextIndex++;
        }
    }

    if (spliceParticles) {
        for (var k = 0; k < this.particles.length; k++) {
            if (this.particles[k].isToBurst) {

                // Distribute The Burst Particle's Radius
                // Across Several Particles
                var radiusToDistribute = this.particles[k].radius;
                while (radiusToDistribute > 0) {
                    var radiusSection = Math.round(Math.random() * radiusToDistribute);
                    if (radiusSection > 0) {
                        this.particles.push(
                            new Particle(
                                this.particles[k].x, this.particles[k].y,
                                randomRange(-2,2), randomRange(-2,2),
                                radiusSection)
                        );
                    }
                    radiusToDistribute -= radiusSection;
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
        } else if(this.actors[m].hasOwnProperty('isToNull') && this.actors[m].isToNull) {
            var tmp = this.actors[m];
            this.actors[m] = this.actorFactor.makeNull(tmp.x, tmp.y, tmp.width)
        }
    }

    if (this.allowRndActors) {
        // Rarely Create Random Explode Actors
        var rnd = Math.floor(randomRange(1, 750));
        if (rnd === 15) {
            this.actors.push(this.actorFactor.makeExplode(randomRange(30, this.xBound-50), randomRange(30, this.yBound-50) , 40));
        }
    }
};


if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = ParticleSystem;
