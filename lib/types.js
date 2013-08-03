var Particle = exports.Particle = function ( ) {
    this.status = this.ALIVE;
};

Particle.prototype.ALIVE = 0;
Particle.prototype.DEAD = 1;
Particle.prototype.USER = 2;

var Coord = exports.Coord = function ( ) {
    this.x = 0;
    this.y = 0;
    this.z = 0;
};
