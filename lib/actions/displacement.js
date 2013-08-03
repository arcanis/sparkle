var Displacement = exports.Displacement = function ( ) {
};

Displacement.prototype.update = function ( particle, delta ) {

    var position = particle.position;
    var velocity = particle.velocity;

    position.x += velocity.x * delta;
    position.y += velocity.y * delta;
    position.z += velocity.z * delta;

};
