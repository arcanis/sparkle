var coordFactory = require( 'factories/coords' ).factory;

var Async = exports.Async = function ( fn ) {

    this._fallback = coordFactory.alloc( );
    this._fallback.x = 0;
    this._fallback.y = 0;
    this._fallback.z = 0;

    fn( this.update.bind( this ) );

};

Async.prototype.update = function ( zone ) {

    this._zone = zone;

};

Async.prototype.random = function ( ) {

    if ( ! this._zone )
        return this._fallback;

    return this._zone.random( );

};

Async.prototype.free = function ( coord ) {

    if ( coord === this._fallback )
        return ;

    this._zone.free( coord );

};
