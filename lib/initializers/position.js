var Position = exports.Position = function ( zone ) {

    this._zone = zone;

};

Position.prototype.initialize = function ( particle ) {

    particle.position = this._zone.random( );

};

Position.prototype.discard = function ( particle ) {

    this._zone.free( particle.position );

};
