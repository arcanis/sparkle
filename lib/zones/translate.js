exports.translate = function ( zone, tx, ty, tz ) {

    if ( arguments.length === 2 ) {
        var vector = arguments[ 1 ];
        tx = vector[ 0 ];
        ty = vector[ 1 ];
        tz = vector[ 2 ];
    }

    return function ( vector ) {

        zone( vector );

        vector[ 0 ] += tx;
        vector[ 1 ] += ty;
        vector[ 2 ] += tz;

    };

};
