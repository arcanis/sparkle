exports.Emitter                 = require( 'emitter' ).Emitter;

exports.LambdaInitializer       = require( 'initializers/lambda' ).Lambda;
exports.PositionInitializer     = require( 'initializers/position' ).Position;
exports.VelocityInitializer     = require( 'initializers/velocity' ).Velocity;
exports.LifeTimeInitializer     = require( 'initializers/lifetime' ).LifeTime;

exports.AccelerationAction      = require( 'actions/acceleration' ).Acceleration;
exports.AgeingAction            = require( 'actions/ageing' ).Ageing;
exports.DisplacementAction      = require( 'actions/displacement' ).Displacement;

exports.PointZone               = require( 'zones/point' ).Point;
exports.LineZone                = require( 'zones/line' ).Line;
exports.CuboidZone              = require( 'zones/cuboid' ).Cuboid;
exports.SphereZone              = require( 'zones/sphere' ).Sphere;
exports.AsyncZone               = require( 'zones/async' ).Async;

exports.particleFactory         = require( 'factories/particles' ).factory;
exports.coordFactory            = require( 'factories/coords' ).factory;
