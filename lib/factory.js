var Factory = exports.Factory = function ( constructor ) {

    this._constructor = constructor;

    this._proxy = function ( ) { };
    this._proxy.prototype = this._constructor.prototype;

    this._pool = [ ];

};

Factory.prototype.alloc = function ( ) {

    var instance = this._pool.length
        ? this._pool.pop( )
        : new ( this._proxy )( );

    this._constructor.call( instance );

    return instance;

};

Factory.prototype.free = function ( instance ) {

    this._pool.push( instance );

};
