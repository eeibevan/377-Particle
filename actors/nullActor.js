function NullActor(x, y, width, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.color = color || randomRgbColor();
    this.text  = 'Nu';
    this.textColor = 'black';
    this.fontFamily = "Consolas";
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

NullActor.prototype._drawText = function (ctx) {
    // Save Composite Operation To Restore Later
    var oldCO = ctx.globalCompositeOperation;
    ctx.globalCompositeOperation = 'source-atop';

    ctx.fillStyle = this.textColor;
    ctx.font = Math.ceil(this.width/2) + "px " + this.fontFamily;

    var textWidth = ctx.measureText(this.text).width;
    // Height May be Approximated By The Width of A Capital E
    var textHeight = ctx.measureText('E').width;

    // Draws Text In The Center of The Actor
    // For Some Reason textWidth/3 Gives Us The Middle Here
    ctx.fillText(this.text, this.x + textWidth/3, this.y + textHeight*2);

    ctx.globalCompositeOperation = oldCO;
};

NullActor.prototype.draw = function (ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.width);
    this._drawText(ctx);
};

ActorFactory.prototype.makeNull = function (x, y, width, color) {
    return new NullActor(x, y, width, color);
};
