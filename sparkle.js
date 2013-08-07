(function (global) {
    function require(file, parentModule) {
        if ({}.hasOwnProperty.call(require.cache, file))
            return require.cache[file];
        var resolved = require.resolve(file);
        if (!resolved)
            throw new Error('Failed to resolve module ' + file);
        var module$ = {
                id: file,
                require: require,
                filename: file,
                exports: {},
                loaded: false,
                parent: parentModule,
                children: []
            };
        if (parentModule)
            parentModule.children.push(module$);
        var dirname = file.slice(0, file.lastIndexOf('/') + 1);
        require.cache[file] = module$.exports;
        resolved.call(module$.exports, module$, module$.exports, dirname, file);
        module$.loaded = true;
        return require.cache[file] = module$.exports;
    }
    require.modules = {};
    require.cache = {};
    require.resolve = function (file) {
        return {}.hasOwnProperty.call(require.modules, file) ? require.modules[file] : void 0;
    };
    require.define = function (file, fn) {
        require.modules[file] = fn;
    };
    var process = function () {
            var cwd = '/';
            return {
                title: 'browser',
                version: 'v0.10.5',
                browser: true,
                env: {},
                argv: [],
                nextTick: global.setImmediate || function (fn) {
                    setTimeout(fn, 0);
                },
                cwd: function () {
                    return cwd;
                },
                chdir: function (dir) {
                    cwd = dir;
                }
            };
        }();
    require.define('/index.js', function (module, exports, __dirname, __filename) {
        exports.Emitter = require('/emitter.js', module).Emitter;
        exports.Factory = require('/factory.js', module).Factory;
        exports.LambdaInitializer = require('/initializers/lambda.js', module).Lambda;
        exports.PositionInitializer = require('/initializers/position.js', module).Position;
        exports.VelocityInitializer = require('/initializers/velocity.js', module).Velocity;
        exports.LifeTimeInitializer = require('/initializers/lifetime.js', module).LifeTime;
        exports.AccelerationAction = require('/actions/acceleration.js', module).Acceleration;
        exports.AgeingAction = require('/actions/ageing.js', module).Ageing;
        exports.DisplacementAction = require('/actions/displacement.js', module).Displacement;
        exports.FadingAction = require('/actions/fading.js', module).Fading;
        exports.PointZone = require('/zones/point.js', module).Point;
        exports.LineZone = require('/zones/line.js', module).Line;
        exports.CuboidZone = require('/zones/cuboid.js', module).Cuboid;
        exports.SphereZone = require('/zones/sphere.js', module).Sphere;
        exports.AsyncZone = require('/zones/async.js', module).Async;
        exports.SetZone = require('/zones/set.js', module).Set;
        exports.particleFactory = require('/factories/particles.js', module).factory;
        exports.coordFactory = require('/factories/coords.js', module).factory;
    });
    require.define('/factories/coords.js', function (module, exports, __dirname, __filename) {
        var Factory = require('/factory.js', module).Factory;
        exports.factory = new Factory(require('/types.js', module).Coord);
    });
    require.define('/types.js', function (module, exports, __dirname, __filename) {
        var Particle = exports.Particle = function () {
                this.status = this.ALIVE;
            };
        Particle.prototype.ALIVE = 0;
        Particle.prototype.DEAD = 1;
        Particle.prototype.USER = 2;
        var Coord = exports.Coord = function () {
                this.x = 0;
                this.y = 0;
                this.z = 0;
            };
    });
    require.define('/factory.js', function (module, exports, __dirname, __filename) {
        var Factory = exports.Factory = function (constructor) {
                this._constructor = constructor;
                this._proxy = function () {
                };
                this._proxy.prototype = this._constructor.prototype;
                this._pool = [];
            };
        Factory.prototype.alloc = function () {
            var instance = this._pool.length ? this._pool.pop() : new this._proxy();
            this._constructor.call(instance);
            return instance;
        };
        Factory.prototype.free = function (instance) {
            this._pool.push(instance);
        };
    });
    require.define('/factories/particles.js', function (module, exports, __dirname, __filename) {
        var Factory = require('/factory.js', module).Factory;
        exports.factory = new Factory(require('/types.js', module).Particle);
    });
    require.define('/zones/set.js', function (module, exports, __dirname, __filename) {
        var Set = exports.Set = function (coords) {
                this._coords = coords;
            };
        Set.prototype.random = function () {
            return this._coords[Math.floor(Math.random() * this._coords.length)];
        };
        Set.prototype.free = function () {
        };
    });
    require.define('/zones/async.js', function (module, exports, __dirname, __filename) {
        var coordFactory = require('/factories/coords.js', module).factory;
        var Async = exports.Async = function (fn, context) {
                this._fallback = coordFactory.alloc();
                this._fallback.x = 0;
                this._fallback.y = 0;
                this._fallback.z = 0;
                fn.call(context, this.update.bind(this));
            };
        Async.prototype.update = function (zone) {
            this._zone = zone;
        };
        Async.prototype.random = function () {
            if (!this._zone)
                return this._fallback;
            return this._zone.random();
        };
        Async.prototype.free = function (coord) {
            if (coord === this._fallback)
                return;
            this._zone.free(coord);
        };
    });
    require.define('/zones/sphere.js', function (module, exports, __dirname, __filename) {
        var coordFactory = require('/factories/coords.js', module).factory;
        var Sphere = exports.Sphere = function (radius, inner, uniform) {
                this._radius = radius;
                this._inner = Boolean(inner);
                this._uniform = Boolean(uniform);
            };
        Sphere.prototype.random = function () {
            if (this._uniform)
                return this.randomUniform();
            var r = this._inner ? Math.floor(Math.random() * (this._radius + 1)) : this._radius;
            var p = Math.random() * Math.PI * 2;
            var t = Math.random() * Math.PI;
            var coord = coordFactory.alloc();
            coord.x = r * Math.cos(p) * Math.sin(t);
            coord.y = r * Math.sin(p) * Math.sin(t);
            coord.z = r * Math.cos(t);
            return coord;
        };
        Sphere.prototype.randomUniform = function () {
            var z = Math.random() * 2 - 1;
            var t = Math.random() * Math.PI * 2;
            var r = Math.sqrt(1 - Math.pow(z, 2));
            var v = this._inner ? Math.pow(Math.random(), 1 / 3) : 1;
            var coord = coordFactory.alloc();
            coord.x = this._radius * v * r * Math.cos(t);
            coord.y = this._radius * v * r * Math.sin(t);
            coord.z = this._radius * v * z;
            return coord;
        };
        Sphere.prototype.free = function (coord) {
            coordFactory.free(coord);
        };
    });
    require.define('/zones/cuboid.js', function (module, exports, __dirname, __filename) {
        var coordFactory = require('/factories/coords.js', module).factory;
        var Cuboid = exports.Cuboid = function (sx, sy, sz, inner) {
                this._sx = sx;
                this._sy = sy;
                this._sz = sz;
                this._inner = Boolean(inner);
            };
        Cuboid.prototype.FACES = [
            [
                +1,
                'x',
                'y',
                'z'
            ],
            [
                -1,
                'x',
                'y',
                'z'
            ],
            [
                +1,
                'y',
                'z',
                'x'
            ],
            [
                -1,
                'y',
                'z',
                'x'
            ],
            [
                +1,
                'z',
                'x',
                'y'
            ],
            [
                -1,
                'z',
                'x',
                'y'
            ]
        ];
        Cuboid.prototype.random = function () {
            if (!this._inner)
                return this.randomSurface();
            var coord = coordFactory.alloc();
            coord.x = (Math.random() - 0.5) * this._sx;
            coord.y = (Math.random() - 0.5) * this._sy;
            coord.z = (Math.random() - 0.5) * this._sz;
            return coord;
        };
        Cuboid.prototype.randomSurface = function () {
            var face = this.FACES[Math.floor(Math.random() * 6)];
            var coord = coordFactory.alloc();
            coord[face[1]] = face[0] * this['_s' + face[1]] / 2;
            coord[face[2]] = (Math.random() - 0.5) * this['_s' + face[2]];
            coord[face[3]] = (Math.random() - 0.5) * this['_s' + face[3]];
            return coord;
        };
        Cuboid.prototype.free = function (coord) {
            coordFactory.free(coord);
        };
    });
    require.define('/zones/line.js', function (module, exports, __dirname, __filename) {
        var coordFactory = require('/factories/coords.js', module).factory;
        var Line = exports.Line = function (bx, by, bz, ex, ey, ez) {
                if (arguments.length === 3) {
                    ex = bx;
                    ey = by;
                    ez = bz;
                    bx = 0;
                    by = 0;
                    bz = 0;
                }
                this._bx = bx;
                this._by = by;
                this._bz = bz;
                this._dx = ex - bx;
                this._dy = ey - by;
                this._dz = ez - bz;
            };
        Line.prototype.random = function () {
            var r = Math.random();
            var coord = coordFactory.alloc();
            coord.x = this._bx + r * this._dx;
            coord.y = this._by + r * this._dy;
            coord.z = this._bz + r * this._dz;
            return coord;
        };
        Line.prototype.free = function (coord) {
            coordFactory.free(coord);
        };
    });
    require.define('/zones/point.js', function (module, exports, __dirname, __filename) {
        var coordFactory = require('/factories/coords.js', module).factory;
        var Point = exports.Point = function (x, y, z) {
                this._x = x || 0;
                this._y = y || 0;
                this._z = z || 0;
            };
        Point.prototype.random = function () {
            var coord = coordFactory.alloc();
            coord.x = this._x;
            coord.y = this._y;
            coord.z = this._z;
            return coord;
        };
        Point.prototype.free = function (coord) {
            coordFactory.free(coord);
        };
    });
    require.define('/actions/fading.js', function (module, exports, __dirname, __filename) {
        var Fading = exports.Fading = function (fn) {
                this._fn = fn || function (n) {
                    return Math.sqrt(n - Math.pow(n, 2));
                };
            };
        Fading.prototype.update = function (particle) {
            var age = Math.min(particle.age, particle.lifeTime);
            particle.opacity = this._fn(age / particle.lifeTime);
        };
    });
    require.define('/actions/displacement.js', function (module, exports, __dirname, __filename) {
        var Displacement = exports.Displacement = function () {
            };
        Displacement.prototype.update = function (particle, delta) {
            var position = particle.position;
            var velocity = particle.velocity;
            position.x += velocity.x * delta;
            position.y += velocity.y * delta;
            position.z += velocity.z * delta;
        };
    });
    require.define('/actions/ageing.js', function (module, exports, __dirname, __filename) {
        var Ageing = exports.Ageing = function () {
            };
        Ageing.prototype.update = function (particle, delta) {
            particle.age += delta;
            if (particle.age > particle.lifeTime) {
                particle.status = particle.DEAD;
            }
        };
    });
    require.define('/actions/acceleration.js', function (module, exports, __dirname, __filename) {
        var Acceleration = exports.Acceleration = function (x, y, z) {
                this._x = x;
                this._y = y;
                this._z = z;
            };
        Acceleration.prototype.update = function (particle, delta) {
            var velocity = particle.velocity;
            velocity.x += delta * this._x;
            velocity.y += delta * this._y;
            velocity.z += delta * this._z;
        };
    });
    require.define('/initializers/lifetime.js', function (module, exports, __dirname, __filename) {
        var LifeTime = exports.LifeTime = function (min, max) {
                this._min = min;
                this._diff = max - min;
            };
        LifeTime.prototype.initialize = function (particle) {
            particle.age = 0;
            particle.lifeTime = this._min + Math.random() * this._diff;
        };
    });
    require.define('/initializers/velocity.js', function (module, exports, __dirname, __filename) {
        var Velocity = exports.Velocity = function (zone) {
                this._zone = zone;
            };
        Velocity.prototype.initialize = function (particle) {
            particle.velocity = this._zone.random();
        };
        Velocity.prototype.discard = function (particle) {
            this._zone.free(particle.velocity);
        };
    });
    require.define('/initializers/position.js', function (module, exports, __dirname, __filename) {
        var Position = exports.Position = function (zone) {
                this._zone = zone;
            };
        Position.prototype.initialize = function (particle) {
            particle.position = this._zone.random();
        };
        Position.prototype.discard = function (particle) {
            this._zone.free(particle.position);
        };
    });
    require.define('/initializers/lambda.js', function (module, exports, __dirname, __filename) {
        var Lambda = exports.Lambda = function (fn, context) {
                this._fn = fn;
                this._context = context || null;
            };
        Lambda.prototype.initialize = function (particle) {
            this._fn.call(this._context, particle);
        };
    });
    require.define('/emitter.js', function (module, exports, __dirname, __filename) {
        var particleFactory = require('/factories/particles.js', module).factory;
        var Emitter = exports.Emitter = function (frequency) {
                this._frequency = frequency;
                this._timer = 0;
                this._initializers = [];
                this._actions = [];
                this._particles = [];
            };
        Emitter.prototype.initializer = function (initializer) {
            this._initializers.push(initializer);
            return this;
        };
        Emitter.prototype.action = function (action) {
            this._actions.push(action);
            return this;
        };
        Emitter.prototype.spawn = function (count, randomly) {
            for (var t = 0, T = count; t < T; ++t) {
                this.createParticle(randomly != null ? Math.random() * randomly : 0);
            }
        };
        Emitter.prototype.update = function (delta) {
            for (var t = this._particles.length - 1; t >= 0; --t)
                this.updateParticle(delta, t);
            for (var timer = this._timer + delta; timer >= this._frequency;)
                this.createParticle(timer -= this._frequency);
            this._timer = timer;
        };
        Emitter.prototype.createParticle = function (delta) {
            var particle = particleFactory.alloc();
            for (var t = 0, T = this._initializers.length; t < T; ++t)
                if (this._initializers[t].initialize)
                    this._initializers[t].initialize(particle);
            this._particles.unshift(particle);
            if (!this.deathToll(particle, 0)) {
                this.onWakeUp(particle);
                this.updateParticle(delta, 0);
            }
        };
        Emitter.prototype.updateParticle = function (delta, n) {
            var particle = this._particles[n];
            for (var t = 0, T = this._actions.length; t < T; ++t)
                if (this._actions[t].update)
                    this._actions[t].update(particle, delta);
            if (!this.deathToll(particle, n)) {
                this.onUpdate(particle);
            }
        };
        Emitter.prototype.deathToll = function (particle, n) {
            if (particle.status !== particle.DEAD)
                return false;
            this._particles.splice(n, 1);
            this.onSleep(particle);
            for (var t = 0, T = this._initializers.length; t < T; ++t)
                if (this._initializers[t].discard)
                    this._initializers[t].discard(particle);
            particleFactory.free(particle);
            return true;
        };
        Emitter.prototype.onWakeUp = function (particle) {
        };
        Emitter.prototype.onUpdate = function (particle) {
        };
        Emitter.prototype.onSleep = function (particle) {
        };
    });
    global.SPARKLE = require('/index.js');
}.call(this, this));