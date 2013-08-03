var Lambda = exports.Lambda = function ( fn ) {

    this._fn = fn;

};

Lambda.prototype.initialize = function ( particle ) {

    this._fn.call( null, particle );

};
