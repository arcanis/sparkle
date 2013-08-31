exports.sphere = function ( radius, inner, uniform ) {

    if ( typeof inner === 'undefined' )
        inner = false;

    if ( typeof uniform === 'undefined' )
        uniform = true;

    return function ( vector ) {

        if ( uniform ) {

            var z = Math.random( ) * 2 - 1;
            var t = Math.random( ) * Math.PI * 2;

            var r = Math.sqrt( 1 - Math.pow( z, 2 ) );
            var v = inner
                ? Math.pow( Math.random( ), 1 / 3 )
                : 1;

            vector[ 0 ] = radius * v * r * Math.cos( t );
            vector[ 1 ] = radius * v * r * Math.sin( t );
            vector[ 2 ] = radius * v * z;

        } else {

            var r = this._inner
                ? Math.floor( Math.random( ) * ( this._radius + 1 ) )
                : this._radius;
            var p = Math.random( ) * Math.PI * 2;
            var t = Math.random( ) * Math.PI;

            vector[ 0 ] = r * Math.cos( p ) * Math.sin( t );
            vector[ 1 ] = r * Math.sin( p ) * Math.sin( t );
            vector[ 2 ] = r * Math.cos( t );

        }

    };

};
