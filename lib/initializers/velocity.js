var Velocity = exports.Velocity = function ( zone ) {

    this._zone = zone;

};

Velocity.prototype.initialize = function ( particle ) {

    particle.velocity = this._zone.random( );

};

Velocity.prototype.discard = function ( particle ) {

    this._zone.free( particle.velocity );

};
