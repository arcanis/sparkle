var coordFactory = require( 'factories/coords' ).factory;

var Cuboid = exports.Cuboid = function ( sx, sy, sz, inner ) {

    this._sx = sx;
    this._sy = sy;
    this._sz = sz;

    this._inner = Boolean( inner );

};

Cuboid.prototype.FACES = [ [ +1, 'x', 'y', 'z' ]
                         , [ -1, 'x', 'y', 'z' ]
                         , [ +1, 'y', 'z', 'x' ]
                         , [ -1, 'y', 'z', 'x' ]
                         , [ +1, 'z', 'x', 'y' ]
                         , [ -1, 'z', 'x', 'y' ] ];

Cuboid.prototype.random = function ( ) {

    if ( ! this._inner )
        return this.randomSurface( );

    var coord = coordFactory.alloc( );

    coord.x = ( Math.random( ) - .5 ) * this._sx;
    coord.y = ( Math.random( ) - .5 ) * this._sy;
    coord.z = ( Math.random( ) - .5 ) * this._sz;

    return coord;

};

Cuboid.prototype.randomSurface = function ( ) {

    var face = this.FACES[ Math.floor( Math.random( ) * 6 ) ];

    var coord = coordFactory.alloc( );

    coord[ face[ 1 ] ] = face[ 0 ] * this[ '_s' + face[ 1 ] ] / 2;
    coord[ face[ 2 ] ] = ( Math.random( ) - .5 ) * this[ '_s' + face[ 2 ] ];
    coord[ face[ 3 ] ] = ( Math.random( ) - .5 ) * this[ '_s' + face[ 3 ] ];

    return coord;

};

Cuboid.prototype.free = function ( coord ) {

    coordFactory.free( coord );

};
