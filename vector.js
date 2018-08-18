/**
 * Basic Representation of A 2D Vector.
 *
 * @param x
 * The X Component
 *
 * @param y
 * The Y Component
 *
 * @constructor
 */
function Vector(x, y) {
    this.x = x;
    this.y = y;
}

/**
 * Add vector's Components To Ours.
 * vector's Components Are Not Altered
 *
 * @param vector {Vector}
 * The Vector To Add Components From
 */
Vector.prototype.add = function (vector) {
    this.x += vector.x;
    this.y += vector.y;
};

/**
 * Add A Scalar Value To Both of Our Components
 *
 * @param s
 * The Scalar Component To Add To Our Components
 */
Vector.prototype.addScalar = function (s) {
    this.x += s;
    this.y += s;
};

/**
 * Subtract Our Components By vector's.
 * vector's Components Are Not Altered
 *
 * @param vector {Vector}
 * The Vector To Subtract Our Components From
 */
Vector.prototype.subtract = function (vector) {
    this.x -= vector.x;
    this.y -= vector.y;
};

/**
 * Subtract A Scalar Value From Both of Our Components
 *
 * @param s
 * The Scalar Component To Subtract From Our Components
 */
Vector.prototype.subtractScalar = function (s) {
    this.x -= s;
    this.y -= s;
};

/**
 * Divide Our Components By vector's.
 * vector's Components Are Not Altered
 *
 * @param vector {Vector}
 * The Vector To Divide Our Components by
 */
Vector.prototype.divide = function (vector) {
    this.x /= vector.x;
    this.y /= vector.y;
};

/**
 * Divide Both of Our Component's By A Scalar Value
 *
 * @param s
 * The Scalar Component To Divide Our Components By
 */
Vector.prototype.divideScalar = function (s) {
    this.x /= s;
    this.y /= s;
};

/**
 * Multiply Our Components By vector's.
 * vector's Components Are Not Altered
 *
 * @param vector {Vector}
 * The Vector To Multiply Our Components by
 */
Vector.prototype.multiply = function (vector) {
    this.x *= vector.x;
    this.y *= vector.y;
};

/**
 * Multiply Both of Our Component's By A Scalar Value
 *
 * @param s
 * The Scalar Component To Multiply Our Components By
 */
Vector.prototype.multiplyScalar = function (s) {
    this.x *= s;
    this.y *= s;
};

/**
 * Invert Our X Component
 */
Vector.prototype.invertX = function () {
    this.x *= -1;
};

/**
 * Invert Our Y Component
 */
Vector.prototype.invertY = function () {
    this.y *= -1;
};

/**
 * Invert Both The X and Y Components
 */
Vector.prototype.invert = function () {
    this.invertX();
    this.invertY();
};

/**
 * Returns The Dot Product Of This Vector And Another Vector (vector).
 * No Vector is Modified.
 *
 * @param vector
 * The Other Vector To Include In The Dot Product
 *
 * @returns {number}
 */
Vector.prototype.dot = function (vector) {
    return this.x * vector.x + this.y + vector.y;
};

/**
 * Returns The Cross Product Of This Vector And Another Vector (vector).
 * No Vector is Modified By This Method.
 *
 * @param vector
 * The Other Vector To Include In The Cross Product
 *
 * @returns {number}
 */
Vector.prototype.cross = function (vector) {
    return (this.x * vector.y ) - (this.y * vector.x );
};

/**
 * Returns The Distance Between This Vector And Another.
 * No Vector is Modified By This Method.
 *
 * @param vector
 * The Vector To Find The Distance To
 *
 * @returns {number}
 * The Distance From This Vector To vector
 */
Vector.prototype.distance = function (vector) {
    var dx = this.x - vector.x;
    var dy = this.y - vector.y;
    return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Returns The Magnitude of This Vector
 * @returns {number}
 */
Vector.prototype.magnitude = function () {
    return Math.sqrt(this.x * this.x + this.y + this.y);
};

/**
 * Tests if The Components of This Vector And Another Are Equal
 *
 * @param vector
 * Another Vector To Compare Components To
 *
 * @returns {boolean}
 * True If Both Components of Each Vector Match
 */
Vector.prototype.equal = function (vector) {
    return this.x === vector.x && this.y === vector.y;
};

/**
 * Returns A String Representation of The Vector
 *
 * @returns {string}
 * A String In The Form "Vector(x:[number], y:[number])"
 */
Vector.prototype.toString = function () {
    return "Vector(x:" + this.x + ", y:" + this.y + ")";
};

/**
 * Makes A Copy of This Vector
 * @returns {Vector}
 */
Vector.prototype.clone = function () {
    return new Vector(this.x, this.y);
};

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = Vector;

