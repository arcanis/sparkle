var coordFactory = require( 'factories/coords' ).factory;

var Line = exports.Line = function ( bx, by, bz, ex, ey, ez ) {

    if ( arguments.length === 3 ) {
        ex = bx;
        ey = by;
        ez = bz;

        bx = 0;
        by = 0;
        bz = 0;
    }

    this._bx = bx;
    this._by = by;
    this._bz = bz;

    this._dx = ex - bx;
    this._dy = ey - by;
    this._dz = ez - bz;

};

Line.prototype.random = function ( ) {

    var r = Math.random( );

    var coord = coordFactory.alloc( );

    coord.x = this._bx + r * this._dx;
    coord.y = this._by + r * this._dy;
    coord.z = this._bz + r * this._dz;

    return coord;

};

Line.prototype.free = function ( coord ) {

    coordFactory.free( coord );

};
