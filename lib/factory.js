var Factory = exports.Factory = function ( constructor ) {

    this._constructor = constructor;

    this._proxy = function ( ) { };
    this._proxy.prototype = this._constructor.prototype;

    this._pool = [ ];
    this._tag = { };

};

Factory.prototype.allocate = function ( ) {

    if ( ! this._pool.length ) {
        var newInstance = new ( this._proxy )( );
        newInstance._tag = this._tag;
        this._pool.push( newInstance );
    }

    var instance = this._pool.pop( );
    this._constructor.call( instance );

    return instance;

};

Factory.prototype.free = function ( instance ) {

    if ( instance._tag !== this._tag )
        return ;

    this._pool.push( instance );

};
