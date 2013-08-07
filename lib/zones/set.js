var Set = exports.Set = function ( coords ) {

    this._coords = coords;

};

Set.prototype.random = function ( ) {

    return this._coords[ Math.floor( Math.random( ) * this._coords.length ) ];

};

Set.prototype.free = function ( ) {

};
