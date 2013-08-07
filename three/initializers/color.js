var colorFactory = require( 'factories/colors' ).factory;

var Color = exports.Color = function ( zone, mode ) {

    this._zone = zone;

    this._mode = ( mode || 'RGB' ).toUpperCase( );

};

Color.prototype.initialize = function ( particle ) {

    var coord = this._zone.random( );

    particle.color = colorFactory.alloc( );
    particle.color[ 'set' + this._mode ]( coord.x, coord.y, coord.z );

    this._zone.free( coord );

};
