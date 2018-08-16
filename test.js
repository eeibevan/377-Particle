var Util = require('./util');
var Particle = require('./particle');
var ExplodeActor = require('./actors/explodeActor');
var KillActor = require('./actors/killActor');
var NullActor = require('./actors/nullActor');
var ProducerActor = require('./actors/produceActor');
var ActorFactory = require('./actorFactory');
var ParticleSystem = require('./particleSystem');

function assert(message, value) {
    var msg = "No Message";
    if (message !== undefined)
        msg = message;

    if (!value)
        throw new Error("Assert (" + msg + ") Failed For " + value)
}

function assertEqualL(message, expected, actual) {
    // noinspection EqualityComparisonWithCoercionJS
    if (expected != actual)
        throw new Error("Assert (" + message + ") Equal Loose Failed For " + expected + " == " + actual);
}

function assertEqualS(message, expected, actual) {
    if (expected !== actual)
        throw new Error("Assert (" + message + ") Equal Strict Failed For " + expected + " == " + actual);
}

function fail(message) {
    throw new Error("Fail: " + message);
}

/**
 * Returns a blank, 100 x 100 system
 * @returns {ParticleSystem}
 */
function emptySystem() {
    return new ParticleSystem(100, 100, 0, 0, null, false);
}

function TestRunner() {
    this._tests = [];
    this._failedTests = [];
}

TestRunner.prototype.register = function (name, test) {
    this._tests.push({name:name, test:test});
};

TestRunner.prototype.run = function () {
    var passed = 0;
    var failed = 0;

    for (var i = 0; i < this._tests.length; i++) {
        var t = this._tests[i];

        try {
            t.test();
            passed++;
            console.log(t.name + " Passed")
        } catch (e) {
            failed++;
            this._failedTests.push(t.name);
            console.log(t.name + " Failed", e)
        }
    }

    console.log("Passed " + passed + " Test(s)");
    if (failed > 0) {
        console.log("Failed " + failed + " Test(s)");
        this._failedTests.forEach(function (value) {
            console.log("Test Failed: " + value);
        })
    }

    return failed === 0;
};

var runner = new TestRunner();

runner.register("[System] Basic Collision", function () {
    var sys = emptySystem();

    var leftParticle = new Particle(5, 0, 1, 0, 1);
    leftParticle.invulnerabilityTicks = 0;
    sys.insertParticle(leftParticle);

    var rightParticle = new Particle(6, 0, 0, 0, 1);
    rightParticle.invulnerabilityTicks = 0;
    sys.insertParticle(rightParticle);

    sys.update();

    assertEqualS("Should Absorb", sys.particles.length, 1);
});

runner.register("[System] Invulnerable Collision", function () {
    var sys = emptySystem();

    var leftParticle = new Particle(5, 0, 1, 0, 1);
    leftParticle.invulnerabilityTicks = 2;
    sys.insertParticle(leftParticle);

    var rightParticle = new Particle(6, 0, 0, 0, 1);
    rightParticle.invulnerabilityTicks = 2;
    sys.insertParticle(rightParticle);

    sys.update();

    assertEqualS("Should Not Absorb Invulnerable", sys.particles.length, 2);
});

if (!runner.run()) {
    process.exit(1);
}
