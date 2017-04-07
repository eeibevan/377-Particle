function KillActor(x, y, width, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.color = color || 'yellow';
    this.text  = 'Ki';
    this.textColor = 'black';
    this.fontFamily = "Consolas";
}

KillActor.prototype.act = function (system) {
    // Kill Actor Does Nothing
};

KillActor.prototype.isInBounds = function (x, y) {
    var isInX = x > this.x && x < this.x + this.width;
    var isInY = y > this.y && y < this.y + this.width;
    return isInX && isInY;
};

KillActor.prototype.onContact = function (particle) {
    particle.isToDie = true;
};

KillActor.prototype._drawText = function (ctx) {
    // Save Composite Operation To Restore Later
    var oldCO = ctx.globalCompositeOperation;

    ctx.globalCompositeOperation = 'source-atop';
    ctx.fillStyle = this.textColor;
    ctx.font = Math.ceil(this.width/2) + "px " + this.fontFamily;

    var textWidth = ctx.measureText(this.text).width;
    // Height May be Approximated By The Width of A Capital E
    var textHeight = ctx.measureText('E').width;

    // Draws Text In The Center of The Actor
    ctx.fillText(this.text, this.x + textWidth/2, this.y + textHeight*2);

    ctx.globalCompositeOperation = oldCO;
};

KillActor.prototype.draw = function (ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.width);
    this._drawText(ctx);
};

ActorFactory.prototype.makeKill = function (x, y, width, color) {
    return new KillActor(x, y, width, color);
};
