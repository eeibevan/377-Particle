function makeStatsString(object) {
    if (object instanceof Particle) {
        return "<div>Type: Particle</div>"+
            "<div>Age: " + object.age + "</div>" +
            "<div>Color: " + object.color + "</div>" +
            "<div>Size: " + object.radius + "</div>" +
            "<div>Position: X:" + object.x.toFixed(1) +
            " Y:" + object.y.toFixed(1) +"</div>" +
            "<div>Velocity: X:" + object.velocity.x.toFixed(1) +
            " Y:" + object.velocity.y.toFixed(1) +"</div>"
    } else if (object instanceof ExplodeActor) {
        return "<div>Type: ExplodeActor</div>"+
            "<div>Color: " + object.color + "</div>" +
            "<div>Width: " + object.width + "</div>" +
            "<div>Position: X:" + object.x.toFixed(1) +
            " Y:" + object.y.toFixed(1) +"</div>";
    } else if (object instanceof KillActor) {
        return "<div>Type: KillActor</div>"+
            "<div>Color: " + object.color + "</div>" +
            "<div>Width: " + object.width + "</div>" +
            "<div>Kills: " + object.particlesKilled + "</div>" +
            "<div>Max Kills: " + object.maxKills + "</div>" +
            "<div>Position: X:" + object.x.toFixed(1) +
            " Y:" + object.y.toFixed(1) +"</div>";
    } else if (object instanceof NullActor) {
        return "<div>Type: NullActor</div>"+
            "<div>Color: " + object.color + "</div>" +
            "<div>Width: " + object.width + "</div>" +
            "<div>Position: X:" + object.x.toFixed(1) +
            " Y:" + object.y.toFixed(1) +"</div>";
    } else if (object instanceof ProduceActor) {
        return "<div>Type: ProduceActor</div>"+
            "<div>Color: " + object.color + "</div>" +
            "<div>Radius: " + object.radius + "</div>" +
            "<div>Particles Created: " + object.particlesCreated + "</div>" +
            "<div>Ticks Per New Particle: " + object.ticksPerCreation + "</div>" +
            "<div>Ticks Until New Particle: " + (object.ticksPerCreation - object.createTick) + "</div>" +
            "<div>Position: X:" + object.x.toFixed(1) +
            " Y:" + object.y.toFixed(1) +"</div>";
    }
}