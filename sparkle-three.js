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
        exports.GeometryZone = require('/zones/geometry.js', module).Geometry;
    });
    require.define('/zones/geometry.js', function (module, exports, __dirname, __filename) {
        var triangleArea = function (a, b, c) {
            return 0.5 * Math.sqrt(Math.pow(b.x * c.y - c.x * b.y, 2) + Math.pow(c.x * a.y - a.x * c.y, 2) + Math.pow(a.x * b.y - b.x * a.y, 2));
        };
        var Geometry = exports.Geometry = function (geometry) {
                this._total = 0;
                this._faces = [];
                console.log(geometry);
                geometry.faces.forEach(function (face) {
                    if (face instanceof THREE.Face4)
                        throw new Error('Unsupported');
                    var triangle = {
                            a: geometry.vertices[face.a],
                            b: geometry.vertices[face.b],
                            c: geometry.vertices[face.c]
                        };
                    var area = triangleArea(triangle.a, triangle.b, triangle.c);
                    this._faces.push({
                        position: this._total,
                        face: triangle
                    });
                    this._total += area;
                }, this);
                console.log(this);
            };
        Geometry.prototype.random = function () {
            var r = Math.random() * this._total, closest = null, diff = Number.POSITIVE_INFINITY;
            for (var t = 0, T = this._faces.length; t < T; ++t) {
                var currentDiff = Math.abs(r - this._faces[t].position);
                if (currentDiff < diff) {
                    closest = t;
                    diff = currentDiff;
                }
            }
            var face = this._faces[closest];
            var b0 = Math.random();
            var b1 = (1 - b0) * Math.random();
            var b2 = 1 - b0 - b1;
            var coord = SPARKLE.coordFactory.alloc();
            coord.x = face.face.a.x * b0 + face.face.b.x * b1 + face.face.c.x * b2;
            coord.y = face.face.a.y * b0 + face.face.b.y * b1 + face.face.c.y * b2;
            coord.z = face.face.a.z * b0 + face.face.b.z * b1 + face.face.c.z * b2;
            return coord;
        };
        Geometry.prototype.free = function (coord) {
            SPARKLE.coordFactory.free(coord);
        };
    });
    require.define('/emitter.js', function (module, exports, __dirname, __filename) {
        var Material = require('/material.js', module).Material;
        var Emitter = exports.Emitter = function (options) {
                options = options || {};
                var count = options.count != null ? options.count : 100;
                var material = options.material ? options.material : new Material(count, options.color);
                var geometry = new THREE.Geometry();
                var particlePool = this.particlePool = [];
                for (var t = 0, T = count; t < T; ++t) {
                    var inf = Number.POSITIVE_INFINITY;
                    var particle = new THREE.Vector3(inf, inf, inf);
                    geometry.vertices.push(particle);
                    particlePool.push(particle);
                }
                THREE.ParticleSystem.call(this, geometry, material);
                this.dynamic = true;
                this.emitter = new SPARKLE.Emitter(options.frequency != null ? options.frequency : 0.5);
                this.emitter.initializer(new SPARKLE.LambdaInitializer(function (particle) {
                    particle.vertice = particlePool.pop();
                }));
                if (options.position != null) {
                    this.emitter.initializer(new SPARKLE.PositionInitializer(options.position));
                } else {
                    this.emitter.initializer(new SPARKLE.PositionInitializer(new SPARKLE.PointZone(0, 0, 0)));
                }
                if (options.lifeTime != null) {
                    this.emitter.initializer(new SPARKLE.LifeTimeInitializer(options.lifeTime[0], options.lifeTime[1]));
                    if (options.fadeIn != null)
                        this.emitter.action(new SPARKLE.FadeInAction(options.fadeIn.duration));
                    if (options.fadeOut != null)
                        this.emitter.action(new SPARKLE.FadeOutAction(options.fadeOut.duration));
                    this.emitter.action(new SPARKLE.AgeingAction());
                }
                if (options.velocity != null) {
                    this.emitter.initializer(new SPARKLE.VelocityInitializer(options.velocity));
                    if (options.acceleration != null)
                        this.emitter.action(new SPARKLE.AccelerationAction(options.acceleration[0], options.acceleration[1], options.acceleration[2]));
                    this.emitter.action(new SPARKLE.DisplacementAction());
                }
                if (options.initializers != null) {
                    options.initializers.forEach(function (initializer) {
                        this.emitter.initializer(initializer);
                    }, this);
                }
                if (options.actions != null) {
                    options.actions.forEach(function (action) {
                        this.emitter.action(action);
                    }, this);
                }
                this.emitter.onWakeUp = this.onWakeUp.bind(this);
                this.emitter.onUpdate = this.onUpdate.bind(this);
                this.emitter.onSleep = this.onSleep.bind(this);
                if (options.initial != null) {
                    this.emitter.spawn(options.initial[0], options.initial[1]);
                }
            };
        var F = function () {
        };
        F.prototype = THREE.ParticleSystem.prototype;
        Emitter.prototype = new F();
        Emitter.prototype.constructor = Emitter;
        Emitter.prototype.update = function (delta) {
            this.emitter.update(delta);
            return this;
        };
        Emitter.prototype.spawn = function (count, randomly) {
            this.emitter.spawn(count, randomly);
            return this;
        };
        Emitter.prototype.onWakeUp = function (particle, delta) {
        };
        Emitter.prototype.onUpdate = function (particle, delta) {
            if (!particle.vertice)
                return;
            particle.vertice.copy(particle.position);
            this.geometry.verticesNeedUpdate = true;
        };
        Emitter.prototype.onSleep = function (particle, delta) {
            if (!particle.vertice)
                return;
            var inf = Number.POSITIVE_INFINITY;
            particle.vertice.set(inf, inf, inf);
            this.geometry.verticesNeedUpdate = true;
            this.particlePool.push(particle.vertice);
        };
    });
    require.define('/material.js', function (module, exports, __dirname, __filename) {
        var vertexShaderGlsl = require('/shaders/vertex.glsl', module);
        var fragmentShaderGlsl = require('/shaders/fragment.glsl', module);
        var texture = function (size) {
                var canvas = document.createElement('canvas');
                canvas.width = canvas.height = size;
                var texture = new THREE.Texture(canvas);
                var draw = function () {
                    var context = canvas.getContext('2d');
                    texture.needsUpdate = true;
                    context.fillStyle = 'white';
                    context.strokeStyle = 'red';
                    context.beginPath();
                    context.arc(64, 64, 60, 0, Math.PI * 2, false);
                    context.closePath();
                    context.lineWidth = 0.5;
                    context.stroke();
                    var gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
                    gradient.addColorStop(0, 'rgba( 255, 255, 255, 1)');
                    gradient.addColorStop(0.2, 'rgba( 255, 255, 255, 1)');
                    gradient.addColorStop(0.4, 'rgba( 128, 128, 128, 1)');
                    gradient.addColorStop(1, 'rgba( 0, 0, 0, 1 )');
                    context.fillStyle = gradient;
                    context.fill();
                };
                window.addEventListener('load', function () {
                    draw();
                });
                return texture;
            }(128);
        var Material = exports.Material = function (count, color) {
                var uniforms = {
                        texture: {
                            type: 't',
                            value: texture
                        },
                        color: {
                            type: 'c',
                            value: new THREE.Color(16777215)
                        },
                        amplitude: {
                            type: 'f',
                            value: 50
                        }
                    };
                var attributes = {
                        aColor: {
                            type: 'c',
                            value: []
                        },
                        aSize: {
                            type: 'f',
                            value: []
                        }
                    };
                var randomColor = function (r, g, b) {
                    var color = new THREE.Color(16777215);
                    color.r = r * Math.random();
                    color.g = g * Math.random();
                    color.b = b * Math.random();
                    return color;
                };
                for (var t = 0, T = count; t < T; ++t) {
                    attributes.aColor.value[t] = color || randomColor(0.2, 0.2, 0.3);
                    attributes.aSize.value[t] = 50;
                }
                THREE.ShaderMaterial.call(this, {
                    uniforms: uniforms,
                    attributes: attributes,
                    vertexShader: vertexShaderGlsl,
                    fragmentShader: fragmentShaderGlsl,
                    blending: THREE.AdditiveBlending,
                    depthTest: false,
                    transparent: true
                });
            };
        var F = function () {
        };
        F.prototype = THREE.ShaderMaterial.prototype;
        Material.prototype = new F();
        Material.prototype.Shader = Material;
    });
    require.define('/shaders/fragment.glsl', function (module, exports, __dirname, __filename) {
        module.exports = 'uniform vec3 color;\nuniform sampler2D texture;\n\nvarying vec4 vColor;\nvarying float vDepth;\n\nvoid main( void ) {\n\n    vec4 outColor = texture2D( texture, gl_PointCoord );\n\n    gl_FragColor = outColor * vec4( color * vColor.xyz, 1.0 );\n    gl_FragColor *= (300.0 - vDepth ) / 300.0;\n\n}\n';
    });
    require.define('/shaders/vertex.glsl', function (module, exports, __dirname, __filename) {
        module.exports = 'attribute float aSize;\nattribute vec4 aColor;\n\nvarying vec4 vColor;\nvarying float vDepth;\n\nvoid main( void ) {\n\n    vColor = aColor;\n\n    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n    vec4 csPosition = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n    vDepth = csPosition.z;\n\n    gl_PointSize = aSize * ( 100.0 / length( mvPosition.xyz ) );\n\n    gl_Position = projectionMatrix * mvPosition;\n\n}\n';
    });
    SPARKLE.THREE = require('/index.js');
}.call(this, this));