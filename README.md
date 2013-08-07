# Sparkle

## Basic Usage

### With Three.js

```js
var emitter, velocity = new SPARKLE.SphereZone( 10, 10, 10 );
scene.add( emitter = new SPARKLE.THREE.Emitter( {
    count : 1000,
    lifeTime : [ 1, 1.5 ],
    fading : true,
    color : new THREE.CuboidZone( .2, 0, 0 ),
    velocity : velocity
} ) );

var render = function ( ) {
    window.requestAnimationFrame( render );
    emitter.update( clock.getDelta( ) );
    renderer.render( scene, camera );
};
```

### Without Three.js

```js
var emitter = new SPARKLE.Emitter( );

emitter.initializer( new SPARKLE.LifeTimeInitializer( 1, 1.15 ) );
emitter.initializer( new SPARKLE.VelocityInitializer( new SPARKLE.SphereZone( 10, 10, 10 ) ) );

emitter.action( new SPARKLE.AgeingAction( ) );
emitter.action( new SPARKLE.DisplacementAction( ) );
emitter.action( new SPARKLE.FadingAction( ) );

emitter.onWakeUp = myCustomRenderer.onWakeUp;
emitter.onUpdate = myCustomRenderer.onUpdate;
emitter.onSleep = myCustomRenderer.onSleep;

emitter.spawn( 1000, 10 );

setInterval( function ( ) {
    emitter.update( 1000 / 60 );
}, 1000 / 60 );
```

## [Example](http://arcanis.github.io/sparkle/example/) ([More examples](http://imgur.com/a/MMxnT))

[![Example](http://i.imgur.com/TJ7uKyB.png)](http://arcanis.github.io/sparkle/example/)

## Reference

### Initializers

They are called during particle creation & destruction. They contain the two following methods :

 - `initialize( particle )`, which is called at the particle creation.
 - `discard( particle )`, which is called at the particle destruction.

#### `SPARKLE.LambdaInitializer( fn [, context] )`

Will call `fn` with target `context` when the particle will be initialized.

#### `SPARKLE.LifeTimeInitializer( min, max )`

Will set the lifetime of the particle to a random value between `min` and `max`.

#### `SPARKLE.PositionInitializer( zone )`

Will set the particle position to a random point inside `zone`.

#### `SPARKLE.VelocityInitializer( zone )`

Will set the particle velocity to a random value from `zone`.

#### `SPARKLE.THREE.ColorInitializer( zone )` (Three.js only)

Will set the particle color to a random value from `zone`. X, Y and Z values will be respectively mapped on R, G and B.

### Actions

They are called at each frame. They contain the following method :

- `update( particle, delta )`, which can do whatever synchronous action you want.

#### `SPARKLE.AccelerationAction( zone )`

Constantly increase particle velocity. Requires a Velocity initializer.

#### `SPARKLE.AgeingAction( )`

Make particle ageing, then kill it. Requires a LifeTime initializer.

#### `SPARKLE.DisplacementAction( )`

Make particle move. Requires Position and Velocity initializers.

#### `SPARKLE.FadingAction( [ fn ] )`

Make particle opacity change according to its age. `fn` can be a function which takes the particle age (in a `[0 ; 1]` range), and returns its opacity. Requires a LifeTime initializer.

### Zones

They represent a geometrical shape. They contain the two following methods :

- `random( )`, which has to return a random coordinate inside the zone.
- `free( coord )`, which dispose the coordinate.

#### `SPARKLE.AsyncZone( fn [, context] )`

Immediately calls `fn` with the specified context, passing it a function as parameter. This function takes a Zone as parameter, and set it as the 'real' zone.

As long as this callback is not alled, the AsyncZone will always return a null position.

#### `SPARKLE.CuboidZone( sx, sy, sz [, inner ] )`

Represents a cuboid.

#### `SPARKLE.LineZone( bx, by, bz, ex, ey, ez )`

Represents a line.

#### `SPARKLE.PointZone( x, y, z )`

Represents a point.

#### `SPARKLE.SphereZone( r, inner, uniform )`

Represents a sphere.

#### `SPARKLE.THREE.SetZone( points )`

Represents an array of coordinates.

When a coordinate will have to be generated, it will be one of those points.

#### `SPARKLE.THREE.GeometryZone( geometry )` (Three.js only)

Represents a Three.js geometry.

The points will always be at the surface of the geometry.

## License

> Copyright (C) 2013 Maël Nison
>
> Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
>
> The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
