var coordFactory = require( 'factories/coords' ).factory;

var Point = exports.Point = function ( x, y, z ) {

    this._x = x || 0;
    this._y = y || 0;
    this._z = z || 0;

};

Point.prototype.random = function ( ) {

    var coord = coordFactory.alloc( );

    coord.x = this._x;
    coord.y = this._y;
    coord.z = this._z;

    return coord;

};

Point.prototype.free = function ( coord ) {

    coordFactory.free( coord );

};
