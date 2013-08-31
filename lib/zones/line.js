exports.line = function ( bx, by, bz, ex, ey, ez ) {

    if ( arguments[ 0 ] instanceof Array && arguments.length === 1 ) {
        arguments[ 1 ] = arguments[ 0 ];
        arguments.length += 1;
    }

    if ( arguments[ 0 ] instanceof Array ) {
        var vector = arguments[ 0 ];
        arguments[ 5 ] = arguments[ 3 ];
        arguments[ 4 ] = arguments[ 2 ];
        arguments[ 3 ] = arguments[ 1 ];
        arguments[ 2 ] = vector[ 2 ];
        arguments[ 1 ] = vector[ 1 ];
        arguments[ 0 ] = vector[ 0 ];
        arguments.length += 2;
    }

    if ( arguments[ 3 ] instanceof Array ) {
        var vector = arguments[ 3 ];
        arguments[ 5 ] = vector[ 2 ];
        arguments[ 4 ] = vector[ 1 ];
        arguments[ 3 ] = vector[ 0 ];
        arguments.length += 2;
    }

    if ( arguments.length === 1 ) {
        ex = arguments[ 0 ];
        bx = by = bz = 0;
        ey = ez = 0;
    }

    if ( arguments.length === 2 ) {
        bx = arguments[ 0 ];
        ex = arguments[ 1 ];
        by = bz = 0;
        ey = ez = 0;
    }

    if ( arguments.length === 3 ) {
        ex = arguments[ 0 ];
        ey = arguments[ 1 ];
        ez = arguments[ 2 ];
        bx = by = bz = 0;
    }

    var dx = ex - bx;
    var dy = ey - by;
    var dz = ez - bz;

    return function ( vector ) {

        var r = Math.random( );

        vector[ 0 ] = bx + r * dx;
        vector[ 1 ] = by + r * dy;
        vector[ 2 ] = bz + r * dz;

    };

};
