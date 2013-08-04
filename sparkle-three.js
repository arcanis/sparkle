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
                this.options = options = options || {};
                var count = this.options.count != null ? this.options.count : 100;
                var material = this.options.material ? this.options.material : new Material(count, this.options.color);
                var geometry = new THREE.Geometry();
                this.particleIndexPool = [];
                for (var t = 0, T = count; t < T; ++t) {
                    var inf = Number.POSITIVE_INFINITY;
                    var particle = new THREE.Vector3(inf, inf, inf);
                    geometry.vertices.push(particle);
                    this.particleIndexPool.push(t);
                }
                THREE.ParticleSystem.call(this, geometry, material);
                this.dynamic = true;
                var frequency = this.options.frequency != null ? this.options.frequency : this.options.lifeTime != null ? 1 / (count / this.options.lifeTime[1]) : 0.5;
                this.emitter = new SPARKLE.Emitter(frequency);
                this.emitter.initializer(new SPARKLE.LambdaInitializer(function (particle) {
                    particle.vertice = this.particleIndexPool.pop();
                }, this));
                if (this.options.position != null) {
                    this.emitter.initializer(new SPARKLE.PositionInitializer(this.options.position));
                } else {
                    this.emitter.initializer(new SPARKLE.PositionInitializer(new SPARKLE.PointZone(0, 0, 0)));
                }
                if (this.options.lifeTime != null) {
                    this.emitter.initializer(new SPARKLE.LifeTimeInitializer(this.options.lifeTime[0], this.options.lifeTime[1]));
                    if (options.fading)
                        this.emitter.action(new SPARKLE.FadingAction(typeof this.options.fading === 'function' ? this.options.fading : undefined));
                    this.emitter.action(new SPARKLE.AgeingAction());
                }
                if (this.options.velocity != null) {
                    this.emitter.initializer(new SPARKLE.VelocityInitializer(this.options.velocity));
                    if (options.acceleration != null)
                        this.emitter.action(new SPARKLE.AccelerationAction(this.options.acceleration[0], this.options.acceleration[1], this.options.acceleration[2]));
                    this.emitter.action(new SPARKLE.DisplacementAction());
                }
                if (this.options.initializers != null) {
                    this.options.initializers.forEach(function (initializer) {
                        this.emitter.initializer(initializer);
                    }, this);
                }
                if (this.options.actions != null) {
                    this.options.actions.forEach(function (action) {
                        this.emitter.action(action);
                    }, this);
                }
                this.emitter.onWakeUp = this.onWakeUp.bind(this);
                this.emitter.onUpdate = this.onUpdate.bind(this);
                this.emitter.onSleep = this.onSleep.bind(this);
                if (this.options.initial != null) {
                    this.emitter.spawn(this.options.initial[0], this.options.initial[1]);
                }
            };
        var F = function () {
        };
        F.prototype = THREE.ParticleSystem.prototype;
        Emitter.prototype = new F();
        Emitter.prototype.constructor = Emitter;
        Emitter.prototype.update = function (delta, updates) {
            this.emitter.update(delta);
            if (updates != null)
                for (var t = 0, T = updates.length; t < T; ++t)
                    this.material.attributes[updates[t]].needsUpdate = true;
            if (this.options.fading)
                this.material.attributes.aOpacity.needsUpdate = true;
            return this;
        };
        Emitter.prototype.spawn = function (count, randomly) {
            this.emitter.spawn(count, randomly);
            return this;
        };
        Emitter.prototype.onWakeUp = function (particle, delta) {
        };
        Emitter.prototype.onUpdate = function (particle, delta) {
            if (particle.vertice == null)
                return;
            this.geometry.vertices[particle.vertice].copy(particle.position);
            if (this.options.fading)
                this.material.attributes.aOpacity.value[particle.vertice] = particle.opacity;
            this.geometry.verticesNeedUpdate = true;
        };
        Emitter.prototype.onSleep = function (particle, delta) {
            if (particle.vertice == null)
                return;
            var inf = Number.POSITIVE_INFINITY;
            this.geometry.vertices[particle.vertice].set(inf, inf, inf);
            this.geometry.verticesNeedUpdate = true;
            this.particleIndexPool.push(particle.vertice);
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
                        },
                        aOpacity: {
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
                    attributes.aOpacity.value[t] = 1;
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
        module.exports = 'uniform sampler2D texture;\n\nvarying vec3  vColor;\nvarying float vDepth;\nvarying float vOpacity;\n\nvoid main( void ) {\n\n    vec4 outColor = texture2D( texture, gl_PointCoord );\n\n    gl_FragColor = outColor * vec4( vColor, 1.0 );\n    gl_FragColor *= (300.0 - vDepth ) / 300.0;\n    gl_FragColor.a *= vOpacity;\n\n}\n';
    });
    require.define('/shaders/vertex.glsl', function (module, exports, __dirname, __filename) {
        module.exports = 'attribute vec3  aColor;\nattribute float aSize;\nattribute float aOpacity;\n\nvarying vec3  vColor;\nvarying float vDepth;\nvarying float vOpacity;\n\nvoid main( void ) {\n\n    vColor = aColor;\n\n    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n    vec4 csPosition = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n    vDepth = csPosition.z;\n\n    vOpacity = aOpacity;\n\n    gl_PointSize = aSize * ( 100.0 / length( mvPosition.xyz ) );\n    gl_Position = projectionMatrix * mvPosition;\n\n}\n';
    });
    SPARKLE.THREE = require('/index.js');
}.call(this, this));