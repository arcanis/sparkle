var Lambda = exports.Lambda = function ( fn, context ) {

    this._fn = fn;

    this._context = context || null;

};

Lambda.prototype.initialize = function ( particle ) {

    this._fn.call( this._context, particle );

};
