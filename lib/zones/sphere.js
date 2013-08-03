var coordFactory = require( 'factories/coords' ).factory;

var Sphere = exports.Sphere = function ( radius, inner, uniform ) {

    this._radius = radius;

    this._inner = Boolean( inner );

    this._uniform = Boolean( uniform );

};

Sphere.prototype.random = function ( ) {

    if ( this._uniform )
        return this.randomUniform( );

    var r = this._inner
        ? Math.floor( Math.random( ) * ( this._radius + 1 ) )
        : this._radius;
    var p = Math.random( ) * Math.PI * 2;
    var t = Math.random( ) * Math.PI;

    var coord = coordFactory.alloc( );

    coord.x = r * Math.cos( p ) * Math.sin( t );
    coord.y = r * Math.sin( p ) * Math.sin( t );
    coord.z = r * Math.cos( t );

    return coord;

};

Sphere.prototype.randomUniform = function ( ) {

    var z = Math.random( ) * 2 - 1;
    var t = Math.random( ) * Math.PI * 2;

    var r = Math.sqrt( 1 - Math.pow( z, 2 ) );
    var v = this._inner
        ? Math.pow( Math.random( ), 1 / 3 )
        : 1;

    var coord = coordFactory.alloc( );

    coord.x = this._radius * v * r * Math.cos( t );
    coord.y = this._radius * v * r * Math.sin( t );
    coord.z = this._radius * v * z;

    return coord;

};

Sphere.prototype.free = function ( coord ) {

    coordFactory.free( coord );

};
