var Acceleration = exports.Acceleration = function ( x, y, z ) {

    this._x = x;
    this._y = y;
    this._z = z;

};

Acceleration.prototype.update = function ( particle, delta ) {

    var velocity = particle.velocity;

    velocity.x += delta * this._x;
    velocity.y += delta * this._y;
    velocity.z += delta * this._z;

};
