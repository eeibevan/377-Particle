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

NullActor.prototype.draw = function (ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.width);
};
