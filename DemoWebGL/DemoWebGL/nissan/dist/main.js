!function a(b, c, d) {
    function e(g, h) {
        if (!c[g]) {
            if (!b[g]) {
                var i = "function" == typeof require && require;
                if (!h && i)
                    return i(g, !0);
                if (f)
                    return f(g, !0);
                var j = new Error("Cannot find module '" + g + "'");
                throw j.code = "MODULE_NOT_FOUND", j
            }
            var k = c[g] = {
                exports: {}
            };
            b[g][0].call(k.exports, function(a) {
                var c = b[g][1][a];
                return e(c ? c : a)
            }, k, k.exports, a, b, c, d)
        }
        return c[g].exports
    }
    for (var f = "function" == typeof require && require, g = 0; g < d.length; g++)
        e(d[g]);
    return e
}({
    1: [function(a, b, c) {
        b.exports = {
            "dev.nissan.eu": "https://all.pre-prod.nissan.eu",
            "pre-prod.nissan.eu": "https://all.pre-prod.nissan.eu",
            "prod.nissan.eu": "https://all.prod.nissan.eu",
            "juke.specialversion.nissan.dlbi.xyz": "https://back-office-cq5.pre-prod.nissan.eu"
        }
    }, {}
    ],
    2: [function(a, b, c) {
        function d(a) {
            this.scene = a, this.parse = this._parse.bind(this), this.ground_show = 0;
            var b = g.addFolder("ground");
            b.add(this, "ground_show", 0, 10);
            var c = {
                show_scene: this.showScene.bind(this)
            };
            g.add(c, "show_scene"), i.setRootNode(this.scene.root);
            var d = this.scene.texs.getTexture("cut_mask");
            d.bind(), d.clamp(), i.setMaskTexture(d), this.depthCutCfg = this.scene.gl.state.config(), this.depthCutCfg.enableDepthTest(), this.depthCutCfg.depthFunc(this.scene.gl.EQUAL)
        }
        var e = a("utils/net"), f = a("lib/awd"), g = a("dev/gui"), h = a("gsap/src/uncompressed/TweenLite"), i = (a("nanogl-state/config"), a("entities/RevealModel"));
        a("when");
        d.prototype = {
            load: function(a) {
                return e.loadBytes(a).then(this.parse)
            },
            _parse: function(a) {
                this.loader = new f(a), this.loader.load(this.scene), this.meshes = this.loader.getMeshes()
            },
            showScene: function() {
                return h.fromTo(this, 1.5, {
                    ground_show: 0
                }, {
                    ground_show: 1,
                    ease: Power2.easeInOut
                }), i.startReveal()
            },
            preRender: function(a) {
                var b = this.loader;
                b.getObjectByName("front_axle").rotateZ(2.8 * a), b.getObjectByName("rear_axle").rotateZ(2.8 * a), b.getObjectByName("ground_occlu").materials[0].show.set(this.ground_show)
            },
            render: function(a, b, c) {
                var d = this.meshes, e = this.scene.gl;
                if (i.playing || i.cut < 1) {
                    e.state.push(this.depthCutCfg);
                    for (var f = 0; f < d.length; f++)
                        "ground_occlu" != d[f].name && d[f].render(a, b);
                    return void e.state.pop()
                }
                for (var f = 0; f < d.length; f++)
                    d[f].render(a, b)
            },
            renderDepthCut: function(a, b) {
                for (var c = this.meshes, d = (this.scene.gl, 0); d < c.length; d++)
                    "ground_occlu" != c[d].name ? c[d].renderDepthCut(a.camera, b, this.scene.mats.depthCutMaterial, "DEPTHCUT") : i.cut < 1 && c[d].render(a, b)
            },
            renderPlainMat: function(a, b) {
                for (var c = this.meshes, d = (this.scene.gl, 0); d < c.length; d++)
                    "ground_occlu" != c[d].name && c[d].renderDepthCut(a.camera, b, this.scene.mats.plainMaterial, "PLAINMAT")
            }
        }, b.exports = d
    }, {
        "dev/gui": 39,
        "entities/RevealModel": 42,
        "gsap/src/uncompressed/TweenLite": 123,
        "lib/awd": 81,
        "nanogl-state/config": 151,
        "utils/net": 91,
        when: 184
    }
    ],
    3: [function(a, b, c) {
        function d(a, b, c) {
            for (var d = "", e = 0; c > e; e++) {
                var f = a.getUint8(b + e);
                d += String.fromCharCode(f)
            }
            return d
        }
        function e(a) {
            this.gl = a, this.alloc = this._alloc.bind(this), this.ibuffer = new g(a), this.vbuffer = new f(a)
        }
        var f = a("nanogl/arraybuffer"), g = a("nanogl/indexbuffer"), h = a("../utils/net"), i = 16;
        e.prototype = {
            load: function(a) {
                return h.loadBytes(a).then(this.alloc)
            },
            _alloc: function(a) {
                var b = this.gl, c = new Uint32Array(a, 0, 4), d = c[0], e = c[1], f = c[2], g = c[3];
                this.submeshes = [];
                var h = (this.parseSubs(this.submeshes, g, a), f>>4);
                console.log("iLen, vLen, iSize", d, e, h);
                var j = new Uint8Array(a, i, d * h), k = new Uint8Array(a, i + d * h, 4 * e);
                this.vbuffer.data(k), this.ibuffer.data(j), 1 & f && this.vbuffer.attrib("aPosition", 3, b.FLOAT), 2 & f && this.vbuffer.attrib("aTexCoord", 2, b.FLOAT), 4 & f && this.vbuffer.attrib("aNormal", 3, b.FLOAT), 8 & f && (this.vbuffer.attrib("aTangent", 3, b.FLOAT), this.vbuffer.attrib("aBitangent", 3, b.FLOAT))
            },
            parseSubs: function(a, b, c) {
                for (var e, f, g, h, j = new DataView(c, i), k = 0, l = 0; b > l; l++)
                    e = j.getUint32(k), k += 4, f = d(j, k, e), k += e, g = j.getUint32(k), k += 4, h = j.getUint32(k), k += 4, console.log(f, g, h);
                return k + i
            },
            setup: function(a) {
                this.vbuffer.attribPointer(a), this.ibuffer.bind()
            },
            render: function() {
                this.ibuffer.drawTriangles()
            }
        }, b.exports = e
    }, {
        "../utils/net": 91,
        "nanogl/arraybuffer": 155,
        "nanogl/indexbuffer": 158
    }
    ],
    4: [function(a, b, c) {
        var d = {
            juke_sv1: a("./juke_sv1"),
            juke_sv2: a("./juke_sv2"),
            qashqai: a("./qashqai")
        };
        b.exports = {
            getBundleClass: function(a) {
                var b = d[a];
                if (void 0 === b)
                    throw new Error("unknown bundle '" + a + "'");
                return b
            }
        }
    }, {
        "./juke_sv1": 6,
        "./juke_sv2": 11,
        "./qashqai": 24
    }
    ],
    5: [function(a, b, c) {
        function d(a) {
            this.ext = a.getExtension("WEBGL_compressed_texture_s3tc") || a.getExtension("MOZ_WEBGL_compressed_texture_s3tc") || a.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");
            var b = this;
            this.parse = function(a) {
                return b._parse(a)
            }
        }
        function e(a) {
            var b = new Int32Array(a, 0, s);
            if (b[t] !== h)
                throw new Error("Invalid magic number in DDS header");
            if (!b[z] & j)
                throw new Error("Unsupported format, must contain a FourCC code");
            var c, d, e = b[A];
            switch (e) {
            case k:
                c = 8, d = "dxt1";
                break;
            case l:
                c = 16, d = "dxt3";
                break;
            case m:
                c = 16, d = "dxt5";
                break;
            case o:
                d = "rgba32f";
                break;
            case n:
                var f = new Uint32Array(a.slice(128, 148));
                d = f[0];
                var C = f[1];
                f[2], f[3], f[4];
                if (C !== q || d !== r)
                    throw new Error("Unsupported DX10 texture format " + d);
                d = "rgba32f";
                break;
            default:
                throw new Error("Unsupported FourCC code: " + g(e))
            }
            var D = b[v], E = 1;
            D & i && (E = Math.max(1, b[y]));
            var F=!1, G = b[B];
            G & p && (F=!0);
            var H, I = b[x], J = b[w], K = b[u] + 4, L = I, M = J, N = [];
            if (e === n && (K += 20), F)
                for (var O = 0; 6 > O; O++) {
                    var P = [];
                    N[O] = P;
                    I = L, J = M;
                    for (var Q = 0; E > Q; Q++)
                        H = Math.max(4, I) / 4 * Math.max(4, J) / 4 * c, P.push(new Uint8Array(a, K, H)), K += H, I = Math.floor(I / 2), J = Math.floor(J / 2)
                } else {
                var P = [];
                N[0] = P;
                for (var Q = 0; E > Q; Q++)
                    H = Math.max(4, I) / 4 * Math.max(4, J) / 4 * c, P.push(new Uint8Array(a, K, H)), K += H, I = Math.max(1, Math.floor(I / 2)), J = Math.max(1, Math.floor(J / 2))
                }
            return {
                width: L,
                height: M,
                surfaces: N,
                format: this._getFormat(d),
                flags: D,
                cubemap: F
            }
        }
        function f(a) {
            return a.charCodeAt(0) + (a.charCodeAt(1)<<8) + (a.charCodeAt(2)<<16) + (a.charCodeAt(3)<<24)
        }
        function g(a) {
            return String.fromCharCode(255 & a, a>>8 & 255, a>>16 & 255, a>>24 & 255)
        }
        var h = 542327876, i = 131072, j = 4, k = f("DXT1"), l = f("DXT3"), m = f("DXT5"), n = f("DX10"), o = 116, p = 512, q = 3, r = 2, s = 31, t = 0, u = 1, v = 2, w = 3, x = 4, y = 7, z = 20, A = 21, B = 28;
        d.prototype = {
            isSupported: function() {
                return !!this.ext
            },
            _getFormat: function(a) {
                switch (a) {
                case"dxt1":
                    return this.ext.COMPRESSED_RGB_S3TC_DXT1_EXT;
                case"dxt3":
                    return this.ext.COMPRESSED_RGBA_S3TC_DXT3_EXT;
                case"dxt5":
                    return this.ext.COMPRESSED_RGBA_S3TC_DXT5_EXT;
                default:
                    throw new Error("unsupported format " + a)
                }
            },
            _parse: e
        }, b.exports = d
    }, {}
    ],
    6: [function(a, b, c) {
        function d() {
            this.materials = null, this.textures = null, this.pickingCar = g(), this.pickingDoor = h()
        }
        var e = a("./materials"), f = a("./textures"), g = a("./picking"), h = a("./picking_door"), i = a("utils/color"), j = a("gl-matrix").vec3, k = a("config");
        d.prototype = {
            init: function(a) {
                this.textures = new f(a), this.materials = new e(a)
            },
            nextConfig: function() {
                this.materials.nextConfig()
            },
            getInitialOrbitConfig: function() {
                return [ - 3.763721227645874, - .05000000074505806, 1.558, .2369].concat(this.getInteriorPosition())
            },
            getUiConfig: function() {
                return [.7, 7.5, 0, 23, 30, 13.5]
            },
            getEnvId: function() {
                return "uffizi"
            },
            getLoadingColors: function() {
                return [[i.HexToVec(16711680, j.create()), i.HexToVec(11796492, j.create())], [i.HexToVec(16711680, j.create()), i.HexToVec(5373952, j.create())], [i.HexToVec(16711680, j.create()), i.HexToVec(14619932, j.create())], [i.HexToVec(16711680, j.create()), i.HexToVec(6685451, j.create())]]
            },
            getInteriorPosition: function() {
                return [2.809, 12.494, 1.925]
            },
            getSceneUrl: function() {
                return k.asset_url("juke_sv1/scene.awd")
            },
            preRender: function(a) {
                this.materials.preRender(a)
            },
            getLoadables: function() {
                return this.materials.getLoadables()
            }
        }, b.exports = d
    }, {
        "./materials": 7,
        "./picking": 8,
        "./picking_door": 9,
        "./textures": 10,
        config: 37,
        "gl-matrix": 113,
        "utils/color": 89
    }
    ],
    7: [function(a, b, c) {
        function d(a) {
            var b = a.mats, c = a.gl;
            this.scene = a, this.matlib = b, this.gl = b.gl, this.materials = {}, this.matlist = [];
            var d, m = this.texs = a.texs;
            d = new e(c), d.setIBL(a.env.ibl), d.setLightSetup(a.lights.setup), d.albedo = d.iAlbedo.attachUniform("uAlbedo"), d.specular = d.iSpecular.attachUniform("uSpecular"), d.gloss = d.iGloss.attachUniform("uGloss"), d.fresnel = d.iFresnel.attachUniform("uFresnel"), d.clearcoat = d.iClearcoat.attachUniform("uClearcoat"), d.cavity = d.iCavity.attachSampler("tCavity", "vTexCoord"), d.cavityStr = d.iCavityStrength.attachConstant([1, 1]), h.HexInput(d.albedo, 6029322), h.HexInput(d.specular, 4849664), h.HexInput(d.fresnel, 16711680), d.clearcoat.set(.46, .011), d.gloss.set(.64), d.cavity.set(m.getTexture("car_OCCLU")), b.setOpaque(d), b.registerMaterial(d, "Car");
            var n = {
                albedo: h.MakeFromHex(6029322),
                specular: h.MakeFromHex(4849664),
                fresnel: h.MakeFromHex(16711680),
                clearcoat: [.9, .011],
                gloss: .64
            }, o = {
                albedo: h.MakeFromHex(131586),
                specular: h.MakeFromHex(460295),
                fresnel: h.MakeFromHex(592137),
                clearcoat: [.6, .011],
                gloss: .76
            };
            ({
                albedo: h.MakeFromHex(10657170),
                specular: h.MakeFromHex(1973790),
                fresnel: h.MakeFromHex(16777215),
                clearcoat: [.9, .011],
                gloss: 1
            });
            this.currentCfg = 0, this.carConfigs = [n, o], this.carTransition = new j(d, n), d = new e(c), d.setIBL(a.env.ibl), d.setLightSetup(a.lights.setup), d.albedo = d.iAlbedo.attachUniform("uAlbedo"), d.specular = d.iSpecular.attachUniform("uSpecular"), d.gloss = d.iGloss.attachUniform("uGloss"), d.fresnel = d.iFresnel.attachUniform("uFresnel"), d.clearcoat = d.iClearcoat.attachUniform("uClearcoat"), d.cavity = d.iCavity.attachSampler("tCavity", "vTexCoord"), d.cavityStr = d.iCavityStrength.attachConstant([1, 1]), h.HexInput(d.albedo, 6029322), h.HexInput(d.specular, 4849664), h.HexInput(d.fresnel, 16711680), d.clearcoat.set(.46, .011), d.gloss.set(.64), d.cavity.set(m.getTexture("access_OCCLU")), b.setOpaque(d), b.registerMaterial(d, "CarSecondary"), d = new f(c), d.iColor.attachConstant([0, 0, 0, 1]), b.setOpaque(d), b.registerMaterial(d, "BlackMatte"), d = b.createBaseMaterial(c), d.albedo = d.iAlbedo.attachUniform("uAlbedo"), d.specular = d.iSpecular.attachUniform("uSpecular"), d.gloss = d.iGloss.attachUniform("uGloss"), d.albedo.set(0, 0, 0), h.HexInput(d.specular, 11974326), d.gloss.set(1), d.pureGloss.enable(), b.setOpaque(d), b.registerMaterial(d, "Chromes"), d = b.createBaseMaterial(c), d.albedo = d.iAlbedo.attachUniform("uAlbedo"), d.specular = d.iSpecular.attachUniform("uSpecular"), d.gloss = d.iGloss.attachUniform("uGloss"), d.albedo.set(.05, .05, .05), d.specular.set(.15, .15, .15), d.gloss.set(.4), b.setOpaque(d), b.registerMaterial(d, "misc_plastics"), d = b.createBaseMaterial(c), d.albedo = d.iAlbedo.attachUniform("uAlbedo"), d.specular = d.iSpecular.attachUniform("uSpecular"), d.gloss = d.iGloss.attachUniform("uGloss"), d.albedo.set(.05, .05, .05), d.specular.set(.08, .08, .08), d.gloss.set(.55), b.setOpaque(d), b.registerMaterial(d, "pot"), d = b.createBaseMaterial(c), d.albedo = d.iAlbedo.attachUniform("uAlbedo"), d.specular = d.iSpecular.attachUniform("uSpecular"), d.gloss = d.iGloss.attachUniform("uGloss"), d.cavity = d.iCavity.attachSampler("tCavity", "vTexCoord"), d.cavityStr = d.iCavityStrength.attachConstant([1, 1]), h.HexInput(d.albedo, 789516), h.HexInput(d.specular, 1973533), d.gloss.set(.22), d.cavity.set(m.getTexture("car_OCCLU")), b.setOpaque(d), b.registerMaterial(d, "CarPlastics"), d = b.createBaseMaterial(c), d.albedo = d.iAlbedo.attachUniform("uAlbedo"), d.specular = d.iSpecular.attachUniform("uSpecular"), d.gloss = d.iGloss.attachUniform("uGloss"), d.albedo.set(0, 0, 0), d.specular.set(.1, .1, .1), d.gloss.set(1), d.pureGloss.enable(), b.setGlass(d, .5, .5, .5), b.registerMaterial(d, "Glass"), d = b.createBaseMaterial(c), d.albedo = d.iAlbedo.attachUniform("uAlbedo"), d.specular = d.iSpecular.attachUniform("uSpecular"), d.gloss = d.iGloss.attachUniform("uGloss"), d.albedo.set(0, 0, 0), d.specular.set(.1, .1, .1), d.gloss.set(1), d.pureGloss.enable(), b.setGlass(d, .2, .2, .2), b.registerMaterial(d, "Glass Tinted"), d = b.createBaseMaterial(c), d.albedo = d.iAlbedo.attachUniform("uAlbedo"), d.specular = d.iSpecular.attachUniform("uSpecular"), d.gloss = d.iGloss.attachUniform("uGloss"), d.albedo.set(0, 0, 0), d.specular.set(.1, .1, .1), d.gloss.set(1), d.pureGloss.enable(), b.setOpaque(d), b.registerMaterial(d, "Glass Dark"), d = b.createBaseMaterial(c), d.albedo = d.iAlbedo.attachUniform("uAlbedo"), d.specular = d.iSpecular.attachUniform("uSpecular"), d.gloss = d.iGloss.attachUniform("uGloss"), d.normals = d.iNormal.attachSampler("tNormal", "vTexCoord"), d.albedo.set(0, 0, 0), d.specular.set(.1, .1, .1), d.gloss.set(1), d.normals.set(m.getTexture("details_NRM")), b.setGlass(d, .9, .9, .9), b.registerMaterial(d, "LightGlass"), d = b.createBaseMaterial(c), d.albedo = d.iAlbedo.attachUniform("uAlbedo"), d.specular = d.iSpecular.attachUniform("uSpecular"), d.gloss = d.iGloss.attachUniform("uGloss"), d.normals = d.iNormal.attachSampler("tNormal", "vTexCoord"), d.albedo.set(0, 0, 0), d.specular.set(.1, .1, .1), d.gloss.set(1), d.normals.set(m.getTexture("details_NRM")), b.setGlass(d, .7, 0, 0), b.registerMaterial(d, "LightGlassRed"), d = b.createBaseMaterial(c), d.albedo = d.iAlbedo.attachUniform("uAlbedo"), d.specular = d.iSpecular.attachUniform("uSpecular"), d.gloss = d.iGloss.attachUniform("uGloss"), d.albedo.set(0, 0, 0), d.specular.set(.98, .98, .98), d.gloss.set(1), b.setOpaque(d), b.registerMaterial(d, "Lights"), d = b.createBaseMaterial(c), d.albedo = d.iAlbedo.attachUniform("uAlbedo"), d.specular = d.iSpecular.attachUniform("uSpecular"), d.gloss = d.iGloss.attachUniform("uGloss"), d.albedo.set(0, 0, 0), d.specular.set(.05, .05, .05), d.gloss.set(1), b.setOpaque(d), b.registerMaterial(d, "light_black"), d = b.createBaseMaterial(c);
            var p = new l.Sampler("tGlossAo", "vTexCoord");
            d.albedo = d.iAlbedo.attachSampler("tAlbedo", "vTexCoord"), d.normals = d.iNormal.attachSampler("tNormal", "vTexCoord"), d.specular = d.iSpecular.attachSampler("tSpecular", "vTexCoord"), d.gloss = d.iGloss.attach(p, "r"), d.cavity = d.iCavity.attach(p, "g"), d.cavityStr = d.iCavityStrength.attachConstant([1, 1]), d.albedo.set(m.getTexture("wheelgroup_albedo")), p.set(m.getTexture("wheelgroup_gloss_ao")), d.normals.set(m.getTexture("wheelgroup_normal")), d.specular.set(m.getTexture("wheelgroup_specular")), b.setOpaque(d), b.registerMaterial(d, "wheelgroup"), d = b.createBaseMaterial(c), d.albedo = d.iAlbedo.attachUniform("uAlbedo"), d.specular = d.iSpecular.attachUniform("uSpecular"), d.gloss = d.iGloss.attachUniform("uGloss"), d.albedo.set(.01, .01, .01), d.specular.set(.04, .04, .04), d.gloss.set(0), b.setOpaque(d), b.registerMaterial(d, "drum_brakes"), d = b.createBaseMaterial(c), d.albedo = d.iAlbedo.attachUniform("uAlbedo"), d.specular = d.iSpecular.attachUniform("uSpecular"), d.gloss = d.iGloss.attachUniform("uGloss"), d.normals = d.iNormal.attachSampler("tNormal", "vTexCoord"), d.cavity = d.iCavity.attachSampler("tCavity", "vTexCoord"), d.cavityStr = d.iCavityStrength.attachConstant([1, 1]), h.HexInput(d.albedo, 0), h.HexInput(d.specular, 2763306), d.gloss.set(.83), d.cavity.set(m.getTexture("alloy_OCCLU")), d.normals.set(m.getTexture("alloy_NRM")), b.setOpaque(d), b.registerMaterial(d, "alloy"), d = new e(c), d.setIBL(a.env.ibl), d.setLightSetup(a.lights.setup), d.albedo = d.iAlbedo.attachUniform("uAlbedo"), d.specular = d.iSpecular.attachUniform("uSpecular"), d.gloss = d.iGloss.attachUniform("uGloss"), d.fresnel = d.iFresnel.attachUniform("uFresnel"), d.clearcoat = d.iClearcoat.attachUniform("uClearcoat"), d.normals = d.iNormal.attachSampler("tNormal", "vTexCoord"), d.cavity = d.iCavity.attachSampler("tCavity", "vTexCoord"), d.cavityStr = d.iCavityStrength.attachConstant([1, 1]), h.HexInput(d.albedo, 4390915), h.HexInput(d.specular, 6553605), h.HexInput(d.fresnel, 16711680), d.clearcoat.set(.17, .09), d.gloss.set(.56), d.cavity.set(m.getTexture("alloy_OCCLU")), d.normals.set(m.getTexture("alloy_NRM")), b.setOpaque(d), b.registerMaterial(d, "alloy_insert"), d = b.createBaseMaterial(c), d.albedo = d.iAlbedo.attachUniform("uAlbedo"), d.gloss = d.iGloss.attachUniform("uGloss"), d.specular = d.iSpecular.attachUniform("uSpecular"), d.normals = d.iNormal.attachSampler("tNormal", "vTexCoord"), d.cavity = d.iCavity.attachSampler("tCavity", "vTexCoord"), d.cavityStr = d.iCavityStrength.attachConstant([1, 1]), d.cavity.set(m.getTexture("grill_COLOR")), d.normals.set(m.getTexture("grill_NRM")), d.specular.set(.15, .15, .15), b.setOpaque(d), b.registerMaterial(d, "Grill"), d = b.createBaseMaterial(c), d.albedo = d.iAlbedo.attachSampler("tAlbedo", "vTexCoord"), d.gloss = d.iGloss.attachConstant(0), d.specular = d.iSpecular.attachConstant([0, 0, 0]), d.albedo.set(m.getTexture("inside_COLOR")), b.setOpaque(d), b.registerMaterial(d, "Interior"), d = b.createBaseMaterial(c), d.albedo = d.iAlbedo.attachSampler("tAlbedo", "vTexCoord"), d.gloss = d.iGloss.attachUniform("uGloss"), d.specular = d.iSpecular.attachUniform("uSpecular"), d.albedo.set(m.getTexture("grill_COLOR")), d.specular.set(.15, .15, .15), b.setOpaque(d), b.registerMaterial(d, "Plaques"), d = new g(c), d.uTime = d.iTime.attachUniform("iTime"), d.show = d.iShow.attachUniform("iShow"), d.cavity = d.iCavity.attachSampler("tCavity", "vCavityTexCoord", "g"), d.cavity.set(m.getTexture("ground_OCCLU")), d.diffuse = d.iDiffuse.attachSampler("tDiffuse", "vDiffuseTexCoord", "g"), d.diffuse.set(m.getTexture("ground_DIFFUSE")), d.normal = d.iNormal.attachSampler("tNormal", "vDiffuseTexCoord"), d.normal.set(m.getTexture("ground_NRM")), b.setOpaque(d), d._mask = i.BLENDED, d.setIBL(a.env.ibl), this.groundOcclu = d, b.registerMaterial(d, "ground_occlu");
            var q = new k(c);
            q.compile(), this.depthPass = q
        }
        var e = (a("gl/Standard"), a("gl/ClearCoat")), f = a("gl/BasicMaterial"), g = a("gl/GroundMaterial"), h = a("utils/color"), i = a("assets/materials-lib"), j = a("assets/mat-transition"), k = a("nanogl-pbr/depthpass"), l = a("nanogl-pbr/lib/input");
        d.prototype = {
            nextConfig: function() {
                this.currentCfg++, this.currentCfg > this.carConfigs.length - 1 && (this.currentCfg = 0);
                var a = this.carConfigs[this.currentCfg];
                this.carTransition.to(a)
            },
            getLoadables: function() {
                return []
            },
            preRender: function(a) {
                this.groundOcclu.time += .5 * a, this.groundOcclu.uTime.set(this.groundOcclu.time%100), this.carTransition.step(a)
            }
        }, b.exports = d
    }, {
        "assets/mat-transition": 17,
        "assets/materials-lib": 18,
        "gl/BasicMaterial": 66,
        "gl/ClearCoat": 67,
        "gl/GroundMaterial": 69,
        "gl/Standard": 71,
        "nanogl-pbr/depthpass": 129,
        "nanogl-pbr/lib/input": 141,
        "utils/color": 89
    }
    ],
    8: [function(a, b, c) {
        var d = a("assets/picking"), e = new Float64Array([ - 9.54, 11.32, 8.14, - 9.54, 11.32, 0, - 18.83, 9.95, 0, - 16.05, 9.95, 8.71, - 1.41, 15.54, 5.55, 13.87, 14.86, 5.55, 13.87, 14.86, 0, - 1.41, 15.54, 0, - 14.64, 0, 8.82, 15.76, 0, 8.82, 19.49, 3.61, 8.22, - 18.19, 5.63, 8.82, 18.42, 10.54, 7.29, 15.76, 0, 0, 20.8, 3.61, 0, 19.73, 10.54, 0, - 17.42, 0, 0, - 20.97, 5.63, 0, - 28.32, 0, 50.19, 25.3, 0, 50.19, 55.22, 0, 0, - 54.39, 0, 0, - 9.54, 11.32, - 8.14, - 16.05, 9.95, - 8.71, - 1.41, 15.54, - 5.55, 13.87, 14.86, - 5.55, - 14.64, 0, - 8.82, - 18.19, 5.63, - 8.82, 19.49, 3.61, - 8.22, 15.76, 0, - 8.82, 18.42, 10.54, - 7.29, - 28.32, 0, - 50.19, 25.3, 0, - 50.19]), f = new Uint8Array([0, 1, 2, 2, 3, 0, 4, 5, 6, 6, 7, 4, 8, 9, 10, 10, 11, 8, 10, 12, 0, 0, 3, 11, 10, 0, 11, 12, 5, 4, 4, 0, 12, 9, 13, 14, 14, 10, 9, 12, 15, 6, 6, 5, 12, 16, 8, 11, 11, 17, 16, 17, 11, 3, 3, 2, 17, 4, 7, 1, 1, 0, 4, 15, 12, 10, 10, 14, 15, 18, 19, 20, 20, 21, 18, 22, 23, 2, 2, 1, 22, 24, 7, 6, 6, 25, 24, 26, 27, 28, 28, 29, 26, 27, 23, 22, 28, 27, 22, 28, 22, 30, 30, 22, 24, 24, 25, 30, 29, 28, 14, 14, 13, 29, 30, 25, 6, 6, 15, 30, 16, 17, 27, 27, 26, 16, 17, 2, 23, 23, 27, 17, 24, 22, 1, 1, 7, 24, 15, 14, 28, 28, 30, 15, 31, 21, 20, 20, 32, 31]);
        b.exports = function() {
            return new d({
                verts: e,
                faces: f
            })
        }
    }, {
        "assets/picking": 21
    }
    ],
    9: [function(a, b, c) {
        var d = a("assets/picking"), e = new Float64Array([ - 7.12, 10.18, 8.03, 2.99, 9.57, 8.7, 3.91, 14.23, 6.23, - 1.14, 14.42, 6.23, - 6.88, 3.41, 8.46, 2.99, 3.41, 8.46]), f = new Uint8Array([0, 1, 2, 2, 3, 0, 4, 5, 1, 1, 0, 4]);
        b.exports = function() {
            return new d({
                verts: e,
                faces: f
            })
        }
    }, {
        "assets/picking": 21
    }
    ],
    10: [function(a, b, c) {
        function d(a) {
            var b = a.texs;
            this.lib = b, this.gl = a.gl;
            var c = 0, d = b.qDir;
            this.texDefs = [b.makeTex("car_OCCLU", !0, !1, c, b.bbc, d + "/juke_sv1/car_OCCLU.jpg"), b.makeTex("inside_COLOR", !0, !1, c, b.bbc, d + "/juke_sv1/inside_COLOR.jpg"), b.makeTex("ground_OCCLU", !0, !1, c, b.bbc, d + "/juke_sv1/ground_OCCLU.jpg"), b.makeTex("ground_DIFFUSE", !0, !0, 4, b.bbc, d + "/juke_sv1/ground_DIFFUSE.jpg"), b.makeTex("ground_NRM", !0, !0, 4, b.bbc, d + "/juke_sv1/ground_NRM.jpg"), b.makeTex("grill_COLOR", !0, !1, c, b.bbc, d + "/juke_sv1/grill_COLOR.jpg"), b.makeTex("grill_NRM", !0, !1, c, b.bbc, d + "/juke_sv1/grill_NRM.jpg"), b.makeTex("details_NRM", !0, !1, c, b.bbc, d + "/juke_sv1/details_NRM.jpg"), b.makeTex("access_OCCLU", !0, !1, c, b.bbc, d + "/juke_sv1/access_OCCLU.jpg"), b.makeTex("wheelgroup_albedo", !0, !1, c, b.bbc, d + "/juke_sv1/wheelgroup_albedo.jpg"), b.makeTex("wheelgroup_gloss_ao", !0, !1, c, b.bbc, d + "/juke_sv1/wheelgroup_gloss_ao.jpg"), b.makeTex("wheelgroup_normal", !0, !1, c, b.bbc, d + "/juke_sv1/wheelgroup_normal.jpg"), b.makeTex("wheelgroup_specular", !0, !1, c, b.bbc, d + "/juke_sv1/wheelgroup_specular.jpg"), b.makeTex("alloy_OCCLU", !0, !1, c, b.bbc, d + "/juke_sv1/alloy_OCCLU.jpg"), b.makeTex("alloy_NRM", !0, !1, c, b.bbc, d + "/juke_sv1/alloy_NRM.jpg"), b.makeCube("interior_red", !0, !1, 2048, b.bbc, "juke_sv1/interior_red")]
        }
        b.exports = d
    }, {}
    ],
    11: [function(a, b, c) {
        function d() {
            this.materials = null, this.textures = null, this.pickingCar = g(), this.pickingDoor = h()
        }
        var e = a("./materials"), f = a("./textures"), g = a("./picking"), h = a("./picking_door"), i = a("utils/color"), j = a("gl-matrix").vec3, k = a("config");
        d.prototype = {
            init: function(a) {
                this.textures = new f(a), this.materials = new e(a)
            },
            nextConfig: function() {
                this.materials.nextConfig()
            },
            getInitialOrbitConfig: function() {
                return [ - 3.763721227645874, - .05000000074505806, 1.558, .2369].concat(this.getInteriorPosition())
            },
            getUiConfig: function() {
                return [.7, 7.5, 0, 23, 30, 13.5]
            },
            getEnvId: function() {
                return "parking_ext"
            },
            getLoadingColors: function() {
                return [[i.HexToVec(8559275, j.create()), i.HexToVec(91048, j.create())], [i.HexToVec(8559275, j.create()), i.HexToVec(144472, j.create())], [i.HexToVec(8559275, j.create()), i.HexToVec(1929128, j.create())], [i.HexToVec(8559275, j.create()), i.HexToVec(474209, j.create())]]
            },
            getInteriorPosition: function() {
                return [2.809, 12.494, 1.925]
            },
            getSceneUrl: function() {
                return k.asset_url("juke_sv2/scene.awd")
            },
            preRender: function(a) {
                this.materials.preRender(a)
            },
            getLoadables: function() {
                return this.materials.getLoadables()
            }
        }, b.exports = d
    }, {
        "./materials": 12,
        "./picking": 13,
        "./picking_door": 14,
        "./textures": 15,
        config: 37,
        "gl-matrix": 113,
        "utils/color": 89
    }
    ],
    12: [function(a, b, c) {
        function d(a) {
            var b = a.mats, c = a.gl;
            this.scene = a, this.matlib = b, this.gl = b.gl, this.materials = {}, this.matlist = [];
            var d, m = this.texs = a.texs;
            d = new e(c), d.setIBL(a.env.ibl), d.setLightSetup(a.lights.setup), d.albedo = d.iAlbedo.attachUniform("uAlbedo"), d.specular = d.iSpecular.attachUniform("uSpecular"), d.gloss = d.iGloss.attachUniform("uGloss"), d.fresnel = d.iFresnel.attachUniform("uFresnel"), d.clearcoat = d.iClearcoat.attachUniform("uClearcoat"), d.cavity = d.iCavity.attachSampler("tCavity", "vTexCoord"), d.cavityStr = d.iCavityStrength.attachConstant([1, 1]), h.HexInput(d.albedo, 10657170), h.HexInput(d.specular, 1973790), h.HexInput(d.fresnel, 16777215), d.clearcoat.set(.9, .011), d.gloss.set(1), d.cavity.set(m.getTexture("car_OCCLU")), b.setOpaque(d), b.registerMaterial(d, "Car");
            var n = ({
                albedo: h.MakeFromHex(6029322),
                specular: h.MakeFromHex(4849664),
                fresnel: h.MakeFromHex(16711680),
                clearcoat: [.9, .011],
                gloss: .64
            }, {
                albedo: h.MakeFromHex(131586),
                specular: h.MakeFromHex(460295),
                fresnel: h.MakeFromHex(592137),
                clearcoat: [.75, .011],
                gloss: .76
            }), o = {
                albedo: h.MakeFromHex(15459542),
                specular: h.MakeFromHex(1973790),
                fresnel: h.MakeFromHex(16777215),
                clearcoat: [.3, .011],
                gloss: 1
            };
            this.currentCfg = 0, this.carConfigs = [o, n], this.accConfigs = [n, o], this.carTransition = new j(d, o), d = new e(c), d.setIBL(a.env.ibl), d.setLightSetup(a.lights.setup), d.albedo = d.iAlbedo.attachUniform("uAlbedo"), d.specular = d.iSpecular.attachUniform("uSpecular"), d.gloss = d.iGloss.attachUniform("uGloss"), d.fresnel = d.iFresnel.attachUniform("uFresnel"), d.clearcoat = d.iClearcoat.attachUniform("uClearcoat"), d.cavity = d.iCavity.attachSampler("tCavity", "vTexCoord"), d.cavityStr = d.iCavityStrength.attachConstant([1, 1]), h.HexInput(d.albedo, 6029322), h.HexInput(d.specular, 4849664), h.HexInput(d.fresnel, 16711680), d.clearcoat.set(.46, .011), d.gloss.set(.64), d.cavity.set(m.getTexture("access_OCCLU")), b.setOpaque(d), b.registerMaterial(d, "CarSecondary"), this.accTransition = new j(d, o), d = new f(c), d.iColor.attachConstant([0, 0, 0, 1]), b.setOpaque(d), b.registerMaterial(d, "BlackMatte"), d = b.createBaseMaterial(c), d.albedo = d.iAlbedo.attachUniform("uAlbedo"), d.specular = d.iSpecular.attachUniform("uSpecular"), d.gloss = d.iGloss.attachUniform("uGloss"), d.albedo.set(0, 0, 0), h.HexInput(d.specular, 11974326), d.gloss.set(1), d.pureGloss.enable(), b.setOpaque(d), b.registerMaterial(d, "Chromes"), d = b.createBaseMaterial(c), d.albedo = d.iAlbedo.attachUniform("uAlbedo"), d.specular = d.iSpecular.attachUniform("uSpecular"), d.gloss = d.iGloss.attachUniform("uGloss"), d.albedo.set(.05, .05, .05), d.specular.set(.15, .15, .15), d.gloss.set(.4), b.setOpaque(d), b.registerMaterial(d, "misc_plastics"), d = b.createBaseMaterial(c), d.albedo = d.iAlbedo.attachUniform("uAlbedo"), d.specular = d.iSpecular.attachUniform("uSpecular"), d.gloss = d.iGloss.attachUniform("uGloss"), d.albedo.set(.1, .1, .1), d.specular.set(.1, .1, .1), d.gloss.set(.5), b.setOpaque(d), b.registerMaterial(d, "retro_interior"), d = b.createBaseMaterial(c), d.albedo = d.iAlbedo.attachUniform("uAlbedo"), d.specular = d.iSpecular.attachUniform("uSpecular"), d.gloss = d.iGloss.attachUniform("uGloss"), d.albedo.set(.05, .05, .05), d.specular.set(.08, .08, .08), d.gloss.set(.55), b.setOpaque(d), b.registerMaterial(d, "pot"), d = b.createBaseMaterial(c), d.albedo = d.iAlbedo.attachUniform("uAlbedo"), d.specular = d.iSpecular.attachUniform("uSpecular"), d.gloss = d.iGloss.attachUniform("uGloss"), d.cavity = d.iCavity.attachSampler("tCavity", "vTexCoord"), d.cavityStr = d.iCavityStrength.attachConstant([1, 1]), h.HexInput(d.albedo, 789516), h.HexInput(d.specular, 1973533), d.gloss.set(.22), d.cavity.set(m.getTexture("car_OCCLU")), b.setOpaque(d), b.registerMaterial(d, "CarPlastics"), d = b.createBaseMaterial(c), d.albedo = d.iAlbedo.attachUniform("uAlbedo"), d.specular = d.iSpecular.attachUniform("uSpecular"), d.gloss = d.iGloss.attachUniform("uGloss"), d.albedo.set(0, 0, 0), d.specular.set(.1, .1, .1), d.gloss.set(1), d.pureGloss.enable(), b.setGlass(d, .5, .5, .5), b.registerMaterial(d, "Glass"), d = b.createBaseMaterial(c), d.albedo = d.iAlbedo.attachUniform("uAlbedo"), d.specular = d.iSpecular.attachUniform("uSpecular"), d.gloss = d.iGloss.attachUniform("uGloss"), d.albedo.set(0, 0, 0), d.specular.set(.1, .1, .1), d.gloss.set(1), d.pureGloss.enable(), b.setGlass(d, .2, .2, .2), b.registerMaterial(d, "Glass Tinted"), d = b.createBaseMaterial(c), d.albedo = d.iAlbedo.attachUniform("uAlbedo"), d.specular = d.iSpecular.attachUniform("uSpecular"), d.gloss = d.iGloss.attachUniform("uGloss"), d.albedo.set(0, 0, 0), d.specular.set(.1, .1, .1), d.gloss.set(1), d.pureGloss.enable(), b.setOpaque(d), b.registerMaterial(d, "Glass Dark"), d = b.createBaseMaterial(c), d.albedo = d.iAlbedo.attachUniform("uAlbedo"), d.specular = d.iSpecular.attachUniform("uSpecular"), d.gloss = d.iGloss.attachUniform("uGloss"), d.normals = d.iNormal.attachSampler("tNormal", "vTexCoord"), d.albedo.set(0, 0, 0), d.specular.set(.1, .1, .1), d.gloss.set(1), d.normals.set(m.getTexture("details_NRM")), b.setGlass(d, .9, .9, .9), b.registerMaterial(d, "LightGlass"), d = b.createBaseMaterial(c), d.albedo = d.iAlbedo.attachUniform("uAlbedo"), d.specular = d.iSpecular.attachUniform("uSpecular"), d.gloss = d.iGloss.attachUniform("uGloss"), d.normals = d.iNormal.attachSampler("tNormal", "vTexCoord"), d.albedo.set(0, 0, 0), d.specular.set(.1, .1, .1), d.gloss.set(1), d.normals.set(m.getTexture("details_NRM")), b.setGlass(d, .7, 0, 0), b.registerMaterial(d, "LightGlassRed"), d = b.createBaseMaterial(c), d.albedo = d.iAlbedo.attachUniform("uAlbedo"), d.specular = d.iSpecular.attachUniform("uSpecular"), d.gloss = d.iGloss.attachUniform("uGloss"), d.albedo.set(0, 0, 0), d.specular.set(.71, .71, .71), d.gloss.set(1), b.setOpaque(d), b.registerMaterial(d, "Lights"), d = b.createBaseMaterial(c), d.albedo = d.iAlbedo.attachUniform("uAlbedo"), d.specular = d.iSpecular.attachUniform("uSpecular"), d.gloss = d.iGloss.attachUniform("uGloss"), d.albedo.set(0, 0, 0), d.specular.set(.05, .05, .05), d.gloss.set(1), b.setOpaque(d), b.registerMaterial(d, "light_black"), d = b.createBaseMaterial(c);
            var p = new l.Sampler("tGlossAo", "vTexCoord");
            d.albedo = d.iAlbedo.attachSampler("tAlbedo", "vTexCoord"), d.normals = d.iNormal.attachSampler("tNormal", "vTexCoord"), d.specular = d.iSpecular.attachSampler("tSpecular", "vTexCoord"), d.gloss = d.iGloss.attach(p, "r"), d.cavity = d.iCavity.attach(p, "g"), d.cavityStr = d.iCavityStrength.attachConstant([1, 1]), d.albedo.set(m.getTexture("wheelgroup_albedo")), p.set(m.getTexture("wheelgroup_gloss_ao")), d.normals.set(m.getTexture("wheelgroup_normal")), d.specular.set(m.getTexture("wheelgroup_specular")), b.setOpaque(d), b.registerMaterial(d, "wheelgroup"), d = b.createBaseMaterial(c), d.albedo = d.iAlbedo.attachUniform("uAlbedo"), d.specular = d.iSpecular.attachUniform("uSpecular"), d.gloss = d.iGloss.attachUniform("uGloss"), d.albedo.set(.01, .01, .01), d.specular.set(.04, .04, .04), d.gloss.set(0), b.setOpaque(d), b.registerMaterial(d, "drum_brakes"), d = b.createBaseMaterial(c), d.albedo = d.iAlbedo.attachUniform("uAlbedo"), d.specular = d.iSpecular.attachUniform("uSpecular"), d.gloss = d.iGloss.attachUniform("uGloss"), d.normals = d.iNormal.attachSampler("tNormal", "vTexCoord"), d.cavity = d.iCavity.attachSampler("tCavity", "vTexCoord"), d.cavityStr = d.iCavityStrength.attachConstant([1, 1]), h.HexInput(d.albedo, 0), h.HexInput(d.specular, 2763306), d.gloss.set(.83), d.cavity.set(m.getTexture("alloy_OCCLU")), d.normals.set(m.getTexture("alloy_NRM")), b.setOpaque(d), b.registerMaterial(d, "alloy"), d = new e(c), d.setIBL(a.env.ibl), d.setLightSetup(a.lights.setup), d.albedo = d.iAlbedo.attachUniform("uAlbedo"), d.specular = d.iSpecular.attachUniform("uSpecular"), d.gloss = d.iGloss.attachUniform("uGloss"), d.fresnel = d.iFresnel.attachUniform("uFresnel"), d.clearcoat = d.iClearcoat.attachUniform("uClearcoat"), d.normals = d.iNormal.attachSampler("tNormal", "vTexCoord"), d.cavity = d.iCavity.attachSampler("tCavity", "vTexCoord"), d.cavityStr = d.iCavityStrength.attachConstant([1, 1]), h.HexInput(d.albedo, 4390915), h.HexInput(d.specular, 6553605), h.HexInput(d.fresnel, 16711680), d.clearcoat.set(.17, .09), d.gloss.set(.56), d.cavity.set(m.getTexture("alloy_OCCLU")), d.normals.set(m.getTexture("alloy_NRM")), b.setOpaque(d), b.registerMaterial(d, "alloy_insert"), this.alyTransition = new j(d, o), d = b.createBaseMaterial(c), d.albedo = d.iAlbedo.attachUniform("uAlbedo"), d.gloss = d.iGloss.attachUniform("uGloss"), d.specular = d.iSpecular.attachUniform("uSpecular"), d.normals = d.iNormal.attachSampler("tNormal", "vTexCoord"), d.cavity = d.iCavity.attachSampler("tCavity", "vTexCoord"), d.cavityStr = d.iCavityStrength.attachConstant([1, 1]), d.cavity.set(m.getTexture("grill_COLOR")), d.normals.set(m.getTexture("grill_NRM")), d.specular.set(.15, .15, .15), b.setOpaque(d), b.registerMaterial(d, "Grill"), d = b.createBaseMaterial(c), d.albedo = d.iAlbedo.attachSampler("tAlbedo", "vTexCoord"), d.gloss = d.iGloss.attachConstant(0), d.specular = d.iSpecular.attachConstant([0, 0, 0]), d.albedo.set(m.getTexture("inside_COLOR")), b.setOpaque(d), b.registerMaterial(d, "Interior"), d = b.createBaseMaterial(c), d.albedo = d.iAlbedo.attachSampler("tAlbedo", "vTexCoord"), d.gloss = d.iGloss.attachUniform("uGloss"), d.specular = d.iSpecular.attachUniform("uSpecular"), d.albedo.set(m.getTexture("grill_COLOR")), d.specular.set(.15, .15, .15), b.setOpaque(d), b.registerMaterial(d, "Plaques"), d = new g(c), d.uTime = d.iTime.attachUniform("iTime"), d.show = d.iShow.attachUniform("iShow"), d.cavity = d.iCavity.attachSampler("tCavity", "vCavityTexCoord", "g"), d.cavity.set(m.getTexture("ground_OCCLU")), d.diffuse = d.iDiffuse.attachSampler("tDiffuse", "vDiffuseTexCoord", "g"), d.diffuse.set(m.getTexture("ground_DIFFUSE")), d.normal = d.iNormal.attachSampler("tNormal", "vDiffuseTexCoord"), d.normal.set(m.getTexture("ground_NRM")), b.setOpaque(d), d._mask = i.BLENDED, d.setIBL(a.env.ibl), this.groundOcclu = d, b.registerMaterial(d, "ground_occlu");
            var q = new k(c);
            q.compile(), this.depthPass = q
        }
        var e = (a("gl/Standard"), a("gl/ClearCoat")), f = a("gl/BasicMaterial"), g = a("gl/GroundMaterial"), h = a("utils/color"), i = a("assets/materials-lib"), j = a("assets/mat-transition"), k = a("nanogl-pbr/depthpass"), l = a("nanogl-pbr/lib/input");
        d.prototype = {
            nextConfig: function() {
                this.currentCfg++, this.currentCfg > this.carConfigs.length - 1 && (this.currentCfg = 0);
                var a = this.carConfigs[this.currentCfg];
                this.carTransition.to(a)
            },
            getLoadables: function() {
                return []
            },
            preRender: function(a) {
                this.groundOcclu.time += .5 * a, this.groundOcclu.uTime.set(this.groundOcclu.time%100), this.carTransition.step(a), this.accTransition.step(a), this.alyTransition.step(a)
            }
        }, b.exports = d
    }, {
        "assets/mat-transition": 17,
        "assets/materials-lib": 18,
        "gl/BasicMaterial": 66,
        "gl/ClearCoat": 67,
        "gl/GroundMaterial": 69,
        "gl/Standard": 71,
        "nanogl-pbr/depthpass": 129,
        "nanogl-pbr/lib/input": 141,
        "utils/color": 89
    }
    ],
    13: [function(a, b, c) {
        arguments[4][8][0].apply(c, arguments)
    }, {
        "assets/picking": 21,
        dup: 8
    }
    ],
    14: [function(a, b, c) {
        arguments[4][9][0].apply(c, arguments)
    }, {
        "assets/picking": 21,
        dup: 9
    }
    ],
    15: [function(a, b, c) {
        function d(a) {
            var b = a.texs;
            this.lib = b, this.gl = a.gl;
            var c = 0, d = b.qDir;
            this.texDefs = [b.makeTex("car_OCCLU", !0, !1, c, b.bbc, d + "/juke_sv2/car_OCCLU.jpg"), b.makeTex("inside_COLOR", !0, !1, c, b.bbc, d + "/juke_sv2/inside_COLOR.jpg"), b.makeTex("ground_OCCLU", !0, !1, c, b.bbc, d + "/juke_sv2/ground_OCCLU.jpg"), b.makeTex("ground_DIFFUSE", !0, !0, 4, b.bbc, d + "/juke_sv2/ground_DIFFUSE.jpg"), b.makeTex("ground_NRM", !0, !0, 4, b.bbc, d + "/juke_sv2/ground_NRM.jpg"), b.makeTex("grill_COLOR", !0, !1, c, b.bbc, d + "/juke_sv2/grill_COLOR.jpg"), b.makeTex("grill_NRM", !0, !1, c, b.bbc, d + "/juke_sv2/grill_NRM.jpg"), b.makeTex("details_NRM", !0, !1, c, b.bbc, d + "/juke_sv2/details_NRM.jpg"), b.makeTex("access_OCCLU", !0, !1, c, b.bbc, d + "/juke_sv2/access_OCCLU.jpg"), b.makeTex("wheelgroup_albedo", !0, !1, c, b.bbc, d + "/juke_sv2/wheelgroup_albedo.jpg"), b.makeTex("wheelgroup_gloss_ao", !0, !1, c, b.bbc, d + "/juke_sv2/wheelgroup_gloss_ao.jpg"), b.makeTex("wheelgroup_normal", !0, !1, c, b.bbc, d + "/juke_sv2/wheelgroup_normal.jpg"), b.makeTex("wheelgroup_specular", !0, !1, c, b.bbc, d + "/juke_sv2/wheelgroup_specular.jpg"), b.makeTex("alloy_OCCLU", !0, !1, c, b.bbc, d + "/juke_sv2/alloy_OCCLU.jpg"), b.makeTex("alloy_NRM", !0, !1, c, b.bbc, d + "/juke_sv2/alloy_NRM.jpg"), b.makeCube("interior_white", !0, !1, 2048, b.bbc, "juke_sv2/interior_white")];
        }
        b.exports = d
    }, {}
    ],
    16: [function(a, b, c) {
        function d(a) {
            for (var b = 0; 12 > b; b++)
                if (a[b] !== f[b])
                    return !1;
            return !0
        }
        function e(a) {
            this.ext = a.getExtension("WEBGL_compressed_texture_etc1") || a.getExtension("WEBKIT_WEBGL_compressed_texture_etc1");
            var b = this;
            this.parse = function(a) {
                return b._parse(a)
            }
        }
        var f = new Uint8Array([171, 75, 84, 88, 32, 49, 49, 187, 13, 10, 26, 10]);
        e.prototype = {
            isSupported: function() {
                return !!this.ext
            },
            _parse: function(a) {
                var b = new Uint8Array(a, 0, 12);
                if (!d(b))
                    throw new Error("[KTXParser] Bad Magic");
                var a = new DataView(a), c = 67305985 === a.getUint32(12, !0), e = 16;
                a.getUint32(e, c);
                e += 4;
                a.getUint32(e, c);
                e += 4;
                a.getUint32(e, c);
                e += 4;
                var f = a.getUint32(e, c);
                e += 4;
                a.getUint32(e, c);
                e += 4;
                var g = a.getUint32(e, c);
                e += 4;
                var h = a.getUint32(e, c);
                e += 4;
                a.getUint32(e, c);
                e += 4;
                var i = a.getUint32(e, c);
                e += 4;
                var j = a.getUint32(e, c);
                e += 4;
                var k = a.getUint32(e, c);
                e += 4;
                var l = a.getUint32(e, c);
                if (e += 4, f !== this.ext.COMPRESSED_RGB_ETC1_WEBGL)
                    throw new Error("KTX unsupported internal format " + f + ". Must be COMPRESSED_RGB_ETC1_WEBGL");
                e += l;
                for (var m = k > 0 ? k : 1, n = i > 0 ? i : 1, o = j > 0 ? j : 1, p = [], q = 0; o > q; q++)
                    p.push([]);
                for (var r = 0; m > r; r++) {
                    var s = a.getUint32(e, c);
                    e += 4;
                    var t =- 4 & s;
                    console.log(o, n, s, t);
                    for (var u = 0; n > u; u++)
                        for (var q = 0; o > q; q++) {
                            var v = new Uint8Array(a.buffer, e, t);
                            e += t, p[q].push(v)
                        }
                    }
                return {
                    width: g,
                    height: h,
                    surfaces: p,
                    format: f,
                    cubemap: !1
                }
            },
            _getFormat: function(a) {
                switch (a) {
                case RGB_PVRTC_4BPPV1_Format:
                    return this.ext.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;
                case RGB_PVRTC_2BPPV1_Format:
                    return this.ext.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;
                case RGBA_PVRTC_4BPPV1_Format:
                    return this.ext.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;
                case RGBA_PVRTC_2BPPV1_Format:
                    return this.ext.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG;
                default:
                    throw new Error("[PVRLoader] Unknown pixel format")
                }
            },
            _extract: function(a) {
                for (var b = [], c = this._getFormat(a.format), d = ({
                    width: a.width,
                    height: a.height,
                    surfaces: b,
                    format: c,
                    cubemap: a.isCubemap
                }, a.buffer), e = a.dataPtr, f = a.bpp, g = a.numSurfaces, h = 0, i = 0, j = 0, k = 0, l = 0, m = 0, n = 0; g > n; n++)
                    b.push([]);
                2 === f ? (j = 8, k = 4) : (j = 4, k = 4), i = j * k * f / 8;
                for (var o = 0; o < a.numMipmaps;) {
                    var p = a.width>>o, q = a.height>>o;
                    l = p / j, m = q / k, 2 > l && (l = 2), 2 > m && (m = 2), h = l * m * i;
                    for (var n = 0; g > n; n++) {
                        var r = new Uint8Array(d, e, h);
                        b[n].push(r), e += h
                    }
                    o++
                }
            }
        }, b.exports = e
    }, {}
    ],
    17: [function(a, b, c) {
        function d(a, b) {
            this.mat = a, this.props = [], this.propsMap = {};
            for (var c in b)
                this.addProperty(c, b[c]);
            this.p = 0
        }
        function e(a) {
            this.name = "", this.value = new Float32Array(a), this.dest = new Float32Array(a), this.start = new Float32Array(a), this.p = 0
        }
        function f() {
            this.name = "", this.value = 0, this.dest = 0, this.start = 0
        }
        var g = (a("utils/ease"), .18);
        d.prototype = {
            step: function(a) {
                if (1 !== this.p) {
                    this.p += a / g, this.p > 1 && (this.p = 1);
                    for (var b = this.mat, c = 0; c < this.props.length; c++) {
                        var d = this.props[c];
                        d.step(this.p), d.apply(b)
                    }
                }
            },
            addProperty: function(a, b) {
                var c = this.makeProperty(a, b);
                this.propsMap[a] = c, this.props.push(c)
            },
            makeProperty: function(a, b) {
                var c, d = b.length;
                return c = void 0 !== d ? new e(d) : new f(d), c.set(b), c.name = a, c
            },
            to: function(a) {
                for (var b in a)
                    this.propsMap[b].to(a[b]);
                this.p = 0
            }
        }, e.prototype = {
            set: function(a) {
                this.start.set(a), this.dest.set(a)
            },
            to: function(a) {
                this.start.set(this.value), this.dest.set(a), this.p = 0
            },
            step: function(a) {
                var b = 1 - a;
                this.value[0] = this.start[0] * b + this.dest[0] * a, this.value[1] = this.start[1] * b + this.dest[1] * a, this.value[2] = this.start[2] * b + this.dest[2] * a
            },
            apply: function(a) {
                a[this.name].set(this.value[0], this.value[1], this.value[2])
            }
        }, f.prototype = {
            set: function(a) {
                this.start = a, this.dest = a
            },
            to: function(a) {
                this.start = this.value, this.dest = a, this.p = 0
            },
            step: function(a) {
                var b = 1 - a;
                this.value = this.start * b + this.dest * a
            },
            apply: function(a) {
                a[this.name].set(this.value)
            }
        }, b.exports = d
    }, {
        "utils/ease": 90
    }
    ],
    18: [function(a, b, c) {
        function d(a, b) {
            this.gl = a, this.renderer = b, this.materials = {}, this.matlist = [], this.time = 0, this.uTime = new h.Uniform("uTime", 1);
            var c;
            this.texs = b.texs;
            c = this.createBaseMaterial(a), c.albedo = c.iAlbedo.attachUniform("uAlbedo"), c.specular = c.iSpecular.attachUniform("uSpecular"), c.gloss = c.iGloss.attachUniform("uGloss"), c.albedo.set(0, .95, 0), c.specular.set(.15, .15, .15), c.gloss.set(.2), this.setOpaque(c), this.defaultMaterial = c;
            var d = new g(a);
            d.compile(), this.depthPass = d;
            var e = new i(a);
            this.depthCutMaterial = e;
            var f = new j(a);
            this.plainMaterial = f
        }
        function e(a) {
            var b = new f(a);
            return b
        }
        var f = a("gl/Standard"), g = a("nanogl-pbr/depthpass"), h = a("nanogl-pbr/lib/input"), i = a("gl/DepthCutMaterial"), j = a("gl/PlainMaterial"), k = a("entities/RevealModel");
        a("dev/gui");
        d.OPAQUE = 1, d.BLENDED = 2, d.prototype = {
            update: function(a) {
                this.time += a, this.uTime.set(this.time)
            },
            registerMaterial: function(a, b) {
                void 0 === this.materials[b] && (this.materials[b] = a, this.matlist.push(a))
            },
            createBaseMaterial: function() {
                var a = e(this.gl);
                return a._precision = "highp", a.setIBL(this.renderer.env.ibl), a.setLightSetup(this.renderer.lights.setup), a.perVertexIrrad.enable(), a
            },
            getMaterial: function(a) {
                var b = this.materials[a];
                return void 0 === b && (console.log("        -> not found", a), b = this.defaultMaterial), b
            },
            setOpaque: function(a) {
                a._mask = d.OPAQUE, a.config.enableCullface(!0), a.config.enableDepthTest(), a.config.depthMask(!0)
            },
            setGlass: function(a, b, c, e) {
                a._mask = d.BLENDED, a.config.enableCullface(), a.config.enableDepthTest(), a.config.depthMask(!1), a.config.enableBlend(), a.config.blendFunc(this.gl.ONE, this.gl.CONSTANT_COLOR), a.config.blendColor(b, c, e, 1)
            },
            compileAll: function() {
                k.isReaveling.set(!1), this.matlist.forEach(function(a) {
                    a.compile(), a.prg.use()
                }), k.isReaveling.set(!0), this.matlist.forEach(function(a) {
                    a.compile(), a.prg.use()
                })
            }
        }, b.exports = d
    }, {
        "dev/gui": 39,
        "entities/RevealModel": 42,
        "gl/DepthCutMaterial": 68,
        "gl/PlainMaterial": 70,
        "gl/Standard": 71,
        "nanogl-pbr/depthpass": 129,
        "nanogl-pbr/lib/input": 141
    }
    ],
    19: [function(a, b, c) {
        function d(a, b) {
            var c, d;
            if (void 0 !== a.touches) {
                var e;
                if (a.touches.length > 0 ? e = a.touches : a.changedTouches && a.changedTouches.length > 0 && (e = a.changedTouches), e) {
                    for (var c = 0, d = 0, f = 0; f < e.length; f++)
                        c += e[f].clientX, d += e[f].clientY;
                    c/=e.length, d/=e.length
                }
            } else 
                c = a.clientX, d = a.clientY;
            b[0] = 2 * c / t.canvasWidth - 1, b[1] =- (2 * d / t.canvasHeight - 1)
        }
        function e(a) {
            d(a, u)
        }
        function f(a) {
            d(a, u), y.emit("down", u)
        }
        function g(a) {
            d(a, u), y.emit("up", u)
        }
        function h() {
            v = Date.now()
        }
        function i() {
            return Date.now() - v > 5e3
        }
        function j(a) {
            i() && e(a)
        }
        function k(a) {
            i() && f(a)
        }
        function l(a) {
            i() && g(a)
        }
        function m(a) {
            h(), e(a), p(a)
        }
        function n(a) {
            h(), f(a)
        }
        function o(a) {
            h(), g(a), p(a)
        }
        function p(a) {
            if (void 0 !== a.touches && a.touches.length > 1) {
                var b = a.touches[0].clientX - a.touches[1].clientX, c = a.touches[0].clientY - a.touches[1].clientY, d = Math.sqrt(b * b + c * c);
                if (w) {
                    var e = d / x;
                    y.emit("pinch", e)
                } else 
                    w=!0, x = d, y.emit("pinchstart");
                a.preventDefault()
            } else 
                w=!1
        }
        function q(a) {
            t = a, s = t.canvas, s.addEventListener("mousemove", j), s.addEventListener("mousedown", k), s.addEventListener("mouseup", l), s.addEventListener("touchmove", m), s.addEventListener("touchstart", n), s.addEventListener("touchend", o)
        }
        var r = a("event-emitter"), s = null, t = null, u = new Float32Array(2), v = 0, w=!1, x = 0, y = {
            coords: u,
            init: q
        };
        r(y), b.exports = y
    }, {
        "event-emitter": 112
    }
    ],
    20: [function(a, b, c) {
        function d(a, b, c) {
            this.mouseDown = this._mouseDown.bind(this), this.mouseUp = this._mouseUp.bind(this), this.picking = a, this.ray = b, this.chain = c, this.backside=!1, this.downCoord = new Float32Array([ - 1e3, - 1e3])
        }
        var e = a("assets/mouse"), f = a("event-emitter");
        d.prototype = {
            connect: function() {
                e.on("down", this.mouseDown), e.on("up", this.mouseUp)
            },
            _mouseDown: function(a) {
                this.ray.update(a);
                var b = this.picking.run(this.ray);
                0 !== b ? (this.backside =- 1 === b, this.downCoord.set(a)) : this.reset(), this.chain && this.chain._mouseDown(a)
            },
            _mouseUp: function(a) {
                var b = a[0] - this.downCoord[0], c = a[1] - this.downCoord[1], d = Math.sqrt(b * b + c * c);
                .05 > d ? this.emit("click", this.backside) : this.chain && this.chain._mouseUp(a), this.chain && this.chain.reset(), this.reset()
            },
            reset: function() {
                this.downCoord[0] =- 1e3, this.downCoord[1] =- 1e3
            }
        }, f(d.prototype), b.exports = d
    }, {
        "assets/mouse": 19,
        "event-emitter": 112
    }
    ],
    21: [function(a, b, c) {
        function d(a, b) {
            this.datas = a, this.doubleSided=!!b
        }
        var e = a("gl-matrix"), f = e.vec3, g = f.create(), h = f.create(), i = f.create(), j = f.create(), k = f.create();
        d.prototype = {
            run: function(a) {
                for (var b, c, d, e, l = a.pos, m = a.dir, n = this.datas.faces, o = this.datas.verts, p = 0; p < n.length; p += 3) {
                    b = 3 * n[p + 0], c = 3 * n[p + 1], d = 3 * n[p + 2], g[0] = o[c + 0] - o[b + 0], g[1] = o[c + 1] - o[b + 1], g[2] = o[c + 2] - o[b + 2], h[0] = o[d + 0] - o[b + 0], h[1] = o[d + 1] - o[b + 1], h[2] = o[d + 2] - o[b + 2], f.cross(i, g, h);
                    var q = f.dot(m, i);
                    if (q > 0) {
                        if (!this.doubleSided)
                            continue;
                        e = 1
                    } else {
                        if (!(0 > q))
                            continue;
                        e =- 1, q =- q
                    }
                    j[0] = l[0] - o[b + 0], j[1] = l[1] - o[b + 1], j[2] = l[2] - o[b + 2], f.cross(k, j, h);
                    var r = e * f.dot(m, k);
                    if (!(0 > r)) {
                        f.cross(k, g, j);
                        var s = e * f.dot(m, k);
                        if (!(0 > s || r + s > q)) {
                            var t =- e * f.dot(j, i);
                            if (!(0 > t))
                                return f.scaleAndAdd(k, l, m, t / q), e
                        }
                    }
                }
                return 0
            },
            getPos: function() {
                return k
            }
        }, b.exports = d
    }, {
        "gl-matrix": 113
    }
    ],
    22: [function(a, b, c) {
        function d(a) {
            var b = a.getShaderPrecisionFormat(a.VERTEX_SHADER, a.HIGH_FLOAT), c = a.getShaderPrecisionFormat(a.FRAGMENT_SHADER, a.HIGH_FLOAT);
            return c.precision > 0 && b.precision > 0
        }
        function e(a) {
            this.hasHighp = d(a), this.programs = [this.carLines = new f(a), this.sky = new f(a), this.loadingFloor = new f(a), this.interior = new f(a), this.uiLines = new f(a), this.uiCompass = new f(a), this.uiCompassColor = new f(a), this.spot = new f(a), this.glow = new f(a)], this.compile()
        }
        var f = a("nanogl/program");
        f.debug=!0, e.prototype = {
            precision: function() {
                return this.hasHighp ? "highp" : "mediump"
            },
            compile: function() {
                var a = "\n";
                a += "precision " + this.precision() + " float;\n", this.sky.compile("#define GLSLIFY 1\nattribute vec2 aPosition;\n\nuniform mat4 uUnproject;\n\nvarying vec3 vTexCoord;\n\nvoid main( void ){\n\n  vec4 pos = vec4( aPosition, 1.0, 1.0 );\n\n  vTexCoord = normalize( (uUnproject * pos).xyz );\n\n  gl_Position    = pos;\n\n}", '#define GLSLIFY 1\n#define glossNearest 1\n\nuniform vec2 uToneMap;\nuniform vec3 uGroundColor;\nuniform vec3 uGroundColors[2];\nuniform float uGroundDark;\n\nvarying vec3 vTexCoord;\n\n#ifdef USE_SH\n  uniform vec4 uSHCoeffs[7];\n  \n// ================================\n// compute Spherical Harmonics\n// ================================\n//\n// "Stupid Spherical Harmonics (SH) Tricks"\n// http://www.ppsloan.org/publications/StupidSH36.pdf\n//\n//\nvec3 SampleSH( vec3 Normal, vec4 shCoefs[7] )\n{\n  Normal.xz = Normal.zx;\n  vec4 NormalVector = vec4(Normal, 1.0);\n\n  // todo transpose coeffs directly\n  // NormalVector.xyz = NormalVector.zyx;\n\n  vec3 X0, X1, X2;\n  X0.x = dot( shCoefs[0].xyz, Normal) + shCoefs[0].w;\n  X0.y = dot( shCoefs[1].xyz, Normal) + shCoefs[1].w;\n  X0.z = dot( shCoefs[2].xyz, Normal) + shCoefs[2].w;\n\n  vec4 vB = NormalVector.zyxx * NormalVector.yxxz;\n  X1.x = dot( shCoefs[3].xyz, vB.xyz) + (shCoefs[3].w * vB.w);\n  X1.y = dot( shCoefs[4].xyz, vB.xyz) + (shCoefs[4].w * vB.w);\n  X1.z = dot( shCoefs[5].xyz, vB.xyz) + (shCoefs[5].w * vB.w);\n\n  float vC = NormalVector.z * NormalVector.z - NormalVector.y * NormalVector.y;\n  X2 =  shCoefs[6].xyz * vC;\n\n  return ( X0 + X1 + X2 );\n//  return max( vec3(0.0) , X0 + X1 + X2 );\n}\n\n#else\n  uniform sampler2D tEnv;\n  // #pragma XXXglslify: SpecularIBL = require( nanogl-pbr/glsl/includes/ibl.glsl )\n  \nvec2 octwrapDecode( vec3 v ) {\n  // Project the sphere onto the octahedron, and then onto the xy plan\n  vec2 p = v.xy / dot(  abs( v ) , vec3(1.0) );\n  p = vec2( p.x+p.y-1.0, p.x-p.y );\n\n  if( v.z < 0.0 )\n    p.x *= -1.0;\n\n  // p.x *= sign( v.z );\n  return p;\n}\n\n#endif\n\nconst vec2 _IBL_UVM = vec2(\n  0.25*(254.0/256.0),\n  0.5*(254.0/256.0)\n);\n\nvec3 SampleBg( sampler2D tEnv, vec3 skyDir )\n{\n\n  vec2 uvA = octwrapDecode( skyDir );\n  uvA = uvA * _IBL_UVM + vec2(0.5);\n\n  return texture2D( tEnv, uvA ).rgb;\n}\n\nvoid main( void ){\n\n  #ifdef USE_SH\n    vec3 color = SampleSH(vTexCoord, uSHCoeffs );\n  #else\n    // vec3 color = SpecularIBL( tEnv, normalize( vTexCoord ), .3 );\n    vec3 color = SampleBg( tEnv, normalize( vTexCoord ) );\n  #endif\n\n  color = uToneMap.x * pow(color, vec3(uToneMap.y));\n\n  float slope = - vTexCoord.y / .3 + mix(.4, .8, uGroundDark);\n  vec3 groundColor = mix(uGroundColors[0], uGroundColors[1], uGroundDark);\n  color = mix( color, groundColor, clamp( slope, 0.0, 1.0 ) );\n\n  gl_FragColor = vec4(color, 1.0);\n\n}', a), this.carLines.compile("#define GLSLIFY 1\n\nattribute vec3 aPosition;\nattribute float aIndex;\n\nuniform vec3 uCameraPosition;\nuniform mat4 uMVP;\nuniform float uInverted;\n\nvarying float vIndex;\nvarying vec3 vPos;\nvarying float vCameraDist;\n\nvoid main( void ){\n\n  float i = uInverted;\n  vec4 pos = vec4( aPosition, 1.0 );\n\n  pos.z *= uInverted;\n\n  gl_Position     = uMVP * pos;\n  gl_Position.z  -= 0.01;\n\n  vCameraDist = length(uCameraPosition - aPosition);\n  vIndex = aIndex;\n  vPos   = aPosition;\n\n}", "#define GLSLIFY 1\n// uniform float uGlobalAlpha;\n// uniform float uShowState;\n// uniform float uShowIndex;\n// uniform float uLoadProgress;\n// uniform float uProgress;\n// uniform float uTime;\n// uniform float uSize; // Line/Gradient length\n// uniform float uIsPlainColor; // 1 plain | 0 alpha\n// uniform vec2 uRangeXY[2];\n\nuniform vec4 uParams[3];\n\nuniform vec3 uPlainColors[2];\nuniform float uWheelLine;\n\nvarying float vCameraDist;\nvarying float vIndex;\nvarying vec3 vPos;\n\n//////////\n// UTILS\n//////////\nvec4 when_eq(vec4 x, vec4 y) {\n  return 1.0 - abs(sign(x - y));\n}\n\nvec4 when_neq(vec4 x, vec4 y) {\n  return abs(sign(x - y));\n}\n\nvec4 when_gt(vec4 x, vec4 y) {\n  return max(sign(x - y), 0.0);\n}\n\nvec4 when_lt(vec4 x, vec4 y) {\n  return max(sign(y - x), 0.0);\n}\n\nvec4 when_ge(vec4 x, vec4 y) {\n  return 1.0 - when_lt(x, y);\n}\n\nvec4 when_le(vec4 x, vec4 y) {\n  return 1.0 - when_gt(x, y);\n}\n\nfloat map(float value, float inMin, float inMax, float outMin, float outMax) {\n  return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);\n}\n\n//////////\n// MAIN\n//////////\nvoid main( void ){\n\n  float uGlobalAlpha      = uParams[0].x;\n  float uShowState        = uParams[0].y;\n  float uShowIndex        = uParams[0].z;\n  float uLoadProgress     = uParams[0].w;\n  float uProgress         = uParams[1].x;\n  float uTime             = uParams[1].y;\n  float uSize             = uParams[1].z;\n  float uIsPlainColor     = uParams[1].w;\n\n  float size     = uSize;\n  float t        = map(uProgress, 0.0, 1.0, -size, 1.0 + size);\n  float progress = when_eq( when_ge( vec4(vIndex), vec4(t - size) ), when_le( vec4(vIndex), vec4(t + size) ) ).x;\n  float isPlain  = when_eq(vec4(1.0), vec4(uIsPlainColor)).x;\n\n  float xMapPos         = map( vPos.x, uParams[2].x, uParams[2].y, 0.0, 1.0 );\n  float yMapPos         = map( vPos.y, uParams[2].z, uParams[2].w, 0.0, 1.0 );\n  float showRevealState = map( uShowState, 0.0, 1.0, -0.7, 1.5 );\n\n  vec3 plainColor       = mix( uPlainColors[0], uPlainColors[1], abs((vIndex - t)/size) );\n  vec3 whiteColor       = vec3(1.0 - (vIndex * progress) / 6.0);\n  vec3 color            = mix( whiteColor, plainColor, uIsPlainColor );\n\n  float blink           = max(0.0, (1.0 - abs(map( mod((uTime/2000.0), 1.5), 0.0, 1.0, -0.7, 1.5 ) - xMapPos) * 5.0) * (1.0 - isPlain)) * uShowState;\n  float drawTime        = max(0.0, (1.0 - abs(showRevealState - xMapPos) * 1.7 )) + blink;\n\n  vec3 blinkColor = vec3(1.0, 1.0, 1.0);\n  color = mix(color, blinkColor, drawTime);\n\n  float gradientValue = clamp(abs( 1.0 - abs(vIndex - t)/size ), 0.0, 1.0);\n\n  // Alpha Gradient RED LINE\n  float grad  = (1.0 - abs(vIndex - t)/size) * isPlain + ( (1.0 - isPlain) * gradientValue );\n\n  float alpha = progress * max(grad, 0.4);\n\n  float plainShowProgress = map((uLoadProgress - uShowIndex), 0.0, 1.0, 0.0, 1.0);\n  float alphaShowRedLine = ((1.0 - 1.0 * isPlain + uWheelLine) + (isPlain * clamp(plainShowProgress, 0.0, 1.0) * 5.0));\n  alpha *= when_le(vec4(uShowIndex), vec4( uLoadProgress )).x * alphaShowRedLine;\n\n  alpha *= when_le(vec4(xMapPos), vec4(uShowState)).x;\n\n  alpha += drawTime * (1.0 - isPlain);\n\n  // Loading white attenuation\n  float whiteAttenuation = clamp( map(uLoadProgress, 0.0, 1.0, -1.5, 0.5), 0.0, 1.0);\n  alpha *= mix(1.0, 0.0, (1.0 - isPlain) * whiteAttenuation);\n\n  alpha *= uGlobalAlpha;\n  alpha = min(1.0, alpha);\n\n  alpha*= 1.0 - max(0.0, (vCameraDist-20.0)/100.0);\n\n  gl_FragColor = vec4( color, alpha );\n\n}", a), this.loadingFloor.compile("#define GLSLIFY 1\nuniform mat4 uMVP;\n\nattribute vec3 aPosition;\nattribute vec3 aTexCoord;\n\nvarying vec2 vUv;\nvarying vec3 vPos;\n\nvoid main( void ){\n\n  vec4 pos = vec4( aPosition, 1.0 );\n\n  gl_Position    = uMVP * pos;\n\n  vPos = aPosition;\n\n  vUv = aTexCoord.xy;\n\n}", "#define GLSLIFY 1\nuniform sampler2D uCrossSampler;\nuniform sampler2D uLinesSampler;\nuniform float uTime;\nuniform float uOpening;\n\nvarying vec2 vUv;\nvarying vec3 vPos;\n\nvoid main( void ){\n\n  float t = uTime;\n\n  vec2 uvc = vUv;\n  // HARD CODED SPEED\n  uvc.x -= t * 0.00006; // 1/10000;\n\n  vec4 cross      = texture2D(uCrossSampler, uvc * 8.0);\n  vec4 crossColor = vec4(0.65, 0.65, 0.65, cross.a * 0.5);\n  // vec4 crossColor = vec4(1.0, 0.0, 0.0, cross.a * 0.5);\n  crossColor *= 1.0 - step(uOpening, 1.0 - cross.a);\n\n  vec2 uvl = vUv*2.0;\n  // HARD CODED SPEED\n  uvl.x -= t * 0.00012;\n\n  vec4 line = texture2D(uLinesSampler, uvl);\n  vec4 lineColor = vec4(1.0, 1.0, 1.0, line.a - 0.33);\n  lineColor *= 1.0 - step(uOpening, 1.0 - line.a);\n\n  vec4 color = crossColor + lineColor;\n\n  // Alpha round corners\n  float dist = sqrt(vPos.x*vPos.x + vPos.y*vPos.y) - 0.2;\n  color.a   *= (1.0 - max(0.0, dist));\n\n  gl_FragColor = color;\n\n}", a), this.interior.compile("#define GLSLIFY 1\nattribute vec3 aPosition;\n\nuniform mat4 uMVP;\n\nvarying vec3 vDir;\n\nvoid main( void ){\n  gl_Position = uMVP * vec4( aPosition, 1.0 );\n  vDir = aPosition;\n}", "#define GLSLIFY 1\nuniform samplerCube tCube;\nuniform float uOpacity;\n\nvarying vec3 vDir;\n\nvoid main( void ){\n  vec3 dir = vDir;\n  dir.x = -dir.x;\n  vec4 color = textureCube( tCube, dir );\n  color.a = uOpacity;\n  gl_FragColor = color;\n}", a), this.uiLines.compile("#define GLSLIFY 1\nattribute vec3 aPosition;\nattribute float aOpacity;\n\nuniform mat4 uMVP;\nuniform mat4 uM;\n\nvarying lowp float vOpacity;\nvarying float vWorldY;\n\nvoid main( void ){\n  gl_Position = uMVP * vec4( aPosition, 1.0 );\n  vWorldY = ( uM * vec4( aPosition, 1.0 ) ).y;\n  vOpacity = aOpacity;\n}", "#define GLSLIFY 1\n\nvarying lowp float vOpacity;\nvarying float vWorldY;\n\nuniform float uOpacity;\n\nuniform float uOpening;\n\nfloat uiFade( float worldY ){\n  float ny = (worldY /12.0) + uOpening;\n  ny = clamp( ny, -1.3, 1.3 );\n\n  float nny = (ny-1.0) * 6.0;\n  return - pow( abs(ny), 10.0 ) + exp( -nny*nny );\n}\n\nvoid main( void ){\n  float fade = uiFade( vWorldY );\n  fade = clamp( fade, -1.0, 1.0 );\n  gl_FragColor = vec4( 1.0, 1.0, 1.0, uOpacity * vOpacity + fade );\n}", a), this.uiCompass.compile("#define GLSLIFY 1\nattribute vec3 aData;\n\nuniform mat4 uMVP;\n\nuniform float uAngle;\n\nvarying lowp float vOpacity;\n\nvoid main( void ){\n\n  float angle = uAngle * aData.y;\n  vec2 trig = vec2( cos( angle), sin( angle) );\n  mat2 rm = mat2( trig.x, -trig.y, trig.y, trig.x );\n  vec2 pos = rm * vec2( aData.x, 0.0 );\n\n  gl_Position = uMVP * vec4( pos.x, 0.0, pos.y, 1.0 );\n\n  vOpacity = aData.z;\n\n}", "#define GLSLIFY 1\n\nvarying lowp float vOpacity;\n\nuniform float uOpacity;\n\nvoid main( void ){\n  gl_FragColor = vec4( 1.0, 1.0, 1.0, uOpacity * vOpacity );\n}", a), this.uiCompassColor.compile("#define GLSLIFY 1\nattribute vec3 aData;\n\nuniform mat4 uMVP;\n\nuniform float uAngle;\n\nvoid main( void ){\n\n  float angle = uAngle * aData.y;\n  vec2 trig = vec2( cos( angle), sin( angle) );\n  mat2 rm = mat2( trig.x, -trig.y, trig.y, trig.x );\n  vec2 pos = rm * vec2( aData.x, 0.0 );\n\n  gl_Position = uMVP * vec4( pos.x, 0.0, pos.y, 1.0 );\n\n}", "#define GLSLIFY 1\n\nuniform float uOpacity;\n\nvoid main( void ){\n  gl_FragColor = vec4( 1.0, 1.0, 1.0, uOpacity );\n}", a), this.spot.compile("#define GLSLIFY 1\nattribute vec2 aPosition;\n\nvarying vec2 vTexCoord;\n\nuniform mat4 uMVP;\n\nvoid main( void ){\n  \n  gl_Position = uMVP * vec4( aPosition, 0.0, 1.0 );\n\n  vTexCoord = aPosition;\n  \n}", "#define GLSLIFY 1\n\nvarying vec2 vTexCoord;\n\nuniform float uInnerRadius; // radius x 10\nuniform vec4 uColor1;\nuniform vec4 uColor2;\n\nvoid main( void ) {\n\n  float dist = 25.0 * length( vTexCoord );\n\n  float limit = dist - uInnerRadius;\n  limit = clamp( limit, .0, 1.0 );\n  gl_FragColor = mix( uColor1, uColor2, limit );\n\n  float outerLimit = clamp( 25.0 - dist, .0, 1.0 );\n  gl_FragColor.a *= outerLimit;\n\n}", a), this.glow.compile("#define GLSLIFY 1\nattribute vec2 aPosition;\n\nvarying vec2 vTexCoord;\n\nuniform mat4 uMVP;\n\nvoid main( void ){\n  \n  gl_Position = uMVP * vec4( aPosition, 0.0, 1.0 );\n\n  vTexCoord = aPosition;\n  \n}", "#define GLSLIFY 1\n\nvarying vec2 vTexCoord;\nuniform float uStrength;\n\nvoid main( void ){\n\n  float dist = length( vTexCoord );\n  gl_FragColor = vec4( uStrength - dist*uStrength );\n\n}", a), this.process()
            },
            process: function() {
                for (var a = 0; a < this.programs.length; a++)
                    this.programs[a].use()
            }
        }, b.exports = e
    }, {
        "nanogl/program": 160
    }
    ],
    23: [function(a, b, c) {
        function d(a) {
            this.ext = a.getExtension("WEBGL_compressed_texture_pvrtc") || a.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");
            var b = this;
            this.parse = function(a) {
                return b._parse(a)
            }
        }
        function e(a) {
            var b, c, d = a.header, e = d[12], f = d[2], k = d[6], l = d[7], m = (d[9], d[10]), n = d[11];
            switch (f) {
            case 0:
                b = 2, c = h;
                break;
            case 1:
                b = 2, c = j;
                break;
            case 2:
                b = 4, c = g;
                break;
            case 3:
                b = 4, c = i;
                break;
            default:
                throw new Error("pvrtc - unsupported PVR format " + f)
            }
            return a.dataPtr = 52 + e, a.bpp = b, a.format = c, a.width = l, a.height = k, a.numSurfaces = m, a.numMipmaps = n, a.isCubemap = 6 === m, a
        }
        function f(a) {
            var b, c = a.header, d = c[0], e = c[1], f = c[2], k = c[3], l = c[4], m = (c[5], c[6]), n = (c[7], c[8], c[9], c[10]), o = (c[11], c[12]), p = 255, q = 24, r = 25, s = l & p, t = n > 0;
            if (s === r)
                b = t ? i : g, m = 4;
            else {
                if (s !== q)
                    throw new Error("pvrtc - unknown format " + s);
                b = t ? j : h, m = 2
            }
            return a.dataPtr = d, a.bpp = m, a.format = b, a.width = f, a.height = e, a.numSurfaces = o, a.numMipmaps = k + 1, a.isCubemap = 6 === o, a
        }
        var g = 2100, h = 2101, i = 2102, j = 2103;
        d.prototype = {
            isSupported: function() {
                return !!this.ext
            },
            _parse: function(a) {
                var b, c = 13, d = new Uint32Array(a, 0, c), g = {
                    buffer: a,
                    header: d
                };
                if (55727696 === d[0])
                    b = e(g);
                else {
                    if (559044176 !== d[11])
                        throw new Error("[PVRLoader] Unknown PVR format");
                    b = f(g)
                }
                return this._extract(b)
            },
            _getFormat: function(a) {
                switch (a) {
                case g:
                    return this.ext.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;
                case h:
                    return this.ext.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;
                case i:
                    return this.ext.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;
                case j:
                    return this.ext.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG;
                default:
                    throw new Error("[PVRLoader] Unknown pixel format")
                }
            },
            _extract: function(a) {
                for (var b = [], c = this._getFormat(a.format), d = {
                    width: a.width,
                    height: a.height,
                    surfaces: b,
                    format: c,
                    cubemap: a.isCubemap
                }, e = a.buffer, f = a.dataPtr, g = a.bpp, h = a.numSurfaces, i = 0, j = 0, k = 0, l = 0, m = 0, n = 0, o = 0; h > o; o++)
                    b.push([]);
                2 === g ? (k = 8, l = 4) : (k = 4, l = 4), j = k * l * g / 8;
                for (var p = 0; p < a.numMipmaps;) {
                    var q = a.width>>p, r = a.height>>p;
                    m = q / k, n = r / l, 2 > m && (m = 2), 2 > n && (n = 2), i = m * n * j;
                    for (var o = 0; h > o; o++) {
                        var s = new Uint8Array(e, f, i);
                        b[o].push(s), f += i
                    }
                    p++
                }
                return d
            }
        }, b.exports = d
    }, {}
    ],
    24: [function(a, b, c) {
        function d() {
            this.materials = null, this.textures = null
        }
        var e = a("./materials"), f = a("./textures");
        d.prototype = {
            init: function(a) {
                this.textures = new f(a), this.materials = new e(a)
            },
            getInitialOrbitConfig: function() {
                return [ - 3.797, - .224, 1.558, .2369].concat(this.getInteriorPosition())
            },
            getInteriorPosition: function() {
                return [2.809, 12.494, 1.925]
            },
            getSceneUrl: function() {
                return Config.asset_url("qashqai/scene.awd")
            },
            preRender: function(a) {},
            getLoadables: function() {
                var a = [];
                return a = a.concat(this.textures.getLoadables()), a = a.concat(this.materials.getLoadables())
            }
        }, b.exports = d
    }, {
        "./materials": 25,
        "./textures": 26
    }
    ],
    25: [function(a, b, c) {
        function d(a) {
            var b = a.mats, c = a.gl;
            this.scene = a, this.matlib = b, this.gl = b.gl, this.materials = {}, this.matlist = [];
            var d, i = this.texs = a.texs;
            d = new e(c), d.setIBL(a.env.ibl), d.setLightSetup(a.lights.setup), d.albedo = d.iAlbedo.attachUniform("uAlbedo"), d.specular = d.iSpecular.attachUniform("uSpecular"), d.gloss = d.iGloss.attachUniform("uGloss"), d.fresnel = d.iFresnel.attachUniform("uFresnel"), d.clearcoat = d.iClearcoat.attachUniform("uClearcoat"), d.cavity = d.iCavity.attachSampler("tCavity", "vTexCoord"), d.cavityStr = d.iCavityStrength.attachUniform("uCavityStr"), f.HexInput(d.albedo, 3604492), f.HexInput(d.specular, 6553605), f.HexInput(d.fresnel, 16711680), d.clearcoat.set(.17, .09), d.gloss.set(.56), d.cavity.set(i.getTexture("car_OCCLU")), d.cavityStr.set(1, 1), b.setOpaque(d), b.registerMaterial(d, "Car"), d = b.createBaseMaterial(c), d.albedo = d.iAlbedo.attachUniform("uAlbedo"), d.specular = d.iSpecular.attachUniform("uSpecular"), d.gloss = d.iGloss.attachUniform("uGloss"), d.albedo.set(0, 0, 0), d.specular.set(.98, .98, .98), d.gloss.set(1), b.setOpaque(d), b.registerMaterial(d, "Chromes"), d = b.createBaseMaterial(c), d.albedo = d.iAlbedo.attachUniform("uAlbedo"), d.specular = d.iSpecular.attachUniform("uSpecular"), d.gloss = d.iGloss.attachUniform("uGloss"), d.cavity = d.iCavity.attachSampler("tCavity", "vTexCoord"), d.cavityStr = d.iCavityStrength.attachUniform("uCavityStr"), f.HexInput(d.albedo, 1579032), f.HexInput(d.specular, 2763306), d.gloss.set(.49), d.cavity.set(i.getTexture("car_OCCLU")), d.cavityStr.set(1, 1), b.setOpaque(d), b.registerMaterial(d, "LowGums"), d = b.createBaseMaterial(c), d.albedo = d.iAlbedo.attachUniform("uAlbedo"), d.specular = d.iSpecular.attachUniform("uSpecular"), d.gloss = d.iGloss.attachUniform("uGloss"), d.albedo.set(0, 0, 0), d.specular.set(.1, .1, .1), d.gloss.set(1), b.setGlass(d, .5, .5, .5), b.registerMaterial(d, "Glass"), d = b.createBaseMaterial(c), d.albedo = d.iAlbedo.attachUniform("uAlbedo"), d.specular = d.iSpecular.attachUniform("uSpecular"), d.gloss = d.iGloss.attachUniform("uGloss"), d.albedo.set(0, 0, 0), d.specular.set(.1, .1, .1), d.gloss.set(1), b.setOpaque(d), b.registerMaterial(d, "Glass Dark"), d = b.createBaseMaterial(c), d.albedo = d.iAlbedo.attachSampler("tAlbedo", "vTexCoord"), d.gloss = d.iGloss.attachSampler("tGloss", "vTexCoord"), d.normals = d.iNormal.attachSampler("tNormal", "vTexCoord"), d.specular = d.iSpecular.attachUniform("uSpecular"), d.albedo.set(i.getTexture("Tire_COLOR")), d.gloss.set(i.getTexture("Tire_GLOSS")), d.normals.set(i.getTexture("Tire_NRM")), d.specular.set(.15, .15, .15), b.setOpaque(d), b.registerMaterial(d, "tires"), d = b.createBaseMaterial(c), d.albedo = d.iAlbedo.attachSampler("tAlbedo", "vTexCoord"), d.gloss = d.iGloss.attachConstant(0), d.specular = d.iSpecular.attachConstant([0, 0, 0]), d.albedo.set(i.getTexture("inside_COLOR")), b.setOpaque(d), b.registerMaterial(d, "Interior"), d = b.createBaseMaterial(c), d.albedo = d.iAlbedo.attachUniform("uAlbedo"), d.specular = d.iSpecular.attachUniform("uSpecular"), d.gloss = d.iGloss.attachUniform("uGloss");
            var j = new h.Attribute("aTexCoord1", 2);
            d.cavity = d.iCavity.attachSampler("tCavity", j), d.cavityStr = d.iCavityStrength.attachUniform("uCavityStr"), d.albedo.set(.7, .7, .7), d.specular.set(.15, .15, .15), d.gloss.set(.3), d.cavity.set(i.getTexture("ground_OCCLU")), d.cavityStr.set(1, 1), b.setOpaque(d), b.registerMaterial(d, "Material #592");
            var k = new g(c);
            k.compile(), this.depthPass = k
        }
        var e = (a("nanogl-pbr/standard"), a("gl/ClearCoat")), f = a("utils/color"), g = a("nanogl-pbr/depthpass"), h = a("nanogl-pbr/lib/input");
        d.prototype = {
            getLoadables: function() {
                return []
            }
        }, b.exports = d
    }, {
        "gl/ClearCoat": 67,
        "nanogl-pbr/depthpass": 129,
        "nanogl-pbr/lib/input": 141,
        "nanogl-pbr/standard": 148,
        "utils/color": 89
    }
    ],
    26: [function(a, b, c) {
        function d(a) {
            this.lib = a.texs, this.gl = a.gl, this.texDefs = [this.makeTex("Tire_COLOR", h.asset_url("qashqai/Tire_COLOR.jpg")), this.makeTex("Tire_GLOSS", h.asset_url("qashqai/Tire_GLOSS.jpg")), this.makeTex("Tire_NRM", h.asset_url("qashqai/Tire_NRM.jpg")), this.makeTex("car_OCCLU", h.asset_url("qashqai/car_OCCLU.jpg")), this.makeTex("inside_COLOR", h.asset_url("qashqai/inside_COLOR.jpg")), this.makeTex("ground_OCCLU", h.asset_url("qashqai/ground_OCCLU.jpg"))]
        }
        function e(a, b) {
            this.tex = a, this.url = b
        }
        var f = a("nanogl/texture"), g = a("nanogl-texture-loader"), h = (a("when"), a("config"));
        d.prototype = {
            makeTex: function(a, b, c) {
                var d = new f(this.gl, c);
                this.lib.register(d, a);
                var g = new e(d, b);
                return g
            },
            getLoadables: function() {
                for (var a = [], b = 0; b < this.texDefs.length; b++) {
                    var c = this.texDefs[b];
                    a.push(g.load(c.tex, c.url))
                }
            }
        }, b.exports = d
    }, {
        config: 37,
        "nanogl-texture-loader": 154,
        "nanogl/texture": 161,
        when: 184
    }
    ],
    27: [function(a, b, c) {
        function d(a) {
            this.scene = a, this.mouse = g.create(), this.pos = g.create(), this.dir = g.create(), this.mouse[2] = 1
        }
        var e = a("assets/mouse"), f = a("gl-matrix"), g = f.vec3, h = f.mat3, i = f.mat4, j = (g.create(), i.create()), k = h.create();
        d.prototype = {
            update: function(a) {
                this.mouse[0] = a[0], this.mouse[1] = a[1];
                var b = this.scene.camera;
                g.copy(this.pos, b._wposition), i.invert(j, b._viewProj), g.transformMat4(this.dir, this.mouse, j), i.invert(j, this.scene.root._wmatrix), h.fromMat4(k, j), g.transformMat3(this.dir, this.dir, k), g.transformMat4(this.pos, this.pos, j), g.subtract(this.dir, this.dir, this.pos), g.normalize(this.dir, this.dir)
            },
            preRender: function() {
                this.update(e.coords)
            }
        }, b.exports = d
    }, {
        "assets/mouse": 19,
        "gl-matrix": 113
    }
    ],
    28: [function(a, b, c) {
        var d = [2.452853938434205, 2.231257937709207, 2.0938126848500316, - .49156336152791924, - .5395389531377579, - .5736581959192589, - .5372924326471662, - .551055136056243, - .5384778635528267, - 1.702841354710097, - 1.734501259667016, - 1.8152963811772782, .8810290828842681, .8830698387886825, .891699365039377, .3197886657008606, .30871142836431725, .2875231378813541, .20121792833165145, .13544121340600188, .05155210902058943, .7699910678922712, .7901124858241483, .7570636897611162, 1.2371982887359352, 1.3388089268136696, 1.3990086497405412, - .5130828147061584, - .5703968236353495, - .671884355568453, - .45224760585413515, - .43986448463391087, - .40902156460519445, - .2231737284651144, - .23094621093515433, - .21118952666318552, .3608950529875945, .34371665283557024, .2902351869437798, - .8170582272472716, - .7638635398790083, - .6755861824264341, - .608639843753662, - .6181558434439796, - .5711732837977345, - .7381234146676205, - .7845994031190759, - .8493482639599257, .8655911550594895, .940242217000098, .9963903536318917, .49033443113886377, .4979047250359228, .4775648819050366, .3416620019913146, .351649228562874, .3512723362646781, .2766749107083699, .23927322275217136, .201485905101989, - .2039902381259673, - .21571973939403394, - .2228874264813589, - .10265944191643883, - .1019528001586764, - .1085164804362137, .676250610817606, .6749473158826236, .6382610005615765, .35240880630757593, .35023036568223864, .32307076385138406, .40130334878678986, .4420043242318994, .4839858134326486];
        b.exports = d
    }, {}
    ],
    29: [function(a, b, c) {
        function d(a, b, c) {
            return 9728|+a|+b<<8|+(b && c)<<1
        }
        function e(a, b) {
            this._uid = f++, this.gl = a, this.id = this.gl.createTexture(), this.width = 0, this.height = 0, this.format = b || a.RGB, this.type = a.UNSIGNED_BYTE, a.bindTexture(g, this.id), this.setFilter(!0), this.clamp()
        }
        var f = 0, g = 34067;
        e.prototype = {
            fromImages: function(a) {
                var b = this.gl, c = this.format, d = this.type;
                this.width = a[0].width, this.height = a[0].height, b.bindTexture(g, this.id), b.texImage2D(b.TEXTURE_CUBE_MAP_POSITIVE_X, 0, c, c, d, a[0]), b.texImage2D(b.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, c, c, d, a[1]), b.texImage2D(b.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, c, c, d, a[2]), b.texImage2D(b.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, c, c, d, a[3]), b.texImage2D(b.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, c, c, d, a[4]), b.texImage2D(b.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, c, c, d, a[5])
            },
            bind: function(a) {
                var b = this.gl;
                void 0 !== a && b.activeTexture(b.TEXTURE0 + (0 | a)), b.bindTexture(g, this.id)
            },
            dispose: function() {
                this.gl.deleteTexture(this.id), this.id = null, this.gl = null
            },
            setFilter: function(a, b, c) {
                var e = this.gl, f = d(!!a, !!b, !!c);
                e.texParameteri(g, e.TEXTURE_MAG_FILTER, d(!!a, !1, !1)), e.texParameteri(g, e.TEXTURE_MIN_FILTER, f)
            },
            repeat: function() {
                this.wrap(this.gl.REPEAT)
            },
            clamp: function() {
                this.wrap(this.gl.CLAMP_TO_EDGE)
            },
            mirror: function() {
                this.wrap(this.gl.MIRRORED_REPEAT)
            },
            wrap: function(a) {
                var b = this.gl;
                b.texParameteri(g, b.TEXTURE_WRAP_S, a), b.texParameteri(g, b.TEXTURE_WRAP_T, a)
            }
        }, b.exports = e
    }, {}
    ],
    30: [function(a, b, c) {
        function d(a) {
            this.gl = a, this._lib = {}, this._list = [], this.bbc=!0, this.qDir = "hd", BrowserDetect.isDesktop || (this.qDir = "ld"), this.maxCubeSize = a.getParameter(a.MAX_CUBE_MAP_TEXTURE_SIZE), this.extAniso = a.getExtension("MOZ_EXT_texture_filter_anisotropic") || a.getExtension("WEBKIT_EXT_texture_filter_anisotropic") || a.getExtension("EXT_texture_filter_anisotropic"), this.maxAniso = this.extAniso ? a.getParameter(this.extAniso.MAX_TEXTURE_MAX_ANISOTROPY_EXT) : 0,
            this.DDSParser = new s(a), this.PVRParser = new t(a), this.KTXParser = new u(a), this.texDefs = [], this.makeTex("cut_mask", !0, !1, 0, this.bbc, "hd/common/cut_mask.jpg")
        }
        function e(a, b, c, d, e, f) {
            this.tex = a, this.url = b, this.bbc = f, this.mipmap = d, this.smooth = c, this.aniso = e
        }
        function f(a, b, c, d, e) {
            this.tex = a, this.dir = b, this.bbc = e, this.smooth = c, this.size = d
        }
        function g(a) {
            return a.bind(), a.gl.generateMipmap(a.gl.TEXTURE_2D), a
        }
        function h(a, b) {
            return p.map(b, q.loadImage).then(function(b) {
                return a.fromImages(b), a
            })
        }
        function i(a) {
            return function(b) {
                var c = a.gl;
                a.bind();
                var d = b.surfaces[0], e = b.format, f = b.width, g = b.height;
                a.width = f, a.height = g;
                for (var h = 0; h < d.length; h++) {
                    var i = d[h];
                    c.compressedTexImage2D(c.TEXTURE_2D, h, e, f, g, 0, i), f = Math.max(1, f>>1), g = Math.max(1, g>>1)
                }
                return d.length > 1 && a.setFilter(!0, !0, !0), a
            }
        }
        function j(a) {
            return [a + "/negx.jpg", a + "/negy.jpg", a + "/negz.jpg", a + "/posx.jpg", a + "/posy.jpg", a + "/posz.jpg"]
        }
        function k(a, b) {
            switch (b) {
            case 0:
                return a.TEXTURE_CUBE_MAP_POSITIVE_X;
            case 1:
                return a.TEXTURE_CUBE_MAP_POSITIVE_Y;
            case 2:
                return a.TEXTURE_CUBE_MAP_POSITIVE_Z;
            case 3:
                return a.TEXTURE_CUBE_MAP_NEGATIVE_X;
            case 4:
                return a.TEXTURE_CUBE_MAP_NEGATIVE_Y;
            case 5:
                return a.TEXTURE_CUBE_MAP_NEGATIVE_Z;
            default:
                throw new Error("surface overflow")
            }
        }
        function l(a) {
            return function(b) {
                var c = a.gl;
                a.bind();
                for (var d = 0; d < b.surfaces.length; d++) {
                    var e = b.surfaces[d], f = b.format, g = b.width, h = b.height;
                    a.width = g, a.height = h;
                    for (var i = 0; i < e.length; i++) {
                        var j = e[i];
                        c.compressedTexImage2D(k(c, d), i, f, g, h, 0, j), g = Math.max(1, g>>1), h = Math.max(1, h>>1)
                    }
                }
                return a
            }
        }
        var m = a("nanogl/texture"), n = a("assets/texture-cube"), o = a("nanogl-texture-loader"), p = a("when"), q = a("utils/net"), r = a("config"), s = a("./dds-parser"), t = a("./pvr-parser"), u = a("./ktx-parser");
        d.prototype = {
            register: function(a, b) {
                void 0 === this._lib[b] && (this._lib[b] = a, this._list.push(a))
            },
            getTexture: function(a) {
                var b = this._lib[a];
                if (void 0 === b)
                    throw new Error('texture "' + a + '" not found.');
                return b
            },
            makeTex: function(a, b, c, d, f, g, h) {
                var i = new m(this.gl, h);
                this.register(i, a);
                var j = new e(i, g, b, c, d, f);
                return this.texDefs.push(j), j
            },
            makeCube: function(a, b, c, d, e, g, h) {
                var i = new n(this.gl, h);
                this.register(i, a);
                var j = new f(i, g, b, d, e);
                return this.texDefs.push(j), j
            },
            getLoadables: function() {
                for (var a = [], b = 0; b < this.texDefs.length; b++) {
                    var c = this.texDefs[b].load(this);
                    a.push(c)
                }
                return a
            },
            loadTex: function(a, b, c, d, e, f) {
                if (a.bind(), a.setFilter(d, c, !1), f = r.asset_url(f), e = Math.min(this.maxAniso, e), e > 0 && a.gl.texParameterf(a.gl.TEXTURE_2D, this.extAniso.TEXTURE_MAX_ANISOTROPY_EXT, e), this.DDSParser.isSupported() && b)
                    return this.loadDDS(a, f + ".dds").then(i(a));
                if (this.PVRParser.isSupported() && b)
                    return this.loadPVR(a, f + ".pvr").then(i(a));
                if (this.KTXParser.isSupported() && b)
                    return this.loadKTX(a, f + ".ktx").then(i(a));
                var h = o.load(a, f);
                return c && (h = h.then(g)), h
            },
            loadDDS: function(a, b) {
                return q.loadBytes(b).then(this.DDSParser.parse)
            },
            loadPVR: function(a, b) {
                return q.loadBytes(b).then(this.PVRParser.parse)
            },
            loadKTX: function(a, b) {
                return q.loadBytes(b).then(this.KTXParser.parse)
            },
            loadCube: function(a, b, c, d, e) {
                return a.bind(), a.setFilter(d, !1, !1), c = r.asset_url(c), e = this.getCubeSize(e), c += "/" + e, this.DDSParser.isSupported() && b ? this.loadDDS(a, c + "/tex.dds").then(l(a)) : this.PVRParser.isSupported() && b ? this.loadPVR(a, c + "/tex.pvr").then(l(a)) : this.KTXParser.isSupported() && b ? this.loadKTX(a, c + "/tex.ktx").then(l(a)) : h(a, j(c))
            },
            getCubeSize: function(a) {
                for (; a > this.maxCubeSize;)
                    a>>=1;
                return a
            }
        }, e.prototype = {
            load: function(a) {
                return a.loadTex(this.tex, this.bbc, this.mipmap, this.smooth, this.aniso, this.url)
            }
        }, f.prototype = {
            load: function(a) {
                return a.loadCube(this.tex, this.bbc, this.dir, this.smooth, this.size)
            }
        }, b.exports = d
    }, {
        "./dds-parser": 5,
        "./ktx-parser": 16,
        "./pvr-parser": 23,
        "assets/texture-cube": 29,
        config: 37,
        "nanogl-texture-loader": 154,
        "nanogl/texture": 161,
        "utils/net": 91,
        when: 184
    }
    ],
    31: [function(a, b, c) {
        function d(a) {
            this.scene = a, this._current = null
        }
        d.prototype = {
            setControler: function(a) {
                this._current && this._current.stop(), this._current = a, a.start(this.scene.camera)
            },
            update: function(a) {
                this._current && this._current.update(a)
            }
        }, b.exports = d
    }, {}
    ],
    32: [function(a, b, c) {
        function d(a, b, c) {
            c[0] = 2 * a.clientX / (b.width / window.devicePixelRatio) - 1, c[1] =- (2 * a.clientY / (b.height / window.devicePixelRatio) - 1)
        }
        function e(a) {
            this.el = a, this.mouse = k.fromValues(0, 0, 1), this.cam = null, this.orbitRadius =- 30, this.mode =- 1, this.onMouseMove = this._onMouseMove.bind(this)
        }
        function f() {}
        function g() {
            this.initialX = k.create(), this.initialR = l.create(), this.initialP = k.create(), this.startMouse = k.create(), this.focus = k.create()
        }
        function h() {
            this.initialX = k.create(), this.initialY = l.create(), this.initialP = k.create(), this.startMouse = k.create(), this.focus = k.create()
        }
        function i() {
            this.initialZ = k.create(), this.initialP = k.create(), this.startMouse = k.create(), this.focus = k.create()
        }
        var j = a("gl-matrix"), k = j.vec3, l = j.quat, m = j.mat4, n = l.create(), o = l.create(), p = l.create(), q = k.create(), r = k.create(), s = (m.create(), m.create()), t = 0, u = 1, v = 2, w = 4;
        e.prototype = {
            start: function(a) {
                this.cam = a, this.el.addEventListener("mousemove", this.onMouseMove), this.mode =- 1, this.setMode(t)
            },
            stop: function(a) {
                this.cam = null, this.el.removeEventListener("mousemove", this.onMouseMove)
            },
            update: function(a) {},
            setMode: function(a) {
                if (this.mode !== a) {
                    switch (this.mode = a, a) {
                    case t:
                        this.action = new f;
                        break;
                    case u:
                        this.action = new g;
                        break;
                    case v:
                        this.action = new h;
                        break;
                    case w:
                        this.action = new i
                    }
                    this.unproject(q), this.action.start(this.cam, q, this.mouse)
                }
            },
            unproject: function(a) {
                this.cam.updateMatrix(), m.invert(s, this.cam.lens._proj), k.transformMat4(q, this.mouse, s), k.scale(q, q, this.orbitRadius / q[2]), k.transformMat4(a, q, this.cam._matrix)
            },
            _onMouseMove: function(a) {
                var b = this._getModeForEvt(a);
                this.setMode(b), d(a, this.el, this.mouse), this.action.update(this.mouse)
            },
            _getModeForEvt: function(a) {
                return 2 !== a.which ? t : a.altKey ? a.ctrlKey ? w : u : v
            }
        }, f.prototype = {
            start: function() {},
            update: function() {}
        }, g.prototype = {
            start: function(a, b, c) {
                this.cam = a, k.copy(this.initialX, this.cam._matrix), k.copy(this.startMouse, c), l.copy(this.initialR, a.rotation), k.subtract(this.initialP, a.position, b), k.copy(this.focus, b)
            },
            update: function(a) {
                k.subtract(q, a, this.startMouse), l.setAxisAngle(p, this.initialX, 5 * q[1]), l.rotateY(o, n, 5*-q[0]), l.multiply(o, o, p), l.multiply(this.cam.rotation, o, this.initialR), k.transformQuat(q, this.initialP, o), k.add(this.cam.position, this.focus, q), this.cam.invalidate()
            }
        }, h.prototype = {
            start: function(a, b, c) {
                this.cam = a, k.copy(this.initialX, this.cam._matrix), k.copy(this.initialP, this.cam.position), this.initialY[0] = this.cam._matrix[4], this.initialY[1] = this.cam._matrix[5], this.initialY[2] = this.cam._matrix[6], k.copy(this.startMouse, c), k.copy(this.focus, b)
            },
            update: function(a) {
                k.subtract(q, a, this.startMouse), k.scale(r, this.initialX, 20*-q[0]), k.scaleAndAdd(r, r, this.initialY, 20*-q[1]), k.add(this.cam.position, this.initialP, r), this.cam.invalidate()
            }
        }, i.prototype = {
            start: function(a, b, c) {
                this.cam = a, k.copy(this.initialP, this.cam.position), k.subtract(this.initialZ, this.cam.position, b), k.copy(this.startMouse, c), k.copy(this.focus, b)
            },
            update: function(a) {
                k.subtract(q, a, this.startMouse), k.scale(q, this.initialZ, 5 * q[1]), k.add(this.cam.position, this.initialP, q), this.cam.invalidate()
            }
        }, b.exports = e
    }, {
        "gl-matrix": 113
    }
    ],
    33: [function(a, b, c) {
        function d(a) {
            for (; a[0] < 0;)
                a[0] += z;
            for (; a[0] > z;)
                a[0] -= z
        }
        function e(a, b, c) {
            c[0] = 2 * a.clientX / (b.width / window.devicePixelRatio) - 1, c[1] =- (2 * a.clientY / (b.height / window.devicePixelRatio) - 1)
        }
        function f(a, b, c) {
            return a * (1 - c) + b * c
        }
        function g(a) {
            return Math.max(0, Math.min(1, a))
        }
        function h(a) {
            this.mouseMove = this._mouseMove.bind(this), this.touchMove = this._touchMove.bind(this), this.touchUp = this._touchUp.bind(this), this.pinchStart = this._pinchStart.bind(this), this.pinch = this._pinch.bind(this), this.node = null, this.el = a, this.fov = 30, this.vrFov = 68, this.carRoll=!1, this.rotations = o.fromValues( - 9.996874809265137, - .2494507133960724), this.srotations = o.create(), o.copy(this.srotations, this.rotations), this.center = n.create(), this.center[1] = 8.5, this.center_elliptic = 1.2, this.elliptic = 1, this.sensitivity = 2, this.orbitNormal = p.create(), p.rotateZ(this.orbitNormal, this.orbitNormal, .1), this.orbitRadius = 60, this.sorbitRadius = 60, this._orbitMatrix = q.create(), this._isDragging=!1, this._isOrbitting=!1, this._changing=!1, this._downPos = o.create(), this._currPos = o.create(), this._downRot = o.create(), this.updateOrbitMatrix(), this.ivrrotations = o.fromValues( - 11.1742, - .3725), this.vrrotations = o.fromValues( - 11.1742, - .3725), this.vrsrotations = o.create(), this.vrCenter = n.create(), this._downVrRot = o.create(), this._isIdle=!0, this._idleTime = 0, this._idleRecenter = 0, this._inside = 0, m.add(this, "goInside"), m.add(this, "goOutside"), m.add(this, "logConfig"), m.add(this, "fov", 10, 100), m.add(this, "vrFov", 10, 100)
        }
        var i = a("gsap/src/uncompressed/TweenLite"), j = a("gl-matrix"), k = a("utils/ease"), l = a("assets/mouse"), m = a("dev/gui"), n = j.vec3, o = j.vec2, p = j.quat, q = j.mat4, r = n.create(), s = o.create(), t = p.create(), u = p.create(), v = n.create(), w = n.create(), x = 3, y = 1.4, z = 2 * Math.PI;
        h.prototype = {
            setInitialState: function(a) {
                this.rotations = o.fromValues(a[0], a[1]), o.copy(this.srotations, this.rotations), this.ivrrotations = o.fromValues(a[2], a[3]), o.copy(this.vrrotations, this.ivrrotations), o.copy(this.vrsrotations, this.ivrrotations), this.vrCenter[0] = a[4], this.vrCenter[1] = a[5], this.vrCenter[2] = a[6]
            },
            start: function(a) {
                this.node = a, this.el.addEventListener("mousemove", this.mouseMove), this.el.addEventListener("touchmove", this.touchMove), this.el.addEventListener("touchend", this.touchUp), l.on("pinchstart", this.pinchStart), l.on("pinch", this.pinch)
            },
            stop: function() {
                this.el.removeEventListener("mousemove", this.mouseMove), this.el.removeEventListener("touchmove", this.touchMove), this.el.removeEventListener("touchend", this.touchUp), l.off("pinchstart", this.pinchStart), l.off("pinch", this.pinch)
            },
            getInsideProgress: function() {
                return this._inside
            },
            goInside: function() {
                this._inside < 1 && i.to(this, y, {
                    _inside: 1,
                    ease: k.Linear
                })
            },
            goOutside: function() {
                this._inside > 0 && i.to(this, y, {
                    _inside: 0,
                    ease: k.Linear
                })
            },
            logConfig: function() {
                console.log(this.rotations, this.vrrotations)
            },
            _pinchStart: function() {
                this.sorbitRadius = this.orbitRadius
            },
            _pinch: function(a) {
                a = .3 * (a - 1) + 1, this.orbitRadius = this.sorbitRadius / a, this.orbitRadius = Math.min(80, Math.max(50, this.orbitRadius))
            },
            _touchMove: function(a) {
                var b = this._makeMouseEvent(a);
                this._mouseMove(b)
            },
            _touchUp: function(a) {
                this._mouseUp()
            },
            _makeMouseEvent: function(a) {
                return {
                    buttons: 1,
                    clientX: a.touches[0].clientX,
                    clientY: 0
                }
            },
            _mouseMove: function(a) {
                var b;
                b = 1 === a.buttons || void 0 !== a.touches, this._isDragging !== b && (this._changing=!0, b ? this._mouseDown() : this._mouseUp()), this._isDragging && (this._inside < 1 && this._isOrbitting && this.orbitMove(a), this._inside > 0 && this.vrMove(a)), this._changing=!1
            },
            _mouseDown: function() {
                this._isDragging=!0, this._isOrbitting = this.carRoll
            },
            _mouseUp: function() {
                this._isDragging=!1, this._isOrbitting=!1
            },
            resetIdle: function() {
                this._idleTime = 0, this._idleRecenter = 0, this._isIdle=!1
            },
            orbitMove: function(a) {
                this._changing && (e(a, this.el, this._downPos), o.copy(this._downRot, this.rotations)), e(a, this.el, this._currPos), o.sub(s, this._currPos, this._downPos), this._isIdle=!1, this._idleTime = 0, this._idleRecenter = 0, o.scaleAndAdd(this.rotations, this._downRot, s, this.sensitivity * (1 - this._inside)), this.rotations[1] = Math.max( - .7, Math.min( - .05, this.rotations[1]))
            },
            vrMove: function(a) {
                this._changing && (e(a, this.el, this._downPos), o.copy(this._downVrRot, this.vrrotations)), e(a, this.el, this._currPos), o.sub(s, this._currPos, this._downPos), o.scaleAndAdd(this.vrrotations, this._downVrRot, s, 1 * this._inside), this.vrrotations[1] = Math.max( - 1, Math.min(1, this.vrrotations[1]))
            },
            updateOrbitMatrix: function() {
                q.fromQuat(this._orbitMatrix, this.orbitNormal);
                var a = this.orbitRadius * this.elliptic, b = this.orbitRadius;
                this._ellipticOffset = Math.sqrt(a * a - b * b)
            },
            update: function(a) {
                0 === this._inside ? (o.copy(this.vrrotations, this.ivrrotations), o.copy(this.vrsrotations, this.ivrrotations), this.updateOrbit(a)) : 1 === this._inside ? this.updateInside(a) : this.updateBlended(a);
                var b = k.easeInQuad(this._inside), c = b * this.vrFov + (1 - b) * this.fov;
                this.node.lens.setAutoFov(c / 180 * Math.PI)
            },
            updateOrbit: function(a) {
                if (this._idleTime += a, this._idleTime > x && 0 === this._inside) {
                    this._idleRecenter += 2 * a, this._idleRecenter = Math.min(1, this._idleRecenter);
                    var b = k.easeInQuad(this._idleRecenter);
                    this.rotations[0] += a*-.12 * b, this.rotations[1] += ( - .1 - this.rotations[1]) * a * b * .1
                }
                o.sub(s, this.rotations, this.srotations);
                var c = Math.min(1, 15 * a);
                o.scaleAndAdd(this.srotations, this.srotations, s, c), o.copy(s, this.srotations), d(s);
                var e = k.easeInOutQuad(this._inside), h = 1.402, i = s[0] - h;
                i<-Math.PI ? s[0] += z : i > Math.PI && (s[0] -= z), s[0] = f(s[0], h, e);
                var j = Math.cos( - s[1]);
                r[0] = j * this.orbitRadius * Math.cos(s[0]) * this.elliptic, r[2] = j * this.orbitRadius * Math.sin(s[0]), r[1] = this.orbitRadius * Math.sin( - s[1]), n.transformMat4(r, r, this._orbitMatrix), n.add(this.node.position, r, this.center);
                var l = 1.5;
                r[0] = j * l * Math.cos(s[0]) * 8, r[2] = j * l * Math.sin(s[0]);
                var m = k.easeInQuad(g((this.srotations[1] + .3) / .25));
                r[1] = this.center[1] + 1.2 * m, this.node.lookAt(r)
            },
            updateInside: function(a) {
                p.identity(this.node.rotation), o.sub(s, this.vrrotations, this.vrsrotations);
                var b = Math.min(1, 15 * a);
                o.scaleAndAdd(this.vrsrotations, this.vrsrotations, s, b), this.node.rotateY(this.vrsrotations[0]), this.node.rotateX( - this.vrsrotations[1]), this.node.position.set(this.vrCenter)
            },
            updateBlended: function(a) {
                this.updateOrbit(a), p.copy(t, this.node.rotation), p.copy(v, this.node.position), this.updateInside(a), p.copy(u, this.node.rotation), p.copy(w, this.node.position);
                var b = k.easeInQuad(this._inside);
                b = k.easeInOutQuad(b), p.slerp(this.node.rotation, t, u, b);
                var c = this._inside;
                c = k.easeInOutQuad(c), n.lerp(this.node.position, v, w, c), this.node.invalidate()
            }
        }, b.exports = h
    }, {
        "assets/mouse": 19,
        "dev/gui": 39,
        "gl-matrix": 113,
        "gsap/src/uncompressed/TweenLite": 123,
        "utils/ease": 90
    }
    ],
    34: [function(a, b, c) {
        function d() {
            window.innerWidth < l ? h.style.backgroundImage = "url(" + j + ")" : h.style.backgroundImage = "url(" + i + ")"
        }
        function e() {
            h = document.querySelector(".fallback-layer"), h.classList.remove("hide"), i = k.asset_url(window._svConfig.car_id + "_fallback-desktop.jpg"), j = k.asset_url(window._svConfig.car_id + "_fallback-mobile.jpg"), window.addEventListener("resize", d), d()
        }
        function f() {
            var a = parseFloat(g.device.getAndroidVersion());
            if (g.islteIE10 || 4.4 > a && NaN != a)
                return e(), !1;
            var b, c = document.createElement("canvas");
            try {
                b = c.getContext("webgl") || c.getContext("experimental-webgl") || c.getContext("webgl")
            } catch (d) {
                console.log(d), b = null
            }
            return null != b?!0 : (e(), !1)
        }
        var g = a("utils/BrowserDetect");
        "document"in self && ("classList"in document.createElement("_") && (!document.createElementNS || "classList"in document.createElementNS("http://www.w3.org/2000/svg", "g"))?!function() {
            "use strict";
            var a = document.createElement("_");
            if (a.classList.add("c1", "c2"), !a.classList.contains("c2")) {
                var b = function(a) {
                    var b = DOMTokenList.prototype[a];
                    DOMTokenList.prototype[a] = function(a) {
                        var c, d = arguments.length;
                        for (c = 0; d > c; c++)
                            a = arguments[c], b.call(this, a)
                    }
                };
                b("add"), b("remove")
            }
            if (a.classList.toggle("c3", !1), a.classList.contains("c3")) {
                var c = DOMTokenList.prototype.toggle;
                DOMTokenList.prototype.toggle = function(a, b) {
                    return 1 in arguments&&!this.contains(a)==!b ? b : c.call(this, a)
                }
            }
            a = null
        }() : !function(a) {
            "use strict";
            if ("Element"in a) {
                var b = "classList", c = "prototype", d = a.Element[c], e = Object, f = String[c].trim || function() {
                    return this.replace(/^\s+|\s+$/g, "")
                }, g = Array[c].indexOf || function(a) {
                    for (var b = 0, c = this.length; c > b; b++)
                        if (b in this && this[b] === a)
                            return b;
                    return - 1
                }, h = function(a, b) {
                    this.name = a, this.code = DOMException[a], this.message = b
                }, i = function(a, b) {
                    if ("" === b)
                        throw new h("SYNTAX_ERR", "An invalid or illegal string was specified");
                    if (/\s/.test(b))
                        throw new h("INVALID_CHARACTER_ERR", "String contains an invalid character");
                    return g.call(a, b)
                }, j = function(a) {
                    for (var b = f.call(a.getAttribute("class") || ""), c = b ? b.split(/\s+/) : [], d = 0, e = c.length; e > d; d++)
                        this.push(c[d]);
                    this._updateClassName = function() {
                        a.setAttribute("class", this.toString())
                    }
                }, k = j[c] = [], l = function() {
                    return new j(this)
                };
                if (h[c] = Error[c], k.item = function(a) {
                    return this[a] || null
                }, k.contains = function(a) {
                    return a += "", - 1 !== i(this, a)
                }, k.add = function() {
                    var a, b = arguments, c = 0, d = b.length, e=!1;
                    do 
                        a = b[c] + "", - 1 === i(this, a) && (this.push(a), e=!0);
                    while (++c < d);
                    e && this._updateClassName()
                }, k.remove = function() {
                    var a, b, c = arguments, d = 0, e = c.length, f=!1;
                    do 
                        for (a = c[d] + "", b = i(this, a); - 1 !== b;)
                            this.splice(b, 1), f=!0, b = i(this, a);
                    while (++d < e);
                    f && this._updateClassName()
                }, k.toggle = function(a, b) {
                    a += "";
                    var c = this.contains(a), d = c ? b!==!0 && "remove": b!==!1 && "add";
                    return d && this[d](a), b===!0 || b===!1 ? b : !c
                }, k.toString = function() {
                    return this.join(" ")
                }, e.defineProperty) {
                    var m = {
                        get: l,
                        enumerable: !0,
                        configurable: !0
                    };
                    try {
                        e.defineProperty(d, b, m)
                    } catch (n) {
                        - 2146823252 === n.number && (m.enumerable=!1, e.defineProperty(d, b, m))
                    }
                } else 
                    e[c].__defineGetter__ && d.__defineGetter__(b, l)
            }
        }(self));
        var h, i, j, k = a("config"), l = 630;
        b.exports = {
            testWebgl: f
        }
    }, {
        config: 37,
        "utils/BrowserDetect": 88
    }
    ],
    35: [function(a, b, c) {
        var d = 40, e = 30, f = 435, g = 500, h = 21 / 9, i = 4 / 3, j = function(a) {
            this.renderer = a ? a : null, this.onResize = this.onResize.bind(this), window.addEventListener("resize", this.onResize), window.setInterval(this.onResize, g)
        };
        j.prototype = {
            setRenderer: function(a) {
                this.renderer = a
            },
            onResize: function() {
                var a = document.body.clientWidth, b = Math.round(1 * a / h);
                f >= a ? (b = Math.round(1 * a / i), this.renderer && this.renderer.getOrbitFov() != d && this.renderer.setOrbitFov(d)) : this.renderer && this.renderer.getOrbitFov() != e && this.renderer.setOrbitFov(e);
                var c = {
                    type: "resize",
                    height: b
                };
                if (window.parent && "localhost" !== window.location.host)
                    try {
                        window.parent.postMessage(JSON.stringify(c), document.referrer)
                } catch (g) {}
            }
        }, b.exports = j
    }, {}
    ],
    36: [function(a, b, c) {
        var d = a("gsap/src/uncompressed/TweenLite"), e = a("config"), f = function() {
            this.el = document.querySelector(".start-layer"), this.domStartBtn = this.el.querySelector(".start-layer__button");
            var a = e.asset_url(window._svConfig.car_id + "_fallback-mobile.jpg");
            this.el.style.backgroundImage = "url(" + a + ")", this.onStartClick = this.onStartClick.bind(this), this.onStartCallback = null, this.bindEvents()
        };
        f.prototype = {
            bindEvents: function() {
                this.domStartBtn.addEventListener("click", this.onStartClick)
            },
            setOnStartCallback: function(a) {
                this.onStartCallback = a
            },
            onStartClick: function(a) {
                a.preventDefault(), this.hide(), this.onStartCallback && this.onStartCallback()
            },
            show: function() {
                this.el.classList.remove("hide")
            },
            hide: function() {
                var a = {
                    o: 1
                };
                d.fromTo(a, .8, {
                    o: 1
                }, {
                    o: 0,
                    onUpdate: function() {
                        this.el.style.opacity = a.o
                    }.bind(this),
                    onComplete: function() {
                        this.el.style.opacity = a.o, this.el.classList.add("hide")
                    }.bind(this)
                })
            }
        }, b.exports = f
    }, {
        config: 37,
        "gsap/src/uncompressed/TweenLite": 123
    }
    ],
    37: [function(a, b, c) {
        var d = window._svConfig.base_dir + "assets";
        b.exports = {
            asset_url: function(a) {
                return d + "/" + a
            }
        }
    }, {}
    ],
    38: [function(a, b, c) {
        var d = a("dat-gui"), e=!0, f = new d.GUI, g = window.location.hostname;
        (e || null == g.match("localhost|10.0")) && f.domElement.parentNode.removeChild(f.domElement), b.exports = f
    }, {
        "dat-gui": 96
    }
    ],
    39: [function(a, b, c) {
        var d = a("dat-gui"), e=!0, f = new d.GUI, g = window.location.hostname;
        (e || null == g.match("localhost|10.0")) && f.domElement.parentNode.removeChild(f.domElement), b.exports = f
    }, {
        "dat-gui": 96
    }
    ],
    40: [function(a, b, c) {
        function d() {
            for (var a = 0; a < t.__controllers.length; a++)
                t.__controllers[a].__onChange = null, t.remove(t.__controllers[a]);
            for (var a = 0; a < t.__folders.length; a++)
                t.remove(t.__folders[a]);
            t.__controllers = [], t.__folders = []
        }
        function e() {
            d(), u && g(), v && h()
        }
        function f(a) {
            v = u.materials[a], e()
        }
        function g() {
            var a = {};
            for (var b in u.materials)
                a[b] = b;
            t.add(w, "material", a).onChange(f)
        }
        function h() {
            var a = v;
            k(a, "albedo"), k(a, "specular"), k(a, "fresnel"), l(a, "gloss", !0), m(a, "clearcoat", !0), m(a, "cavityStr", !0), j(a, "perVertexIrrad"), j(a, "conserveEnergy")
        }
        function i(a) {
            u = a, e()
        }
        function j(a, b) {
            var c = a[b];
            if (void 0 !== c) {
                var d = {
                    v: c._val
                };
                t.add(d, "v").name(b).onChange(function(a) {
                    c.set(a)
                })
            }
        }
        function k(a, b) {
            var c = a[b];
            void 0 !== c && c instanceof s.Uniform && n(b, c)
        }
        function l(a, b, c) {
            var d = a[b];
            void 0 !== d && d instanceof s.Uniform && q(b, d, c)
        }
        function m(a, b, c) {
            var d = a[b];
            void 0 !== d && d instanceof s.Uniform && o(b, d, c)
        }
        function n(a, b) {
            var c = {};
            c[a] = [255 * b._value[0], 255 * b._value[1], 255 * b._value[2]], t.addColor(c, a).onChange(function(a) {
                b.set(a[0] / 255, a[1] / 255, a[2] / 255)
            })
        }
        function o(a, b, c) {
            var d = {};
            d[a + ".x"] = b._value[0], d[a + ".y"] = b._value[1];
            var e = function(c) {
                b.set(d[a + ".x"], d[a + ".y"])
            };
            p(d, a + ".x", c).onChange(e), p(d, a + ".y", c).onChange(e)
        }
        function p(a, b, c) {
            var d;
            return d = c ? t.add(a, b, 0, 1) : t.add(a, b)
        }
        function q(a, b, c) {
            var d = {};
            d[a] = b._value[0];
            var e;
            e = c ? t.add(d, a, 0, 1) : t.add(d, a), e.onChange(function(a) {
                b.set(a)
            })
        }
        var r = a("./gui"), s = a("nanogl-pbr/lib/input"), t = r.addFolder("materials"), u = null, v = null, w = {
            material: null
        };
        b.exports = {
            registerMaterials: i
        }
    }, {
        "./gui": 39,
        "nanogl-pbr/lib/input": 141
    }
    ],
    41: [function(a, b, c) {
        function d() {
            g = 0
        }
        function e() {
            g++
        }
        function f() {
            return g
        }
        var g = 0;
        b.exports = {
            reset: d,
            drawCall: e,
            getDrawCalls: f
        }
    }, {}
    ],
    42: [function(a, b, c) {
        var d = a("gsap/src/uncompressed/TweenLite"), e = a("dev/gui"), f = a("nanogl-pbr/lib/flag"), g = a("when"), h = a("gl-matrix").mat4, i = h.create(), j = function() {
            this.maskTexture = null, this.cut = 0, this.x =- 25, this.offsetWhite = .1, this.burnColor = 4.8, this.texMapX = 26, this.texMapY = 31, this.range = 50, this.strength = 1.6, this.offset =- 7, this.slope = .23, this.rootNode = null, this.playing=!1, this.isReaveling = new f("isRevealing", !0), this._invRootWorld = h.create()
        };
        j.prototype = {
            setMaskTexture: function(a) {
                this.maskTexture = a
            },
            startReveal: function() {
                var a = g.defer();
                return this.playing=!0, this.isReaveling.set(!0), this.cut = 1e-4, d.fromTo(this, 2.3, {
                    cut: 1e-4
                }, {
                    delay: .2,
                    cut: 1,
                    ease: Power2.easeOut,
                    onComplete: function() {
                        this.playing=!1, a.resolve(!0)
                    }.bind(this)
                }), a.promise
            },
            setRootNode: function(a) {
                this.rootNode = a
            },
            setCut: function(a) {
                this.cut = a
            },
            getDisplacementX: function() {
                return this.cut * this.range - this.range / 2
            },
            setupProgram: function(a, b) {
                a.uCut && a.uCut(this.cut), a.uDisplacementX && a.uDisplacementX(this.getDisplacementX()), a.uDisplacementStrength && a.uDisplacementStrength(this.strength), a.uDisplacementOffset && a.uDisplacementOffset(this.offset), a.uDisplacementSlope && a.uDisplacementSlope(this.slope), a.uOffsetWhite && a.uOffsetWhite(this.offsetWhite), a.uRangeMapping && a.uRangeMapping(this.texMapX), a.uYMapping && a.uYMapping(this.texMapY), a.uBurnColor && a.uBurnColor(this.burnColor), a.uM && void 0 !== b && (h.multiply(i, this._invRootWorld, b), a.uM(i))
            },
            updateRootInv: function() {
                this.rootNode && h.invert(this._invRootWorld, this.rootNode._wmatrix)
            }
        };
        var k = new j, l = e.addFolder("Reveal");
        l.add(k, "cut", 0, 1), l.add(k, "offsetWhite", 0, .5), l.add(k, "burnColor", 0, 10), l.add(k, "texMapX", 0, 50), l.add(k, "texMapY", 0, 50), l.add(k, "strength", 0, 5), l.add(k, "offset", - 10, 10), l.add(k, "slope", 0, 1), b.exports = k
    }, {
        "dev/gui": 39,
        "gl-matrix": 113,
        "gsap/src/uncompressed/TweenLite": 123,
        "nanogl-pbr/lib/flag": 140,
        when: 184
    }
    ],
    43: [function(a, b, c) {
        function d(a, b, c, d, e) {
            return d + (e - d) * (a - b) / (c - b)
        }
        function e(a) {
            for (var b, c, d = a.length; 0 !== d;)
                c = Math.floor(Math.random() * d), d -= 1, b = a[d], a[d] = a[c], a[c] = b;
            return a
        }
        function f(a, b, c, d) {
            if (this.gl = a, void 0 === c)
                var c = {};
            var a = this.gl;
            if (c.baseDuration || (c.baseDuration = s, c.baseDuration += Math.random() * c.baseDuration / 2), this.length = c.length ? c.length : null, this._M4 = k.create(), this.perturbDisplacement = [], this.perturbDisplacement[0] = c.perturb ? c.perturb[0] : 0, this.perturbDisplacement[1] = c.perturb ? c.perturb[1] : 0, this.perturbDisplacement[2] = 0, this.pixelRatio = window.devicePixelRatio, this.inverted = c.inverted?-1 : 1, this.isPlainColor = c.isPlainColor ? 1 : 0, this.maxSize = c.size ? c.size : 3 + Math.random(), this.lineWidth = c.lineWidth ? c.lineWidth: Math.round(Math.random()) + 1, this.delay = c.delay ? c.delay: 500 * Math.random(), this.duration = c.baseDuration, this.durationOffset = c.durationOffset ? c.durationOffset: 0, this.showIndex = 0, this.startTime = Date.now(), this.globalAlpha = 1, this.rangeXY = [0, 0, 0, 0], this.vParams = new Float32Array(12), this.wheel = 0, c.wheel) {
                var e = G;
                this.plainColors = [e[0][0], e[0][1], e[0][2], e[1][0], e[1][2], e[1][2]], this.wheel = 1
            } else {
                var f = d[Math.floor(Math.random() * d.length)];
                this.plainColors = [f[0][0], f[0][1], f[0][2], f[1][0], f[1][1], f[1][2]]
            }
            this.verticesBuffer = b, this.stopping=!1, this.released=!1, this.releaseDuration = 1e3 + 1500 * Math.random(), this.showState = 0
        }
        function g(a, b) {
            for (var c = new Float32Array(4 * b.length / 3), d = 0; d < b.length / 3; d++)
                c[4 * d + 0] = b[3 * d + 0], c[4 * d + 1] = b[3 * d + 1], c[4 * d + 2] = b[3 * d + 2], c[4 * d + 3] = d / (b.length / 3);
            var e = new i(a, c);
            return e.attrib("aPosition", 3, a.FLOAT), e.attrib("aIndex", 1, a.FLOAT), e
        }
        function h(a, b) {
            j.call(this), this.colorPool = b, this.onLoaded = this._onLoaded.bind(this), this.stop = this._stop.bind(this), this.gl = a, this.cfg = a.state.config(), this.cfg.enableCullface(!1), this.cfg.enableDepthTest(!0), this.cfg.depthMask(!1), this.cfg.enableBlend(), this.cfg.blendFunc(a.SRC_ALPHA, a.ONE_MINUS_SRC_ALPHA), this.buffers = [], this.linesPerBuffers = [], this.progress = 0, this.showState = 0, this.stopped=!1, this.lines = []
        }
        var i = a("nanogl/arraybuffer"), j = (a("nanogl/indexbuffer"), a("nanogl-primitives-2d/rect"), a("nanogl-node")), k = a("gl-matrix").mat4, l = a("gl-matrix").vec3, m = (a("dev/gui-loading"), a("utils/net")), n = a("utils/ease"), o = a("utils/color"), p = a("gsap/src/uncompressed/TweenLite"), q = a("config"), r = k.create(), s = 2e3, t = 1e3, u = 400, v = 4e3, w = 800, x = .15, y = 1e3, z = .5, A = 6e3, B = 800, C = .05, D = 5e3, E = {
            loading_progress: 0
        }, F = [o.HexToVec(0, l.create()), o.HexToVec(0, l.create())], G = [o.HexToVec(16777215, l.create()), o.HexToVec(16777215, l.create())];
        f.prototype.updateLengthBasedTime = function(a, b) {
            null != this.length && 1 != this.wheel && (this.duration += v * (this.length - a) / (b - a))
        }, f.prototype.stop = function() {
            this.startStop = Date.now();
            var a = Date.now() - this.startTime;
            this.progressStop = (a + this.delay)%(this.duration + this.durationOffset) / this.duration, this.stopping=!0
        }, f.prototype.render = function(a, b, c) {
            if (!this.released) {
                var e = this.gl, f = e.programs.carLines, g = Date.now() - this.startTime, c = (g + this.delay)%(this.duration + this.durationOffset) / this.duration;
                if (this.stopping) {
                    var h = (Date.now() - this.startStop)%(this.releaseDuration + this.durationOffset) / this.releaseDuration;
                    if (1 != this.wheel) {
                        if (c = this.progressStop + (1 - this.progressStop) * n.easeOutQuad(h), c >= .97)
                            return void(this.released=!0)
                        } else if (this.globalAlpha = 1 - n.easeOutQuad(h), h >= .97)
                        return void(this.released=!0)
                    }
                k.translate(r, b, this.perturbDisplacement), a.modelViewProjectionMatrix(r, r);
                var i = this.maxSize;
                this.isPlainColor&&!this.wheel && (i*=d(E.loading_progress, 0, 1, .3, 1)), this.vParams[0] = this.globalAlpha, this.vParams[1] = this.showState, this.vParams[2] = this.showIndex, this.vParams[3] = E.loading_progress, this.vParams[4] = c, this.vParams[5] = g, this.vParams[6] = i, this.vParams[7] = this.isPlainColor, this.vParams[8] = this.rangeXY[0], this.vParams[9] = this.rangeXY[1], this.vParams[10] = this.rangeXY[2], this.vParams[11] = this.rangeXY[3], e.uniform4fv(f.uParams(), this.vParams), f.uWheelLine(this.wheel), f.uMVP(r), f.uInverted(this.inverted), e.uniform3fv(f.uPlainColors(), this.plainColors), e.lineWidth(this.lineWidth * this.pixelRatio), this.verticesBuffer.drawLineStrip()
            }
        }, h.prototype = Object.create(j.prototype), h.prototype.constructor = h, h.prototype.setProgress = function(a) {
            E.loading_progress = a
        }, h.prototype.show = function() {
            if (!this.stopped) {
                E.loading_progress = 0;
                for (var a = 0; a < this.lines.length; a++)
                    this.lines[a].globalAlpha = 1;
                p.fromTo(this, 1, {
                    showState: 0
                }, {
                    showState: 1,
                    ease: Power2.easeInOut
                });
                for (var a = 0; a < this.lines.length; a++)
                    this.lines[a].stopping=!1, this.lines[a].released=!1, this.lines[a].startTime = Date.now()
            }
        }, h.prototype._stop = function() {
            this.stopped=!0;
            for (var a = 0; a < this.lines.length; a++)
                this.lines[a].stop()
        }, h.prototype.load = function() {
            return m.loadBytes(q.asset_url(window._svConfig.car_id + "/lines.bin")).then(this.onLoaded)
        }, h.prototype._onLoaded = function(a) {
            for (var b = new Uint32Array(a), c = (new Float32Array(a), []), d = 0; d < b.length - 1;) {
                var f = 1 == b[d];
                d += 1;
                var h = b[d];
                d += 1;
                var i = new Float32Array(a, 4 * d, h);
                c.push({
                    isWheel: f,
                    position: i
                }), d += h
            }
            for (var j = null, k = null, m = null, n = null, o = null, p = null, q = 0; q < c.length; q++) {
                var a = g(this.gl, c[q].position), r = [];
                this.buffers.push(a), this.linesPerBuffers.push(r), c[q].isWheel || this.addWhiteLine(r, a);
                for (var s = c[q].position, t = 0, u = l.create(), v = 0; v < s.length / 3; v++) {
                    (null == j || j > s[3 * v + 1]) && (j = s[3 * v + 1]), (null == k || k < s[3 * v + 1]) && (k = s[3 * v + 1]), (null == m || m > s[3 * v]) && (m = s[3 * v]), (null == n || n < s[3 * v]) && (n = s[3 * v]);
                    var w = l.create(), x = l.create();
                    w[0] = s[3 * v], w[1] = s[3 * v + 1], w[2] = s[3 * v + 2], s[3 * v + 5] && (x[0] = s[3 * v + 3], x[1] = s[3 * v + 4], x[2] = s[3 * v + 5], l.sub(u, x, w), t += l.length(u))
                }
                if (t > 6) {
                    var y = Math.random();
                    (!c[q].isWheel || c[q].isWheel && .4 > y) && (this.addRedLine(r, a, t, c[q].isWheel), this.addRedLine(r, a, t, c[q].isWheel), .5 > y && this.addRedLine(r, a, t, c[q].isWheel), (null == o || t > o) && (o = t), (null == p || p > t) && (p = t))
                }
                c[q].isWheel && this.addWheelLine(r, a), this.lines = this.lines.concat(r)
            }
            var z = this.lines.filter(function(a) {
                return a.updateLengthBasedTime(p, o), a.rangeXY = [m, n, j, k], 1 == a.isPlainColor && 0 == a.wheel
            });
            e(z);
            for (var A = z.length, B = F, q = z.length - 1; q >= 0; q--) {
                var C = q / A;
                C > .5 && Math.random() > .7 && (z[q].plainColors = [B[0][0], B[0][1], B[0][2], B[1][0], B[1][1], B[1][2]]), z[q].showIndex = C
            }
        }, h.prototype.addWhiteLine = function(a, b) {
            var c = this.gl, d = Math.random() * t, e = s + Math.random() * s / 2, g = {
                delay: d,
                baseDuration: e
            };
            a.push(new f(c, b, g, this.colorPool)), g.inverted=!0, a.push(new f(c, b, g, this.colorPool))
        }, h.prototype.addRedLine = function(a, b, c, d) {
            var e = this.gl, g = Math.random() * y, h = w * Math.random(), i = u, j = 1 == d ? C: x, k = [];
            k[0] = Math.random() * z * 2 - z, k[1] = Math.random() * z * 2 - z;
            var l = {
                isPlainColor: !0,
                size: j,
                baseDuration: i,
                lineWidth: 1 + Math.round(2 * Math.random()),
                delay: g,
                durationOffset: h,
                length: c,
                perturb: k
            };
            a.push(new f(e, b, l, this.colorPool)), l.perturb[0] = Math.random() * z * 2 - z, l.perturb[1] = Math.random() * z * 2 - z, l.delay = 3e3 * Math.random(), l.durationOffset = w * Math.random(), l.inverted=!0, a.push(new f(e, b, l, this.colorPool))
        }, h.prototype.addWheelLine = function(a, b, c) {
            var d = this.gl, e = Math.random() * D, g = B * Math.random(), h = A + 3e3 * Math.random(), i = C, j = {
                isPlainColor: !0,
                size: i,
                baseDuration: h,
                delay: e,
                durationOffset: g,
                length: c,
                wheel: !0
            };
            a.push(new f(d, b, j, this.colorPool)), j.delay = 3e3 * Math.random(), j.durationOffset = B * Math.random(), j.inverted=!0, a.push(new f(d, b, j, this.colorPool))
        }, h.prototype.render = function(a) {
            var b = this.gl, c = b.programs.carLines, d = this.lines.filter(function(b) {
                return b.pixelRatio = a.pixelRatio, 0 == b.released
            });
            if (0 != d.length) {
                this.cfg.apply(), c.use(), c.uCameraPosition(a.camera.position);
                for (var e = 0; e < this.linesPerBuffers.length; e++) {
                    var f = this.linesPerBuffers[e];
                    this.buffers[e].attribPointer(c);
                    for (var g = 0; g < f.length; g++)
                        f[g].showState = this.showState, f[g].render(a.camera, this._wmatrix, this.progress)
                    }
            }
        }, b.exports = h
    }, {
        config: 37,
        "dev/gui-loading": 38,
        "gl-matrix": 113,
        "gsap/src/uncompressed/TweenLite": 123,
        "nanogl-node": 128,
        "nanogl-primitives-2d/rect": 149,
        "nanogl/arraybuffer": 155,
        "nanogl/indexbuffer": 158,
        "utils/color": 89,
        "utils/ease": 90,
        "utils/net": 91
    }
    ],
    44: [function(a, b, c) {
        function d(a) {
            e.call(this), this.gl = a, this.geom = new f(a), this.setScale(10), this.cfg = a.state.config(), this.cfg.enableBlend(), this.cfg.blendFunc(a.SRC_ALPHA, a.ONE_MINUS_SRC_ALPHA), this.cfg.enableDepthTest(), this.cfg.depthMask(!1), this.angle = Math.PI / 6, this.opacity = 1, this.spot = new g(a), this.spot.radius = .94, this.spot.setScale(.04), this.spot.rotateZ(Math.PI / 2), this.add(this.spot)
        }
        var e = a("nanogl-node"), f = a("gl/compass-geom"), g = a("./spot"), h = a("gl-matrix").mat4.create();
        d.prototype = Object.create(e.prototype), d.prototype.constructor = d, d.prototype.render = function(a) {
            var b = this.gl, c = b.programs.uiCompass;
            a.camera.modelViewProjectionMatrix(h, this._wmatrix), c.use(), c.uMVP(h), c.uOpacity(.5 * this.opacity), c.uAngle( - this.angle), b.lineWidth(2), this.geom.setup(c), this.cfg.apply(), this.geom.render(), c = b.programs.uiCompassColor, c.use(), c.uMVP(h), c.uOpacity(.3 * this.opacity), c.uAngle( - this.angle), this.geom.renderFan(), this.spot.opacity = this.opacity, this.spot.x = .75 * Math.cos(this.angle), this.spot.z = .75 * Math.sin(this.angle), this.spot.updateWorldMatrix(), this.spot.render(a)
        }, b.exports = d
    }, {
        "./spot": 58,
        "gl-matrix": 113,
        "gl/compass-geom": 72,
        "nanogl-node": 128
    }
    ],
    45: [function(a, b, c) {
        function d(a, b, c, d, g, h, i) {
            e.call(this), this.gl = a, this.geom = new f(a, 8, b, c, d, g, h, i), this.setScale(10), this.cfg = a.state.config(), this.cfg.enableBlend(), this.cfg.blendFunc(a.SRC_ALPHA, a.ONE_MINUS_SRC_ALPHA), this.cfg.enableDepthTest(), this.cfg.depthMask(!1)
        }
        var e = a("nanogl-node"), f = a("gl/curved-grid"), g = a("gl-matrix").mat4.create();
        d.prototype = Object.create(e.prototype), d.prototype.constructor = d, d.prototype.render = function(a, b) {
            var c = this.gl, d = c.programs.uiLines;
            a.camera.modelViewProjectionMatrix(g, this._wmatrix),
            d.use(), d.uMVP(g), d.uM(this._wmatrix), d.uOpening(b), d.uOpacity(.4), c.lineWidth(2), this.geom.setup(d), this.cfg.apply(), this.geom.render()
        }, b.exports = d
    }, {
        "gl-matrix": 113,
        "gl/curved-grid": 74,
        "nanogl-node": 128
    }
    ],
    46: [function(a, b, c) {
        function d(a, b, c) {
            c[0] = 2 * a.clientX / (b.width / window.devicePixelRatio) - 1, c[1] =- (2 * a.clientY / (b.height / window.devicePixelRatio) - 1)
        }
        function e(a, b) {
            this.scene = a, this.defaultscene = b;
            var c = a.gl;
            this.gl = c, this.envTex = new j(this.gl, this.gl.RGBA), this.envTex.setFilter(!1), this.envHi = new j(this.gl, this.gl.RGBA), this.envBg = new j(this.gl, this.gl.RGB), this.ibl = new f(this.envTex, this.envHi, this.envBg), this.mouseMove = this._mouseMove.bind(this), this.touchMove = this._touchMove.bind(this), this.touchUp = this._touchUp.bind(this), this._dragging=!1, this._changing=!1, this.carRoll=!1, this._downPos = m.create(), this._currPos = m.create(), this._downRot = m.create(), this.rotations = m.fromValues( - Math.PI / 2, 0), this.rrotations = m.fromValues( - Math.PI / 2, 0), a.canvas.addEventListener("mousemove", this.mouseMove), a.canvas.addEventListener("touchmove", this.touchMove), a.canvas.addEventListener("touchend", this.touchUp), this._gui()
        }
        var f = a("gl/ibl"), g = a("nanogl-pbr/ibl"), h = a("gl-matrix"), i = a("nanogl-texture-loader"), j = a("nanogl/texture"), k = a("when"), l = (a("assets/mouse"), a("../utils/net")), m = h.vec2, n = m.create(), o = a("dev/gui"), p = a("config"), q = ["uffizi", "parking_ext", "hallstatt", "doge2", "Mans_Outside", "MonValley", "Helipad", "pisa", "test1", "test2"];
        e.prototype = {
            _mouseMove: function(a) {
                var b;
                b = 1 === a.buttons || void 0 !== a.touches, b !== this._dragging && (this._dragging=!this.carRoll && b, d(a, this.scene.canvas, this._downPos), m.copy(this._downRot, this.rrotations)), this._dragging && (this.scene.orbit.resetIdle(), d(a, this.scene.canvas, this._currPos), m.sub(n, this._currPos, this._downPos), m.scaleAndAdd(this.rrotations, this._downRot, n, 2)), this._changing=!1
            },
            _touchMove: function(a) {
                var b = this._makeMouseEvent(a);
                this._mouseMove(b)
            },
            _touchUp: function(a) {
                this._dragging=!1
            },
            _makeMouseEvent: function(a) {
                return {
                    buttons: 1,
                    clientX: a.touches[0].clientX,
                    clientY: 0
                }
            },
            _mouseDown: function() {
                this._dragging=!0
            },
            loadDefault: function() {
                return this.load(p.asset_url("envs/" + this.defaultscene))
            },
            preloadDefault: function() {
                return this.preload(p.asset_url("envs/" + this.defaultscene))
            },
            load: function(a) {
                var b = this.ibl;
                return k.all([i.load(this.envTex, a + "/env.png"), i.load(this.envHi, a + "/env_hi.png"), l.loadBytes(a + "/sh.bin").then(function(a) {
                    b.sh = g.convert(new Float32Array(a, 0, 27), 1)
                })])
            },
            preload: function(a) {
                return i.load(this.envBg, a + "/bg.jpg")
            },
            preRender: function(a) {
                m.sub(n, this.rrotations, this.rotations);
                var b = Math.min(1, 15 * a);
                m.scaleAndAdd(this.rotations, this.rotations, n, b)
            },
            _gui: function() {
                for (var a = this, b = o.addFolder("envs"), c = 0; c < q.length; c++)
                    !function(b) {
                        var c = q[b];
                        a[c] = function() {
                            this.load(p.asset_url("envs/" + c)), this.preload(p.asset_url("envs/" + c))
                        }
                    }(c), b.add(this, q[c]);
                var d = o.addFolder("ibl"), e = {
                    iblexpo: 0,
                    expo: 1,
                    gamma: 1
                }, f = this.ibl._expoInput, g = null, h = null, i = null;
                d.add(e, "iblexpo", {
                    none: 0,
                    uniform: 1,
                    constant: 2
                }).onChange(function(a) {
                    "0" === a ? (f.detach(), g = null) : "1" === a ? (g = f.attachUniform("uIblTM"), g.set(e.expo, e.gamma)) : "2" === a && (g = null, f.attachConstant([e.expo, e.gamma]))
                }), h = d.add(e, "expo", 0, 8).onChange(function(a) {
                    g && g.set(e.expo, e.gamma)
                }), i = d.add(e, "gamma", 0, 4).onChange(function(a) {
                    g && g.set(e.expo, e.gamma)
                })
            }
        }, b.exports = e
    }, {
        "../utils/net": 91,
        "assets/mouse": 19,
        config: 37,
        "dev/gui": 39,
        "gl-matrix": 113,
        "gl/ibl": 78,
        "nanogl-pbr/ibl": 135,
        "nanogl-texture-loader": 154,
        "nanogl/texture": 161,
        when: 184
    }
    ],
    47: [function(a, b, c) {
        function d(a, b, c, d) {
            e.call(this), this.gl = a, this.geom = new f(a, b, c, d), this.setScale(10), this.cfg = a.state.config(), this.cfg.enableBlend(), this.cfg.blendFunc(a.SRC_ALPHA, a.ONE_MINUS_SRC_ALPHA), this.cfg.enableDepthTest(), this.cfg.depthMask(!1)
        }
        var e = a("nanogl-node"), f = a("gl/euler-axis"), g = a("gl-matrix").mat4.create();
        d.prototype = Object.create(e.prototype), d.prototype.constructor = d, d.prototype.render = function(a, b) {
            var c = this.gl, d = c.programs.uiLines;
            a.camera.modelViewProjectionMatrix(g, this._wmatrix), d.use(), d.uMVP(g), d.uM(this._wmatrix), d.uOpening(b), d.uOpacity(.8), c.lineWidth(2), this.geom.setup(d), this.cfg.apply(), this.geom.render()
        }, b.exports = d
    }, {
        "gl-matrix": 113,
        "gl/euler-axis": 75,
        "nanogl-node": 128
    }
    ],
    48: [function(a, b, c) {
        function d(a, b, c, d) {
            e.call(this), this.gl = a, this.geom = new f(a, 8, b, c, d), this.setScale(10), this.cfg = a.state.config(), this.cfg.enableBlend(), this.cfg.blendFunc(a.SRC_ALPHA, a.ONE_MINUS_SRC_ALPHA), this.cfg.enableDepthTest(), this.cfg.depthMask(!1)
        }
        var e = a("nanogl-node"), f = a("gl/euler-grid"), g = a("gl-matrix").mat4.create();
        d.prototype = Object.create(e.prototype), d.prototype.constructor = d, d.prototype.render = function(a, b) {
            var c = this.gl, d = c.programs.uiLines;
            a.camera.modelViewProjectionMatrix(g, this._wmatrix), d.use(), d.uMVP(g), d.uM(this._wmatrix), d.uOpening(b), d.uOpacity(.4), c.lineWidth(2), this.geom.setup(d), this.cfg.apply(), this.geom.render()
        }, b.exports = d
    }, {
        "gl-matrix": 113,
        "gl/euler-grid": 76,
        "nanogl-node": 128
    }
    ],
    49: [function(a, b, c) {
        function d(a, b) {
            b=!!b, e.call(this), this.gl = a, this.strength = .1, this.cfg = a.state.config(), this.cfg.enableBlend(), b ? this.cfg.blendFunc(a.ZERO, a.ONE_MINUS_SRC_COLOR) : this.cfg.blendFunc(a.ONE, a.ONE), this.cfg.enableDepthTest(), this.cfg.depthMask(!1)
        }
        var e = a("nanogl-node"), f = a("gl-matrix"), g = (a("utils/color"), f.vec3, f.vec4, f.mat4.create());
        d.prototype = Object.create(e.prototype), d.prototype.constructor = d, d.prototype.render = function(a) {
            var b = this.gl, c = b.programs.glow, d = a.quad;
            c.use(), a.camera.modelViewProjectionMatrix(g, this._wmatrix), c.uMVP(g), c.uStrength(this.strength), d.attribPointer(c), this.cfg.apply(), d.render()
        }, b.exports = d
    }, {
        "gl-matrix": 113,
        "nanogl-node": 128,
        "utils/color": 89
    }
    ],
    50: [function(a, b, c) {
        function d(a) {
            g.call(this), this.gl = a, this.buffer = new e(a, i), this.buffer.attrib("aPosition", 3, a.FLOAT), this.buffer.attrib("aColor", 3, a.UNSIGNED_BYTE, !0), this.buffer.attrib("pad", 1, a.BYTE), this.prg = new f(a, l, m), this.cfg = a.state.config(), this.cfg.enableCullface(!1), this.cfg.enableDepthTest(), this.cfg.depthMask(!0), this.cfg.lineWidth(2)
        }
        var e = a("nanogl/arraybuffer"), f = a("nanogl/program"), g = a("nanogl-node"), h = a("gl-matrix").mat4.create(), i = new ArrayBuffer(96), j = new Float32Array(i);
        j[4] = 10, j[13] = 10, j[22] = 10;
        var k = new Uint32Array(i);
        k[3] = k[7] = 255, k[11] = k[15] = 65280, k[19] = k[23] = 16711680;
        var l = ["attribute vec3 aPosition;", "attribute vec3 aColor;", "varying vec3 vColor;", "uniform mat4 uMVP;", "void main(void){", "  gl_Position = uMVP * vec4(aPosition, 1.0);", "  vColor = aColor;", "}"].join("\n"), m = ["precision lowp float;", "varying vec3 vColor;", "void main(void){", "  gl_FragColor = vec4( vColor, 1.0 );", "}"].join("\n");
        d.prototype = Object.create(g.prototype), d.prototype.constructor = d, d.prototype.preRender = function(a) {
            this.rotateY(.01)
        }, d.prototype.render = function(a) {
            var b = this.gl;
            b.programs.guizmo;
            a.modelViewProjectionMatrix(h, this._wmatrix), this.prg.use(), this.prg.uMVP(h), this.buffer.attribPointer(this.prg), this.cfg.apply(), this.buffer.drawLines()
        }, b.exports = d
    }, {
        "gl-matrix": 113,
        "nanogl-node": 128,
        "nanogl/arraybuffer": 155,
        "nanogl/program": 160
    }
    ],
    51: [function(a, b, c) {
        function d(a, b, c) {
            return (a - b) / (c - b)
        }
        function e(a) {
            g.call(this), this.gl = a, this.geom = new f(a), this.cfg = a.state.config(), this.cfg.enableCullface(!0), this.cfg.enableBlend(), this.cfg.blendFunc(a.SRC_ALPHA, a.ONE_MINUS_SRC_ALPHA), this.tex = null, this.opacity = 0, this.time = 0, this.pressing = 0, this.spot = new j(a), this.spot.position.set([ - .5989838242530823, - .30635035037994385, - .7723962068557739]), this.spot.setScale(.1), this.spot.radius = .95, this.spot.lookAt(h.vec3.create()), this.add(this.spot), this.overrideOpacity = 0, this.lockToCam=!1, i.add(this, "overrideOpacity", 0, 1), i.add(this, "lockToCam"), i.add(this.spot, "x", - 1, 0), i.add(this.spot, "y", - 1, 0), i.add(this.spot, "z", - 1, 0)
        }
        var f = a("gl/cube-geom"), g = a("nanogl-node"), h = a("gl-matrix"), i = a("dev/gui"), j = a("./spot"), k = h.vec3, l = h.quat, m = h.mat4.create(), n = k.create(), o = l.create();
        e.prototype = Object.create(g.prototype), e.prototype.constructor = e, e.prototype.render = function(a, b) {
            this.time += b;
            var c = this.gl.programs.interior, e = a.orbit.getInsideProgress(), f = Math.max(0, d(e, .75, .85));
            if (this.overrideOpacity > 0 && (f = this.overrideOpacity), this.lockToCam && (this.position.set(a.camera.position), this.invalidate(), this.updateWorldMatrix()), this.opacity = f, 0 === f && (this.time = 0), f > 0) {
                c.use(), a.camera.modelViewProjectionMatrix(m, this._wmatrix), c.uMVP(m), c.tCube(), c.uOpacity(f), this.geom.setup(c), this.cfg.apply(), this.geom.render();
                var g = this.time%8;
                g -= 1.5;
                var h = .15, i = Math.max(0, g * (1 + h) - h), j = i > 1.3 && 1.5 > g, p = Math.min(10 * g, 10 * (3 - g));
                p = Math.min(1, Math.max(0, p)), this.spot.innerColor[3] = .2 + .6 * this.pressing + (1 - p);
                var q = j ? 1: 0;
                this.pressing += (q - this.pressing) * b * 15, l.invert(o, this.rotation), n[0] = a.camera._matrix[8], n[1] = a.camera._matrix[9], n[2] = a.camera._matrix[10], k.transformQuat(n, n, o), k.add(n, n, this.spot.position), this.spot.lookAt(n), this.spot.setScale(p * (.05 - .005 * this.pressing)), this.spot.opacity = this.opacity, this.spot.render(a)
            }
        }, b.exports = e
    }, {
        "./spot": 58,
        "dev/gui": 39,
        "gl-matrix": 113,
        "gl/cube-geom": 73,
        "nanogl-node": 128
    }
    ],
    52: [function(a, b, c) {
        function d(a) {
            this.node = new h, this.setup = new g, this.list = [], this.spotlight = new e(a), this.spotlight.position.set([4, 6, 2]), this.spotlight.lookAt(this.node.position), this.spotlight.angle = Math.PI / 10, this.spotlight._color.set([1, 0, 0]), this.dirlight = new f(a), this.dirlight.position.set([ - 4, 6, - 2]), this.dirlight.lookAt(this.node.position), this.dirlight._color.set([0, 0, 1]), this.node.add(this.spotlight), this.node.add(this.dirlight), this.list.push(this.spotlight), this.list.push(this.dirlight)
        }
        var e = a("nanogl-pbr/lib/lights/spot-light"), f = a("nanogl-pbr/lib/lights/directional-light"), g = a("nanogl-pbr/lib/lights/light-setup"), h = a("nanogl-node");
        b.exports = d
    }, {
        "nanogl-node": 128,
        "nanogl-pbr/lib/lights/directional-light": 142,
        "nanogl-pbr/lib/lights/light-setup": 143,
        "nanogl-pbr/lib/lights/spot-light": 145
    }
    ],
    53: [function(a, b, c) {
        function d(a, b, c, d, e) {
            a.beginPath(), a.moveTo(b, c), a.lineTo(d, e);
            var f = a.createLinearGradient(b, c, d, e);
            f.addColorStop("0", "rgba(255, 0, 0, 1)"), f.addColorStop("1.0", "rgba(255, 0, 0, 0)"), a.strokeStyle = f, a.closePath(), a.stroke()
        }
        function e() {
            var a = o.LINE_WIDTH, b = o.MAX_LENGTH, c = o.MIN_LENGTH, e = o.SIZE, f = o.LINE_NUMBER, g = document.createElement("canvas");
            g.style.height = e + "px", g.style.width = e + "px", g.width = e, g.height = e;
            var h = g.getContext("2d");
            h.lineWidth = a;
            for (var i = f; i >= 0; i--) {
                var j, k, l = c + Math.random() * (b - c), m = Math.random() < .5 ? 0: 1, n = Math.random() * e, p = Math.random() * e;
                0 == m ? (k = p, j = n + l, j > e && (j = n - l)) : (j = n, k = p + l, k > e && (k = p - l)), d(h, n, p, j, k)
            }
            return g
        }
        function f() {
            var a = p.LINE_WIDTH, b = p.LINE_LENGTH, c = p.SIZE, e = document.createElement("canvas");
            e.style.height = c + "px", e.style.width = c + "px", e.width = c, e.height = c;
            var f = e.getContext("2d");
            f.lineWidth = a;
            var g = 15 * Math.random(), h = 10 * Math.random();
            return d(f, 0, 0, 0, b - h), d(f, 0, 0, b - g, 0), d(f, c, 0, c, b - h), d(f, c, 0, c - b - g, 0), d(f, 0, c, 0, c - b - h), d(f, 0, c, b - g, c), d(f, c, c, c, c - b - h), d(f, c, c, c - b - g, c), e
        }
        function g(a) {
            j.call(this), this.gl = a, this.geom = new i(a), this.cfg = a.state.config(), this.cfg.enableCullface(!1), this.cfg.enableDepthTest(!0), this.cfg.depthMask(!0), this.cfg.enableBlend(), this.cfg.blendFunc(a.SRC_ALPHA, a.ONE_MINUS_SRC_ALPHA), this.rotateX(Math.PI / 2), this.setScale(65), this.y = .1, this.updateWorldMatrix();
            var b = f();
            this.texture = new h(a, a.RGBA), this.texture.fromImage(b), this.texture.repeat();
            var c = e();
            this.linesTexture = new h(a, a.RGBA), this.linesTexture.fromImage(c), this.linesTexture.repeat(), this.startTime = Date.now(), this.speed = 0, this.opening = 0, this.shown=!1;
            var d = l.addFolder("loading_floor");
            d.add(this, "opening", 0, 1)
        }
        var h = a("nanogl").Texture, i = a("nanogl-primitives-2d/rect"), j = a("nanogl-node"), k = a("gl-matrix").mat4, l = a("dev/gui-loading"), m = (a("utils/ease"), a("gsap/src/uncompressed/TweenLite")), n = k.create(), o = {
            SIZE: 2048,
            LINE_NUMBER: 10,
            LINE_WIDTH: 3,
            MAX_LENGTH: 1300,
            MIN_LENGTH: 300
        }, p = {
            SIZE: 1024,
            LINE_WIDTH: 8,
            LINE_LENGTH: 180
        };
        g.prototype = Object.create(j.prototype), g.prototype.constructor = g, g.prototype.show = function() {
            this.speed = 1, this.startTime = Date.now(), m.to(this, .5, {
                opening: 1,
                onComplete: function() {
                    this.shown=!0
                }.bind(this)
            })
        }, g.prototype.stop = function() {
            m.to(this, .5, {
                opening: 0
            })
        }, g.prototype.render = function(a) {
            var b = this.gl, c = b.programs.loadingFloor;
            if (0 != this.opening) {
                var d = Date.now() - this.startTime;
                c.use(), c.uTime(d * this.speed), c.uOpening(this.opening), a.modelViewProjectionMatrix(n, this._wmatrix), c.uMVP(n), this.texture.bind(), c.uCrossSampler(0), this.linesTexture.bind(1), c.uLinesSampler(1), this.geom.attribPointer(c), this.cfg.apply(), this.geom.render()
            }
        }, b.exports = g
    }, {
        "dev/gui-loading": 38,
        "gl-matrix": 113,
        "gsap/src/uncompressed/TweenLite": 123,
        nanogl: 159,
        "nanogl-node": 128,
        "nanogl-primitives-2d/rect": 149,
        "utils/ease": 90
    }
    ],
    54: [function(a, b, c) {
        function d(a, b) {
            h.call(this, a), this.gl = a;
            var a = this.gl;
            this.loadState = 0, this.carLines = new f(a, b.bundle.getLoadingColors()), this.loadingFloor = new g(a), this.domLoadingBar = document.createElement("div");
            var c = this.domLoadingBar;
            c.style.position = "absolute", c.style.bottom = "0", c.style.left = "0", c.style.width = "100%", c.style.height = "3px", c.style.background = "#c3002f", c.style.opacity = "0.7", c.style.transition = "opacity 0.2s", c.style.transform = "scaleX(0)", c.style.transformOrigin = "left center", document.body.appendChild(c);
            var d = e.addFolder("loader_scene");
            d.add(this, "show"), d.add(this, "hide"), d.add(this, "play"), d.add(this, "loadState", 0, 1).onChange(function() {}.bind(this))
        }
        var e = a("dev/gui-loading"), f = a("./car-lines"), g = a("./loading-floor"), h = a("event-emitter");
        d.prototype = Object.create(h.prototype), d.prototype.play = function() {
            this.show(), TweenLite.fromTo(this, 20, {
                loadState: 0
            }, {
                delay: 1,
                loadState: 1,
                ease: Linear.easeNone,
                onUpdate: function() {
                    this.setLoadState(this.loadState)
                }.bind(this),
                onComplete: function() {
                    this.setLoadState(this.loadState)
                }.bind(this)
            })
        }, d.prototype.setLoadState = function(a) {
            this.loadState = a, this.onLoadUpdate()
        }, d.prototype.onLoadComplete = function() {
            this.emit("loading-complete"), this.setLoadState(1), TweenLite.delayedCall(.2, function() {
                this.carLines.stop(), this.loadingFloor.stop(), this.domLoadingBar.style.transformOrigin = "right center", this.domLoadingBar.style.webkitTransformOrigin = "right center", this.domLoadingBar.style.webkitTransition = "transform 1.2s ease", this.domLoadingBar.style.transition = "transform 1.2s ease", this.domLoadingBar.style.webkitTransform = "scaleX(0)", this.domLoadingBar.style.transform = "scaleX(0)", TweenLite.delayedCall(.2, function() {
                    this.emit("loading-hidden")
                }.bind(this))
            }.bind(this))
        }, d.prototype.onLoadUpdate = function() {
            this.domLoadingBar.style.transform = "scaleX(" + this.loadState + ")", this.domLoadingBar.style.webkitTransform = "scaleX(" + this.loadState + ")"
        }, d.prototype.show = function() {
            this.domLoadingBar.style.transform = "scaleX(0)", this.domLoadingBar.style.transformOrigin = "left center", this.loadingFloor.show(), TweenLite.delayedCall(.3, this.carLines.show.bind(this.carLines))
        }, d.prototype.hide = function() {
            this.loadingFloor.stop(), this.carLines.stop()
        }, d.prototype.load = function() {
            return this.carLines.load()
        }, d.prototype.render = function(a) {
            this.carLines.setProgress(this.loadState), this.carLines.render(a), this.loadingFloor.render(a.camera)
        }, h(d.prototype), b.exports = d
    }, {
        "./car-lines": 43,
        "./loading-floor": 53,
        "dev/gui-loading": 38,
        "event-emitter": 112
    }
    ],
    55: [function(a, b, c) {
        function d(a) {
            e.call(this), this.gl = a, this.geom = null, this.name = "", this.materials = [], this.depthCfg = a.state.config(), this.depthCfg.enableDepthTest(!0), this.depthCfg.colorMask(!1, !1, !1, !1), this.plainCfg = a.state.config(), this.plainCfg.enableDepthTest(!0), this.plainCfg.depthFunc(a.EQUAL), this.plainCfg.enableBlend(), this.plainCfg.blendFunc(a.ONE, a.ONE)
        }
        var e = (a("nanogl-state/config"), a("../assets/bingeom"), a("nanogl-node")), f = (a("gl-matrix").mat4.create(), a("dev/stats"));
        d.prototype = Object.create(e.prototype), d.prototype.constructor = d, d.prototype.preRender = function(a) {}, d.prototype.render = function(a, b) {
            for (var c = this.geom.subgeoms, d = this.materials.length, e = 0; e < c.length; e++) {
                var g = c[e], h = this.materials[Math.min(d - 1, e)];
                0 !== (h._mask & b) && (h.prepare(this, a.camera), g.setup(h.prg), this.gl.state.now(h.config), this.cfg && this.cfg.apply(), f.drawCall(), g.render())
            }
        }, d.prototype.renderDepth = function(a, b) {
            b.prepare(this, a), this.geom.setup(b.prg), this.cfg.apply(), this.geom.render()
        }, d.prototype.renderDepthCut = function(a, b, c, d) {
            c.prepare(this, a);
            var e = this.geom.subgeoms, f = this.materials.length;
            if (e && e.length > 0)
                for (var g = 0; g < e.length; g++) {
                    var h = e[g], i = this.materials[Math.min(f - 1, g)];
                    0 !== (i._mask & b) && (h.setup(c.prg), this.depthCfg && "DEPTHCUT" == d && this.depthCfg.apply(), this.plainCfg && "PLAINMAT" == d && this.plainCfg.apply(), h.render())
                } else 
                    this.geom.setup(c.prg), this.depthCfg && "DEPTHCUT" == d && this.depthCfg.apply(), this.plainCfg && "PLAINMAT" == d && this.plainCfg.apply(), this.geom.render()
        }, b.exports = d
    }, {
        "../assets/bingeom": 3,
        "dev/stats": 41,
        "gl-matrix": 113,
        "nanogl-node": 128,
        "nanogl-state/config": 151
    }
    ],
    56: [function(a, b, c) {
        function d(a) {
            f.call(this), this.gl = a, this.geom = new e(a), this.cfg = a.state.config(), this.cfg.enableCullface(!1), this.cfg.enableDepthTest(), this.cfg.depthMask(!0)
        }
        var e = a("nanogl-primitives-2d/rect"), f = a("nanogl-node"), g = a("gl-matrix").mat4.create();
        d.prototype = Object.create(f.prototype), d.prototype.constructor = d, d.prototype.preRender = function(a) {}, d.prototype.render = function(a) {
            var b = this.gl, c = b.programs.plane;
            a.modelViewProjectionMatrix(g, this._wmatrix), c.use(), c.uMVP(g), this.geom.attribPointer(c), this.cfg.apply(), this.geom.render()
        }, b.exports = d
    }, {
        "gl-matrix": 113,
        "nanogl-node": 128,
        "nanogl-primitives-2d/rect": 149
    }
    ],
    57: [function(a, b, c) {
        function d(a, b) {
            f.call(this), this.gl = a, this.geom = new e(a), this.ibl = b, this.cfg = a.state.config(), this.cfg.enableCullface(!1), this.cfg.enableDepthTest(!0), this.cfg.depthFunc(a.LEQUAL), this.cfg.depthMask(!1), this.groundColor = i.create(), this.groundColorDark = i.create(), this.groundDark = 0, g.HexToVec(14408667, this.groundColorDark), g.HexToVec(15066597, this.groundColor), this.groundColors = [], this.groundColors[0] = this.groundColor[0], this.groundColors[1] = this.groundColor[1], this.groundColors[2] = this.groundColor[2], this.groundColors[3] = this.groundColorDark[0], this.groundColors[4] = this.groundColorDark[1], this.groundColors[5] = this.groundColorDark[2];
            var c = j.addFolder("sky"), d = {
                expo: 1,
                gamma: 1
            };
            this.toneMap = new Float32Array([d.expo, d.gamma]), c && (c.add(d, "expo", 0, 10).onChange(function(a) {
                this.toneMap[0] = a
            }.bind(this)), c.add(d, "gamma", 0, 4).onChange(function(a) {
                this.toneMap[1] = a
            }.bind(this)))
        }
        var e = a("nanogl-primitives-2d/rect"), f = a("nanogl-node"), g = a("utils/color"), h = a("gl-matrix").mat4, i = a("gl-matrix").vec3, j = a("dev/gui"), k = (h.create(), h.create()), l=!1;
        d.prototype = Object.create(f.prototype), d.prototype.constructor = d, d.prototype.setDark = function(a) {
            a ? TweenLite.to(this, 1, {
                groundDark: 1
            }) : TweenLite.to(this, 1, {
                groundDark: 0
            })
        }, d.prototype.render = function(a) {
            var b = this.gl, c = b.programs.sky;
            c.use(), l ? c.uSHCoeffs(this.ibl.sh) : c.tEnv(this.ibl.envBg), h.copy(k, a._viewProj), k[12] = 0, k[13] = 0, k[14] = 0, h.invert(k, k), c.uUnproject(k), c.uToneMap(this.toneMap), b.uniform3fv(c.uGroundColors(), this.groundColors), c.uGroundDark(this.groundDark), this.geom.attribPointer(c), this.cfg.apply(), this.geom.render()
        }, b.exports = d
    }, {
        "dev/gui": 39,
        "gl-matrix": 113,
        "nanogl-node": 128,
        "nanogl-primitives-2d/rect": 149,
        "utils/color": 89
    }
    ],
    58: [function(a, b, c) {
        function d(a) {
            e.call(this), this.gl = a, this.radius = .7, this.innerColor = h.fromValues(0, 0, 0, 1), this.outerColor = h.fromValues(0, 0, 0, .6), this.opacity = 1, g.HexToVec(16777215, this.innerColor), g.HexToVec(16777215, this.outerColor), this.cfg = a.state.config(), this.cfg.enableBlend(), this.cfg.blendFunc(a.SRC_ALPHA, a.ONE_MINUS_SRC_ALPHA), this.cfg.enableDepthTest(), this.cfg.depthMask(!1)
        }
        var e = a("nanogl-node"), f = a("gl-matrix"), g = a("utils/color"), h = (f.vec3, f.vec4), i = f.mat4.create(), j = h.create();
        d.prototype = Object.create(e.prototype), d.prototype.constructor = d, d.prototype.render = function(a) {
            var b = this.gl, c = b.programs.spot, d = a.quad;
            c.use(), 1 !== this.opacity ? (j.set(this.innerColor), j[3]*=this.opacity, c.uColor1(j), j.set(this.outerColor), j[3]*=this.opacity, c.uColor2(j)) : (c.uColor1(this.innerColor), c.uColor2(this.outerColor)), c.uInnerRadius(25 * this.radius), a.camera.modelViewProjectionMatrix(i, this._wmatrix), c.uMVP(i), d.attribPointer(c), this.cfg.apply(), d.render()
        }, b.exports = d
    }, {
        "gl-matrix": 113,
        "nanogl-node": 128,
        "utils/color": 89
    }
    ],
    59: [function(a, b, c) {
        function d(a, b) {
            f.call(this), this.gl = a, this.geom = new e(a, !0, !0, !1), this.cfg = a.state.config(), this.cfg.enableCullface(!0), this.cfg.enableDepthTest(), this.cfg.depthMask(!0), this.mat = b, this.loaded=!1, this.load()
        }
        var e = a("../assets/bingeom"), f = a("nanogl-node");
        a("gl-matrix").mat4.create();
        d.prototype = Object.create(f.prototype), d.prototype.constructor = d, d.prototype.load = function() {
            var a = this;
            this.geom.load("assets/swatch/mesh.bin").then(function() {
                a.loaded=!0
            })
        }, d.prototype.preRender = function(a) {}, d.prototype.render = function(a) {
            this.loaded && (this.mat.prepare(this, a), this.geom.setup(this.mat.prg), this.cfg.apply(), this.geom.render())
        }, b.exports = d
    }, {
        "../assets/bingeom": 3,
        "gl-matrix": 113,
        "nanogl-node": 128
    }
    ],
    60: [function(a, b, c) {
        function d(a, b, c) {
            this.id = a, b = b / 180 * Math.PI, this.dir = p.fromValues( - Math.cos(b), Math.sin(b)), p.normalize(this.dir, this.dir), c = c / 180 * Math.PI, this.dot = Math.cos(c / 2)
        }
        function e(a) {
            this.scene = a, this.onUserAction = this._onUserAction.bind(this), this.next = this._next.bind(this), m.on("down", this.onUserAction), m.on("up", this.onUserAction);
            a.gl, a.root;
            this.playing=!1, this.axisScale = o.fromValues(1, 1, 1), this.axisCenter = o.create(), this.orbit = new i(this), this.env = new j(this), this.door = new k(this), this.color = new l(this), this.gopening = 1, this.triggers = [];
            this.addTrigger("color", - 10, 40), this.addTrigger("ctrl", 35, 50), this.addTrigger("door", 90, 60), this.addTrigger("ctrl", 150, 60), this.addTrigger("ctrl", 210, 60), this.addTrigger("ctrl", 270, 60), this.lastCtrl = "env", this.animStack = [], this.currentAnim = null, this.lastAnim = null, this.lastActionTime = Date.now(), this.triggerTime = 2e3, this.ndbg=!0;
            var b = n.addFolder("UI");
            b.add(this.orbit, "angle", 0, 2 * Math.PI).name("orbit angle"), b.add(this.orbit, "azimuth", - .2, .2).name("orbit azimuth"), b.add(this.env, "angle", 0, 2 * Math.PI).name("env angle"), b.add(this.env, "azimuth", - .2, .2).name("env azimuth"), b.add(this, "start"), b.add(this, "stop"), b.add(this, "debugplayOrbit"), b.add(this, "debugplayEnv"), b.add(this, "debugplayDoor"), b.add(this, "debugplayColor")
        }
        function f() {}
        var g = a("when"), h = a("gl-matrix"), i = (a("./euler-axis"), a("./euler-grid"), a("./curved-grid"), a("./spot"), a("./compass"), a("./ui/orbit")), j = a("./ui/env"), k = a("./ui/door"), l = a("./ui/color"), m = a("assets/mouse"), n = a("dev/gui"), o = h.vec3, p = h.vec2, q = h.mat4, r = (h.quat, p.create());
        q.create(), q.create(), o.fromValues(0, 1, 0), o.fromValues(1, 0, 0);
        d.prototype = {
            test: function(a) {
                var b = p.dot(a, this.dir);
                return b > this.dot
            }
        }, e.prototype = {
            debugplayOrbit: function() {
                this.ndbg=!1, this.start(), this.orbit.open(), this.orbit.stop(), this.orbit.play()
            },
            debugplayEnv: function() {
                this.ndbg=!1, this.start(), this.env.open(), this.env.stop(), this.env.play()
            },
            debugplayDoor: function() {
                this.ndbg=!1, this.start(), this.door.open(), this.door.stop(), this.door.play()
            },
            debugplayColor: function() {
                this.ndbg=!1, this.start(), this.color.open(), this.color.stop(), this.color.play()
            },
            addTrigger: function(a, b, c) {
                this.triggers.push(new d(a, b, c))
            },
            _onUserAction: function() {
                this.ndbg && (this.stop(), this.lastActionTime = Date.now())
            },
            start: function() {
                this.playing || (this.lastCtrl = "env", this.playing=!0, this.animStack.length = 0, this.orbit.seen=!1, this.env.seen=!1, this.door.seen=!1, this.color.seen=!1, this.triggerTime = 8e3)
            },
            stop: function() {
                this.playing && (this.close(), this.playing=!1, this.animStack.length = 0, this.orbit.stop(), this.env.stop(), this.door.stop(), this.color.stop(), this.lastActionTime = Date.now(), this.currentAnim = null, this.lastAnim = null, this.lastTrigger = null, this.lastCtrl = "env")
            },
            open: function() {
                this.orbit.open(), this.env.open(), this.door.open(), this.color.open()
            },
            close: function() {
                this.orbit.close(), this.env.close(), this.door.close(), this.color.close()
            },
            playOrbit: function() {
                return this.addToPlay(this.orbit)
            },
            playEnv: function() {
                return this.addToPlay(this.env)
            },
            playDoor: function() {
                return this.addToPlay(this.door)
            },
            playColor: function() {
                return this.addToPlay(this.color)
            },
            addToPlay: function(a) {
                return this.ndbg && this.noAnim() && this.lastAnim !== a&&-1 === this.animStack.indexOf(a) ? (this.animStack.push(a), null === this.currentAnim && this.next(), !0) : !1
            },
            _next: function() {
                if (this.ndbg && (this.currentAnim = null, this.animStack.length > 0)) {
                    var a = this.currentAnim = this.animStack.shift();
                    if (a === this.lastAnim)
                        return;
                    this.lastAnim = a, a.open().then(function() {
                        return a.play()
                    }).then(function() {
                        return a.close()
                    }).then(this.next, f)
                }
            },
            noAnim: function() {
                return null === this.currentAnim && 0 === this.animStack.length
            },
            sequence: function() {
                g(!0).then(this.color.quickOpen.bind(this.color)).then(this.door.quickOpen.bind(this.door)).then(this.orbit.quickOpen.bind(this.orbit)).then(this.env.quickOpen.bind(this.env))
            },
            setupTransform: function(a) {
                this.axisCenter[0] = a[0], this.axisCenter[1] = a[1], this.axisCenter[2] = a[2], this.axisScale[0] = a[3], this.axisScale[1] = a[4], this.axisScale[2] = a[5], this.orbit.setupTransform(), this.env.setupTransform(), this.door.setupTransform(), this.color.setupTransform()
            },
            preRender: function(a) {
                if (!this.playing) {
                    var b = Date.now(), c = b - this.lastActionTime;
                    return void(c > this.triggerTime && this.start())
                }
                var d = this.scene.camera;
                r[0] = d.position[0], r[1] = d.position[2], p.normalize(r, r);
                for (var e = 0; e < this.triggers.length; e++) {
                    var f = this.triggers[e];
                    if (f.test(r))
                        break
                }
                if (f && f !== this.lastTrigger) {
                    var g, h = f.id;
                    "color" === h ? g = this.playColor() : "door" === h ? g = this.playDoor() : "ctrl" === h && (g = "env" === this.lastCtrl ? this.playOrbit() : this.playEnv(), g && ("env" === this.lastCtrl ? this.lastCtrl = "orbit" : this.lastCtrl = "env")), g && (this.lastTrigger = f)
                }
                this.orbit._preRender(a), this.env._preRender(a), this.door._preRender(a), this.color._preRender(a)
            },
            render: function() {
                this.orbit.gopening = this.gopening, this.env.gopening = this.gopening, this.door.gopening = this.gopening, this.color.gopening = this.gopening, this.orbit.render(), this.env.render(), this.door.render(), this.color.render()
            }
        }, b.exports = e
    }, {
        "./compass": 44,
        "./curved-grid": 45,
        "./euler-axis": 47,
        "./euler-grid": 48,
        "./spot": 58,
        "./ui/color": 62,
        "./ui/door": 63,
        "./ui/env": 64,
        "./ui/orbit": 65,
        "assets/mouse": 19,
        "dev/gui": 39,
        "gl-matrix": 113,
        when: 184
    }
    ],
    61: [function(a, b, c) {
        function d() {
            this.playing=!1, this.playDefered = null, this.seen=!1
        }
        function e(a) {
            a && this.onOpen && this.onOpen(), !a && this.onClose && this.onClose();
            var b = o.defer();
            return 1 === this.opening && (this.opening =- 1), - 1 !== this.opening || a ? TweenLite.to(this, p, {
                opening: a ? 0: 1,
                onComplete: b.resolve
            }) : b.resolve(), b.promise
        }
        function f() {
            var a = o.defer(), b = this;
            return this.open(), setTimeout(function() {
                b.close(), a.resolve()
            }, this.duration), a.promise
        }
        function g() {
            return this.setVisible(!0)
        }
        function h() {
            return this.setVisible(!1)
        }
        function i() {
            return this.playing || (this.seen=!0, this.time = 0, this.playing=!0, this.playDefered && this.playDefered.reject(), this.playDefered = o.defer()), this.playDefered.promise
        }
        function j() {
            this.playing=!1, this.playDefered && this.playDefered.resolve(), this.playDefered = null
        }
        function k() {
            this.time = 0, this.playing=!1, this.playDefered && this.playDefered.reject(), this.playDefered = null
        }
        function l(a) {
            this.playing && (this.time += a), this.duration / 1e3 < this.time && this.playComplete(), this.preRender(a)
        }
        function m() {
            return Math.abs(this.opening) < 1
        }
        function n(a) {
            a.setVisible = e, a.open = g, a.close = h, a.isOpen = m, a.quickOpen = f, a.play = i, a.stop = k, a.playComplete = j, a._preRender = l
        }
        var o = a("when"), p = 1.1;
        b.exports = {
            extend: n,
            ctor: d
        }
    }, {
        when: 184
    }
    ],
    62: [function(a, b, c) {
        function d(a) {
            h.ctor.call(this);
            var b = a.scene.gl;
            this.ui = a, this.duration = 5e3, this.opening =- 1, this.gopening = 1, this.time = 0, this.mousedown=!1, this.pressing = 0, this.colors = [9767192, 0], this.spots = [], this.grid = new f(b, 3, .2805, .2805, 1.3, .2, .5), this.grid.rotateZ(Math.PI / 2 + .45), this.grid.rotateY(Math.PI / 2), this.grid.x =- 18.1, this.grid.y = 9.9, this.grid.z = 0, this.mouseSpot = new g(b), this.mouseSpot.radius = .94, this.mouseSpot.rotateZ( - .9), this.mouseSpot.rotateY(Math.PI / 2), this.mouseSpot.x =- 18.9, this.mouseSpot.y = 9.4, this.mouseSpot.z = 0, a.scene.root.add(this.grid), a.scene.root.add(this.mouseSpot)
        }
        var e = a("gl-matrix"), f = (a("nanogl-node"), a("../compass"), a("../curved-grid")), g = a("../spot"), h = (a("../glow"), a("./UI-base")), i = (a("utils/color"), a("utils/ease"), e.vec3), j = e.mat4;
        e.quat, i.create(), j.create(), j.create(), i.fromValues(0, 1, 0), i.fromValues(1, 0, 0);
        d.prototype = {
            setupTransform: function() {},
            preRender: function(a) {
                var b = (this.ui.scene.camera, this.time), c = .15, d = Math.max(0, b * (1 + c) - c), e = d > .2 && .4 > b || d > 1.2 && 1.4 > b;
                this.mousedown != e && (e || this.ui.scene.onClickCar(), this.mousedown = e);
                var f = Math.min(10 * b, 10 * (2 - b));
                f = Math.min(1, Math.max(0, f)), this.mouseSpot.innerColor[3] = .2 + .6 * this.pressing + (1 - f), f = .62 * f + .19;
                var g = e ? 1: 0;
                this.pressing += (g - this.pressing) * a * 15, this.mouseSpot.setScale(f * (1.2 - .1 * this.pressing))
            },
            render: function() {
                if (this.isOpen()) {
                    var a = this.opening + (1 - this.gopening), b = 2*-a - 1, c = Math.max(0, 1 - Math.abs(4 * a));
                    this.mouseSpot.opacity = c, this.grid.render(this.ui.scene, b), this.mouseSpot.render(this.ui.scene)
                }
            }
        }, h.extend(d.prototype), b.exports = d
    }, {
        "../compass": 44,
        "../curved-grid": 45,
        "../glow": 49,
        "../spot": 58,
        "./UI-base": 61,
        "gl-matrix": 113,
        "nanogl-node": 128,
        "utils/color": 89,
        "utils/ease": 90
    }
    ],
    63: [function(a, b, c) {
        function d(a) {
            h.ctor.call(this);
            var b = a.scene.gl;
            this.ui = a, this.duration = 5e3, this.opening =- 1, this.gopening = 1, this.time = 0, this.pressing = 0, this.grid = new g(b, 2, .187, .187, 1), this.compass = new f(b), this.angle = 0, a.scene.root.add(this.grid), a.scene.root.add(this.compass), this.grid.x =- 2, this.grid.y = 7, this.grid.z = 9, this.compass.x =- 7.6, this.compass.y = 6.1, this.compass.z = 9
        }
        var e = a("gl-matrix"), f = a("../compass"), g = a("../curved-grid"), h = a("./UI-base"), i = (a("utils/ease"), e.vec3), j = e.mat4;
        e.quat, j.create(), j.create(), i.fromValues(0, 1, 0), i.fromValues(1, 0, 0);
        d.prototype = {
            setupTransform: function() {},
            preRender: function(a) {
                var b = this.time, c = .1, d = Math.max(0, b * (1 + c) - c);
                d > 2.5 && (d -= 2.5);
                var e = d > .5 && .6 > d, f = Math.min(10 * b, 10 * (4.9 - b));
                f = Math.min(1, Math.max(0, f)), this.compass.spot.innerColor[3] = .2 + .6 * this.pressing + (1 - f), f = .754 * f + .246;
                var g = e ? 1: 0;
                this.pressing += (g - this.pressing) * a * 15, this.compass.spot.setScale(.079 * (f * (1.2 - .1 * this.pressing)));
                var h = Math.min(3 * (d - .6), 4 * (2 - d));
                h = Math.min(1, Math.max(0, h)), this.angle = .4 * h
            },
            render: function() {
                if (this.isOpen()) {
                    var a = this.opening + (1 - this.gopening), b = 2*-a - 1, c = Math.max(0, 1 - Math.abs(4 * a));
                    this.compass.opacity = c, this.grid.render(this.ui.scene, b), this.compass.angle = this.angle, this.compass.render(this.ui.scene)
                }
            }
        }, h.extend(d.prototype), b.exports = d
    }, {
        "../compass": 44,
        "../curved-grid": 45,
        "./UI-base": 61,
        "gl-matrix": 113,
        "utils/ease": 90
    }
    ],
    64: [function(a, b, c) {
        function d(a) {
            j.ctor.call(this);
            var b = a.scene.gl;
            this.ui = a, this.duration = v.length / 60 * 1e3, this.opening =- 1, this.gopening = 1, this.pressing = 0, this.time = 0, this.axis = new f(b, Math.PI / 8, Math.PI / 3, 42), this.grid = new g(b, 3, .14 * .85, .14 * .85), this.spot = new h(b), this.glow = new i(b);
            var c = 50;
            this.scale = k.fromValues(c, c, c), this.spot.radius = .94, this.spot.setScale(.5), this.glow.setScale(3), this.baseMatrix = m.create(), this.angle = Math.PI, this.azimuth =- .05, a.scene.root.add(this.axis), a.scene.root.add(this.grid), a.scene.root.add(this.spot), this.spot.add(this.glow)
        }
        for (var e = a("gl-matrix"), f = a("../euler-axis"), g = a("../euler-grid"), h = a("../spot"), i = a("../glow"), j = a("./UI-base"), k = (a("utils/ease"), e.vec3), l = e.vec2, m = e.mat4, n = (e.quat, k.create()), o = l.create(), p = l.create(), q = m.create(), r = m.create(), s = k.fromValues(0, 1, 0), t = k.fromValues(1, 0, 0), u = k.fromValues(0, 0, 1), v = [[1, 0, 0], [1, .01, 0], [1, .01, .01], [1, .01, .01], [1, .01, .01], [1, - 1.39, .01], [1, - 4.31, .21], [1, - 9.04, .37], [1, - 15.63, .5], [1, - 24.1, .6], [1, - 34.08, .68], [1, - 45.06, .75], [1, - 56.84, .8], [1, - 69.47, .84], [1, - 82.77, .88], [1, - 97.61, .7], [1, - 111.69, .56], [1, - 125.15, .25], [1, - 138.31, - .19], [1, - 151.25, - .55], [1, - 163.99, - .84], [1, - 176.59, - 1.07], [1, - 188.87, - 1.25], [1, - 201.09, - 1.4], [1, - 213.47, - 1.52], [1, - 226.17, - 1.61], [1, - 239.13, - 1.69], [1, - 254.1, - 1.75], [1, - 268.88, - 1.8], [1, - 283.1, - 1.84], [1, - 297.08, - 1.87], [1, - 310.66, - 1.89], [1, - 324.12, - 1.91], [1, - 337.69, - 1.93], [1, - 351.15, - 1.94], [1, - 365.52, - 1.95], [1, - 378.01, - 1.96], [1, - 390.4, - 1.96], [1, - 404.12, - 1.97], [1, - 417.89, - 1.97], [1, - 431.71, - 1.78], [1, - 445.56, - 1.62], [1, - 459.25, - 1.49], [1, - 472.99, - 1.39], [1, - 486.99, - 1.31], [1, - 501.19, - 1.25], [1, - 516.15, - 1.2], [1, - 531.31, - 1.15], [1, - 546.25, - 1.12], [1, - 562.19, - 1.1], [1, - 577.15, - 1.07], [1, - 591.32, - 1.06], [1, - 605.45, - 1.04], [1, - 619.16, - 1.03], [1, - 632.12, - 1.02], [1, - 644.49, - 1.02], [1, - 656.19, - 1.01], [1, - 666.95, - 1.01], [1, - 677.16, - 1], [1, - 687.52, - 1], [1, - 697.21, - 1], [1, - 706.17, - 1], [1, - 714.13, - 1], [1, - 720.9, - .99], [1, - 726.52, - .99], [0, - 731.01, - .99], [0, - 734.6, - .99], [0, - 737.48, - .99], [0, - 739.78, - .99], [0, - 741.62, - .99], [0, - 743.09, - .99], [0, - 744.27, - .99], [0, - 745.21, - .99], [0, - 744.17, - 1.19], [0, - 740.13, - 1.55], [0, - 731.9, - 2.04], [0, - 719.52, - 2.63], [0, - 704.01, - 3.3], [0, - 685.6, - 3.84], [0, - 664.48, - 4.47], [0, - 641.58, - 4.97], [0, - 617.46, - 5.38], [0, - 589.16, - 5.7], [0, - 560.33, - 5.96], [0, - 534.26, - 6.16], [0, - 505.2, - 6.33], [0, - 476.96, - 6.46], [0, - 449.56, - 6.57], [0, - 422.65, - 6.65], [0, - 396.11, - 6.72], [0, - 370.09, - 6.37], [0, - 344.67, - 5.9], [0, - 320.53, - 5.31], [0, - 297.22, - 4.65], [0, - 270.97, - 3.72], [0, - 245.17, - 2.77], [0, - 220.34, - 1.82], [0, - 197.06, - 1.05], [0, - 175.85, - .44], [0, - 156.67, .05], [0, - 139.14, .44], [0, - 123.11, .76], [0, - 107.88, 1.01], [0, - 93.1, 1.21], [0, - 78.48, 1.37], [0, - 63.38, 1.5], [0, - 45.3, 1.6], [0, - 26.84, 1.68], [0, - 7.86, 1.75], [0, 12.11, 1.8], [0, 33.49, 1.84], [0, 57, 1.88], [0, 82.2, 2.5], [0, 108.57, 3.2], [0, 135.46, 4.37], [0, 162.77, 5.69], [0, 190.02, 6.96], [0, 217.42, 8.57], [0, 246.74, 10.26], [0, 273.59, 11.61], [0, 297.88, 12.89], [0, 319.11, 13.91], [0, 337.49, 14.93], [0, 353.6, 15.75], [0, 367.88, 16.4], [0, 380.31, 16.92], [0, 391.05, 17.34], [0, 400.44, 17.67], [0, 408.56, 17.94], [0, 415.25, 18.16], [0, 420.6, 18.33], [0, 424.89, 18.46], [0, 428.31, 18.57], [0, 431.05, 18.66], [0, 433.25, 18.73], [0, 435, 18.79], [0, 436.4, 18.83], [0, 437.53, 18.87], [0, 438.43, 18.9], [0, 439.14, 18.92], [0, 439.72, 18.94], [0, 440.18, 18.95], [0, 440.55, 18.96], [0, 440.84, 18.97], [0, 441.08, 18.98], [0, 440.86, 18.99], [0, 440.5, 18.99], [0, 440, 19], [1, 438.6, 19], [1, 435.29, 19], [1, 429.43, 19], [1, 421.55, 19], [1, 411.84, 19.01], [1, 399.28, 19.01], [1, 386.03, 19.01], [1, 372.22, 19.01], [1, 357.98, 19.01], [1, 343.39, 19.01], [1, 328.72, 19.01], [1, 314.38, 19.01], [1, 300.7, 19.01], [1, 287.57, 19.01], [1, 275.06, 19.01], [1, 262.85, 19.01], [1, 250.68, 18.81], [1, 237.55, 18.45], [1, 224.84, 18.16], [1, 212.48, 17.73], [1, 200.19, 17.39], [1, 187.95, 17.11], [1, 175.97, 16.89], [1, 164.18, 16.52], [1, 152.94, 16.21], [1, 142.16, 15.97], [1, 131.73, 15.78], [1, 121.79, 15.63], [1, 112.03, 15.3], [1, 101.83, 14.85], [1, 91.87, 14.48], [1, 82.3, 14.18], [1, 73.04, 13.75], [1, 63.84, 13.2], [1, 54.87, 12.56], [1, 46.5, 12.05], [1, 39.21, 11.44], [1, 32.77, 10.96], [1, 27.22, 10.57], [1, 22.58, 10.06], [1, 18.27, 9.65], [1, 14.62, 9.12], [1, 11.5, 8.7], [1, 9, 8.36], [1, 7, 8.09], [1, 5.41, 7.87], [1, 4.13, 7.7], [1, 3.11, 7.56], [1, 2.29, 7.45], [1, 1.64, 7.36], [1, 1.11, 7.29], [1, .69, 7.24], [1, .36, 7.19], [1, .09, 7.16], [1, - .12, 7.13], [1, - .3, 7.1], [1, - .43, 7.08], [1, - .54, 7.07], [1, - .63, 7.06], [1, - .7, 6.85], [1, - .76, 6.68], [1, - .8, 6.55], [1, - .84, 6.44], [1, - .87, 6.35], [1, - .89, 6.29], [1, - .91, 6.23], [0, - .92, 6.19]], w = 0; 40 > w; w++)
            v.unshift([0, 0, 0]);
        var x = l.fromValues(1, 0);
        d.prototype = {
            onOpen: function() {
                k.sub(n, this.ui.scene.camera.position, this.ui.axisCenter);
                var a = Math.atan2(n[0], n[2]);
                this.angle = a + Math.PI + Math.PI / 3
            },
            setupTransform: function() {
                m.identity(this.baseMatrix), m.scale(this.baseMatrix, this.baseMatrix, this.scale), this.baseMatrix[12] = this.ui.axisCenter[0], this.baseMatrix[13] = this.ui.axisCenter[1], this.baseMatrix[14] = this.ui.axisCenter[2]
            },
            getCamDot: function() {
                var a = this.ui.scene.camera;
                return o[0] = a.position[0], o[1] = a.position[2], p[0] = this.spot.position[0], p[1] = this.spot.position[2], l.normalize(o, o), l.normalize(p, p), l.dot(o, p)
            },
            isInView: function() {
                var a = this.ui.scene.camera;
                o[0] = a.position[0], o[1] = a.position[2], l.normalize(o, o);
                var b = l.dot(o, x), a = this.ui.scene.camera, c = a._matrix[9];
                return b > .8 && .33 > c
            },
            preRender: function(a) {
                var b = v.length - 1, c = 60 * this.time, d = Math.floor(c%(1.5 * b));
                d > b - 1 && (d = b);
                var e = this.angle + 5e-4 * v[d][1], f = this.azimuth + 5e-4 * v[d][2], g = Math.min(d / 10, (b - d) / 10);
                g > 1 && (g = 1);
                var h = 1 - g;
                g = .7 * g + .22;
                var i = v[d][0];
                if (this.pressing += (i - this.pressing) * a * 15, d > 0 && i && v[d - 1][0]) {
                    var j = v[d][1] - v[d - 1][1];
                    this.ui.scene.env.rrotations[0] -= .0025 * j
                }
                this.spot.setScale(g * (2.2 - .2 * this.pressing)), this.spot.innerColor[3] = .2 + .6 * this.pressing + h, m.fromRotation(q, e, s), m.multiply(q, this.baseMatrix, q), m.fromRotation(r, f - .1, t), m.multiply(q, q, r), this.axis.setMatrix(q), this.grid.setMatrix(q), k.transformMat4(this.spot.position, u, q), this.spot.lookAt(this.ui.axisCenter)
            },
            render: function() {
                var a = this.getCamDot();
                if (this.isOpen() && 0 > a) {
                    var b = this.opening + (1 - this.gopening), c = 2*-b - 1, d = Math.max(0, 1 - Math.abs(4 * b));
                    this.spot.opacity = d, this.glow.strength = (.05 + .05 * this.pressing) * d, this.axis.render(this.ui.scene, 1.3 * c), this.grid.render(this.ui.scene, 1.3 * c), this.spot.render(this.ui.scene), this.glow.render(this.ui.scene)
                }
            }
        }, j.extend(d.prototype), b.exports = d
    }, {
        "../euler-axis": 47,
        "../euler-grid": 48,
        "../glow": 49,
        "../spot": 58,
        "./UI-base": 61,
        "gl-matrix": 113,
        "utils/ease": 90
    }
    ],
    65: [function(a, b, c) {
        function d(a) {
            j.ctor.call(this);
            var b = a.scene.gl;
            this.ui = a, this.duration = s.length / 60 * 1e3, this.opening =- 1, this.gopening = 0, this.pressing = 0, this.time = 0, this.axis = new f(b, Math.PI / 6, Math.PI, 42), this.grid = new g(b, 3, .1275, .085), this.spot = new h(b), this.glow = new i(b), this.spot.radius = .94, this.glow.setScale(4), this.baseMatrix = l.create(), this.angle = 0, this.azimuth = 0, a.scene.root.add(this.axis), a.scene.root.add(this.grid), a.scene.root.add(this.spot), this.spot.add(this.glow)
        }
        for (var e = a("gl-matrix"), f = a("../euler-axis"), g = a("../euler-grid"), h = a("../spot"), i = a("../glow"), j = a("./UI-base"), k = (a("utils/ease"), e.vec3), l = e.mat4, m = e.mat3, n = (e.quat, l.create()), o = l.create(), p = (m.create(), k.fromValues(0, 1, 0)), q = k.fromValues(1, 0, 0), r = k.fromValues(0, 0, 1), s = [[1, .01, 0], [1, - .18, .01], [1, - 1.33, .01], [1, - 3.65, .01], [1, - 7.71, .01], [1, - 15.56, - .19], [1, - 25.43, - .35], [1, - 37.14, - .48], [1, - 50.3, - .58], [1, - 64.63, - .66], [1, - 79.69, - .72], [1, - 95.34, - .78], [1, - 111.46, - .82], [1, - 128.16, - .85], [1, - 145.51, - .68], [1, - 163.6, - .34], [1, - 184.87, .13], [1, - 206.48, .71], [1, - 228.57, 1.17], [1, - 250.25, 1.74], [1, - 270.99, 2.19], [1, - 290.58, 2.76], [1, - 308.85, 3.41], [1, - 326.27, 3.93], [1, - 343, 4.55], [1, - 358.59, 5.04], [1, - 371.86, 5.44], [1, - 382.48, 5.75], [1, - 390.97, 6], [1, - 397.76, 6.21], [1, - 403.2, 6.37], [1, - 407.55, 6.5], [1, - 411.03, 6.6], [1, - 413.81, 6.68], [1, - 416.04, 6.75], [1, - 417.82, 6.8], [1, - 419.24, 6.84], [1, - 420.38, 6.88], [1, - 421.29, 6.91], [1, - 420.82, 6.93], [1, - 416.65, 6.74], [1, - 408.71, 6.2], [1, - 397.15, 5.16], [1, - 382.71, 3.93], [1, - 366.16, 2.75], [1, - 348.11, 1.8], [1, - 329.28, 1.04], [1, - 309.41, .44], [1, - 287.52, - .05], [1, - 264.6, - .43], [1, - 241.47, - .94], [1, - 218.96, - 1.35], [1, - 195.16, - 1.48], [1, - 171.92, - 1.18], [1, - 148.32, - .74], [1, - 123.65, - .39], [1, - 97.5, - .11], [1, - 70.79, .12], [1, - 44.02, .3], [1, - 17.81, .24], [1, 7.17, .19], [1, 31.55, .16], [1, 55.65, .13], [1, 79.13, .11], [1, 103.12, .09], [1, 125.1, .27], [1, 145.7, .82], [1, 165.57, 1.46], [1, 185.47, 2.37], [1, 205.38, 3.5], [1, 224.92, 4.6], [1, 243.15, 5.68], [1, 259.33, 6.75], [1, 273.88, 7.8], [1, 287.11, 9.05], [1, 298.9, 10.24], [1, 308.53, 11.19], [1, 316.24, 11.96], [1, 322.4, 12.57], [1, 327.33, 13.06], [1, 331.28, 13.45], [1, 334.43, 13.76], [1, 336.96, 14.01], [1, 338.98, 14.21], [1, 340.4, 14.37], [1, 341.33, 14.5], [1, 341.27, 14.8], [1, 340.63, 15.25], [1, 339.52, 15.6], [1, 337.63, 15.88], [1, 334.51, 16.11], [1, 329.62, 16.29], [1, 322.71, 16.24], [1, 313.98, 15.99], [1, 303.59, 15.6], [1, 292.09, 15.08], [1, 279.28, 14.47], [1, 265.84, 13.78], [1, 252.08, 13.22], [1, 236.88, 12.18], [1, 223.31, 11.35], [1, 208.26, 10.28], [1, 193.22, 9.43], [1, 178.19, 8.55], [1, 163.76, 7.64], [1, 149.82, 6.91], [1, 136.27, 6.33], [1, 122.83, 5.67], [1, 109.67, 5.14], [1, 96.75, 4.71], [1, 84.81, 4.37], [1, 73.86, 4.1], [1, 64.1, 3.88], [1, 55.69, 3.71], [1, 48.57, 3.57], [1, 42.66, 3.46], [1, 37.94, 3.57], [1, 33.97, 3.66], [1, 30.78, 3.73], [1, 28.24, 3.79], [1, 26.2, 3.83], [1, 24.57, 3.87], [1, 23.27, 3.9], [1, 22.23, 3.92], [1, 21.39, 3.94], [0, 20.73, 3.95], [0, 20.19, 3.97], [0, 19.77, 3.98], [0, 19.43, 3.98], [0, 19.15, 3.99], [0, 18.93, 3.99], [0, 18.76, 4], [0, 18.62, 4], [0, 18.51, 4], [0, 18.42, 4.01], [0, 18.35, 4.01], [0, 18.29, 4.01], [0, 18.24, 4.01], [0, 18.21, 4.01], [0, 18.18, 4.01], [0, 18.15, 4.01], [0, 18.13, 4.01], [0, 18.12, 4.01], [0, 18.11, 4.01], [0, 18.1, 4.01], [0, 18.09, 4.01], [0, 18.08, 4.01], [0, 18.08, 4.01], [0, 18.07, 4.01], [0, 18.07, 4.01], [0, 18.07, 4.01], [0, 18.07, 4.01], [0, 18.07, 4.01], [0, 18.06, 4.01], [0, 18.06, 4.01], [0, 18.06, 4.01], [0, 18.06, 4.01], [0, 18.06, 4.01], [0, 18.06, 4.01], [0, 18.06, 4.01], [0, 18.06, 4.01], [0, 18.06, 4.01], [0, 18.06, 4.01], [0, 18.06, 4.01], [0, 18.06, 4.01], [0, 18.06, 4.01], [0, 18.06, 4.01], [0, 18.06, 4.01], [0, 18.06, 4.01], [0, 18.06, 4.01], [0, 18.06, 4.01], [0, 18.06, 4.01], [0, 18.06, 4.01], [0, 18.06, 4.01], [0, 18.06, 4.01], [0, 18.06, 4.01], [0, 18.06, 4.01], [0, 18.06, 4.01], [0, 18.06, 4.01], [0, 18.06, 4.01], [0, 18.06, 4.01], [0, 18.06, 4.01], [0, 18.06, 4.01], [0, 18.06, 4.01], [0, 18.06, 4.01], [0, 18.06, 4.01], [0, 18.06, 4.01], [0, 18.06, 4.01], [0, 18.06, 4.01], [0, 18.06, 4.01], [0, 18.06, 4.01], [0, 18.06, 4.01], [1, 18.06, 4.01], [1, 18.06, 4.01], [1, 18.06, 4.01], [1, 18.06, 4.01], [1, 17.86, 4.01], [1, 17.1, 2.61], [1, 16.29, - .11], [1, 15.24, - 4.08], [1, 14.21, - 9.66], [1, 12.98, - 16.33], [1, 11.39, - 24.26], [1, 9.53, - 32.8], [1, 7.63, - 41.44], [1, 5.92, - 49.95], [1, 4.35, - 58.56], [1, 2.89, - 68.44], [1, 1.52, - 78.95], [1, .23, - 89.96], [1, - .8, - 101.16], [1, - 1.63, - 111.93], [1, - 2.29, - 122.34], [1, - 2.82, - 132.67], [1, - 3.25, - 142.73], [1, - 3.59, - 152.58], [1, - 3.86, - 162.26], [1, - 4.27, - 171.21], [1, - 4.61, - 178.96], [1, - 5.07, - 185.97], [1, - 5.45, - 191.97], [1, - 5.95, - 197.57], [1, - 6.35, - 202.66], [1, - 6.66, - 206.92], [1, - 6.92, - 210.33], [1, - 7.12, - 213.07], [1, - 7.29, - 215.25], [1, - 7.42, - 217], [1, - 7.52, - 218.39], [1, - 7.61, - 219.51], [1, - 7.67, - 220.41], [1, - 7.73, - 221.12], [1, - 7.77, - 221.7], [1, - 7.8, - 222.15], [1, - 7.83, - 222.52], [1, - 7.85, - 222.81], [1, - 7.87, - 223.05], [1, - 7.89, - 223.24], [1, - 7.9, - 223.39], [1, - 7.91, - 223.51], [1, - 7.91, - 222.6], [1, - 7.92, - 220.48], [1, - 7.92, - 216.98], [1, - 7.73, - 210.18], [1, - 7.17, - 201.34], [1, - 6.52, - 190.47], [1, - 6.01, - 177.37], [1, - 5.59, - 162.7], [1, - 5.26, - 146.35], [1, - 5, - 128.88], [1, - 4.59, - 110.9], [1, - 4.06, - 92.72], [1, - 3.63, - 74.37], [1, - 3.3, - 56.29], [1, - 2.43, - 37.63], [1, - 1.73, - 19.9], [1, - 1.17, - 2.92], [1, - .52, 13.47], [1, .19, 29.58], [1, .97, 45.66], [1, 1.58, 61.53], [1, 2.28, 77.23], [1, 3.03, 92.39], [1, 3.84, 106.91], [1, 4.68, 120.93], [1, 5.36, 134.35], [1, 5.9, 147.48], [1, 6.33, 158.79], [1, 6.68, 168.43], [1, 6.95, 176.15], [1, 7.17, 182.52], [1, 7.35, 187.62], [1, 7.49, 191.7], [1, 7.61, 194.96], [1, 7.7, 197.57], [1, 7.77, 199.66], [1, 7.83, 201.33], [1, 7.87, 202.67], [1, 7.91, 203.74], [1, 7.94, 204.59], [1, 7.96, 205.28], [1, 7.98, 205.82], [1, 8, 206.26], [1, 8.01, 206.61], [1, 8.02, 206.29], [1, 8.03, 205.44], [1, 7.83, 203.95], [1, 7.48, 201.97], [1, 6.99, 199.18], [1, 6.41, 195.34], [1, 5.94, 189.48], [1, 5.56, 183.18], [1, 5.26, 176.35], [1, 5.02, 169.08], [1, 4.83, 161.47], [1, 4.67, 153.98], [1, 4.55, 146.39], [1, 4.45, 138.71], [1, 4.37, 130.77], [1, 4.51, 122.62], [1, 4.82, 114.1], [1, 5.27, 104.08], [1, 5.63, 94.27], [1, 5.91, 84.82], [1, 6.14, 76.06], [1, 6.53, 68.05], [1, 6.83, 60.84], [1, 7.08, 54.28], [1, 7.27, 48.62], [1, 7.43, 43.7], [1, 7.56, 39.76], [1, 7.66, 36.61], [1, 7.74, 34.09], [1, 7.8, 32.08], [1, 7.85, 30.27], [1, 7.89, 28.42], [1, 7.93, 26.14], [1, 7.95, 24.11], [1, 7.97, 22.49], [1, 7.99, 21], [1, 8, 19.4], [1, 8.02, 17.52], [1, 8.02, 15.42], [1, 8.03, 13.54], [1, 8.04, 12.03], [1, 8.04, 10.83], [1, 8.04, 9.87], [1, 8.05, 9.1], [1, 8.05, 8.48], [1, 8.05, 7.99], [1, 8.05, 7.59], [1, 8.05, 7.28], [1, 8.06, 7.02], [1, 8.06, 6.82], [1, 8.06, 6.66], [0, 8.06, 6.53]], t = 0; 40 > t; t++)
            s.unshift([0, 0, 0]);
        var u = k.fromValues(Math.sin(.001), 0, Math.cos(.001)), v = k.fromValues(0, Math.sin(.001), Math.cos(.001)), w = k.create(), x = k.create(), y = l.create();
        y[14] = 1, d.prototype = {
            onOpen: function() {
                k.sub(w, this.ui.scene.camera.position, this.ui.axisCenter);
                var a = Math.atan2(w[0], w[2]);
                this.angle = a + Math.PI / 4
            },
            setupTransform: function() {
                l.identity(this.baseMatrix), l.scale(this.baseMatrix, this.baseMatrix, this.ui.axisScale), this.baseMatrix[12] = this.ui.axisCenter[0], this.baseMatrix[13] = this.ui.axisCenter[1], this.baseMatrix[14] = this.ui.axisCenter[2]
            },
            preRender: function(a) {
                var b = s.length - 1, c = 60 * this.time, d = Math.floor(c%(1.5 * b));
                d > b - 1 && (d = b);
                var e = this.angle + 5e-4 * s[d][1], f = this.azimuth + 5e-4 * s[d][2], g = s[d][0];
                this.pressing += (g - this.pressing) * a * 15;
                var h = Math.min(d / 10, (b - d) / 10);
                if (h > 1 && (h = 1), this.spot.innerColor[3] = .2 + .6 * this.pressing + (1 - h), h = .55 * h + .19, this.spot.setScale(h * (1.2 - .1 * this.pressing)), d > 0 && g && s[d - 1][0]) {
                    var i = s[d][1] - s[d - 1][1], j = s[d][2] - s[d - 1][2];
                    this.ui.scene.orbit.rotations[0] += 6e-4 * i, this.ui.scene.orbit.rotations[1] -= 6e-4 * j
                }
                l.fromRotation(n, e, p), l.multiply(n, this.baseMatrix, n), l.fromRotation(o, f, q), l.multiply(n, n, o), this.axis.setMatrix(n), this.grid.setMatrix(n), k.transformMat4(this.spot.position, r, n), k.transformMat4(w, u, n), k.transformMat4(x, v, n), k.sub(w, w, this.spot.position), k.sub(x, x, this.spot.position), k.cross(w, w, x), k.add(w, w, this.spot.position), this.spot.lookAt(w), this.spot.invalidate()
            },
            render: function() {
                if (this.isOpen()) {
                    var a = this.opening + (1 - this.gopening), b = 2*-a - 1, c = Math.max(0, 1 - Math.abs(4 * a));
                    this.spot.opacity = c, this.glow.strength = (.1 + .1 * this.pressing) * c, this.axis.render(this.ui.scene, b), this.grid.render(this.ui.scene, b), this.spot.render(this.ui.scene), this.glow.render(this.ui.scene)
                }
            }
        }, j.extend(d.prototype), b.exports = d
    }, {
        "../euler-axis": 47,
        "../euler-grid": 48,
        "../glow": 49,
        "../spot": 58,
        "./UI-base": 61,
        "gl-matrix": 113,
        "utils/ease": 90
    }
    ],
    66: [function(a, b, c) {
        function d(a) {
            this.ibl = null, this.prg = null, this._mask = 1, this.inputs = new h, this.iColor = this.inputs.add(new g("color", 4)), this.inputs.add(i.isReaveling.createProxy()), this.config = new e, this._prgcache = f.getCache(a), this._uid = "std", this._precision = "highp", this._vertSrc = "#define GLSLIFY 1\n#pragma SLOT pv\n\nattribute vec3 aPosition;\n\nuniform mat4 uMVP;\n\nvoid main( void ){\n\n  #pragma SLOT v\n\n  vec4 pos = vec4( aPosition, 1.0 );\n\n  gl_Position    = uMVP * pos;\n\n}", this._fragSrc = "#define GLSLIFY 1\n\n#pragma SLOT pf\n\n//                MAIN\n// ===================\n\nvoid main( void ){\n\n  #pragma SLOT f\n\n  gl_FragColor = color();\n\n}"
        }
        var e = (a("nanogl/program"), a("nanogl-state/config")), f = a("nanogl-pbr/lib/program-cache"), g = a("nanogl-pbr/lib/input"), h = (a("nanogl-pbr/lib/flag"), a("nanogl-pbr/lib/chunks-tree")), i = a("entities/RevealModel"), j = a("gl-matrix").mat4, k = j.create();
        d.prototype = {
            prepare: function(a, b) {
                this._isDirty() && this.compile();
                var c = this.prg;
                c.use(), c.setupInputs(this), i.setupProgram(c, a._wmatrix), b.modelViewProjectionMatrix(k, a._wmatrix), c.uMVP(k)
            },
            prepareShadow: function(a, b) {},
            _isDirty: function() {
                return null === this.prg || this.inputs._isDirty ? (console.log("dirty input"), !0) : !1
            },
            compile: function() {
                null !== this.prg && this._prgcache.release(this.prg), this.prg = this._prgcache.compile(this)
            }
        }, b.exports = d
    }, {
        "entities/RevealModel": 42,
        "gl-matrix": 113,
        "nanogl-pbr/lib/chunks-tree": 138,
        "nanogl-pbr/lib/flag": 140,
        "nanogl-pbr/lib/input": 141,
        "nanogl-pbr/lib/program-cache": 146,
        "nanogl-state/config": 151,
        "nanogl/program": 160
    }
    ],
    67: [function(a, b, c) {
        function d(a) {
            this.ibl = null, this.prg = null, this._mask = 1, this.inputs = new i, this.iAlbedo = this.inputs.add(new g("albedo", 3)), this.iSpecular = this.inputs.add(new g("specular", 3)), this.iGloss = this.inputs.add(new g("gloss", 1)), this.iNormal = this.inputs.add(new g("normal", 3)), this.iOcclusion = this.inputs.add(new g("occlusion", 1)), this.iCavity = this.inputs.add(new g("cavity", 1)), this.iCavityStrength = this.inputs.add(new g("cavityStrength", 2)), this.iClearcoat = this.inputs.add(new g("clearcoat", 2)), this.iFresnel = this.inputs.add(new g("fresnel", 3)), this.conserveEnergy = this.inputs.add(new h("conserveEnergy", !1)), this.perVertexIrrad = this.inputs.add(new h("perVertexIrrad", !0)), this.glossNearest = this.inputs.add(new h("glossNearest", !0)), this.inputs.add(l.isReaveling.createProxy()), this.config = new e, this._prgcache = f.getCache(a), this._uid = "std", this._precision = "highp", this._vertSrc = '#define GLSLIFY 1\n#pragma SLOT pv\n\nattribute vec3 aPosition;\nattribute vec2 aTexCoord;\nattribute vec3 aNormal;\nattribute vec3 aTangent;\nattribute vec3 aBitangent;\n\nuniform mat4 uMVP;\nuniform mat4 uWorldMatrix;\nuniform mat4 uM;\n\nuniform float uDisplacementX;\nuniform float uDisplacementStrength;\nuniform float uDisplacementOffset;\nuniform float uDisplacementSlope;\n\nvarying vec2 vTexCoord;\nvarying vec3 vWorldPosition;\n\nvarying mediump vec3 vWorldNormal;\n\n#if HAS_normal\n  varying mediump vec3 vWorldTangent;\n  varying mediump vec3 vWorldBitangent;\n#endif\n\n#if perVertexIrrad\n  varying vec3 vIrradiance;\n  uniform vec4 uSHCoeffs[7];\n  \n// ================================\n// compute Spherical Harmonics\n// ================================\n//\n// "Stupid Spherical Harmonics (SH) Tricks"\n// http://www.ppsloan.org/publications/StupidSH36.pdf\n//\n//\nvec3 SampleSH( vec3 Normal, vec4 shCoefs[7] )\n{\n  Normal.xz = Normal.zx;\n  vec4 NormalVector = vec4(Normal, 1.0);\n\n  // todo transpose coeffs directly\n  // NormalVector.xyz = NormalVector.zyx;\n\n  vec3 X0, X1, X2;\n  X0.x = dot( shCoefs[0].xyz, Normal) + shCoefs[0].w;\n  X0.y = dot( shCoefs[1].xyz, Normal) + shCoefs[1].w;\n  X0.z = dot( shCoefs[2].xyz, Normal) + shCoefs[2].w;\n\n  vec4 vB = NormalVector.zyxx * NormalVector.yxxz;\n  X1.x = dot( shCoefs[3].xyz, vB.xyz) + (shCoefs[3].w * vB.w);\n  X1.y = dot( shCoefs[4].xyz, vB.xyz) + (shCoefs[4].w * vB.w);\n  X1.z = dot( shCoefs[5].xyz, vB.xyz) + (shCoefs[5].w * vB.w);\n\n  float vC = NormalVector.z * NormalVector.z - NormalVector.y * NormalVector.y;\n  X2 =  shCoefs[6].xyz * vC;\n\n  return ( X0 + X1 + X2 );\n//  return max( vec3(0.0) , X0 + X1 + X2 );\n}\n\n#endif\n\nvec3 rotate( mat4 m, vec3 v )\n{\n  return m[0].xyz*v.x + m[1].xyz*v.y + m[2].xyz*v.z;\n}\n\nvoid main( void ){\n\n  #pragma SLOT v\n\n  vWorldPosition = (uWorldMatrix * vec4(aPosition, 1.0)).xyz;\n  vec3 p = aPosition;\n\n  #ifdef isRevealing\n    #if isRevealing\n      vec3 worldPosition = (uM * vec4(aPosition, 1.0)).xyz;\n      float progress = (worldPosition.x - uDisplacementX + uDisplacementOffset) * uDisplacementSlope;\n      progress = exp(-progress*progress) * (uDisplacementStrength * ( 1.0 - ((uDisplacementX + 25.0)/50.0) ));\n      p += vec3(aNormal) * progress;\n    #endif\n  #endif\n\n  gl_Position    = uMVP         * vec4(p, 1.0);\n\n  vWorldNormal    = rotate( uWorldMatrix, aNormal );\n  #if HAS_normal\n    vWorldTangent   = rotate( uWorldMatrix, aTangent );\n    vWorldBitangent = rotate( uWorldMatrix, aBitangent );\n  #endif\n\n  #if perVertexIrrad\n    vIrradiance = SampleSH(vWorldNormal, uSHCoeffs );\n    #if HAS_iblExpo\n      vIrradiance = iblExpo().x * pow( vIrradiance, vec3( iblExpo().y ) );\n    #endif\n  #endif\n\n  vTexCoord = aTexCoord;\n}', this._fragSrc = '#define GLSLIFY 1\n\nuniform vec3 uCameraPosition;\n\nvarying vec2 vTexCoord;\nvarying vec3 vWorldPosition;\n\nvarying mediump vec3 vWorldNormal;\n\n#pragma SLOT pf\n\n#if HAS_normal\n  varying mediump vec3 vWorldTangent;\n  varying mediump vec3 vWorldBitangent;\n#endif\n\n// IBL\n// ========\n\nuniform sampler2D tEnv;\nuniform sampler2D tEnvHi;\n\n#if perVertexIrrad\n  varying vec3 vIrradiance;\n#else\n  uniform vec4 uSHCoeffs[7];\n  \n// ================================\n// compute Spherical Harmonics\n// ================================\n//\n// "Stupid Spherical Harmonics (SH) Tricks"\n// http://www.ppsloan.org/publications/StupidSH36.pdf\n//\n//\nvec3 SampleSH( vec3 Normal, vec4 shCoefs[7] )\n{\n  Normal.xz = Normal.zx;\n  vec4 NormalVector = vec4(Normal, 1.0);\n\n  // todo transpose coeffs directly\n  // NormalVector.xyz = NormalVector.zyx;\n\n  vec3 X0, X1, X2;\n  X0.x = dot( shCoefs[0].xyz, Normal) + shCoefs[0].w;\n  X0.y = dot( shCoefs[1].xyz, Normal) + shCoefs[1].w;\n  X0.z = dot( shCoefs[2].xyz, Normal) + shCoefs[2].w;\n\n  vec4 vB = NormalVector.zyxx * NormalVector.yxxz;\n  X1.x = dot( shCoefs[3].xyz, vB.xyz) + (shCoefs[3].w * vB.w);\n  X1.y = dot( shCoefs[4].xyz, vB.xyz) + (shCoefs[4].w * vB.w);\n  X1.z = dot( shCoefs[5].xyz, vB.xyz) + (shCoefs[5].w * vB.w);\n\n  float vC = NormalVector.z * NormalVector.z - NormalVector.y * NormalVector.y;\n  X2 =  shCoefs[6].xyz * vC;\n\n  return ( X0 + X1 + X2 );\n//  return max( vec3(0.0) , X0 + X1 + X2 );\n}\n\n#endif\n\n// ClearCoat\n// ========\n\n// const float uClearCoat = 0.5;\n// uniform float uClearCoat;\n\n// MATH\n// =========\n#define saturate(x) clamp( x, 0.0, 1.0 )\n#define sdot( a, b ) saturate( dot(a,b) )\n\n// INCLUDES\n// =========\n\nvec2 octwrapDecode( vec3 v ) {\n  // Project the sphere onto the octahedron, and then onto the xy plan\n  vec2 p = v.xy / dot(  abs( v ) , vec3(1.0) );\n  p = vec2( p.x+p.y-1.0, p.x-p.y );\n\n  if( v.z < 0.0 )\n    p.x *= -1.0;\n\n  // p.x *= sign( v.z );\n  return p;\n}\n\nvec3 decodeRGBE( vec4 hdr ){\n  return hdr.rgb * exp2( (hdr.a*255.0)-128.0 );\n  // return hdr.rgb * pow( 2.0, (hdr.a*255.0)-128.0 );\n}\n\nconst vec2 _IBL_UVM_529295689 = vec2(\n  0.25*(254.0/256.0),\n  0.125*0.5*(254.0/256.0)\n);\n\nvec3 SpecularIBL( sampler2D tEnv, vec3 skyDir, float roughness)\n{\n\n  vec2 uvA = octwrapDecode( skyDir );\n\n  float r7 = 7.0*roughness;\n  uvA = uvA * _IBL_UVM_529295689 + vec2(\n      0.5,\n      0.125*0.5 + 0.125 * ( r7 - fract( r7 ) )\n    );\n\n  #if glossNearest\n\n    return decodeRGBE( texture2D(tEnv,uvA) );\n\n  #else\n\n    vec2 uvB=uvA+vec2(0.0,0.125);\n    return  mix(\n      decodeRGBE( texture2D(tEnv,uvA) ),\n      decodeRGBE( texture2D(tEnv,uvB) ),\n      frac\n    );\n\n  #endif\n\n}\n\nvec3 SampleEnvHi( sampler2D tEnv, vec3 skyDir )\n{\n\n  vec2 uvA = octwrapDecode( skyDir );\n\n  uvA = vec2(\n    0.25*(254.0/256.0),\n    0.5 *(254.0/256.0)\n    ) * uvA + vec2(0.5,0.5);\n\n  return decodeRGBE( texture2D(tEnv,uvA) );\n}\n\n// Schlick approx\n// [Schlick 1994, "An Inexpensive BRDF Model for Physically-Based Rendering"]\n// https://github.com/EpicGames/UnrealEngine/blob/dff3c48be101bb9f84633a733ef79c91c38d9542/Engine/Shaders/BRDF.usf\nvec3 F_Schlick( float VoH,vec3 spec,float glo )\n{\n  float dot = 1.0-VoH;\n  dot = dot*dot*dot*dot*dot;\n  dot *= glo*glo;\n  #if HAS_fresnel\n    return( 1.0 - dot )*spec + dot*fresnel();\n  #else\n    return( 1.0 - dot )*spec + dot;\n  #endif\n}\n\n// ------------------------------\n//\n\n#if HAS_normal\nvec3 perturbWorldNormal(vec3 n){\n  n = 2.0*n - 1.0;\n  vec3 nrm = gl_FrontFacing ? vWorldNormal : -vWorldNormal;\n  return normalize(vWorldTangent * n.x + vWorldBitangent*n.y + nrm * n.z );\n}\n#endif\n\n// ------------------------------\n//\nvec3 toneMap(vec3 c){\n  vec3 sqrtc = sqrt( c );\n  return(sqrtc-sqrtc*c) + c*(0.4672*c+vec3(0.5328));\n}\n\n//                MAIN\n// ===================\n\nvoid main( void ){\n\n  #pragma SLOT f\n\n  // -----------\n  vec3 worldNormal =\n    #if HAS_normal\n      perturbWorldNormal( normal() );\n    #else\n      gl_FrontFacing ? vWorldNormal : -vWorldNormal;\n    #endif\n  worldNormal = normalize( worldNormal );\n\n  // SH Irradiance diffuse coeff\n  // -------------\n  #if perVertexIrrad\n    vec3 diffuseCoef = vIrradiance;\n  #else\n    vec3 diffuseCoef=SampleSH(worldNormal, uSHCoeffs );\n    #if HAS_iblExpo\n      diffuseCoef = iblExpo().x * pow( diffuseCoef, vec3( iblExpo().y ) );\n    #endif\n  #endif\n\n  // IBL reflexion\n  // --------------\n\n  // ClearCoat\n  // ---------------\n  vec3 viewDir = normalize( uCameraPosition - vWorldPosition );\n  vec3 worldReflect = reflect( -viewDir, worldNormal );\n  float VoH = sdot( viewDir, worldNormal );\n\n  float Fc = 1.0 - VoH;\n  Fc = Fc * Fc * Fc * Fc * Fc; \n  float F = Fc + ( 1.0 - Fc ) * clearcoat().y;\n  F *= clearcoat().x;\n\n  vec3 ccSpecular = F * SampleEnvHi( tEnvHi, worldReflect );\n  vec3 specularColor = SpecularIBL( tEnv, worldReflect, 1.0-gloss() );\n\n  \n  #if HAS_iblExpo\n    ccSpecular    = iblExpo().x * pow( ccSpecular,    vec3( iblExpo().y ) );\n    specularColor = iblExpo().x * pow( specularColor, vec3( iblExpo().y ) );\n  #endif\n\n  vec3 specularSq = specular()*specular() * (1.0-F);\n\n  Fc *= gloss()*gloss();\n\n  #if HAS_fresnel\n    specularColor *= Fc*fresnel() + ( 1.0 - Fc ) * specularSq;\n  #else\n    specularColor *= Fc + ( 1.0 - Fc ) * specularSq;\n  #endif\n\n  specularColor = ccSpecular + specularColor;\n\n  #pragma SLOT lightsf\n\n  #if HAS_occlusion\n    diffuseCoef *= occlusion();\n  #endif\n\n  #if HAS_cavity\n    diffuseCoef   *= cavity() * cavityStrength().r + (1.0-cavityStrength().r);\n    specularColor *= cavity() * cavityStrength().g + (1.0-cavityStrength().g);\n  #endif\n\n  vec3 alb = albedo();\n  #if conserveEnergy\n    alb = alb - alb * specular();\n  #endif\n  vec3 albedoSq = alb*alb;\n\n  gl_FragColor.xyz = toneMap( diffuseCoef*albedoSq + specularColor );\n  gl_FragColor.a = 1.0;\n\n}'
        }
        var e = (a("nanogl/program"), a("nanogl-state/config")), f = a("nanogl-pbr/lib/program-cache"), g = a("nanogl-pbr/lib/input"), h = a("nanogl-pbr/lib/flag"), i = a("nanogl-pbr/lib/chunks-tree"), j = a("gl-matrix").mat4, k = j.create(), l = a("entities/RevealModel");
        d.prototype = {
            setIBL: function(a) {
                this.ibl = a, this.inputs.addChunks(a.getChunks())
            },
            setLightSetup: function(a) {
                this.inputs.addChunks(a.getChunks())
            },
            prepare: function(a, b) {
                this._isDirty() && this.compile();
                var c = this.prg;
                c.use(), c.setupInputs(this), this.ibl.setupProgram(c), l.setupProgram(c, a._wmatrix), b.modelViewProjectionMatrix(k, a._wmatrix), c.uMVP(k), c.uWorldMatrix(a._wmatrix), c.uCameraPosition(b._wposition)
            },
            prepareShadow: function(a, b) {},
            _isDirty: function() {
                return null === this.prg || this.inputs._isDirty ? (console.log("dirty input"), !0) : !1
            },
            compile: function() {
                null !== this.prg && this._prgcache.release(this.prg), this.prg = this._prgcache.compile(this)
            }
        }, b.exports = d
    }, {
        "entities/RevealModel": 42,
        "gl-matrix": 113,
        "nanogl-pbr/lib/chunks-tree": 138,
        "nanogl-pbr/lib/flag": 140,
        "nanogl-pbr/lib/input": 141,
        "nanogl-pbr/lib/program-cache": 146,
        "nanogl-state/config": 151,
        "nanogl/program": 160
    }
    ],
    68: [function(a, b, c) {
        function d(a) {
            this._vertSrc = "precision highp float;\n#define GLSLIFY 1\n\nattribute vec3 aPosition;\nattribute vec3 aNormal;\n\nuniform mat4 uMVP;\nuniform mat4 uM;\nuniform float uDisplacementX;\nuniform float uDisplacementStrength;\nuniform float uDisplacementOffset;\nuniform float uDisplacementSlope;\n\nvarying vec4 vPos;\nvarying vec3 vNormal;\n\nvoid main( void ){\n\n  vec3 vWorldPosition = (uM * vec4(aPosition, 1.0)).xyz;\n  vec3 p = aPosition;\n  float progress = (vWorldPosition.x - uDisplacementX + uDisplacementOffset) * uDisplacementSlope;\n  progress = exp(-progress*progress) * (uDisplacementStrength * ( 1.0 - ((uDisplacementX + 25.0)/50.0) ));\n  p += vec3(aNormal) * progress;\n\n  vec4 pos        = vec4( p, 1.0 );\n  vec4 glPosition = uMVP * pos;\n  gl_Position     = glPosition;\n\n  vPos = uM * pos;\n  vPos.x = -vPos.x;\n  vNormal = mat3(uM) * aNormal;\n\n}", this._fragSrc = "precision highp float;\n#define GLSLIFY 1\n\nuniform float uCut;\nuniform sampler2D uSampler;\nuniform float uOffsetWhite;\n\nuniform float uRangeMapping;\nuniform float uYMapping;\n\nvarying vec4 vPos;\nvarying vec3 vNormal;\n\nfloat map(float value, float inMin, float inMax, float outMin, float outMax) {\n  return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);\n}\n\nvec4 depthCutTexture( sampler2D texture, vec4 pos, vec3 normal, float RANGEX, float RANGEY )\n{\n\n  float RANGE = RANGEX;\n  vec3  absNormal        = abs(normal);\n  float thresholdNormal = 0.8;\n\n  float isZMapping  = step(absNormal.y, thresholdNormal);\n  float isYMapping  = step(thresholdNormal, absNormal.y);\n  float isXMapping  = step(thresholdNormal, absNormal.x);\n\n  float uvXZMapping    = (pos.x - abs(isXMapping * pos.z * 0.7) + RANGE) / (RANGE * 2.0);\n  float uvYZMapping    = (pos.y)/RANGEY;\n\n  float uvXYMapping     = uvXZMapping;\n  float uvYYMapping     = (pos.z + RANGE) / (RANGE * 2.0);\n\n  float uvXXMapping    = ( pos.x - pos.y )/RANGEY;\n  float uvYXMapping    = uvYYMapping;\n\n  vec2 uv = vec2(0.0);\n  uv.x = uvXZMapping * (isZMapping) + uvXYMapping * isYMapping;\n  uv.y = uvYZMapping * (isZMapping) + uvYYMapping * isYMapping;\n\n  return texture2D(texture, uv);\n\n}\n\nvoid main( void ){\n\n  float progress = map(uCut, 0.0, 1.0, 0.0, 1.0 + uOffsetWhite);\n\n  vec4 color = depthCutTexture(uSampler, vPos, vNormal, uRangeMapping, uYMapping);\n\n  // ANIMS SWITCH\n  bool TRIANGLES_ENTER  = (color.g < 1.0 * (1.0 - progress));\n  if( TRIANGLES_ENTER )\n    discard;\n\n  gl_FragColor = vec4(1.0, 0.0, 0.5, 1.0);\n\n}", this.prg = new e(a), this.prg.compile(this._vertSrc, this._fragSrc), this.prg.use(), this.rootNode = null
        }
        var e = a("nanogl/program"), f = a("entities/RevealModel"), g = a("gl-matrix").mat4, h = g.create();
        d.prototype = {
            setMaskTexture: function(a) {
                this.maskTexture = a
            },
            prepare: function(a, b) {
                var c = this.prg;
                c.use(), f.setupProgram(c, a._wmatrix), f.maskTexture && (f.maskTexture.bind(), c.uSampler(f.maskTexture)), b.modelViewProjectionMatrix(h, a._wmatrix), c.uMVP(h)
            }
        }, b.exports = d
    }, {
        "entities/RevealModel": 42,
        "gl-matrix": 113,
        "nanogl/program": 160
    }
    ],
    69: [function(a, b, c) {
        function d(a) {
            g.call(this, a), this.time = 0, this.iTime = this.inputs.add(new e("time", 1, e.VERTEX)), this.iCavity = this.inputs.add(new e("cavity", 1)), this.iDiffuse = this.inputs.add(new e("diffuse", 3)), this.iNormal = this.inputs.add(new e("normal", 3)), this.iShow = this.inputs.add(new e("show", 1)), this.iGloss = this.inputs.add(new e("gloss", 1)), this.glossNearest = this.inputs.add(new f("glossNearest", !0)), this.iGloss.attachConstant(.5), this._vertSrc = "#define GLSLIFY 1\n#pragma SLOT pv\n\nattribute vec3 aPosition;\nattribute vec3 aNormal;\nattribute vec2 aTexCoord;\nattribute vec2 aTexCoord1;\n\nattribute vec3 aTangent;\nattribute vec3 aBitangent;\n\nuniform mat4 uMVP;\nuniform mat4 uWorldMatrix;\n\nvarying mediump vec3 vWorldNormal;\nvarying vec3 vWorldPosition;\n\nvarying vec2 vGradientUvs;\nvarying vec2 vCavityTexCoord;\nvarying vec2 vDiffuseTexCoord;\n\n#if HAS_normal\n  varying mediump vec3 vWorldTangent;\n  varying mediump vec3 vWorldBitangent;\n#endif\n\nvoid main( void ){\n\n  #pragma SLOT v\n\n  vec4 pos = vec4( aPosition, 1.0 );\n\n  gl_Position    = uMVP * pos;\n  vWorldNormal    = mat3( uWorldMatrix ) * aNormal;\n  vWorldPosition = (uWorldMatrix * pos).xyz;\n\n  #if HAS_normal\n    vWorldTangent   = mat3( uWorldMatrix ) * aTangent;\n    vWorldBitangent = mat3( uWorldMatrix ) * aBitangent;\n  #endif\n\n  vec2 cavityTexCoord = aTexCoord;\n\n  vec2 diffuseTexCoord = aTexCoord1;\n  diffuseTexCoord.x -= (time()/6.68);\n  diffuseTexCoord   *= 3.5;\n\n  vCavityTexCoord  = cavityTexCoord;\n  vDiffuseTexCoord = diffuseTexCoord;\n  vGradientUvs     = aTexCoord1 * 2.0 - 1.0;\n  // vGradientUvs.y   *= 1.0;\n\n}", this._fragSrc = "#define GLSLIFY 1\nvarying vec2 vCavityTexCoord;\nvarying vec2 vDiffuseTexCoord;\nvarying vec2 vGradientUvs;\n\nuniform vec3 uCameraPosition;\nvarying mediump vec3 vWorldNormal;\nvarying vec3 vWorldPosition;\n\nuniform sampler2D tEnv;\n\n#pragma SLOT pf\n\n#if HAS_normal\n  varying mediump vec3 vWorldTangent;\n  varying mediump vec3 vWorldBitangent;\n#endif\n\n//                MAIN\n// ===================\nfloat map(float value, float inMin, float inMax, float outMin, float outMax) {\n  return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);\n}\n\nvec2 octwrapDecode( vec3 v ) {\n  // Project the sphere onto the octahedron, and then onto the xy plan\n  vec2 p = v.xy / dot(  abs( v ) , vec3(1.0) );\n  p = vec2( p.x+p.y-1.0, p.x-p.y );\n\n  if( v.z < 0.0 )\n    p.x *= -1.0;\n\n  // p.x *= sign( v.z );\n  return p;\n}\n\nvec3 decodeRGBE( vec4 hdr ){\n  return hdr.rgb * exp2( (hdr.a*255.0)-128.0 );\n  // return hdr.rgb * pow( 2.0, (hdr.a*255.0)-128.0 );\n}\n\nconst vec2 _IBL_UVM_1117569599 = vec2(\n  0.25*(254.0/256.0),\n  0.125*0.5*(254.0/256.0)\n);\n\nvec3 SpecularIBL( sampler2D tEnv, vec3 skyDir, float roughness)\n{\n\n  vec2 uvA = octwrapDecode( skyDir );\n\n  float r7 = 7.0*roughness;\n  uvA = uvA * _IBL_UVM_1117569599 + vec2(\n      0.5,\n      0.125*0.5 + 0.125 * ( r7 - fract( r7 ) )\n    );\n\n  #if glossNearest\n\n    return decodeRGBE( texture2D(tEnv,uvA) );\n\n  #else\n\n    vec2 uvB=uvA+vec2(0.0,0.125);\n    return  mix(\n      decodeRGBE( texture2D(tEnv,uvA) ),\n      decodeRGBE( texture2D(tEnv,uvB) ),\n      frac\n    );\n\n  #endif\n\n}\n\n// ------------------------------\n//\n\n#if HAS_normal\nvec3 perturbWorldNormal(vec3 n){\n  n = 2.0*n - 1.0;\n  vec3 nrm = gl_FrontFacing ? vWorldNormal : -vWorldNormal;\n  return normalize(vWorldTangent * n.x * .5 + vWorldBitangent*n.y*.5 + nrm * n.z );\n}\n#endif\n\nvoid main( void ){\n\n  #pragma SLOT f\n\n  // -----------\n  vec3 worldNormal =\n    #if HAS_normal\n      perturbWorldNormal( normal() );\n    #else\n      gl_FrontFacing ? vWorldNormal : -vWorldNormal;\n    #endif\n  worldNormal = normalize( worldNormal );\n\n  // reflection\n  \n  vec3 viewDir = normalize( uCameraPosition - vWorldPosition );\n  vec3 worldReflect = reflect( -viewDir, worldNormal );\n\n  vec3 specularColor = SpecularIBL( tEnv, worldReflect, 1.0-gloss() );\n\n  // ----------------\n\n  float s = map(show(), 0.0, 1.0, 0.0, 0.5);\n\n  vec3 lightDir = normalize( vec3( 0.0, 1.0, 1.0 ) );\n  float lighting = dot( lightDir, worldNormal );\n  lighting = 1.4*pow( lighting, 2.0 );\n  vec3 color = vec3( lighting ) * (.3 + .7* diffuse() );\n  color = mix(vec3(1.0), color, s);\n\n  // gradient\n\n  float dist = length(vGradientUvs) / show() / 2.5;\n  float grad = clamp( ( dist-.1 ) , 0.0, 1.0 );\n\n  color += grad;\n\n  float cav = mix(1.0, cavity(), show());\n\n  gl_FragColor.rgb = ( color+ specularColor*.05) * cav;\n  gl_FragColor.a = 1.0;\n\n}", this.config.enableCullface(), this.config.enableBlend(), this.config.blendFunc(a.ZERO, a.SRC_COLOR), this.config.enableDepthTest(), this.config.depthMask(!1)
        }
        var e = (a("nanogl/program"), a("nanogl-state/config"), a("nanogl-pbr/lib/program-cache"), a("nanogl-pbr/lib/input")), f = a("nanogl-pbr/lib/flag"), g = (a("nanogl-pbr/lib/chunks-tree"), a("gl/BasicMaterial")), h = a("gl-matrix").mat4.create();
        d.prototype = Object.create(g.prototype), d.prototype.setIBL = function(a) {
            this.ibl = a
        }, d.prototype.prepare = function(a, b) {
            this._isDirty() && this.compile();
            var c = this.prg;
            c.use(), c.setupInputs(this), this.ibl.setupProgram(c), b.modelViewProjectionMatrix(h, a._wmatrix), c.uMVP(h), c.uWorldMatrix(a._wmatrix), c.uCameraPosition(b._wposition)
        }, b.exports = d
    }, {
        "gl-matrix": 113,
        "gl/BasicMaterial": 66,
        "nanogl-pbr/lib/chunks-tree": 138,
        "nanogl-pbr/lib/flag": 140,
        "nanogl-pbr/lib/input": 141,
        "nanogl-pbr/lib/program-cache": 146,
        "nanogl-state/config": 151,
        "nanogl/program": 160
    }
    ],
    70: [function(a, b, c) {
        function d(a) {
            this._vertSrc = "precision highp float;\n#define GLSLIFY 1\n\nattribute vec3 aPosition;\nattribute vec3 aNormal;\n\nuniform mat4 uMVP;\nuniform mat4 uM;\nuniform float uCut;\nuniform float uDisplacementX;\nuniform float uDisplacementStrength;\nuniform float uDisplacementOffset;\nuniform float uDisplacementSlope;\n\nvarying vec4 vPos;\nvarying vec3 vNormal;\n\nfloat map(float value, float inMin, float inMax, float outMin, float outMax) {\n  return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);\n}\n\nvoid main( void ){\n\n  vec3 vWorldPosition = (uM * vec4(aPosition, 1.0)).xyz;\n  vec3 p = aPosition;\n  float progress = (vWorldPosition.x - uDisplacementX + uDisplacementOffset) * uDisplacementSlope;\n  progress = exp(-progress*progress) * (uDisplacementStrength * ( 1.0 - ((uDisplacementX + 25.0)/50.0) ));\n  p += vec3(aNormal) * progress;\n\n  vec4 pos        = vec4( p, 1.0 );\n\n  vec4 glPosition = uMVP * pos;\n  gl_Position     = glPosition;\n\n  vPos = uM * pos;\n  vPos.x = -vPos.x;\n  vNormal = mat3(uM) * aNormal;\n\n}", this._fragSrc = "precision highp float;\n#define GLSLIFY 1\n\nvarying vec4 vPos;\nvarying vec3 vNormal;\n\nuniform float uCut;\nuniform sampler2D uSampler;\n\nuniform float uOffsetWhite;\nuniform float uBurnColor;\nuniform float uRangeMapping;\nuniform float uYMapping;\n\nfloat map(float value, float inMin, float inMax, float outMin, float outMax) {\n  return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);\n}\n\nvec4 depthCutTexture( sampler2D texture, vec4 pos, vec3 normal, float RANGEX, float RANGEY )\n{\n\n  float RANGE = RANGEX;\n  vec3  absNormal        = abs(normal);\n  float thresholdNormal = 0.8;\n\n  float isZMapping  = step(absNormal.y, thresholdNormal);\n  float isYMapping  = step(thresholdNormal, absNormal.y);\n  float isXMapping  = step(thresholdNormal, absNormal.x);\n\n  float uvXZMapping    = (pos.x - abs(isXMapping * pos.z * 0.7) + RANGE) / (RANGE * 2.0);\n  float uvYZMapping    = (pos.y)/RANGEY;\n\n  float uvXYMapping     = uvXZMapping;\n  float uvYYMapping     = (pos.z + RANGE) / (RANGE * 2.0);\n\n  float uvXXMapping    = ( pos.x - pos.y )/RANGEY;\n  float uvYXMapping    = uvYYMapping;\n\n  vec2 uv = vec2(0.0);\n  uv.x = uvXZMapping * (isZMapping) + uvXYMapping * isYMapping;\n  uv.y = uvYZMapping * (isZMapping) + uvYYMapping * isYMapping;\n\n  return texture2D(texture, uv);\n\n}\n\nvoid main( void ){\n\n  float progress = map(uCut, 0.0, 1.0, 0.0, 1.0 + uOffsetWhite);\n\n  vec4 color = depthCutTexture(uSampler, vPos, vNormal, uRangeMapping, uYMapping);\n\n  float c = 0.0;\n  if(color.g < 1.0 * (1.0 - progress + uOffsetWhite)){\n    c = (1.0 * (1.0 - progress + uOffsetWhite) - color.r)*uBurnColor;\n  }\n\n  gl_FragColor = vec4(c);\n\n}",
            this.prg = new e(a), this.prg.compile(this._vertSrc, this._fragSrc), this.prg.use(), this.rootNode = null, this.cut = 0
        }
        var e = a("nanogl/program"), f = a("entities/RevealModel"), g = a("gl-matrix").mat4, h = g.create();
        d.prototype = {
            setMaskTexture: function(a) {
                this.maskTexture = a
            },
            prepare: function(a, b) {
                var c = this.prg;
                c.use(), f.setupProgram(c, a._wmatrix), f.maskTexture && (f.maskTexture.bind(), c.uSampler(f.maskTexture)), b.modelViewProjectionMatrix(h, a._wmatrix), c.uMVP(h)
            }
        }, b.exports = d
    }, {
        "entities/RevealModel": 42,
        "gl-matrix": 113,
        "nanogl/program": 160
    }
    ],
    71: [function(a, b, c) {
        function d(a) {
            this.ibl = null, this.prg = null, this._mask = 1, this.inputs = new i, this.iAlbedo = this.inputs.add(new g("albedo", 3)), this.iSpecular = this.inputs.add(new g("specular", 3)), this.iGloss = this.inputs.add(new g("gloss", 1)), this.iNormal = this.inputs.add(new g("normal", 3)), this.iOcclusion = this.inputs.add(new g("occlusion", 1)), this.iCavity = this.inputs.add(new g("cavity", 1)), this.iCavityStrength = this.inputs.add(new g("cavityStrength", 2)), this.iFresnel = this.inputs.add(new g("fresnel", 3)), this.conserveEnergy = this.inputs.add(new h("conserveEnergy", !0)), this.perVertexIrrad = this.inputs.add(new h("perVertexIrrad", !0)), this.pureGloss = this.inputs.add(new h("pureGloss", !1)), this.glossNearest = this.inputs.add(new h("glossNearest", !0)), this.inputs.add(l.isReaveling.createProxy()), this.config = new e, this._prgcache = f.getCache(a), this._uid = "std", this._precision = "highp", this._vertSrc = '#define GLSLIFY 1\n#pragma SLOT pv\n\nattribute vec3 aPosition;\nattribute vec2 aTexCoord;\nattribute vec3 aNormal;\nattribute vec3 aTangent;\nattribute vec3 aBitangent;\n\nuniform mat4 uMVP;\nuniform mat4 uWorldMatrix;\nuniform mat4 uM;\n\nuniform float uDisplacementX;\nuniform float uDisplacementStrength;\nuniform float uDisplacementOffset;\nuniform float uDisplacementSlope;\n\nvarying vec2 vTexCoord;\nvarying vec3 vWorldPosition;\n\nvarying mediump vec3 vWorldNormal;\n\n#if HAS_normal\n  varying mediump vec3 vWorldTangent;\n  varying mediump vec3 vWorldBitangent;\n#endif\n\n#if perVertexIrrad\n  varying vec3 vIrradiance;\n  uniform vec4 uSHCoeffs[7];\n  \n// ================================\n// compute Spherical Harmonics\n// ================================\n//\n// "Stupid Spherical Harmonics (SH) Tricks"\n// http://www.ppsloan.org/publications/StupidSH36.pdf\n//\n//\nvec3 SampleSH( vec3 Normal, vec4 shCoefs[7] )\n{\n  Normal.xz = Normal.zx;\n  vec4 NormalVector = vec4(Normal, 1.0);\n\n  // todo transpose coeffs directly\n  // NormalVector.xyz = NormalVector.zyx;\n\n  vec3 X0, X1, X2;\n  X0.x = dot( shCoefs[0].xyz, Normal) + shCoefs[0].w;\n  X0.y = dot( shCoefs[1].xyz, Normal) + shCoefs[1].w;\n  X0.z = dot( shCoefs[2].xyz, Normal) + shCoefs[2].w;\n\n  vec4 vB = NormalVector.zyxx * NormalVector.yxxz;\n  X1.x = dot( shCoefs[3].xyz, vB.xyz) + (shCoefs[3].w * vB.w);\n  X1.y = dot( shCoefs[4].xyz, vB.xyz) + (shCoefs[4].w * vB.w);\n  X1.z = dot( shCoefs[5].xyz, vB.xyz) + (shCoefs[5].w * vB.w);\n\n  float vC = NormalVector.z * NormalVector.z - NormalVector.y * NormalVector.y;\n  X2 =  shCoefs[6].xyz * vC;\n\n  return ( X0 + X1 + X2 );\n//  return max( vec3(0.0) , X0 + X1 + X2 );\n}\n\n#endif\n\nvec3 rotate( mat4 m, vec3 v )\n{\n  return m[0].xyz*v.x + m[1].xyz*v.y + m[2].xyz*v.z;\n}\n\nvoid main( void ){\n\n  #pragma SLOT v\n\n  vWorldPosition = (uWorldMatrix * vec4(aPosition, 1.0)).xyz;\n  vec3 p = aPosition;\n\n  #ifdef isRevealing\n    #if isRevealing\n      vec3 worldPosition = (uM * vec4(aPosition, 1.0)).xyz;\n      float progress = (worldPosition.x - uDisplacementX + uDisplacementOffset) * uDisplacementSlope;\n      progress = exp(-progress*progress) * (uDisplacementStrength * ( 1.0 - ((uDisplacementX + 25.0)/50.0) ));\n      p += vec3(aNormal) * progress;\n    #endif\n  #endif\n\n  gl_Position    = uMVP         * vec4(p, 1.0);\n\n  vWorldNormal    = rotate( uWorldMatrix, aNormal );\n  #if HAS_normal\n    vWorldTangent   = rotate( uWorldMatrix, aTangent );\n    vWorldBitangent = rotate( uWorldMatrix, aBitangent );\n  #endif\n\n  #if perVertexIrrad\n    vIrradiance = SampleSH(vWorldNormal, uSHCoeffs );\n    #if HAS_iblExpo\n      vIrradiance = iblExpo().x * pow( vIrradiance, vec3( iblExpo().y ) );\n    #endif\n  #endif\n\n  vTexCoord = aTexCoord;\n}', this._fragSrc = '#define GLSLIFY 1\n\nuniform vec3 uCameraPosition;\n\nvarying vec2 vTexCoord;\nvarying vec3 vWorldPosition;\n\nvarying mediump vec3 vWorldNormal;\n\n#pragma SLOT pf\n\n#if HAS_normal\n  varying mediump vec3 vWorldTangent;\n  varying mediump vec3 vWorldBitangent;\n#endif\n\n// IBL\n// ========\nuniform vec2 uEnvTonemap;\n\nuniform sampler2D tEnv;\n#if pureGloss\n  uniform sampler2D tEnvHi;\n#endif\n\n#if perVertexIrrad\n  varying vec3 vIrradiance;\n#else\n  uniform vec4 uSHCoeffs[7];\n  \n// ================================\n// compute Spherical Harmonics\n// ================================\n//\n// "Stupid Spherical Harmonics (SH) Tricks"\n// http://www.ppsloan.org/publications/StupidSH36.pdf\n//\n//\nvec3 SampleSH( vec3 Normal, vec4 shCoefs[7] )\n{\n  Normal.xz = Normal.zx;\n  vec4 NormalVector = vec4(Normal, 1.0);\n\n  // todo transpose coeffs directly\n  // NormalVector.xyz = NormalVector.zyx;\n\n  vec3 X0, X1, X2;\n  X0.x = dot( shCoefs[0].xyz, Normal) + shCoefs[0].w;\n  X0.y = dot( shCoefs[1].xyz, Normal) + shCoefs[1].w;\n  X0.z = dot( shCoefs[2].xyz, Normal) + shCoefs[2].w;\n\n  vec4 vB = NormalVector.zyxx * NormalVector.yxxz;\n  X1.x = dot( shCoefs[3].xyz, vB.xyz) + (shCoefs[3].w * vB.w);\n  X1.y = dot( shCoefs[4].xyz, vB.xyz) + (shCoefs[4].w * vB.w);\n  X1.z = dot( shCoefs[5].xyz, vB.xyz) + (shCoefs[5].w * vB.w);\n\n  float vC = NormalVector.z * NormalVector.z - NormalVector.y * NormalVector.y;\n  X2 =  shCoefs[6].xyz * vC;\n\n  return ( X0 + X1 + X2 );\n//  return max( vec3(0.0) , X0 + X1 + X2 );\n}\n\n#endif\n\n// MATH\n// =========\n#define saturate(x) clamp( x, 0.0, 1.0 )\n#define sdot( a, b ) saturate( dot(a,b) )\n\n// INCLUDES\n// =========\n\nvec2 octwrapDecode( vec3 v ) {\n  // Project the sphere onto the octahedron, and then onto the xy plan\n  vec2 p = v.xy / dot(  abs( v ) , vec3(1.0) );\n  p = vec2( p.x+p.y-1.0, p.x-p.y );\n\n  if( v.z < 0.0 )\n    p.x *= -1.0;\n\n  // p.x *= sign( v.z );\n  return p;\n}\n\nvec3 decodeRGBE( vec4 hdr ){\n  return hdr.rgb * exp2( (hdr.a*255.0)-128.0 );\n  // return hdr.rgb * pow( 2.0, (hdr.a*255.0)-128.0 );\n}\n\nconst vec2 _IBL_UVM_529295689 = vec2(\n  0.25*(254.0/256.0),\n  0.125*0.5*(254.0/256.0)\n);\n\nvec3 SpecularIBL( sampler2D tEnv, vec3 skyDir, float roughness)\n{\n\n  vec2 uvA = octwrapDecode( skyDir );\n\n  float r7 = 7.0*roughness;\n  uvA = uvA * _IBL_UVM_529295689 + vec2(\n      0.5,\n      0.125*0.5 + 0.125 * ( r7 - fract( r7 ) )\n    );\n\n  #if glossNearest\n\n    return decodeRGBE( texture2D(tEnv,uvA) );\n\n  #else\n\n    vec2 uvB=uvA+vec2(0.0,0.125);\n    return  mix(\n      decodeRGBE( texture2D(tEnv,uvA) ),\n      decodeRGBE( texture2D(tEnv,uvB) ),\n      frac\n    );\n\n  #endif\n\n}\n\nvec3 SampleEnvHi( sampler2D tEnv, vec3 skyDir )\n{\n\n  vec2 uvA = octwrapDecode( skyDir );\n\n  uvA = vec2(\n    0.25*(254.0/256.0),\n    0.5 *(254.0/256.0)\n    ) * uvA + vec2(0.5,0.5);\n\n  return decodeRGBE( texture2D(tEnv,uvA) );\n}\n\n// Schlick approx\n// [Schlick 1994, "An Inexpensive BRDF Model for Physically-Based Rendering"]\n// https://github.com/EpicGames/UnrealEngine/blob/dff3c48be101bb9f84633a733ef79c91c38d9542/Engine/Shaders/BRDF.usf\nvec3 F_Schlick( float VoH,vec3 spec,float glo )\n{\n  float dot = 1.0-VoH;\n  dot = pow( dot, 5.0 );\n  dot *= glo*glo;\n  #if HAS_fresnel\n    return( 1.0 - dot )*spec + dot*fresnel();\n  #else\n    return( 1.0 - dot )*spec + dot;\n  #endif\n}\n\n// ------------------------------\n//\n\n#if HAS_normal\nvec3 perturbWorldNormal(vec3 n){\n  n = 2.0*n - 1.0;\n  vec3 nrm = gl_FrontFacing ? vWorldNormal : -vWorldNormal;\n  return normalize(vWorldTangent * n.x + vWorldBitangent*n.y + nrm * n.z );\n}\n#endif\n\n// ------------------------------\n//\nvec3 toneMap(vec3 c){\n  vec3 sqrtc = sqrt( c );\n  return(sqrtc-sqrtc*c) + c*(0.4672*c+vec3(0.5328));\n}\n\n//                MAIN\n// ===================\n\nvoid main( void ){\n\n  #pragma SLOT f\n\n  // -----------\n  vec3 worldNormal =\n    #if HAS_normal\n      perturbWorldNormal( normal() );\n    #else\n      gl_FrontFacing ? vWorldNormal : -vWorldNormal;\n    #endif\n  worldNormal = normalize( worldNormal );\n\n  // SH Irradiance diffuse coeff\n  // -------------\n  #if perVertexIrrad\n    vec3 diffuseCoef = vIrradiance;\n  #else\n    vec3 diffuseCoef=SampleSH(worldNormal, uSHCoeffs );\n    #if HAS_iblExpo\n      diffuseCoef = iblExpo().x * pow( diffuseCoef, vec3( iblExpo().y ) );\n    #endif\n  #endif\n\n  // IBL reflexion\n  // --------------\n\n  vec3 viewDir = normalize( uCameraPosition - vWorldPosition );\n  vec3 worldReflect = reflect( -viewDir, worldNormal );\n\n  #if pureGloss\n    vec3 specularColor = SampleEnvHi( tEnvHi, worldReflect );\n  #else\n    vec3 specularColor = SpecularIBL( tEnv, worldReflect, 1.0-gloss() );\n  #endif\n\n  #if HAS_iblExpo\n    specularColor = iblExpo().x * pow( specularColor, vec3( iblExpo().y ) );\n  #endif\n\n  float NoV = sdot( viewDir, worldNormal );\n  vec3 specularSq = specular()*specular();\n  specularColor *= F_Schlick( NoV, specularSq, gloss() );\n\n  #pragma SLOT lightsf\n\n  vec3 alb = albedo();\n  #if conserveEnergy\n    // alb = alb - alb * specular();\n  #endif\n  vec3 albedoSq = alb*alb;\n\n  #if HAS_occlusion\n    diffuseCoef *= occlusion();\n  #endif\n\n  #if HAS_cavity\n    diffuseCoef   *= cavity() * cavityStrength().r + (1.0-cavityStrength().r);\n    specularColor *= cavity() * cavityStrength().g + (1.0-cavityStrength().g);\n  #endif\n\n  gl_FragColor.xyz = toneMap( diffuseCoef*albedoSq + specularColor );\n  gl_FragColor.a = 1.0;\n\n}'
        }
        var e = (a("nanogl/program"), a("nanogl-state/config")), f = a("nanogl-pbr/lib/program-cache"), g = a("nanogl-pbr/lib/input"), h = a("nanogl-pbr/lib/flag"), i = a("nanogl-pbr/lib/chunks-tree"), j = a("gl-matrix").mat4, k = j.create(), l = a("entities/RevealModel");
        d.prototype = {
            setIBL: function(a) {
                this.ibl = a, this.inputs.addChunks(a.getChunks())
            },
            setLightSetup: function(a) {
                this.inputs.addChunks(a.getChunks())
            },
            prepare: function(a, b) {
                this._isDirty() && this.compile();
                var c = this.prg;
                c.use(), c.setupInputs(this), this.ibl.setupProgram(c), l.setupProgram(c, a._wmatrix), b.modelViewProjectionMatrix(k, a._wmatrix), c.uMVP(k), c.uWorldMatrix(a._wmatrix), c.uCameraPosition && c.uCameraPosition(b._wposition)
            },
            prepareShadow: function(a, b) {},
            _isDirty: function() {
                return null === this.prg || this.inputs._isDirty ? (console.log("dirty input"), !0) : !1
            },
            compile: function() {
                null !== this.prg && this._prgcache.release(this.prg), this.prg = this._prgcache.compile(this)
            }
        }, b.exports = d
    }, {
        "entities/RevealModel": 42,
        "gl-matrix": 113,
        "nanogl-pbr/lib/chunks-tree": 138,
        "nanogl-pbr/lib/flag": 140,
        "nanogl-pbr/lib/input": 141,
        "nanogl-pbr/lib/program-cache": 146,
        "nanogl-state/config": 151,
        "nanogl/program": 160
    }
    ],
    72: [function(a, b, c) {
        function d(a) {
            this.vbuffer = new e(a, h), this.ibuffer = new f(a, a.UNSIGNED_BYTE, i), this.vbuffer.attrib("aData", 3, a.FLOAT)
        }
        var e = a("nanogl/arraybuffer"), f = a("nanogl/indexbuffer"), g = .75, h = new Float32Array([0, 0, 1, g, 0, 1, g, .2, 1, g, .4, 1, g, .6, 1, g, .8, 1, g, 1, 1, 1, 0, 0, 1, 1, 0]), i = new Uint8Array([0, 1, 1, 7, 0, 6, 6, 8, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6]);
        d.prototype = {
            setup: function(a) {
                this.vbuffer.attribPointer(a), this.ibuffer.bind()
            },
            render: function() {
                this.ibuffer.drawLines()
            },
            renderFan: function() {
                this.vbuffer.drawTriangleFan(7)
            }
        }, b.exports = d
    }, {
        "nanogl/arraybuffer": 155,
        "nanogl/indexbuffer": 158
    }
    ],
    73: [function(a, b, c) {
        function d(a) {
            this.vbuffer = new e(a, g), this.ibuffer = new f(a, a.UNSIGNED_BYTE, h), this.vbuffer.attrib("aPosition", 3, a.FLOAT)
        }
        var e = a("nanogl/arraybuffer"), f = a("nanogl/indexbuffer"), g = new Float32Array([ - 1, 1, - 1, 1, 1, - 1, 1, 1, 1, - 1, 1, 1, - 1, - 1, - 1, 1, - 1, - 1, 1, - 1, 1, - 1, - 1, 1]), h = new Uint8Array([0, 1, 2, 0, 2, 3, 3, 2, 6, 3, 6, 7, 7, 6, 5, 7, 5, 4, 4, 5, 1, 4, 1, 0, 4, 0, 3, 4, 3, 7, 1, 5, 6, 1, 6, 2]);
        d.prototype = {
            setup: function(a) {
                this.vbuffer.attribPointer(a), this.ibuffer.bind()
            },
            render: function() {
                this.ibuffer.drawTriangles()
            }
        }, b.exports = d
    }, {
        "nanogl/arraybuffer": 155,
        "nanogl/indexbuffer": 158
    }
    ],
    74: [function(a, b, c) {
        function d(a, b, c, d) {
            var e = a[b + 0] * d, f = a[b + 1] * c;
            return Math.sqrt(e * e + f * f)
        }
        function e(a, b, c, d, e, h, i, j) {
            this.gl = a, this.segs = b, this.numlines = c, this.vsep = d, this.hsep = e, this.curvature = h, this.vdecay = void 0 === i ? .3 : i, this.hdecay = void 0 === j ? .3 : j, this.vbuffer = new f(a), this.ibuffer = new g(a), this._build(), this.vbuffer.attrib("aPosition", 3, a.FLOAT), this.vbuffer.attrib("aOpacity", 1, a.FLOAT)
        }
        var f = a("nanogl/arraybuffer"), g = a("nanogl/indexbuffer"), h = 4;
        e.prototype = {
            _build: function() {
                for (var a = 2 * this.numlines + 1, b = 2 * this.segs * (2 * a), c = Math.asin(2 * this.vsep / this.numlines * (this.numlines + 1)), e = Math.asin(2 * this.hsep / this.numlines * (this.numlines + 1)), f = new Float32Array(b * h), g = new Uint16Array(4 * (this.segs - 1) * a), i = c / (this.segs - 1), j = e / (this.segs - 1), k = (this.segs - 1) / 2, l = (a - 1) / 2, m = 0, n = 0, o = 0; a > o; o++) {
                    m = o * (this.segs - 1) * 4, n = 2 * o * this.segs;
                    for (var p = (l - o) / l * this.vsep, q = Math.sqrt(1 - p * p), r = (l - o) / l * this.hsep, s = Math.sqrt(1 - r * r), t = (1 - .7 * Math.abs((l - o) / l), 0); t < this.segs; t++) {
                        var u =- c / 2 + i * t, v =- e / 2 + j * t, w = (n + t) * h, x = (n + t + this.segs) * h;
                        1 - Math.abs((k - t) / k);
                        f[w + 0] = s * Math.sin(u), f[w + 1] = r, f[w + 2] = (s - 1) * this.curvature;
                        var y = d(f, w, 1 / this.vdecay, 1 / this.hdecay);
                        f[w + 3] = Math.max(0, 1 - y), f[x + 0] = p, f[x + 1] = q * Math.sin(v), f[x + 2] = this.curvature * q * (Math.cos(v) - 1);
                        var y = d(f, x, 1 / this.vdecay, 1 / this.hdecay);
                        if (f[x + 3] = Math.max(0, 1 - y), t > 0) {
                            var z = 2 * t, A = 2 * (t + this.segs - 1);
                            g[m + z - 2] = n + t - 1, g[m + z - 1] = n + t, g[m + A - 2] = n + t + this.segs - 1, g[m + A - 1] = n + t + this.segs
                        }
                    }
                }
                this.vbuffer.data(f), this.ibuffer.data(g)
            },
            setup: function(a) {
                this.vbuffer.attribPointer(a), this.ibuffer.bind()
            },
            render: function() {
                this.ibuffer.drawLines()
            }
        }, b.exports = e
    }, {
        "nanogl/arraybuffer": 155,
        "nanogl/indexbuffer": 158
    }
    ],
    75: [function(a, b, c) {
        function d(a, b, c, d) {
            this.gl = a, this.vangle = b, this.hangle = c, this.segs = d, this.vbuffer = new e(a), this.ibuffer = new f(a), this._build(), this.vbuffer.attrib("aPosition", 3, a.FLOAT), this.vbuffer.attrib("aOpacity", 1, a.FLOAT)
        }
        var e = a("nanogl/arraybuffer"), f = a("nanogl/indexbuffer"), g = 4;
        d.prototype = {
            _build: function() {
                for (var a = 2 * this.segs, b = this.vangle, c = this.hangle, d = new Float32Array(a * g), e = new Uint16Array(4 * (this.segs - 1)), f = b / (this.segs - 1), h = c / (this.segs - 1), i = (this.segs - 1) / 2, j = 0; j < this.segs; j++) {
                    var k =- b / 2 + f * j, l =- c / 2 + h * j, m = j * g, n = (j + this.segs) * g, o = 1 - Math.abs((i - j) / i);
                    if (d[m + 0] = Math.sin(l), d[m + 1] = 0, d[m + 2] = Math.cos(l), d[m + 3] = o, d[n + 0] = 0, d[n + 1] = Math.sin(k), d[n + 2] = Math.cos(k), d[n + 3] = o, j > 0) {
                        var p = 2 * j, q = 2 * (j + this.segs);
                        e[p - 2] = j - 1, e[p - 1] = j, e[q - 2] = j + this.segs - 1, e[q - 1] = j + this.segs
                    }
                }
                this.vbuffer.data(d), this.ibuffer.data(e)
            },
            setup: function(a) {
                this.vbuffer.attribPointer(a), this.ibuffer.bind()
            },
            render: function() {
                this.ibuffer.drawLines()
            }
        }, b.exports = d
    }, {
        "nanogl/arraybuffer": 155,
        "nanogl/indexbuffer": 158
    }
    ],
    76: [function(a, b, c) {
        function d(a, b, c, d, g) {
            this.gl = a, this.segs = b, this.numlines = c, this.vsep = d, this.hsep = g, this.vbuffer = new e(a), this.ibuffer = new f(a), this._build(), this.vbuffer.attrib("aPosition", 3, a.FLOAT), this.vbuffer.attrib("aOpacity", 1, a.FLOAT)
        }
        var e = a("nanogl/arraybuffer"), f = a("nanogl/indexbuffer"), g = 4;
        d.prototype = {
            _build: function() {
                for (var a = 2 * this.numlines + 1, b = 2 * this.segs * (2 * a), c = Math.asin(2 * this.vsep / this.numlines * (this.numlines + 1)), d = Math.asin(2 * this.hsep / this.numlines * (this.numlines + 1)), e = new Float32Array(b * g), f = new Uint16Array(4 * (this.segs - 1) * a), h = c / (this.segs - 1), i = d / (this.segs - 1), j = (this.segs - 1) / 2, k = (a - 1) / 2, l = 0, m = 0, n = 0; a > n; n++) {
                    l = n * (this.segs - 1) * 4, m = 2 * n * this.segs;
                    for (var o = (k - n) / k * this.vsep, p = Math.sqrt(1 - o * o), q = (k - n) / k * this.hsep, r = Math.sqrt(1 - q * q), s = 1 - .7 * Math.abs((k - n) / k), t = 0; t < this.segs; t++) {
                        var u =- c / 2 + h * t, v =- d / 2 + i * t, w = (m + t) * g, x = (m + t + this.segs) * g, y = 1 - Math.abs((j - t) / j);
                        if (e[w + 0] = r * Math.sin(u), e[w + 1] = q, e[w + 2] = r * Math.cos(u), e[w + 3] = y * s, e[x + 0] = o, e[x + 1] = p * Math.sin(v), e[x + 2] = p * Math.cos(v), e[x + 3] = y * s, t > 0) {
                            var z = 2 * t, A = 2 * (t + this.segs - 1);
                            f[l + z - 2] = m + t - 1, f[l + z - 1] = m + t, f[l + A - 2] = m + t + this.segs - 1, f[l + A - 1] = m + t + this.segs
                        }
                    }
                }
                this.vbuffer.data(e), this.ibuffer.data(f)
            },
            setup: function(a) {
                this.vbuffer.attribPointer(a), this.ibuffer.bind()
            },
            render: function() {
                this.ibuffer.drawLines()
            }
        }, b.exports = d
    }, {
        "nanogl/arraybuffer": 155,
        "nanogl/indexbuffer": 158
    }
    ],
    77: [function(a, b, c) {
        function d(a) {
            this.gl = a, this.name = "", this.subgeoms = []
        }
        function e(a) {
            this.gl = a, this.buffers = [], this.ibuffer = null
        }
        a("nanogl/arraybuffer"), a("nanogl/indexbuffer"), a("assets/mouse");
        d.prototype = {}, d.SubGeom = e, e.prototype = {
            setup: function(a) {
                for (var b = 0; b < this.buffers.length; b++)
                    this.buffers[b].attribPointer(a);
                this.ibuffer.bind()
            },
            render: function() {
                this.ibuffer.drawTriangles()
            }
        }, b.exports = d
    }, {
        "assets/mouse": 19,
        "nanogl/arraybuffer": 155,
        "nanogl/indexbuffer": 158
    }
    ],
    78: [function(a, b, c) {
        function d(a, b, c) {
            e.call(this, a), this.envHi = b, this.envBg = c
        }
        var e = a("nanogl-pbr/ibl");
        d.prototype = Object.create(e.prototype), d.prototype.constructor = d, d.prototype.setupProgram = function(a) {
            e.prototype.setupProgram.call(this, a);
            a.tEnvHi && a.tEnvHi(this.envHi)
        }, b.exports = d
    }, {
        "nanogl-pbr/ibl": 135
    }
    ],
    79: [function(a, b, c) {
        var d = a("nanogl-node"), e = a("./utils").setupObj3D;
        b.exports = function() {
            return function(a, b, c, f) {
                var g = (f.gl, new d);
                return e(g, a, b, f), g
            }
        }
    }, {
        "./utils": 84,
        "nanogl-node": 128
    }
    ],
    80: [function(a, b, c) {
        var d = a("gl/geometry"), e = a("nanogl/arraybuffer"), f = a("nanogl/indexbuffer"), g = a("awdlib/lib/awdlib_readonly"), h = g.consts, i = function(a) {
            switch (a) {
            case h.POSITION:
                return "aPosition";
            case h.UVS:
                return "aTexCoord";
            case h.NORMAL:
                return "aNormal";
            case h.TANGENT:
                return "aTangent";
            case h.JOIN_IDX:
                return "join_index";
            case h.JOIN_WGT:
                return "join_weight";
            case h.SUVS:
                return "aTexCoord1";
            case h.COLOR:
                return "aColor";
            case h.BINORMAL:
                return "aBitangent"
            }
            throw new Error("unknown stream type")
        };
        b.exports = function() {
            function a(a, b) {
                var c = 0;
                switch (a.ftype) {
                case h.UINT8:
                    c = b.UNSIGNED_BYTE;
                    break;
                case h.UINT16:
                    c = b.UNSIGNED_SHORT;
                    break;
                case h.UINT32:
                    c = b.UNSIGNED_INT;
                    break;
                default:
                    throw new Error("AWD : unsupported index buffer type " + a.ftype)
                }
                var d = new f(b, c);
                return d.data(a.data), d
            }
            function b(a, b) {
                if (7 !== a.ftype)
                    throw new Error("AWD : vertex buffer type not f32");
                var c = new e(b);
                c.data(a.data);
                for (var d = a.attributes, f = 0; f < d.length; f++) {
                    var g = d[f];
                    c.attrib(i(g.type), g.len, b.FLOAT)
                }
                return c
            }
            return function(c, e, f, g) {
                var h = g.gl, i = new d(h);
                i.name = c.name;
                for (var j = c.subGeoms, k = 0; k < j.length; k++) {
                    var l = j[k], m = new d.SubGeom(h);
                    i.subgeoms.push(m);
                    for (var n = l.buffers, o = 0; o < n.length; o++) {
                        var p = n[o];
                        p.isIndex ? m.ibuffer = a(p, h) : m.buffers.push(b(p, h))
                    }
                }
                return i
            }
        }
    }, {
        "awdlib/lib/awdlib_readonly": 93,
        "gl/geometry": 77,
        "nanogl/arraybuffer": 155,
        "nanogl/indexbuffer": 158
    }
    ],
    81: [function(a, b, c) {
        function d() {
            g = {
                handleGeometry: a("./geometry")(),
                handleMesh: a("./mesh")(),
                handleContainer: a("./container")(),
                handleMaterial: a("./material")()
            }
        }
        function e(a, b) {
            var c = awdLib_pil.extInfos;
            if (b == c.URI)
                switch (a) {
                case c.INTERLEAVED_GEOM:
                    return g.handleGeometry
                } else 
                    switch (a) {
                    case h.MESH:
                        return g.handleMesh;
                    case h.CONTAINER:
                        return g.handleContainer;
                    case h.MATERIAL:
                        return g.handleMaterial
                    }
            return null
        }
        function f(a) {
            this.buffer = a, this.basedir = "./", this.awd = null;
            var b = {};
            b.resolve = function(a) {
                return a && b[a.id] ? b[a.id] : null
            }, this._lib = b, this._lib.lights = [], this._lib.meshes = [], this._byName = {}, this._objects = []
        }
        awdLib = a("awdlib/lib/awdlib_readonly"), awdLib_pil = a("awdlib/lib/awdlib_pil_readonly"), awdLib_std = a("awdlib/lib/awdlib_std_readonly");
        var g, h = awdLib.consts;
        f.prototype = {
            load: function(a) {
                awdLib_pil.extInfos;
                this.awd = new awdLib.awd, this.awd.addExtension(awdLib_pil.ext.getExtension()), this.awd.addExtension(awdLib_std.ext.getExtension()), this.awd.parse(this.buffer);
                var b = this.awd._elements, c = a.subRoot;
                this.container = c, c.gl = a.gl;
                for (var d = 0; d < b.length; d++) {
                    var f = b[d], g = e(f.type, f.nsUri);
                    if (g) {
                        var h = g(f, this._lib, c, a), i = /[\0-\x1F\x7F-\x9F\xAD\u0378\u0379\u037F-\u0383\u038B\u038D\u03A2\u0528-\u0530\u0557\u0558\u0560\u0588\u058B-\u058E\u0590\u05C8-\u05CF\u05EB-\u05EF\u05F5-\u0605\u061C\u061D\u06DD\u070E\u070F\u074B\u074C\u07B2-\u07BF\u07FB-\u07FF\u082E\u082F\u083F\u085C\u085D\u085F-\u089F\u08A1\u08AD-\u08E3\u08FF\u0978\u0980\u0984\u098D\u098E\u0991\u0992\u09A9\u09B1\u09B3-\u09B5\u09BA\u09BB\u09C5\u09C6\u09C9\u09CA\u09CF-\u09D6\u09D8-\u09DB\u09DE\u09E4\u09E5\u09FC-\u0A00\u0A04\u0A0B-\u0A0E\u0A11\u0A12\u0A29\u0A31\u0A34\u0A37\u0A3A\u0A3B\u0A3D\u0A43-\u0A46\u0A49\u0A4A\u0A4E-\u0A50\u0A52-\u0A58\u0A5D\u0A5F-\u0A65\u0A76-\u0A80\u0A84\u0A8E\u0A92\u0AA9\u0AB1\u0AB4\u0ABA\u0ABB\u0AC6\u0ACA\u0ACE\u0ACF\u0AD1-\u0ADF\u0AE4\u0AE5\u0AF2-\u0B00\u0B04\u0B0D\u0B0E\u0B11\u0B12\u0B29\u0B31\u0B34\u0B3A\u0B3B\u0B45\u0B46\u0B49\u0B4A\u0B4E-\u0B55\u0B58-\u0B5B\u0B5E\u0B64\u0B65\u0B78-\u0B81\u0B84\u0B8B-\u0B8D\u0B91\u0B96-\u0B98\u0B9B\u0B9D\u0BA0-\u0BA2\u0BA5-\u0BA7\u0BAB-\u0BAD\u0BBA-\u0BBD\u0BC3-\u0BC5\u0BC9\u0BCE\u0BCF\u0BD1-\u0BD6\u0BD8-\u0BE5\u0BFB-\u0C00\u0C04\u0C0D\u0C11\u0C29\u0C34\u0C3A-\u0C3C\u0C45\u0C49\u0C4E-\u0C54\u0C57\u0C5A-\u0C5F\u0C64\u0C65\u0C70-\u0C77\u0C80\u0C81\u0C84\u0C8D\u0C91\u0CA9\u0CB4\u0CBA\u0CBB\u0CC5\u0CC9\u0CCE-\u0CD4\u0CD7-\u0CDD\u0CDF\u0CE4\u0CE5\u0CF0\u0CF3-\u0D01\u0D04\u0D0D\u0D11\u0D3B\u0D3C\u0D45\u0D49\u0D4F-\u0D56\u0D58-\u0D5F\u0D64\u0D65\u0D76-\u0D78\u0D80\u0D81\u0D84\u0D97-\u0D99\u0DB2\u0DBC\u0DBE\u0DBF\u0DC7-\u0DC9\u0DCB-\u0DCE\u0DD5\u0DD7\u0DE0-\u0DF1\u0DF5-\u0E00\u0E3B-\u0E3E\u0E5C-\u0E80\u0E83\u0E85\u0E86\u0E89\u0E8B\u0E8C\u0E8E-\u0E93\u0E98\u0EA0\u0EA4\u0EA6\u0EA8\u0EA9\u0EAC\u0EBA\u0EBE\u0EBF\u0EC5\u0EC7\u0ECE\u0ECF\u0EDA\u0EDB\u0EE0-\u0EFF\u0F48\u0F6D-\u0F70\u0F98\u0FBD\u0FCD\u0FDB-\u0FFF\u10C6\u10C8-\u10CC\u10CE\u10CF\u1249\u124E\u124F\u1257\u1259\u125E\u125F\u1289\u128E\u128F\u12B1\u12B6\u12B7\u12BF\u12C1\u12C6\u12C7\u12D7\u1311\u1316\u1317\u135B\u135C\u137D-\u137F\u139A-\u139F\u13F5-\u13FF\u169D-\u169F\u16F1-\u16FF\u170D\u1715-\u171F\u1737-\u173F\u1754-\u175F\u176D\u1771\u1774-\u177F\u17DE\u17DF\u17EA-\u17EF\u17FA-\u17FF\u180F\u181A-\u181F\u1878-\u187F\u18AB-\u18AF\u18F6-\u18FF\u191D-\u191F\u192C-\u192F\u193C-\u193F\u1941-\u1943\u196E\u196F\u1975-\u197F\u19AC-\u19AF\u19CA-\u19CF\u19DB-\u19DD\u1A1C\u1A1D\u1A5F\u1A7D\u1A7E\u1A8A-\u1A8F\u1A9A-\u1A9F\u1AAE-\u1AFF\u1B4C-\u1B4F\u1B7D-\u1B7F\u1BF4-\u1BFB\u1C38-\u1C3A\u1C4A-\u1C4C\u1C80-\u1CBF\u1CC8-\u1CCF\u1CF7-\u1CFF\u1DE7-\u1DFB\u1F16\u1F17\u1F1E\u1F1F\u1F46\u1F47\u1F4E\u1F4F\u1F58\u1F5A\u1F5C\u1F5E\u1F7E\u1F7F\u1FB5\u1FC5\u1FD4\u1FD5\u1FDC\u1FF0\u1FF1\u1FF5\u1FFF\u200B-\u200F\u202A-\u202E\u2060-\u206F\u2072\u2073\u208F\u209D-\u209F\u20BB-\u20CF\u20F1-\u20FF\u218A-\u218F\u23F4-\u23FF\u2427-\u243F\u244B-\u245F\u2700\u2B4D-\u2B4F\u2B5A-\u2BFF\u2C2F\u2C5F\u2CF4-\u2CF8\u2D26\u2D28-\u2D2C\u2D2E\u2D2F\u2D68-\u2D6E\u2D71-\u2D7E\u2D97-\u2D9F\u2DA7\u2DAF\u2DB7\u2DBF\u2DC7\u2DCF\u2DD7\u2DDF\u2E3C-\u2E7F\u2E9A\u2EF4-\u2EFF\u2FD6-\u2FEF\u2FFC-\u2FFF\u3040\u3097\u3098\u3100-\u3104\u312E-\u3130\u318F\u31BB-\u31BF\u31E4-\u31EF\u321F\u32FF\u4DB6-\u4DBF\u9FCD-\u9FFF\uA48D-\uA48F\uA4C7-\uA4CF\uA62C-\uA63F\uA698-\uA69E\uA6F8-\uA6FF\uA78F\uA794-\uA79F\uA7AB-\uA7F7\uA82C-\uA82F\uA83A-\uA83F\uA878-\uA87F\uA8C5-\uA8CD\uA8DA-\uA8DF\uA8FC-\uA8FF\uA954-\uA95E\uA97D-\uA97F\uA9CE\uA9DA-\uA9DD\uA9E0-\uA9FF\uAA37-\uAA3F\uAA4E\uAA4F\uAA5A\uAA5B\uAA7C-\uAA7F\uAAC3-\uAADA\uAAF7-\uAB00\uAB07\uAB08\uAB0F\uAB10\uAB17-\uAB1F\uAB27\uAB2F-\uABBF\uABEE\uABEF\uABFA-\uABFF\uD7A4-\uD7AF\uD7C7-\uD7CA\uD7FC-\uF8FF\uFA6E\uFA6F\uFADA-\uFAFF\uFB07-\uFB12\uFB18-\uFB1C\uFB37\uFB3D\uFB3F\uFB42\uFB45\uFBC2-\uFBD2\uFD40-\uFD4F\uFD90\uFD91\uFDC8-\uFDEF\uFDFE\uFDFF\uFE1A-\uFE1F\uFE27-\uFE2F\uFE53\uFE67\uFE6C-\uFE6F\uFE75\uFEFD-\uFF00\uFFBF-\uFFC1\uFFC8\uFFC9\uFFD0\uFFD1\uFFD8\uFFD9\uFFDD-\uFFDF\uFFE7\uFFEF-\uFFFB\uFFFE\uFFFF]/g;
                        f.name = f.name.replace(i, ""), h.name && (h.name = h.name.replace(i, "")), this._lib[f.id] = h, this._byName[f.name] = h, this._objects.push(h)
                    }
                }
            },
            getObjectByName: function(a) {
                return this._byName[a]
            },
            getObjects: function() {
                return this._objects
            },
            getMeshes: function() {
                return this._lib.meshes
            }
        }, d(), b.exports = f
    }, {
        "./container": 79,
        "./geometry": 80,
        "./material": 82,
        "./mesh": 83,
        "awdlib/lib/awdlib_pil_readonly": 92,
        "awdlib/lib/awdlib_readonly": 93,
        "awdlib/lib/awdlib_std_readonly": 94
    }
    ],
    82: [function(a, b, c) {
        a("./utils").hexToRGB;
        b.exports = function(a) {
            return function(a, b, c, d) {
                var e = (d.gl, a.fileData, a.name);
                a.uri;
                return e = e.substring(0, e.length - 1), d.mats.getMaterial(e)
            }
        }
    }, {
        "./utils": 84
    }
    ],
    83: [function(a, b, c) {
        var d = a("./utils").setupObj3D, e = a("entities/mesh");
        b.exports = function(a) {
            return function(a, b, c, f) {
                var g = f.gl, h = new e(g), i = b.resolve(a.geometry);
                d(h, a, b, f), h.geom = i;
                for (var j = a.materials, k = 0; k < j.length; ++k) {
                    var l = j[k], m = b.resolve(l);
                    h.materials.push(m)
                }
                return b.meshes.push(h), h
            }
        }
    }, {
        "./utils": 84,
        "entities/mesh": 55
    }
    ],
    84: [function(a, b, c) {
        b.exports = {
            hexToRGB: function(a) {
                return [(a>>>16 & 255) / 255, (a>>>8 & 255) / 255, (a>>>0 & 255) / 255]
            },
            setupObj3D: function(a, b, c, d) {
                if (a.setMatrix(b.matrix.data), a.name = b.name, b.parent) {
                    var e = c.resolve(b.parent);
                    e.add(a)
                } else 
                    d.root.add(a)
            }
        }
    }, {}
    ],
    85: [function(a, b, c) {
        function d(a, b) {
            var c = "callback";
            window[c] = function(a) {
                delete window[c], document.body.removeChild(d), b(a)
            };
            var d = document.createElement("script");
            d.src = a + (a.indexOf("?") >= 0 ? "&" : "?") + "callback=" + c, document.body.appendChild(d)
        }
        var e = a("../../i18n/services.json"), f = a("when");
        b.exports = {
            locales: [],
            getServiceUrl: function() {
                var a = window.location.hostname;
                void 0 === e[a] && (a = "pre-prod.nissan.eu");
                var b = window._svConfig;
                return e[a] + "/" + b.country + "/" + b.language + "/services/" + b.locale_id + ".prop2jsonp.json"
            },
            getLocales: function() {
                var a = this.getServiceUrl(), b = f.defer();
                return d(a, function(a) {
                    this.locales = a.data, this.replace(a.data), b.resolve(a)
                }.bind(this)), b.promise
            },
            replace: function(a) {
                for (var b = document.querySelectorAll("*[data-locale]"), c = b.length - 1; c >= 0; c--)
                    b[c].innerHTML = a[b[c].getAttribute("data-locale")] ? a[b[c].getAttribute("data-locale")] : ""
            }
        }
    }, {
        "../../i18n/services.json": 1,
        when: 184
    }
    ],
    86: [function(a, b, c) {
        var d = a("utils/BrowserDetect"), e = a("components/start-layer"), f = a("components/fallback-layer"), g = a("components/resize-handler"), h = a("lib/locale-replacer"), i = document.body.getElementsByTagName("canvas")[0];
        !function() {
            function b() {
                d.isDesktop || (i.style.width = "0px", i.style.height = "0px", clearTimeout(n), n = setTimeout(function() {
                    i.style.width = document.body.clientWidth + "px", i.style.height = document.body.clientHeight + "px"
                }, 12))
            }
            function c() {
                window.addEventListener("resize", b), b(), l.preload().then(function() {
                    l.play(), b()
                })
            }
            h.getLocales();
            var j = new g;
            if (0 != f.testWebgl()) {
                var k = a("./renderer"), l = new k(i);
                j.setRenderer(l);
                var m = new e, n = null;
                d.isMobile ? (m.setOnStartCallback(c), m.show()) : c()
            }
        }()
    }, {
        "./renderer": 87,
        "components/fallback-layer": 34,
        "components/resize-handler": 35,
        "components/start-layer": 36,
        "lib/locale-replacer": 85,
        "utils/BrowserDetect": 88
    }
    ],
    87: [function(a, b, c) {
        var d = a("when"), e = (a("nanogl-texture-loader"), a("nanogl-renderer")), f = a("nanogl-state"), g = a("nanogl-camera"), h = a("nanogl-node"), i = (a("nanogl-pbr/standard"), a("nanogl-primitives-2d/rect")), j = a("./utils/net"), k = a("./assets/programs"), l = a("./assets/awd-scene"), m = (a("./assets/sh"), a("./assets/textures-lib")), n = a("./assets/materials-lib"), o = a("./assets/ray"), p = a("./assets/mouse"), q = a("./assets/bundles"), r = a("./assets/picking-trigger"), s = (a("./entities/plane"), a("./entities/guizmo")), t = (a("./entities/mesh"), a("./entities/interior")), u = (a("./entities/swatch"), a("./entities/lights")), v = a("./entities/env"), w = a("./entities/sky"), x = a("./entities/ui"), y = a("./entities/loading-scene"), z = a("./entities/RevealModel"), A = a("./camera/camera-ctrl"), B = a("./camera/max-controler"), C = a("./camera/orbit"), D = a("dev/gui"), E = a("dev/gui-loading"), F = a("dev/mat-gui"), G = a("dev/stats"), H = 0, I = e({
            init: function() {
                var a = this.gl;
                p.init(this), this.onLoadingComplete = this._onLoadingComplete.bind(this), this.onLoadingHidden = this._onLoadingHidden.bind(this), this.onCarSceneShown = this._onCarSceneShown.bind(this), this.updatePicking = this._updatePicking.bind(this), this.root = new h, a.state = new f(a), a.programs = new k(a), this.lights = new u(a), this.env = new v(this), this.texs = new m(a), this.mats = new n(a, this), this.sky = new w(a, this.env.ibl), this.interior = new t(a), this.ray = new o(this), this.ui = new x(this), this.quad = new i(a), this.showUi=!1, this.guizmo = new s(a), this.carRoll=!1;
                var b = window._svConfig.car_id, c = q.getBundleClass(b);
                this.bundle = new c, this.bundle.init(this), this.loadingScene = new y(a, this), this.env.defaultscene = this.bundle.getEnvId(), this.carTrigger = new r(this.bundle.pickingCar, this.ray), this.carTrigger.on("click", this.onClickCar.bind(this)), this.doorTrigger = new r(this.bundle.pickingDoor, this.ray, this.carTrigger), this.doorTrigger.on("click", this.onClickDoor.bind(this)), this.doorTrigger.connect(), this.camera = g.makePerspectiveCamera(), this.camera.lens.setAutoFov(43.68 / 180 * Math.PI), this.camera.lens.near = 2, this.camera.lens.far = 200, this.camCtrl = new A(this), this.maxcam = new B(this.canvas), this.orbit = new C(this.canvas), this.orbit.setInitialState(this.bundle.getInitialOrbitConfig()), this.camCtrl.setControler(this.orbit), this.ui.setupTransform(this.bundle.getUiConfig()), this.subRoot = new h, this.root.add(this.subRoot), this.root.add(this.lights.node), this.root.add(this.guizmo), this.subRoot.add(this.camera), this.subRoot.add(this.loadingScene.carLines), this.subRoot.add(this.loadingScene.loadingFloor), this.subRoot.add(this.interior), this.awdScene = new l(this), this.interior.setScale(6), this.interior.position.set(this.bundle.getInteriorPosition()), this.interior.rotateY(Math.PI / 2), p.on("down", this.updatePicking), this.loadingScene.on("loading-complete", this.onLoadingComplete), this.loadingScene.on("loading-hidden", this.onLoadingHidden), this.SCENE_STATE = {
                    current: "car",
                    CAR: "car",
                    LOADER: "loader",
                    car_mode: function() {
                        this.SCENE_STATE.current = this.SCENE_STATE.CAR, this.sky.setDark(!1)
                    }.bind(this),
                    loader_mode: function() {
                        this.SCENE_STATE.current = this.SCENE_STATE.LOADER, this.sky.setDark(!0)
                    }.bind(this)
                }, this.SCENE_STATE.loader_mode(), this.mats.compileAll(), D.add(this.orbit, "_inside", 0, 1), D.add(this, "logCam"), D.add(this, "freeCam"), D.add(this.camera.lens, "far", 10, 200), D.add(this.camera.lens, "near", 1, 100), F.registerMaterials(this.mats);
                var d = E.addFolder("scene");
                d.add(this.SCENE_STATE, "car_mode"), d.add(this.SCENE_STATE, "loader_mode")
            },
            getContextOptions: function() {
                return {
                    depth: !0,
                    stencil: !1,
                    antialias: window.devicePixelRatio <= 1,
                    alpha: !1,
                    premultipliedAlpha: !1,
                    preserveDrawingBuffer: !1
                }
            },
            render: function(a) {
                var b = this.gl;
                H += a, this.pixelRatio = this.width / this.canvasWidth, G.reset();
                var c = this.SCENE_STATE.current === this.SCENE_STATE.CAR, d = 1 === this.orbit._inside;
                this.bundle.pickingDoor.doubleSided = d, this.camCtrl.update(a), this.root.rotation.set([0, 0, 0, 1]), this.root.rotateY(this.env.rotations[0]), this.env.preRender(a), this.ui.gopening = 1 - this.orbit._inside, this.showUi&&!d && this.ui.preRender(a), c && (this.bundle.preRender(a), this.awdScene.preRender(a)), this.root.updateWorldMatrix(), this.camera.updateViewProjectionMatrix(this.width, this.height), this.ray.preRender(), this.lights.setup.update(), c ? (this.carRoll = this.bundle.pickingCar.run(this.ray), this.doorRoll = this.bundle.pickingDoor.run(this.ray)) : (this.carRoll=!0, this.doorRoll=!1), d && (this.carRoll=!0), this.orbit.carRoll = this.carRoll, this.env.carRoll = this.carRoll, this.updateCvsCursor(), b.bindFramebuffer(b.FRAMEBUFFER, null), b.clearColor(0, 0, 0, 1), b.viewport(0, 0, this.width, this.height), b.clear(b.COLOR_BUFFER_BIT | b.DEPTH_BUFFER_BIT), z.updateRootInv();
                var e = z.cut < 1 && z.cut > 0;
                e && this.awdScene.renderDepthCut(this, n.OPAQUE), this.SCENE_STATE.current === this.SCENE_STATE.CAR && this.interior.opacity < 1 && this.awdScene.render(this, n.OPAQUE, a), e && this.awdScene.renderPlainMat(this, n.OPAQUE), this.sky.render(this.camera), e && this.awdScene.renderDepthCut(this, n.BLENDED), this.SCENE_STATE.current === this.SCENE_STATE.CAR && (this.interior.opacity < 1 && this.awdScene.render(this, n.BLENDED, a), this.interior.render(this, a)), this.ui.render(this), e && this.awdScene.renderPlainMat(this, n.BLENDED), this.loadingScene.render(this), b.state.apply()
            },
            resize: function() {}
        });
        I.prototype.updateCvsCursor = function() {
            var a = "cursor-grab", b = "cursor-pointer", c = "cursor-ew", d = 0 !== this.carRoll && this.carRoll!==!1, e = 0 !== this.doorRoll && this.doorRoll!==!1, f=!d&&!e;
            this.canvas.classList.remove(a, b, c), d && this.canvas.classList.add(a), e && this.canvas.classList.add(b), f && this.canvas.classList.add(c)
        }, I.prototype._updatePicking = function(a) {
            this.ray.update(a), this.SCENE_STATE.current === this.SCENE_STATE.CAR && (this.carRoll = this.bundle.pickingCar.run(this.ray),
            this.orbit.carRoll = this.carRoll, this.env.carRoll = this.carRoll)
        }, I.prototype.onClickDoor = function() {
            this.SCENE_STATE.current !== this.SCENE_STATE.CAR || z.cut < 1 || (0 === this.orbit._inside ? this.orbit.goInside() : 1 === this.orbit._inside && this.orbit.goOutside())
        }, I.prototype.onClickCar = function() {
            0 === this.orbit._inside && this.bundle.nextConfig()
        }, I.prototype.renderLightmaps = function() {
            for (var a = this.lights.list, b = (this.mats.depthPass, 0); b < a.length; b++) {
                var c = a[b];
                c._castShadows && c.prepareShadowmap()
            }
        }, I.prototype.logCam = function() {
            console.log(this.camera._matrix)
        }, I.prototype.freeCam = function() {
            this.camCtrl.setControler(this.maxcam)
        }, I.prototype.getOrbitFov = function() {
            return this.orbit.fov
        }, I.prototype.setOrbitFov = function(a) {
            this.orbit.fov = a
        }, I.prototype.load = function() {
            var a = [this.awdScene.load(this.bundle.getSceneUrl()), this.env.loadDefault()];
            a = a.concat(this.bundle.getLoadables()), a = a.concat(this.texs.getLoadables());
            var b = j.whenAll(a);
            return j.throttling(b, 5e3).then(this.onLoaded.bind(this), null, this.onLoadProgress.bind(this))
        }, I.prototype.preload = function() {
            var a = [this.loadingScene.load(), this.env.preloadDefault()];
            return d.all(a).then(this.onPreloaded.bind(this))
        }, I.prototype.onLoaded = function() {
            return this.loadingScene.onLoadComplete(), !0
        }, I.prototype.onLoadProgress = function(a) {
            return this.loadingScene.setLoadState(a), !0
        }, I.prototype.onPreloaded = function() {
            return this.loadingScene.show(), this.load(), !0
        }, I.prototype._onLoadingComplete = function() {
            this.SCENE_STATE.car_mode()
        }, I.prototype._onLoadingHidden = function() {
            this.awdScene.showScene().then(this.onCarSceneShown)
        }, I.prototype._onCarSceneShown = function() {
            this.showUi=!0
        }, b.exports = I
    }, {
        "./assets/awd-scene": 2,
        "./assets/bundles": 4,
        "./assets/materials-lib": 18,
        "./assets/mouse": 19,
        "./assets/picking-trigger": 20,
        "./assets/programs": 22,
        "./assets/ray": 27,
        "./assets/sh": 28,
        "./assets/textures-lib": 30,
        "./camera/camera-ctrl": 31,
        "./camera/max-controler": 32,
        "./camera/orbit": 33,
        "./entities/RevealModel": 42,
        "./entities/env": 46,
        "./entities/guizmo": 50,
        "./entities/interior": 51,
        "./entities/lights": 52,
        "./entities/loading-scene": 54,
        "./entities/mesh": 55,
        "./entities/plane": 56,
        "./entities/sky": 57,
        "./entities/swatch": 59,
        "./entities/ui": 60,
        "./utils/net": 91,
        "dev/gui": 39,
        "dev/gui-loading": 38,
        "dev/mat-gui": 40,
        "dev/stats": 41,
        "nanogl-camera": 124,
        "nanogl-node": 128,
        "nanogl-pbr/standard": 148,
        "nanogl-primitives-2d/rect": 149,
        "nanogl-renderer": 150,
        "nanogl-state": 153,
        "nanogl-texture-loader": 154,
        when: 184
    }
    ],
    88: [function(a, b, c) {
        var d, e, f = function(a, b) {
            return function() {
                return a.apply(b, arguments)
            }
        };
        window.Device = function() {
            function a() {
                this._handleOrientation = f(this._handleOrientation, this), this._handleResize = f(this._handleResize, this), this.onDOMloaded = f(this.onDOMloaded, this), this.previousDevice = window.device, window.device = {}, this._doc_element = null, this._user_agent = window.navigator.userAgent.toLowerCase()
            }
            return a.prototype.osx = function() {
                return this._find("mac os x")
            }, a.prototype.ios = function() {
                return this.iphone() || this.ipod() || this.ipad()
            }, a.prototype.iphone = function() {
                return this._find("iphone")
            }, a.prototype.ipod = function() {
                return this._find("ipod")
            }, a.prototype.ipad = function() {
                return this._find("ipad")
            }, a.prototype.android = function() {
                return this._find("android")
            }, a.prototype.chrome = function() {
                return this._find("chrome")
            }, a.prototype.firefox = function() {
                return this._find("firefox")
            }, a.prototype.ie = function() {
                return null !== new RegExp("trident/.*rv:([0-9]{1,}[.0-9]{0,})").exec(this._user_agent) || null !== new RegExp("msie").exec(this._user_agent)
            }, a.prototype.ie12 = function() {
                return this._find("msie 12.0")
            }, a.prototype.ie11 = function() {
                return this._find("msie 11.0")
            }, a.prototype.ie10 = function() {
                return this._find("msie 10.0")
            }, a.prototype.ie9 = function() {
                return this._find("msie 9.0")
            }, a.prototype.ie8 = function() {
                return this._find("msie 8.0")
            }, a.prototype.ie7 = function() {
                return this._find("msie 7.0")
            }, a.prototype.ie6 = function() {
                return this._find("msie 6.0")
            }, a.prototype.safari = function() {
                return this._find("safari")
            }, a.prototype.getAndroidVersion = function() {
                var a = this._user_agent.match(/android\s([0-9\.]*)/);
                return a ? a[1] : !1
            }, a.prototype.androidPhone = function() {
                return this.android() && this._find("mobile")
            }, a.prototype.androidTablet = function() {
                return window.innerWidth > 768, this.android()&&!this._find("mobile")
            }, a.prototype.blackberry = function() {
                return this._find("blackberry") || this._find("bb10") || this._find("rim")
            }, a.prototype.blackberryPhone = function() {
                return this.blackberry()&&!this._find("tablet")
            }, a.prototype.blackberryTablet = function() {
                return this.blackberry() && this._find("tablet")
            }, a.prototype.windows = function() {
                return this._find("windows")
            }, a.prototype.windowsPhone = function() {
                return this.windows() && this._find("phone")
            }, a.prototype.windowsTablet = function() {
                return this.windows() && this._find("touch")&&!this.windowsPhone()
            }, a.prototype.fxos = function() {
                return (this._find("(mobile;") || this._find("(tablet;")) && this._find("; rv:")
            }, a.prototype.fxosPhone = function() {
                return this.fxos() && this._find("mobile")
            }, a.prototype.fxosTablet = function() {
                return this.fxos() && this._find("tablet")
            }, a.prototype.meego = function() {
                return this._find("meego")
            }, a.prototype.cordova = function() {
                return window.cordova && "file:" === location.protocol
            }, a.prototype.nodeWebkit = function() {
                return "object" == typeof window.process
            }, a.prototype.mobile = function() {
                return this.androidPhone() || this.iphone() || this.ipod() || this.windowsPhone() || this.blackberryPhone() || this.fxosPhone() || this.meego()
            }, a.prototype.tablet = function() {
                return this.ipad() || this.androidTablet() || this.blackberryTablet() || this.windowsTablet() || this.fxosTablet()
            }, a.prototype.desktop = function() {
                return !this.tablet()&&!this.mobile()
            }, a.prototype.nexus5 = function() {
                return this._find("nexus 5")
            }, a.prototype.portrait = function() {
                return window.innerHeight / window.innerWidth > 1
            }, a.prototype.landscape = function() {
                return window.innerHeight / window.innerWidth < 1
            }, a.prototype.noConflict = function() {
                return window.device = this.previousDevice, this
            }, a.prototype.browserVersion = function() {
                var a, b, c;
                return c = navigator.userAgent, b = void 0, a = c.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [], /trident/i.test(a[1]) ? (b = /\brv[ :]+(\d+)/g.exec(c) || [], {
                    name: "IE ",
                    version: b[1] || ""
                }) : "Chrome" === a[1] && (b = c.match(/\bOPR\/(\d+)/), null !== b) ? {
                    name: "Opera",
                    version: b[1]
                } : (a = a[2] ? [a[1], a[2]] : [navigator.appName, navigator.appVersion, "-?"], null !== (b = c.match(/version\/(\d+)/i)) && a.splice(1, 1, b[1]), {
                    name: a[0],
                    version: a[1]
                })
            }, a.prototype._find = function(a) {
                return - 1 !== this._user_agent.indexOf(a)
            }, a.prototype._hasClass = function(a) {
                var b;
                return b = new RegExp("\\b(" + a + ")\\b", "i"), this._doc_element.className.match(b)
            }, a.prototype._addClass = function(a) {
                return this._hasClass(a) ? void 0 : this._doc_element.className += " " + a
            }, a.prototype._removeClass = function(a) {
                if (this._hasClass(a)) {
                    var b;
                    return b = new RegExp("\\b(" + a + ")\\b", "i"), this._doc_element.className = this._doc_element.className.replace(b, "")
                }
            }, a.prototype.onDOMloaded = function() {
                return this._doc_element = window.document.body, this.ios() ? this.ipad() ? this._addClass("ios ipad tablet") : this.iphone() ? this._addClass("ios iphone mobile") : this.ipod() && this._addClass("ios ipod mobile") : this.android() ? this.desktop() ? this._addClass("android desktop error-android-resolution") : this.androidTablet() ? this._addClass("android tablet") : this._addClass("android mobile") : this.blackberry() ? this.blackberryTablet() ? this._addClass("blackberry tablet") : this._addClass("blackberry mobile") : this.windows() ? this.windowsTablet() ? this._addClass("windows tablet") : this.windowsPhone() ? this._addClass("windows mobile") : this.windows() && this._addClass("windows desktop") : this.fxos() ? this.fxosTablet() ? this._addClass("fxos tablet") : this._addClass("fxos mobile") : this.meego() ? this._addClass("meego mobile") : this.nodeWebkit() ? this._addClass("node-webkit") : this.osx() ? this._addClass("osx desktop") : this._addClass("desktop"), this.desktop() && this._addClass("desktop"), this.cordova() && this._addClass("cordova"), this.chrome() && this._addClass("chrome"), this.firefox() && this._addClass("firefox"), this.ie() && (this._addClass("ie"), this.ie6() ? this._addClass("ie6") : this.ie7() ? this._addClass("ie7") : this.ie8() ? this._addClass("ie8") : this.ie9() ? this._addClass("ie9") : this.ie10() ? this._addClass("ie10") : this._addClass("ie11")), this._supports_orientation = "onorientationchange"in window, this._orientation_event = (this._supports_orientation, "orientationchange"), window.addEventListener ? window.addEventListener("resize", this._handleResize, !1) : document.attachEvent("resize", this._handleResize), this._handleResize()
            }, a.prototype.orientationCallback = null, a.prototype._handleResize = function() {
                this._handleScreenOrientation();
                var a;
                a = "portrait", this.landscape() ? (this._removeClass("portrait"), this._addClass("landscape"), a = "landscape") : (this._removeClass("landscape"), this._addClass("portrait")), "function" == typeof this.orientationCallback && this.orientationCallback(a)
            }, a.prototype._handleOrientation = function(a) {
                this._handleScreenOrientation();
                var b;
                b = "portrait", this.landscape() ? (this._removeClass("portrait"), this._addClass("landscape"), b = "landscape") : (this._removeClass("landscape"), this._addClass("portrait")), "function" == typeof this.orientationCallback && this.orientationCallback(b)
            }, a.prototype.screenOrientation = function() {
                return window.screen.availHeight / window.screen.availWidth > 1 ? "portrait" : "landscape"
            }, a.prototype._handleScreenOrientation = function() {
                "portrait" === this.screenOrientation() ? (this._removeClass("screenlandscape"), this._addClass("screenportrait")) : (this._removeClass("screenportrait"), this._addClass("screenlandscape"))
            }, a
        }(), d = function() {
            function a() {}
            var b, c;
            return c = null, a.get = function() {
                return null != c ? c : c = new b
            }, b = function() {
                function a() {
                    this.onChangeOrientation = f(this.onChangeOrientation, this), this.device = new window.Device, this.browserVersion = this.device.browserVersion(), this.isOSX = this.device.osx(), this.isIpad = this.device.ios() && this.device.ipad(), this.isIphone = this.device.ios() && (this.device.iphone() || this.device.ipod), this.isIos = this.device.ios(), this.isAndroidTablet = this.device.android() && this.device.androidTablet(), this.device.android()&&!this.device.androidTablet() && (this.isAndroidPhone=!0), this.isAndroid = this.device.android(), this.isTablet = this.device.tablet(), this.isMobile = this.device.mobile(), this.isDesktop = this.device.desktop(), this.isNexus5 = this.device.nexus5(), this.isWindow = this.device.windows(), this.isWindowsPhone = this.device.windowsPhone(), this.isWindowsTablet = this.device.windowsTablet(), this.isChrome = this.device.chrome(), this.isFirefox = this.device.firefox(), this.isIE = this.device.ie(), this.isIE6 = this.device.ie6(), this.isIE7 = this.device.ie7(), this.isIE8 = this.device.ie8(), this.isIE9 = this.device.ie9(), this.isIE10 = this.device.ie10(), this.isIE11 = this.device.ie11(), this.isIE12 = this.device.ie12(), this.isIEDesktop = this.device.ie()&&!this.device.windowsPhone()&&!this.device.windowsTablet(), this.isltIE10 = this.device.ie9() || this.device.ie8() || this.device.ie7() || this.device.ie6(), this.islteIE10 = this.device.ie10() || this.device.ie9() || this.device.ie8() || this.device.ie7() || this.device.ie6(), this.isltIE9 = this.device.ie8() || this.device.ie7() || this.device.ie6(), this.islteIE9 = this.device.ie9() || this.device.ie8() || this.device.ie7() || this.device.ie6(), this.isSafari=!this.device.chrome() && this.device.safari(), this.isLandscape = this.device.landscape(), this.isPortrait = this.device.portrait(), this.isGalaxyTab10inches = this.device.android() && e("(min-device-width: 1280px) and (max-device-width: 1281px) and (orientation: landscape), (min-device-width: 800px) and (max-device-width: 801px) and (orientation: portrait)"), this.isGalaxyTab7inches = this.device.android() && e("(min-device-width: 1024px) and (max-device-width: 1025px) and (orientation: landscape), (min-device-width: 600px) and (max-device-width: 601px) and (orientation: portrait)"), this.isGalaxyTab = this.isGalaxyTab7inches || this.isGalaxyTab10inches, this.isAndroid && this.isGalaxyTab && this.forceGalaxyTab()
                }
                return a.prototype.forceGalaxyTab = function() {
                    return this.device.desktop = function() {
                        return !0
                    }, this.device.tablet = function() {
                        return !1
                    }, this.device.mobile = function() {
                        return !1
                    }, this.isDesktop = this.device.desktop(), this.isTablet = this.device.tablet(), this.isMobile = this.device.mobile()
                }, a.prototype.bindEvents = function() {
                    return this.device.onDOMloaded()
                }, a.prototype.onChangeOrientation = function(a) {
                    return null == a && (a = null), null != a ? this.device.orientationCallback = a : void 0
                }, a
            }(), a
        }(), e = function(a) {
            var b, c, d;
            if (null != window.matchMedia)
                switch (b = "(min-device-width: 1024px)", d = "(min-device-width: 768px) and (max-device-width: 1023px)", c = "(min-device-width: 320px) and (max-device-width: 767px)", a) {
                case"mobile":
                    return window.matchMedia(c).matches;
                case"tablet":
                    return window.matchMedia(d).matches;
                case"desktop":
                    return window.matchMedia(b).matches;
                default:
                    return window.matchMedia(a).matches
                }
        }, window.BrowserDetect = d.get(), BrowserDetect.bindEvents(), b.exports = window.BrowserDetect
    }, {}
    ],
    89: [function(a, b, c) {
        function d(a, b) {
            return b[0] = (a>>16 & 255) / 255, b[1] = (a>>8 & 255) / 255, b[2] = (255 & a) / 255, b
        }
        function e(a) {
            return d(a, new Float32Array(3))
        }
        function f(a, b) {
            d(b, g), a.set(g[0], g[1], g[2])
        }
        var g = new Float32Array(3);
        b.exports = {
            HexToVec: d,
            MakeFromHex: e,
            HexInput: f
        }
    }, {}
    ],
    90: [function(a, b, c) {
        b.exports = {
            linear: function(a) {
                return a
            },
            easeInQuad: function(a) {
                return a * a
            },
            easeOutQuad: function(a) {
                return a * (2 - a)
            },
            easeInOutQuad: function(a) {
                return .5 > a ? 2 * a * a : - 1 + (4 - 2 * a) * a
            },
            easeInCubic: function(a) {
                return a * a * a
            },
            easeOutCubic: function(a) {
                return --a * a * a + 1
            },
            easeInOutCubic: function(a) {
                return .5 > a ? 4 * a * a * a : (a - 1) * (2 * a - 2) * (2 * a - 2) + 1
            },
            easeInQuart: function(a) {
                return a * a * a * a
            },
            easeOutQuart: function(a) {
                return 1 - --a * a * a * a
            },
            easeInOutQuart: function(a) {
                return .5 > a ? 8 * a * a * a * a : 1 - 8*--a * a * a * a
            },
            easeInQuint: function(a) {
                return a * a * a * a * a
            },
            easeOutQuint: function(a) {
                return 1+--a * a * a * a * a
            },
            easeInOutQuint: function(a) {
                return .5 > a ? 16 * a * a * a * a * a : 1 + 16*--a * a * a * a * a
            }
        }
    }, {}
    ],
    91: [function(a, b, c) {
        function d(a) {
            function b() {
                d--, c.notify(1 - d / a.length), 0 === d && c.resolve(!0)
            }
            for (var c = j.defer(), d = a.length, e = 0; e < a.length; e++)
                a[e].then(b, c.reject);
            return c.promise
        }
        function e(a, b) {
            var c = j.defer(), d = j.defer(), e = Date.now(), f = 0;
            a.then(null, null, function(a) {
                f = a
            });
            var g = setInterval(function() {
                var a = Date.now() - e, g = Math.min(a / b, f);
                a > b && d.resolve(), c.notify(g)
            }, 50);
            return j.all([a, d.promise]).then(function() {
                clearInterval(g), c.resolve(!0)
            }), c.promise
        }
        function f(a) {
            return i(a, "").then(function(a) {
                return JSON.parse(a)
            })
        }
        function g(a) {
            return i(a, "arraybuffer")
        }
        function h(a) {
            var b = j.defer(), c = new Image;
            return c.onload = function() {
                b.resolve(c)
            }, c.onerror = function() {
                b.reject()
            }, c.crossOrigin = "anonymous", c.src = a, b.promise
        }
        function i(a, b) {
            var c, d, e = "GET";
            return c = j.defer(), d = new XMLHttpRequest, d.open(e, a, !0), d.responseType = b, d.onload = function() {
                return c.resolve(d.response)
            }, d.error = function(a) {
                return c.reject(a)
            }, d.send(), c.promise
        }
        var j = a("when");
        b.exports = {
            loadJson: f,
            loadBytes: g,
            loadImage: h,
            whenAll: d,
            throttling: e
        }
    }, {
        when: 184
    }
    ],
    92: [function(a, b, c) {
        (function(d) {
            !function(a) {
                if ("object" == typeof c && "undefined" != typeof b)
                    b.exports = a();
                else if ("function" == typeof define && define.amd)
                    define([], a);
                else {
                    var e;
                    e = "undefined" != typeof window ? window : "undefined" != typeof d ? d : "undefined" != typeof self ? self : this, e.awdlib_pil = a()
                }
            }(function() {
                return function b(c, d, e) {
                    function f(h, i) {
                        if (!d[h]) {
                            if (!c[h]) {
                                var j = "function" == typeof a && a;
                                if (!i && j)
                                    return j(h, !0);
                                if (g)
                                    return g(h, !0);
                                var k = new Error("Cannot find module '" + h + "'");
                                throw k.code = "MODULE_NOT_FOUND", k
                            }
                            var l = d[h] = {
                                exports: {}
                            };
                            c[h][0].call(l.exports, function(a) {
                                var b = c[h][1][a];
                                return f(b ? b : a)
                            }, l, l.exports, b, c, d, e)
                        }
                        return d[h].exports
                    }
                    for (var g = "function" == typeof a && a, h = 0; h < e.length; h++)
                        f(e[h]);
                    return f
                }({
                    1: [function(a, b, c) {
                        var d = a("../../src/BaseElement"), e = a("../../src/bufferReader"), f = a("../../src/consts"), g = a("../std/Geometry"), h = a("./extInfos"), i = function() {
                            this.data = null, this.attributes = [], this.ftype = f.AWD_FIELD_FLOAT32
                        };
                        i.HEAD_SIZE = 6, i.prototype = {
                            allocate: function(a, b) {
                                var c = g.getArray(b);
                                this.data = new c(a)
                            },
                            read: function(a) {
                                var b = a.U8(), c = a.U8(), d = this.attributes;
                                this.ftype = c;
                                var e = 0;
                                this.isIndex=!1;
                                for (var h = 0; b > h; h++) {
                                    var i = a.U8(), j = a.U8();
                                    i === f.INDEX && (b > 1 && console.warn("interleaved index buffer is not alone"), this.isIndex=!0), e += j, d.push({
                                        type: i,
                                        len: j
                                    })
                                }
                                var k = a.U8();
                                a.ptr += k;
                                var l = a.U32(), m = a.ptr + l, n = g.getTypeSize(c), o = l / n;
                                this.numVertices = o / e;
                                var p = g.getArray(c);
                                this.data = new p(a.buffer, a.ptr, o), a.ptr = m
                            },
                            write: void 0
                        };
                        var j = function(a) {
                            var b = new g.SubGeom;
                            b.extras = a.extras.clone(), b.props = a.props.clone();
                            for (var c, d, h, j = a.buffers, k = {}, l = 0, m = j.length; m > l; l++)
                                d = j[l], 2 !== d.type ? (c = d.ftype, k[c] || (k[c] = {
                                    list: [],
                                    ftype: c
                                }), k[c].list.push(d)) : (h = new i, h.attributes.push({
                                    type: 2,
                                    len: 3
                                }), h.data = d.data, h.ftype = f.AWD_FIELD_UINT16, h.isIndex=!0, b.buffers.push(h));
                            for (var n in k) {
                                var o = k[n].list, p = o[0].numVertices;
                                c = k[n].ftype, h = new i, b.buffers.push(h), h.ftype = c;
                                var q, r = [];
                                for (l = 0, m = o.length; m > l; l++) {
                                    d = o[l];
                                    var s = new e(d.data.buffer);
                                    for (h.attributes.push({
                                        type: d.type,
                                        len: d.components
                                    }), q = 0; q < d.components; q++)
                                        r.push(s)
                                    }
                                var t = g.getArray(c), u = new t(r.length * p), v = g.getReadFunc(c, r[0]), w = 0;
                                for (l = 0; p > l; l++)
                                    for (q = 0, m = r.length; m > q; q++)
                                        u[w++] = v.call(r[q]);
                                h.data = u
                            }
                            return b
                        }, k = d.createStruct(h.INTERLEAVED_GEOM, h.URI, g.prototype);
                        k.prototype.fromGeometry = function(a) {
                            this.name = a.name, this.extras = a.extras.clone(), this.props = a.props.clone();
                            for (var b = 0, c = a.subGeoms.length; c > b; b++) {
                                var d = a.subGeoms[b];
                                this.subGeoms.push(j(d))
                            }
                        }, k.prototype.subGeomFactory = function() {
                            var a = g.prototype.subGeomFactory();
                            return a.bufferFactory = this.bufferFactory, a
                        }, k.prototype.bufferFactory = function() {
                            return new i
                        }, k.prototype.toString = function() {
                            return "[InterleavedGeometry " + this.name + "]"
                        }, b.exports = k
                    }, {
                        "../../src/BaseElement": 6,
                        "../../src/bufferReader": 9,
                        "../../src/consts": 12,
                        "../std/Geometry": 4,
                        "./extInfos": 3
                    }
                    ],
                    2: [function(a, b, c) {
                        var d = a("../../src/extension"), e = a("./InterleavedGeometry"), f = a("./extInfos"), g = [e], h = f;
                        h.getExtension = function() {
                            var a = new d(f.URI);
                            return a.addStructs(g), a
                        }, b.exports = h
                    }, {
                        "../../src/extension": 13,
                        "./InterleavedGeometry": 1,
                        "./extInfos": 3
                    }
                    ],
                    3: [function(a, b, c) {
                        b.exports = {
                            URI: "https://github.com/plepers/awd-js",
                            INTERLEAVED_GEOM: 1
                        }
                    }, {}
                    ],
                    4: [function(a, b, c) {
                        !function() {
                            "use strict";
                            var c = a("consts"), d = a("types/awdString"), e = a("types/userAttr"), f = a("types/properties"), g = a("BaseElement"), h = g.createStruct(c.GEOMETRY, null, {
                                subGeomFactory: function() {
                                    var a = new i;
                                    return a.bufferFactory = this.bufferFactory, a
                                },
                                bufferFactory: function() {
                                    return new k
                                },
                                init: function() {
                                    this.model = c.MODEL_GEOMETRY, this.name = "", this.extras = new e, this.props = new f({}), this.subGeoms = []
                                },
                                read: function(a) {
                                    this.name = d.read(a);
                                    var b = a.U16(), c = this.awd.header.geoNrType, e = this.props;
                                    e.expected[1] = c, e.expected[2] = c, e.read(a);
                                    var f = e.get(1, 1), g = e.get(2, 1);
                                    1 === f && 1 === g || console.log("WARN defined scale UV in geometry");
                                    for (var h, i = this.subGeoms, j = 0; b > j; j++)
                                        h = this.subGeomFactory(), h.read(this.awd, a), i.push(h);
                                    this.extras.read(a)
                                },
                                write: void 0,
                                toString: function() {
                                    return "[Geometry " + this.name + "]"
                                }
                            }), i = function() {
                                this.buffers = [], this.extras = new e, this.props = new f({})
                            };
                            i.prototype = {
                                getBuffersByType: function(a, b) {
                                    void 0 === b && (b = []);
                                    var c, d;
                                    if (a instanceof Array)
                                        for (c = 0, d = a.length; d > c; c++)
                                            this.getBuffersByType(a[c], b);
                                    else 
                                        for (c = 0, d = this.buffers.length; d > c; c++)
                                            this.buffers[c].type === a && b.push(this.buffers[c]);
                                    return b
                                },
                                read: function(a, b) {
                                    var c = b.U32(), d = b.ptr + c, e = a.header.geoNrType, f = this.props;
                                    f.expected[1] = e, f.expected[2] = e, f.read(b);
                                    var g = f.get(1, 1), h = f.get(2, 1);
                                    1 === g && 1 === h || console.log("WARN defined scale UV in sub-geometry");
                                    for (var i, j =- 1; b.ptr < d;)
                                        i = this.bufferFactory(), i.read(b), !i.isIndex && i.numVertices>-1 && (j>-1 && i.numVertices !== j && console.log("Warn buffers in geom has differents num vertices", j, i.numVertices), j = i.numVertices), this.buffers.push(i);
                                    - 1 === j && console.log("Error, Can't resolve geom buffers sizes");
                                    for (var k = 0, l = this.buffers.length; l > k; k++)
                                        i = this.buffers[k], - 1 !== i.numVertices || i.isIndex || i.solveSize(j);
                                    this.extras.read(b)
                                },
                                write: function(a, b) {
                                    var c = b.skipBlockSize();
                                    this.writeProps(a, b);
                                    for (var d = 0, e = this.buffers.length; e > d; d++) {
                                        var f = this.buffers[d];
                                        f.write(b)
                                    }
                                    b.writeBlockSize(c), this.extras.write(b)
                                },
                                writeProps: function(a, b) {
                                    var c = a.header.geoNrType, d = this.props;
                                    d.expected[1] = c, d.expected[2] = c, d.set(1, 1), d.set(2, 1), d.write(b)
                                }
                            };
                            var j = function(a) {
                                return 2 === a ? c.AWD_FIELD_UINT16 : 4 === a ? c.AWD_FIELD_FLOAT32 : a
                            }, k = function() {
                                this.data = null, this.numVertices =- 1, this.type = 0, this.components = 0, this.ftype = c.T_FLOAT, this.isIndex=!1
                            };
                            k.HEAD_SIZE = 6, k.prototype = {
                                allocate: function(a, b) {
                                    var c = o(b);
                                    void 0 === c && console.log(b), this.data = new c(a)
                                },
                                solveSize: function(a) {
                                    this.numVertices = a, this.components = this.data.length / a
                                },
                                read: function(a) {
                                    var b = a.U8(), d = a.U8(), e = a.U32(), f = a.ptr + e;
                                    d = j(d), d !== c.AWD_FIELD_UINT16 && d !== c.AWD_FIELD_FLOAT32 && d !== c.AWD_FIELD_FLOAT64 && console.log("WARN unexpected stream data type ", d, b, e);
                                    var g = p(b);
                                    this.isIndex = b === c.INDEX, this.type = b, this.components = g, this.ftype = d;
                                    var h = l(d), i = e / h;
                                    - 1 !== g && (this.numVertices = i / g), this.allocate(i, d);
                                    for (var k = m(d, a), n = this.data, o = 0; a.ptr < f;)
                                        n[o++] = k.call(a)
                                },
                                write: function(a) {
                                    a.U8(this.type), a.U8(this.ftype);
                                    for (var b = a.skipBlockSize(), c = n(this.ftype, a), d = this.data, e = 0, f = d.length; f > e; e++)
                                        c.call(a, d[e]);
                                    a.writeBlockSize(b)
                                }
                            };
                            var l = function(a) {
                                switch (a) {
                                case c.AWD_FIELD_UINT16:
                                    return 2;
                                case c.AWD_FIELD_FLOAT32:
                                    return 4;
                                case c.AWD_FIELD_FLOAT64:
                                    return 8
                                }
                                throw new Error("WARN getTypeSize - unexpected stream data type " + a)
                            }, m = function(a, b) {
                                switch (a) {
                                case c.AWD_FIELD_UINT16:
                                    return b.U16;
                                case c.AWD_FIELD_FLOAT32:
                                    return b.F32;
                                case c.AWD_FIELD_FLOAT64:
                                    return b.F64
                                }
                                throw new Error("WARN getReadFunc - unexpected stream data type " + a)
                            }, n = function(a, b) {
                                switch (a) {
                                case c.AWD_FIELD_UINT16:
                                    return b.U16;
                                case c.AWD_FIELD_FLOAT32:
                                    return b.F32;
                                case c.AWD_FIELD_FLOAT64:
                                    return b.F64
                                }
                                throw new Error("WARN getWriteFunc - unexpected stream data type " + a)
                            }, o = function(a) {
                                switch (a) {
                                case c.AWD_FIELD_UINT16:
                                    return Uint16Array;
                                case c.AWD_FIELD_FLOAT32:
                                    return Float32Array;
                                case c.AWD_FIELD_FLOAT64:
                                    return Float64Array
                                }
                                throw new Error("WARN getArray - unexpected stream data type " + a)
                            }, p = function(a) {
                                switch (a) {
                                case c.POSITION:
                                case c.INDEX:
                                case c.NORMAL:
                                case c.TANGENT:
                                case c.BINORMAL:
                                    return 3;
                                case c.UVS:
                                    return 2;
                                case c.JOIN_WGT:
                                case c.JOIN_IDX:
                                    return - 1;
                                default:
                                    return - 1
                                }
                            };
                            h.SubGeom = i, h.VertexBuffer = k, h.getTypeSize = l, h.getReadFunc = m, h.getWriteFunc = n, h.getArray = o, h.fixC4D_Type = j, b.exports = h
                        }()
                    }, {
                        BaseElement: 6,
                        consts: 12,
                        "types/awdString": 14,
                        "types/properties": 15,
                        "types/userAttr": 16
                    }
                    ],
                    5: [function(a, b, c) {
                        String.prototype.codePointAt ||!function() {
                            "use strict";
                            var a = function() {
                                try {
                                    var a = {}, b = Object.defineProperty, c = b(a, a, a) && b
                                } catch (d) {}
                                return c
                            }(), b = function(a) {
                                if (null == this)
                                    throw TypeError();
                                var b = String(this), c = b.length, d = a ? Number(a): 0;
                                if (d != d && (d = 0), !(0 > d || d >= c)) {
                                    var e, f = b.charCodeAt(d);
                                    return f >= 55296 && 56319 >= f && c > d + 1 && (e = b.charCodeAt(d + 1), e >= 56320 && 57343 >= e) ? 1024 * (f - 55296) + e - 56320 + 65536 : f
                                }
                            };
                            a ? a(String.prototype, "codePointAt", {
                                value: b,
                                configurable: !0,
                                writable: !0
                            }) : String.prototype.codePointAt = b
                        }()
                    }, {}
                    ],
                    6: [function(a, b, c) {
                        !function() {
                            var c = a("./consts"), d = a("./chunk"), e = {
                                _setup: function(a, b) {
                                    this.awd = a, this.chunk = b, this.id = b.id
                                },
                                init: function() {
                                    this.injectDeps=!1, this.model = c.MODEL_GENERIC
                                },
                                getDependencies: function() {
                                    return this.deps ? this.deps : null
                                },
                                prepareAndAdd: void 0,
                                prepareChunk: function() {
                                    null === this.chunk && (this.chunk = new d),
                                    this.chunk.type = this.type,
                                    this.chunk.ns = this.ns
                                }
                            }, f = {};
                            f.createStruct = function(a, b, c) {
                                var d = function() {
                                    this.type = a, this.nsUri = b, this.ns = 0, this.injectDeps=!0, this.init(), this.chunk = null, this.id =- 1
                                };
                                d.TYPE = a;
                                var f;
                                for (f in e)
                                    d.prototype[f] = e[f];
                                for (f in c)
                                    d.prototype[f] = c[f];
                                return d
                            }, b.exports = f
                        }()
                    }, {
                        "./chunk": 11,
                        "./consts": 12
                    }
                    ],
                    7: [function(a, b, c) {
                        var d = a("./consts"), e = a("./BaseElement"), f = e.createStruct(d.GENERIC, - 1, {
                            read: function(a) {
                                this.buf = new ArrayBuffer(this.chunk.size), a.readBytes(this.buf, this.chunk.size), this.setDeps()
                            },
                            write: function(a) {
                                a.writeBytes(this.buf, this.chunk.size)
                            },
                            setDeps: function() {
                                for (var a, b = this.awd._elements, c = [], d = 0, e = b.length; e > d; d++)
                                    a = b[d], c.push(a);
                                this.deps = c
                            },
                            prepareAndAdd: void 0,
                            prepareChunk: function() {}
                        });
                        b.exports = f
                    }, {
                        "./BaseElement": 6,
                        "./consts": 12
                    }
                    ],
                    8: [function(a, b, c) {
                        !function() {
                            var c = a("./types/awdString"), d = a("./consts"), e = a("./BaseElement"), f = e.createStruct(d.NAMESPACE, null, {
                                init: function() {
                                    this.uri = "", this.nsId = 0
                                },
                                read: function(a) {
                                    this.nsId = a.U8(), this.uri = c.read(a)
                                },
                                write: void 0
                            });
                            b.exports = f
                        }()
                    }, {
                        "./BaseElement": 6,
                        "./consts": 12,
                        "./types/awdString": 14
                    }
                    ],
                    9: [function(a, b, c) {
                        !function() {
                            var a = function(a, b, c) {
                                this.buffer = a, this.ptr = 0, this.littleEndien=!0, b = b || 0, c = c || a.byteLength, this.view = new DataView(a, b, c), this.length = this.view.byteLength
                            };
                            a.prototype = {
                                setPosition: function(a) {
                                    this.ptr = a
                                },
                                setLittleEndian: function(a) {
                                    this.littleEndien = a
                                },
                                bytesAvailable: function() {
                                    return this.length - this.ptr
                                },
                                I8: function() {
                                    return this.view.getInt8(this.ptr++)
                                },
                                U8: function() {
                                    return this.view.getUint8(this.ptr++)
                                },
                                I16: function() {
                                    var a = this.view.getInt16(this.ptr, this.littleEndien);
                                    return this.ptr += 2, a
                                },
                                U16: function() {
                                    var a = this.view.getUint16(this.ptr, this.littleEndien);
                                    return this.ptr += 2, a
                                },
                                I32: function() {
                                    var a = this.view.getInt32(this.ptr, this.littleEndien);
                                    return this.ptr += 4, a
                                },
                                U32: function() {
                                    var a = this.view.getUint32(this.ptr, this.littleEndien);
                                    return this.ptr += 4, a
                                },
                                F32: function() {
                                    var a = this.view.getFloat32(this.ptr, this.littleEndien);
                                    return this.ptr += 4, a
                                },
                                F64: function() {
                                    var a = this.view.getFloat64(this.ptr, this.littleEndien);
                                    return this.ptr += 8, a
                                },
                                readBytes: function(a, b) {
                                    void 0 === b && (b = a.byteLength);
                                    var c = new Int8Array(a), d = new Int8Array(this.buffer, this.ptr, b);
                                    c.set(d), this.ptr += b
                                },
                                subArray: function(a) {
                                    var b = new Int8Array(this.buffer, this.ptr, a);
                                    return this.ptr += a, b
                                },
                                readUTFBytes: function(a) {
                                    for (var b, c, d, e = this.ptr + a, f = [], g = 0; this.ptr < e;)
                                        b = this.U8(), 128 > b ? f[g++] = String.fromCharCode(b) : b > 191 && 224 > b ? (c = this.U8(), f[g++] = String.fromCharCode((31 & b)<<6 | 63 & c)) : (c = this.U8(), d = this.U8(), f[g++] = String.fromCharCode((15 & b)<<12 | (63 & c)<<6 | 63 & d));
                                    return f.join("")
                                }
                            }, b.exports = a
                        }()
                    }, {}
                    ],
                    10: [function(a, b, c) {
                        b.exports = {}
                    }, {
                        "string.prototype.codepointat": 5
                    }
                    ],
                    11: [function(a, b, c) {
                        !function() {
                            var a = function() {
                                this.id = 0, this.ns = 0, this.type = 0, this.flags = 0, this.size = 0, this.data = null
                            };
                            a.prototype = {
                                read: function(a) {
                                    this.id = a.U32(), this.ns = a.U8(), this.type = a.U8(), this.flags = a.U8(), this.size = a.U32()
                                },
                                write: void 0
                            }, b.exports = a
                        }()
                    }, {}
                    ],
                    12: [function(a, b, c) {
                        !function() {
                            var a = {
                                UNCOMPRESSED: 0,
                                DEFLATE: 1,
                                LZMA: 2,
                                AWD_FIELD_INT8: 1,
                                AWD_FIELD_INT16: 2,
                                AWD_FIELD_INT32: 3,
                                AWD_FIELD_UINT8: 4,
                                AWD_FIELD_UINT16: 5,
                                AWD_FIELD_UINT32: 6,
                                AWD_FIELD_FLOAT32: 7,
                                AWD_FIELD_FLOAT64: 8,
                                AWD_FIELD_BOOL: 21,
                                AWD_FIELD_COLOR: 22,
                                AWD_FIELD_BADDR: 23,
                                AWD_FIELD_STRING: 31,
                                AWD_FIELD_BYTEARRAY: 32,
                                AWD_FIELD_VECTOR2x1: 41,
                                AWD_FIELD_VECTOR3x1: 42,
                                AWD_FIELD_VECTOR4x1: 43,
                                AWD_FIELD_MTX3x2: 44,
                                AWD_FIELD_MTX3x3: 45,
                                AWD_FIELD_MTX4x3: 46,
                                AWD_FIELD_MTX4x4: 47,
                                INT8: 1,
                                INT16: 2,
                                INT32: 3,
                                UINT8: 4,
                                UINT16: 5,
                                UINT32: 6,
                                FLOAT32: 7,
                                FLOAT64: 8,
                                AWDSTRING: 31,
                                AWDBYTEARRAY: 32,
                                MAGIC: 4282180,
                                GENERIC: 0,
                                GEOMETRY: 1,
                                PRIMITIVE: 11,
                                CONTAINER: 22,
                                MESH: 23,
                                MATERIAL: 81,
                                TEXTURE: 82,
                                NAMESPACE: 254,
                                METADATA: 255,
                                MODEL_ENTITY: 2,
                                MODEL_SKYBOX: 4,
                                MODEL_CAMERA: 8,
                                MODEL_SEGMENT_SET: 16,
                                MODEL_MESH: 32,
                                MODEL_GEOMETRY: 64,
                                MODEL_SKELETON: 128,
                                MODEL_SKELETON_POSE: 256,
                                MODEL_CONTAINER: 512,
                                MODEL_TEXTURE: 1024,
                                MODEL_TEXTURE_PROJECTOR: 2048,
                                MODEL_MATERIAL: 4096,
                                MODEL_ANIMATION_SET: 8192,
                                MODEL_ANIMATION_STATE: 16384,
                                MODEL_ANIMATION_NODE: 32768,
                                MODEL_ANIMATOR: 65536,
                                MODEL_STATE_TRANSITION: 1<<17,
                                MODEL_LIGHT: 1<<18,
                                MODEL_LIGHT_PICKER: 1<<19,
                                MODEL_SHADOW_MAP_METHOD: 1<<20,
                                MODEL_EFFECTS_METHOD: 1<<21,
                                MODEL_GENERIC: - 1,
                                POSITION: 1,
                                INDEX: 2,
                                UVS: 3,
                                NORMAL: 4,
                                TANGENT: 5,
                                JOIN_IDX: 6,
                                JOIN_WGT: 7,
                                SUVS: 8,
                                COLOR: 11,
                                BINORMAL: 12,
                                DEFAULT_NS: 0
                            };
                            b.exports = a
                        }()
                    }, {}
                    ],
                    13: [function(a, b, c) {
                        var d = a("./DefaultElement"), e = a("./Namespace"), f = function(a) {
                            this.nsUri = a, this.structs = [], this.nsId = 0
                        };
                        f.prototype = {
                            addStruct: function(a) {
                                this.structs.push(a)
                            },
                            addStructs: function(a) {
                                for (var b = 0, c = a.length; c > b; b++)
                                    this.addStruct(a[b])
                            },
                            create: function(a) {
                                for (var b, c = this.structs, e = 0, f = c.length; f > e; e++)
                                    if (b = c[e], b.TYPE === a)
                                        return new b;
                                return new d
                            },
                            createNamespace: function() {
                                var a = new e;
                                return a.uri = this.nsUri, a
                            }
                        }, b.exports = f
                    }, {
                        "./DefaultElement": 7,
                        "./Namespace": 8
                    }
                    ],
                    14: [function(a, b, c) {
                        b.exports = {
                            read: function(a) {
                                var b = a.U16();
                                return a.readUTFBytes(b)
                            },
                            write: function(a, b) {
                                b.U16(a.length), b.writeUTFBytes(a)
                            },
                            getUTFBytesLength: function(a) {
                                for (var b = 0, c = 0, d = a.length; d > c; c++) {
                                    var e, f = a[c].codePointAt(0);
                                    128 > f ? e = 1 : 2048 > f ? e = 2 : 65536 > f ? e = 3 : 2097152 > f && (e = 4), b += e
                                }
                                return b
                            }
                        }
                    }, {}
                    ],
                    15: [function(a, b, c) {
                        !function() {
                            var c = a("../consts"), d = (a("./awdString"), a("../bufferWriter")), e = a("../bufferReader"), f = function(a) {
                                this.expected = a, this.vars = {}
                            };
                            f.prototype = {
                                clone: function() {
                                    var a = new d(64);
                                    this.write(a);
                                    var b = new f(this.expected);
                                    return b.read(new e(a.buffer)), b
                                },
                                read: function(a) {
                                    var b = this.expected, c = a.U32(), d = a.ptr + c;
                                    if (b)
                                        for (; a.ptr < d;) {
                                            var e, f = a.U16(), g = a.U32();
                                            this.expected.hasOwnProperty(f) ? (e = b[f], this.set(f, this.parseAttrValue(e, g, a))) : a.ptr += g
                                        }
                                    a.ptr !== d && (console.log("Warn Properties don't read entire data ", a.ptr, d, c), a.ptr = d)
                                },
                                write: void 0,
                                set: function(a,
                                b) {
                                    this.vars[a] = b
                                }, get : function(a, b) {
                                    return this.vars.hasOwnProperty(a) ? this.vars[a] : b
                                }, writeAttrValue: void 0, parseAttrValue : function(a, b, d) {
                                    var e, f;
                                    switch (a) {
                                    case c.AWD_FIELD_INT8:
                                        e = 1, f = d.I8;
                                        break;
                                    case c.AWD_FIELD_INT16:
                                        e = 2, f = d.I16;
                                        break;
                                    case c.AWD_FIELD_INT32:
                                        e = 4, f = d.I32;
                                        break;
                                    case c.AWD_FIELD_BOOL:
                                    case c.AWD_FIELD_UINT8:
                                        e = 1, f = d.U8;
                                        break;
                                    case c.AWD_FIELD_UINT16:
                                        e = 2, f = d.U16;
                                        break;
                                    case c.AWD_FIELD_UINT32:
                                    case c.AWD_FIELD_BADDR:
                                        e = 4, f = d.U32;
                                        break;
                                    case c.AWD_FIELD_FLOAT32:
                                        e = 4, f = d.F32;
                                        break;
                                    case c.AWD_FIELD_FLOAT64:
                                        e = 8, f = d.F64;
                                        break;
                                    case c.AWD_FIELD_STRING:
                                        var g = d.U16();
                                        g === b && console.log("WARN may be Prefab bug / String property bug!!"), d.ptr -= 2;
                                        var h = d.readUTFBytes(b);
                                        return h;
                                    case c.AWD_FIELD_VECTOR2x1:
                                    case c.AWD_FIELD_VECTOR3x1:
                                    case c.AWD_FIELD_VECTOR4x1:
                                    case c.AWD_FIELD_MTX3x2:
                                    case c.AWD_FIELD_MTX3x3:
                                    case c.AWD_FIELD_MTX4x3:
                                    case c.AWD_FIELD_MTX4x4:
                                        e = 8, f = d.F64
                                    }
                                    if (b > e) {
                                        var i, j, k;
                                        for (i = [], j = 0, k = b / e; k > j;)
                                            i.push(f.call(d)), j++;
                                        return i
                                    }
                                    return f.call(d)
                                }
                            }, b.exports = f
                        }()
                    }, {
                        "../bufferReader": 9,
                        "../bufferWriter": 10,
                        "../consts": 12,
                        "./awdString": 14
                    }
                    ],
                    16: [function(a, b, c) {
                        !function() {
                            var c = a("../consts"), d = a("./awdString"), e = a("../bufferWriter"), f = a("../bufferReader"), g = function() {
                                this.attributes = {}, this._list = []
                            };
                            g.prototype = {
                                clone: function() {
                                    var a = new e(64);
                                    this.write(a);
                                    var b = new g;
                                    return b.read(new f(a.buffer)), b
                                },
                                addAttribute: function(a, b, c, d) {
                                    var e = {
                                        name: a,
                                        value: b,
                                        type: c,
                                        ns: d
                                    };
                                    this.attributes[a] = e, this._list.push(e)
                                },
                                read: function(a) {
                                    var b, e = a.U32();
                                    if (e > 0) {
                                        b = {};
                                        for (var f = a.ptr + e; a.ptr < f;) {
                                            var g, h = a.U8(), i = d.read(a), j = a.U8(), k = a.U32();
                                            switch (j) {
                                            case c.AWDSTRING:
                                                g = a.readUTFBytes(k);
                                                break;
                                            case c.INT8:
                                                g = a.I8();
                                                break;
                                            case c.INT16:
                                                g = a.I16();
                                                break;
                                            case c.INT32:
                                                g = a.I32();
                                                break;
                                            case c.BOOL:
                                            case c.UINT8:
                                                g = a.U8();
                                                break;
                                            case c.UINT16:
                                                g = a.U16();
                                                break;
                                            case c.UINT32:
                                            case c.BADDR:
                                                g = a.U32();
                                                break;
                                            case c.FLOAT32:
                                                g = a.F32();
                                                break;
                                            case c.FLOAT64:
                                                g = a.F64();
                                                break;
                                            default:
                                                g = "unimplemented attribute type " + j + "ns : " + h, a.ptr += k
                                            }
                                            this.addAttribute(i, g, j, h), b[i] = g
                                        }
                                    }
                                    return b
                                },
                                write: void 0
                            }, b.exports = g
                        }()
                    }, {
                        "../bufferReader": 9,
                        "../bufferWriter": 10,
                        "../consts": 12,
                        "./awdString": 14
                    }
                    ],
                    awdlib_pil: [function(a, b, c) {
                        b.exports = {
                            InterleavedGeometry: a("./InterleavedGeometry"),
                            ext: a("./ext"),
                            extInfos: a("./extInfos")
                        }
                    }, {
                        "./InterleavedGeometry": 1,
                        "./ext": 2,
                        "./extInfos": 3
                    }
                    ]
                }, {}, [])("awdlib_pil")
            })
        }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }, {}
    ],
    93: [function(a, b, c) {
        (function(d) {
            !function(a) {
                if ("object" == typeof c && "undefined" != typeof b)
                    b.exports = a();
                else if ("function" == typeof define && define.amd)
                    define([], a);
                else {
                    var e;
                    e = "undefined" != typeof window ? window : "undefined" != typeof d ? d : "undefined" != typeof self ? self : this, e.awdlib = a()
                }
            }(function() {
                return function b(c, d, e) {
                    function f(h, i) {
                        if (!d[h]) {
                            if (!c[h]) {
                                var j = "function" == typeof a && a;
                                if (!i && j)
                                    return j(h, !0);
                                if (g)
                                    return g(h, !0);
                                var k = new Error("Cannot find module '" + h + "'");
                                throw k.code = "MODULE_NOT_FOUND", k
                            }
                            var l = d[h] = {
                                exports: {}
                            };
                            c[h][0].call(l.exports, function(a) {
                                var b = c[h][1][a];
                                return f(b ? b : a)
                            }, l, l.exports, b, c, d, e)
                        }
                        return d[h].exports
                    }
                    for (var g = "function" == typeof a && a, h = 0; h < e.length; h++)
                        f(e[h]);
                    return f
                }({
                    1: [function(a, b, c) {
                        String.prototype.codePointAt ||!function() {
                            "use strict";
                            var a = function() {
                                try {
                                    var a = {}, b = Object.defineProperty, c = b(a, a, a) && b
                                } catch (d) {}
                                return c
                            }(), b = function(a) {
                                if (null == this)
                                    throw TypeError();
                                var b = String(this), c = b.length, d = a ? Number(a): 0;
                                if (d != d && (d = 0), !(0 > d || d >= c)) {
                                    var e, f = b.charCodeAt(d);
                                    return f >= 55296 && 56319 >= f && c > d + 1 && (e = b.charCodeAt(d + 1), e >= 56320 && 57343 >= e) ? 1024 * (f - 55296) + e - 56320 + 65536 : f
                                }
                            };
                            a ? a(String.prototype, "codePointAt", {
                                value: b,
                                configurable: !0,
                                writable: !0
                            }) : String.prototype.codePointAt = b
                        }()
                    }, {}
                    ],
                    2: [function(a, b, c) {
                        !function() {
                            var c = a("./consts"), d = a("./chunk"), e = {
                                _setup: function(a, b) {
                                    this.awd = a, this.chunk = b, this.id = b.id
                                },
                                init: function() {
                                    this.injectDeps=!1, this.model = c.MODEL_GENERIC
                                },
                                getDependencies: function() {
                                    return this.deps ? this.deps : null
                                },
                                prepareAndAdd: void 0,
                                prepareChunk: function() {
                                    null === this.chunk && (this.chunk = new d),
                                    this.chunk.type = this.type,
                                    this.chunk.ns = this.ns
                                }
                            }, f = {};
                            f.createStruct = function(a, b, c) {
                                var d = function() {
                                    this.type = a, this.nsUri = b, this.ns = 0, this.injectDeps=!0, this.init(), this.chunk = null, this.id =- 1
                                };
                                d.TYPE = a;
                                var f;
                                for (f in e)
                                    d.prototype[f] = e[f];
                                for (f in c)
                                    d.prototype[f] = c[f];
                                return d
                            }, b.exports = f
                        }()
                    }, {
                        "./chunk": 8,
                        "./consts": 9
                    }
                    ],
                    3: [function(a, b, c) {
                        var d = a("./consts"), e = a("./BaseElement"), f = e.createStruct(d.GENERIC, - 1, {
                            read: function(a) {
                                this.buf = new ArrayBuffer(this.chunk.size), a.readBytes(this.buf, this.chunk.size), this.setDeps()
                            },
                            write: function(a) {
                                a.writeBytes(this.buf, this.chunk.size)
                            },
                            setDeps: function() {
                                for (var a, b = this.awd._elements, c = [], d = 0, e = b.length; e > d; d++)
                                    a = b[d], c.push(a);
                                this.deps = c
                            },
                            prepareAndAdd: void 0,
                            prepareChunk: function() {}
                        });
                        b.exports = f
                    }, {
                        "./BaseElement": 2,
                        "./consts": 9
                    }
                    ],
                    4: [function(a, b, c) {
                        !function() {
                            var c = a("./types/awdString"), d = a("./consts"), e = a("./BaseElement"), f = e.createStruct(d.NAMESPACE, null, {
                                init: function() {
                                    this.uri = "", this.nsId = 0
                                },
                                read: function(a) {
                                    this.nsId = a.U8(), this.uri = c.read(a)
                                },
                                write: void 0
                            });
                            b.exports = f
                        }()
                    }, {
                        "./BaseElement": 2,
                        "./consts": 9,
                        "./types/awdString": 18
                    }
                    ],
                    5: [function(a, b, c) {
                        var d = a("./header"), e = a("./writer"), f = a("./consts"), g = a("./chunk"), h = a("./bufferReader"), i = a("./DefaultElement"), j = function() {
                            this.header = new d, this._elements = [], this._elementsById = [], this._extensions = []
                        };
                        j.prototype = {
                            addElement: function(a) {
                                this._elements.push(a), this._elementsById[a.id] = a
                            },
                            removeElement: function(a) {
                                var b = this._elements.indexOf(a);
                                b>-1 && this._elements.splice(b, 1)
                            },
                            parse: function(a) {
                                var b, c = new h(a);
                                for (this.header.read(c); c.bytesAvailable() > 0;)
                                    b = this.parseChunk(c)
                            },
                            write: function() {
                                return e.write(this)
                            },
                            registerNamespace: function(a) {
                                var b = this.getExtension(a.uri);
                                b && (b.nsId = a.nsId)
                            },
                            addExtension: function(a) {
                                if (null === this.getExtension(a.nsUri)) {
                                    var b, c = this._extensions.push(a), d = a.createNamespace();
                                    null !== a.nsUri ? (b = c + 1, this.addElement(d)) : b = 0, d.nsId = a.nsId = b
                                }
                            },
                            getExtension: function(a) {
                                for (var b = this._extensions, c = 0, d = b.length; d > c; c++)
                                    if (b[c].nsUri === a)
                                        return b[c];
                                return null
                            },
                            getExtensionById: function(a) {
                                for (var b = this._extensions, c = 0, d = b.length; d > c; c++)
                                    if (b[c].nsId === a)
                                        return b[c];
                                return null
                            },
                            getDatasByType: function(a, b, c) {
                                void 0 === b && (b = null), void 0 === c && (c = []);
                                var d, e;
                                if (a instanceof Array)
                                    for (d = 0, e = a.length; e > d; d++)
                                        this.getDatasByType(a[d], b, c);
                                else 
                                    for (d = 0, e = this._elements.length; e > d; d++)
                                        this._elements[d].type === a && this._elements[d].nsUri === b && c.push(this._elements[d]);
                                return c
                            },
                            getAssetByID: function(a, b) {
                                var c = [], d = 0, e = this._elementsById;
                                if (a > 0 && e[a])
                                    for (; d < b.length;) {
                                        if (0 !== (e[a].model & b[d]))
                                            return c.push(!0), c.push(e[a]), c;
                                            if (b[d] === f.MODEL_GEOMETRY && 0 !== (e[a].model & f.MODEL_MESH))
                                                return c.push(!0), c.push(e[a].geometry), c;
                                                d++
                                    }
                                return c.push(!1), c.push(null), c
                            },
                            parseChunk: function(a) {
                                var b = new g;
                                b.read(a);
                                var c = this.structFactory(b), d = a.ptr;
                                c.read(a), a.ptr - d !== b.size && (console.log("Warn bad block parsing , byte delta : ", a.ptr - d - b.size), a.ptr = d + b.size), b.ns === f.DEFAULT_NS && b.type === f.NAMESPACE && this.registerNamespace(c), this.addElement(c)
                            },
                            structFactory: function(a) {
                                var b, c = this.getExtensionById(a.ns);
                                return b = c ? c.create(a.type) : new i, b._setup(this, a), b
                            },
                            resolveNamespace: function(a) {
                                if (null == a.nsUri)
                                    return 0;
                                var b = this.getExtension(a.nsUri);
                                return b ? b.nsId : (console.log("Missing extension " + a.nsUri), 0)
                            }
                        }, b.exports = j
                    }, {
                        "./DefaultElement": 3,
                        "./bufferReader": 6,
                        "./chunk": 8,
                        "./consts": 9,
                        "./header": 11,
                        "./writer": 23
                    }
                    ],
                    6: [function(a, b, c) {
                        !function() {
                            var a = function(a, b, c) {
                                this.buffer = a, this.ptr = 0, this.littleEndien=!0, b = b || 0, c = c || a.byteLength, this.view = new DataView(a, b, c), this.length = this.view.byteLength
                            };
                            a.prototype = {
                                setPosition: function(a) {
                                    this.ptr = a
                                },
                                setLittleEndian: function(a) {
                                    this.littleEndien = a
                                },
                                bytesAvailable: function() {
                                    return this.length - this.ptr
                                },
                                I8: function() {
                                    return this.view.getInt8(this.ptr++)
                                },
                                U8: function() {
                                    return this.view.getUint8(this.ptr++)
                                },
                                I16: function() {
                                    var a = this.view.getInt16(this.ptr, this.littleEndien);
                                    return this.ptr += 2, a
                                },
                                U16: function() {
                                    var a = this.view.getUint16(this.ptr, this.littleEndien);
                                    return this.ptr += 2, a
                                },
                                I32: function() {
                                    var a = this.view.getInt32(this.ptr, this.littleEndien);
                                    return this.ptr += 4, a
                                },
                                U32: function() {
                                    var a = this.view.getUint32(this.ptr, this.littleEndien);
                                    return this.ptr += 4, a
                                },
                                F32: function() {
                                    var a = this.view.getFloat32(this.ptr, this.littleEndien);
                                    return this.ptr += 4, a
                                },
                                F64: function() {
                                    var a = this.view.getFloat64(this.ptr, this.littleEndien);
                                    return this.ptr += 8, a
                                },
                                readBytes: function(a, b) {
                                    void 0 === b && (b = a.byteLength);
                                    var c = new Int8Array(a), d = new Int8Array(this.buffer, this.ptr, b);
                                    c.set(d), this.ptr += b
                                },
                                subArray: function(a) {
                                    var b = new Int8Array(this.buffer, this.ptr, a);
                                    return this.ptr += a, b
                                },
                                readUTFBytes: function(a) {
                                    for (var b, c, d, e = this.ptr + a, f = [], g = 0; this.ptr < e;)
                                        b = this.U8(), 128 > b ? f[g++] = String.fromCharCode(b) : b > 191 && 224 > b ? (c = this.U8(), f[g++] = String.fromCharCode((31 & b)<<6 | 63 & c)) : (c = this.U8(), d = this.U8(), f[g++] = String.fromCharCode((15 & b)<<12 | (63 & c)<<6 | 63 & d));
                                    return f.join("")
                                }
                            }, b.exports = a
                        }()
                    }, {}
                    ],
                    7: [function(a, b, c) {
                        b.exports = {}
                    }, {
                        "string.prototype.codepointat": 1
                    }
                    ],
                    8: [function(a, b, c) {
                        !function() {
                            var a = function() {
                                this.id = 0, this.ns = 0, this.type = 0, this.flags = 0, this.size = 0, this.data = null
                            };
                            a.prototype = {
                                read: function(a) {
                                    this.id = a.U32(), this.ns = a.U8(), this.type = a.U8(), this.flags = a.U8(), this.size = a.U32()
                                },
                                write: void 0
                            }, b.exports = a
                        }()
                    }, {}
                    ],
                    9: [function(a, b, c) {
                        !function() {
                            var a = {
                                UNCOMPRESSED: 0,
                                DEFLATE: 1,
                                LZMA: 2,
                                AWD_FIELD_INT8: 1,
                                AWD_FIELD_INT16: 2,
                                AWD_FIELD_INT32: 3,
                                AWD_FIELD_UINT8: 4,
                                AWD_FIELD_UINT16: 5,
                                AWD_FIELD_UINT32: 6,
                                AWD_FIELD_FLOAT32: 7,
                                AWD_FIELD_FLOAT64: 8,
                                AWD_FIELD_BOOL: 21,
                                AWD_FIELD_COLOR: 22,
                                AWD_FIELD_BADDR: 23,
                                AWD_FIELD_STRING: 31,
                                AWD_FIELD_BYTEARRAY: 32,
                                AWD_FIELD_VECTOR2x1: 41,
                                AWD_FIELD_VECTOR3x1: 42,
                                AWD_FIELD_VECTOR4x1: 43,
                                AWD_FIELD_MTX3x2: 44,
                                AWD_FIELD_MTX3x3: 45,
                                AWD_FIELD_MTX4x3: 46,
                                AWD_FIELD_MTX4x4: 47,
                                INT8: 1,
                                INT16: 2,
                                INT32: 3,
                                UINT8: 4,
                                UINT16: 5,
                                UINT32: 6,
                                FLOAT32: 7,
                                FLOAT64: 8,
                                AWDSTRING: 31,
                                AWDBYTEARRAY: 32,
                                MAGIC: 4282180,
                                GENERIC: 0,
                                GEOMETRY: 1,
                                PRIMITIVE: 11,
                                CONTAINER: 22,
                                MESH: 23,
                                MATERIAL: 81,
                                TEXTURE: 82,
                                NAMESPACE: 254,
                                METADATA: 255,
                                MODEL_ENTITY: 2,
                                MODEL_SKYBOX: 4,
                                MODEL_CAMERA: 8,
                                MODEL_SEGMENT_SET: 16,
                                MODEL_MESH: 32,
                                MODEL_GEOMETRY: 64,
                                MODEL_SKELETON: 128,
                                MODEL_SKELETON_POSE: 256,
                                MODEL_CONTAINER: 512,
                                MODEL_TEXTURE: 1024,
                                MODEL_TEXTURE_PROJECTOR: 2048,
                                MODEL_MATERIAL: 4096,
                                MODEL_ANIMATION_SET: 8192,
                                MODEL_ANIMATION_STATE: 16384,
                                MODEL_ANIMATION_NODE: 32768,
                                MODEL_ANIMATOR: 65536,
                                MODEL_STATE_TRANSITION: 1<<17,
                                MODEL_LIGHT: 1<<18,
                                MODEL_LIGHT_PICKER: 1<<19,
                                MODEL_SHADOW_MAP_METHOD: 1<<20,
                                MODEL_EFFECTS_METHOD: 1<<21,
                                MODEL_GENERIC: - 1,
                                POSITION: 1,
                                INDEX: 2,
                                UVS: 3,
                                NORMAL: 4,
                                TANGENT: 5,
                                JOIN_IDX: 6,
                                JOIN_WGT: 7,
                                SUVS: 8,
                                COLOR: 11,
                                BINORMAL: 12,
                                DEFAULT_NS: 0
                            };
                            b.exports = a
                        }()
                    }, {}
                    ],
                    10: [function(a, b, c) {
                        var d = a("./DefaultElement"), e = a("./Namespace"), f = function(a) {
                            this.nsUri = a, this.structs = [], this.nsId = 0
                        };
                        f.prototype = {
                            addStruct: function(a) {
                                this.structs.push(a)
                            },
                            addStructs: function(a) {
                                for (var b = 0, c = a.length; c > b; b++)
                                    this.addStruct(a[b])
                            },
                            create: function(a) {
                                for (var b, c = this.structs, e = 0, f = c.length; f > e; e++)
                                    if (b = c[e], b.TYPE === a)
                                        return new b;
                                return new d
                            },
                            createNamespace: function() {
                                var a = new e;
                                return a.uri = this.nsUri, a
                            }
                        }, b.exports = f
                    }, {
                        "./DefaultElement": 3,
                        "./Namespace": 4
                    }
                    ],
                    11: [function(a, b, c) {
                        !function() {
                            var c = a("./consts"), d = function() {
                                this.size = 12, this.version = {
                                    major: 0,
                                    minor: 0
                                }, this.streaming=!1, this.accuracyMatrix=!1, this.accuracyGeo=!1, this.accuracyProps=!1, this.geoNrType = c.FLOAT32, this.matrixNrType = c.FLOAT32, this.propsNrType = c.FLOAT32, this.optimized_for_accuracy=!1, this.compression=!1, this.bodylen = 0
                            };
                            d.prototype = {
                                read: function(a) {
                                    var b = a.U8()<<16 | a.U8()<<8 | a.U8();
                                    if (b !== c.MAGIC)
                                        throw new Error("AWD parse error - bad magic " + b.toString(16));
                                    var d = this.version;
                                    d.major = a.U8(), d.minor = a.U8();
                                    var e = a.U16();
                                    this.streaming = 1 === (1 & e), this.optimized_for_accuracy = 2 === (2 & e), 2 === d.major && 1 === d.minor && (this.accuracyMatrix = 2 === (2 & e), this.accuracyGeo = 4 === (4 & e), this.accuracyProps = 8 === (8 & e)), this.geoNrType = this.accuracyGeo ? c.FLOAT64 : c.FLOAT32, this.matrixNrType = this.accuracyMatrix ? c.FLOAT64 : c.FLOAT32, this.propsNrType = this.accuracyProps ? c.FLOAT64 : c.FLOAT32, this.compression = a.U8(), this.bodylen = a.U32()
                                },
                                write: void 0
                            }, b.exports = d
                        }()
                    }, {
                        "./consts": 9
                    }
                    ],
                    12: [function(a, b, c) {
                        !function() {
                            var a = {}.hasOwnProperty, b = Object.defineProperty, c = function(b, c) {
                                function d() {
                                    this.constructor = b
                                }
                                for (var e in c)
                                    a.call(c, e) && (b[e] = c[e]);
                                d.prototype = c.prototype, b.prototype = new d, b.__super__ = c.prototype
                            }, d = function(a, c, d, e) {
                                b(a, c, {
                                    get: d,
                                    set: e
                                })
                            };
                            return {
                                extend: c,
                                getset: d
                            }
                        }()
                    }, {}
                    ],
                    13: [function(a, b, c) {
                        var d = a("../consts");
                        b.exports = function(a) {
                            var b, c, e = a.getDatasByType(d.GEOMETRY);
                            for (b = 0, c = e.length; c > b; b++) {
                                var f, g, h = e[b];
                                for (f = 0, g = h.subGeoms.length; g > f; f++) {
                                    var i = h.subGeoms[f], j = i.getBuffersByType([d.POSITION])[0];
                                    if (3 !== j.components)
                                        throw new Error("invalid number of components, should be 3, is " + j.components);
                                    var k, l, m, n, o, p, q, r, s = j.data;
                                    for (m = p = s[0], n = q = s[1], o = r = s[2], k = 3, l = s.length; l > k; k += 3)
                                        m = Math.min(m, s[k]), p = Math.max(p, s[k]), n = Math.min(n, s[k + 1]), q = Math.max(q, s[k + 1]), o = Math.min(o, s[k + 2]), r = Math.max(r, s[k + 2]);
                                    var t = a.header.geoNrType, u = i.props;
                                    u.expected[10] = u.expected[11] = u.expected[12] = u.expected[13] = u.expected[14] = u.expected[15] = t, u.set(10, m), u.set(11, n), u.set(12, o), u.set(13, p), u.set(14, q), u.set(15, r)
                                }
                            }
                        }
                    }, {
                        "../consts": 9
                    }
                    ],
                    14: [function(a, b, c) {
                        var d = a("../consts");
                        b.exports = function(a) {
                            var b, c, e = a.getDatasByType(d.GEOMETRY);
                            for (b = 0, c = e.length; c > b; b++) {
                                var f, g, h = e[b];
                                for (f = 0, g = h.subGeoms.length; g > f; f++) {
                                    var i, j, k = h.subGeoms[f], l = k.getBuffersByType(d.INDEX);
                                    for (i = 0, j = l.length; j > i; i++) {
                                        var m, n, o, p = l[i], q = p.data;
                                        for (m = 1, n = q.length; n > m; m += 3)
                                            o = q[m], q[m] = q[m + 1], q[m + 1] = o
                                    }
                                }
                            }
                        }
                    }, {
                        "../consts": 9
                    }
                    ],
                    15: [function(a, b, c) {
                        var d = a("../consts");
                        b.exports = function(a) {
                            var b, c, e = a.getDatasByType(d.GEOMETRY);
                            for (b = 0, c = e.length; c > b; b++) {
                                var f, g, h = e[b];
                                for (f = 0, g = h.subGeoms.length; g > f; f++) {
                                    var i, j, k = h.subGeoms[f], l = k.getBuffersByType(d.UVS);
                                    for (i = 0, j = l.length; j > i; i++) {
                                        var m = l[i];
                                        if (2 !== m.components)
                                            throw new Error("invalid number of components, should be 3, is " + m.components);
                                        var n, o, p = m.data;
                                        for (n = 1, o = p.length; o > n; n += 2)
                                            p[n] = 1 - p[n]
                                    }
                                }
                            }
                        }
                    }, {
                        "../consts": 9
                    }
                    ],
                    16: [function(a, b, c) {
                        var d = a("../consts");
                        b.exports = function(a) {
                            var b = a.getDatasByType(d.GEOMETRY);
                            console.log(b.length);
                            var c, e;
                            for (c = 0, e = b.length; e > c; c++) {
                                var f, g, h = b[c];
                                for (f = 0, g = h.subGeoms.length; g > f; f++) {
                                    var i, j, k = h.subGeoms[f], l = k.getBuffersByType([d.POSITION, d.NORMAL, d.TANGENT]);
                                    for (i = 0, j = l.length; j > i; i++) {
                                        var m = l[i];
                                        if (3 !== m.components)
                                            throw new Error("invalid number of components, should be 3, is " + m.components);
                                        var n, o, p = m.data;
                                        for (n = 0, o = p.length; o > n; n += 3)
                                            p[n] =- p[n]
                                    }
                                }
                            }
                        }
                    }, {
                        "../consts": 9
                    }
                    ],
                    17: [function(a, b, c) {
                        function d(a, b) {
                            var c, d;
                            for (c = 1, d = a.length; d > c; c++)
                                a[c] = b[0] * a[c] + b[5]
                        }
                        function e(a, b) {
                            var c, d;
                            for (c = 1, d = a.length; d > c; c += 2) {
                                var e = a[c], f = a[c + 1];
                                a[c + 0] = b[0] * e + b[2] * f + b[5], a[c + 1] = b[6] * e + b[7] * f + b[10]
                            }
                        }
                        function f(a, b) {
                            var c, d;
                            for (c = 1, d = a.length; d > c; c += 3) {
                                var e = a[c], f = a[c + 1], g = a[c + 2];
                                a[c + 0] = b[0] * e + b[2] * f + b[3] * g + b[5], a[c + 1] = b[6] * e + b[7] * f + b[8] * g + b[10], a[c + 2] = b[11] * e + b[12] * f + b[13] * g + b[15]
                            }
                        }
                        function g(a, b) {
                            var c, d;
                            for (c = 1, d = a.length; d > c; c += 4) {
                                var e = a[c], f = a[c + 1], g = a[c + 2], h = a[c + 3];
                                a[c + 0] = b[0] * e + b[2] * f + b[3] * g + b[4] * h + b[5], a[c + 1] = b[6] * e + b[7] * f + b[8] * g + b[9] * h + b[10], a[c + 2] = b[11] * e + b[12] * f + b[13] * g + b[14] * h + b[15], a[c + 3] = b[16] * e + b[17] * f + b[18] * g + b[19] * h + b[20]
                            }
                        }
                        var h = a("../consts"), i = [null, d, e, f, g];
                        b.exports = function(a, b, c) {
                            var d, e, f, g, j, k, l = a.getDatasByType(h.GEOMETRY);
                            for (d = 0, e = l.length; e > d; d++) {
                                var m = l[d];
                                for (f = 0, g = m.subGeoms.length; g > f; f++) {
                                    var n = m.subGeoms[f], o = n.getBuffersByType(c);
                                    for (j = 0, k = o.length; k > j; j++) {
                                        var p = o[j], q = p.components, r = p.data;
                                        if (1 > q || q > 4)
                                            throw new Error("invalid number of components, must be [1-4], is " + q);
                                        i[q](r, b)
                                    }
                                }
                            }
                        }
                    }, {
                        "../consts": 9
                    }
                    ],
                    18: [function(a, b, c) {
                        b.exports = {
                            read: function(a) {
                                var b = a.U16();
                                return a.readUTFBytes(b)
                            },
                            write: function(a, b) {
                                b.U16(a.length), b.writeUTFBytes(a)
                            },
                            getUTFBytesLength: function(a) {
                                for (var b = 0, c = 0, d = a.length; d > c; c++) {
                                    var e, f = a[c].codePointAt(0);
                                    128 > f ? e = 1 : 2048 > f ? e = 2 : 65536 > f ? e = 3 : 2097152 > f && (e = 4), b += e
                                }
                                return b
                            }
                        }
                    }, {}
                    ],
                    19: [function(a, b, c) {
                        !function() {
                            var a = function() {
                                this.data = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
                            };
                            a.prototype = {
                                read: function(a, b) {
                                    this.parseMatrix43RawData(a, b, this.data)
                                },
                                write: void 0,
                                parseMatrix43RawData: function(a,
                                b,
                                c) {
                                    var d = c,
                                    e = a.header.accuracyMatrix ? b.F64: b.F32;
                                    return d[0] = e.call(b),
                                    d[1] = e.call(b),
                                    d[2] = e.call(b),
                                    d[3] = 0,
                                    d[4] = e.call(b),
                                    d[5] = e.call(b),
                                    d[6] = e.call(b),
                                    d[7] = 0,
                                    d[8] = e.call(b),
                                    d[9] = e.call(b),
                                    d[10] = e.call(b),
                                    d[11] = 0,
                                    d[12] = e.call(b),
                                    d[13] = e.call(b),
                                    d[14] = e.call(b),
                                    d[15] = 1,
                                    isNaN(d[0]) && (d[0] = 1,
                                    d[1] = 0,
                                    d[2] = 0,
                                    d[4] = 0,
                                    d[5] = 1,
                                    d[6] = 0,
                                    d[8] = 0,
                                    d[9] = 0,
                                    d[10] = 1,
                                    d[12] = 0,
                                    d[13] = 0,
                                    d[14] = 0),
                                    d
                                }, writeMatrix43RawData : void 0
                            }, b.exports = a
                        }()
                    }, {}
                    ],
                    20: [function(a, b, c) {
                        !function() {
                            var c = a("../consts"), d = (a("./awdString"), a("../bufferWriter")), e = a("../bufferReader"), f = function(a) {
                                this.expected = a, this.vars = {}
                            };
                            f.prototype = {
                                clone: function() {
                                    var a = new d(64);
                                    this.write(a);
                                    var b = new f(this.expected);
                                    return b.read(new e(a.buffer)), b
                                },
                                read: function(a) {
                                    var b = this.expected, c = a.U32(), d = a.ptr + c;
                                    if (b)
                                        for (; a.ptr < d;) {
                                            var e, f = a.U16(), g = a.U32();
                                            this.expected.hasOwnProperty(f) ? (e = b[f], this.set(f, this.parseAttrValue(e, g, a))) : a.ptr += g
                                        }
                                    a.ptr !== d && (console.log("Warn Properties don't read entire data ", a.ptr, d, c), a.ptr = d)
                                },
                                write: void 0,
                                set: function(a,
                                b) {
                                    this.vars[a] = b
                                }, get : function(a, b) {
                                    return this.vars.hasOwnProperty(a) ? this.vars[a] : b
                                }, writeAttrValue: void 0, parseAttrValue : function(a, b, d) {
                                    var e, f;
                                    switch (a) {
                                    case c.AWD_FIELD_INT8:
                                        e = 1, f = d.I8;
                                        break;
                                    case c.AWD_FIELD_INT16:
                                        e = 2, f = d.I16;
                                        break;
                                    case c.AWD_FIELD_INT32:
                                        e = 4, f = d.I32;
                                        break;
                                    case c.AWD_FIELD_BOOL:
                                    case c.AWD_FIELD_UINT8:
                                        e = 1, f = d.U8;
                                        break;
                                    case c.AWD_FIELD_UINT16:
                                        e = 2, f = d.U16;
                                        break;
                                    case c.AWD_FIELD_UINT32:
                                    case c.AWD_FIELD_BADDR:
                                        e = 4, f = d.U32;
                                        break;
                                    case c.AWD_FIELD_FLOAT32:
                                        e = 4, f = d.F32;
                                        break;
                                    case c.AWD_FIELD_FLOAT64:
                                        e = 8, f = d.F64;
                                        break;
                                    case c.AWD_FIELD_STRING:
                                        var g = d.U16();
                                        g === b && console.log("WARN may be Prefab bug / String property bug!!"), d.ptr -= 2;
                                        var h = d.readUTFBytes(b);
                                        return h;
                                    case c.AWD_FIELD_VECTOR2x1:
                                    case c.AWD_FIELD_VECTOR3x1:
                                    case c.AWD_FIELD_VECTOR4x1:
                                    case c.AWD_FIELD_MTX3x2:
                                    case c.AWD_FIELD_MTX3x3:
                                    case c.AWD_FIELD_MTX4x3:
                                    case c.AWD_FIELD_MTX4x4:
                                        e = 8, f = d.F64
                                    }
                                    if (b > e) {
                                        var i, j, k;
                                        for (i = [], j = 0, k = b / e; k > j;)
                                            i.push(f.call(d)), j++;
                                        return i
                                    }
                                    return f.call(d)
                                }
                            }, b.exports = f
                        }()
                    }, {
                        "../bufferReader": 6,
                        "../bufferWriter": 7,
                        "../consts": 9,
                        "./awdString": 18
                    }
                    ],
                    21: [function(a, b, c) {
                        !function() {
                            var c = a("../consts"), d = a("./awdString"), e = a("../bufferWriter"), f = a("../bufferReader"), g = function() {
                                this.attributes = {}, this._list = []
                            };
                            g.prototype = {
                                clone: function() {
                                    var a = new e(64);
                                    this.write(a);
                                    var b = new g;
                                    return b.read(new f(a.buffer)), b
                                },
                                addAttribute: function(a, b, c, d) {
                                    var e = {
                                        name: a,
                                        value: b,
                                        type: c,
                                        ns: d
                                    };
                                    this.attributes[a] = e, this._list.push(e)
                                },
                                read: function(a) {
                                    var b, e = a.U32();
                                    if (e > 0) {
                                        b = {};
                                        for (var f = a.ptr + e; a.ptr < f;) {
                                            var g, h = a.U8(), i = d.read(a), j = a.U8(), k = a.U32();
                                            switch (j) {
                                            case c.AWDSTRING:
                                                g = a.readUTFBytes(k);
                                                break;
                                            case c.INT8:
                                                g = a.I8();
                                                break;
                                            case c.INT16:
                                                g = a.I16();
                                                break;
                                            case c.INT32:
                                                g = a.I32();
                                                break;
                                            case c.BOOL:
                                            case c.UINT8:
                                                g = a.U8();
                                                break;
                                            case c.UINT16:
                                                g = a.U16();
                                                break;
                                            case c.UINT32:
                                            case c.BADDR:
                                                g = a.U32();
                                                break;
                                            case c.FLOAT32:
                                                g = a.F32();
                                                break;
                                            case c.FLOAT64:
                                                g = a.F64();
                                                break;
                                            default:
                                                g = "unimplemented attribute type " + j + "ns : " + h, a.ptr += k
                                            }
                                            this.addAttribute(i, g, j, h), b[i] = g
                                        }
                                    }
                                    return b
                                },
                                write: void 0
                            }, b.exports = g
                        }()
                    }, {
                        "../bufferReader": 6,
                        "../bufferWriter": 7,
                        "../consts": 9,
                        "./awdString": 18
                    }
                    ],
                    22: [function(a, b, c) {
                        !function() {
                            var c = a("../consts"), d = a("./properties"), e = function(a, b, c) {
                                this.x = a || 0, this.y = b || 0, this.z = c || 0
                            };
                            e.prototype = {
                                parsePivot: function(a, b) {
                                    var e = a.header.matrixNrType, f = new d({
                                        1: e,
                                        2: e,
                                        3: e,
                                        4: c.UINT8
                                    });
                                    f.read(b), this.x = f.get(1, 0), this.y = f.get(2, 0), this.z = f.get(3, 0)
                                },
                                writePivot: void 0
                            }, b.exports = e
                        }()
                    }, {
                        "../consts": 9,
                        "./properties": 20
                    }
                    ],
                    23: [function(a, b, c) {
                        !function() {
                            var c = void a("./bufferWriter");
                            b.exports = c
                        }()
                    }, {
                        "./bufferWriter": 7
                    }
                    ],
                    awdlib: [function(a, b, c) {
                        var d = a("BaseElement"), e = a("DefaultElement"), f = a("Namespace"), g = a("awd"), h = a("bufferReader"), i = a("bufferWriter"), j = a("chunk"), k = a("consts"), l = a("extension"), m = a("header"), n = a("lang"), o = a("tools/computeBounds"), p = a("tools/flipFaces"), q = a("tools/flipUvsY"), r = a("tools/flipX"), s = a("tools/transform"), t = a("types/awdString"), u = a("types/matrix"), v = a("types/properties"), w = a("types/userAttr"), x = a("types/vec3"), y = a("writer"), z = {
                            BaseElement: d,
                            DefaultElement: e,
                            Namespace: f,
                            awd: g,
                            bufferReader: h,
                            bufferWriter: i,
                            chunk: j,
                            consts: k,
                            extension: l,
                            header: m,
                            lang: n,
                            computeBounds: o,
                            flipFaces: p,
                            flipUvsY: q,
                            flipX: r,
                            transform: s,
                            awdString: t,
                            matrix: u,
                            properties: v,
                            userAttr: w,
                            vec3: x,
                            writer: y
                        };
                        b.exports = z
                    }, {
                        BaseElement: 2,
                        DefaultElement: 3,
                        Namespace: 4,
                        awd: 5,
                        bufferReader: 6,
                        bufferWriter: 7,
                        chunk: 8,
                        consts: 9,
                        extension: 10,
                        header: 11,
                        lang: 12,
                        "tools/computeBounds": 13,
                        "tools/flipFaces": 14,
                        "tools/flipUvsY": 15,
                        "tools/flipX": 16,
                        "tools/transform": 17,
                        "types/awdString": 18,
                        "types/matrix": 19,
                        "types/properties": 20,
                        "types/userAttr": 21,
                        "types/vec3": 22,
                        writer: 23
                    }
                    ]
                }, {}, [])("awdlib")
            })
        }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }, {}
    ],
    94: [function(a, b, c) {
        (function(d) {
            !function(a) {
                if ("object" == typeof c && "undefined" != typeof b)
                    b.exports = a();
                else if ("function" == typeof define && define.amd)
                    define([], a);
                else {
                    var e;
                    e = "undefined" != typeof window ? window : "undefined" != typeof d ? d : "undefined" != typeof self ? self : this, e.awdlib_std = a()
                }
            }(function() {
                return function b(c, d, e) {
                    function f(h, i) {
                        if (!d[h]) {
                            if (!c[h]) {
                                var j = "function" == typeof a && a;
                                if (!i && j)
                                    return j(h, !0);
                                if (g)
                                    return g(h, !0);
                                var k = new Error("Cannot find module '" + h + "'");
                                throw k.code = "MODULE_NOT_FOUND", k
                            }
                            var l = d[h] = {
                                exports: {}
                            };
                            c[h][0].call(l.exports, function(a) {
                                var b = c[h][1][a];
                                return f(b ? b : a)
                            }, l, l.exports, b, c, d, e)
                        }
                        return d[h].exports
                    }
                    for (var g = "function" == typeof a && a, h = 0; h < e.length; h++)
                        f(e[h]);
                    return f
                }({
                    1: [function(a, b, c) {
                        !function() {
                            var c = a("../../src/types/userAttr"), d = a("../../src/types/awdString"), e = a("../../src/types/vec3"), f = a("../../src/types/matrix"), g = a("../../src/consts"), h = a("../../src/BaseElement"), i = h.createStruct(g.CONTAINER, null, {
                                init: function() {
                                    this.model = g.MODEL_CONTAINER, i["super"](this)
                                },
                                read: function(a) {
                                    var b = a.U32();
                                    this.matrix.read(this.awd, a), this.name = d.read(a), this.pivot.parsePivot(this.awd, a), this.extras.read(a);
                                    var c = this.awd.getAssetByID(b, [g.MODEL_CONTAINER, g.MODEL_MESH, g.MODEL_LIGHT, g.MODEL_ENTITY, g.MODEL_SEGMENT_SET]);
                                    if (c[0])
                                        void 0 !== c[1].addChild && c[1].addChild(this), this.parent = c[1];
                                    else if (b > 0)
                                        throw new Error("Could not find a parent for this ObjectContainer3D id : " + b)
                                },
                                write: void 0,
                                getDependencies: function() {
                                    var a = this.parent;
                                    return a ? [a]: null
                                }, toString : function() {
                                    return "[Container " + this.name + "]"
                                }, addChild: function(a) {
                                    - 1 === this.children.indexOf(a) && (this.children.push(a), a.parent = this)
                                }, removeChild: function(a) {
                                    var b = this.children.indexOf(a);
                                    b>-1 && (this.children.splice(b, 1), a.parent = null)
                                }
                            });
                            i.extend = function(a) {
                                a.addChild = i.prototype.addChild, a.removeChild = i.prototype.removeChild
                            }, i["super"] = function(a) {
                                a.parent = null, a.children = [], a.matrix = new f, a.name = "", a.pivot = new e, a.extras = new c
                            }, b.exports = i
                        }()
                    }, {
                        "../../src/BaseElement": 10,
                        "../../src/consts": 16,
                        "../../src/types/awdString": 18,
                        "../../src/types/matrix": 19,
                        "../../src/types/userAttr": 21,
                        "../../src/types/vec3": 22
                    }
                    ],
                    2: [function(a, b, c) {
                        !function() {
                            "use strict";
                            var c = a("consts"), d = a("types/awdString"), e = a("types/userAttr"), f = a("types/properties"), g = a("BaseElement"), h = g.createStruct(c.GEOMETRY, null, {
                                subGeomFactory: function() {
                                    var a = new i;
                                    return a.bufferFactory = this.bufferFactory, a
                                },
                                bufferFactory: function() {
                                    return new k
                                },
                                init: function() {
                                    this.model = c.MODEL_GEOMETRY, this.name = "", this.extras = new e, this.props = new f({}), this.subGeoms = []
                                },
                                read: function(a) {
                                    this.name = d.read(a);
                                    var b = a.U16(), c = this.awd.header.geoNrType, e = this.props;
                                    e.expected[1] = c, e.expected[2] = c, e.read(a);
                                    var f = e.get(1, 1), g = e.get(2, 1);
                                    1 === f && 1 === g || console.log("WARN defined scale UV in geometry");
                                    for (var h, i = this.subGeoms, j = 0; b > j; j++)
                                        h = this.subGeomFactory(), h.read(this.awd, a), i.push(h);
                                    this.extras.read(a)
                                },
                                write: void 0,
                                toString: function() {
                                    return "[Geometry " + this.name + "]"
                                }
                            }), i = function() {
                                this.buffers = [], this.extras = new e, this.props = new f({})
                            };
                            i.prototype = {
                                getBuffersByType: function(a, b) {
                                    void 0 === b && (b = []);
                                    var c, d;
                                    if (a instanceof Array)
                                        for (c = 0, d = a.length; d > c; c++)
                                            this.getBuffersByType(a[c], b);
                                    else 
                                        for (c = 0, d = this.buffers.length; d > c; c++)
                                            this.buffers[c].type === a && b.push(this.buffers[c]);
                                    return b
                                },
                                read: function(a, b) {
                                    var c = b.U32(), d = b.ptr + c, e = a.header.geoNrType, f = this.props;
                                    f.expected[1] = e, f.expected[2] = e, f.read(b);
                                    var g = f.get(1, 1), h = f.get(2, 1);
                                    1 === g && 1 === h || console.log("WARN defined scale UV in sub-geometry");
                                    for (var i, j =- 1; b.ptr < d;)
                                        i = this.bufferFactory(), i.read(b), !i.isIndex && i.numVertices>-1 && (j>-1 && i.numVertices !== j && console.log("Warn buffers in geom has differents num vertices", j, i.numVertices), j = i.numVertices), this.buffers.push(i);
                                    - 1 === j && console.log("Error, Can't resolve geom buffers sizes");
                                    for (var k = 0, l = this.buffers.length; l > k; k++)
                                        i = this.buffers[k], - 1 !== i.numVertices || i.isIndex || i.solveSize(j);
                                    this.extras.read(b)
                                },
                                write: function(a, b) {
                                    var c = b.skipBlockSize();
                                    this.writeProps(a, b);
                                    for (var d = 0, e = this.buffers.length; e > d; d++) {
                                        var f = this.buffers[d];
                                        f.write(b)
                                    }
                                    b.writeBlockSize(c), this.extras.write(b)
                                },
                                writeProps: function(a, b) {
                                    var c = a.header.geoNrType, d = this.props;
                                    d.expected[1] = c, d.expected[2] = c, d.set(1, 1), d.set(2, 1), d.write(b)
                                }
                            };
                            var j = function(a) {
                                return 2 === a ? c.AWD_FIELD_UINT16 : 4 === a ? c.AWD_FIELD_FLOAT32 : a
                            }, k = function() {
                                this.data = null, this.numVertices =- 1, this.type = 0, this.components = 0, this.ftype = c.T_FLOAT, this.isIndex=!1
                            };
                            k.HEAD_SIZE = 6, k.prototype = {
                                allocate: function(a, b) {
                                    var c = o(b);
                                    void 0 === c && console.log(b), this.data = new c(a)
                                },
                                solveSize: function(a) {
                                    this.numVertices = a, this.components = this.data.length / a
                                },
                                read: function(a) {
                                    var b = a.U8(), d = a.U8(), e = a.U32(), f = a.ptr + e;
                                    d = j(d), d !== c.AWD_FIELD_UINT16 && d !== c.AWD_FIELD_FLOAT32 && d !== c.AWD_FIELD_FLOAT64 && console.log("WARN unexpected stream data type ", d, b, e);
                                    var g = p(b);
                                    this.isIndex = b === c.INDEX, this.type = b, this.components = g, this.ftype = d;
                                    var h = l(d), i = e / h;
                                    - 1 !== g && (this.numVertices = i / g), this.allocate(i, d);
                                    for (var k = m(d, a), n = this.data, o = 0; a.ptr < f;)
                                        n[o++] = k.call(a)
                                },
                                write: function(a) {
                                    a.U8(this.type), a.U8(this.ftype);
                                    for (var b = a.skipBlockSize(), c = n(this.ftype, a), d = this.data, e = 0, f = d.length; f > e; e++)
                                        c.call(a, d[e]);
                                    a.writeBlockSize(b)
                                }
                            };
                            var l = function(a) {
                                switch (a) {
                                case c.AWD_FIELD_UINT16:
                                    return 2;
                                case c.AWD_FIELD_FLOAT32:
                                    return 4;
                                case c.AWD_FIELD_FLOAT64:
                                    return 8
                                }
                                throw new Error("WARN getTypeSize - unexpected stream data type " + a)
                            }, m = function(a, b) {
                                switch (a) {
                                case c.AWD_FIELD_UINT16:
                                    return b.U16;
                                case c.AWD_FIELD_FLOAT32:
                                    return b.F32;
                                case c.AWD_FIELD_FLOAT64:
                                    return b.F64
                                }
                                throw new Error("WARN getReadFunc - unexpected stream data type " + a)
                            }, n = function(a, b) {
                                switch (a) {
                                case c.AWD_FIELD_UINT16:
                                    return b.U16;
                                case c.AWD_FIELD_FLOAT32:
                                    return b.F32;
                                case c.AWD_FIELD_FLOAT64:
                                    return b.F64
                                }
                                throw new Error("WARN getWriteFunc - unexpected stream data type " + a)
                            }, o = function(a) {
                                switch (a) {
                                case c.AWD_FIELD_UINT16:
                                    return Uint16Array;
                                case c.AWD_FIELD_FLOAT32:
                                    return Float32Array;
                                case c.AWD_FIELD_FLOAT64:
                                    return Float64Array
                                }
                                throw new Error("WARN getArray - unexpected stream data type " + a)
                            }, p = function(a) {
                                switch (a) {
                                case c.POSITION:
                                case c.INDEX:
                                case c.NORMAL:
                                case c.TANGENT:
                                case c.BINORMAL:
                                    return 3;
                                case c.UVS:
                                    return 2;
                                case c.JOIN_WGT:
                                case c.JOIN_IDX:
                                    return - 1;
                                default:
                                    return - 1
                                }
                            };
                            h.SubGeom = i, h.VertexBuffer = k, h.getTypeSize = l, h.getReadFunc = m, h.getWriteFunc = n, h.getArray = o, h.fixC4D_Type = j, b.exports = h
                        }()
                    }, {
                        BaseElement: 10,
                        consts: 16,
                        "types/awdString": 18,
                        "types/properties": 20,
                        "types/userAttr": 21
                    }
                    ],
                    3: [function(a, b, c) {
                        !function() {
                            var c = a("types/properties"), d = a("types/awdString"), e = a("consts"), f = a("types/userAttr"), g = a("BaseElement"), h = g.createStruct(e.MATERIAL, null, {
                                init: function() {
                                    this.name = "", this.model = e.MODEL_MATERIAL, this.extras = new f
                                },
                                read: function(a) {
                                    this.name = d.read(a), this.mattype = a.U8(), this.numMethods = a.U8();
                                    var b = this.awd.header.propsNrType;
                                    this.props = new c({
                                        1: e.AWD_FIELD_UINT32,
                                        2: e.AWD_FIELD_BADDR,
                                        3: e.AWD_FIELD_BADDR,
                                        4: e.AWD_FIELD_UINT8,
                                        5: e.AWD_FIELD_BOOL,
                                        6: e.AWD_FIELD_BOOL,
                                        7: e.AWD_FIELD_BOOL,
                                        8: e.AWD_FIELD_BOOL,
                                        9: e.AWD_FIELD_UINT8,
                                        10: b,
                                        11: e.AWD_FIELD_BOOL,
                                        12: b,
                                        13: e.AWD_FIELD_BOOL,
                                        15: b,
                                        16: e.AWD_FIELD_UINT32,
                                        17: e.AWD_FIELD_BADDR,
                                        18: b,
                                        19: b,
                                        20: e.AWD_FIELD_UINT32,
                                        21: e.AWD_FIELD_BADDR,
                                        22: e.AWD_FIELD_BADDR
                                    }), this.props.read(a), this.extras.read(a)
                                },
                                write: void 0,
                                toString: function() {}
                            });
                            b.exports = h
                        }()
                    }, {
                        BaseElement: 10,
                        consts: 16,
                        "types/awdString": 18,
                        "types/properties": 20,
                        "types/userAttr": 21
                    }
                    ],
                    4: [function(a, b, c) {
                        !function() {
                            var c = a("types/awdString"), d = a("std/Container"), e = a("consts"), f = a("BaseElement"), g = f.createStruct(e.MESH, null, {
                                init: function() {
                                    this.model = e.MODEL_MESH, this.pData = {}, d["super"](this), this.geometry = null, this.materials = []
                                },
                                read: function(a) {
                                    var b = a.U32();
                                    this.matrix.read(this.awd, a), this.name = c.read(a);
                                    for (var d = a.U32(), f = a.U16(), g = 0; f > g; g++) {
                                        var h = a.U32(), i = this.awd.getAssetByID(h, [e.MODEL_MATERIAL]);
                                        if (!i[0] && h > 0)
                                            throw new Error("Could not find Material Nr " + g + " (ID = " + h + " ) for this Mesh");
                                        h > 0 && this.materials.push(i[1])
                                    }
                                    this.pivot.parsePivot(this.awd, a), this.extras.read(a);
                                    var j = this.awd.getAssetByID(d, [e.MODEL_GEOMETRY]);
                                    if (j[0] && (this.geometry = j[1]), j = this.awd.getAssetByID(b, [e.MODEL_CONTAINER, e.MODEL_MESH, e.MODEL_LIGHT, e.MODEL_ENTITY, e.MODEL_SEGMENT_SET]), j[0])
                                        void 0 !== j[1].addChild && j[1].addChild(this), this.parent = j[1];
                                    else if (b > 0)
                                        throw new Error("Could not find a parent for this Mesh " + b)
                                },
                                write: void 0,
                                getDependencies: function() {
                                    for (var a = [],
                                    b = this.materials.length,
                                    c = 0;
                                    b > c;
                                    c++) {
                                        var d = this.materials[c];
                                        a.push(d)
                                    }
                                    return this.parent && a.push(this.parent), this.geometry && a.push(this.geometry), a
                                }, toString : function() {
                                    return "[Mesh " + this.pData.name + "]"
                                }
                            });
                            d.extend(g.prototype), b.exports = g
                        }()
                    }, {
                        BaseElement: 10, consts: 16, "std/Container": 1, "types/awdString": 18
                    }
                    ],
                    5: [function(a, b, c) {
                        !function() {
                            var c = a("consts"), d = a("types/properties"), e = a("BaseElement"), f = "unknown", g = e.createStruct(c.METADATA, null, {
                                init: function() {
                                    this.timeStamp = 0, this.encoderName = f, this.encoderVersion = f, this.generatorName = f, this.generatorVersion = f
                                },
                                read: function(a) {
                                    var b = new d({
                                        1: c.AWD_FIELD_UINT32,
                                        2: c.AWD_FIELD_STRING,
                                        3: c.AWD_FIELD_STRING,
                                        4: c.AWD_FIELD_STRING,
                                        5: c.AWD_FIELD_STRING
                                    });
                                    b.read(a), this.timeStamp = b.get(1, 0), this.encoderName = b.get(2, f), this.encoderVersion = b.get(3, f), this.generatorName = b.get(4, f), this.generatorVersion = b.get(5, f)
                                },
                                write: void 0,
                                toString: function() {
                                    return "Metadata : TimeStamp         = " + this.timeStamp + " EncoderName       = " + this.encoderName + " EncoderVersion    = " + this.encoderVersion + " GeneratorName     = " + this.generatorName + " GeneratorVersion  = " + this.generatorVersion
                                }
                            });
                            b.exports = g
                        }()
                    }, {
                        BaseElement: 10,
                        consts: 16,
                        "types/properties": 20
                    }
                    ],
                    6: [function(a, b, c) {
                        !function() {
                            var c = a("types/properties"), d = a("types/awdString"), e = a("consts"), f = a("BaseElement"), g = f.createStruct(e.PRIMITIVE, null, {
                                init: function() {
                                    this.name = "", this.model = e.MODEL_GEOMETRY
                                },
                                read: function(a) {
                                    this.name = d.read(a), this.type = a.U8();
                                    var b = this._createProps();
                                    b.read(a);
                                    var c;
                                    switch (this.type) {
                                    case 1:
                                        c = this.makePlane(b);
                                        break;
                                    case 2:
                                        c = this.makeCube(b);
                                        break;
                                    case 3:
                                        c = this.makeSphere(b);
                                        break;
                                    case 4:
                                        c = this.makeCylinder(b);
                                        break;
                                    case 5:
                                        c = this.makeCone(b);
                                        break;
                                    case 6:
                                        c = this.makeCapsule(b);
                                        break;
                                    case 7:
                                        c = this.makeTorus(b);
                                        break;
                                    default:
                                        throw new Error("unknown primitive type " + this.type)
                                    }
                                    this.geom = c
                                },
                                write: void 0,
                                _createProps: function() {
                                    var a = this.awd.header.geoNrType;
                                    return new c({
                                        101: a,
                                        102: a,
                                        103: a,
                                        110: a,
                                        111: a,
                                        301: e.UINT16,
                                        302: e.UINT16,
                                        303: e.UINT16,
                                        701: e.BOOL,
                                        702: e.BOOL,
                                        703: e.BOOL,
                                        704: e.BOOL
                                    })
                                }, toString : function() {}, makePlane: function(a) {
                                    var b = {
                                        _tId: 1,
                                        type: "plane",
                                        width: 100,
                                        height: 100,
                                        segmentsW: 1,
                                        segmentsH: 1,
                                        yUp: !0,
                                        doubleSided: !1
                                    };
                                    return a && this.setupPlane(b, a), b
                                }, makeCube: function(a) {
                                    var b = {
                                        _tId: 2,
                                        type: "cube",
                                        width: 100,
                                        height: 100,
                                        depth: 100,
                                        segmentsW: 1,
                                        segmentsH: 1,
                                        segmentsD: 1,
                                        tile6: !0
                                    };
                                    return a && this.setupCube(b, a), b
                                }, makeSphere: function(a) {
                                    var b = {
                                        _tId: 3,
                                        type: "sphere",
                                        radius: 100,
                                        segmentsW: 16,
                                        segmentsH: 12,
                                        yUp: !0
                                    };
                                    return a && this.setupSphere(b, a), b
                                }, makeCylinder: function(a) {
                                    var b = {
                                        _tId: 4,
                                        type: "cylinder",
                                        topRadius: 50,
                                        bottomRadius: 50,
                                        height: 100,
                                        segmentsW: 16,
                                        segmentsH: 1,
                                        topClosed: !0,
                                        bottomClosed: !0,
                                        surfaceClosed: !0,
                                        yUp: !0
                                    };
                                    return a && this.setupCylinder(b, a), b
                                }, makeCone: function(a) {
                                    var b = {
                                        _tId: 5,
                                        type: "cone",
                                        radius: 50,
                                        height: 100,
                                        segmentsW: 16,
                                        segmentsH: 1,
                                        closed: !0,
                                        yUp: !0
                                    };
                                    return a && this.setupCone(b, a), b
                                }, makeCapsule: function(a) {
                                    var b = {
                                        _tId: 6,
                                        type: "capsule",
                                        radius: 50,
                                        height: 100,
                                        segmentsW: 16,
                                        segmentsH: 15,
                                        yUp: !0
                                    };
                                    return a && this.setupCapsule(b, a), b
                                }, makeTorus: function(a) {
                                    var b = {
                                        _tId: 7,
                                        type: "torus",
                                        radius: 50,
                                        tubeRadius: 50,
                                        segmentsR: 16,
                                        segmentsT: 8,
                                        yUp: !0
                                    };
                                    return a && this.setupTorus(b, a), b
                                }, setupPlane: function(a, b) {
                                    a.width = b.get(101, 100), a.height = b.get(102, 100), a.segmentsW = b.get(301, 1), a.segmentsH = b.get(302, 1), a.yUp = b.get(701, !0), a.doubleSided = b.get(702, !1)
                                }, setupCube: function(a, b) {
                                    a.width = b.get(101, 100), a.height = b.get(102, 100), a.depth = b.get(103, 100), a.segmentsW = b.get(301, 1), a.segmentsH = b.get(302, 1), a.segmentsD = b.get(303, 1), a.tile6 = b.get(701, !0)
                                }, setupSphere: function(a, b) {
                                    a.radius = b.get(101, 100), a.segmentsW = b.get(301, 16), a.segmentsH = b.get(302, 12), a.yUp = b.get(701, !0)
                                }, setupCylinder: function(a, b) {
                                    a.topRadius = b.get(101, 50), a.bottomRadius = b.get(102, 50), a.height = b.get(103, 100), a.segmentsW = b.get(301, 16), a.segmentsH = b.get(302, 1), a.topClosed = b.get(701, !0), a.bottomClosed = b.get(702, !0), a.yUp = b.get(703, !0)
                                }, setupCone: function(a, b) {
                                    a.radius = b.get(101, 50), a.height = b.get(102, 100), a.segmentsW = b.get(301, 16), a.segmentsH = b.get(302, 1), a.closed = b.get(701, !0), a.yUp = b.get(702, !0)
                                }, setupCapsule: function(a, b) {
                                    a.radius = b.get(101, 50), a.height = b.get(102, 100), a.segmentsW = b.get(301, 16), a.segmentsH = b.get(302, 15), a.yUp = b.get(701, !0)
                                }, setupTorus: function(a, b) {
                                    a.radius = b.get(101, 50), a.tubeRadius = b.get(102, 50), a.segmentsR = b.get(301, 16), a.segmentsT = b.get(302, 8), a.yUp = b.get(701, !0)
                                }, setupPropsPlane: function(a, b) {
                                    b.set(101, a.width), b.set(102, a.height), b.set(301, a.segmentsW), b.set(302, a.segmentsH), b.set(701, a.yUp), b.set(702, a.doubleSided)
                                }, setupPropsCube: function(a, b) {
                                    b.set(101, a.width), b.set(102, a.height), b.set(103, a.depth), b.set(301, a.segmentsW), b.set(302, a.segmentsH), b.set(303, a.segmentsD), b.set(701, a.tile6)
                                }, setupPropsSphere: function(a, b) {
                                    b.set(101, a.radius), b.set(301, a.segmentsW), b.set(302, a.segmentsH), b.set(701, a.yUp)
                                }, setupPropsCylinder: function(a, b) {
                                    b.set(101, a.topRadius), b.set(102, a.bottomRadius), b.set(103, a.height), b.set(301, a.segmentsW), b.set(302, a.segmentsH), b.set(701, a.topClosed), b.set(702, a.bottomClosed), b.set(703, a.yUp)
                                }, setupPropsCone: function(a, b) {
                                    b.set(101, a.radius), b.set(102, a.height), b.set(301, a.segmentsW), b.set(302, a.segmentsH), b.set(701, a.closed), b.set(702, a.yUp)
                                }, setupPropsCapsule: function(a, b) {
                                    b.set(101, a.radius), b.set(102, a.height), b.set(301, a.segmentsW), b.set(302, a.segmentsH), b.set(701, a.yUp)
                                }, setupPropsTorus: function(a, b) {
                                    b.set(101, a.radius), b.set(102, a.tubeRadius), b.set(301, a.segmentsR), b.set(302, a.segmentsT), b.set(701, a.yUp)
                                }
                            });
                            b.exports = g
                        }()
                    }, {
                        BaseElement: 10, consts: 16, "types/awdString": 18, "types/properties": 20
                    }
                    ],
                    7: [function(a, b, c) {
                        !function() {
                            var c = a("types/properties"), d = a("types/awdString"), e = a("consts"), f = a("types/userAttr"), g = a("BaseElement"), h = g.createStruct(e.TEXTURE, null, {
                                init: function() {
                                    this.name = "", this.textype = 0, this.url = null, this.data = null, this.extras = new f, this.model = e.MODEL_TEXTURE
                                },
                                read: function(a) {
                                    this.name = d.read(a), this.textype = a.U8();
                                    var b = a.U32();
                                    0 === this.textype ? (this.url = a.readUTFBytes(b), console.log(this.url)) : (this.data = new ArrayBuffer(b), a.readBytes(this.data, b)), (new c).read(a), this.extras.read(a)
                                },
                                write: void 0,
                                toString: function() {}
                            });
                            b.exports = h;
                        }()
                    }, {
                        BaseElement: 10,
                        consts: 16,
                        "types/awdString": 18,
                        "types/properties": 20,
                        "types/userAttr": 21
                    }
                    ],
                    8: [function(a, b, c) {
                        var d = a("../../src/extension"), e = a("../../src/DefaultElement"), f = a("./Metadata"), g = a("./Container"), h = a("./Mesh"), i = a("./Texture"), j = a("./Material"), k = a("./Geometry"), l = [e, f, g, h, i, j, k], m = {};
                        m.getExtension = function() {
                            var a = new d(null);
                            return a.addStructs(l), a
                        }, b.exports = m
                    }, {
                        "../../src/DefaultElement": 11,
                        "../../src/extension": 17,
                        "./Container": 1,
                        "./Geometry": 2,
                        "./Material": 3,
                        "./Mesh": 4,
                        "./Metadata": 5,
                        "./Texture": 7
                    }
                    ],
                    9: [function(a, b, c) {
                        String.prototype.codePointAt ||!function() {
                            "use strict";
                            var a = function() {
                                try {
                                    var a = {}, b = Object.defineProperty, c = b(a, a, a) && b
                                } catch (d) {}
                                return c
                            }(), b = function(a) {
                                if (null == this)
                                    throw TypeError();
                                var b = String(this), c = b.length, d = a ? Number(a): 0;
                                if (d != d && (d = 0), !(0 > d || d >= c)) {
                                    var e, f = b.charCodeAt(d);
                                    return f >= 55296 && 56319 >= f && c > d + 1 && (e = b.charCodeAt(d + 1), e >= 56320 && 57343 >= e) ? 1024 * (f - 55296) + e - 56320 + 65536 : f
                                }
                            };
                            a ? a(String.prototype, "codePointAt", {
                                value: b,
                                configurable: !0,
                                writable: !0
                            }) : String.prototype.codePointAt = b
                        }()
                    }, {}
                    ],
                    10: [function(a, b, c) {
                        !function() {
                            var c = a("./consts"), d = a("./chunk"), e = {
                                _setup: function(a, b) {
                                    this.awd = a, this.chunk = b, this.id = b.id
                                },
                                init: function() {
                                    this.injectDeps=!1, this.model = c.MODEL_GENERIC
                                },
                                getDependencies: function() {
                                    return this.deps ? this.deps : null
                                },
                                prepareAndAdd: void 0,
                                prepareChunk: function() {
                                    null === this.chunk && (this.chunk = new d),
                                    this.chunk.type = this.type,
                                    this.chunk.ns = this.ns
                                }
                            }, f = {};
                            f.createStruct = function(a, b, c) {
                                var d = function() {
                                    this.type = a, this.nsUri = b, this.ns = 0, this.injectDeps=!0, this.init(), this.chunk = null, this.id =- 1
                                };
                                d.TYPE = a;
                                var f;
                                for (f in e)
                                    d.prototype[f] = e[f];
                                for (f in c)
                                    d.prototype[f] = c[f];
                                return d
                            }, b.exports = f
                        }()
                    }, {
                        "./chunk": 15,
                        "./consts": 16
                    }
                    ],
                    11: [function(a, b, c) {
                        var d = a("./consts"), e = a("./BaseElement"), f = e.createStruct(d.GENERIC, - 1, {
                            read: function(a) {
                                this.buf = new ArrayBuffer(this.chunk.size), a.readBytes(this.buf, this.chunk.size), this.setDeps()
                            },
                            write: function(a) {
                                a.writeBytes(this.buf, this.chunk.size)
                            },
                            setDeps: function() {
                                for (var a, b = this.awd._elements, c = [], d = 0, e = b.length; e > d; d++)
                                    a = b[d], c.push(a);
                                this.deps = c
                            },
                            prepareAndAdd: void 0,
                            prepareChunk: function() {}
                        });
                        b.exports = f
                    }, {
                        "./BaseElement": 10,
                        "./consts": 16
                    }
                    ],
                    12: [function(a, b, c) {
                        !function() {
                            var c = a("./types/awdString"), d = a("./consts"), e = a("./BaseElement"), f = e.createStruct(d.NAMESPACE, null, {
                                init: function() {
                                    this.uri = "", this.nsId = 0
                                },
                                read: function(a) {
                                    this.nsId = a.U8(), this.uri = c.read(a)
                                },
                                write: void 0
                            });
                            b.exports = f
                        }()
                    }, {
                        "./BaseElement": 10,
                        "./consts": 16,
                        "./types/awdString": 18
                    }
                    ],
                    13: [function(a, b, c) {
                        !function() {
                            var a = function(a, b, c) {
                                this.buffer = a, this.ptr = 0, this.littleEndien=!0, b = b || 0, c = c || a.byteLength, this.view = new DataView(a, b, c), this.length = this.view.byteLength
                            };
                            a.prototype = {
                                setPosition: function(a) {
                                    this.ptr = a
                                },
                                setLittleEndian: function(a) {
                                    this.littleEndien = a
                                },
                                bytesAvailable: function() {
                                    return this.length - this.ptr
                                },
                                I8: function() {
                                    return this.view.getInt8(this.ptr++)
                                },
                                U8: function() {
                                    return this.view.getUint8(this.ptr++)
                                },
                                I16: function() {
                                    var a = this.view.getInt16(this.ptr, this.littleEndien);
                                    return this.ptr += 2, a
                                },
                                U16: function() {
                                    var a = this.view.getUint16(this.ptr, this.littleEndien);
                                    return this.ptr += 2, a
                                },
                                I32: function() {
                                    var a = this.view.getInt32(this.ptr, this.littleEndien);
                                    return this.ptr += 4, a
                                },
                                U32: function() {
                                    var a = this.view.getUint32(this.ptr, this.littleEndien);
                                    return this.ptr += 4, a
                                },
                                F32: function() {
                                    var a = this.view.getFloat32(this.ptr, this.littleEndien);
                                    return this.ptr += 4, a
                                },
                                F64: function() {
                                    var a = this.view.getFloat64(this.ptr, this.littleEndien);
                                    return this.ptr += 8, a
                                },
                                readBytes: function(a, b) {
                                    void 0 === b && (b = a.byteLength);
                                    var c = new Int8Array(a), d = new Int8Array(this.buffer, this.ptr, b);
                                    c.set(d), this.ptr += b
                                },
                                subArray: function(a) {
                                    var b = new Int8Array(this.buffer, this.ptr, a);
                                    return this.ptr += a, b
                                },
                                readUTFBytes: function(a) {
                                    for (var b, c, d, e = this.ptr + a, f = [], g = 0; this.ptr < e;)
                                        b = this.U8(), 128 > b ? f[g++] = String.fromCharCode(b) : b > 191 && 224 > b ? (c = this.U8(), f[g++] = String.fromCharCode((31 & b)<<6 | 63 & c)) : (c = this.U8(), d = this.U8(), f[g++] = String.fromCharCode((15 & b)<<12 | (63 & c)<<6 | 63 & d));
                                    return f.join("")
                                }
                            }, b.exports = a
                        }()
                    }, {}
                    ],
                    14: [function(a, b, c) {
                        b.exports = {}
                    }, {
                        "string.prototype.codepointat": 9
                    }
                    ],
                    15: [function(a, b, c) {
                        !function() {
                            var a = function() {
                                this.id = 0, this.ns = 0, this.type = 0, this.flags = 0, this.size = 0, this.data = null
                            };
                            a.prototype = {
                                read: function(a) {
                                    this.id = a.U32(), this.ns = a.U8(), this.type = a.U8(), this.flags = a.U8(), this.size = a.U32()
                                },
                                write: void 0
                            }, b.exports = a
                        }()
                    }, {}
                    ],
                    16: [function(a, b, c) {
                        !function() {
                            var a = {
                                UNCOMPRESSED: 0,
                                DEFLATE: 1,
                                LZMA: 2,
                                AWD_FIELD_INT8: 1,
                                AWD_FIELD_INT16: 2,
                                AWD_FIELD_INT32: 3,
                                AWD_FIELD_UINT8: 4,
                                AWD_FIELD_UINT16: 5,
                                AWD_FIELD_UINT32: 6,
                                AWD_FIELD_FLOAT32: 7,
                                AWD_FIELD_FLOAT64: 8,
                                AWD_FIELD_BOOL: 21,
                                AWD_FIELD_COLOR: 22,
                                AWD_FIELD_BADDR: 23,
                                AWD_FIELD_STRING: 31,
                                AWD_FIELD_BYTEARRAY: 32,
                                AWD_FIELD_VECTOR2x1: 41,
                                AWD_FIELD_VECTOR3x1: 42,
                                AWD_FIELD_VECTOR4x1: 43,
                                AWD_FIELD_MTX3x2: 44,
                                AWD_FIELD_MTX3x3: 45,
                                AWD_FIELD_MTX4x3: 46,
                                AWD_FIELD_MTX4x4: 47,
                                INT8: 1,
                                INT16: 2,
                                INT32: 3,
                                UINT8: 4,
                                UINT16: 5,
                                UINT32: 6,
                                FLOAT32: 7,
                                FLOAT64: 8,
                                AWDSTRING: 31,
                                AWDBYTEARRAY: 32,
                                MAGIC: 4282180,
                                GENERIC: 0,
                                GEOMETRY: 1,
                                PRIMITIVE: 11,
                                CONTAINER: 22,
                                MESH: 23,
                                MATERIAL: 81,
                                TEXTURE: 82,
                                NAMESPACE: 254,
                                METADATA: 255,
                                MODEL_ENTITY: 2,
                                MODEL_SKYBOX: 4,
                                MODEL_CAMERA: 8,
                                MODEL_SEGMENT_SET: 16,
                                MODEL_MESH: 32,
                                MODEL_GEOMETRY: 64,
                                MODEL_SKELETON: 128,
                                MODEL_SKELETON_POSE: 256,
                                MODEL_CONTAINER: 512,
                                MODEL_TEXTURE: 1024,
                                MODEL_TEXTURE_PROJECTOR: 2048,
                                MODEL_MATERIAL: 4096,
                                MODEL_ANIMATION_SET: 8192,
                                MODEL_ANIMATION_STATE: 16384,
                                MODEL_ANIMATION_NODE: 32768,
                                MODEL_ANIMATOR: 65536,
                                MODEL_STATE_TRANSITION: 1<<17,
                                MODEL_LIGHT: 1<<18,
                                MODEL_LIGHT_PICKER: 1<<19,
                                MODEL_SHADOW_MAP_METHOD: 1<<20,
                                MODEL_EFFECTS_METHOD: 1<<21,
                                MODEL_GENERIC: - 1,
                                POSITION: 1,
                                INDEX: 2,
                                UVS: 3,
                                NORMAL: 4,
                                TANGENT: 5,
                                JOIN_IDX: 6,
                                JOIN_WGT: 7,
                                SUVS: 8,
                                COLOR: 11,
                                BINORMAL: 12,
                                DEFAULT_NS: 0
                            };
                            b.exports = a
                        }()
                    }, {}
                    ],
                    17: [function(a, b, c) {
                        var d = a("./DefaultElement"), e = a("./Namespace"), f = function(a) {
                            this.nsUri = a, this.structs = [], this.nsId = 0
                        };
                        f.prototype = {
                            addStruct: function(a) {
                                this.structs.push(a)
                            },
                            addStructs: function(a) {
                                for (var b = 0, c = a.length; c > b; b++)
                                    this.addStruct(a[b])
                            },
                            create: function(a) {
                                for (var b, c = this.structs, e = 0, f = c.length; f > e; e++)
                                    if (b = c[e], b.TYPE === a)
                                        return new b;
                                return new d
                            },
                            createNamespace: function() {
                                var a = new e;
                                return a.uri = this.nsUri, a
                            }
                        }, b.exports = f
                    }, {
                        "./DefaultElement": 11,
                        "./Namespace": 12
                    }
                    ],
                    18: [function(a, b, c) {
                        b.exports = {
                            read: function(a) {
                                var b = a.U16();
                                return a.readUTFBytes(b)
                            },
                            write: function(a, b) {
                                b.U16(a.length), b.writeUTFBytes(a)
                            },
                            getUTFBytesLength: function(a) {
                                for (var b = 0, c = 0, d = a.length; d > c; c++) {
                                    var e, f = a[c].codePointAt(0);
                                    128 > f ? e = 1 : 2048 > f ? e = 2 : 65536 > f ? e = 3 : 2097152 > f && (e = 4), b += e
                                }
                                return b
                            }
                        }
                    }, {}
                    ],
                    19: [function(a, b, c) {
                        !function() {
                            var a = function() {
                                this.data = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
                            };
                            a.prototype = {
                                read: function(a, b) {
                                    this.parseMatrix43RawData(a, b, this.data)
                                },
                                write: void 0,
                                parseMatrix43RawData: function(a,
                                b,
                                c) {
                                    var d = c,
                                    e = a.header.accuracyMatrix ? b.F64: b.F32;
                                    return d[0] = e.call(b),
                                    d[1] = e.call(b),
                                    d[2] = e.call(b),
                                    d[3] = 0,
                                    d[4] = e.call(b),
                                    d[5] = e.call(b),
                                    d[6] = e.call(b),
                                    d[7] = 0,
                                    d[8] = e.call(b),
                                    d[9] = e.call(b),
                                    d[10] = e.call(b),
                                    d[11] = 0,
                                    d[12] = e.call(b),
                                    d[13] = e.call(b),
                                    d[14] = e.call(b),
                                    d[15] = 1,
                                    isNaN(d[0]) && (d[0] = 1,
                                    d[1] = 0,
                                    d[2] = 0,
                                    d[4] = 0,
                                    d[5] = 1,
                                    d[6] = 0,
                                    d[8] = 0,
                                    d[9] = 0,
                                    d[10] = 1,
                                    d[12] = 0,
                                    d[13] = 0,
                                    d[14] = 0),
                                    d
                                }, writeMatrix43RawData : void 0
                            }, b.exports = a
                        }()
                    }, {}
                    ],
                    20: [function(a, b, c) {
                        !function() {
                            var c = a("../consts"), d = (a("./awdString"), a("../bufferWriter")), e = a("../bufferReader"), f = function(a) {
                                this.expected = a, this.vars = {}
                            };
                            f.prototype = {
                                clone: function() {
                                    var a = new d(64);
                                    this.write(a);
                                    var b = new f(this.expected);
                                    return b.read(new e(a.buffer)), b
                                },
                                read: function(a) {
                                    var b = this.expected, c = a.U32(), d = a.ptr + c;
                                    if (b)
                                        for (; a.ptr < d;) {
                                            var e, f = a.U16(), g = a.U32();
                                            this.expected.hasOwnProperty(f) ? (e = b[f], this.set(f, this.parseAttrValue(e, g, a))) : a.ptr += g
                                        }
                                    a.ptr !== d && (console.log("Warn Properties don't read entire data ", a.ptr, d, c), a.ptr = d)
                                },
                                write: void 0,
                                set: function(a,
                                b) {
                                    this.vars[a] = b
                                }, get : function(a, b) {
                                    return this.vars.hasOwnProperty(a) ? this.vars[a] : b
                                }, writeAttrValue: void 0, parseAttrValue : function(a, b, d) {
                                    var e, f;
                                    switch (a) {
                                    case c.AWD_FIELD_INT8:
                                        e = 1, f = d.I8;
                                        break;
                                    case c.AWD_FIELD_INT16:
                                        e = 2, f = d.I16;
                                        break;
                                    case c.AWD_FIELD_INT32:
                                        e = 4, f = d.I32;
                                        break;
                                    case c.AWD_FIELD_BOOL:
                                    case c.AWD_FIELD_UINT8:
                                        e = 1, f = d.U8;
                                        break;
                                    case c.AWD_FIELD_UINT16:
                                        e = 2, f = d.U16;
                                        break;
                                    case c.AWD_FIELD_UINT32:
                                    case c.AWD_FIELD_BADDR:
                                        e = 4, f = d.U32;
                                        break;
                                    case c.AWD_FIELD_FLOAT32:
                                        e = 4, f = d.F32;
                                        break;
                                    case c.AWD_FIELD_FLOAT64:
                                        e = 8, f = d.F64;
                                        break;
                                    case c.AWD_FIELD_STRING:
                                        var g = d.U16();
                                        g === b && console.log("WARN may be Prefab bug / String property bug!!"), d.ptr -= 2;
                                        var h = d.readUTFBytes(b);
                                        return h;
                                    case c.AWD_FIELD_VECTOR2x1:
                                    case c.AWD_FIELD_VECTOR3x1:
                                    case c.AWD_FIELD_VECTOR4x1:
                                    case c.AWD_FIELD_MTX3x2:
                                    case c.AWD_FIELD_MTX3x3:
                                    case c.AWD_FIELD_MTX4x3:
                                    case c.AWD_FIELD_MTX4x4:
                                        e = 8, f = d.F64
                                    }
                                    if (b > e) {
                                        var i, j, k;
                                        for (i = [], j = 0, k = b / e; k > j;)
                                            i.push(f.call(d)), j++;
                                        return i
                                    }
                                    return f.call(d)
                                }
                            }, b.exports = f
                        }()
                    }, {
                        "../bufferReader": 13,
                        "../bufferWriter": 14,
                        "../consts": 16,
                        "./awdString": 18
                    }
                    ],
                    21: [function(a, b, c) {
                        !function() {
                            var c = a("../consts"), d = a("./awdString"), e = a("../bufferWriter"), f = a("../bufferReader"), g = function() {
                                this.attributes = {}, this._list = []
                            };
                            g.prototype = {
                                clone: function() {
                                    var a = new e(64);
                                    this.write(a);
                                    var b = new g;
                                    return b.read(new f(a.buffer)), b
                                },
                                addAttribute: function(a, b, c, d) {
                                    var e = {
                                        name: a,
                                        value: b,
                                        type: c,
                                        ns: d
                                    };
                                    this.attributes[a] = e, this._list.push(e)
                                },
                                read: function(a) {
                                    var b, e = a.U32();
                                    if (e > 0) {
                                        b = {};
                                        for (var f = a.ptr + e; a.ptr < f;) {
                                            var g, h = a.U8(), i = d.read(a), j = a.U8(), k = a.U32();
                                            switch (j) {
                                            case c.AWDSTRING:
                                                g = a.readUTFBytes(k);
                                                break;
                                            case c.INT8:
                                                g = a.I8();
                                                break;
                                            case c.INT16:
                                                g = a.I16();
                                                break;
                                            case c.INT32:
                                                g = a.I32();
                                                break;
                                            case c.BOOL:
                                            case c.UINT8:
                                                g = a.U8();
                                                break;
                                            case c.UINT16:
                                                g = a.U16();
                                                break;
                                            case c.UINT32:
                                            case c.BADDR:
                                                g = a.U32();
                                                break;
                                            case c.FLOAT32:
                                                g = a.F32();
                                                break;
                                            case c.FLOAT64:
                                                g = a.F64();
                                                break;
                                            default:
                                                g = "unimplemented attribute type " + j + "ns : " + h, a.ptr += k
                                            }
                                            this.addAttribute(i, g, j, h), b[i] = g
                                        }
                                    }
                                    return b
                                },
                                write: void 0
                            }, b.exports = g
                        }()
                    }, {
                        "../bufferReader": 13,
                        "../bufferWriter": 14,
                        "../consts": 16,
                        "./awdString": 18
                    }
                    ],
                    22: [function(a, b, c) {
                        !function() {
                            var c = a("../consts"), d = a("./properties"), e = function(a, b, c) {
                                this.x = a || 0, this.y = b || 0, this.z = c || 0
                            };
                            e.prototype = {
                                parsePivot: function(a, b) {
                                    var e = a.header.matrixNrType, f = new d({
                                        1: e,
                                        2: e,
                                        3: e,
                                        4: c.UINT8
                                    });
                                    f.read(b), this.x = f.get(1, 0), this.y = f.get(2, 0), this.z = f.get(3, 0)
                                },
                                writePivot: void 0
                            }, b.exports = e
                        }()
                    }, {
                        "../consts": 16,
                        "./properties": 20
                    }
                    ],
                    awdlib_std: [function(a, b, c) {
                        b.exports = {
                            Container: a("./Container"),
                            Geometry: a("./Geometry"),
                            Material: a("./Material"),
                            Mesh: a("./Mesh"),
                            Metadata: a("./Metadata"),
                            Primitive: a("./Primitive"),
                            Texture: a("./Texture"),
                            ext: a("./ext")
                        }
                    }, {
                        "./Container": 1,
                        "./Geometry": 2,
                        "./Material": 3,
                        "./Mesh": 4,
                        "./Metadata": 5,
                        "./Primitive": 6,
                        "./Texture": 7,
                        "./ext": 8
                    }
                    ]
                }, {}, [])("awdlib_std")
            })
        }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }, {}
    ],
    95: [function(a, b, c) {
        "use strict";
        var d, e = a("es5-ext/object/assign"), f = a("es5-ext/object/normalize-options"), g = a("es5-ext/object/is-callable"), h = a("es5-ext/string/#/contains");
        d = b.exports = function(a, b) {
            var c, d, g, i, j;
            return arguments.length < 2 || "string" != typeof a ? (i = b, b = a, a = null) : i = arguments[2], null == a ? (c = g=!0, d=!1) : (c = h.call(a, "c"), d = h.call(a, "e"), g = h.call(a, "w")), j = {
                value: b,
                configurable: c,
                enumerable: d,
                writable: g
            }, i ? e(f(i), j) : j
        }, d.gs = function(a, b, c) {
            var d, i, j, k;
            return "string" != typeof a ? (j = c, c = b, b = a, a = null) : j = arguments[3], null == b ? b = void 0 : g(b) ? null == c ? c = void 0 : g(c) || (j = c, c = void 0) : (j = b, b = c = void 0), null == a ? (d=!0, i=!1) : (d = h.call(a, "c"), i = h.call(a, "e")), k = {
                get: b,
                set: c,
                configurable: d,
                enumerable: i
            }, j ? e(f(j), k) : k
        }
    }, {
        "es5-ext/object/assign": 99,
        "es5-ext/object/is-callable": 102,
        "es5-ext/object/normalize-options": 106,
        "es5-ext/string/#/contains": 109
    }
    ],
    96: [function(a, b, c) {
        b.exports = a("./vendor/dat.gui"), b.exports.color = a("./vendor/dat.color")
    }, {
        "./vendor/dat.color": 97,
        "./vendor/dat.gui": 98
    }
    ],
    97: [function(a, b, c) {
        var d = b.exports = d || {};
        d.color = d.color || {}, d.utils = d.utils || {}, d.utils.common = function() {
            var a = Array.prototype.forEach, b = Array.prototype.slice;
            return {
                BREAK: {},
                extend: function(a) {
                    return this.each(b.call(arguments, 1), function(b) {
                        for (var c in b)
                            this.isUndefined(b[c]) || (a[c] = b[c])
                    }, this), a
                },
                defaults: function(a) {
                    return this.each(b.call(arguments, 1), function(b) {
                        for (var c in b)
                            this.isUndefined(a[c]) && (a[c] = b[c])
                    }, this), a
                },
                compose: function() {
                    var a = b.call(arguments);
                    return function() {
                        for (var c = b.call(arguments), d = a.length - 1; d >= 0; d--)
                            c = [a[d].apply(this, c)];
                        return c[0]
                    }
                },
                each: function(b, c, d) {
                    if (a && b.forEach === a)
                        b.forEach(c, d);
                    else if (b.length === b.length + 0) {
                        for (var e = 0, f = b.length; f > e; e++)
                            if (e in b && c.call(d, b[e], e) === this.BREAK)
                                return 
                    } else 
                        for (var e in b)
                            if (c.call(d, b[e], e) === this.BREAK)
                                return 
                },
                defer: function(a) {
                    setTimeout(a, 0)
                },
                toArray: function(a) {
                    return a.toArray ? a.toArray() : b.call(a)
                },
                isUndefined: function(a) {
                    return void 0 === a
                },
                isNull: function(a) {
                    return null === a
                },
                isNaN: function(a) {
                    return a !== a
                },
                isArray: Array.isArray || function(a) {
                    return a.constructor === Array
                },
                isObject: function(a) {
                    return a === Object(a)
                },
                isNumber: function(a) {
                    return a === a + 0
                },
                isString: function(a) {
                    return a === a + ""
                },
                isBoolean: function(a) {
                    return a===!1 || a===!0
                },
                isFunction: function(a) {
                    return "[object Function]" === Object.prototype.toString.call(a)
                }
            }
        }(), d.color.toString = function(a) {
            return function(b) {
                if (1 == b.a || a.isUndefined(b.a)) {
                    for (var c = b.hex.toString(16); c.length < 6;)
                        c = "0" + c;
                    return "#" + c
                }
                return "rgba(" + Math.round(b.r) + "," + Math.round(b.g) + "," + Math.round(b.b) + "," + b.a + ")"
            }
        }(d.utils.common), d.Color = d.color.Color = function(a, b, c, d) {
            function e(a, b, c) {
                Object.defineProperty(a, b, {
                    get: function() {
                        return "RGB" === this.__state.space ? this.__state[b] : (g(this, b, c), this.__state[b])
                    },
                    set: function(a) {
                        "RGB" !== this.__state.space && (g(this, b, c), this.__state.space = "RGB"), this.__state[b] = a
                    }
                })
            }
            function f(a, b) {
                Object.defineProperty(a, b, {
                    get: function() {
                        return "HSV" === this.__state.space ? this.__state[b] : (h(this), this.__state[b])
                    },
                    set: function(a) {
                        "HSV" !== this.__state.space && (h(this), this.__state.space = "HSV"), this.__state[b] = a
                    }
                })
            }
            function g(a, c, e) {
                if ("HEX" === a.__state.space)
                    a.__state[c] = b.component_from_hex(a.__state.hex, e);
                else {
                    if ("HSV" !== a.__state.space)
                        throw "Corrupted color state";
                    d.extend(a.__state, b.hsv_to_rgb(a.__state.h, a.__state.s, a.__state.v))
                }
            }
            function h(a) {
                var c = b.rgb_to_hsv(a.r, a.g, a.b);
                d.extend(a.__state, {
                    s: c.s,
                    v: c.v
                }), d.isNaN(c.h) ? d.isUndefined(a.__state.h) && (a.__state.h = 0) : a.__state.h = c.h
            }
            var i = function() {
                if (this.__state = a.apply(this, arguments), this.__state===!1)
                    throw "Failed to interpret color arguments";
                this.__state.a = this.__state.a || 1
            };
            return i.COMPONENTS = ["r", "g", "b", "h", "s", "v", "hex", "a"], d.extend(i.prototype, {
                toString: function() {
                    return c(this)
                },
                toOriginal: function() {
                    return this.__state.conversion.write(this)
                }
            }), e(i.prototype, "r", 2), e(i.prototype, "g", 1), e(i.prototype, "b", 0), f(i.prototype, "h"), f(i.prototype, "s"), f(i.prototype, "v"), Object.defineProperty(i.prototype, "a", {
                get: function() {
                    return this.__state.a
                },
                set: function(a) {
                    this.__state.a = a
                }
            }), Object.defineProperty(i.prototype, "hex", {
                get: function() {
                    return "HEX"!==!this.__state.space && (this.__state.hex = b.rgb_to_hex(this.r, this.g, this.b)), this.__state.hex
                },
                set: function(a) {
                    this.__state.space = "HEX", this.__state.hex = a
                }
            }), i
        }(d.color.interpret = function(a, b) {
            var c, d, e = function() {
                d=!1;
                var a = arguments.length > 1 ? b.toArray(arguments): arguments[0];
                return b.each(f, function(e) {
                    return e.litmus(a) ? (b.each(e.conversions, function(e, f) {
                        return c = e.read(a), d===!1 && c!==!1 ? (d = c, c.conversionName = f, c.conversion = e, b.BREAK) : void 0
                    }), b.BREAK) : void 0
                }), d
            }, f = [{
                litmus: b.isString,
                conversions: {
                    THREE_CHAR_HEX: {
                        read: function(a) {
                            var b = a.match(/^#([A-F0-9])([A-F0-9])([A-F0-9])$/i);
                            return null === b?!1 : {
                                space: "HEX", hex : parseInt("0x" + b[1].toString() + b[1].toString() + b[2].toString() + b[2].toString() + b[3].toString() + b[3].toString())
                            }
                        },
                        write: a
                    },
                    SIX_CHAR_HEX: {
                        read: function(a) {
                            var b = a.match(/^#([A-F0-9]{6})$/i);
                            return null === b?!1 : {
                                space: "HEX", hex : parseInt("0x" + b[1].toString())
                            }
                        },
                        write: a
                    },
                    CSS_RGB: {
                        read: function(a) {
                            var b = a.match(/^rgb\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\)/);
                            return null === b?!1 : {
                                space: "RGB", r : parseFloat(b[1]), g : parseFloat(b[2]), b : parseFloat(b[3])
                            }
                        },
                        write: a
                    },
                    CSS_RGBA: {
                        read: function(a) {
                            var b = a.match(/^rgba\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\,\s*(.+)\s*\)/);
                            return null === b?!1 : {
                                space: "RGB", r : parseFloat(b[1]), g : parseFloat(b[2]), b : parseFloat(b[3]), a : parseFloat(b[4])
                            }
                        },
                        write: a
                    }
                }
            }, {
                litmus: b.isNumber,
                conversions: {
                    HEX: {
                        read: function(a) {
                            return {
                                space: "HEX",
                                hex: a,
                                conversionName: "HEX"
                            }
                        },
                        write: function(a) {
                            return a.hex
                        }
                    }
                }
            }, {
                litmus: b.isArray,
                conversions: {
                    RGB_ARRAY: {
                        read: function(a) {
                            return 3 != a.length?!1 : {
                                space: "RGB", r : a[0], g : a[1], b : a[2]
                            }
                        },
                        write: function(a) {
                            return [a.r, a.g, a.b]
                        }
                    },
                    RGBA_ARRAY: {
                        read: function(a) {
                            return 4 != a.length?!1 : {
                                space: "RGB", r : a[0], g : a[1], b : a[2], a : a[3]
                            }
                        },
                        write: function(a) {
                            return [a.r, a.g, a.b, a.a]
                        }
                    }
                }
            }, {
                litmus: b.isObject,
                conversions: {
                    RGBA_OBJ: {
                        read: function(a) {
                            return b.isNumber(a.r) && b.isNumber(a.g) && b.isNumber(a.b) && b.isNumber(a.a) ? {
                                space: "RGB",
                                r: a.r,
                                g: a.g,
                                b: a.b,
                                a: a.a
                            } : !1
                        },
                        write: function(a) {
                            return {
                                r: a.r,
                                g: a.g,
                                b: a.b,
                                a: a.a
                            }
                        }
                    },
                    RGB_OBJ: {
                        read: function(a) {
                            return b.isNumber(a.r) && b.isNumber(a.g) && b.isNumber(a.b) ? {
                                space: "RGB",
                                r: a.r,
                                g: a.g,
                                b: a.b
                            } : !1
                        },
                        write: function(a) {
                            return {
                                r: a.r,
                                g: a.g,
                                b: a.b
                            }
                        }
                    },
                    HSVA_OBJ: {
                        read: function(a) {
                            return b.isNumber(a.h) && b.isNumber(a.s) && b.isNumber(a.v) && b.isNumber(a.a) ? {
                                space: "HSV",
                                h: a.h,
                                s: a.s,
                                v: a.v,
                                a: a.a
                            } : !1
                        },
                        write: function(a) {
                            return {
                                h: a.h,
                                s: a.s,
                                v: a.v,
                                a: a.a
                            }
                        }
                    },
                    HSV_OBJ: {
                        read: function(a) {
                            return b.isNumber(a.h) && b.isNumber(a.s) && b.isNumber(a.v) ? {
                                space: "HSV",
                                h: a.h,
                                s: a.s,
                                v: a.v
                            } : !1
                        },
                        write: function(a) {
                            return {
                                h: a.h,
                                s: a.s,
                                v: a.v
                            }
                        }
                    }
                }
            }
            ];
            return e
        }(d.color.toString, d.utils.common), d.color.math = function() {
            var a;
            return {
                hsv_to_rgb: function(a, b, c) {
                    var d = Math.floor(a / 60)%6, e = a / 60 - Math.floor(a / 60), f = c * (1 - b), g = c * (1 - e * b), h = c * (1 - (1 - e) * b), i = [[c, h, f], [g, c, f], [f, c, h], [f, g, c], [h, f, c], [c, f, g]][d];
                    return {
                        r: 255 * i[0],
                        g: 255 * i[1],
                        b: 255 * i[2]
                    }
                },
                rgb_to_hsv: function(a, b, c) {
                    var d, e, f = Math.min(a, b, c), g = Math.max(a, b, c), h = g - f;
                    return 0 == g ? {
                        h: NaN,
                        s: 0,
                        v: 0
                    } : (e = h / g, d = a == g ? (b - c) / h : b == g ? 2 + (c - a) / h : 4 + (a - b) / h, d/=6, 0 > d && (d += 1), {
                        h: 360 * d,
                        s: e,
                        v: g / 255
                    })
                },
                rgb_to_hex: function(a, b, c) {
                    var d = this.hex_with_component(0, 2, a);
                    return d = this.hex_with_component(d, 1, b), d = this.hex_with_component(d, 0, c)
                },
                component_from_hex: function(a, b) {
                    return a>>8 * b & 255
                },
                hex_with_component: function(b, c, d) {
                    return d<<(a = 8 * c) | b&~(255<<a)
                }
            }
        }(), d.color.toString, d.utils.common)
    }, {}
    ],
    98: [function(a, b, c) {
        var d = b.exports = d || {};
        d.gui = d.gui || {}, d.utils = d.utils || {}, d.controllers = d.controllers || {}, d.dom = d.dom || {}, d.color = d.color || {}, d.utils.css = function() {
            return {
                load: function(a, b) {
                    b = b || document;
                    var c = b.createElement("link");
                    c.type = "text/css", c.rel = "stylesheet", c.href = a, b.getElementsByTagName("head")[0].appendChild(c)
                },
                inject: function(a, b) {
                    b = b || document;
                    var c = document.createElement("style");
                    c.type = "text/css", c.innerHTML = a, b.getElementsByTagName("head")[0].appendChild(c)
                }
            }
        }(), d.utils.common = function() {
            var a = Array.prototype.forEach, b = Array.prototype.slice;
            return {
                BREAK: {},
                extend: function(a) {
                    return this.each(b.call(arguments, 1), function(b) {
                        for (var c in b)
                            this.isUndefined(b[c]) || (a[c] = b[c])
                    }, this), a
                },
                defaults: function(a) {
                    return this.each(b.call(arguments, 1), function(b) {
                        for (var c in b)
                            this.isUndefined(a[c]) && (a[c] = b[c])
                    }, this), a
                },
                compose: function() {
                    var a = b.call(arguments);
                    return function() {
                        for (var c = b.call(arguments), d = a.length - 1; d >= 0; d--)
                            c = [a[d].apply(this, c)];
                        return c[0]
                    }
                },
                each: function(b, c, d) {
                    if (a && b.forEach === a)
                        b.forEach(c, d);
                    else if (b.length === b.length + 0) {
                        for (var e = 0, f = b.length; f > e; e++)
                            if (e in b && c.call(d, b[e], e) === this.BREAK)
                                return 
                    } else 
                        for (var e in b)
                            if (c.call(d, b[e], e) === this.BREAK)
                                return 
                },
                defer: function(a) {
                    setTimeout(a, 0)
                },
                toArray: function(a) {
                    return a.toArray ? a.toArray() : b.call(a)
                },
                isUndefined: function(a) {
                    return void 0 === a
                },
                isNull: function(a) {
                    return null === a
                },
                isNaN: function(a) {
                    return a !== a
                },
                isArray: Array.isArray || function(a) {
                    return a.constructor === Array
                },
                isObject: function(a) {
                    return a === Object(a)
                },
                isNumber: function(a) {
                    return a === a + 0
                },
                isString: function(a) {
                    return a === a + ""
                },
                isBoolean: function(a) {
                    return a===!1 || a===!0
                },
                isFunction: function(a) {
                    return "[object Function]" === Object.prototype.toString.call(a)
                }
            }
        }(), d.controllers.Controller = function(a) {
            var b = function(a, b) {
                this.initialValue = a[b], this.domElement = document.createElement("div"), this.object = a, this.property = b, this.__onChange = void 0, this.__onFinishChange = void 0
            };
            return a.extend(b.prototype, {
                onChange: function(a) {
                    return this.__onChange = a, this
                },
                onFinishChange: function(a) {
                    return this.__onFinishChange = a, this
                },
                setValue: function(a) {
                    return this.object[this.property] = a, this.__onChange && this.__onChange.call(this, a), this.updateDisplay(), this
                },
                getValue: function() {
                    return this.object[this.property]
                },
                updateDisplay: function() {
                    return this
                },
                isModified: function() {
                    return this.initialValue !== this.getValue()
                }
            }), b
        }(d.utils.common), d.dom.dom = function(a) {
            function b(b) {
                if ("0" === b || a.isUndefined(b))
                    return 0;
                var c = b.match(e);
                return a.isNull(c) ? 0 : parseFloat(c[1])
            }
            var c = {
                HTMLEvents: ["change"],
                MouseEvents: ["click", "mousemove", "mousedown", "mouseup", "mouseover"],
                KeyboardEvents: ["keydown"]
            }, d = {};
            a.each(c, function(b, c) {
                a.each(b, function(a) {
                    d[a] = c
                })
            });
            var e = /(\d+(\.\d+)?)px/, f = {
                makeSelectable: function(a, b) {
                    void 0 !== a && void 0 !== a.style && (a.onselectstart = b ? function() {
                        return !1
                    } : function() {}, a.style.MozUserSelect = b ? "auto" : "none", a.style.KhtmlUserSelect = b ? "auto" : "none", a.unselectable = b ? "on" : "off")
                },
                makeFullscreen: function(b, c, d) {
                    a.isUndefined(c) && (c=!0), a.isUndefined(d) && (d=!0), b.style.position = "absolute", c && (b.style.left = 0, b.style.right = 0), d && (b.style.top = 0, b.style.bottom = 0)
                },
                fakeEvent: function(b, c, e, f) {
                    e = e || {};
                    var g = d[c];
                    if (!g)
                        throw new Error("Event type " + c + " not supported.");
                    var h = document.createEvent(g);
                    switch (g) {
                    case"MouseEvents":
                        var i = e.x || e.clientX || 0, j = e.y || e.clientY || 0;
                        h.initMouseEvent(c, e.bubbles ||!1, e.cancelable ||!0, window, e.clickCount || 1, 0, 0, i, j, !1, !1, !1, !1, 0, null);
                        break;
                    case"KeyboardEvents":
                        var k = h.initKeyboardEvent || h.initKeyEvent;
                        a.defaults(e, {
                            cancelable: !0,
                            ctrlKey: !1,
                            altKey: !1,
                            shiftKey: !1,
                            metaKey: !1,
                            keyCode: void 0,
                            charCode: void 0
                        }), k(c, e.bubbles ||!1, e.cancelable, window, e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, e.keyCode, e.charCode);
                        break;
                    default:
                        h.initEvent(c, e.bubbles ||!1, e.cancelable ||!0)
                    }
                    a.defaults(h, f), b.dispatchEvent(h)
                },
                bind: function(a, b, c, d) {
                    return d = d ||!1, a.addEventListener ? a.addEventListener(b, c, d) : a.attachEvent && a.attachEvent("on" + b, c), f
                },
                unbind: function(a, b, c, d) {
                    return d = d ||!1, a.removeEventListener ? a.removeEventListener(b, c, d) : a.detachEvent && a.detachEvent("on" + b, c), f
                },
                addClass: function(a, b) {
                    if (void 0 === a.className)
                        a.className = b;
                    else if (a.className !== b) {
                        var c = a.className.split(/ +/);
                        - 1 == c.indexOf(b) && (c.push(b), a.className = c.join(" ").replace(/^\s+/, "").replace(/\s+$/, ""))
                    }
                    return f
                },
                removeClass: function(a, b) {
                    if (b)
                        if (void 0 === a.className);
                    else if (a.className === b)
                        a.removeAttribute("class");
                    else {
                        var c = a.className.split(/ +/), d = c.indexOf(b);
                        - 1 != d && (c.splice(d, 1), a.className = c.join(" "))
                    } else 
                        a.className = void 0;
                    return f
                },
                hasClass: function(a, b) {
                    return new RegExp("(?:^|\\s+)" + b + "(?:\\s+|$)").test(a.className) ||!1
                },
                getWidth: function(a) {
                    var c = getComputedStyle(a);
                    return b(c["border-left-width"]) + b(c["border-right-width"]) + b(c["padding-left"]) + b(c["padding-right"]) + b(c.width)
                },
                getHeight: function(a) {
                    var c = getComputedStyle(a);
                    return b(c["border-top-width"]) + b(c["border-bottom-width"]) + b(c["padding-top"]) + b(c["padding-bottom"]) + b(c.height)
                },
                getOffset: function(a) {
                    var b = {
                        left: 0,
                        top: 0
                    };
                    if (a.offsetParent)
                        do 
                            b.left += a.offsetLeft, b.top += a.offsetTop;
                    while (a = a.offsetParent);
                    return b
                },
                isActive: function(a) {
                    return a === document.activeElement && (a.type || a.href)
                }
            };
            return f
        }(d.utils.common), d.controllers.OptionController = function(a, b, c) {
            var d = function(a, e, f) {
                d.superclass.call(this, a, e);
                var g = this;
                if (this.__select = document.createElement("select"), c.isArray(f)) {
                    var h = {};
                    c.each(f, function(a) {
                        h[a] = a
                    }), f = h
                }
                c.each(f, function(a, b) {
                    var c = document.createElement("option");
                    c.innerHTML = b, c.setAttribute("value", a), g.__select.appendChild(c)
                }), this.updateDisplay(), b.bind(this.__select, "change", function() {
                    var a = this.options[this.selectedIndex].value;
                    g.setValue(a)
                }), this.domElement.appendChild(this.__select)
            };
            return d.superclass = a, c.extend(d.prototype, a.prototype, {
                setValue: function(a) {
                    var b = d.superclass.prototype.setValue.call(this, a);
                    return this.__onFinishChange && this.__onFinishChange.call(this, this.getValue()), b
                },
                updateDisplay: function() {
                    return this.__select.value = this.getValue(), d.superclass.prototype.updateDisplay.call(this)
                }
            }), d
        }(d.controllers.Controller, d.dom.dom, d.utils.common), d.controllers.NumberController = function(a, b) {
            function c(a) {
                return a = a.toString(), a.indexOf(".")>-1 ? a.length - a.indexOf(".") - 1 : 0
            }
            var d = function(a, e, f) {
                d.superclass.call(this, a, e), f = f || {}, this.__min = f.min, this.__max = f.max, this.__step = f.step, b.isUndefined(this.__step) ? 0 == this.initialValue ? this.__impliedStep = 1 : this.__impliedStep = Math.pow(10, Math.floor(Math.log(this.initialValue) / Math.LN10)) / 10 : this.__impliedStep = this.__step, this.__precision = c(this.__impliedStep)
            };
            return d.superclass = a, b.extend(d.prototype, a.prototype, {
                setValue: function(a) {
                    return void 0 !== this.__min && a < this.__min ? a = this.__min : void 0 !== this.__max && a > this.__max && (a = this.__max), void 0 !== this.__step && a%this.__step != 0 && (a = Math.round(a / this.__step) * this.__step), d.superclass.prototype.setValue.call(this, a)
                },
                min: function(a) {
                    return this.__min = a, this
                },
                max: function(a) {
                    return this.__max = a, this
                },
                step: function(a) {
                    return this.__step = a, this
                }
            }), d
        }(d.controllers.Controller, d.utils.common), d.controllers.NumberControllerBox = function(a, b, c) {
            function d(a, b) {
                var c = Math.pow(10, b);
                return Math.round(a * c) / c
            }
            var e = function(a, d, f) {
                function g() {
                    var a = parseFloat(m.__input.value);
                    c.isNaN(a) || m.setValue(a)
                }
                function h() {
                    g(), m.__onFinishChange && m.__onFinishChange.call(m, m.getValue())
                }
                function i(a) {
                    b.bind(window, "mousemove", j), b.bind(window, "mouseup", k), l = a.clientY
                }
                function j(a) {
                    var b = l - a.clientY;
                    m.setValue(m.getValue() + b * m.__impliedStep), l = a.clientY
                }
                function k() {
                    b.unbind(window, "mousemove", j), b.unbind(window, "mouseup", k)
                }
                this.__truncationSuspended=!1, e.superclass.call(this, a, d, f);
                var l, m = this;
                this.__input = document.createElement("input"), this.__input.setAttribute("type", "text"), b.bind(this.__input, "change", g), b.bind(this.__input, "blur", h), b.bind(this.__input, "mousedown", i), b.bind(this.__input, "keydown", function(a) {
                    13 === a.keyCode && (m.__truncationSuspended=!0, this.blur(), m.__truncationSuspended=!1)
                }), this.updateDisplay(), this.domElement.appendChild(this.__input)
            };
            return e.superclass = a, c.extend(e.prototype, a.prototype, {
                updateDisplay: function() {
                    return this.__input.value = this.__truncationSuspended ? this.getValue() : d(this.getValue(), this.__precision), e.superclass.prototype.updateDisplay.call(this)
                }
            }), e
        }(d.controllers.NumberController, d.dom.dom, d.utils.common), d.controllers.NumberControllerSlider = function(a, b, c, d, e) {
            function f(a, b, c, d, e) {
                return d + (e - d) * ((a - b) / (c - b))
            }
            var g = function(a, c, d, e, h) {
                function i(a) {
                    b.bind(window, "mousemove", j), b.bind(window, "mouseup", k), j(a)
                }
                function j(a) {
                    a.preventDefault();
                    var c = b.getOffset(l.__background), d = b.getWidth(l.__background);
                    return l.setValue(f(a.clientX, c.left, c.left + d, l.__min, l.__max)), !1
                }
                function k() {
                    b.unbind(window, "mousemove", j), b.unbind(window, "mouseup", k), l.__onFinishChange && l.__onFinishChange.call(l, l.getValue())
                }
                g.superclass.call(this, a, c, {
                    min: d,
                    max: e,
                    step: h
                });
                var l = this;
                this.__background = document.createElement("div"), this.__foreground = document.createElement("div"), b.bind(this.__background, "mousedown", i), b.addClass(this.__background, "slider"), b.addClass(this.__foreground, "slider-fg"), this.updateDisplay(), this.__background.appendChild(this.__foreground), this.domElement.appendChild(this.__background)
            };
            return g.superclass = a, g.useDefaultStyles = function() {
                c.inject(e)
            }, d.extend(g.prototype, a.prototype, {
                updateDisplay: function() {
                    var a = (this.getValue() - this.__min) / (this.__max - this.__min);
                    return this.__foreground.style.width = 100 * a + "%", g.superclass.prototype.updateDisplay.call(this)
                }
            }), g
        }(d.controllers.NumberController, d.dom.dom, d.utils.css, d.utils.common, ".slider {\n  box-shadow: inset 0 2px 4px rgba(0,0,0,0.15);\n  height: 1em;\n  border-radius: 1em;\n  background-color: #eee;\n  padding: 0 0.5em;\n  overflow: hidden;\n}\n\n.slider-fg {\n  padding: 1px 0 2px 0;\n  background-color: #aaa;\n  height: 1em;\n  margin-left: -0.5em;\n  padding-right: 0.5em;\n  border-radius: 1em 0 0 1em;\n}\n\n.slider-fg:after {\n  display: inline-block;\n  border-radius: 1em;\n  background-color: #fff;\n  border:  1px solid #aaa;\n  content: '';\n  float: right;\n  margin-right: -1em;\n  margin-top: -1px;\n  height: 0.9em;\n  width: 0.9em;\n}"), d.controllers.FunctionController = function(a, b, c) {
            var d = function(a, c, e) {
                d.superclass.call(this, a, c);
                var f = this;
                this.__button = document.createElement("div"), this.__button.innerHTML = void 0 === e ? "Fire" : e, b.bind(this.__button, "click", function(a) {
                    return a.preventDefault(), f.fire(), !1
                }), b.addClass(this.__button, "button"), this.domElement.appendChild(this.__button)
            };
            return d.superclass = a, c.extend(d.prototype, a.prototype, {
                fire: function() {
                    this.__onChange && this.__onChange.call(this), this.__onFinishChange && this.__onFinishChange.call(this, this.getValue()), this.getValue().call(this.object)
                }
            }), d
        }(d.controllers.Controller, d.dom.dom, d.utils.common), d.controllers.BooleanController = function(a, b, c) {
            var d = function(a, c) {
                function e() {
                    f.setValue(!f.__prev)
                }
                d.superclass.call(this, a, c);
                var f = this;
                this.__prev = this.getValue(), this.__checkbox = document.createElement("input"), this.__checkbox.setAttribute("type", "checkbox"), b.bind(this.__checkbox, "change", e, !1), this.domElement.appendChild(this.__checkbox), this.updateDisplay()
            };
            return d.superclass = a, c.extend(d.prototype, a.prototype, {
                setValue: function(a) {
                    var b = d.superclass.prototype.setValue.call(this, a);
                    return this.__onFinishChange && this.__onFinishChange.call(this, this.getValue()), this.__prev = this.getValue(), b
                },
                updateDisplay: function() {
                    return this.getValue()===!0 ? (this.__checkbox.setAttribute("checked", "checked"), this.__checkbox.checked=!0) : this.__checkbox.checked=!1, d.superclass.prototype.updateDisplay.call(this)
                }
            }), d
        }(d.controllers.Controller, d.dom.dom, d.utils.common), d.color.toString = function(a) {
            return function(b) {
                if (1 == b.a || a.isUndefined(b.a)) {
                    for (var c = b.hex.toString(16); c.length < 6;)
                        c = "0" + c;
                    return "#" + c
                }
                return "rgba(" + Math.round(b.r) + "," + Math.round(b.g) + "," + Math.round(b.b) + "," + b.a + ")"
            }
        }(d.utils.common), d.color.interpret = function(a, b) {
            var c, d, e = function() {
                d=!1;
                var a = arguments.length > 1 ? b.toArray(arguments): arguments[0];
                return b.each(f, function(e) {
                    return e.litmus(a) ? (b.each(e.conversions, function(e, f) {
                        return c = e.read(a), d===!1 && c!==!1 ? (d = c, c.conversionName = f, c.conversion = e, b.BREAK) : void 0
                    }), b.BREAK) : void 0
                }), d
            }, f = [{
                litmus: b.isString,
                conversions: {
                    THREE_CHAR_HEX: {
                        read: function(a) {
                            var b = a.match(/^#([A-F0-9])([A-F0-9])([A-F0-9])$/i);
                            return null === b?!1 : {
                                space: "HEX", hex : parseInt("0x" + b[1].toString() + b[1].toString() + b[2].toString() + b[2].toString() + b[3].toString() + b[3].toString())
                            }
                        },
                        write: a
                    },
                    SIX_CHAR_HEX: {
                        read: function(a) {
                            var b = a.match(/^#([A-F0-9]{6})$/i);
                            return null === b?!1 : {
                                space: "HEX", hex : parseInt("0x" + b[1].toString())
                            }
                        },
                        write: a
                    },
                    CSS_RGB: {
                        read: function(a) {
                            var b = a.match(/^rgb\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\)/);
                            return null === b?!1 : {
                                space: "RGB", r : parseFloat(b[1]), g : parseFloat(b[2]), b : parseFloat(b[3])
                            }
                        },
                        write: a
                    },
                    CSS_RGBA: {
                        read: function(a) {
                            var b = a.match(/^rgba\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\,\s*(.+)\s*\)/);
                            return null === b?!1 : {
                                space: "RGB", r : parseFloat(b[1]), g : parseFloat(b[2]), b : parseFloat(b[3]), a : parseFloat(b[4])
                            }
                        },
                        write: a
                    }
                }
            }, {
                litmus: b.isNumber,
                conversions: {
                    HEX: {
                        read: function(a) {
                            return {
                                space: "HEX",
                                hex: a,
                                conversionName: "HEX"
                            }
                        },
                        write: function(a) {
                            return a.hex
                        }
                    }
                }
            }, {
                litmus: b.isArray,
                conversions: {
                    RGB_ARRAY: {
                        read: function(a) {
                            return 3 != a.length?!1 : {
                                space: "RGB", r : a[0], g : a[1], b : a[2]
                            }
                        },
                        write: function(a) {
                            return [a.r, a.g, a.b]
                        }
                    },
                    RGBA_ARRAY: {
                        read: function(a) {
                            return 4 != a.length?!1 : {
                                space: "RGB", r : a[0], g : a[1], b : a[2], a : a[3]
                            }
                        },
                        write: function(a) {
                            return [a.r, a.g, a.b, a.a]
                        }
                    }
                }
            }, {
                litmus: b.isObject,
                conversions: {
                    RGBA_OBJ: {
                        read: function(a) {
                            return b.isNumber(a.r) && b.isNumber(a.g) && b.isNumber(a.b) && b.isNumber(a.a) ? {
                                space: "RGB",
                                r: a.r,
                                g: a.g,
                                b: a.b,
                                a: a.a
                            } : !1
                        },
                        write: function(a) {
                            return {
                                r: a.r,
                                g: a.g,
                                b: a.b,
                                a: a.a
                            }
                        }
                    },
                    RGB_OBJ: {
                        read: function(a) {
                            return b.isNumber(a.r) && b.isNumber(a.g) && b.isNumber(a.b) ? {
                                space: "RGB",
                                r: a.r,
                                g: a.g,
                                b: a.b
                            } : !1
                        },
                        write: function(a) {
                            return {
                                r: a.r,
                                g: a.g,
                                b: a.b
                            }
                        }
                    },
                    HSVA_OBJ: {
                        read: function(a) {
                            return b.isNumber(a.h) && b.isNumber(a.s) && b.isNumber(a.v) && b.isNumber(a.a) ? {
                                space: "HSV",
                                h: a.h,
                                s: a.s,
                                v: a.v,
                                a: a.a
                            } : !1
                        },
                        write: function(a) {
                            return {
                                h: a.h,
                                s: a.s,
                                v: a.v,
                                a: a.a
                            }
                        }
                    },
                    HSV_OBJ: {
                        read: function(a) {
                            return b.isNumber(a.h) && b.isNumber(a.s) && b.isNumber(a.v) ? {
                                space: "HSV",
                                h: a.h,
                                s: a.s,
                                v: a.v
                            } : !1
                        },
                        write: function(a) {
                            return {
                                h: a.h,
                                s: a.s,
                                v: a.v
                            }
                        }
                    }
                }
            }
            ];
            return e
        }(d.color.toString, d.utils.common), d.GUI = d.gui.GUI = function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o) {
            function p(a, b, c, f) {
                if (void 0 === b[c])
                    throw new Error("Object " + b + ' has no property "' + c + '"');
                var g;
                if (f.color)
                    g = new k(b, c);
                else {
                    var h = [b, c].concat(f.factoryArgs);
                    g = d.apply(a, h)
                }
                f.before instanceof e && (f.before = f.before.__li), s(a, g), n.addClass(g.domElement, "c");
                var i = document.createElement("span");
                n.addClass(i, "property-name"), i.innerHTML = g.property;
                var j = document.createElement("div");
                j.appendChild(i), j.appendChild(g.domElement);
                var l = q(a, j, f.before);
                return n.addClass(l, M.CLASS_CONTROLLER_ROW), n.addClass(l, typeof g.getValue()), r(a, l, g), a.__controllers.push(g), g
            }
            function q(a, b, c) {
                var d = document.createElement("li");
                return b && d.appendChild(b), c ? a.__ul.insertBefore(d, params.before) : a.__ul.appendChild(d), a.onResize(), d
            }
            function r(a, b, c) {
                if (c.__li = b, c.__gui = a, o.extend(c, {
                    options: function(b) {
                        return arguments.length > 1 ? (c.remove(), p(a, c.object, c.property, {
                            before: c.__li.nextElementSibling,
                            factoryArgs: [o.toArray(arguments)]
                        })) : o.isArray(b) || o.isObject(b) ? (c.remove(), p(a, c.object, c.property, {
                            before: c.__li.nextElementSibling,
                            factoryArgs: [b]
                        })) : void 0
                    },
                    name: function(a) {
                        return c.__li.firstElementChild.firstElementChild.innerHTML = a, c
                    },
                    listen: function() {
                        return c.__gui.listen(c), c
                    },
                    remove: function() {
                        return c.__gui.remove(c), c
                    }
                }), c instanceof i) {
                    var d = new h(c.object, c.property, {
                        min: c.__min,
                        max: c.__max,
                        step: c.__step
                    });
                    o.each(["updateDisplay", "onChange", "onFinishChange"], function(a) {
                        var b = c[a], e = d[a];
                        c[a] = d[a] = function() {
                            var a = Array.prototype.slice.call(arguments);
                            return b.apply(c, a), e.apply(d, a)
                        }
                    }), n.addClass(b, "has-slider"), c.domElement.insertBefore(d.domElement, c.domElement.firstElementChild)
                } else if (c instanceof h) {
                    var e = function(b) {
                        return o.isNumber(c.__min) && o.isNumber(c.__max) ? (c.remove(), p(a, c.object, c.property, {
                            before: c.__li.nextElementSibling,
                            factoryArgs: [c.__min, c.__max, c.__step]
                        })) : b
                    };
                    c.min = o.compose(e, c.min), c.max = o.compose(e, c.max)
                } else 
                    c instanceof f ? (n.bind(b, "click", function() {
                        n.fakeEvent(c.__checkbox, "click")
                    }), n.bind(c.__checkbox, "click", function(a) {
                        a.stopPropagation()
                    })) : c instanceof g ? (n.bind(b, "click", function() {
                        n.fakeEvent(c.__button, "click")
                    }), n.bind(b, "mouseover", function() {
                        n.addClass(c.__button, "hover")
                    }), n.bind(b, "mouseout", function() {
                        n.removeClass(c.__button, "hover")
                    })) : c instanceof k && (n.addClass(b, "color"), c.updateDisplay = o.compose(function(a) {
                        return b.style.borderLeftColor = c.__color.toString(), a
                    }, c.updateDisplay), c.updateDisplay());
                c.setValue = o.compose(function(b) {
                    return a.getRoot().__preset_select && c.isModified() && A(a.getRoot(), !0), b
                }, c.setValue)
            }
            function s(a, b) {
                var c = a.getRoot(), d = c.__rememberedObjects.indexOf(b.object);
                if ( - 1 != d) {
                    var e = c.__rememberedObjectIndecesToControllers[d];
                    if (void 0 === e && (e = {}, c.__rememberedObjectIndecesToControllers[d] = e), e[b.property] = b, c.load && c.load.remembered) {
                        var f, g = c.load.remembered;
                        if (g[a.preset])
                            f = g[a.preset];
                        else {
                            if (!g[H])
                                return;
                            f = g[H]
                        }
                        if (f[d] && void 0 !== f[d][b.property]) {
                            var h = f[d][b.property];
                            b.initialValue = h, b.setValue(h)
                        }
                    }
                }
            }
            function t(a, b) {
                return document.location.href + "." + b
            }
            function u(a) {
                function b() {
                    j.style.display = a.useLocalStorage ? "block" : "none"
                }
                var c = a.__save_row = document.createElement("li");
                n.addClass(a.domElement, "has-save"), a.__ul.insertBefore(c, a.__ul.firstChild), n.addClass(c, "save-row");
                var d = document.createElement("span");
                d.innerHTML = "&nbsp;", n.addClass(d, "button gears");
                var e = document.createElement("span");
                e.innerHTML = "Save", n.addClass(e, "button"), n.addClass(e, "save");
                var f = document.createElement("span");
                f.innerHTML = "New", n.addClass(f, "button"), n.addClass(f, "save-as");
                var g = document.createElement("span");
                g.innerHTML = "Revert", n.addClass(g, "button"), n.addClass(g, "revert");
                var h = a.__preset_select = document.createElement("select");
                if (a.load && a.load.remembered ? o.each(a.load.remembered, function(b, c) {
                    y(a, c, c == a.preset)
                }) : y(a, H, !1), n.bind(h, "change", function() {
                    for (var b = 0; b < a.__preset_select.length; b++)
                        a.__preset_select[b].innerHTML = a.__preset_select[b].value;
                    a.preset = this.value
                }), c.appendChild(h), c.appendChild(d), c.appendChild(e), c.appendChild(f), c.appendChild(g), I) {
                    var i = document.getElementById("dg-save-locally"), j = document.getElementById("dg-local-explain");
                    i.style.display = "block";
                    var k = document.getElementById("dg-local-storage");
                    "true" === localStorage.getItem(t(a, "isLocal")) && k.setAttribute("checked", "checked"), b(), n.bind(k, "change", function() {
                        a.useLocalStorage=!a.useLocalStorage, b()
                    })
                }
                var l = document.getElementById("dg-new-constructor");
                n.bind(l, "keydown", function(a) {
                    !a.metaKey || 67 !== a.which && 67 != a.keyCode || C.hide()
                }), n.bind(d, "click", function() {
                    l.innerHTML = JSON.stringify(a.getSaveObject(), void 0, 2), C.show(), l.focus(), l.select()
                }), n.bind(e, "click", function() {
                    a.save()
                }), n.bind(f, "click", function() {
                    var b = prompt("Enter a new preset name.");
                    b && a.saveAs(b)
                }), n.bind(g, "click", function() {
                    a.revert()
                })
            }
            function v(a) {
                function b(b) {
                    return b.preventDefault(), e = b.clientX, n.addClass(a.__closeButton, M.CLASS_DRAG), n.bind(window, "mousemove", c), n.bind(window, "mouseup", d), !1
                }
                function c(b) {
                    return b.preventDefault(), a.width += e - b.clientX, a.onResize(), e = b.clientX, !1
                }
                function d() {
                    n.removeClass(a.__closeButton, M.CLASS_DRAG), n.unbind(window, "mousemove", c), n.unbind(window, "mouseup", d)
                }
                a.__resize_handle = document.createElement("div"), o.extend(a.__resize_handle.style, {
                    width: "6px",
                    marginLeft: "-3px",
                    height: "200px",
                    cursor: "ew-resize",
                    position: "absolute"
                });
                var e;
                n.bind(a.__resize_handle, "mousedown", b), n.bind(a.__closeButton, "mousedown", b), a.domElement.insertBefore(a.__resize_handle, a.domElement.firstElementChild)
            }
            function w(a, b) {
                a.domElement.style.width = b + "px", a.__save_row && a.autoPlace && (a.__save_row.style.width = b + "px"), a.__closeButton && (a.__closeButton.style.width = b + "px")
            }
            function x(a, b) {
                var c = {};
                return o.each(a.__rememberedObjects, function(d, e) {
                    var f = {}, g = a.__rememberedObjectIndecesToControllers[e];
                    o.each(g, function(a, c) {
                        f[c] = b ? a.initialValue : a.getValue()
                    }), c[e] = f
                }), c
            }
            function y(a, b, c) {
                var d = document.createElement("option");
                d.innerHTML = b, d.value = b, a.__preset_select.appendChild(d), c && (a.__preset_select.selectedIndex = a.__preset_select.length - 1)
            }
            function z(a) {
                for (var b = 0; b < a.__preset_select.length; b++)
                    a.__preset_select[b].value == a.preset && (a.__preset_select.selectedIndex = b)
            }
            function A(a, b) {
                var c = a.__preset_select[a.__preset_select.selectedIndex];
                b ? c.innerHTML = c.value + "*" : c.innerHTML = c.value
            }
            function B(a) {
                0 != a.length && l(function() {
                    B(a)
                }), o.each(a, function(a) {
                    a.updateDisplay()
                })
            }
            a.inject(c);
            var C, D, E = "dg", F = 72, G = 20, H = "Default", I = function() {
                try {
                    return "localStorage"in window && null !== window.localStorage
                } catch (a) {
                    return !1
                }
            }(), J=!0, K=!1, L = [], M = function(a) {
                function b() {
                    localStorage.setItem(t(d, "gui"), JSON.stringify(d.getSaveObject()))
                }
                function c() {
                    var a = d.getRoot();
                    a.width += 1, o.defer(function() {
                        a.width -= 1
                    })
                }
                var d = this;
                this.domElement = document.createElement("div"), this.__ul = document.createElement("ul"), this.domElement.appendChild(this.__ul), n.addClass(this.domElement, E), this.__folders = {}, this.__controllers = [], this.__rememberedObjects = [], this.__rememberedObjectIndecesToControllers = [], this.__listening = [], a = a || {}, a = o.defaults(a, {
                    autoPlace: !0,
                    width: M.DEFAULT_WIDTH
                }), a = o.defaults(a, {
                    resizable: a.autoPlace,
                    hideable: a.autoPlace
                }), o.isUndefined(a.load) ? a.load = {
                    preset: H
                } : a.preset && (a.load.preset = a.preset), o.isUndefined(a.parent) && a.hideable && L.push(this), a.resizable = o.isUndefined(a.parent) && a.resizable, a.autoPlace && o.isUndefined(a.scrollable) && (a.scrollable=!0);
                var e = I && "true" === localStorage.getItem(t(this, "isLocal"));
                if (Object.defineProperties(this, {
                    parent: {
                        get: function() {
                            return a.parent
                        }
                    },
                    scrollable: {
                        get: function() {
                            return a.scrollable
                        }
                    },
                    autoPlace: {
                        get: function() {
                            return a.autoPlace
                        }
                    },
                    preset: {
                        get: function() {
                            return d.parent ? d.getRoot().preset : a.load.preset
                        },
                        set: function(b) {
                            d.parent ? d.getRoot().preset = b : a.load.preset = b, z(this), d.revert()
                        }
                    },
                    width: {
                        get: function() {
                            return a.width
                        },
                        set: function(b) {
                            a.width = b, w(d, b)
                        }
                    },
                    name: {
                        get: function() {
                            return a.name
                        },
                        set: function(b) {
                            a.name = b, g && (g.innerHTML = a.name)
                        }
                    },
                    closed: {
                        get: function() {
                            return a.closed
                        },
                        set: function(b) {
                            a.closed = b, a.closed ? n.addClass(d.__ul, M.CLASS_CLOSED) : n.removeClass(d.__ul, M.CLASS_CLOSED), this.onResize(), d.__closeButton && (d.__closeButton.innerHTML = b ? M.TEXT_OPEN : M.TEXT_CLOSED)
                        }
                    },
                    load: {
                        get: function() {
                            return a.load
                        }
                    },
                    useLocalStorage: {
                        get: function() {
                            return e
                        },
                        set: function(a) {
                            I && (e = a, a ? n.bind(window, "unload", b) : n.unbind(window, "unload", b), localStorage.setItem(t(d, "isLocal"), a))
                        }
                    }
                }), o.isUndefined(a.parent)) {
                    if (a.closed=!1, n.addClass(this.domElement, M.CLASS_MAIN), n.makeSelectable(this.domElement, !1), I && e) {
                        d.useLocalStorage=!0;
                        var f = localStorage.getItem(t(this, "gui"));
                        f && (a.load = JSON.parse(f))
                    }
                    this.__closeButton = document.createElement("div"), this.__closeButton.innerHTML = M.TEXT_CLOSED, n.addClass(this.__closeButton, M.CLASS_CLOSE_BUTTON), this.domElement.appendChild(this.__closeButton), n.bind(this.__closeButton, "click", function() {
                        d.closed=!d.closed
                    })
                } else {
                    void 0 === a.closed && (a.closed=!0);
                    var g = document.createTextNode(a.name);
                    n.addClass(g, "controller-name");
                    var h = q(d, g), i = function(a) {
                        return a.preventDefault(), d.closed=!d.closed, !1
                    };
                    n.addClass(this.__ul, M.CLASS_CLOSED), n.addClass(h, "title"), n.bind(h, "click", i), a.closed || (this.closed=!1)
                }
                a.autoPlace && (o.isUndefined(a.parent) && (J && (D = document.createElement("div"), n.addClass(D, E), n.addClass(D, M.CLASS_AUTO_PLACE_CONTAINER), document.body.appendChild(D), J=!1), D.appendChild(this.domElement), n.addClass(this.domElement, M.CLASS_AUTO_PLACE)), this.parent || w(d, a.width)), n.bind(window, "resize", function() {
                    d.onResize()
                }), n.bind(this.__ul, "webkitTransitionEnd", function() {
                    d.onResize()
                }), n.bind(this.__ul, "transitionend", function() {
                    d.onResize()
                }), n.bind(this.__ul, "oTransitionEnd", function() {
                    d.onResize()
                }), this.onResize(), a.resizable && v(this);
                d.getRoot();
                a.parent || c()
            };
            return M.toggleHide = function() {
                K=!K, o.each(L, function(a) {
                    a.domElement.style.zIndex = K?-999 : 999, a.domElement.style.opacity = K ? 0 : 1
                })
            }, M.CLASS_AUTO_PLACE = "a", M.CLASS_AUTO_PLACE_CONTAINER = "ac", M.CLASS_MAIN = "main", M.CLASS_CONTROLLER_ROW = "cr", M.CLASS_TOO_TALL = "taller-than-window", M.CLASS_CLOSED = "closed", M.CLASS_CLOSE_BUTTON = "close-button", M.CLASS_DRAG = "drag", M.DEFAULT_WIDTH = 245, M.TEXT_CLOSED = "Close Controls", M.TEXT_OPEN = "Open Controls", n.bind(window, "keydown", function(a) {
                "text" === document.activeElement.type || a.which !== F && a.keyCode != F || M.toggleHide()
            }, !1), o.extend(M.prototype, {
                add: function(a, b) {
                    return p(this, a, b, {
                        factoryArgs: Array.prototype.slice.call(arguments, 2)
                    })
                },
                addColor: function(a, b) {
                    return p(this, a, b, {
                        color: !0
                    })
                },
                remove: function(a) {
                    this.__ul.removeChild(a.__li), this.__controllers.slice(this.__controllers.indexOf(a), 1);
                    var b = this;
                    o.defer(function() {
                        b.onResize()
                    })
                },
                destroy: function() {
                    this.autoPlace && D.removeChild(this.domElement)
                },
                addFolder: function(a) {
                    if (void 0 !== this.__folders[a])
                        throw new Error('You already have a folder in this GUI by the name "' + a + '"');
                    var b = {
                        name: a,
                        parent: this
                    };
                    b.autoPlace = this.autoPlace, this.load && this.load.folders && this.load.folders[a] && (b.closed = this.load.folders[a].closed, b.load = this.load.folders[a]);
                    var c = new M(b);
                    this.__folders[a] = c;
                    var d = q(this, c.domElement);
                    return n.addClass(d, "folder"), c
                },
                open: function() {
                    this.closed=!1
                },
                close: function() {
                    this.closed=!0
                },
                onResize: function() {
                    var a = this.getRoot();
                    if (a.scrollable) {
                        var b = n.getOffset(a.__ul).top, c = 0;
                        o.each(a.__ul.childNodes, function(b) {
                            a.autoPlace && b === a.__save_row || (c += n.getHeight(b))
                        }), window.innerHeight - b - G < c ? (n.addClass(a.domElement, M.CLASS_TOO_TALL), a.__ul.style.height = window.innerHeight - b - G + "px") : (n.removeClass(a.domElement, M.CLASS_TOO_TALL), a.__ul.style.height = "auto")
                    }
                    a.__resize_handle && o.defer(function() {
                        a.__resize_handle.style.height = a.__ul.offsetHeight + "px"
                    }), a.__closeButton && (a.__closeButton.style.width = a.width + "px")
                },
                remember: function() {
                    if (o.isUndefined(C) && (C = new m, C.domElement.innerHTML = b), this.parent)
                        throw new Error("You can only call remember on a top level GUI.");
                    var a = this;
                    o.each(Array.prototype.slice.call(arguments), function(b) {
                        0 == a.__rememberedObjects.length && u(a), - 1 == a.__rememberedObjects.indexOf(b) && a.__rememberedObjects.push(b)
                    }), this.autoPlace && w(this, this.width)
                },
                getRoot: function() {
                    for (var a = this; a.parent;)
                        a = a.parent;
                    return a
                },
                getSaveObject: function() {
                    var a = this.load;
                    return a.closed = this.closed, this.__rememberedObjects.length > 0 && (a.preset = this.preset, a.remembered || (a.remembered = {}), a.remembered[this.preset] = x(this)), a.folders = {}, o.each(this.__folders, function(b, c) {
                        a.folders[c] = b.getSaveObject()
                    }), a
                },
                save: function() {
                    this.load.remembered || (this.load.remembered = {}), this.load.remembered[this.preset] = x(this), A(this, !1)
                },
                saveAs: function(a) {
                    this.load.remembered || (this.load.remembered = {}, this.load.remembered[H] = x(this, !0)), this.load.remembered[a] = x(this), this.preset = a, y(this, a, !0)
                },
                revert: function(a) {
                    o.each(this.__controllers, function(b) {
                        this.getRoot().load.remembered ? s(a || this.getRoot(), b) : b.setValue(b.initialValue)
                    }, this), o.each(this.__folders, function(a) {
                        a.revert(a)
                    }), a || A(this.getRoot(), !1)
                },
                listen: function(a) {
                    var b = 0 == this.__listening.length;
                    this.__listening.push(a), b && B(this.__listening)
                }
            }), M
        }(d.utils.css, '<div id="dg-save" class="dg dialogue">\n\n  Here\'s the new load parameter for your <code>GUI</code>\'s constructor:\n\n  <textarea id="dg-new-constructor"></textarea>\n\n  <div id="dg-save-locally">\n\n    <input id="dg-local-storage" type="checkbox"/> Automatically save\n    values to <code>localStorage</code> on exit.\n\n    <div id="dg-local-explain">The values saved to <code>localStorage</code> will\n      override those passed to <code>dat.GUI</code>\'s constructor. This makes it\n      easier to work incrementally, but <code>localStorage</code> is fragile,\n      and your friends may not see the same values you do.\n      \n    </div>\n    \n  </div>\n\n</div>', ".dg ul{list-style:none;margin:0;padding:0;width:100%;clear:both}.dg.ac{position:fixed;top:0;left:0;right:0;height:0;z-index:0}.dg:not(.ac) .main{overflow:hidden}.dg.main{-webkit-transition:opacity 0.1s linear;-o-transition:opacity 0.1s linear;-moz-transition:opacity 0.1s linear;transition:opacity 0.1s linear}.dg.main.taller-than-window{overflow-y:auto}.dg.main.taller-than-window .close-button{opacity:1;margin-top:-1px;border-top:1px solid #2c2c2c}.dg.main ul.closed .close-button{opacity:1 !important}.dg.main:hover .close-button,.dg.main .close-button.drag{opacity:1}.dg.main .close-button{-webkit-transition:opacity 0.1s linear;-o-transition:opacity 0.1s linear;-moz-transition:opacity 0.1s linear;transition:opacity 0.1s linear;border:0;position:absolute;line-height:19px;height:20px;cursor:pointer;text-align:center;background-color:#000}.dg.main .close-button:hover{background-color:#111}.dg.a{float:right;margin-right:15px;overflow-x:hidden}.dg.a.has-save ul{margin-top:27px}.dg.a.has-save ul.closed{margin-top:0}.dg.a .save-row{position:fixed;top:0;z-index:1002}.dg li{-webkit-transition:height 0.1s ease-out;-o-transition:height 0.1s ease-out;-moz-transition:height 0.1s ease-out;transition:height 0.1s ease-out}.dg li:not(.folder){cursor:auto;height:27px;line-height:27px;overflow:hidden;padding:0 4px 0 5px}.dg li.folder{padding:0;border-left:4px solid rgba(0,0,0,0)}.dg li.title{cursor:pointer;margin-left:-4px}.dg .closed li:not(.title),.dg .closed ul li,.dg .closed ul li > *{height:0;overflow:hidden;border:0}.dg .cr{clear:both;padding-left:3px;height:27px}.dg .property-name{cursor:default;float:left;clear:left;width:40%;overflow:hidden;text-overflow:ellipsis}.dg .c{float:left;width:60%}.dg .c input[type=text]{border:0;margin-top:4px;padding:3px;width:100%;float:right}.dg .has-slider input[type=text]{width:30%;margin-left:0}.dg .slider{float:left;width:66%;margin-left:-5px;margin-right:0;height:19px;margin-top:4px}.dg .slider-fg{height:100%}.dg .c input[type=checkbox]{margin-top:9px}.dg .c select{margin-top:5px}.dg .cr.function,.dg .cr.function .property-name,.dg .cr.function *,.dg .cr.boolean,.dg .cr.boolean *{cursor:pointer}.dg .selector{display:none;position:absolute;margin-left:-9px;margin-top:23px;z-index:10}.dg .c:hover .selector,.dg .selector.drag{display:block}.dg li.save-row{padding:0}.dg li.save-row .button{display:inline-block;padding:0px 6px}.dg.dialogue{background-color:#222;width:460px;padding:15px;font-size:13px;line-height:15px}#dg-new-constructor{padding:10px;color:#222;font-family:Monaco, monospace;font-size:10px;border:0;resize:none;box-shadow:inset 1px 1px 1px #888;word-wrap:break-word;margin:12px 0;display:block;width:440px;overflow-y:scroll;height:100px;position:relative}#dg-local-explain{display:none;font-size:11px;line-height:17px;border-radius:3px;background-color:#333;padding:8px;margin-top:10px}#dg-local-explain code{font-size:10px}#dat-gui-save-locally{display:none}.dg{color:#eee;font:11px 'Lucida Grande', sans-serif;text-shadow:0 -1px 0 #111}.dg.main::-webkit-scrollbar{width:5px;background:#1a1a1a}.dg.main::-webkit-scrollbar-corner{height:0;display:none}.dg.main::-webkit-scrollbar-thumb{border-radius:5px;background:#676767}.dg li:not(.folder){background:#1a1a1a;border-bottom:1px solid #2c2c2c}.dg li.save-row{line-height:25px;background:#dad5cb;border:0}.dg li.save-row select{margin-left:5px;width:108px}.dg li.save-row .button{margin-left:5px;margin-top:1px;border-radius:2px;font-size:9px;line-height:7px;padding:4px 4px 5px 4px;background:#c5bdad;color:#fff;text-shadow:0 1px 0 #b0a58f;box-shadow:0 -1px 0 #b0a58f;cursor:pointer}.dg li.save-row .button.gears{background:#c5bdad url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAANCAYAAAB/9ZQ7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAQJJREFUeNpiYKAU/P//PwGIC/ApCABiBSAW+I8AClAcgKxQ4T9hoMAEUrxx2QSGN6+egDX+/vWT4e7N82AMYoPAx/evwWoYoSYbACX2s7KxCxzcsezDh3evFoDEBYTEEqycggWAzA9AuUSQQgeYPa9fPv6/YWm/Acx5IPb7ty/fw+QZblw67vDs8R0YHyQhgObx+yAJkBqmG5dPPDh1aPOGR/eugW0G4vlIoTIfyFcA+QekhhHJhPdQxbiAIguMBTQZrPD7108M6roWYDFQiIAAv6Aow/1bFwXgis+f2LUAynwoIaNcz8XNx3Dl7MEJUDGQpx9gtQ8YCueB+D26OECAAQDadt7e46D42QAAAABJRU5ErkJggg==) 2px 1px no-repeat;height:7px;width:8px}.dg li.save-row .button:hover{background-color:#bab19e;box-shadow:0 -1px 0 #b0a58f}.dg li.folder{border-bottom:0}.dg li.title{padding-left:16px;background:#000 url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlI+hKgFxoCgAOw==) 6px 10px no-repeat;cursor:pointer;border-bottom:1px solid rgba(255,255,255,0.2)}.dg .closed li.title{background-image:url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlGIWqMCbWAEAOw==)}.dg .cr.boolean{border-left:3px solid #806787}.dg .cr.function{border-left:3px solid #e61d5f}.dg .cr.number{border-left:3px solid #2fa1d6}.dg .cr.number input[type=text]{color:#2fa1d6}.dg .cr.string{border-left:3px solid #1ed36f}.dg .cr.string input[type=text]{color:#1ed36f}.dg .cr.function:hover,.dg .cr.boolean:hover{background:#111}.dg .c input[type=text]{background:#303030;outline:none}.dg .c input[type=text]:hover{background:#3c3c3c}.dg .c input[type=text]:focus{background:#494949;color:#fff}.dg .c .slider{background:#303030;cursor:ew-resize}.dg .c .slider-fg{background:#2fa1d6}.dg .c .slider:hover{background:#3c3c3c}.dg .c .slider:hover .slider-fg{background:#44abda}\n", d.controllers.factory = function(a, b, c, d, e, f, g) {
            return function(h, i) {
                var j = h[i];
                return g.isArray(arguments[2]) || g.isObject(arguments[2]) ? new a(h, i, arguments[2]) : g.isNumber(j) ? g.isNumber(arguments[2]) && g.isNumber(arguments[3]) ? new c(h, i, arguments[2], arguments[3]) : new b(h, i, {
                    min: arguments[2],
                    max: arguments[3]
                }) : g.isString(j) ? new d(h, i) : g.isFunction(j) ? new e(h, i, "") : g.isBoolean(j) ? new f(h, i) : void 0
            }
        }(d.controllers.OptionController, d.controllers.NumberControllerBox, d.controllers.NumberControllerSlider, d.controllers.StringController = function(a, b, c) {
            var d = function(a, c) {
                function e() {
                    g.setValue(g.__input.value)
                }
                function f() {
                    g.__onFinishChange && g.__onFinishChange.call(g, g.getValue())
                }
                d.superclass.call(this, a, c);
                var g = this;
                this.__input = document.createElement("input"), this.__input.setAttribute("type", "text"), b.bind(this.__input, "keyup", e), b.bind(this.__input, "change", e), b.bind(this.__input, "blur", f), b.bind(this.__input, "keydown", function(a) {
                    13 === a.keyCode && this.blur()
                }), this.updateDisplay(), this.domElement.appendChild(this.__input)
            };
            return d.superclass = a, c.extend(d.prototype, a.prototype, {
                updateDisplay: function() {
                    return b.isActive(this.__input) || (this.__input.value = this.getValue()), d.superclass.prototype.updateDisplay.call(this)
                }
            }), d
        }(d.controllers.Controller, d.dom.dom, d.utils.common), d.controllers.FunctionController, d.controllers.BooleanController, d.utils.common), d.controllers.Controller, d.controllers.BooleanController, d.controllers.FunctionController, d.controllers.NumberControllerBox, d.controllers.NumberControllerSlider, d.controllers.OptionController, d.controllers.ColorController = function(a, b, c, d, e) {
            function f(a, b, c, d) {
                a.style.background = "", e.each(i, function(e) {
                    a.style.cssText += "background: " + e + "linear-gradient(" + b + ", " + c + " 0%, " + d + " 100%); "
                })
            }
            function g(a) {
                a.style.background = "", a.style.cssText += "background: -moz-linear-gradient(top,  #ff0000 0%, #ff00ff 17%, #0000ff 34%, #00ffff 50%, #00ff00 67%, #ffff00 84%, #ff0000 100%);", a.style.cssText += "background: -webkit-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);", a.style.cssText += "background: -o-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);", a.style.cssText += "background: -ms-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);", a.style.cssText += "background: linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);"
            }
            var h = function(a, i) {
                function j(a) {
                    n(a), b.bind(window, "mousemove", n), b.bind(window, "mouseup", k)
                }
                function k() {
                    b.unbind(window, "mousemove", n), b.unbind(window, "mouseup", k)
                }
                function l() {
                    var a = d(this.value);
                    a!==!1 ? (p.__color.__state = a, p.setValue(p.__color.toOriginal())) : this.value = p.__color.toString()
                }
                function m() {
                    b.unbind(window, "mousemove", o), b.unbind(window, "mouseup", m)
                }
                function n(a) {
                    a.preventDefault();
                    var c = b.getWidth(p.__saturation_field), d = b.getOffset(p.__saturation_field), e = (a.clientX - d.left + document.body.scrollLeft) / c, f = 1 - (a.clientY - d.top + document.body.scrollTop) / c;
                    return f > 1 ? f = 1 : 0 > f && (f = 0), e > 1 ? e = 1 : 0 > e && (e = 0), p.__color.v = f, p.__color.s = e, p.setValue(p.__color.toOriginal()), !1
                }
                function o(a) {
                    a.preventDefault();
                    var c = b.getHeight(p.__hue_field), d = b.getOffset(p.__hue_field), e = 1 - (a.clientY - d.top + document.body.scrollTop) / c;
                    return e > 1 ? e = 1 : 0 > e && (e = 0), p.__color.h = 360 * e, p.setValue(p.__color.toOriginal()), !1
                }
                h.superclass.call(this, a, i), this.__color = new c(this.getValue()), this.__temp = new c(0);
                var p = this;
                this.domElement = document.createElement("div"), b.makeSelectable(this.domElement, !1), this.__selector = document.createElement("div"), this.__selector.className = "selector", this.__saturation_field = document.createElement("div"), this.__saturation_field.className = "saturation-field", this.__field_knob = document.createElement("div"), this.__field_knob.className = "field-knob", this.__field_knob_border = "2px solid ", this.__hue_knob = document.createElement("div"), this.__hue_knob.className = "hue-knob", this.__hue_field = document.createElement("div"), this.__hue_field.className = "hue-field", this.__input = document.createElement("input"), this.__input.type = "text", this.__input_textShadow = "0 1px 1px ", b.bind(this.__input, "keydown", function(a) {
                    13 === a.keyCode && l.call(this)
                }), b.bind(this.__input, "blur", l), b.bind(this.__selector, "mousedown", function(a) {
                    b.addClass(this, "drag").bind(window, "mouseup", function(a) {
                        b.removeClass(p.__selector, "drag")
                    })
                });
                var q = document.createElement("div");
                e.extend(this.__selector.style, {
                    width: "122px",
                    height: "102px",
                    padding: "3px",
                    backgroundColor: "#222",
                    boxShadow: "0px 1px 3px rgba(0,0,0,0.3)"
                }), e.extend(this.__field_knob.style, {
                    position: "absolute",
                    width: "12px",
                    height: "12px",
                    border: this.__field_knob_border + (this.__color.v < .5 ? "#fff" : "#000"),
                    boxShadow: "0px 1px 3px rgba(0,0,0,0.5)",
                    borderRadius: "12px",
                    zIndex: 1
                }), e.extend(this.__hue_knob.style, {
                    position: "absolute",
                    width: "15px",
                    height: "2px",
                    borderRight: "4px solid #fff",
                    zIndex: 1
                }), e.extend(this.__saturation_field.style, {
                    width: "100px",
                    height: "100px",
                    border: "1px solid #555",
                    marginRight: "3px",
                    display: "inline-block",
                    cursor: "pointer"
                }), e.extend(q.style, {
                    width: "100%",
                    height: "100%",
                    background: "none"
                }), f(q, "top", "rgba(0,0,0,0)", "#000"), e.extend(this.__hue_field.style, {
                    width: "15px",
                    height: "100px",
                    display: "inline-block",
                    border: "1px solid #555",
                    cursor: "ns-resize"
                }), g(this.__hue_field), e.extend(this.__input.style, {
                    outline: "none",
                    textAlign: "center",
                    color: "#fff",
                    border: 0,
                    fontWeight: "bold",
                    textShadow: this.__input_textShadow + "rgba(0,0,0,0.7)"
                }), b.bind(this.__saturation_field, "mousedown", j), b.bind(this.__field_knob, "mousedown", j), b.bind(this.__hue_field, "mousedown", function(a) {
                    o(a), b.bind(window, "mousemove", o), b.bind(window, "mouseup", m)
                }), this.__saturation_field.appendChild(q), this.__selector.appendChild(this.__field_knob), this.__selector.appendChild(this.__saturation_field), this.__selector.appendChild(this.__hue_field), this.__hue_field.appendChild(this.__hue_knob), this.domElement.appendChild(this.__input), this.domElement.appendChild(this.__selector), this.updateDisplay()
            };
            h.superclass = a, e.extend(h.prototype, a.prototype, {
                updateDisplay: function() {
                    var a = d(this.getValue());
                    if (a!==!1) {
                        var b=!1;
                        e.each(c.COMPONENTS, function(c) {
                            return e.isUndefined(a[c]) || e.isUndefined(this.__color.__state[c]) || a[c] === this.__color.__state[c] ? void 0 : (b=!0, {})
                        }, this), b && e.extend(this.__color.__state, a)
                    }
                    e.extend(this.__temp.__state, this.__color.__state), this.__temp.a = 1;
                    var g = this.__color.v < .5 || this.__color.s > .5 ? 255: 0, h = 255 - g;
                    e.extend(this.__field_knob.style, {
                        marginLeft: 100 * this.__color.s - 7 + "px",
                        marginTop: 100 * (1 - this.__color.v) - 7 + "px",
                        backgroundColor: this.__temp.toString(),
                        border: this.__field_knob_border + "rgb(" + g + "," + g + "," + g + ")"
                    }), this.__hue_knob.style.marginTop = 100 * (1 - this.__color.h / 360) + "px", this.__temp.s = 1, this.__temp.v = 1, f(this.__saturation_field, "left", "#fff", this.__temp.toString()), e.extend(this.__input.style, {
                        backgroundColor: this.__input.value = this.__color.toString(),
                        color: "rgb(" + g + "," + g + "," + g + ")",
                        textShadow: this.__input_textShadow + "rgba(" + h + "," + h + "," + h + ",.7)"
                    })
                }
            });
            var i = ["-moz-", "-o-", "-webkit-", "-ms-", ""];
            return h
        }(d.controllers.Controller, d.dom.dom, d.color.Color = function(a, b, c, d) {
            function e(a, b, c) {
                Object.defineProperty(a, b, {
                    get: function() {
                        return "RGB" === this.__state.space ? this.__state[b] : (g(this, b, c), this.__state[b])
                    },
                    set: function(a) {
                        "RGB" !== this.__state.space && (g(this, b, c), this.__state.space = "RGB"), this.__state[b] = a
                    }
                })
            }
            function f(a, b) {
                Object.defineProperty(a, b, {
                    get: function() {
                        return "HSV" === this.__state.space ? this.__state[b] : (h(this), this.__state[b])
                    },
                    set: function(a) {
                        "HSV" !== this.__state.space && (h(this), this.__state.space = "HSV"), this.__state[b] = a
                    }
                })
            }
            function g(a, c, e) {
                if ("HEX" === a.__state.space)
                    a.__state[c] = b.component_from_hex(a.__state.hex, e);
                else {
                    if ("HSV" !== a.__state.space)
                        throw "Corrupted color state";
                    d.extend(a.__state, b.hsv_to_rgb(a.__state.h, a.__state.s, a.__state.v))
                }
            }
            function h(a) {
                var c = b.rgb_to_hsv(a.r, a.g, a.b);
                d.extend(a.__state, {
                    s: c.s,
                    v: c.v
                }), d.isNaN(c.h) ? d.isUndefined(a.__state.h) && (a.__state.h = 0) : a.__state.h = c.h
            }
            var i = function() {
                if (this.__state = a.apply(this, arguments), this.__state===!1)
                    throw "Failed to interpret color arguments";
                this.__state.a = this.__state.a || 1
            };
            return i.COMPONENTS = ["r", "g", "b", "h", "s", "v", "hex", "a"], d.extend(i.prototype, {
                toString: function() {
                    return c(this)
                },
                toOriginal: function() {
                    return this.__state.conversion.write(this)
                }
            }), e(i.prototype, "r", 2), e(i.prototype, "g", 1), e(i.prototype, "b", 0), f(i.prototype, "h"), f(i.prototype, "s"), f(i.prototype, "v"), Object.defineProperty(i.prototype, "a", {
                get: function() {
                    return this.__state.a
                },
                set: function(a) {
                    this.__state.a = a
                }
            }), Object.defineProperty(i.prototype, "hex", {
                get: function() {
                    return "HEX"!==!this.__state.space && (this.__state.hex = b.rgb_to_hex(this.r, this.g, this.b)), this.__state.hex
                },
                set: function(a) {
                    this.__state.space = "HEX", this.__state.hex = a
                }
            }), i
        }(d.color.interpret, d.color.math = function() {
            var a;
            return {
                hsv_to_rgb: function(a, b, c) {
                    var d = Math.floor(a / 60)%6, e = a / 60 - Math.floor(a / 60), f = c * (1 - b), g = c * (1 - e * b), h = c * (1 - (1 - e) * b), i = [[c, h, f], [g, c, f], [f, c, h], [f, g, c], [h, f, c], [c, f, g]][d];
                    return {
                        r: 255 * i[0],
                        g: 255 * i[1],
                        b: 255 * i[2]
                    }
                },
                rgb_to_hsv: function(a, b, c) {
                    var d, e, f = Math.min(a, b, c), g = Math.max(a, b, c), h = g - f;
                    return 0 == g ? {
                        h: NaN,
                        s: 0,
                        v: 0
                    } : (e = h / g, d = a == g ? (b - c) / h : b == g ? 2 + (c - a) / h : 4 + (a - b) / h, d/=6, 0 > d && (d += 1), {
                        h: 360 * d,
                        s: e,
                        v: g / 255
                    })
                },
                rgb_to_hex: function(a, b, c) {
                    var d = this.hex_with_component(0, 2, a);
                    return d = this.hex_with_component(d, 1, b), d = this.hex_with_component(d, 0, c)
                },
                component_from_hex: function(a, b) {
                    return a>>8 * b & 255
                },
                hex_with_component: function(b, c, d) {
                    return d<<(a = 8 * c) | b&~(255<<a)
                }
            }
        }(), d.color.toString, d.utils.common), d.color.interpret, d.utils.common), d.utils.requestAnimationFrame = function() {
            return window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(a, b) {
                window.setTimeout(a, 1e3 / 60)
            }
        }(), d.dom.CenteredDiv = function(a, b) {
            var c = function() {
                this.backgroundElement = document.createElement("div"), b.extend(this.backgroundElement.style, {
                    backgroundColor: "rgba(0,0,0,0.8)",
                    top: 0,
                    left: 0,
                    display: "none",
                    zIndex: "1000",
                    opacity: 0,
                    WebkitTransition: "opacity 0.2s linear"
                }), a.makeFullscreen(this.backgroundElement), this.backgroundElement.style.position = "fixed", this.domElement = document.createElement("div"), b.extend(this.domElement.style, {
                    position: "fixed",
                    display: "none",
                    zIndex: "1001",
                    opacity: 0,
                    WebkitTransition: "-webkit-transform 0.2s ease-out, opacity 0.2s linear"
                }), document.body.appendChild(this.backgroundElement), document.body.appendChild(this.domElement);
                var c = this;
                a.bind(this.backgroundElement, "click", function() {
                    c.hide()
                })
            };
            return c.prototype.show = function() {
                var a = this;
                this.backgroundElement.style.display = "block", this.domElement.style.display = "block", this.domElement.style.opacity = 0, this.domElement.style.webkitTransform = "scale(1.1)", this.layout(), b.defer(function() {
                    a.backgroundElement.style.opacity = 1, a.domElement.style.opacity = 1, a.domElement.style.webkitTransform = "scale(1)"
                })
            }, c.prototype.hide = function() {
                var b = this, c = function() {
                    b.domElement.style.display = "none", b.backgroundElement.style.display = "none", a.unbind(b.domElement, "webkitTransitionEnd", c), a.unbind(b.domElement, "transitionend", c), a.unbind(b.domElement, "oTransitionEnd", c)
                };
                a.bind(this.domElement, "webkitTransitionEnd", c), a.bind(this.domElement, "transitionend", c), a.bind(this.domElement, "oTransitionEnd", c), this.backgroundElement.style.opacity = 0, this.domElement.style.opacity = 0, this.domElement.style.webkitTransform = "scale(1.1)"
            }, c.prototype.layout = function() {
                this.domElement.style.left = window.innerWidth / 2 - a.getWidth(this.domElement) / 2 + "px", this.domElement.style.top = window.innerHeight / 2 - a.getHeight(this.domElement) / 2 + "px"
            }, c
        }(d.dom.dom, d.utils.common), d.dom.dom, d.utils.common)
    }, {}
    ],
    99: [function(a, b, c) {
        "use strict";
        b.exports = a("./is-implemented")() ? Object.assign : a("./shim")
    }, {
        "./is-implemented": 100,
        "./shim": 101
    }
    ],
    100: [function(a, b, c) {
        "use strict";
        b.exports = function() {
            var a, b = Object.assign;
            return "function" != typeof b?!1 : (a = {
                foo: "raz"
            }, b(a, {
                bar: "dwa"
            }, {
                trzy: "trzy"
            }), a.foo + a.bar + a.trzy === "razdwatrzy")
        }
    }, {}
    ],
    101: [function(a, b, c) {
        "use strict";
        var d = a("../keys"), e = a("../valid-value"), f = Math.max;
        b.exports = function(a, b) {
            var c, g, h, i = f(arguments.length, 2);
            for (a = Object(e(a)), h = function(d) {
                try {
                    a[d] = b[d]
                } catch (e) {
                    c || (c = e)
                }
            }, g = 1; i > g; ++g)
                b = arguments[g], d(b).forEach(h);
            if (void 0 !== c)
                throw c;
            return a
        }
    }, {
        "../keys": 103,
        "../valid-value": 108
    }
    ],
    102: [function(a, b, c) {
        "use strict";
        b.exports = function(a) {
            return "function" == typeof a
        }
    }, {}
    ],
    103: [function(a, b, c) {
        "use strict";
        b.exports = a("./is-implemented")() ? Object.keys : a("./shim")
    }, {
        "./is-implemented": 104,
        "./shim": 105
    }
    ],
    104: [function(a, b, c) {
        "use strict";
        b.exports = function() {
            try {
                return Object.keys("primitive"), !0
            } catch (a) {
                return !1
            }
        }
    }, {}
    ],
    105: [function(a, b, c) {
        "use strict";
        var d = Object.keys;
        b.exports = function(a) {
            return d(null == a ? a : Object(a))
        }
    }, {}
    ],
    106: [function(a, b, c) {
        "use strict";
        var d = Array.prototype.forEach, e = Object.create, f = function(a, b) {
            var c;
            for (c in a)
                b[c] = a[c]
        };
        b.exports = function(a) {
            var b = e(null);
            return d.call(arguments, function(a) {
                null != a && f(Object(a), b)
            }), b
        }
    }, {}
    ],
    107: [function(a, b, c) {
        "use strict";
        b.exports = function(a) {
            if ("function" != typeof a)
                throw new TypeError(a + " is not a function");
            return a
        }
    }, {}
    ],
    108: [function(a, b, c) {
        "use strict";
        b.exports = function(a) {
            if (null == a)
                throw new TypeError("Cannot use null or undefined");
            return a
        }
    }, {}
    ],
    109: [function(a, b, c) {
        "use strict";
        b.exports = a("./is-implemented")() ? String.prototype.contains : a("./shim")
    }, {
        "./is-implemented": 110,
        "./shim": 111
    }
    ],
    110: [function(a, b, c) {
        "use strict";
        var d = "razdwatrzy";
        b.exports = function() {
            return "function" != typeof d.contains?!1 : d.contains("dwa")===!0 && d.contains("foo")===!1
        }
    }, {}
    ],
    111: [function(a, b, c) {
        "use strict";
        var d = String.prototype.indexOf;
        b.exports = function(a) {
            return d.call(this, a, arguments[1])>-1
        }
    }, {}
    ],
    112: [function(a, b, c) {
        "use strict";
        var d, e, f, g, h, i, j, k = a("d"), l = a("es5-ext/object/valid-callable"), m = Function.prototype.apply, n = Function.prototype.call, o = Object.create, p = Object.defineProperty, q = Object.defineProperties, r = Object.prototype.hasOwnProperty, s = {
            configurable: !0,
            enumerable: !1,
            writable: !0
        };
        d = function(a, b) {
            var c;
            return l(b), r.call(this, "__ee__") ? c = this.__ee__ : (c = s.value = o(null), p(this, "__ee__", s), s.value = null), c[a] ? "object" == typeof c[a] ? c[a].push(b) : c[a] = [c[a], b] : c[a] = b, this
        }, e = function(a, b) {
            var c, e;
            return l(b), e = this, d.call(this, a, c = function() {
                f.call(e, a, c), m.call(b, this, arguments)
            }), c.__eeOnceListener__ = b, this
        }, f = function(a, b) {
            var c, d, e, f;
            if (l(b), !r.call(this, "__ee__"))
                return this;
            if (c = this.__ee__, !c[a])
                return this;
            if (d = c[a], "object" == typeof d)
                for (f = 0; e = d[f]; ++f)
                    e !== b && e.__eeOnceListener__ !== b || (2 === d.length ? c[a] = d[f ? 0: 1] : d.splice(f, 1));
            else 
                d !== b && d.__eeOnceListener__ !== b || delete c[a];
            return this
        }, g = function(a) {
            var b, c, d, e, f;
            if (r.call(this, "__ee__") && (e = this.__ee__[a]))
                if ("object" == typeof e) {
                    for (c = arguments.length, f = new Array(c - 1), b = 1; c > b; ++b)
                        f[b - 1] = arguments[b];
                        for (e = e.slice(), b = 0; d = e[b]; ++b)
                            m.call(d, this, f)
                } else 
                    switch (arguments.length) {
                    case 1:
                        n.call(e, this);
                        break;
                    case 2:
                        n.call(e, this, arguments[1]);
                        break;
                    case 3:
                        n.call(e, this, arguments[1], arguments[2]);
                        break;
                    default:
                        for (c = arguments.length, f = new Array(c - 1), b = 1; c > b; ++b)
                            f[b - 1] = arguments[b];
                            m.call(e, this, f)
                    }
        }, h = {
            on: d,
            once: e,
            off: f,
            emit: g
        }, i = {
            on: k(d),
            once: k(e),
            off: k(f),
            emit: k(g)
        }, j = q({}, i), b.exports = c = function(a) {
            return null == a ? o(j) : q(Object(a), i)
        }, c.methods = h
    }, {
        d: 95,
        "es5-ext/object/valid-callable": 107
    }
    ],
    113: [function(a, b, c) {
        c.glMatrix = a("./gl-matrix/common.js"), c.mat2 = a("./gl-matrix/mat2.js"), c.mat2d = a("./gl-matrix/mat2d.js"), c.mat3 = a("./gl-matrix/mat3.js"), c.mat4 = a("./gl-matrix/mat4.js"), c.quat = a("./gl-matrix/quat.js"), c.vec2 = a("./gl-matrix/vec2.js"), c.vec3 = a("./gl-matrix/vec3.js"), c.vec4 = a("./gl-matrix/vec4.js")
    }, {
        "./gl-matrix/common.js": 114,
        "./gl-matrix/mat2.js": 115,
        "./gl-matrix/mat2d.js": 116,
        "./gl-matrix/mat3.js": 117,
        "./gl-matrix/mat4.js": 118,
        "./gl-matrix/quat.js": 119,
        "./gl-matrix/vec2.js": 120,
        "./gl-matrix/vec3.js": 121,
        "./gl-matrix/vec4.js": 122
    }
    ],
    114: [function(a, b, c) {
        var d = {};
        d.EPSILON = 1e-6, d.ARRAY_TYPE = "undefined" != typeof Float32Array ? Float32Array : Array, d.RANDOM = Math.random, d.setMatrixArrayType = function(a) {
            GLMAT_ARRAY_TYPE = a
        };
        var e = Math.PI / 180;
        d.toRadian = function(a) {
            return a * e
        }, b.exports = d
    }, {}
    ],
    115: [function(a, b, c) {
        var d = a("./common.js"), e = {};
        e.create = function() {
            var a = new d.ARRAY_TYPE(4);
            return a[0] = 1, a[1] = 0, a[2] = 0, a[3] = 1, a
        }, e.clone = function(a) {
            var b = new d.ARRAY_TYPE(4);
            return b[0] = a[0], b[1] = a[1], b[2] = a[2], b[3] = a[3], b
        }, e.copy = function(a, b) {
            return a[0] = b[0], a[1] = b[1], a[2] = b[2], a[3] = b[3], a
        }, e.identity = function(a) {
            return a[0] = 1, a[1] = 0, a[2] = 0, a[3] = 1, a
        }, e.transpose = function(a, b) {
            if (a === b) {
                var c = b[1];
                a[1] = b[2], a[2] = c
            } else 
                a[0] = b[0], a[1] = b[2], a[2] = b[1], a[3] = b[3];
            return a
        }, e.invert = function(a, b) {
            var c = b[0], d = b[1], e = b[2], f = b[3], g = c * f - e * d;
            return g ? (g = 1 / g, a[0] = f * g, a[1] =- d * g, a[2] =- e * g, a[3] = c * g, a) : null
        }, e.adjoint = function(a, b) {
            var c = b[0];
            return a[0] = b[3], a[1] =- b[1], a[2] =- b[2], a[3] = c, a
        }, e.determinant = function(a) {
            return a[0] * a[3] - a[2] * a[1]
        }, e.multiply = function(a, b, c) {
            var d = b[0], e = b[1], f = b[2], g = b[3], h = c[0], i = c[1], j = c[2], k = c[3];
            return a[0] = d * h + f * i, a[1] = e * h + g * i, a[2] = d * j + f * k, a[3] = e * j + g * k, a
        }, e.mul = e.multiply, e.rotate = function(a, b, c) {
            var d = b[0], e = b[1], f = b[2], g = b[3], h = Math.sin(c), i = Math.cos(c);
            return a[0] = d * i + f * h, a[1] = e * i + g * h, a[2] = d*-h + f * i, a[3] = e*-h + g * i, a
        }, e.scale = function(a, b, c) {
            var d = b[0], e = b[1], f = b[2], g = b[3], h = c[0], i = c[1];
            return a[0] = d * h, a[1] = e * h, a[2] = f * i, a[3] = g * i, a
        }, e.fromRotation = function(a, b) {
            var c = Math.sin(b), d = Math.cos(b);
            return a[0] = d, a[1] = c, a[2] =- c, a[3] = d, a
        }, e.fromScaling = function(a, b) {
            return a[0] = b[0], a[1] = 0, a[2] = 0, a[3] = b[1], a
        }, e.str = function(a) {
            return "mat2(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ")"
        }, e.frob = function(a) {
            return Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2))
        }, e.LDU = function(a, b, c, d) {
            return a[2] = d[2] / d[0], c[0] = d[0], c[1] = d[1], c[3] = d[3] - a[2] * c[1], [a, b, c]
        }, b.exports = e
    }, {
        "./common.js": 114
    }
    ],
    116: [function(a, b, c) {
        var d = a("./common.js"), e = {};
        e.create = function() {
            var a = new d.ARRAY_TYPE(6);
            return a[0] = 1, a[1] = 0, a[2] = 0, a[3] = 1, a[4] = 0, a[5] = 0, a
        }, e.clone = function(a) {
            var b = new d.ARRAY_TYPE(6);
            return b[0] = a[0], b[1] = a[1], b[2] = a[2], b[3] = a[3], b[4] = a[4], b[5] = a[5], b
        }, e.copy = function(a, b) {
            return a[0] = b[0], a[1] = b[1], a[2] = b[2], a[3] = b[3], a[4] = b[4], a[5] = b[5], a
        }, e.identity = function(a) {
            return a[0] = 1, a[1] = 0, a[2] = 0, a[3] = 1, a[4] = 0, a[5] = 0, a
        }, e.invert = function(a, b) {
            var c = b[0], d = b[1], e = b[2], f = b[3], g = b[4], h = b[5], i = c * f - d * e;
            return i ? (i = 1 / i, a[0] = f * i, a[1] =- d * i, a[2] =- e * i, a[3] = c * i, a[4] = (e * h - f * g) * i, a[5] = (d * g - c * h) * i, a) : null
        }, e.determinant = function(a) {
            return a[0] * a[3] - a[1] * a[2]
        }, e.multiply = function(a, b, c) {
            var d = b[0], e = b[1], f = b[2], g = b[3], h = b[4], i = b[5], j = c[0], k = c[1], l = c[2], m = c[3], n = c[4], o = c[5];
            return a[0] = d * j + f * k, a[1] = e * j + g * k, a[2] = d * l + f * m, a[3] = e * l + g * m, a[4] = d * n + f * o + h, a[5] = e * n + g * o + i, a
        }, e.mul = e.multiply, e.rotate = function(a, b, c) {
            var d = b[0], e = b[1], f = b[2], g = b[3], h = b[4], i = b[5], j = Math.sin(c), k = Math.cos(c);
            return a[0] = d * k + f * j, a[1] = e * k + g * j, a[2] = d*-j + f * k, a[3] = e*-j + g * k, a[4] = h, a[5] = i, a
        }, e.scale = function(a, b, c) {
            var d = b[0], e = b[1], f = b[2], g = b[3], h = b[4], i = b[5], j = c[0], k = c[1];
            return a[0] = d * j, a[1] = e * j, a[2] = f * k, a[3] = g * k, a[4] = h, a[5] = i, a
        }, e.translate = function(a, b, c) {
            var d = b[0], e = b[1], f = b[2], g = b[3], h = b[4], i = b[5], j = c[0], k = c[1];
            return a[0] = d, a[1] = e, a[2] = f, a[3] = g, a[4] = d * j + f * k + h, a[5] = e * j + g * k + i, a
        }, e.fromRotation = function(a, b) {
            var c = Math.sin(b), d = Math.cos(b);
            return a[0] = d, a[1] = c, a[2] =- c, a[3] = d, a[4] = 0, a[5] = 0, a
        }, e.fromScaling = function(a, b) {
            return a[0] = b[0], a[1] = 0, a[2] = 0, a[3] = b[1], a[4] = 0, a[5] = 0, a
        }, e.fromTranslation = function(a, b) {
            return a[0] = 1, a[1] = 0, a[2] = 0, a[3] = 1, a[4] = b[0], a[5] = b[1], a
        }, e.str = function(a) {
            return "mat2d(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ", " + a[4] + ", " + a[5] + ")"
        }, e.frob = function(a) {
            return Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + 1)
        }, b.exports = e
    }, {
        "./common.js": 114
    }
    ],
    117: [function(a, b, c) {
        var d = a("./common.js"), e = {};
        e.create = function() {
            var a = new d.ARRAY_TYPE(9);
            return a[0] = 1, a[1] = 0, a[2] = 0, a[3] = 0, a[4] = 1, a[5] = 0, a[6] = 0, a[7] = 0, a[8] = 1, a
        }, e.fromMat4 = function(a, b) {
            return a[0] = b[0], a[1] = b[1], a[2] = b[2], a[3] = b[4], a[4] = b[5], a[5] = b[6], a[6] = b[8], a[7] = b[9], a[8] = b[10], a
        }, e.clone = function(a) {
            var b = new d.ARRAY_TYPE(9);
            return b[0] = a[0], b[1] = a[1], b[2] = a[2], b[3] = a[3], b[4] = a[4], b[5] = a[5], b[6] = a[6], b[7] = a[7], b[8] = a[8], b
        }, e.copy = function(a, b) {
            return a[0] = b[0], a[1] = b[1], a[2] = b[2], a[3] = b[3], a[4] = b[4], a[5] = b[5], a[6] = b[6], a[7] = b[7], a[8] = b[8], a
        }, e.identity = function(a) {
            return a[0] = 1, a[1] = 0, a[2] = 0, a[3] = 0, a[4] = 1, a[5] = 0, a[6] = 0, a[7] = 0, a[8] = 1, a
        }, e.transpose = function(a, b) {
            if (a === b) {
                var c = b[1], d = b[2], e = b[5];
                a[1] = b[3], a[2] = b[6], a[3] = c, a[5] = b[7], a[6] = d, a[7] = e
            } else 
                a[0] = b[0], a[1] = b[3], a[2] = b[6], a[3] = b[1], a[4] = b[4], a[5] = b[7], a[6] = b[2], a[7] = b[5], a[8] = b[8];
            return a
        }, e.invert = function(a, b) {
            var c = b[0], d = b[1], e = b[2], f = b[3], g = b[4], h = b[5], i = b[6], j = b[7], k = b[8], l = k * g - h * j, m =- k * f + h * i, n = j * f - g * i, o = c * l + d * m + e * n;
            return o ? (o = 1 / o, a[0] = l * o, a[1] = ( - k * d + e * j) * o, a[2] = (h * d - e * g) * o, a[3] = m * o, a[4] = (k * c - e * i) * o, a[5] = ( - h * c + e * f) * o, a[6] = n * o, a[7] = ( - j * c + d * i) * o, a[8] = (g * c - d * f) * o, a) : null
        }, e.adjoint = function(a, b) {
            var c = b[0], d = b[1], e = b[2], f = b[3], g = b[4], h = b[5], i = b[6], j = b[7], k = b[8];
            return a[0] = g * k - h * j, a[1] = e * j - d * k, a[2] = d * h - e * g, a[3] = h * i - f * k, a[4] = c * k - e * i, a[5] = e * f - c * h, a[6] = f * j - g * i, a[7] = d * i - c * j, a[8] = c * g - d * f, a
        }, e.determinant = function(a) {
            var b = a[0], c = a[1], d = a[2], e = a[3], f = a[4], g = a[5], h = a[6], i = a[7], j = a[8];
            return b * (j * f - g * i) + c * ( - j * e + g * h) + d * (i * e - f * h)
        }, e.multiply = function(a, b, c) {
            var d = b[0], e = b[1], f = b[2], g = b[3], h = b[4], i = b[5], j = b[6], k = b[7], l = b[8], m = c[0], n = c[1], o = c[2], p = c[3], q = c[4], r = c[5], s = c[6], t = c[7], u = c[8];
            return a[0] = m * d + n * g + o * j, a[1] = m * e + n * h + o * k, a[2] = m * f + n * i + o * l, a[3] = p * d + q * g + r * j, a[4] = p * e + q * h + r * k, a[5] = p * f + q * i + r * l, a[6] = s * d + t * g + u * j, a[7] = s * e + t * h + u * k, a[8] = s * f + t * i + u * l, a
        }, e.mul = e.multiply, e.translate = function(a, b, c) {
            var d = b[0], e = b[1], f = b[2], g = b[3], h = b[4], i = b[5], j = b[6], k = b[7], l = b[8], m = c[0], n = c[1];
            return a[0] = d, a[1] = e, a[2] = f, a[3] = g, a[4] = h, a[5] = i, a[6] = m * d + n * g + j, a[7] = m * e + n * h + k, a[8] = m * f + n * i + l, a
        }, e.rotate = function(a, b, c) {
            var d = b[0], e = b[1], f = b[2], g = b[3], h = b[4], i = b[5], j = b[6], k = b[7], l = b[8], m = Math.sin(c), n = Math.cos(c);
            return a[0] = n * d + m * g, a[1] = n * e + m * h, a[2] = n * f + m * i, a[3] = n * g - m * d, a[4] = n * h - m * e, a[5] = n * i - m * f, a[6] = j, a[7] = k, a[8] = l, a
        }, e.scale = function(a, b, c) {
            var d = c[0], e = c[1];
            return a[0] = d * b[0], a[1] = d * b[1], a[2] = d * b[2], a[3] = e * b[3], a[4] = e * b[4], a[5] = e * b[5], a[6] = b[6], a[7] = b[7], a[8] = b[8], a
        }, e.fromTranslation = function(a, b) {
            return a[0] = 1, a[1] = 0, a[2] = 0, a[3] = 0, a[4] = 1, a[5] = 0, a[6] = b[0], a[7] = b[1], a[8] = 1, a
        }, e.fromRotation = function(a, b) {
            var c = Math.sin(b), d = Math.cos(b);
            return a[0] = d, a[1] = c, a[2] = 0, a[3] =- c, a[4] = d, a[5] = 0, a[6] = 0, a[7] = 0, a[8] = 1, a
        }, e.fromScaling = function(a, b) {
            return a[0] = b[0], a[1] = 0, a[2] = 0, a[3] = 0, a[4] = b[1], a[5] = 0, a[6] = 0, a[7] = 0, a[8] = 1, a
        }, e.fromMat2d = function(a, b) {
            return a[0] = b[0], a[1] = b[1], a[2] = 0, a[3] = b[2], a[4] = b[3], a[5] = 0, a[6] = b[4], a[7] = b[5], a[8] = 1, a
        }, e.fromQuat = function(a, b) {
            var c = b[0], d = b[1], e = b[2], f = b[3], g = c + c, h = d + d, i = e + e, j = c * g, k = d * g, l = d * h, m = e * g, n = e * h, o = e * i, p = f * g, q = f * h, r = f * i;
            return a[0] = 1 - l - o, a[3] = k - r, a[6] = m + q, a[1] = k + r, a[4] = 1 - j - o, a[7] = n - p, a[2] = m - q, a[5] = n + p, a[8] = 1 - j - l, a
        }, e.normalFromMat4 = function(a, b) {
            var c = b[0], d = b[1], e = b[2], f = b[3], g = b[4], h = b[5], i = b[6], j = b[7], k = b[8], l = b[9], m = b[10], n = b[11], o = b[12], p = b[13], q = b[14], r = b[15], s = c * h - d * g, t = c * i - e * g, u = c * j - f * g, v = d * i - e * h, w = d * j - f * h, x = e * j - f * i, y = k * p - l * o, z = k * q - m * o, A = k * r - n * o, B = l * q - m * p, C = l * r - n * p, D = m * r - n * q, E = s * D - t * C + u * B + v * A - w * z + x * y;
            return E ? (E = 1 / E, a[0] = (h * D - i * C + j * B) * E, a[1] = (i * A - g * D - j * z) * E, a[2] = (g * C - h * A + j * y) * E, a[3] = (e * C - d * D - f * B) * E, a[4] = (c * D - e * A + f * z) * E, a[5] = (d * A - c * C - f * y) * E, a[6] = (p * x - q * w + r * v) * E, a[7] = (q * u - o * x - r * t) * E, a[8] = (o * w - p * u + r * s) * E, a) : null
        }, e.str = function(a) {
            return "mat3(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ", " + a[4] + ", " + a[5] + ", " + a[6] + ", " + a[7] + ", " + a[8] + ")"
        }, e.frob = function(a) {
            return Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + Math.pow(a[6], 2) + Math.pow(a[7], 2) + Math.pow(a[8], 2))
        }, b.exports = e
    }, {
        "./common.js": 114
    }
    ],
    118: [function(a, b, c) {
        var d = a("./common.js"), e = {};
        e.create = function() {
            var a = new d.ARRAY_TYPE(16);
            return a[0] = 1, a[1] = 0, a[2] = 0, a[3] = 0, a[4] = 0, a[5] = 1, a[6] = 0, a[7] = 0, a[8] = 0, a[9] = 0, a[10] = 1, a[11] = 0, a[12] = 0, a[13] = 0, a[14] = 0, a[15] = 1, a
        }, e.clone = function(a) {
            var b = new d.ARRAY_TYPE(16);
            return b[0] = a[0], b[1] = a[1], b[2] = a[2], b[3] = a[3], b[4] = a[4], b[5] = a[5], b[6] = a[6], b[7] = a[7], b[8] = a[8], b[9] = a[9], b[10] = a[10], b[11] = a[11], b[12] = a[12], b[13] = a[13], b[14] = a[14], b[15] = a[15], b
        }, e.copy = function(a, b) {
            return a[0] = b[0], a[1] = b[1], a[2] = b[2], a[3] = b[3], a[4] = b[4], a[5] = b[5], a[6] = b[6], a[7] = b[7], a[8] = b[8], a[9] = b[9], a[10] = b[10], a[11] = b[11], a[12] = b[12], a[13] = b[13], a[14] = b[14], a[15] = b[15], a
        }, e.identity = function(a) {
            return a[0] = 1, a[1] = 0, a[2] = 0, a[3] = 0, a[4] = 0, a[5] = 1, a[6] = 0, a[7] = 0, a[8] = 0, a[9] = 0, a[10] = 1, a[11] = 0, a[12] = 0, a[13] = 0, a[14] = 0, a[15] = 1, a
        }, e.transpose = function(a, b) {
            if (a === b) {
                var c = b[1], d = b[2], e = b[3], f = b[6], g = b[7], h = b[11];
                a[1] = b[4], a[2] = b[8], a[3] = b[12], a[4] = c, a[6] = b[9], a[7] = b[13], a[8] = d, a[9] = f, a[11] = b[14], a[12] = e, a[13] = g, a[14] = h
            } else 
                a[0] = b[0], a[1] = b[4], a[2] = b[8], a[3] = b[12], a[4] = b[1], a[5] = b[5], a[6] = b[9], a[7] = b[13], a[8] = b[2], a[9] = b[6], a[10] = b[10], a[11] = b[14], a[12] = b[3], a[13] = b[7], a[14] = b[11], a[15] = b[15];
            return a
        }, e.invert = function(a, b) {
            var c = b[0], d = b[1], e = b[2], f = b[3], g = b[4], h = b[5], i = b[6], j = b[7], k = b[8], l = b[9], m = b[10], n = b[11], o = b[12], p = b[13], q = b[14], r = b[15], s = c * h - d * g, t = c * i - e * g, u = c * j - f * g, v = d * i - e * h, w = d * j - f * h, x = e * j - f * i, y = k * p - l * o, z = k * q - m * o, A = k * r - n * o, B = l * q - m * p, C = l * r - n * p, D = m * r - n * q, E = s * D - t * C + u * B + v * A - w * z + x * y;
            return E ? (E = 1 / E, a[0] = (h * D - i * C + j * B) * E, a[1] = (e * C - d * D - f * B) * E, a[2] = (p * x - q * w + r * v) * E, a[3] = (m * w - l * x - n * v) * E, a[4] = (i * A - g * D - j * z) * E, a[5] = (c * D - e * A + f * z) * E, a[6] = (q * u - o * x - r * t) * E, a[7] = (k * x - m * u + n * t) * E, a[8] = (g * C - h * A + j * y) * E, a[9] = (d * A - c * C - f * y) * E, a[10] = (o * w - p * u + r * s) * E, a[11] = (l * u - k * w - n * s) * E, a[12] = (h * z - g * B - i * y) * E, a[13] = (c * B - d * z + e * y) * E, a[14] = (p * t - o * v - q * s) * E, a[15] = (k * v - l * t + m * s) * E, a) : null
        }, e.adjoint = function(a, b) {
            var c = b[0], d = b[1], e = b[2], f = b[3], g = b[4], h = b[5], i = b[6], j = b[7], k = b[8], l = b[9], m = b[10], n = b[11], o = b[12], p = b[13], q = b[14], r = b[15];
            return a[0] = h * (m * r - n * q) - l * (i * r - j * q) + p * (i * n - j * m), a[1] =- (d * (m * r - n * q) - l * (e * r - f * q) + p * (e * n - f * m)), a[2] = d * (i * r - j * q) - h * (e * r - f * q) + p * (e * j - f * i), a[3] =- (d * (i * n - j * m) - h * (e * n - f * m) + l * (e * j - f * i)), a[4] =- (g * (m * r - n * q) - k * (i * r - j * q) + o * (i * n - j * m)), a[5] = c * (m * r - n * q) - k * (e * r - f * q) + o * (e * n - f * m), a[6] =- (c * (i * r - j * q) - g * (e * r - f * q) + o * (e * j - f * i)), a[7] = c * (i * n - j * m) - g * (e * n - f * m) + k * (e * j - f * i), a[8] = g * (l * r - n * p) - k * (h * r - j * p) + o * (h * n - j * l), a[9] =- (c * (l * r - n * p) - k * (d * r - f * p) + o * (d * n - f * l)), a[10] = c * (h * r - j * p) - g * (d * r - f * p) + o * (d * j - f * h), a[11] =- (c * (h * n - j * l) - g * (d * n - f * l) + k * (d * j - f * h)), a[12] =- (g * (l * q - m * p) - k * (h * q - i * p) + o * (h * m - i * l)), a[13] = c * (l * q - m * p) - k * (d * q - e * p) + o * (d * m - e * l), a[14] =- (c * (h * q - i * p) - g * (d * q - e * p) + o * (d * i - e * h)), a[15] = c * (h * m - i * l) - g * (d * m - e * l) + k * (d * i - e * h), a
        }, e.determinant = function(a) {
            var b = a[0], c = a[1], d = a[2], e = a[3], f = a[4], g = a[5], h = a[6], i = a[7], j = a[8], k = a[9], l = a[10], m = a[11], n = a[12], o = a[13], p = a[14], q = a[15], r = b * g - c * f, s = b * h - d * f, t = b * i - e * f, u = c * h - d * g, v = c * i - e * g, w = d * i - e * h, x = j * o - k * n, y = j * p - l * n, z = j * q - m * n, A = k * p - l * o, B = k * q - m * o, C = l * q - m * p;
            return r * C - s * B + t * A + u * z - v * y + w * x
        }, e.multiply = function(a, b, c) {
            var d = b[0], e = b[1], f = b[2], g = b[3], h = b[4], i = b[5], j = b[6], k = b[7], l = b[8], m = b[9], n = b[10], o = b[11], p = b[12], q = b[13], r = b[14], s = b[15], t = c[0], u = c[1], v = c[2], w = c[3];
            return a[0] = t * d + u * h + v * l + w * p, a[1] = t * e + u * i + v * m + w * q, a[2] = t * f + u * j + v * n + w * r, a[3] = t * g + u * k + v * o + w * s, t = c[4], u = c[5], v = c[6], w = c[7], a[4] = t * d + u * h + v * l + w * p, a[5] = t * e + u * i + v * m + w * q, a[6] = t * f + u * j + v * n + w * r, a[7] = t * g + u * k + v * o + w * s, t = c[8], u = c[9], v = c[10], w = c[11], a[8] = t * d + u * h + v * l + w * p, a[9] = t * e + u * i + v * m + w * q, a[10] = t * f + u * j + v * n + w * r, a[11] = t * g + u * k + v * o + w * s, t = c[12], u = c[13], v = c[14], w = c[15], a[12] = t * d + u * h + v * l + w * p, a[13] = t * e + u * i + v * m + w * q, a[14] = t * f + u * j + v * n + w * r, a[15] = t * g + u * k + v * o + w * s, a
        }, e.mul = e.multiply, e.translate = function(a, b, c) {
            var d, e, f, g, h, i, j, k, l, m, n, o, p = c[0], q = c[1], r = c[2];
            return b === a ? (a[12] = b[0] * p + b[4] * q + b[8] * r + b[12], a[13] = b[1] * p + b[5] * q + b[9] * r + b[13], a[14] = b[2] * p + b[6] * q + b[10] * r + b[14], a[15] = b[3] * p + b[7] * q + b[11] * r + b[15]) : (d = b[0], e = b[1], f = b[2], g = b[3], h = b[4], i = b[5], j = b[6], k = b[7], l = b[8], m = b[9], n = b[10], o = b[11], a[0] = d, a[1] = e, a[2] = f, a[3] = g, a[4] = h, a[5] = i, a[6] = j, a[7] = k, a[8] = l, a[9] = m, a[10] = n, a[11] = o, a[12] = d * p + h * q + l * r + b[12], a[13] = e * p + i * q + m * r + b[13], a[14] = f * p + j * q + n * r + b[14], a[15] = g * p + k * q + o * r + b[15]), a
        }, e.scale = function(a, b, c) {
            var d = c[0], e = c[1], f = c[2];
            return a[0] = b[0] * d, a[1] = b[1] * d, a[2] = b[2] * d, a[3] = b[3] * d, a[4] = b[4] * e, a[5] = b[5] * e, a[6] = b[6] * e, a[7] = b[7] * e, a[8] = b[8] * f, a[9] = b[9] * f, a[10] = b[10] * f, a[11] = b[11] * f, a[12] = b[12], a[13] = b[13], a[14] = b[14], a[15] = b[15], a
        }, e.rotate = function(a, b, c, e) {
            var f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z, A, B, C, D = e[0], E = e[1], F = e[2], G = Math.sqrt(D * D + E * E + F * F);
            return Math.abs(G) < d.EPSILON ? null : (G = 1 / G, D*=G, E*=G, F*=G, f = Math.sin(c), g = Math.cos(c), h = 1 - g, i = b[0], j = b[1], k = b[2], l = b[3], m = b[4], n = b[5], o = b[6], p = b[7], q = b[8], r = b[9], s = b[10], t = b[11], u = D * D * h + g, v = E * D * h + F * f, w = F * D * h - E * f, x = D * E * h - F * f, y = E * E * h + g, z = F * E * h + D * f, A = D * F * h + E * f, B = E * F * h - D * f, C = F * F * h + g, a[0] = i * u + m * v + q * w, a[1] = j * u + n * v + r * w, a[2] = k * u + o * v + s * w, a[3] = l * u + p * v + t * w, a[4] = i * x + m * y + q * z, a[5] = j * x + n * y + r * z, a[6] = k * x + o * y + s * z, a[7] = l * x + p * y + t * z, a[8] = i * A + m * B + q * C, a[9] = j * A + n * B + r * C, a[10] = k * A + o * B + s * C, a[11] = l * A + p * B + t * C, b !== a && (a[12] = b[12], a[13] = b[13], a[14] = b[14], a[15] = b[15]), a)
        }, e.rotateX = function(a, b, c) {
            var d = Math.sin(c), e = Math.cos(c), f = b[4], g = b[5], h = b[6], i = b[7], j = b[8], k = b[9], l = b[10], m = b[11];
            return b !== a && (a[0] = b[0], a[1] = b[1], a[2] = b[2], a[3] = b[3], a[12] = b[12], a[13] = b[13], a[14] = b[14], a[15] = b[15]), a[4] = f * e + j * d, a[5] = g * e + k * d, a[6] = h * e + l * d, a[7] = i * e + m * d, a[8] = j * e - f * d, a[9] = k * e - g * d, a[10] = l * e - h * d, a[11] = m * e - i * d, a
        }, e.rotateY = function(a, b, c) {
            var d = Math.sin(c), e = Math.cos(c), f = b[0], g = b[1], h = b[2], i = b[3], j = b[8], k = b[9], l = b[10], m = b[11];
            return b !== a && (a[4] = b[4], a[5] = b[5], a[6] = b[6], a[7] = b[7], a[12] = b[12], a[13] = b[13], a[14] = b[14], a[15] = b[15]), a[0] = f * e - j * d, a[1] = g * e - k * d, a[2] = h * e - l * d, a[3] = i * e - m * d, a[8] = f * d + j * e, a[9] = g * d + k * e, a[10] = h * d + l * e, a[11] = i * d + m * e, a
        }, e.rotateZ = function(a, b, c) {
            var d = Math.sin(c), e = Math.cos(c), f = b[0], g = b[1], h = b[2], i = b[3], j = b[4], k = b[5], l = b[6], m = b[7];
            return b !== a && (a[8] = b[8], a[9] = b[9], a[10] = b[10], a[11] = b[11], a[12] = b[12], a[13] = b[13], a[14] = b[14], a[15] = b[15]), a[0] = f * e + j * d, a[1] = g * e + k * d, a[2] = h * e + l * d, a[3] = i * e + m * d, a[4] = j * e - f * d, a[5] = k * e - g * d, a[6] = l * e - h * d, a[7] = m * e - i * d, a
        }, e.fromTranslation = function(a, b) {
            return a[0] = 1, a[1] = 0, a[2] = 0, a[3] = 0, a[4] = 0, a[5] = 1, a[6] = 0, a[7] = 0, a[8] = 0, a[9] = 0, a[10] = 1, a[11] = 0, a[12] = b[0], a[13] = b[1], a[14] = b[2], a[15] = 1, a
        }, e.fromScaling = function(a, b) {
            return a[0] = b[0], a[1] = 0, a[2] = 0, a[3] = 0, a[4] = 0, a[5] = b[1], a[6] = 0, a[7] = 0, a[8] = 0, a[9] = 0, a[10] = b[2], a[11] = 0, a[12] = 0, a[13] = 0, a[14] = 0, a[15] = 1, a
        }, e.fromRotation = function(a, b, c) {
            var e, f, g, h = c[0], i = c[1], j = c[2], k = Math.sqrt(h * h + i * i + j * j);
            return Math.abs(k) < d.EPSILON ? null : (k = 1 / k, h*=k, i*=k, j*=k, e = Math.sin(b), f = Math.cos(b), g = 1 - f, a[0] = h * h * g + f, a[1] = i * h * g + j * e, a[2] = j * h * g - i * e, a[3] = 0, a[4] = h * i * g - j * e, a[5] = i * i * g + f, a[6] = j * i * g + h * e, a[7] = 0, a[8] = h * j * g + i * e, a[9] = i * j * g - h * e, a[10] = j * j * g + f, a[11] = 0, a[12] = 0, a[13] = 0, a[14] = 0, a[15] = 1, a)
        }, e.fromXRotation = function(a, b) {
            var c = Math.sin(b), d = Math.cos(b);
            return a[0] = 1, a[1] = 0, a[2] = 0, a[3] = 0, a[4] = 0, a[5] = d, a[6] = c, a[7] = 0, a[8] = 0, a[9] =- c, a[10] = d, a[11] = 0, a[12] = 0, a[13] = 0, a[14] = 0, a[15] = 1, a
        }, e.fromYRotation = function(a, b) {
            var c = Math.sin(b), d = Math.cos(b);
            return a[0] = d, a[1] = 0, a[2] =- c, a[3] = 0, a[4] = 0, a[5] = 1, a[6] = 0, a[7] = 0, a[8] = c, a[9] = 0, a[10] = d, a[11] = 0, a[12] = 0, a[13] = 0, a[14] = 0, a[15] = 1, a
        }, e.fromZRotation = function(a, b) {
            var c = Math.sin(b), d = Math.cos(b);
            return a[0] = d, a[1] = c, a[2] = 0, a[3] = 0, a[4] =- c, a[5] = d, a[6] = 0, a[7] = 0, a[8] = 0, a[9] = 0, a[10] = 1, a[11] = 0, a[12] = 0, a[13] = 0, a[14] = 0, a[15] = 1, a
        }, e.fromRotationTranslation = function(a, b, c) {
            var d = b[0], e = b[1], f = b[2], g = b[3], h = d + d, i = e + e, j = f + f, k = d * h, l = d * i, m = d * j, n = e * i, o = e * j, p = f * j, q = g * h, r = g * i, s = g * j;
            return a[0] = 1 - (n + p), a[1] = l + s, a[2] = m - r, a[3] = 0, a[4] = l - s, a[5] = 1 - (k + p), a[6] = o + q, a[7] = 0, a[8] = m + r, a[9] = o - q, a[10] = 1 - (k + n), a[11] = 0, a[12] = c[0], a[13] = c[1], a[14] = c[2], a[15] = 1, a
        }, e.fromRotationTranslationScale = function(a, b, c, d) {
            var e = b[0], f = b[1], g = b[2], h = b[3], i = e + e, j = f + f, k = g + g, l = e * i, m = e * j, n = e * k, o = f * j, p = f * k, q = g * k, r = h * i, s = h * j, t = h * k, u = d[0], v = d[1], w = d[2];
            return a[0] = (1 - (o + q)) * u, a[1] = (m + t) * u, a[2] = (n - s) * u, a[3] = 0, a[4] = (m - t) * v, a[5] = (1 - (l + q)) * v, a[6] = (p + r) * v, a[7] = 0, a[8] = (n + s) * w, a[9] = (p - r) * w, a[10] = (1 - (l + o)) * w, a[11] = 0, a[12] = c[0], a[13] = c[1], a[14] = c[2], a[15] = 1, a
        }, e.fromRotationTranslationScaleOrigin = function(a, b, c, d, e) {
            var f = b[0], g = b[1], h = b[2], i = b[3], j = f + f, k = g + g, l = h + h, m = f * j, n = f * k, o = f * l, p = g * k, q = g * l, r = h * l, s = i * j, t = i * k, u = i * l, v = d[0], w = d[1], x = d[2], y = e[0], z = e[1], A = e[2];
            return a[0] = (1 - (p + r)) * v, a[1] = (n + u) * v, a[2] = (o - t) * v, a[3] = 0, a[4] = (n - u) * w, a[5] = (1 - (m + r)) * w, a[6] = (q + s) * w, a[7] = 0, a[8] = (o + t) * x, a[9] = (q - s) * x, a[10] = (1 - (m + p)) * x, a[11] = 0, a[12] = c[0] + y - (a[0] * y + a[4] * z + a[8] * A), a[13] = c[1] + z - (a[1] * y + a[5] * z + a[9] * A), a[14] = c[2] + A - (a[2] * y + a[6] * z + a[10] * A), a[15] = 1, a
        }, e.fromQuat = function(a, b) {
            var c = b[0], d = b[1], e = b[2], f = b[3], g = c + c, h = d + d, i = e + e, j = c * g, k = d * g, l = d * h, m = e * g, n = e * h, o = e * i, p = f * g, q = f * h, r = f * i;
            return a[0] = 1 - l - o, a[1] = k + r, a[2] = m - q, a[3] = 0, a[4] = k - r, a[5] = 1 - j - o, a[6] = n + p, a[7] = 0, a[8] = m + q, a[9] = n - p, a[10] = 1 - j - l, a[11] = 0, a[12] = 0, a[13] = 0, a[14] = 0, a[15] = 1, a
        }, e.frustum = function(a, b, c, d, e, f, g) {
            var h = 1 / (c - b), i = 1 / (e - d), j = 1 / (f - g);
            return a[0] = 2 * f * h, a[1] = 0, a[2] = 0, a[3] = 0, a[4] = 0, a[5] = 2 * f * i, a[6] = 0, a[7] = 0, a[8] = (c + b) * h, a[9] = (e + d) * i, a[10] = (g + f) * j, a[11] =- 1, a[12] = 0, a[13] = 0, a[14] = g * f * 2 * j, a[15] = 0, a
        }, e.perspective = function(a, b, c, d, e) {
            var f = 1 / Math.tan(b / 2), g = 1 / (d - e);
            return a[0] = f / c, a[1] = 0, a[2] = 0, a[3] = 0, a[4] = 0, a[5] = f, a[6] = 0, a[7] = 0, a[8] = 0, a[9] = 0, a[10] = (e + d) * g, a[11] =- 1, a[12] = 0, a[13] = 0, a[14] = 2 * e * d * g, a[15] = 0, a
        }, e.perspectiveFromFieldOfView = function(a, b, c, d) {
            var e = Math.tan(b.upDegrees * Math.PI / 180), f = Math.tan(b.downDegrees * Math.PI / 180), g = Math.tan(b.leftDegrees * Math.PI / 180), h = Math.tan(b.rightDegrees * Math.PI / 180), i = 2 / (g + h), j = 2 / (e + f);
            return a[0] = i, a[1] = 0, a[2] = 0, a[3] = 0, a[4] = 0, a[5] = j, a[6] = 0, a[7] = 0, a[8] =- ((g - h) * i * .5), a[9] = (e - f) * j * .5, a[10] = d / (c - d), a[11] =- 1, a[12] = 0, a[13] = 0, a[14] = d * c / (c - d), a[15] = 0, a
        }, e.ortho = function(a, b, c, d, e, f, g) {
            var h = 1 / (b - c), i = 1 / (d - e), j = 1 / (f - g);
            return a[0] =- 2 * h, a[1] = 0, a[2] = 0, a[3] = 0, a[4] = 0, a[5] =- 2 * i, a[6] = 0, a[7] = 0, a[8] = 0, a[9] = 0, a[10] = 2 * j, a[11] = 0, a[12] = (b + c) * h, a[13] = (e + d) * i, a[14] = (g + f) * j, a[15] = 1, a
        }, e.lookAt = function(a, b, c, f) {
            var g, h, i, j, k, l, m, n, o, p, q = b[0], r = b[1], s = b[2], t = f[0], u = f[1], v = f[2], w = c[0], x = c[1], y = c[2];
            return Math.abs(q - w) < d.EPSILON && Math.abs(r - x) < d.EPSILON && Math.abs(s - y) < d.EPSILON ? e.identity(a) : (m = q - w, n = r - x, o = s - y, p = 1 / Math.sqrt(m * m + n * n + o * o), m*=p, n*=p, o*=p, g = u * o - v * n, h = v * m - t * o, i = t * n - u * m, p = Math.sqrt(g * g + h * h + i * i), p ? (p = 1 / p, g*=p, h*=p, i*=p) : (g = 0, h = 0, i = 0), j = n * i - o * h, k = o * g - m * i, l = m * h - n * g, p = Math.sqrt(j * j + k * k + l * l), p ? (p = 1 / p, j*=p, k*=p, l*=p) : (j = 0, k = 0, l = 0), a[0] = g, a[1] = j, a[2] = m, a[3] = 0, a[4] = h, a[5] = k, a[6] = n, a[7] = 0, a[8] = i, a[9] = l, a[10] = o, a[11] = 0, a[12] =- (g * q + h * r + i * s), a[13] =- (j * q + k * r + l * s), a[14] =- (m * q + n * r + o * s), a[15] = 1, a)
        }, e.str = function(a) {
            return "mat4(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ", " + a[4] + ", " + a[5] + ", " + a[6] + ", " + a[7] + ", " + a[8] + ", " + a[9] + ", " + a[10] + ", " + a[11] + ", " + a[12] + ", " + a[13] + ", " + a[14] + ", " + a[15] + ")"
        }, e.frob = function(a) {
            return Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + Math.pow(a[6], 2) + Math.pow(a[7], 2) + Math.pow(a[8], 2) + Math.pow(a[9], 2) + Math.pow(a[10], 2) + Math.pow(a[11], 2) + Math.pow(a[12], 2) + Math.pow(a[13], 2) + Math.pow(a[14], 2) + Math.pow(a[15], 2))
        }, b.exports = e
    }, {
        "./common.js": 114
    }
    ],
    119: [function(a, b, c) {
        var d = a("./common.js"), e = a("./mat3.js"), f = a("./vec3.js"), g = a("./vec4.js"), h = {};
        h.create = function() {
            var a = new d.ARRAY_TYPE(4);
            return a[0] = 0, a[1] = 0, a[2] = 0, a[3] = 1, a
        }, h.rotationTo = function() {
            var a = f.create(), b = f.fromValues(1, 0, 0), c = f.fromValues(0, 1, 0);
            return function(d, e, g) {
                var i = f.dot(e, g);
                return - .999999 > i ? (f.cross(a, b, e), f.length(a) < 1e-6 && f.cross(a, c, e), f.normalize(a, a), h.setAxisAngle(d, a, Math.PI), d) : i > .999999 ? (d[0] = 0, d[1] = 0, d[2] = 0, d[3] = 1, d) : (f.cross(a, e, g), d[0] = a[0], d[1] = a[1], d[2] = a[2], d[3] = 1 + i, h.normalize(d, d))
            }
        }(), h.setAxes = function() {
            var a = e.create();
            return function(b, c, d, e) {
                return a[0] = d[0], a[3] = d[1], a[6] = d[2], a[1] = e[0], a[4] = e[1], a[7] = e[2], a[2] =- c[0], a[5] =- c[1], a[8] =- c[2], h.normalize(b, h.fromMat3(b, a))
            }
        }(), h.clone = g.clone, h.fromValues = g.fromValues, h.copy = g.copy, h.set = g.set, h.identity = function(a) {
            return a[0] = 0, a[1] = 0, a[2] = 0, a[3] = 1, a
        }, h.setAxisAngle = function(a, b, c) {
            c = .5 * c;
            var d = Math.sin(c);
            return a[0] = d * b[0], a[1] = d * b[1], a[2] = d * b[2], a[3] = Math.cos(c), a
        }, h.add = g.add, h.multiply = function(a, b, c) {
            var d = b[0], e = b[1], f = b[2], g = b[3], h = c[0], i = c[1], j = c[2], k = c[3];
            return a[0] = d * k + g * h + e * j - f * i, a[1] = e * k + g * i + f * h - d * j, a[2] = f * k + g * j + d * i - e * h, a[3] = g * k - d * h - e * i - f * j, a
        }, h.mul = h.multiply, h.scale = g.scale, h.rotateX = function(a, b, c) {
            c*=.5;
            var d = b[0], e = b[1], f = b[2], g = b[3], h = Math.sin(c), i = Math.cos(c);
            return a[0] = d * i + g * h, a[1] = e * i + f * h, a[2] = f * i - e * h, a[3] = g * i - d * h, a
        }, h.rotateY = function(a, b, c) {
            c*=.5;
            var d = b[0], e = b[1], f = b[2], g = b[3], h = Math.sin(c), i = Math.cos(c);
            return a[0] = d * i - f * h, a[1] = e * i + g * h, a[2] = f * i + d * h, a[3] = g * i - e * h, a
        }, h.rotateZ = function(a, b, c) {
            c*=.5;
            var d = b[0], e = b[1], f = b[2], g = b[3], h = Math.sin(c), i = Math.cos(c);
            return a[0] = d * i + e * h, a[1] = e * i - d * h, a[2] = f * i + g * h, a[3] = g * i - f * h, a
        }, h.calculateW = function(a, b) {
            var c = b[0], d = b[1], e = b[2];
            return a[0] = c, a[1] = d, a[2] = e, a[3] = Math.sqrt(Math.abs(1 - c * c - d * d - e * e)), a
        }, h.dot = g.dot, h.lerp = g.lerp, h.slerp = function(a, b, c, d) {
            var e, f, g, h, i, j = b[0], k = b[1], l = b[2], m = b[3], n = c[0], o = c[1], p = c[2], q = c[3];
            return f = j * n + k * o + l * p + m * q, 0 > f && (f =- f, n =- n, o =- o, p =- p, q =- q), 1 - f > 1e-6 ? (e = Math.acos(f), g = Math.sin(e), h = Math.sin((1 - d) * e) / g, i = Math.sin(d * e) / g) : (h = 1 - d, i = d), a[0] = h * j + i * n, a[1] = h * k + i * o, a[2] = h * l + i * p, a[3] = h * m + i * q, a
        }, h.sqlerp = function() {
            var a = h.create(), b = h.create();
            return function(c, d, e, f, g, i) {
                return h.slerp(a, d, g, i), h.slerp(b, e, f, i), h.slerp(c, a, b, 2 * i * (1 - i)), c
            }
        }(), h.invert = function(a, b) {
            var c = b[0], d = b[1], e = b[2], f = b[3], g = c * c + d * d + e * e + f * f, h = g ? 1 / g: 0;
            return a[0] =- c * h, a[1] =- d * h, a[2] =- e * h, a[3] = f * h, a
        }, h.conjugate = function(a, b) {
            return a[0] =- b[0], a[1] =- b[1], a[2] =- b[2], a[3] = b[3], a
        }, h.length = g.length, h.len = h.length, h.squaredLength = g.squaredLength, h.sqrLen = h.squaredLength, h.normalize = g.normalize, h.fromMat3 = function(a, b) {
            var c, d = b[0] + b[4] + b[8];
            if (d > 0)
                c = Math.sqrt(d + 1), a[3] = .5 * c, c = .5 / c, a[0] = (b[5] - b[7]) * c, a[1] = (b[6] - b[2]) * c, a[2] = (b[1] - b[3]) * c;
            else {
                var e = 0;
                b[4] > b[0] && (e = 1), b[8] > b[3 * e + e] && (e = 2);
                var f = (e + 1)%3, g = (e + 2)%3;
                c = Math.sqrt(b[3 * e + e] - b[3 * f + f] - b[3 * g + g] + 1), a[e] = .5 * c, c = .5 / c, a[3] = (b[3 * f + g] - b[3 * g + f]) * c, a[f] = (b[3 * f + e] + b[3 * e + f]) * c, a[g] = (b[3 * g + e] + b[3 * e + g]) * c
            }
            return a
        }, h.str = function(a) {
            return "quat(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ")"
        }, b.exports = h
    }, {
        "./common.js": 114,
        "./mat3.js": 117,
        "./vec3.js": 121,
        "./vec4.js": 122
    }
    ],
    120: [function(a, b, c) {
        var d = a("./common.js"), e = {};
        e.create = function() {
            var a = new d.ARRAY_TYPE(2);
            return a[0] = 0, a[1] = 0, a
        }, e.clone = function(a) {
            var b = new d.ARRAY_TYPE(2);
            return b[0] = a[0], b[1] = a[1], b
        }, e.fromValues = function(a, b) {
            var c = new d.ARRAY_TYPE(2);
            return c[0] = a, c[1] = b, c
        }, e.copy = function(a, b) {
            return a[0] = b[0], a[1] = b[1], a
        }, e.set = function(a, b, c) {
            return a[0] = b, a[1] = c, a
        }, e.add = function(a, b, c) {
            return a[0] = b[0] + c[0], a[1] = b[1] + c[1], a
        }, e.subtract = function(a, b, c) {
            return a[0] = b[0] - c[0], a[1] = b[1] - c[1], a
        }, e.sub = e.subtract, e.multiply = function(a, b, c) {
            return a[0] = b[0] * c[0], a[1] = b[1] * c[1], a
        }, e.mul = e.multiply, e.divide = function(a, b, c) {
            return a[0] = b[0] / c[0], a[1] = b[1] / c[1], a
        }, e.div = e.divide, e.min = function(a, b, c) {
            return a[0] = Math.min(b[0], c[0]), a[1] = Math.min(b[1], c[1]), a
        }, e.max = function(a, b, c) {
            return a[0] = Math.max(b[0], c[0]), a[1] = Math.max(b[1], c[1]), a
        }, e.scale = function(a, b, c) {
            return a[0] = b[0] * c, a[1] = b[1] * c, a
        }, e.scaleAndAdd = function(a, b, c, d) {
            return a[0] = b[0] + c[0] * d, a[1] = b[1] + c[1] * d, a
        }, e.distance = function(a, b) {
            var c = b[0] - a[0], d = b[1] - a[1];
            return Math.sqrt(c * c + d * d)
        }, e.dist = e.distance, e.squaredDistance = function(a, b) {
            var c = b[0] - a[0], d = b[1] - a[1];
            return c * c + d * d
        }, e.sqrDist = e.squaredDistance, e.length = function(a) {
            var b = a[0], c = a[1];
            return Math.sqrt(b * b + c * c)
        }, e.len = e.length, e.squaredLength = function(a) {
            var b = a[0], c = a[1];
            return b * b + c * c
        }, e.sqrLen = e.squaredLength, e.negate = function(a, b) {
            return a[0] =- b[0], a[1] =- b[1], a
        }, e.inverse = function(a, b) {
            return a[0] = 1 / b[0], a[1] = 1 / b[1], a
        }, e.normalize = function(a, b) {
            var c = b[0], d = b[1], e = c * c + d * d;
            return e > 0 && (e = 1 / Math.sqrt(e), a[0] = b[0] * e, a[1] = b[1] * e), a
        }, e.dot = function(a, b) {
            return a[0] * b[0] + a[1] * b[1]
        }, e.cross = function(a, b, c) {
            var d = b[0] * c[1] - b[1] * c[0];
            return a[0] = a[1] = 0, a[2] = d, a
        }, e.lerp = function(a, b, c, d) {
            var e = b[0], f = b[1];
            return a[0] = e + d * (c[0] - e), a[1] = f + d * (c[1] - f), a
        }, e.random = function(a, b) {
            b = b || 1;
            var c = 2 * d.RANDOM() * Math.PI;
            return a[0] = Math.cos(c) * b, a[1] = Math.sin(c) * b, a
        }, e.transformMat2 = function(a, b, c) {
            var d = b[0], e = b[1];
            return a[0] = c[0] * d + c[2] * e, a[1] = c[1] * d + c[3] * e, a
        }, e.transformMat2d = function(a, b, c) {
            var d = b[0], e = b[1];
            return a[0] = c[0] * d + c[2] * e + c[4], a[1] = c[1] * d + c[3] * e + c[5], a
        }, e.transformMat3 = function(a, b, c) {
            var d = b[0], e = b[1];
            return a[0] = c[0] * d + c[3] * e + c[6], a[1] = c[1] * d + c[4] * e + c[7], a
        }, e.transformMat4 = function(a, b, c) {
            var d = b[0], e = b[1];
            return a[0] = c[0] * d + c[4] * e + c[12], a[1] = c[1] * d + c[5] * e + c[13], a
        }, e.forEach = function() {
            var a = e.create();
            return function(b, c, d, e, f, g) {
                var h, i;
                for (c || (c = 2), d || (d = 0), i = e ? Math.min(e * c + d, b.length) : b.length, h = d; i > h; h += c)
                    a[0] = b[h], a[1] = b[h + 1], f(a, a, g), b[h] = a[0], b[h + 1] = a[1];
                return b
            }
        }(), e.str = function(a) {
            return "vec2(" + a[0] + ", " + a[1] + ")"
        }, b.exports = e
    }, {
        "./common.js": 114
    }
    ],
    121: [function(a, b, c) {
        var d = a("./common.js"), e = {};
        e.create = function() {
            var a = new d.ARRAY_TYPE(3);
            return a[0] = 0, a[1] = 0, a[2] = 0, a
        }, e.clone = function(a) {
            var b = new d.ARRAY_TYPE(3);
            return b[0] = a[0], b[1] = a[1], b[2] = a[2], b
        }, e.fromValues = function(a, b, c) {
            var e = new d.ARRAY_TYPE(3);
            return e[0] = a, e[1] = b, e[2] = c, e
        }, e.copy = function(a, b) {
            return a[0] = b[0], a[1] = b[1], a[2] = b[2], a
        }, e.set = function(a, b, c, d) {
            return a[0] = b, a[1] = c, a[2] = d, a
        }, e.add = function(a, b, c) {
            return a[0] = b[0] + c[0], a[1] = b[1] + c[1], a[2] = b[2] + c[2], a
        }, e.subtract = function(a, b, c) {
            return a[0] = b[0] - c[0], a[1] = b[1] - c[1], a[2] = b[2] - c[2], a
        }, e.sub = e.subtract, e.multiply = function(a, b, c) {
            return a[0] = b[0] * c[0], a[1] = b[1] * c[1], a[2] = b[2] * c[2], a
        }, e.mul = e.multiply, e.divide = function(a, b, c) {
            return a[0] = b[0] / c[0], a[1] = b[1] / c[1], a[2] = b[2] / c[2], a
        }, e.div = e.divide, e.min = function(a, b, c) {
            return a[0] = Math.min(b[0], c[0]), a[1] = Math.min(b[1], c[1]), a[2] = Math.min(b[2], c[2]), a
        }, e.max = function(a, b, c) {
            return a[0] = Math.max(b[0], c[0]), a[1] = Math.max(b[1], c[1]), a[2] = Math.max(b[2], c[2]), a
        }, e.scale = function(a, b, c) {
            return a[0] = b[0] * c, a[1] = b[1] * c, a[2] = b[2] * c, a
        }, e.scaleAndAdd = function(a, b, c, d) {
            return a[0] = b[0] + c[0] * d, a[1] = b[1] + c[1] * d, a[2] = b[2] + c[2] * d, a
        }, e.distance = function(a, b) {
            var c = b[0] - a[0], d = b[1] - a[1], e = b[2] - a[2];
            return Math.sqrt(c * c + d * d + e * e)
        }, e.dist = e.distance, e.squaredDistance = function(a, b) {
            var c = b[0] - a[0], d = b[1] - a[1], e = b[2] - a[2];
            return c * c + d * d + e * e
        }, e.sqrDist = e.squaredDistance, e.length = function(a) {
            var b = a[0], c = a[1], d = a[2];
            return Math.sqrt(b * b + c * c + d * d)
        }, e.len = e.length, e.squaredLength = function(a) {
            var b = a[0], c = a[1], d = a[2];
            return b * b + c * c + d * d
        }, e.sqrLen = e.squaredLength, e.negate = function(a, b) {
            return a[0] =- b[0], a[1] =- b[1], a[2] =- b[2], a
        }, e.inverse = function(a, b) {
            return a[0] = 1 / b[0], a[1] = 1 / b[1], a[2] = 1 / b[2], a
        }, e.normalize = function(a, b) {
            var c = b[0], d = b[1], e = b[2], f = c * c + d * d + e * e;
            return f > 0 && (f = 1 / Math.sqrt(f), a[0] = b[0] * f, a[1] = b[1] * f, a[2] = b[2] * f), a
        }, e.dot = function(a, b) {
            return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
        }, e.cross = function(a, b, c) {
            var d = b[0], e = b[1], f = b[2], g = c[0], h = c[1], i = c[2];
            return a[0] = e * i - f * h, a[1] = f * g - d * i, a[2] = d * h - e * g, a
        }, e.lerp = function(a, b, c, d) {
            var e = b[0], f = b[1], g = b[2];
            return a[0] = e + d * (c[0] - e), a[1] = f + d * (c[1] - f), a[2] = g + d * (c[2] - g), a
        }, e.hermite = function(a, b, c, d, e, f) {
            var g = f * f, h = g * (2 * f - 3) + 1, i = g * (f - 2) + f, j = g * (f - 1), k = g * (3 - 2 * f);
            return a[0] = b[0] * h + c[0] * i + d[0] * j + e[0] * k, a[1] = b[1] * h + c[1] * i + d[1] * j + e[1] * k, a[2] = b[2] * h + c[2] * i + d[2] * j + e[2] * k, a
        }, e.bezier = function(a, b, c, d, e, f) {
            var g = 1 - f, h = g * g, i = f * f, j = h * g, k = 3 * f * h, l = 3 * i * g, m = i * f;
            return a[0] = b[0] * j + c[0] * k + d[0] * l + e[0] * m, a[1] = b[1] * j + c[1] * k + d[1] * l + e[1] * m, a[2] = b[2] * j + c[2] * k + d[2] * l + e[2] * m, a
        }, e.random = function(a, b) {
            b = b || 1;
            var c = 2 * d.RANDOM() * Math.PI, e = 2 * d.RANDOM() - 1, f = Math.sqrt(1 - e * e) * b;
            return a[0] = Math.cos(c) * f, a[1] = Math.sin(c) * f, a[2] = e * b, a
        }, e.transformMat4 = function(a, b, c) {
            var d = b[0], e = b[1], f = b[2], g = c[3] * d + c[7] * e + c[11] * f + c[15];
            return g = g || 1, a[0] = (c[0] * d + c[4] * e + c[8] * f + c[12]) / g, a[1] = (c[1] * d + c[5] * e + c[9] * f + c[13]) / g, a[2] = (c[2] * d + c[6] * e + c[10] * f + c[14]) / g, a
        }, e.transformMat3 = function(a, b, c) {
            var d = b[0], e = b[1], f = b[2];
            return a[0] = d * c[0] + e * c[3] + f * c[6], a[1] = d * c[1] + e * c[4] + f * c[7], a[2] = d * c[2] + e * c[5] + f * c[8], a
        }, e.transformQuat = function(a, b, c) {
            var d = b[0], e = b[1], f = b[2], g = c[0], h = c[1], i = c[2], j = c[3], k = j * d + h * f - i * e, l = j * e + i * d - g * f, m = j * f + g * e - h * d, n =- g * d - h * e - i * f;
            return a[0] = k * j + n*-g + l*-i - m*-h, a[1] = l * j + n*-h + m*-g - k*-i, a[2] = m * j + n*-i + k*-h - l*-g, a
        }, e.rotateX = function(a, b, c, d) {
            var e = [], f = [];
            return e[0] = b[0] - c[0], e[1] = b[1] - c[1], e[2] = b[2] - c[2], f[0] = e[0], f[1] = e[1] * Math.cos(d) - e[2] * Math.sin(d), f[2] = e[1] * Math.sin(d) + e[2] * Math.cos(d), a[0] = f[0] + c[0], a[1] = f[1] + c[1], a[2] = f[2] + c[2], a
        }, e.rotateY = function(a, b, c, d) {
            var e = [], f = [];
            return e[0] = b[0] - c[0], e[1] = b[1] - c[1], e[2] = b[2] - c[2], f[0] = e[2] * Math.sin(d) + e[0] * Math.cos(d), f[1] = e[1], f[2] = e[2] * Math.cos(d) - e[0] * Math.sin(d), a[0] = f[0] + c[0], a[1] = f[1] + c[1], a[2] = f[2] + c[2], a
        }, e.rotateZ = function(a, b, c, d) {
            var e = [], f = [];
            return e[0] = b[0] - c[0], e[1] = b[1] - c[1], e[2] = b[2] - c[2], f[0] = e[0] * Math.cos(d) - e[1] * Math.sin(d), f[1] = e[0] * Math.sin(d) + e[1] * Math.cos(d), f[2] = e[2], a[0] = f[0] + c[0], a[1] = f[1] + c[1], a[2] = f[2] + c[2], a
        }, e.forEach = function() {
            var a = e.create();
            return function(b, c, d, e, f, g) {
                var h, i;
                for (c || (c = 3), d || (d = 0), i = e ? Math.min(e * c + d, b.length) : b.length, h = d; i > h; h += c)
                    a[0] = b[h], a[1] = b[h + 1], a[2] = b[h + 2], f(a, a, g), b[h] = a[0], b[h + 1] = a[1], b[h + 2] = a[2];
                return b
            }
        }(), e.angle = function(a, b) {
            var c = e.fromValues(a[0], a[1], a[2]), d = e.fromValues(b[0], b[1], b[2]);
            e.normalize(c, c), e.normalize(d, d);
            var f = e.dot(c, d);
            return f > 1 ? 0 : Math.acos(f)
        }, e.str = function(a) {
            return "vec3(" + a[0] + ", " + a[1] + ", " + a[2] + ")"
        }, b.exports = e
    }, {
        "./common.js": 114
    }
    ],
    122: [function(a, b, c) {
        var d = a("./common.js"), e = {};
        e.create = function() {
            var a = new d.ARRAY_TYPE(4);
            return a[0] = 0, a[1] = 0, a[2] = 0, a[3] = 0, a
        }, e.clone = function(a) {
            var b = new d.ARRAY_TYPE(4);
            return b[0] = a[0], b[1] = a[1], b[2] = a[2], b[3] = a[3], b
        }, e.fromValues = function(a, b, c, e) {
            var f = new d.ARRAY_TYPE(4);
            return f[0] = a, f[1] = b, f[2] = c, f[3] = e, f
        }, e.copy = function(a, b) {
            return a[0] = b[0], a[1] = b[1], a[2] = b[2], a[3] = b[3], a
        }, e.set = function(a, b, c, d, e) {
            return a[0] = b, a[1] = c, a[2] = d, a[3] = e, a
        }, e.add = function(a, b, c) {
            return a[0] = b[0] + c[0], a[1] = b[1] + c[1], a[2] = b[2] + c[2], a[3] = b[3] + c[3], a
        }, e.subtract = function(a, b, c) {
            return a[0] = b[0] - c[0], a[1] = b[1] - c[1], a[2] = b[2] - c[2], a[3] = b[3] - c[3], a
        }, e.sub = e.subtract, e.multiply = function(a, b, c) {
            return a[0] = b[0] * c[0], a[1] = b[1] * c[1], a[2] = b[2] * c[2], a[3] = b[3] * c[3], a
        }, e.mul = e.multiply, e.divide = function(a, b, c) {
            return a[0] = b[0] / c[0], a[1] = b[1] / c[1], a[2] = b[2] / c[2], a[3] = b[3] / c[3], a
        }, e.div = e.divide, e.min = function(a, b, c) {
            return a[0] = Math.min(b[0], c[0]), a[1] = Math.min(b[1], c[1]), a[2] = Math.min(b[2], c[2]), a[3] = Math.min(b[3], c[3]), a
        }, e.max = function(a, b, c) {
            return a[0] = Math.max(b[0], c[0]), a[1] = Math.max(b[1], c[1]), a[2] = Math.max(b[2], c[2]), a[3] = Math.max(b[3], c[3]), a
        }, e.scale = function(a, b, c) {
            return a[0] = b[0] * c, a[1] = b[1] * c, a[2] = b[2] * c, a[3] = b[3] * c, a
        }, e.scaleAndAdd = function(a, b, c, d) {
            return a[0] = b[0] + c[0] * d, a[1] = b[1] + c[1] * d, a[2] = b[2] + c[2] * d, a[3] = b[3] + c[3] * d, a
        }, e.distance = function(a, b) {
            var c = b[0] - a[0], d = b[1] - a[1], e = b[2] - a[2], f = b[3] - a[3];
            return Math.sqrt(c * c + d * d + e * e + f * f)
        }, e.dist = e.distance, e.squaredDistance = function(a, b) {
            var c = b[0] - a[0], d = b[1] - a[1], e = b[2] - a[2], f = b[3] - a[3];
            return c * c + d * d + e * e + f * f
        }, e.sqrDist = e.squaredDistance, e.length = function(a) {
            var b = a[0], c = a[1], d = a[2], e = a[3];
            return Math.sqrt(b * b + c * c + d * d + e * e)
        }, e.len = e.length, e.squaredLength = function(a) {
            var b = a[0], c = a[1], d = a[2], e = a[3];
            return b * b + c * c + d * d + e * e
        }, e.sqrLen = e.squaredLength, e.negate = function(a, b) {
            return a[0] =- b[0], a[1] =- b[1], a[2] =- b[2], a[3] =- b[3], a
        }, e.inverse = function(a, b) {
            return a[0] = 1 / b[0], a[1] = 1 / b[1], a[2] = 1 / b[2], a[3] = 1 / b[3], a
        }, e.normalize = function(a, b) {
            var c = b[0], d = b[1], e = b[2], f = b[3], g = c * c + d * d + e * e + f * f;
            return g > 0 && (g = 1 / Math.sqrt(g), a[0] = c * g, a[1] = d * g, a[2] = e * g, a[3] = f * g), a
        }, e.dot = function(a, b) {
            return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3]
        }, e.lerp = function(a, b, c, d) {
            var e = b[0], f = b[1], g = b[2], h = b[3];
            return a[0] = e + d * (c[0] - e), a[1] = f + d * (c[1] - f), a[2] = g + d * (c[2] - g), a[3] = h + d * (c[3] - h), a
        }, e.random = function(a, b) {
            return b = b || 1, a[0] = d.RANDOM(), a[1] = d.RANDOM(), a[2] = d.RANDOM(), a[3] = d.RANDOM(), e.normalize(a, a), e.scale(a, a, b), a
        }, e.transformMat4 = function(a, b, c) {
            var d = b[0], e = b[1], f = b[2], g = b[3];
            return a[0] = c[0] * d + c[4] * e + c[8] * f + c[12] * g, a[1] = c[1] * d + c[5] * e + c[9] * f + c[13] * g, a[2] = c[2] * d + c[6] * e + c[10] * f + c[14] * g, a[3] = c[3] * d + c[7] * e + c[11] * f + c[15] * g, a
        }, e.transformQuat = function(a, b, c) {
            var d = b[0], e = b[1], f = b[2], g = c[0], h = c[1], i = c[2], j = c[3], k = j * d + h * f - i * e, l = j * e + i * d - g * f, m = j * f + g * e - h * d, n =- g * d - h * e - i * f;
            return a[0] = k * j + n*-g + l*-i - m*-h, a[1] = l * j + n*-h + m*-g - k*-i, a[2] = m * j + n*-i + k*-h - l*-g, a[3] = b[3], a
        }, e.forEach = function() {
            var a = e.create();
            return function(b, c, d, e, f, g) {
                var h, i;
                for (c || (c = 4), d || (d = 0), i = e ? Math.min(e * c + d, b.length) : b.length, h = d; i > h; h += c)
                    a[0] = b[h], a[1] = b[h + 1], a[2] = b[h + 2], a[3] = b[h + 3], f(a, a, g), b[h] = a[0], b[h + 1] = a[1], b[h + 2] = a[2], b[h + 3] = a[3];
                return b
            }
        }(), e.str = function(a) {
            return "vec4(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ")"
        }, b.exports = e
    }, {
        "./common.js": 114
    }
    ],
    123: [function(a, b, c) {
        (function(a) {
            !function(a, c) {
                "use strict";
                var d = {}, e = a.GreenSockGlobals = a.GreenSockGlobals || a;
                if (!e.TweenLite) {
                    var f, g, h, i, j, k = function(a) {
                        var b, c = a.split("."), d = e;
                        for (b = 0; b < c.length; b++)
                            d[c[b]] = d = d[c[b]] || {};
                        return d
                    }, l = k("com.greensock"), m = 1e-10, n = function(a) {
                        var b, c = [], d = a.length;
                        for (b = 0; b !== d; c.push(a[b++])
                            );
                        return c
                    }, o = function() {}, p = function() {
                        var a = Object.prototype.toString, b = a.call([]);
                        return function(c) {
                            return null != c && (c instanceof Array || "object" == typeof c&&!!c.push && a.call(c) === b)
                        }
                    }(), q = {}, r = function(f, g, h, i) {
                        this.sc = q[f] ? q[f].sc : [], q[f] = this, this.gsClass = null, this.func = h;
                        var j = [];
                        this.check = function(l) {
                            for (var m, n, o, p, s, t = g.length, u = t; --t>-1;)(m = q[g[t]] || new r(g[t], [])
                                ).gsClass ? (j[t] = m.gsClass, u--) : l && m.sc.push(this);
                            if (0 === u && h) {
                                if (n = ("com.greensock." + f).split("."), o = n.pop(), p = k(n.join("."))[o] = this.gsClass = h.apply(h, j), i)
                                    if (e[o] = p, s = "undefined" != typeof b && b.exports, !s && "function" == typeof define && define.amd)
                                        define((a.GreenSockAMDPath ? a.GreenSockAMDPath + "/" : "") + f.split(".").pop(), [], function() {
                                            return p
                                        });
                                    else if (s)
                                        if (f === c) {
                                            b.exports = d[c] = p;
                                            for (t in d)
                                                p[t] = d[t]
                                        } else 
                                            d[c] && (d[c][o] = p);
                                for (t = 0; t < this.sc.length; t++)
                                    this.sc[t].check()
                            }
                        }, this.check(!0)
                    }, s = a._gsDefine = function(a, b, c, d) {
                        return new r(a, b, c, d)
                    }, t = l._class = function(a, b, c) {
                        return b = b || function() {}, s(a, [], function() {
                            return b
                        }, c), b
                    };
                    s.globals = e;
                    var u = [0, 0, 1, 1], v = [], w = t("easing.Ease", function(a, b, c, d) {
                        this._func = a, this._type = c || 0, this._power = d || 0, this._params = b ? u.concat(b) : u
                    }, !0), x = w.map = {}, y = w.register = function(a, b, c, d) {
                        for (var e, f, g, h, i = b.split(","), j = i.length, k = (c || "easeIn,easeOut,easeInOut").split(","); --j>-1;)
                            for (f = i[j], e = d ? t("easing." + f, null, !0) : l.easing[f] || {}, g = k.length; --g>-1;)
                                h = k[g], x[f + "." + h] = x[h + f] = e[h] = a.getRatio ? a : a[h] || new a
                    };
                    for (h = w.prototype, h._calcEnd=!1, h.getRatio = function(a) {
                        if (this._func)
                            return this._params[0] = a, this._func.apply(null, this._params);
                        var b = this._type, c = this._power, d = 1 === b ? 1 - a: 2 === b ? a: .5 > a ? 2 * a: 2 * (1 - a);
                        return 1 === c ? d*=d : 2 === c ? d*=d * d : 3 === c ? d*=d * d * d : 4 === c && (d*=d * d * d * d), 1 === b ? 1 - d : 2 === b ? d : .5 > a ? d / 2 : 1 - d / 2
                    }, f = ["Linear", "Quad", "Cubic", "Quart", "Quint,Strong"], g = f.length; --g>-1;)
                        h = f[g] + ",Power" + g, y(new w(null, null, 1, g), h, "easeOut", !0), y(new w(null, null, 2, g), h, "easeIn" + (0 === g ? ",easeNone" : "")), y(new w(null, null, 3, g), h, "easeInOut");
                    x.linear = l.easing.Linear.easeIn, x.swing = l.easing.Quad.easeInOut;
                    var z = t("events.EventDispatcher", function(a) {
                        this._listeners = {}, this._eventTarget = a || this
                    });
                    h = z.prototype, h.addEventListener = function(a, b, c, d, e) {
                        e = e || 0;
                        var f, g, h = this._listeners[a], k = 0;
                        for (this !== i || j || i.wake(), null == h && (this._listeners[a] = h = []), g = h.length; --g>-1;)
                            f = h[g], f.c === b && f.s === c ? h.splice(g, 1) : 0 === k && f.pr < e && (k = g + 1);
                        h.splice(k, 0, {
                            c: b,
                            s: c,
                            up: d,
                            pr: e
                        })
                    }, h.removeEventListener = function(a, b) {
                        var c, d = this._listeners[a];
                        if (d)
                            for (c = d.length; --c>-1;)
                                if (d[c].c === b)
                                    return void d.splice(c, 1)
                    }, h.dispatchEvent = function(a) {
                        var b, c, d, e = this._listeners[a];
                        if (e)
                            for (b = e.length, c = this._eventTarget; --b>-1;)
                                d = e[b], d && (d.up ? d.c.call(d.s || c, {
                                    type: a,
                                    target: c
                                }) : d.c.call(d.s || c))
                    };
                    var A = a.requestAnimationFrame, B = a.cancelAnimationFrame, C = Date.now || function() {
                        return (new Date).getTime()
                    }, D = C();
                    for (f = ["ms", "moz", "webkit", "o"], g = f.length; --g>-1&&!A;)
                        A = a[f[g] + "RequestAnimationFrame"], B = a[f[g] + "CancelAnimationFrame"] || a[f[g] + "CancelRequestAnimationFrame"];
                    t("Ticker", function(a, b) {
                        var c, d, e, f, g, h = this, k = C(), l = b!==!1 && A ? "auto": !1, n = 500, p = 33, q = "tick", r = function(a) {
                            var b, i, j = C() - D;
                            j > n && (k += j - p), D += j, h.time = (D - k) / 1e3, b = h.time - g, (!c || b > 0 || a===!0) && (h.frame++, g += b + (b >= f ? .004 : f - b), i=!0), a!==!0 && (e = d(r)), i && h.dispatchEvent(q)
                        };
                        z.call(h), h.time = h.frame = 0, h.tick = function() {
                            r(!0)
                        }, h.lagSmoothing = function(a, b) {
                            n = a || 1 / m, p = Math.min(b, n, 0)
                        }, h.sleep = function() {
                            null != e && (l && B ? B(e) : clearTimeout(e), d = o, e = null, h === i && (j=!1))
                        }, h.wake = function(a) {
                            null !== e ? h.sleep() : a ? k +=- D + (D = C()) : h.frame > 10 && (D = C() - n + 5), d = 0 === c ? o : l && A ? A : function(a) {
                                return setTimeout(a, 1e3 * (g - h.time) + 1 | 0)
                            }, h === i && (j=!0), r(2)
                        }, h.fps = function(a) {
                            return arguments.length ? (c = a, f = 1 / (c || 60), g = this.time + f, void h.wake()) : c
                        }, h.useRAF = function(a) {
                            return arguments.length ? (h.sleep(), l = a, void h.fps(c)) : l
                        }, h.fps(a), setTimeout(function() {
                            "auto" === l && h.frame < 5 && "hidden" !== document.visibilityState && h.useRAF(!1)
                        }, 1500)
                    }), h = l.Ticker.prototype = new l.events.EventDispatcher, h.constructor = l.Ticker;
                    var E = t("core.Animation", function(a, b) {
                        if (this.vars = b = b || {}, this._duration = this._totalDuration = a || 0, this._delay = Number(b.delay) || 0, this._timeScale = 1, this._active = b.immediateRender===!0, this.data = b.data, this._reversed = b.reversed===!0, X) {
                            j || i.wake();
                            var c = this.vars.useFrames ? W: X;
                            c.add(this, c._time), this.vars.paused && this.paused(!0)
                        }
                    });
                    i = E.ticker = new l.Ticker, h = E.prototype, h._dirty = h._gc = h._initted = h._paused=!1, h._totalTime = h._time = 0, h._rawPrevTime =- 1, h._next = h._last = h._onUpdate = h._timeline = h.timeline = null, h._paused=!1;
                    var F = function() {
                        j && C() - D > 2e3 && i.wake(), setTimeout(F, 2e3)
                    };
                    F(), h.play = function(a, b) {
                        return null != a && this.seek(a, b), this.reversed(!1).paused(!1)
                    }, h.pause = function(a, b) {
                        return null != a && this.seek(a, b), this.paused(!0)
                    }, h.resume = function(a, b) {
                        return null != a && this.seek(a, b), this.paused(!1)
                    }, h.seek = function(a, b) {
                        return this.totalTime(Number(a), b!==!1)
                    }, h.restart = function(a, b) {
                        return this.reversed(!1).paused(!1).totalTime(a?-this._delay : 0, b!==!1, !0)
                    }, h.reverse = function(a, b) {
                        return null != a && this.seek(a || this.totalDuration(), b), this.reversed(!0).paused(!1)
                    }, h.render = function(a, b, c) {}, h.invalidate = function() {
                        return this._time = this._totalTime = 0, this._initted = this._gc=!1, this._rawPrevTime =- 1, !this._gc && this.timeline || this._enabled(!0), this
                    }, h.isActive = function() {
                        var a, b = this._timeline, c = this._startTime;
                        return !b ||!this._gc&&!this._paused && b.isActive() && (a = b.rawTime()) >= c && a < c + this.totalDuration() / this._timeScale
                    }, h._enabled = function(a, b) {
                        return j || i.wake(), this._gc=!a, this._active = this.isActive(), b!==!0 && (a&&!this.timeline ? this._timeline.add(this, this._startTime - this._delay) : !a && this.timeline && this._timeline._remove(this, !0)), !1
                    }, h._kill = function(a, b) {
                        return this._enabled(!1, !1)
                    }, h.kill = function(a, b) {
                        return this._kill(a, b), this
                    }, h._uncache = function(a) {
                        for (var b = a ? this : this.timeline; b;)
                            b._dirty=!0, b = b.timeline;
                        return this
                    }, h._swapSelfInParams = function(a) {
                        for (var b = a.length, c = a.concat(); --b>-1;)
                            "{self}" === a[b] && (c[b] = this);
                        return c
                    }, h._callback = function(a) {
                        var b = this.vars;
                        b[a].apply(b[a + "Scope"] || b.callbackScope || this, b[a + "Params"] || v)
                    }, h.eventCallback = function(a, b, c, d) {
                        if ("on" === (a || "").substr(0, 2)) {
                            var e = this.vars;
                            if (1 === arguments.length)
                                return e[a];
                            null == b ? delete e[a] : (e[a] = b, e[a + "Params"] = p(c)&&-1 !== c.join("").indexOf("{self}") ? this._swapSelfInParams(c) : c, e[a + "Scope"] = d), "onUpdate" === a && (this._onUpdate = b)
                        }
                        return this
                    }, h.delay = function(a) {
                        return arguments.length ? (this._timeline.smoothChildTiming && this.startTime(this._startTime + a - this._delay), this._delay = a, this) : this._delay
                    }, h.duration = function(a) {
                        return arguments.length ? (this._duration = this._totalDuration = a, this._uncache(!0), this._timeline.smoothChildTiming && this._time > 0 && this._time < this._duration && 0 !== a && this.totalTime(this._totalTime * (a / this._duration), !0), this) : (this._dirty=!1, this._duration)
                    }, h.totalDuration = function(a) {
                        return this._dirty=!1, arguments.length ? this.duration(a) : this._totalDuration
                    }, h.time = function(a, b) {
                        return arguments.length ? (this._dirty && this.totalDuration(), this.totalTime(a > this._duration ? this._duration : a, b)) : this._time
                    }, h.totalTime = function(a, b, c) {
                        if (j || i.wake(), !arguments.length)
                            return this._totalTime;
                        if (this._timeline) {
                            if (0 > a&&!c && (a += this.totalDuration()), this._timeline.smoothChildTiming) {
                                this._dirty && this.totalDuration();
                                var d = this._totalDuration, e = this._timeline;
                                if (a > d&&!c && (a = d), this._startTime = (this._paused ? this._pauseTime : e._time) - (this._reversed ? d - a : a) / this._timeScale, e._dirty || this._uncache(!1), e._timeline)
                                    for (; e._timeline;)
                                        e._timeline._time !== (e._startTime + e._totalTime) / e._timeScale && e.totalTime(e._totalTime, !0), e = e._timeline
                            }
                            this._gc && this._enabled(!0, !1), this._totalTime === a && 0 !== this._duration || (K.length && Z(), this.render(a, b, !1), K.length && Z())
                        }
                        return this
                    }, h.progress = h.totalProgress = function(a, b) {
                        var c = this.duration();
                        return arguments.length ? this.totalTime(c * a, b) : c ? this._time / c : this.ratio
                    }, h.startTime = function(a) {
                        return arguments.length ? (a !== this._startTime && (this._startTime = a, this.timeline && this.timeline._sortChildren && this.timeline.add(this, a - this._delay)), this) : this._startTime
                    }, h.endTime = function(a) {
                        return this._startTime + (0 != a ? this.totalDuration() : this.duration()) / this._timeScale
                    }, h.timeScale = function(a) {
                        if (!arguments.length)
                            return this._timeScale;
                        if (a = a || m, this._timeline && this._timeline.smoothChildTiming) {
                            var b = this._pauseTime, c = b || 0 === b ? b: this._timeline.totalTime();
                            this._startTime = c - (c - this._startTime) * this._timeScale / a
                        }
                        return this._timeScale = a, this._uncache(!1)
                    }, h.reversed = function(a) {
                        return arguments.length ? (a != this._reversed && (this._reversed = a, this.totalTime(this._timeline&&!this._timeline.smoothChildTiming ? this.totalDuration() - this._totalTime : this._totalTime, !0)), this) : this._reversed
                    }, h.paused = function(a) {
                        if (!arguments.length)
                            return this._paused;
                        var b, c, d = this._timeline;
                        return a != this._paused && d && (j || a || i.wake(), b = d.rawTime(), c = b - this._pauseTime, !a && d.smoothChildTiming && (this._startTime += c, this._uncache(!1)), this._pauseTime = a ? b : null, this._paused = a, this._active = this.isActive(), !a && 0 !== c && this._initted && this.duration() && (b = d.smoothChildTiming ? this._totalTime : (b - this._startTime) / this._timeScale, this.render(b, b === this._totalTime, !0))), this._gc&&!a && this._enabled(!0, !1), this
                    };
                    var G = t("core.SimpleTimeline", function(a) {
                        E.call(this, 0, a), this.autoRemoveChildren = this.smoothChildTiming=!0
                    });
                    h = G.prototype = new E, h.constructor = G, h.kill()._gc=!1, h._first = h._last = h._recent = null, h._sortChildren=!1, h.add = h.insert = function(a, b, c, d) {
                        var e, f;
                        if (a._startTime = Number(b || 0) + a._delay, a._paused && this !== a._timeline && (a._pauseTime = a._startTime + (this.rawTime() - a._startTime) / a._timeScale), a.timeline && a.timeline._remove(a, !0), a.timeline = a._timeline = this, a._gc && a._enabled(!0, !0), e = this._last, this._sortChildren)
                            for (f = a._startTime; e && e._startTime > f;)
                                e = e._prev;
                        return e ? (a._next = e._next, e._next = a) : (a._next = this._first, this._first = a), a._next ? a._next._prev = a : this._last = a, a._prev = e, this._recent = a, this._timeline && this._uncache(!0), this
                    }, h._remove = function(a, b) {
                        return a.timeline === this && (b || a._enabled(!1, !0), a._prev ? a._prev._next = a._next : this._first === a && (this._first = a._next), a._next ? a._next._prev = a._prev : this._last === a && (this._last = a._prev), a._next = a._prev = a.timeline = null, a === this._recent && (this._recent = this._last), this._timeline && this._uncache(!0)), this
                    }, h.render = function(a, b, c) {
                        var d, e = this._first;
                        for (this._totalTime = this._time = this._rawPrevTime = a; e;)
                            d = e._next, (e._active || a >= e._startTime&&!e._paused) && (e._reversed ? e.render((e._dirty ? e.totalDuration() : e._totalDuration) - (a - e._startTime) * e._timeScale, b, c) : e.render((a - e._startTime) * e._timeScale, b, c)), e = d
                    }, h.rawTime = function() {
                        return j || i.wake(), this._totalTime
                    };
                    var H = t("TweenLite", function(b, c, d) {
                        if (E.call(this, c, d), this.render = H.prototype.render, null == b)
                            throw "Cannot tween a null target.";
                        this.target = b = "string" != typeof b ? b : H.selector(b) || b;
                        var e, f, g, h = b.jquery || b.length && b !== a && b[0] && (b[0] === a || b[0].nodeType && b[0].style&&!b.nodeType), i = this.vars.overwrite;
                        if (this._overwrite = i = null == i ? V[H.defaultOverwrite] : "number" == typeof i ? i>>0 : V[i], (h || b instanceof Array || b.push && p(b)) && "number" != typeof b[0])
                            for (this._targets = g = n(b), this._propLookup = [], this._siblings = [], e = 0; e < g.length; e++)
                                f = g[e], f ? "string" != typeof f ? f.length && f !== a && f[0] && (f[0] === a || f[0].nodeType && f[0].style&&!f.nodeType) ? (g.splice(e--, 1), this._targets = g = g.concat(n(f))) : (this._siblings[e] = $(f, this, !1), 1 === i && this._siblings[e].length > 1 && aa(f, this, null, 1, this._siblings[e])) : (f = g[e--] = H.selector(f), "string" == typeof f && g.splice(e + 1, 1)) : g.splice(e--, 1);
                        else 
                            this._propLookup = {}, this._siblings = $(b, this, !1), 1 === i && this._siblings.length > 1 && aa(b, this, null, 1, this._siblings);
                        (this.vars.immediateRender || 0 === c && 0 === this._delay && this.vars.immediateRender!==!1) && (this._time =- m, this.render(Math.min(0, - this._delay)))
                    }, !0), I = function(b) {
                        return b && b.length && b !== a && b[0] && (b[0] === a || b[0].nodeType && b[0].style&&!b.nodeType)
                    }, J = function(a, b) {
                        var c, d = {};
                        for (c in a)
                            U[c] || c in b && "transform" !== c && "x" !== c && "y" !== c && "width" !== c && "height" !== c && "className" !== c && "border" !== c ||!(!R[c] || R[c] && R[c]._autoCSS) || (d[c] = a[c], delete a[c]);
                        a.css = d
                    };
                    h = H.prototype = new E, h.constructor = H, h.kill()._gc=!1, h.ratio = 0, h._firstPT = h._targets = h._overwrittenProps = h._startAt = null, h._notifyPluginsOfEnabled = h._lazy=!1, H.version = "1.18.5", H.defaultEase = h._ease = new w(null, null, 1, 1), H.defaultOverwrite = "auto", H.ticker = i, H.autoSleep = 120, H.lagSmoothing = function(a, b) {
                        i.lagSmoothing(a, b)
                    }, H.selector = a.$ || a.jQuery || function(b) {
                        var c = a.$ || a.jQuery;
                        return c ? (H.selector = c, c(b)) : "undefined" == typeof document ? b : document.querySelectorAll ? document.querySelectorAll(b) : document.getElementById("#" === b.charAt(0) ? b.substr(1) : b)
                    };
                    var K = [], L = {}, M = /(?:(-|-=|\+=)?\d*\.?\d*(?:e[\-+]?\d+)?)[0-9]/gi, N = function(a) {
                        for (var b, c = this._firstPT, d = 1e-6; c;)
                            b = c.blob ? a ? this.join("") : this.start : c.c * a + c.s, c.r ? b = Math.round(b) : d > b && b>-d && (b = 0), c.f ? c.fp ? c.t[c.p](c.fp, b) : c.t[c.p](b) : c.t[c.p] = b, c = c._next
                    }, O = function(a, b, c, d) {
                        var e, f, g, h, i, j, k, l = [a, b], m = 0, n = "", o = 0;
                        for (l.start = a, c && (c(l), a = l[0], b = l[1]), l.length = 0, e = a.match(M) || [], f = b.match(M) || [], d && (d._next = null, d.blob = 1, l._firstPT = d), i = f.length, h = 0; i > h; h++)
                            k = f[h], j = b.substr(m, b.indexOf(k, m) - m), n += j ||!h ? j : ",", m += j.length, o ? o = (o + 1)%5 : "rgba(" === j.substr( - 5) && (o = 1), k === e[h] || e.length <= h ? n += k : (n && (l.push(n), n = ""), g = parseFloat(e[h]), l.push(g), l._firstPT = {
                                _next: l._firstPT,
                                t: l,
                                p: l.length - 1,
                                s: g,
                                c: ("=" === k.charAt(1) ? parseInt(k.charAt(0) + "1", 10) * parseFloat(k.substr(2)) : parseFloat(k) - g) || 0,
                                f: 0,
                                r: o && 4 > o
                            }), m += k.length;
                        return n += b.substr(m), n && l.push(n), l.setRatio = N, l
                    }, P = function(a, b, c, d, e, f, g, h) {
                        var i, j, k = "get" === c ? a[b]: c, l = typeof a[b], m = "string" == typeof d && "=" === d.charAt(1), n = {
                            t: a,
                            p: b,
                            s: k,
                            f: "function" === l,
                            pg: 0,
                            n: e || b,
                            r: f,
                            pr: 0,
                            c: m ? parseInt(d.charAt(0) + "1", 10) * parseFloat(d.substr(2)): parseFloat(d) - k || 0
                        };
                        return "number" !== l && ("function" === l && "get" === c && (j = b.indexOf("set") || "function" != typeof a["get" + b.substr(3)] ? b : "get" + b.substr(3), n.s = k = g ? a[j](g) : a[j]()), "string" == typeof k && (g || isNaN(k)) ? (n.fp = g, i = O(k, d, h || H.defaultStringFilter, n), n = {
                            t: i,
                            p: "setRatio",
                            s: 0,
                            c: 1,
                            f: 2,
                            pg: 0,
                            n: e || b,
                            pr: 0
                        }) : m || (n.s = parseFloat(k), n.c = parseFloat(d) - n.s || 0)), n.c ? ((n._next = this._firstPT) && (n._next._prev = n), this._firstPT = n, n) : void 0
                    }, Q = H._internals = {
                        isArray: p,
                        isSelector: I,
                        lazyTweens: K,
                        blobDif: O
                    }, R = H._plugins = {}, S = Q.tweenLookup = {}, T = 0, U = Q.reservedProps = {
                        ease: 1,
                        delay: 1,
                        overwrite: 1,
                        onComplete: 1,
                        onCompleteParams: 1,
                        onCompleteScope: 1,
                        useFrames: 1,
                        runBackwards: 1,
                        startAt: 1,
                        onUpdate: 1,
                        onUpdateParams: 1,
                        onUpdateScope: 1,
                        onStart: 1,
                        onStartParams: 1,
                        onStartScope: 1,
                        onReverseComplete: 1,
                        onReverseCompleteParams: 1,
                        onReverseCompleteScope: 1,
                        onRepeat: 1,
                        onRepeatParams: 1,
                        onRepeatScope: 1,
                        easeParams: 1,
                        yoyo: 1,
                        immediateRender: 1,
                        repeat: 1,
                        repeatDelay: 1,
                        data: 1,
                        paused: 1,
                        reversed: 1,
                        autoCSS: 1,
                        lazy: 1,
                        onOverwrite: 1,
                        callbackScope: 1,
                        stringFilter: 1,
                        id: 1
                    }, V = {
                        none: 0,
                        all: 1,
                        auto: 2,
                        concurrent: 3,
                        allOnStart: 4,
                        preexisting: 5,
                        "true": 1,
                        "false": 0
                    }, W = E._rootFramesTimeline = new G, X = E._rootTimeline = new G, Y = 30, Z = Q.lazyRender = function() {
                        var a, b = K.length;
                        for (L = {}; --b>-1;)
                            a = K[b], a && a._lazy!==!1 && (a.render(a._lazy[0], a._lazy[1], !0), a._lazy=!1);
                        K.length = 0
                    };
                    X._startTime = i.time, W._startTime = i.frame, X._active = W._active=!0, setTimeout(Z, 1), E._updateRoot = H.render = function() {
                        var a, b, c;
                        if (K.length && Z(), X.render((i.time - X._startTime) * X._timeScale, !1, !1), W.render((i.frame - W._startTime) * W._timeScale, !1, !1), K.length && Z(), i.frame >= Y) {
                            Y = i.frame + (parseInt(H.autoSleep, 10) || 120);
                            for (c in S) {
                                for (b = S[c].tweens, a = b.length; --a>-1;)
                                    b[a]._gc && b.splice(a, 1);
                                0 === b.length && delete S[c]
                            }
                            if (c = X._first, (!c || c._paused) && H.autoSleep&&!W._first && 1 === i._listeners.tick.length) {
                                for (; c && c._paused;)
                                    c = c._next;
                                c || i.sleep()
                            }
                        }
                    }, i.addEventListener("tick", E._updateRoot);
                    var $ = function(a, b, c) {
                        var d, e, f = a._gsTweenID;
                        if (S[f || (a._gsTweenID = f = "t" + T++)] || (S[f] = {
                            target: a,
                            tweens: []
                        }), b && (d = S[f].tweens, d[e = d.length] = b, c))
                            for (; --e>-1;)
                                d[e] === b && d.splice(e, 1);
                        return S[f].tweens
                    }, _ = function(a, b, c, d) {
                        var e, f, g = a.vars.onOverwrite;
                        return g && (e = g(a, b, c, d)), g = H.onOverwrite, g && (f = g(a, b, c, d)), e!==!1 && f!==!1
                    }, aa = function(a, b, c, d, e) {
                        var f, g, h, i;
                        if (1 === d || d >= 4) {
                            for (i = e.length, f = 0; i > f; f++)
                                if ((h = e[f]) !== b)
                                    h._gc || h._kill(null, a, b) && (g=!0);
                                else if (5 === d)
                                    break;
                            return g
                        }
                        var j, k = b._startTime + m, l = [], n = 0, o = 0 === b._duration;
                        for (f = e.length; --f>-1;)(h = e[f]) 
                            === b || h._gc || h._paused || (h._timeline !== b._timeline ? (j = j || ba(b, 0, o), 0 === ba(h, j, o) && (l[n++] = h)) : h._startTime <= k && h._startTime + h.totalDuration() / h._timeScale > k && ((o ||!h._initted) && k - h._startTime <= 2e-10 || (l[n++] = h)));
                        for (f = n; --f>-1;)
                            if (h = l[f], 2 === d && h._kill(c, a, b) && (g=!0), 2 !== d ||!h._firstPT && h._initted) {
                                if (2 !== d&&!_(h, b))
                                    continue;
                                    h._enabled(!1, !1) && (g=!0)
                            }
                        return g
                    }, ba = function(a, b, c) {
                        for (var d = a._timeline, e = d._timeScale, f = a._startTime; d._timeline;) {
                            if (f += d._startTime, e*=d._timeScale, d._paused)
                                return - 100;
                            d = d._timeline
                        }
                        return f/=e, f > b ? f - b : c && f === b ||!a._initted && 2 * m > f - b ? m : (f += a.totalDuration() / a._timeScale / e) > b + m ? 0 : f - b - m
                    };
                    h._init = function() {
                        var a, b, c, d, e, f = this.vars, g = this._overwrittenProps, h = this._duration, i=!!f.immediateRender, j = f.ease;
                        if (f.startAt) {
                            this._startAt && (this._startAt.render( - 1, !0), this._startAt.kill()), e = {};
                            for (d in f.startAt)
                                e[d] = f.startAt[d];
                            if (e.overwrite=!1, e.immediateRender=!0, e.lazy = i && f.lazy!==!1, e.startAt = e.delay = null, this._startAt = H.to(this.target, 0, e), i)
                                if (this._time > 0)
                                    this._startAt = null;
                                else if (0 !== h)
                                    return 
                        } else if (f.runBackwards && 0 !== h)
                            if (this._startAt)
                                this._startAt.render( - 1, !0), this._startAt.kill(), this._startAt = null;
                            else {
                                0 !== this._time && (i=!1), c = {};
                                for (d in f)
                                    U[d] && "autoCSS" !== d || (c[d] = f[d]);
                                    if (c.overwrite = 0, c.data = "isFromStart", c.lazy = i && f.lazy!==!1, c.immediateRender = i, this._startAt = H.to(this.target, 0, c), i) {
                                        if (0 === this._time)
                                            return 
                                    } else 
                                        this._startAt._init(), this._startAt._enabled(!1), this.vars.immediateRender && (this._startAt = null)
                            }
                        if (this._ease = j = j ? j instanceof w ? j : "function" == typeof j ? new w(j, f.easeParams) : x[j] || H.defaultEase : H.defaultEase, f.easeParams instanceof Array && j.config && (this._ease = j.config.apply(j, f.easeParams)), this._easeType = this._ease._type, this._easePower = this._ease._power, this._firstPT = null, this._targets)
                            for (a = this._targets.length; --a>-1;)
                                this._initProps(this._targets[a], this._propLookup[a] = {}, this._siblings[a], g ? g[a] : null) && (b=!0);
                        else 
                            b = this._initProps(this.target, this._propLookup, this._siblings, g);
                        if (b && H._onPluginEvent("_onInitAllProps", this), g && (this._firstPT || "function" != typeof this.target && this._enabled(!1, !1)), f.runBackwards)
                            for (c = this._firstPT; c;)
                                c.s += c.c, c.c =- c.c, c = c._next;
                        this._onUpdate = f.onUpdate, this._initted=!0
                    }, h._initProps = function(b, c, d, e) {
                        var f, g, h, i, j, k;
                        if (null == b)
                            return !1;
                        L[b._gsTweenID] && Z(), this.vars.css || b.style && b !== a && b.nodeType && R.css && this.vars.autoCSS!==!1 && J(this.vars, b);
                        for (f in this.vars)
                            if (k = this.vars[f], U[f])
                                k && (k instanceof Array || k.push && p(k))&&-1 !== k.join("").indexOf("{self}") && (this.vars[f] = k = this._swapSelfInParams(k, this));
                            else if (R[f] && (i = new R[f])._onInitTween(b, this.vars[f], this)) {
                                for (this._firstPT = j = {
                                    _next: this._firstPT,
                                    t: i,
                                    p: "setRatio",
                                    s: 0,
                                    c: 1,
                                    f: 1,
                                    n: f,
                                    pg: 1,
                                    pr: i._priority
                                }, g = i._overwriteProps.length; --g>-1;)
                                    c[i._overwriteProps[g]] = this._firstPT;
                                    (i._priority || i._onInitAllProps) && (h=!0), (i._onDisable || i._onEnable) && (this._notifyPluginsOfEnabled=!0), j._next && (j._next._prev = j)
                            } else 
                                c[f] = P.call(this, b, f, "get", k, f, 0, null, this.vars.stringFilter);
                        return e && this._kill(e, b) ? this._initProps(b, c, d, e) : this._overwrite > 1 && this._firstPT && d.length > 1 && aa(b, this, c, this._overwrite, d) ? (this._kill(c, b), this._initProps(b, c, d, e)) : (this._firstPT && (this.vars.lazy!==!1 && this._duration || this.vars.lazy&&!this._duration) && (L[b._gsTweenID]=!0), h)
                    }, h.render = function(a, b, c) {
                        var d, e, f, g, h = this._time, i = this._duration, j = this._rawPrevTime;
                        if (a >= i - 1e-7)
                            this._totalTime = this._time = i, this.ratio = this._ease._calcEnd ? this._ease.getRatio(1) : 1, this._reversed || (d=!0, e = "onComplete", c = c || this._timeline.autoRemoveChildren), 0 === i && (this._initted ||!this.vars.lazy || c) && (this._startTime === this._timeline._duration && (a = 0), (0 > j || 0 >= a && a>=-1e-7 || j === m && "isPause" !== this.data) && j !== a && (c=!0, j > m && (e = "onReverseComplete")), this._rawPrevTime = g=!b || a || j === a ? a : m);
                        else if (1e-7 > a)
                            this._totalTime = this._time = 0, this.ratio = this._ease._calcEnd ? this._ease.getRatio(0) : 0, (0 !== h || 0 === i && j > 0) && (e = "onReverseComplete", d = this._reversed), 0 > a && (this._active=!1, 0 === i && (this._initted ||!this.vars.lazy || c) && (j >= 0 && (j !== m || "isPause" !== this.data) && (c=!0), this._rawPrevTime = g=!b || a || j === a ? a : m)), this._initted || (c=!0);
                        else if (this._totalTime = this._time = a, this._easeType) {
                            var k = a / i, l = this._easeType, n = this._easePower;
                            (1 === l || 3 === l && k >= .5) && (k = 1 - k), 3 === l && (k*=2), 1 === n ? k*=k : 2 === n ? k*=k * k : 3 === n ? k*=k * k * k : 4 === n && (k*=k * k * k * k), 1 === l ? this.ratio = 1 - k : 2 === l ? this.ratio = k : .5 > a / i ? this.ratio = k / 2 : this.ratio = 1 - k / 2
                        } else 
                            this.ratio = this._ease.getRatio(a / i);
                        if (this._time !== h || c) {
                            if (!this._initted) {
                                if (this._init(), !this._initted || this._gc)
                                    return;
                                if (!c && this._firstPT && (this.vars.lazy!==!1 && this._duration || this.vars.lazy&&!this._duration))
                                    return this._time = this._totalTime = h, this._rawPrevTime = j, K.push(this), void(this._lazy = [a, b]);
                                this._time&&!d ? this.ratio = this._ease.getRatio(this._time / i) : d && this._ease._calcEnd && (this.ratio = this._ease.getRatio(0 === this._time ? 0 : 1))
                            }
                            for (this._lazy!==!1 && (this._lazy=!1), this._active ||!this._paused && this._time !== h && a >= 0 && (this._active=!0), 0 === h && (this._startAt && (a >= 0 ? this._startAt.render(a, b, c) : e || (e = "_dummyGS")), this.vars.onStart && (0 === this._time && 0 !== i || b || this._callback("onStart"))), f = this._firstPT; f;)
                                f.f ? f.t[f.p](f.c * this.ratio + f.s) : f.t[f.p] = f.c * this.ratio + f.s, f = f._next;
                            this._onUpdate && (0 > a && this._startAt && a!==-1e-4 && this._startAt.render(a, b, c), b || (this._time !== h || d || c) && this._callback("onUpdate")), e && (this._gc&&!c || (0 > a && this._startAt&&!this._onUpdate && a!==-1e-4 && this._startAt.render(a, b, c), d && (this._timeline.autoRemoveChildren && this._enabled(!1, !1), this._active=!1), !b && this.vars[e] && this._callback(e), 0 === i && this._rawPrevTime === m && g !== m && (this._rawPrevTime = 0)))
                        }
                    }, h._kill = function(a, b, c) {
                        if ("all" === a && (a = null), null == a && (null == b || b === this.target))
                            return this._lazy=!1, this._enabled(!1, !1);
                        b = "string" != typeof b ? b || this._targets || this.target : H.selector(b) || b;
                        var d, e, f, g, h, i, j, k, l, m = c && this._time && c._startTime === this._startTime && this._timeline === c._timeline;
                        if ((p(b) || I(b)) && "number" != typeof b[0])
                            for (d = b.length; --d>-1;)
                                this._kill(a, b[d], c) && (i=!0);
                        else {
                            if (this._targets) {
                                for (d = this._targets.length; --d>-1;)
                                    if (b === this._targets[d]) {
                                        h = this._propLookup[d] || {}, this._overwrittenProps = this._overwrittenProps || [], e = this._overwrittenProps[d] = a ? this._overwrittenProps[d] || {} : "all";
                                        break
                                    }
                            } else {
                                if (b !== this.target)
                                    return !1;
                                h = this._propLookup, e = this._overwrittenProps = a ? this._overwrittenProps || {} : "all"
                            }
                            if (h) {
                                if (j = a || h, k = a !== e && "all" !== e && a !== h && ("object" != typeof a ||!a._tempKill), c && (H.onOverwrite || this.vars.onOverwrite)) {
                                    for (f in j)
                                        h[f] && (l || (l = []), l.push(f));
                                    if ((l ||!a)&&!_(this, c, b, l))
                                        return !1
                                }
                                for (f in j)(g = h[f]) 
                                    && (m && (g.f ? g.t[g.p](g.s) : g.t[g.p] = g.s, i=!0), g.pg && g.t._kill(j) && (i=!0), g.pg && 0 !== g.t._overwriteProps.length || (g._prev ? g._prev._next = g._next : g === this._firstPT && (this._firstPT = g._next), g._next && (g._next._prev = g._prev), g._next = g._prev = null), delete h[f]), k && (e[f] = 1);
                                !this._firstPT && this._initted && this._enabled(!1, !1)
                            }
                        }
                        return i
                    }, h.invalidate = function() {
                        return this._notifyPluginsOfEnabled && H._onPluginEvent("_onDisable", this), this._firstPT = this._overwrittenProps = this._startAt = this._onUpdate = null, this._notifyPluginsOfEnabled = this._active = this._lazy=!1, this._propLookup = this._targets ? {} : [], E.prototype.invalidate.call(this), this.vars.immediateRender && (this._time =- m, this.render(Math.min(0, - this._delay))), this
                    }, h._enabled = function(a, b) {
                        if (j || i.wake(), a && this._gc) {
                            var c, d = this._targets;
                            if (d)
                                for (c = d.length; --c>-1;)
                                    this._siblings[c] = $(d[c], this, !0);
                            else 
                                this._siblings = $(this.target, this, !0)
                        }
                        return E.prototype._enabled.call(this, a, b), this._notifyPluginsOfEnabled && this._firstPT ? H._onPluginEvent(a ? "_onEnable" : "_onDisable", this) : !1
                    }, H.to = function(a, b, c) {
                        return new H(a, b, c)
                    }, H.from = function(a, b, c) {
                        return c.runBackwards=!0, c.immediateRender = 0 != c.immediateRender, new H(a, b, c)
                    }, H.fromTo = function(a, b, c, d) {
                        return d.startAt = c, d.immediateRender = 0 != d.immediateRender && 0 != c.immediateRender, new H(a, b, d)
                    }, H.delayedCall = function(a, b, c, d, e) {
                        return new H(b, 0, {
                            delay: a,
                            onComplete: b,
                            onCompleteParams: c,
                            callbackScope: d,
                            onReverseComplete: b,
                            onReverseCompleteParams: c,
                            immediateRender: !1,
                            lazy: !1,
                            useFrames: e,
                            overwrite: 0
                        })
                    }, H.set = function(a, b) {
                        return new H(a, 0, b)
                    }, H.getTweensOf = function(a, b) {
                        if (null == a)
                            return [];
                        a = "string" != typeof a ? a : H.selector(a) || a;
                        var c, d, e, f;
                        if ((p(a) || I(a)) && "number" != typeof a[0]) {
                            for (c = a.length, d = []; --c>-1;)
                                d = d.concat(H.getTweensOf(a[c], b));
                            for (c = d.length; --c>-1;)
                                for (f = d[c], e = c; --e>-1;)
                                    f === d[e] && d.splice(c, 1)
                        } else 
                            for (d = $(a).concat(), c = d.length; --c>-1;)(d[c]._gc || b&&!d[c].isActive()
                                ) && d.splice(c, 1);
                        return d
                    }, H.killTweensOf = H.killDelayedCallsTo = function(a, b, c) {
                        "object" == typeof b && (c = b, b=!1);
                        for (var d = H.getTweensOf(a, b), e = d.length; --e>-1;)
                            d[e]._kill(c, a)
                    };
                    var ca = t("plugins.TweenPlugin", function(a, b) {
                        this._overwriteProps = (a || "").split(","), this._propName = this._overwriteProps[0], this._priority = b || 0, this._super = ca.prototype
                    }, !0);
                    if (h = ca.prototype, ca.version = "1.18.0", ca.API = 2, h._firstPT = null, h._addTween = P, h.setRatio = N, h._kill = function(a) {
                        var b, c = this._overwriteProps, d = this._firstPT;
                        if (null != a[this._propName])
                            this._overwriteProps = [];
                        else 
                            for (b = c.length; --b>-1;)
                                null != a[c[b]] && c.splice(b, 1);
                        for (; d;)
                            null != a[d.n] && (d._next && (d._next._prev = d._prev), d._prev ? (d._prev._next = d._next, d._prev = null) : this._firstPT === d && (this._firstPT = d._next)), d = d._next;
                        return !1
                    }, h._roundProps = function(a, b) {
                        for (var c = this._firstPT; c;)(a[this._propName] || null != c.n && a[c.n.split(this._propName + "_").join("")]) 
                            && (c.r = b), c = c._next
                    }, H._onPluginEvent = function(a, b) {
                        var c, d, e, f, g, h = b._firstPT;
                        if ("_onInitAllProps" === a) {
                            for (; h;) {
                                for (g = h._next, d = e; d && d.pr > h.pr;)
                                    d = d._next;
                                (h._prev = d ? d._prev : f) ? h._prev._next = h : e = h, (h._next = d) ? d._prev = h : f = h, h = g
                            }
                            h = b._firstPT = e
                        }
                        for (; h;)
                            h.pg && "function" == typeof h.t[a] && h.t[a]() && (c=!0), h = h._next;
                        return c
                    }, ca.activate = function(a) {
                        for (var b = a.length; --b>-1;)
                            a[b].API === ca.API && (R[(new a[b])._propName] = a[b]);
                        return !0
                    }, s.plugin = function(a) {
                        if (!(a && a.propName && a.init && a.API))
                            throw "illegal plugin definition.";
                        var b, c = a.propName, d = a.priority || 0, e = a.overwriteProps, f = {
                            init: "_onInitTween",
                            set: "setRatio",
                            kill: "_kill",
                            round: "_roundProps",
                            initAll: "_onInitAllProps"
                        }, g = t("plugins." + c.charAt(0).toUpperCase() + c.substr(1) + "Plugin", function() {
                            ca.call(this, c, d), this._overwriteProps = e || []
                        }, a.global===!0), h = g.prototype = new ca(c);
                        h.constructor = g, g.API = a.API;
                        for (b in f)
                            "function" == typeof a[b] && (h[f[b]] = a[b]);
                        return g.version = a.version, ca.activate([g]), g
                    }, f = a._gsQueue) {
                        for (g = 0; g < f.length; g++)
                            f[g]();
                        for (h in q)
                            q[h].func || a.console.log("GSAP encountered missing dependency: com.greensock." + h)
                        }
                    j=!1
                }
            }("undefined" != typeof b && b.exports && "undefined" != typeof a ? a : this || window, "TweenLite")
        }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }, {}
    ],
    124: [function(a, b, c) {
        function d(a) {
            e.call(this), this.lens = a, this._view = f.create(), this._viewProj = f.create()
        }
        var e = a("nanogl-node"), f = a("gl-matrix/src/gl-matrix/mat4"), g = a("./perspective-lens"), h = a("./ortho-lens"), i = f.create(), j = Object.create(e.prototype);
        j.modelViewMatrix = function(a, b) {
            f.multiply(a, b, this._view)
        }, j.modelViewProjectionMatrix = function(a, b) {
            f.multiply(a, this._viewProj, b)
        }, j.unproject = function(a, b) {
            f.invert(i, this._proj), vec3.transformMat4(a, b, i)
        }, j.updateViewProjectionMatrix = function(a, b) {
            this.lens.aspect = a / b, f.multiply(this._viewProj, this.lens.getProjection(), this._view)
        }, j._computeWorldMatrix = function(a) {
            e.prototype._computeWorldMatrix.call(this, a), f.invert(this._view, this._wmatrix)
        }, d.makePerspectiveCamera = function() {
            return new d(new g)
        }, d.makeOrthoCamera = function() {
            return new d(new h)
        }, j.constructor = d, d.prototype = j, b.exports = d
    }, {
        "./ortho-lens": 125,
        "./perspective-lens": 126,
        "gl-matrix/src/gl-matrix/mat4": 118,
        "nanogl-node": 128
    }
    ],
    125: [function(a, b, c) {
        function d() {
            this._near = .01, this._far = 10, this._xMin =- 1, this._xMax = 1, this._yMin =- 1, this._yMax = 1, this._proj = e.create(), this._valid=!1
        }
        var e = a("gl-matrix/src/gl-matrix/mat4");
        d.prototype = {
            getProjection: function() {
                return this._valid || this._updateProjection(), this._proj
            },
            setBound: function(a, b, c, d) {
                this._xMin = a, this._xMax = b, this._yMin = c, this._yMax = d, this._invalidate()
            },
            set near(a) {
                this._near !== a && (this._near = a, this._invalidate())
            },
            get near() {
                return this._near
            },
            set far(a) {
                this._far !== a && (this._far = a, this._invalidate())
            },
            get far() {
                return this._far
            },
            set aspect(a) {
                this._aspect !== a && (this._aspect = a)
            },
            get aspect() {
                return this._aspect
            },
            _updateProjection: function() {
                e.ortho(this._proj, this._xMin, this._xMax, this._yMin, this._yMax, this._near, this._far), this._valid=!0
            },
            _invalidate: function() {
                this._valid=!1
            }
        }, b.exports = d
    }, {
        "gl-matrix/src/gl-matrix/mat4": 118
    }
    ],
    126: [function(a, b, c) {
        function d() {
            this._near = .01, this._far = 10, this._fov = Math.PI / 3, this._vfov = 0, this._hfov = 0, this._aspect = 1, this._fovMode = 0, this._proj = e.create(), this._valid=!1
        }
        var e = a("gl-matrix/src/gl-matrix/mat4"), f = 1, g = 2, h = 3;
        d.prototype = {
            getProjection: function() {
                return this._valid || this._updateProjection(), this._proj
            },
            set fov(a) {
                this.setVerticalFov(a)
            },
            get fov() {
                return this._fov
            },
            set near(a) {
                this._near !== a && (this._near = a, this._invalidate())
            },
            get near() {
                return this._near
            },
            set far(a) {
                this._far !== a && (this._far = a, this._invalidate())
            },
            get far() {
                return this._far
            },
            set aspect(a) {
                this._aspect !== a && (this._aspect = a, this._invalidate())
            },
            get aspect() {
                return this._aspect
            },
            setHorizontalFov: function(a) {
                this._fov = a, this._fovMode = g, this._invalidate()
            },
            setVerticalFov: function(a) {
                this._fov = a, this._fovMode = f, this._invalidate()
            },
            getHorizontalFov: function() {
                return this.getProjection(), this._hfov
            },
            getVerticalFov: function() {
                return this.getProjection(), this._vfov
            },
            setAutoFov: function(a) {
                this._fov = a, this._fovMode = h, this._invalidate()
            },
            _updateProjection: function() {
                var a = this._fovMode, b = this._aspect;
                a === f || a === h && b > 1 ? (this._vfov = this._fov, this._hfov = 2 * Math.atan(Math.tan(this._fov / 2) * b)) : (this._hfov = this._fov, this._vfov = 2 * Math.atan(Math.tan(this._fov / 2) / b)), e.perspective(this._proj, this._vfov, b, this._near, this._far), this._valid=!0
            },
            _invalidate: function() {
                this._valid=!1
            }
        }, b.exports = d
    }, {
        "gl-matrix/src/gl-matrix/mat4": 118
    }
    ],
    127: [function(a, b, c) {
        function d(a, b, c, d) {
            b[0] = a[12], b[1] = a[13], b[2] = a[14], d[0] = Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]), d[1] = Math.sqrt(a[4] * a[4] + a[5] * a[5] + a[6] * a[6]), d[2] = Math.sqrt(a[8] * a[8] + a[9] * a[9] + a[10] * a[10]), g[0] = a[0] / d[0], g[1] = a[1] / d[0], g[2] = a[2] / d[0], g[3] = a[4] / d[1], g[4] = a[5] / d[1], g[5] = a[6] / d[1], g[6] = a[8] / d[2], g[7] = a[9] / d[2], g[8] = a[10] / d[2], f.fromMat3(c, g)
        }
        var e = a("gl-matrix/src/gl-matrix/mat3"), f = a("gl-matrix/src/gl-matrix/quat"), g = e.create();
        b.exports = {
            decomposeMat4: d
        }
    }, {
        "gl-matrix/src/gl-matrix/mat3": 117,
        "gl-matrix/src/gl-matrix/quat": 119
    }
    ],
    128: [function(a, b, c) {
        function d() {
            this.position = h.create(), this.rotation = i.create(), this.scale = h.fromValues(1, 1, 1), this._matrix = f.create(), this._wmatrix = f.create(), this._wposition = new Float32Array(this._wmatrix.buffer, 48, 3), this._parent = null, this._children = [], this._invalidM=!0, this._invalidW=!0
        }
        var e = a("./math"), f = a("gl-matrix/src/gl-matrix/mat4"), g = a("gl-matrix/src/gl-matrix/mat3"), h = a("gl-matrix/src/gl-matrix/vec3"), i = a("gl-matrix/src/gl-matrix/quat"), j = g.create(), k = new Float32Array(j.buffer, 0, 3), l = new Float32Array(j.buffer, 12, 3), m = new Float32Array(j.buffer, 24, 3);
        VUP = h.fromValues(0, 1, 0), d.prototype = {
            rotateX: function(a) {
                i.rotateX(this.rotation, this.rotation, a), this.invalidate()
            },
            rotateY: function(a) {
                i.rotateY(this.rotation, this.rotation, a), this.invalidate()
            },
            rotateZ: function(a) {
                i.rotateZ(this.rotation, this.rotation, a), this.invalidate()
            },
            set x(a) {
                this.position[0] = a, this.invalidate()
            },
            set y(a) {
                this.position[1] = a, this.invalidate()
            },
            set z(a) {
                this.position[2] = a, this.invalidate()
            },
            get x() {
                return this.position[0]
            },
            get y() {
                return this.position[1]
            },
            get z() {
                return this.position[2]
            },
            setScale: function(a) {
                this.scale[0] = this.scale[1] = this.scale[2] = a, this.invalidate()
            },
            lookAt: function(a) {
                h.subtract(m, this.position, a), h.normalize(m, m), h.cross(k, VUP, m), h.normalize(k, k), h.cross(l, m, k), i.fromMat3(this.rotation, j), this.invalidate()
            },
            setMatrix: function(a) {
                f.copy(this._matrix, a), e.decomposeMat4(a, this.position, this.rotation, this.scale), this._invalidM=!1, this._invalidW=!0
            },
            add: function(a) {
                - 1 === this._children.indexOf(a) && (null !== a._parent && a._parent.remove(a), this._children.push(a), a._parent = this)
            },
            remove: function(a) {
                var b = this._children.indexOf(a);
                b>-1 && (this._children.splice(b, 1), a._parent = null)
            },
            invalidate: function() {
                this._invalidM=!0, this._invalidW=!0
            },
            updateMatrix: function() {
                this._invalidM && (f.fromRotationTranslationScale(this._matrix, this.rotation, this.position, this.scale), this._invalidM=!1)
            },
            updateWorldMatrix: function(a) {
                a=!!a, this.updateMatrix();
                var b = this._hasInvalidWorldMatrix(a);
                b && this._computeWorldMatrix(a);
                for (var c = 0; c < this._children.length; c++) {
                    var d = this._children[c];
                    d._invalidW = d._invalidW || b, d.updateWorldMatrix(!0)
                }
            },
            _computeWorldMatrix: function(a) {
                var b = this._parent;
                null !== b ? (!a && b._hasInvalidWorldMatrix(!1) && (b.updateMatrix(), b._computeWorldMatrix(!1)), f.multiply(this._wmatrix, b._wmatrix, this._matrix)) : f.copy(this._wmatrix, this._matrix), this._invalidW=!1
            },
            _hasInvalidWorldMatrix: function(a) {
                return this._invalidW ||!a && null !== this._parent && this._parent._hasInvalidWorldMatrix(!1)
            }
        }, b.exports = d
    }, {
        "./math": 127,
        "gl-matrix/src/gl-matrix/mat3": 117,
        "gl-matrix/src/gl-matrix/mat4": 118,
        "gl-matrix/src/gl-matrix/quat": 119,
        "gl-matrix/src/gl-matrix/vec3": 121
    }
    ],
    129: [function(a, b, c) {
        function d(a) {
            this.ibl = null, this.prg = null, this.inputs = new f, this._prgcache = e.getCache(a), this._uid = "stddepth", this._precision = "highp", this._vertSrc = "precision highp float;\n#define GLSLIFY 1\n\nattribute vec3 aPosition;\n//attribute vec2 aTexCoord0;\n\nuniform mat4 uMVP;\n\nvarying vec2 fragZW;\n\n// #ifdef ALPHA_THRESHOLD\n//   varying mediump vec2 vTexCoord0;\n// #endif\n\nvoid main(void){\n  gl_Position = uMVP * vec4( aPosition, 1.0 );\n  fragZW=gl_Position.zw;\n\n  // #ifdef ALPHA_THRESHOLD\n  //   vTexCoord0=aTexCoord0;\n  // #endif\n}\n", this._fragSrc = "precision highp float;\n#define GLSLIFY 1\n\nvarying vec2 fragZW;\n\n// #ifdef ALPHA_THRESHOLD\n//   varying mediump vec2 vTexCoord0;\n//   uniform sampler2D tAGT;\n// #endif\n\nvec3 encodeDepthRGB(float depth){\n  vec4 c = vec4(1.0,255.0,65025.0,16581375.0)*depth;\n  c=fract(c);\n  c.xyz-=c.yzw*(1.0/255.0);\n  return c.xyz;\n}\n\nvoid main(void){\n\n  // #ifdef ALPHA_THRESHOLD\n  //   float alpha = texture2D(tAGT,vTexCoord0).r;\n  //   if(alpha<0.9){\n  //     discard;\n  //   }\n  // #endif\n\n  gl_FragColor.xyz = encodeDepthRGB( ( fragZW.x / fragZW.y ) * 0.5 + 0.5 );\n  gl_FragColor.w=0.0;\n}\n"
        }
        var e = (a("nanogl/program"), a("./lib/program-cache")), f = (a("./lib/input"), a("./lib/flag"), a("./lib/chunks-tree")), g = a("gl-matrix").mat4.create();
        d.prototype = {
            prepare: function(a, b) {
                this._isDirty() && this.compile();
                var c = this.prg;
                c.use(), c.setupInputs(this), b.modelViewProjectionMatrix(g, a._wmatrix), c.uMVP(g)
            },
            _isDirty: function() {
                return null === this.prg || this.inputs._isDirty
            },
            compile: function() {
                null !== this.prg && this._prgcache.release(this.prg), this.prg = this._prgcache.compile(this)
            }
        }, b.exports = d
    }, {
        "./lib/chunks-tree": 138,
        "./lib/flag": 140,
        "./lib/input": 141,
        "./lib/program-cache": 146,
        "gl-matrix": 113,
        "nanogl/program": 160
    }
    ],
    130: [function(a, b, c) {
        b.exports = function(a) {
            var b = "";
            return b += "// --------- SPEC\n{\n\n  vec3 H = normalize( uLDirDirections[" + a.index + "] + viewDir );\n  float NoH = sdot( H,worldNormal );\n  float sContib = specularMul * pow( NoH, roughness );\n  // -------- DIFFUSE\n  float dContrib = (1.0/3.141592) * sdot( uLDirDirections[" + a.index + "] ,worldNormal );\n\n  ", a.shadowIndex>-1 && (b += "\n  {\n    vec3 fragCoord = calcShadowPosition( uShadowTexelBiasVector[" + a.shadowIndex + "], uShadowMatrices[" + a.shadowIndex + "] , worldNormal, uShadowMapSize[" + a.shadowIndex + "].y );\n    float shOccl = calcLightOcclusions(tShadowMap" + a.shadowIndex + ",fragCoord,uShadowMapSize[" + a.shadowIndex + "]);\n    dContrib *= shOccl;\n    sContib  *= shOccl;\n  }\n  "), b += "\n\n  diffuseCoef   += dContrib * uLDirColors[" + a.index + "];\n  specularColor += sContib  * uLDirColors[" + a.index + "];\n\n}"
        }
    }, {}
    ],
    131: [function(a, b, c) {
        b.exports = function(a) {
            var b = "";
            return b += "#define NUM_D_LIGHTS " + a.count + "\n\n", a.count > 0 && (b += "\nuniform vec3 uLDirDirections [NUM_D_LIGHTS];\nuniform vec3 uLDirColors     [NUM_D_LIGHTS];\n"), b += "\n\n"
        }
    }, {}
    ],
    132: [function(a, b, c) {
        b.exports = function(a) {
            var b = "";
            b += "\n\n#define SHADOW_COUNT " + a.shadowCount + "\n\n";
            for (var c = 0; c < a.shadowCount; c++)
                b += "\n  uniform sampler2D tShadowMap" + c + ";\n";
            return b += "\n\n\n\n\nuniform highp vec2 uShadowKernelRotation;\nuniform highp mat4 uShadowMatrices[SHADOW_COUNT];\nuniform highp vec4 uShadowTexelBiasVector[SHADOW_COUNT];\nuniform       vec2 uShadowMapSize[SHADOW_COUNT];\n\n\nhighp float decodeDepthRGB(highp vec3 rgb){\n  return(rgb.x+rgb.y*(1.0/255.0))+rgb.z*(1.0/65025.0);\n}\n\n\n\nfloat resolveShadowNoFiltering(highp float fragZ, sampler2D depth,highp vec2 uv ){\n    return step( fragZ, decodeDepthRGB(texture2D(depth,uv.xy).xyz) );\n}\n\n\nfloat resolveShadow2x1(highp float fragZ, sampler2D depth,highp vec2 uv, vec2 mapSize ){\n\n  highp float coordsPx = uv.x*mapSize.x;\n  highp float uvMin = floor( coordsPx ) * mapSize.y;\n  highp float uvMax = ceil(  coordsPx ) * mapSize.y;\n\n  vec2 occl = vec2(\n    decodeDepthRGB(texture2D(depth,vec2( uvMin, uv.y )).xyz),\n    decodeDepthRGB(texture2D(depth,vec2( uvMax, uv.y )).xyz)\n  );\n\n  occl = step( vec2(fragZ), occl );\n\n  highp float ratio = coordsPx - uvMin*mapSize.x;\n  return ( ratio * occl.y + occl.x ) - ratio * occl.x;\n\n}\n\nfloat resolveShadow2x2(highp float fragZ, sampler2D depth,highp vec2 uv, vec2 mapSize ){\n\n  highp vec2 coordsPx = uv*mapSize.x;\n  highp vec2 uvMin=floor( coordsPx ) *mapSize.y;\n  highp vec2 uvMax=ceil(  coordsPx ) *mapSize.y;\n\n  vec4 occl = vec4(\n    decodeDepthRGB(texture2D(depth,uvMin).xyz),\n    decodeDepthRGB(texture2D(depth,vec2(uvMax.x,uvMin.y)).xyz),\n    decodeDepthRGB(texture2D(depth,vec2(uvMin.x,uvMax.y)).xyz),\n    decodeDepthRGB(texture2D(depth,uvMax).xyz)\n  );\n\n  occl = step( vec4(fragZ), occl );\n\n  highp vec2 ratio = coordsPx - uvMin*mapSize.x;\n  vec2  t = ( ratio.y * occl.zw + occl.xy ) - ratio.y * occl.xy;\n\n  return(ratio.x*t.y+t.x)-ratio.x*t.x;\n}\n\n\nfloat calcLightOcclusions(sampler2D depth, highp vec3 fragCoord, vec2 mapSize ){\n  float s;\n\n  highp vec2 kernelOffset = uShadowKernelRotation * ( 4.0 / mapSize.x );\n\n  // NO FILTER\n  #if shadowFilter( PCFNONE )\n    s = resolveShadowNoFiltering( fragCoord.z, depth, fragCoord.xy );\n\n\n  // PCF4x1\n  #elif shadowFilter( PCF4x1 )\n\n    s = resolveShadowNoFiltering( fragCoord.z, depth, fragCoord.xy + kernelOffset                    );\n    s+= resolveShadowNoFiltering( fragCoord.z, depth, fragCoord.xy - kernelOffset                    );\n    s+= resolveShadowNoFiltering( fragCoord.z, depth, fragCoord.xy + vec2(-kernelOffset.y,kernelOffset.x)  );\n    s+= resolveShadowNoFiltering( fragCoord.z, depth, fragCoord.xy + vec2(kernelOffset.y,-kernelOffset.x)  );\n    s /= 4.0;\n\n  // PCF4x4\n  #elif shadowFilter( PCF4x4 )\n\n    s = resolveShadow2x2( fragCoord.z, depth, fragCoord.xy + kernelOffset                        , mapSize );\n    s+=resolveShadow2x2( fragCoord.z, depth, fragCoord.xy - kernelOffset                         , mapSize );\n    s+=resolveShadow2x2( fragCoord.z, depth, fragCoord.xy + vec2(-kernelOffset.y,kernelOffset.x) , mapSize );\n    s+=resolveShadow2x2( fragCoord.z, depth, fragCoord.xy + vec2(kernelOffset.y,-kernelOffset.x) , mapSize );\n    s /= 4.0;\n\n  // PCF2x2\n  #elif shadowFilter( PCF2x2 )\n\n    s = resolveShadow2x1( fragCoord.z, depth, fragCoord.xy + kernelOffset , mapSize);\n    s +=resolveShadow2x1( fragCoord.z, depth, fragCoord.xy - kernelOffset , mapSize);\n    s /= 2.0;\n\n  #endif\n\n  return s;\n\n}\n\n\n\nvec3 calcShadowPosition( vec4 texelBiasVector, mat4 shadowProjection, vec3 worldNormal, float invMapSize )\n{\n  float WoP = dot( texelBiasVector, vec4( vWorldPosition, 1.0 ) );\n\n  WoP *= .0005+2.0*invMapSize;\n\n  highp vec4 fragCoord = shadowProjection * vec4( vWorldPosition + WoP * worldNormal, 1.0);\n  return fragCoord.xyz / fragCoord.w;\n}\n\n\n"
        }
    }, {}
    ],
    133: [function(a, b, c) {
        b.exports = function(a) {
            var b = "";
            return b += "{\n\n  vec3 lightDir= uLSpotPositions[" + a.index + "] - vWorldPosition;\n  float invLightDist=inversesqrt(dot(lightDir,lightDir));\n  lightDir *= invLightDist;\n\n  // spot effect\n  float falloff = saturate( uLSpotFalloff[" + a.index + "].z / invLightDist );\n  falloff = 1.0 + falloff * ( uLSpotFalloff[" + a.index + "].x + uLSpotFalloff[" + a.index + "].y * falloff );\n\n  float s = saturate( dot( lightDir, uLSpotDirections[" + a.index + "] ) );\n  s = saturate( uLSpotSpot[" + a.index + "].x-uLSpotSpot[" + a.index + "].y * (1.0-s*s) );\n\n  vec3 lightContrib = (falloff *s ) * uLSpotColors[" + a.index + "];\n\n\n  // --------- SPEC\n  vec3 H = normalize( lightDir + viewDir );\n  float NoH = sdot( H,worldNormal );\n  float sContrib = specularMul * pow( NoH, roughness );\n  // -------- DIFFUSE\n  float dContrib = (1.0/3.141592) * sdot( lightDir, worldNormal );\n\n  ", a.shadowIndex>-1 && (b += "\n  {\n    vec3 fragCoord = calcShadowPosition( uShadowTexelBiasVector[" + a.shadowIndex + "], uShadowMatrices[" + a.shadowIndex + "] , worldNormal, uShadowMapSize[" + a.shadowIndex + "].y );\n    float shOccl = calcLightOcclusions(tShadowMap" + a.shadowIndex + ",fragCoord,uShadowMapSize[" + a.shadowIndex + "]);\n    dContrib *= shOccl;\n    sContrib  *= shOccl;\n    // sContrib = sin( decodeDepthRGB(texture2D(tShadowMap" + a.shadowIndex + ",fragCoord.xy).xyz)*200.0);\n    // dContrib = sin( decodeDepthRGB(texture2D(tShadowMap" + a.shadowIndex + ",fragCoord.xy).xyz)*200.0);\n\n    // diffuseCoef = vec3( decodeDepthRGB(texture2D(tShadowMap" + a.shadowIndex + ",fragCoord.xy).xyz ) );\n  }\n  "), b += "\n\n\n  diffuseCoef   += dContrib * lightContrib;\n  specularColor += sContrib  * lightContrib;\n\n  // specularColor *= 0.0;\n\n}"
        }
    }, {}
    ],
    134: [function(a, b, c) {
        b.exports = function(a) {
            var b = "";
            return b += "#define NUM_S_LIGHTS " + a.count + "\n\n", a.count > 0 && (b += "\nuniform vec3 uLSpotPositions  [NUM_S_LIGHTS];\nuniform vec3 uLSpotFalloff    [NUM_S_LIGHTS];\nuniform vec2 uLSpotSpot       [NUM_S_LIGHTS];\nuniform vec3 uLSpotDirections [NUM_S_LIGHTS];\nuniform vec3 uLSpotColors     [NUM_S_LIGHTS];\n"), b += "\n\n"
        }
    }, {}
    ],
    135: [function(a, b, c) {
        function d(a, b) {
            this.env = a, this.sh = b, this._expoInput = new e("iblExpo", 2, e.ALL)
        }
        var e = a("./lib/input");
        a("./lib/flag");
        d.prototype = {
            getChunks: function() {
                return [this._expoInput.createProxy()]
            },
            setupProgram: function(a) {
                a.tEnv && a.tEnv(this.env), a.uSHCoeffs && a.uSHCoeffs(this.sh)
            }
        }, d.convert = function(a, b) {
            void 0 === b && (b = 1);
            var c = Math.sqrt(Math.PI), d = 1 / (2 * c), e = Math.sqrt(3) / (3 * c), f = Math.sqrt(15) / (8 * c), g = Math.sqrt(5) / (16 * c), h = .5 * f, i = new Float32Array(28);
            return i[0] = b * (e * a[6]), i[1] = b * ( - e * a[3]), i[2] = b * ( - e * a[9]), i[3] = b * (d * a[0] - g * a[18]), i[4] = b * (e * a[7]), i[5] = b * ( - e * a[4]), i[6] = b * ( - e * a[10]), i[7] = b * (d * a[1] - g * a[19]), i[8] = b * (e * a[8]), i[9] = b * ( - e * a[5]), i[10] = b * ( - e * a[11]), i[11] = b * (d * a[2] - g * a[20]), i[12] = b * (f * a[12]), i[13] = b * ( - f * a[15]), i[14] = b * (3 * g * a[18]), i[15] = b * ( - f * a[21]), i[16] = b * (f * a[13]), i[17] = b * ( - f * a[16]), i[18] = b * (3 * g * a[19]), i[19] = b * ( - f * a[22]), i[20] = b * (f * a[14]), i[21] = b * ( - f * a[17]), i[22] = b * (3 * g * a[20]), i[23] = b * ( - f * a[23]), i[24] = b * (h * a[24]), i[25] = b * (h * a[25]), i[26] = b * (h * a[26]), i[27] = 1 * b, i
        }, b.exports = d
    }, {
        "./lib/flag": 140,
        "./lib/input": 141
    }
    ],
    136: [function(a, b, c) {
        function d() {
            this.min = new Float32Array(3), this.max = new Float32Array(3), this.center = new Float32Array(3), this.radius = new Float32Array(3)
        }
        d.prototype = {
            fromMinMax: function(a, b) {
                this.min.set(a), this.max.set(b), this._updateSphere()
            },
            addMinMax: function(a, b) {
                for (var c = 0; 3 > c; c++)
                    this.min[c] = Math.min(a[c], a[c]), this.max[c] = Math.max(b[c], b[c]);
                this._updateSphere()
            },
            addBounds: function(a) {
                this.addMinMax(a.min, a.max)
            },
            _updateSphere: function() {
                this.center[0] = .5 * (this.min[0] + this.max[0]), this.center[1] = .5 * (this.min[1] + this.max[1]), this.center[2] = .5 * (this.min[2] + this.max[2]), this.radius[0] = this.max[0] - this.center[0], this.radius[1] = this.max[1] - this.center[1], this.radius[2] = this.max[2] - this.center[2]
            }
        }, b.exports = d
    }, {}
    ],
    137: [function(a, b, c) {
        function d(a, b) {
            this.list = null, this.children = [], this.parent = null, this._hasCode=!!a, this._hasSetup=!!b, this._invalid=!0, this._proxies = []
        }
        function e(a) {
            d.call(this, a._hasCode, a._hasSetup), this._ref = a
        }
        d.prototype = {
            genCode: function(a) {
                return ""
            },
            getHash: function() {
                return ""
            },
            setup: function(a) {},
            add: function(a) {
                if (!(this.children.indexOf(a)>-1)) {
                    this.children.push(a), a.setList(this.list), a.parent = this;
                    for (var b = 0; b < this._proxies.length; b++)
                        this._proxies[b].add(a.createProxy());
                    return this.invalidate(), a
                }
            },
            remove: function(a) {
                var b = this.children.indexOf(a);
                b>-1 && (this.children.splice(b, 1), a.parent = null, a.removeProxies()), this.invalidate()
            },
            setList: function(a) {
                this.list = a, this.invalidate();
                for (var b = 0; b < this.children.length; b++)
                    this.children[b].setList(a)
            },
            traverse: function(a, b, c) {
                if ( - 1 === c.indexOf(this)) {
                    for (var d = 0; d < this.children.length; d++)
                        this.children[d].traverse(a, b, c);
                    this._hasSetup && a.push(this), this._hasCode && b.push(this), c.push(this)
                }
            },
            invalidate: function() {
                this.list && (this.list._isDirty=!0);
                for (var a = 0; a < this._proxies.length; a++)
                    this._proxies[a].invalidate()
            },
            createProxy: function() {
                var a = new e(this);
                return this._proxies.push(a), a
            },
            releaseProxy: function(a) {
                var b = this._proxies.indexOf(a);
                b>-1 && this._proxies.splice(b, 1)
            },
            removeProxies: function() {
                for (var a = 0; a < this._proxies.length; a++) {
                    var b = this._proxies[a];
                    null !== b.parent && b.parent.remove(b)
                }
            }
        }, e.prototype = Object.create(d.prototype), e.prototype.constructor = e, e.prototype.genCode = function(a) {
            this._ref.genCode(a)
        }, e.prototype.getHash = function() {
            return this._ref.getHash()
        }, e.prototype.setup = function(a) {
            this._ref.setup(a)
        }, e.prototype.release = function() {
            this._ref.releaseProxy(this), this._ref = null
        }, d.Proxy = e, b.exports = d
    }, {}
    ],
    138: [function(a, b, c) {
        function d() {
            this.slots = [], this.slotsMap = {}
        }
        function e(a) {
            this.material = a, this._setups = [], this._codes = [], this._flat = [], this._root = new f, this._root.list = this, this._isDirty=!0
        }
        var f = a("./chunk");
        d.prototype = {
            getSlot: function(a) {
                var b = this.slotsMap[a];
                return void 0 === b && (b = {
                    key: a,
                    code: ""
                }, this.slotsMap[a] = b, this.slots.push(b)), b
            },
            add: function(a, b) {
                this.getSlot(a).code += b + "\n"
            }
        }, e.prototype = {
            add: function(a) {
                return this._root.add(a)
            },
            addChunks: function(a) {
                for (var b = 0; b < a.length; b++)
                    this._root.add(a[b])
            },
            compile: function() {
                this._flatten()
            },
            _flatten: function() {
                var a = this._setups, b = this._codes, c = this._flat;
                a.length = 0, b.length = 0, c.length = 0, this._root.traverse(a, b, c), this._isDirty=!1
            },
            getHash: function() {
                for (var a = this._codes, b = "", c = 0; c < a.length; c++)
                    b += a[c].getHash();
                return b
            },
            getCode: function() {
                for (var a = this._codes, b = new d, c = 0; c < a.length; c++)
                    a[c].genCode(b);
                return b
            }
        }, b.exports = e
    }, {
        "./chunk": 137
    }
    ],
    139: [function(a, b, c) {
        function d(a, b) {
            e.call(this, !0, !1), this.name = a, this.values = b, this._val = b[0]
        }
        var e = a("./chunk");
        d.prototype = Object.create(e.prototype), d.prototype.constructor = d, d.prototype.set = function(a) {
            if (this._val !== a) {
                if (null !== a&&-1 === this.values.indexOf(a))
                    throw new Error("invalide Enum value :" + a);
                this._val = a, this.invalidate()
            }
        }, d.prototype.genCode = function(a) {
            for (var b = "", c = 0; c < this.values.length; c++)
                b += "#define " + this.values[c] + " " + (c + 1) + "\n";
            b += "#define VAL_" + this.name + " " + this._val + "\n", b += "#define " + this.name + "(k) VAL_" + this.name + " == k\n", a.add("pf", b), a.add("pv", b)
        }, d.prototype.getHash = function() {
            return this.values.indexOf(this._val) + "/" + this.name
        }, b.exports = d
    }, {
        "./chunk": 137
    }
    ],
    140: [function(a, b, c) {
        function d(a, b) {
            e.call(this, !0, !1), this.name = a, this._val=!!b
        }
        var e = a("./chunk");
        d.prototype = Object.create(e.prototype), d.prototype.constructor = d, d.prototype.enable = function() {
            this.set(!0)
        }, d.prototype.disable = function() {
            this.set(!1)
        }, d.prototype.set = function(a) {
            a=!!a, this._val !== a && (this._val = a, this.invalidate())
        }, d.prototype.genCode = function(a) {
            var b;
            b = "#define " + this.name + " "+~~this._val + "\n", a.add("pf", b), a.add("pv", b)
        }, d.prototype.getHash = function() {
            return this.name + "-"+~~this._val
        }, b.exports = d
    }, {
        "./chunk": 137
    }
    ],
    141: [function(a, b, c) {
        function d(a, b) {
            var c = a.length;
            if (c === b)
                return a;
            if (c > b)
                return a.substr(0, b);
            for (var d = a[c - 1]; a.length < b;)
                a += d;
            return a
        }
        function e(a) {
            return a.toPrecision(8)
        }
        function f(a, b, c) {
            0 !== (b & o) && a.add("f", c), 0 !== (b & p) && a.add("v", c)
        }
        function g(a, b, c) {
            0 !== (b & o) && a.add("pf", c), 0 !== (b & p) && a.add("pv", c)
        }
        function h(a, b, c) {
            m.call(this, !0, !1), this.name = a, this.size = b, this.param = null, this.comps = d("rgba", b), this.shader = c || o
        }
        function i(a, b) {
            m.call(this, !0, !0), this._input = null, this.name = a, this.texCoords = b, this._tex = null, this.size = 4, this._linkAttrib = b instanceof k, this._linkAttrib ? (this.add(b), this.uvsToken = this.texCoords.token) : this.uvsToken = this.texCoords, this.token = "VAL_" + this.name + this.uvsToken
        }
        function j(a, b) {
            m.call(this, !0, !0), this._input = null, this.name = a, this.size = b, this._value = new Float32Array(b), this.token = this.name
        }
        function k(a, b) {
            m.call(this, !0, !1), this._input = null, this.name = a, this.size = b, this.token = "v_" + this.name
        }
        function l(a) {
            m.call(this, !0, !1), this._input = null, this.name = "CONST_" + (0 | 2147483647 * Math.random()).toString(16), Array.isArray(a) ? this.size = a.length : this.size = 1, this.value = a, this.token = "VAR_" + this.name
        }
        var m = a("./chunk"), n = [null, "float", "vec2", "vec3", "vec4"], o = 1, p = 2;
        h.prototype = Object.create(m.prototype), h.prototype.constructor = h, h.prototype.attach = function(a, b) {
            this.param && this.remove(this.param), a._input = this, this.param = a, this.add(a), void 0 === b && (b = "rgba"), this.comps = d(b, this.size)
        }, h.prototype.detach = function() {
            this.param && (this.param._input = null, this.remove(this.param)), this.param = null
        }, h.prototype.attachSampler = function(a, b, c) {
            var d = new i(a, b);
            return this.attach(d, c), d
        }, h.prototype.attachUniform = function(a, b, c) {
            var d = new j(a, b || this.size);
            return this.attach(d, c), d
        }, h.prototype.attachAttribute = function(a, b, c) {
            var d = new k(a, b || this.size);
            return this.attach(d, c), d
        }, h.prototype.attachConstant = function(a, b) {
            var c = new l(a);
            return this.attach(c, b), c
        }, h.prototype.getHash = function() {
            var a = this.size + "-" + this.comps + "-" + this.name;
            return a
        }, h.prototype.genCode = function(a) {
            if (this.genAvailable(a), null !== this.param) {
                var b = "#define " + this.name + "(k) " + this.param.token;
                this.param.size > 1 && (b += "." + this.comps), g(a, this.shader, b)
            }
        }, h.prototype.genAvailable = function(a) {
            var b = null === this.param ? "0": "1", c = "#define HAS_" + this.name + " " + b + "\n";
            a.add("pv", c), a.add("pf", c)
        }, i.prototype = Object.create(m.prototype), i.prototype.constructor = i, i.prototype.set = function(a) {
            this._tex = a
        }, i.prototype.genCode = function(a) {
            var b, c = this.name;
            b = "uniform sampler2D " + c + ";\n", g(a, this._input.shader, b), b = "vec4 " + this.token + " = texture2D( " + c + ", " + this.uvsToken + ");\n", f(a, this._input.shader, b)
        }, i.prototype.setup = function(a) {
            a[this.name](this._tex)
        }, i.prototype.getHash = function() {
            return (this._linkAttrib ? "" : this.texCoords) + "-" + this.name
        }, j.prototype = Object.create(m.prototype), j.prototype.constructor = j, j.prototype.set = function() {
            for (var a = 0; a < arguments.length; a++)
                this._value[a] = arguments[a];
            this._invalid=!0
        }, j.prototype.genCode = function(a) {
            var b;
            b = "uniform " + n[this.size] + " " + this.token + ";\n", g(a, this._input.shader, b)
        }, j.prototype.setup = function(a) {
            a[this.name](this._value), this._invalid=!1
        }, j.prototype.getHash = function() {
            return this.size + "-" + this.name
        }, k.prototype = Object.create(m.prototype), k.prototype.constructor = k, k.prototype.genCode = function(a) {
            var b;
            b = "varying " + n[this.size] + " " + this.token + ";\n", a.add("pf", b), b = "attribute " + n[this.size] + " " + this.name + ";\n", b += "varying   " + n[this.size] + " " + this.token + ";\n", a.add("pv", b), b = this.token + " = " + this.name + ";\n", a.add("v", b)
        }, k.prototype.getHash = function() {
            return this.size + "-" + this.name
        }, l.prototype = Object.create(m.prototype), l.prototype.constructor = l, l.prototype.genCode = function(a) {
            var b;
            b = "#define " + this.token + " " + n[this.size] + "(" + this._stringifyValue() + ")\n", g(a, this._input.shader, b)
        }, l.prototype._stringifyValue = function() {
            return 1 === this.size ? this.value.toString() : this.value.map(e).join(",")
        }, l.prototype.getHash = function() {
            return this._stringifyValue() + "-" + this.size + "-" + this.name
        }, h.Sampler = i, h.Uniform = j, h.Attribute = k, h.Constant = l, h.FRAGMENT = o, h.VERTEX = p, h.ALL = p | o, b.exports = h
    }, {
        "./chunk": 137
    }
    ],
    142: [function(a, b, c) {
        function d(a) {
            e.call(this, a), this._type = e.TYPE_DIR
        }
        var e = a("./light"), f = a("../../glsl/templates/directional-light"), g = a("nanogl-camera"), h = new Float32Array(4);
        d.prototype = Object.create(e.prototype), d.prototype.constructor = d, d.prototype.genCode = function(a, b) {
            var c = {
                index: a,
                shadowIndex: b
            };
            return f(c)
        }, d.prototype.projectionFromBounds = function(a) {
            var b = this.boundsInLocalSpace(a);
            this._camera.lens.near =- b[5], this._camera.lens.far =- b[2], this._camera.lens.setBound(b[0], b[3], b[1], b[4])
        }, d.prototype.getTexelBiasVector = function() {
            var a = this._camera.lens;
            return h[3] = Math.max(a._xMax - a._xMin, a._yMax - a._yMin), h
        }, d.prototype._createCamera = function() {
            return g.makeOrthoCamera()
        }, b.exports = d
    }, {
        "../../glsl/templates/directional-light": 130,
        "./light": 144,
        "nanogl-camera": 124
    }
    ],
    143: [function(a, b, c) {
        function d() {
            this._datas = {}, this._dataList = [];
            var a;
            this.commonChunk = new e, this.shadowChunk = new f(this), this.shadowFilter = new l("shadowFilter", ["PCFNONE", "PCF4x1", "PCF4x4", "PCF2x2"]), a = new i, this._datas[j.TYPE_DIR] = a, this._dataList.push(a), a = new h, this._datas[j.TYPE_SPOT] = a, this._dataList.push(a), this.bounds = new m
        }
        function e() {
            k.call(this, !0, !1)
        }
        function f(a) {
            k.call(this, !0, !0), this.lightSetup = a, this.shadowCount = 0, this.genCount = 0, this._matrices = new Float32Array(16 * q), this._texelBiasVector = new Float32Array(4 * q), this._shadowmapSizes = new Float32Array(2 * q), this._umatrices = null, this._utexelBiasVector = null, this._ushadowmapSizes = null
        }
        function g() {
            k.call(this, !0, !0), this.type = 0, this.lights = [], this.shadowIndices = [], this.preCodeTemplate = null
        }
        function h() {
            g.call(this), this.type = j.TYPE_SPOT, this._directions = null, this._colors = null, this._positions = null, this._spot = null, this._falloff = null, this.preCodeTemplate = o
        }
        function i() {
            g.call(this), this.type = j.TYPE_DIR, this._directions = null, this._colors = null, this.preCodeTemplate = n
        }
        var j = a("./light"), k = a("../chunk"), l = a("../enum"), m = a("../bounds"), n = a("../../glsl/templates/directional-lights-pre"), o = a("../../glsl/templates/spot-lights-pre"), p = a("../../glsl/templates/shadow-maps-pre");
        d.prototype = {
            add: function(a) {
                var b = this._datas[a._type];
                b.addLight(a)
            },
            remove: function(a) {
                var b = this._datas[a._type];
                b.removeLight(a)
            },
            update: function() {
                this.shadowChunk.shadowCount = 0;
                for (var a = 0; a < this._dataList.length; a++)
                    this._dataList[a].update(this);
                this.shadowChunk.check()
            },
            getChunks: function() {
                for (var a = [], b = 0; b < this._dataList.length; b++)
                    a[b] = this._dataList[b].createProxy();
                return a.unshift(this.commonChunk.createProxy()), a.unshift(this.shadowChunk.createProxy()), a.unshift(this.shadowFilter.createProxy()), a
            }
        }, e.prototype = Object.create(k.prototype), e.prototype.constructor = e, e.prototype.genCode = function(a) {
            code = "highp float roughness = -10.0 / log2( gloss()*0.968+0.03 );\nroughness *= roughness;\nfloat specularMul = roughness * (0.125/3.141592) + 0.5/3.141592;\n", a.add("lightsf", code)
        }, e.prototype.getHash = function() {
            return "0"
        };
        var q = 4;
        f.prototype = Object.create(k.prototype), f.prototype.constructor = f;
        var r = Math.PI / 4;
        f.prototype.genCode = function(a) {
            this.shadowCount > 0 && a.add("pf", p(this))
        }, f.prototype.addLight = function(a) {
            var b = this.shadowCount;
            this.shadowCount++, this._matrices.set(a.getShadowProjection(this.lightSetup.bounds), 16 * b), this._texelBiasVector.set(a.getTexelBiasVector(), 4 * b);
            var c = a._shadowmapSize;
            return this._shadowmapSizes[2 * b + 0] = c, this._shadowmapSizes[2 * b + 1] = 1 / c, b
        }, f.prototype.getHash = function() {
            return this.shadowCount
        }, f.prototype.check = function() {
            this.genCount !== this.shadowCount && (this.genCount = this.shadowCount, this._umatrices = new Float32Array(this._matrices.buffer, 0, 16 * this.shadowCount), this._utexelBiasVector = new Float32Array(this._texelBiasVector.buffer, 0, 4 * this.shadowCount), this._ushadowmapSizes = new Float32Array(this._shadowmapSizes.buffer, 0, 2 * this.shadowCount), this.invalidate()), this._invalid=!0
        }, f.prototype.setup = function(a) {
            this.shadowCount > 0 && (a.uShadowMatrices(this._umatrices), a.uShadowTexelBiasVector(this._utexelBiasVector), a.uShadowMapSize(this._ushadowmapSizes), a.uShadowKernelRotation(.5 * Math.cos(r), .5 * Math.sin(r)), this._invalid=!1)
        }, g.prototype = Object.create(k.prototype), g.prototype.constructor = g, g.prototype.addLight = function(a) {
            - 1 === this.lights.indexOf(a) && (this.lights.push(a), this.shadowIndices.push( - 1), this.invalidate())
        }, g.prototype.removeLight = function(a) {
            var b = this.lights.indexOf(a);
            b>-1 && (this.lights.splice(b, 1), this.shadowIndices.splice(b, 1), this.invalidate())
        }, g.prototype.genCode = function(a) {
            var b = this.preCodeTemplate({
                count: this.lights.length
            });
            a.add("pf", b), b = "";
            for (var c = 0; c < this.lights.length; c++)
                b += this.lights[c].genCode(c, this.shadowIndices[c]);
            a.add("lightsf", b)
        }, g.prototype.getHash = function() {
            for (var a = this.type + "" + this.lights.length, b = 0; b < this.lights.length; b++)
                this.lights[b]._castShadows && (a += b);
            return a
        }, g.prototype.setup = function(a) {
            for (var b = 0; b < this.shadowIndices.length; b++) {
                var c = this.shadowIndices[b];
                c>-1 && a["tShadowMap" + c](this.lights[b]._fbo.color)
            }
        }, h.prototype = Object.create(g.prototype), h.prototype.constructor = h, h.prototype.allocate = function(a) {
            null !== this._colors && this._colors.length / 3 === a || (this._directions = new Float32Array(3 * a), this._colors = new Float32Array(3 * a), this._positions = new Float32Array(3 * a), this._spot = new Float32Array(2 * a), this._falloff = new Float32Array(3 * a))
        }, h.prototype.update = function(a) {
            var b = this.lights;
            this.allocate(b.length);
            for (var c = 0; c < b.length; c++) {
                var d = b[c];
                if (this._directions.set(d._wdir, 3 * c * 4), this._colors.set(d._color, 3 * c * 4), this._positions.set(d._wposition, 3 * c * 4), this._spot.set(d._spotData, 2 * c * 4), this._falloff.set(d._falloffData, 3 * c * 4), d._castShadows) {
                    var e = a.shadowChunk.addLight(d);
                    this.shadowIndices[c] !== e && this.invalidate(), this.shadowIndices[c] = e
                } else 
                    this.shadowIndices[c] =- 1
            }
            this._invalid=!0
        }, h.prototype.setup = function(a) {
            this.lights.length > 0 && (g.prototype.setup.call(this, a), a.uLSpotDirections(this._directions), a.uLSpotColors(this._colors), a.uLSpotPositions(this._positions), a.uLSpotSpot(this._spot), a.uLSpotFalloff(this._falloff), this._invalid=!1)
        }, i.prototype = Object.create(g.prototype), i.prototype.constructor = i, i.prototype.allocate = function(a) {
            null !== this._colors && this._colors.length / 3 === a || (this._directions = new Float32Array(3 * a), this._colors = new Float32Array(3 * a))
        }, i.prototype.update = function(a) {
            var b = this.lights;
            this.allocate(b.length);
            for (var c = 0; c < b.length; c++) {
                var d = b[c];
                if (this._directions.set(d._wdir, 3 * c * 4), this._colors.set(d._color, 3 * c * 4), d._castShadows) {
                    var e = a.shadowChunk.addLight(d);
                    this.shadowIndices[c] !== e && this.invalidate(), this.shadowIndices[c] = e
                } else 
                    this.shadowIndices[c] =- 1
            }
            this._invalid=!0
        }, i.prototype.setup = function(a) {
            this.lights.length > 0 && (g.prototype.setup.call(this, a), a.uLDirDirections(this._directions), a.uLDirColors(this._colors), this._invalid=!1)
        }, b.exports = d
    }, {
        "../../glsl/templates/directional-lights-pre": 131,
        "../../glsl/templates/shadow-maps-pre": 132,
        "../../glsl/templates/spot-lights-pre": 134,
        "../bounds": 136,
        "../chunk": 137,
        "../enum": 139,
        "./light": 144
    }
    ],
    144: [function(a, b, c) {
        function d(a) {
            e.call(this), this.gl = a, this._type = 0, this._color = new Float32Array([1, 1, 1]), this._wdir = new Float32Array(this._wmatrix.buffer, 32, 3), this._castShadows=!1, this._fbo = null, this._camera = null, this._shadowmapSize = 512
        }
        var e = a("nanogl-node"), f = a("nanogl/fbo"), g = a("gl-matrix/src/gl-matrix/mat4"), h = a("gl-matrix/src/gl-matrix/vec3"), i = new Float32Array([.5, 0, 0, 0, 0, .5, 0, 0, 0, 0, .5, 0, .5, .5, .5, 1]), j = g.create(), k = new Float32Array(6), l = h.create();
        d.prototype = Object.create(e.prototype), d.prototype.constructor = d, d.prototype.getShadowProjection = function(a) {
            return this.projectionFromBounds(a), this._camera.updateViewProjectionMatrix(1, 1), g.multiply(j, i, this._camera._viewProj), j
        }, d.prototype.castShadows = function(a) {
            this._castShadows !== a && (this._castShadows = a, a ? this._initShadowMapping() : this._releaseShadowMapping())
        }, d.prototype._initShadowMapping = function(a) {
            var b = this._shadowmapSize;
            this._fbo = new f(this.gl, b, b, {
                depth: !0,
                format: this.gl.RGB
            }), this._fbo.color.setFilter(!1, !1, !1), this._camera = this._createCamera(), this.add(this._camera)
        }, d.prototype._releaseShadowMapping = function(a) {
            this._fbo.dispose(), this._fbo = null, this.remove(this._camera), this._camera = null
        }, d.prototype._createCamera = function() {}, d.prototype.prepareShadowmap = function() {
            var a = this._shadowmapSize;
            this._fbo.resize(a, a), this._fbo.bind()
        }, d.prototype.boundsInLocalSpace = function(a) {
            k[0] = k[1] = k[2] = Number.MAX_VALUE, k[3] = k[4] = k[5] =- Number.MAX_VALUE;
            for (var b = 0; 8 > b; b++)
                l[0] = 1 & b ? a.max[0] : a.min[0], l[1] = 2 & b ? a.max[1] : a.min[1], l[2] = 4 & b ? a.max[2] : a.min[2], h.transformMat4(l, l, this._camera._view), k[0] = Math.min(k[0], l[0]),
                k[1] = Math.min(k[1], l[1]), k[2] = Math.min(k[2], l[2]), k[3] = Math.max(k[3], l[0]), k[4] = Math.max(k[4], l[1]), k[5] = Math.max(k[5], l[2]);
            return k
        }, d.TYPE_DIR = 1, d.TYPE_SPOT = 2, b.exports = d
    }, {
        "gl-matrix/src/gl-matrix/mat4": 118,
        "gl-matrix/src/gl-matrix/vec3": 121,
        "nanogl-node": 128,
        "nanogl/fbo": 157
    }
    ],
    145: [function(a, b, c) {
        function d(a) {
            e.call(this, a), this._type = e.TYPE_SPOT, this._spotData = new Float32Array(2), this._falloffData = new Float32Array(3), this._angle = 0, this._sharpness = 0, this._radius = 0, this._falloffCurve = 0, this.angle = Math.PI / 4, this.sharpness = 0, this.radius = 50, this.falloffCurve = 2
        }
        var e = a("./light"), f = a("../../glsl/templates/spot-light"), g = a("nanogl-camera"), h = new Float32Array(4);
        d.prototype = Object.create(e.prototype), d.prototype.constructor = d, d.prototype.genCode = function(a, b) {
            var c = {
                index: a,
                shadowIndex: b
            };
            return f(c)
        }, d.prototype.projectionFromBounds = function(a) {
            var b = this.boundsInLocalSpace(a), c =- b[2], d =- b[5];
            c = Math.min(c, 1 / this._falloffData[2]), d = Math.max(.005 * c, d), this._camera.lens.near = d, this._camera.lens.far = c
        }, d.prototype.getTexelBiasVector = function() {
            var a = this._camera._view, b =- 2 * Math.tan(this._angle);
            return h[0] = a[2] * b, h[1] = a[6] * b, h[2] = a[10] * b, h[3] = a[14] * b, h
        }, d.prototype._createCamera = function() {
            var a = g.makePerspectiveCamera();
            return a.lens.aspect = 1, a.lens.fov = this._angle, a.lens.near = 10, a.lens.far = 20, a
        }, Object.defineProperty(d.prototype, "angle", {
            get: function() {
                return this._angle
            },
            set: function(a) {
                this._angle = a, this._updateSpotData(), this._castShadows && (this._camera.lens.fov = this._angle)
            }
        }), Object.defineProperty(d.prototype, "sharpness", {
            get: function() {
                return this._sharpness
            },
            set: function(a) {
                this._sharpness = a, this._updateSpotData()
            }
        }), Object.defineProperty(d.prototype, "radius", {
            get: function() {
                return this._radius
            },
            set: function(a) {
                this._radius = a, this._updateFalloffData()
            }
        }), Object.defineProperty(d.prototype, "falloffCurve", {
            get: function() {
                return this._falloffCurve
            },
            set: function(a) {
                this._falloffCurve = a, this._updateFalloffData()
            }
        }), d.prototype._updateSpotData = function() {
            this._spotData[0] = 1 + 100 * this._sharpness, this._spotData[1] = 2 / (1 - Math.cos(this._angle)) * this._spotData[0]
        }, d.prototype._updateFalloffData = function() {
            this._falloffData[0] =- this._falloffCurve, this._falloffData[1] =- 1 + this._falloffCurve, this._falloffData[2] = 1 / this._radius
        }, b.exports = d
    }, {
        "../../glsl/templates/spot-light": 133,
        "./light": 144,
        "nanogl-camera": 124
    }
    ],
    146: [function(a, b, c) {
        function d(a) {
            this.gl = a, this._cache = {}
        }
        var e = a("./program"), f = "#pragma SLOT", g = /^\s*#pragma SLOT\s\w+\s*$/gm;
        d.prototype = {
            compile: function(a) {
                var b = a.inputs;
                b.compile(), hash = b.getHash(), hash += a._uid + a._precision;
                var c = this._cache[hash];
                if (void 0 !== c)
                    return c.usage++, c;
                var d = b.getCode(), f = this.processSlots(a._vertSrc, d), g = this.processSlots(a._fragSrc, d), h = "precision " + a._precision + " float;\n", i = new e(this.gl, f, g, h);
                return i._usage++, this._cache[hash] = i, i
            },
            release: function(a) {},
            _addProgram: function(a, b) {
                this._cache[b] = a
            },
            processSlots: function(a, b) {
                for (var c = 0; c < b.slots.length; c++) {
                    var d = b.slots[c].code, e = b.slots[c].key;
                    a = a.replace(f + " " + e, d)
                }
                return g.lastIndex = 0, a = a.replace(g, "")
            }
        }, d.getCache = function(a) {
            return void 0 === a._prgcache && (a._prgcache = new d(a)), a._prgcache
        }, b.exports = d
    }, {
        "./program": 147
    }
    ],
    147: [function(a, b, c) {
        function d(a, b, c, d) {
            e.call(this, a, b, c, d), this._usage = 0, this._currentMaterial = null
        }
        var e = a("nanogl/program");
        d.prototype = Object.create(e.prototype), d.prototype.constructor = d, d.prototype.setupInputs = function(a) {
            for (var b = a.inputs._setups, c=!0, d = 0; d < b.length; d++)(b[d]._invalid || c) 
                && b[d].setup(this);
            this._currentMaterial = a
        }, b.exports = d
    }, {
        "nanogl/program": 160
    }
    ],
    148: [function(a, b, c) {
        function d(a) {
            this.ibl = null, this.prg = null, this._mask = 1, this.inputs = new i, this.iAlbedo = this.inputs.add(new g("albedo", 3)), this.iSpecular = this.inputs.add(new g("specular", 3)), this.iGloss = this.inputs.add(new g("gloss", 1)), this.iNormal = this.inputs.add(new g("normal", 3)), this.iOcclusion = this.inputs.add(new g("occlusion", 1)), this.iCavity = this.inputs.add(new g("cavity", 1)), this.iCavityStrength = this.inputs.add(new g("cavityStrength", 2)), this.iFresnel = this.inputs.add(new g("fresnel", 3)), this.conserveEnergy = this.inputs.add(new h("conserveEnergy", !0)), this.perVertexIrrad = this.inputs.add(new h("perVertexIrrad", !1)), this.glossNearest = this.inputs.add(new h("glossNearest", !1)), this.config = new e, this._prgcache = f.getCache(a), this._uid = "std", this._precision = "highp", this._vertSrc = '#define GLSLIFY 1\n#pragma SLOT pv\n\nattribute vec3 aPosition;\nattribute vec2 aTexCoord;\nattribute vec3 aNormal;\nattribute vec3 aTangent;\nattribute vec3 aBitangent;\n\nuniform mat4 uMVP;\nuniform mat4 uWorldMatrix;\n\nvarying vec2 vTexCoord;\nvarying vec3 vWorldPosition;\n\nvarying mediump vec3 vWorldNormal;\n\n#if HAS_normal\n  varying mediump vec3 vWorldTangent;\n  varying mediump vec3 vWorldBitangent;\n#endif\n\n#if perVertexIrrad\n  varying vec3 vIrradiance;\n  uniform vec4 uSHCoeffs[7];\n  \n// ================================\n// compute Spherical Harmonics\n// ================================\n//\n// "Stupid Spherical Harmonics (SH) Tricks"\n// http://www.ppsloan.org/publications/StupidSH36.pdf\n//\n//\nvec3 SampleSH( vec3 Normal, vec4 shCoefs[7] )\n{\n  Normal.xz = Normal.zx;\n  vec4 NormalVector = vec4(Normal, 1.0);\n\n  // todo transpose coeffs directly\n  // NormalVector.xyz = NormalVector.zyx;\n\n  vec3 X0, X1, X2;\n  X0.x = dot( shCoefs[0].xyz, Normal) + shCoefs[0].w;\n  X0.y = dot( shCoefs[1].xyz, Normal) + shCoefs[1].w;\n  X0.z = dot( shCoefs[2].xyz, Normal) + shCoefs[2].w;\n\n  vec4 vB = NormalVector.zyxx * NormalVector.yxxz;\n  X1.x = dot( shCoefs[3].xyz, vB.xyz) + (shCoefs[3].w * vB.w);\n  X1.y = dot( shCoefs[4].xyz, vB.xyz) + (shCoefs[4].w * vB.w);\n  X1.z = dot( shCoefs[5].xyz, vB.xyz) + (shCoefs[5].w * vB.w);\n\n  float vC = NormalVector.z * NormalVector.z - NormalVector.y * NormalVector.y;\n  X2 =  shCoefs[6].xyz * vC;\n\n  return ( X0 + X1 + X2 );\n//  return max( vec3(0.0) , X0 + X1 + X2 );\n}\n\n#endif\n\nvec3 rotate( mat4 m, vec3 v )\n{\n  return m[0].xyz*v.x + m[1].xyz*v.y + m[2].xyz*v.z;\n}\n\nvoid main( void ){\n\n  #pragma SLOT v\n\n  vec4 pos = vec4( aPosition, 1.0 );\n\n  gl_Position    = uMVP         * pos;\n  vWorldPosition = (uWorldMatrix * pos).xyz;\n\n  vWorldNormal    = rotate( uWorldMatrix, aNormal );\n  #if HAS_normal\n    vWorldTangent   = rotate( uWorldMatrix, aTangent );\n    vWorldBitangent = rotate( uWorldMatrix, aBitangent );\n  #endif\n\n  #if perVertexIrrad\n    vIrradiance = SampleSH(vWorldNormal, uSHCoeffs );\n    #if HAS_iblExpo\n      vIrradiance = iblExpo().x * pow( vIrradiance, vec3( iblExpo().y ) );\n    #endif\n  #endif\n\n  vTexCoord = aTexCoord;\n}', this._fragSrc = '#define GLSLIFY 1\n\n// #pragma Input vec3 normal\n// #pragma Enum ibl_type { NONE, SH7, SH9 }\n\nuniform vec3 uCameraPosition;\n\nvarying vec2 vTexCoord;\nvarying vec3 vWorldPosition;\n\nvarying mediump vec3 vWorldNormal;\n\n#pragma SLOT pf\n\n#if HAS_normal\n  varying mediump vec3 vWorldTangent;\n  varying mediump vec3 vWorldBitangent;\n#endif\n\n// IBL\n// ========\nuniform sampler2D tEnv;\n\n#if perVertexIrrad\n  varying vec3 vIrradiance;\n#else\n  uniform vec4 uSHCoeffs[7];\n  \n// ================================\n// compute Spherical Harmonics\n// ================================\n//\n// "Stupid Spherical Harmonics (SH) Tricks"\n// http://www.ppsloan.org/publications/StupidSH36.pdf\n//\n//\nvec3 SampleSH( vec3 Normal, vec4 shCoefs[7] )\n{\n  Normal.xz = Normal.zx;\n  vec4 NormalVector = vec4(Normal, 1.0);\n\n  // todo transpose coeffs directly\n  // NormalVector.xyz = NormalVector.zyx;\n\n  vec3 X0, X1, X2;\n  X0.x = dot( shCoefs[0].xyz, Normal) + shCoefs[0].w;\n  X0.y = dot( shCoefs[1].xyz, Normal) + shCoefs[1].w;\n  X0.z = dot( shCoefs[2].xyz, Normal) + shCoefs[2].w;\n\n  vec4 vB = NormalVector.zyxx * NormalVector.yxxz;\n  X1.x = dot( shCoefs[3].xyz, vB.xyz) + (shCoefs[3].w * vB.w);\n  X1.y = dot( shCoefs[4].xyz, vB.xyz) + (shCoefs[4].w * vB.w);\n  X1.z = dot( shCoefs[5].xyz, vB.xyz) + (shCoefs[5].w * vB.w);\n\n  float vC = NormalVector.z * NormalVector.z - NormalVector.y * NormalVector.y;\n  X2 =  shCoefs[6].xyz * vC;\n\n  return ( X0 + X1 + X2 );\n//  return max( vec3(0.0) , X0 + X1 + X2 );\n}\n\n#endif\n\n// MATH\n// =========\n#define saturate(x) clamp( x, 0.0, 1.0 )\n#define sdot( a, b ) saturate( dot(a,b) )\n\n// INCLUDES\n// =========\n\nvec2 octwrapDecode( vec3 v ) {\n  // Project the sphere onto the octahedron, and then onto the xy plan\n  vec2 p = v.xy / dot(  abs( v ) , vec3(1.0) );\n  p = vec2( p.x+p.y-1.0, p.x-p.y );\n\n  if( v.z < 0.0 )\n    p.x *= -1.0;\n\n  // p.x *= sign( v.z );\n  return p;\n}\n\nvec3 decodeRGBE( vec4 hdr ){\n  return hdr.rgb * exp2( (hdr.a*255.0)-128.0 );\n  // return hdr.rgb * pow( 2.0, (hdr.a*255.0)-128.0 );\n}\n\nconst vec2 _IBL_UVM_2281831123 = vec2(\n  0.25*(254.0/256.0),\n  0.125*0.5*(254.0/256.0)\n);\n\nvec3 SpecularIBL( sampler2D tEnv, vec3 skyDir, float roughness)\n{\n\n  vec2 uvA = octwrapDecode( skyDir );\n\n  float r7 = 7.0*roughness;\n  uvA = uvA * _IBL_UVM_2281831123 + vec2(\n      0.5,\n      0.125*0.5 + 0.125 * ( r7 - fract( r7 ) )\n    );\n\n  #if glossNearest\n\n    return decodeRGBE( texture2D(tEnv,uvA) );\n\n  #else\n\n    vec2 uvB=uvA+vec2(0.0,0.125);\n    return  mix(\n      decodeRGBE( texture2D(tEnv,uvA) ),\n      decodeRGBE( texture2D(tEnv,uvB) ),\n      frac\n    );\n\n  #endif\n\n}\n\n// Schlick approx\n// [Schlick 1994, "An Inexpensive BRDF Model for Physically-Based Rendering"]\n// https://github.com/EpicGames/UnrealEngine/blob/dff3c48be101bb9f84633a733ef79c91c38d9542/Engine/Shaders/BRDF.usf#L168\nvec3 F_Schlick( float VoH,vec3 specular,float gloss )\n{\n  float dot = gloss*gloss * pow( 1.0-VoH, 5.0 );\n  #if HAS_fresnel\n    return( 1.0 - dot )*specular + dot*fresnel();\n  #else\n    return( 1.0 - dot )*specular + dot;\n  #endif\n}\n\n// ------------------------------\n//\n\n#if HAS_normal\nvec3 perturbWorldNormal(vec3 n){\n  n = 2.0*n - 1.0;\n  vec3 nrm = gl_FrontFacing ? vWorldNormal : -vWorldNormal;\n  return normalize(vWorldTangent * n.x + vWorldBitangent*n.y + nrm * n.z );\n}\n#endif\n\n// ------------------------------\n//\nvec3 toneMap(vec3 c){\n  vec3 sqrtc = sqrt( c );\n  return(sqrtc-sqrtc*c) + c*(0.4672*c+vec3(0.5328));\n}\n\n//                MAIN\n// ===================\n\nvoid main( void ){\n\n  #pragma SLOT f\n\n  // -----------\n  vec3 worldNormal =\n    #if HAS_normal\n      perturbWorldNormal( normal() );\n    #else\n      gl_FrontFacing ? vWorldNormal : -vWorldNormal;\n    #endif\n  worldNormal = normalize( worldNormal );\n\n  // SH Irradiance diffuse coeff\n  // -------------\n  #if perVertexIrrad\n    vec3 diffuseCoef = vIrradiance;\n  #else\n    vec3 diffuseCoef=SampleSH(worldNormal, uSHCoeffs );\n    #if HAS_iblExpo\n      diffuseCoef = iblExpo().x * pow( diffuseCoef, vec3( iblExpo().y ) );\n    #endif\n  #endif\n\n  // IBL reflexion\n  // --------------\n\n  vec3 viewDir = normalize( uCameraPosition - vWorldPosition );\n  vec3 worldReflect = reflect( -viewDir, worldNormal );\n  vec3 specularColor = SpecularIBL( tEnv, worldReflect, 1.0-gloss() );\n  #if HAS_iblExpo\n    specularColor = iblExpo().x * pow( specularColor, vec3( iblExpo().y ) );\n  #endif\n\n  float NoV = sdot( viewDir, worldNormal );\n  vec3 specularSq = specular()*specular();\n  specularColor *= F_Schlick( NoV, specularSq, gloss() );\n\n  #pragma SLOT lightsf\n\n  vec3 alb = albedo();\n  #if conserveEnergy\n    alb = alb - alb * specular();\n  #endif\n  vec3 albedoSq = alb*alb;\n\n  #if HAS_occlusion\n    diffuseCoef *= occlusion();\n  #endif\n\n  #if HAS_cavity\n    diffuseCoef   *= cavity() * cavityStrength().r + (1.0-cavityStrength().r);\n    specularColor *= cavity() * cavityStrength().g + (1.0-cavityStrength().g);\n  #endif\n\n  gl_FragColor.xyz = toneMap( diffuseCoef*albedoSq + specularColor );\n\n}'
        }
        var e = (a("nanogl/program"), a("nanogl-state/config")), f = a("./lib/program-cache"), g = a("./lib/input"), h = a("./lib/flag"), i = a("./lib/chunks-tree"), j = a("gl-matrix").mat4.create();
        d.prototype = {
            setIBL: function(a) {
                this.ibl = a, this.inputs.addChunks(a.getChunks())
            },
            setLightSetup: function(a) {
                this.inputs.addChunks(a.getChunks())
            },
            prepare: function(a, b) {
                this._isDirty() && this.compile();
                var c = this.prg;
                c.use(), c.setupInputs(this), this.ibl.setupProgram(c), b.modelViewProjectionMatrix(j, a._wmatrix), c.uMVP(j), c.uWorldMatrix(a._wmatrix), c.uCameraPosition(b._wposition)
            },
            prepareShadow: function(a, b) {},
            _isDirty: function() {
                return !(null !== this.prg&&!this.inputs._isDirty)
            },
            compile: function() {
                null !== this.prg && this._prgcache.release(this.prg), this.prg = this._prgcache.compile(this)
            }
        }, b.exports = d
    }, {
        "./lib/chunks-tree": 138,
        "./lib/flag": 140,
        "./lib/input": 141,
        "./lib/program-cache": 146,
        "gl-matrix": 113,
        "nanogl-state/config": 151,
        "nanogl/program": 160
    }
    ],
    149: [function(a, b, c) {
        function d(a, b, c, d, g) {
            b = void 0 === b?-1 : b, c = void 0 === c?-1 : c, d = void 0 === d ? 2 : d, g = void 0 === g ? 2 : g, e.call(this, a);
            var h = f;
            h[0] = h[4] = b, h[1] = h[9] = c, h[8] = h[12] = b + d, h[5] = h[13] = c + g, this.data(h), this.attrib("aPosition", 2, a.FLOAT), this.attrib("aTexCoord", 2, a.FLOAT)
        }
        var e = a("nanogl/arraybuffer"), f = new Float32Array([ - 1, - 1, 0, 0, - 1, 1, 0, 1, 1, - 1, 1, 0, 1, 1, 1, 1]);
        d.prototype = Object.create(e.prototype), d.prototype.constructor = d, d.prototype.render = function() {
            this.drawTriangleStrip()
        }, b.exports = d
    }, {
        "nanogl/arraybuffer": 155
    }
    ],
    150: [function(a, b, c) {
        var d = a("raf"), e = a("right-now"), f = function() {};
        b.exports = function(a) {
            var b = void 0 !== a.pixelRatio ? a.pixelRatio : 0, c = void 0 !== a.hdpi ? a.hdpi : !0, g = function(a) {
                var d = this.getContextOptions();
                this.gl = a.getContext("webgl", d) || a.getContext("experimental-webgl", d) || a.getContext("webgl"), this.canvas = a, this.width = 0, this.height = 0, this.canvasWidth = 0, this.canvasHeight = 0, this.pixelRatio = b, this.hdpi = c, this.frame = this._frame.bind(this), this.previousTime = e(), this._rafId = 0, this._playing=!1, this.init()
            }, h = g.prototype;
            return h.getContextOptions = a.getContextOptions || function() {}, h.render = a.render || f, h.resize = a.resize || f, h.init = a.init || f, h.dispose = function() {
                this.stop()
            }, h.play = function() {
                this._playing || (this._playing=!0, this.frame(), this.previousTime = e(), this._requestFrame())
            }, h.stop = function() {
                d.cancel(this._rafId), this._playing=!1, this._rafId = 0
            }, h.updateSize = function() {
                var a = 1;
                this.pixelRatio > 0 ? a = this.pixelRatio : this.hdpi && (a = window.devicePixelRatio), this.canvas.width = a * this.canvasWidth, this.canvas.height = a * this.canvasHeight, this.width = this.gl.drawingBufferWidth, this.height = this.gl.drawingBufferHeight, this.resize()
            }, h._checkSize = function() {
                var a = getComputedStyle(this.canvas), b = parseInt(a.getPropertyValue("width")), c = parseInt(a.getPropertyValue("height"));
                return isNaN(b) || isNaN(c) || 0 === b || 0 === c?!1 : (b === this.canvasWidth && c === this.canvasHeight || (this.canvasWidth = b, this.canvasHeight = c, this.updateSize()), !0)
            }, h._requestFrame = function() {
                d.cancel(this._rafId), this._rafId = d(this.frame)
            }, h._frame = function() {
                if (this._playing) {
                    var a = e(), b = (a - this.previousTime) / 1e3;
                    this.previousTime = a, (b > .2 || 1 / 180 > b) && (b = 1 / 60), this._checkSize() && this.render(b), this._playing && this._requestFrame()
                }
            }, g
        }
    }, {
        raf: 164,
        "right-now": 165
    }
    ],
    151: [function(a, b, c) {
        !function() {
            function a(a) {
                return a | (4096 & a)>>>2 | (2048 & a)>>>2 | (524288 & a)>>>3 | (1048576 & a)>>>3 | (2097152 & a)>>>3
            }
            function c(a) {
                return 0 | Math.round(65535 * a)
            }
            function d(a) {
                return a / 65535
            }
            function e(a) {
                var b = (31744 & a)>>10, c = 1023 & a;
                return (a>>15?-1 : 1) * (b ? 31 === b ? c ? NaN : 1 / 0 : Math.pow(2, b - 15) * (1 + c / 1024) : 6103515625e-14 * (c / 1024))
            }
            function f(a) {
                h[0] = a;
                var b = i[0], c = b>>31<<5, d = b>>23 & 255;
                return d = d - 112 & 112 - d>>4>>27, c = (c | d)<<10, c|=b>>13 & 1023
            }
            function g() {
                this._dat = new Uint16Array(51), this._set = 0
            }
            var h = new Float32Array(1), i = new Uint32Array(h.buffer), j = [1, 512, 1024, 1024, 2048, 4096, 4096, 4, 8192, 2, 16384, 32768, 256, 65536, 65536, 65536, 262144, 131072, 131072, 131072, 524288, 524288, 524288, 2097152, 1048576, 1048576, 1048576, 128, 4194304, 4194304, 4194304, 4194304, 8, 16, 8388608, 8388608, 32, 64, 16777216, 33554432, 67108864, 67108864, 67108864, 67108864, 134217728, 134217728, 134217728, 134217728, 268435456, 268435456, 536870912], k = 935847839, l = new Uint16Array([0, 32774, 0, 1, 0, 0, 0, 0, 513, 0, 1029, 2305, 0, 519, 0, 65535, 65535, 7680, 7680, 7680, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 15, 1, 0, 0, 0, 0, 0, 0, 0, 0, c(0), c(1), f(1)]), m = function(a, b) {
                return a.getParameter(b)
            };
            g.DAT_MASKS = j, g.encodeHalf = function(a) {
                return f(a)
            }, g.decodeHalf = function(a) {
                return e(a)
            }, g.prototype = {
                toDefault: function() {
                    this._dat.set(l), this._set = 0 | k
                },
                clone: function() {
                    var a = new g;
                    return a._dat.set(this._dat), a._set = this._set, a
                },
                patch: function(b, c) {
                    for (var d, e = this._dat, f = this._set, g = b._dat, h = b._set, i = c._dat, k = 0, l = 0; 51 > l; l++)
                        d = j[l], 0 !== (f & d) && ((0 === (h & d) || e[l] !== g[l]) && (k|=d), g[l] = e[l]);
                    i.set(g), b._set|=f, c._set = a(k)
                },
                setupGL: function(a) {
                    var b, c = this._set, f = this._dat;
                    if (0 !== (1 & c) && (f[0] ? a.enable(3042) : a.disable(3042)), b = 2560 & c, 0 !== b && (2560 === b ? a.blendEquationSeparate(f[1], f[4]) : a.blendEquation(f[1])), b = 5120 & c, 0 !== b && (5120 === b ? a.blendFuncSeparate(f[3], f[2], f[6], f[5]) : a.blendFunc(f[3], f[2])), 0 !== (4 & c) && (f[7] ? a.enable(2929) : a.disable(2929)), 0 !== (8192 & c) && a.depthFunc(f[8]), 0 !== (2 & c) && (f[9] ? a.enable(2884) : a.disable(2884)), 0 !== (16384 & c) && a.cullFace(f[10]), 0 !== (32768 & c) && a.frontFace(f[11]), 0 !== (536870912 & c) && a.lineWidth(e(f[50])), 0 !== (256 & c) && (f[12] ? a.enable(2960) : a.disable(2960)), b = 589824 & c, 0 !== b && (589824 === b ? (a.stencilFuncSeparate(1028, f[13], f[14], f[15]), a.stencilFuncSeparate(1029, f[20], f[21], f[22])) : a.stencilFunc(f[13], f[14], f[15])), b = 1179648 & c, 0 !== b && (1179648 === b ? (a.stencilOpSeparate(1028, f[17], f[18], f[19]), a.stencilOpSeparate(1029, f[24], f[25], f[26])) : a.stencilOp(f[17], f[18], f[19])), b = 2359296 & c, 0 !== b && (2359296 === b ? (a.stencilMaskSeparate(1028, f[16]), a.stencilMaskSeparate(1029, f[23])) : a.stencilMask(f[16])), 0 !== (16777216 & c)) {
                        var g = f[38];
                        a.colorMask(1 === (1 & g), 2 === (2 & g), 4 === (4 & g), 8 === (8 & g))
                    }
                    0 !== (33554432 & c) && a.depthMask(1 === f[39]), 0 !== (67108864 & c) && a.blendColor(e(f[40]), e(f[41]), e(f[42]), e(f[43])), 0 !== (128 & c) && (f[27] ? a.enable(3089) : a.disable(3089)), 0 !== (4194304 & c) && a.scissor(f[28], f[29], f[30], f[31]), 0 !== (134217728 & c) && a.viewport(f[44], f[45], f[46], f[47]), 0 !== (16 & c) && (f[33] ? a.enable(32823) : a.disable(32823)), 0 !== (8388608 & c) && a.polygonOffset(e(f[34]), e(f[35])), 0 !== (268435456 & c) && a.depthRange(d(f[48]), d(f[49]))
                },
                fromGL: function(a) {
                    this._set = 0;
                    var b = m(a, 3042), c = m(a, 2884), d = m(a, 2929), e = m(a, 3024), f = m(a, 32823), g = m(a, 3089), h = m(a, 2960), i = m(a, 32969), j = m(a, 32968), k = m(a, 32971), l = m(a, 32970), n = m(a, 32777), o = m(a, 34877), p = m(a, 2962), q = m(a, 2967), r = m(a, 2963), s = m(a, 2968), t = m(a, 2964), u = m(a, 2965), v = m(a, 2966), w = m(a, 34816), x = m(a, 36003), y = m(a, 36004), z = m(a, 36005), A = m(a, 34817), B = m(a, 34818), C = m(a, 34819), D = m(a, 32824), E = m(a, 10752), F = m(a, 3088), G = m(a, 3107), H = m(a, 2930), I = m(a, 32773), J = m(a, 2978), K = m(a, 2928), L = m(a, 2849);
                    this.enableBlend(b), i !== k || j !== l ? this.blendFuncSeparate(i, j, k, l) : this.blendFunc(i, j), n !== o ? this.blendEquationSeparate(n, o) : this.blendEquation(n), this.enableStencil(h), p !== w || q !== x || r !== y ? this.stencilFuncSeparate(p, q, r, w, x, y) : this.stencilFunc(p, q, r), t !== A || u !== B || v !== C ? this.stencilOpSeparate(t, u, v, A, B, C) : this.stencilOp(t, u, v), s !== z ? this.stencilMaskSeparate(s, z) : this.stencilMask(s), this.depthFunc(a.getParameter(2932)), this.enableDepthTest(d), this.cullFace(a.getParameter(2885)), this.enableCullface(c), this.frontFace(a.getParameter(2886)), this.enablePolygonOffset(f), this.polygonOffset(D, E), this.enableScissor(g), this.scissor(F[0], F[1], F[2], F[3]), this.enableDither(e), this.colorMask(G[0], G[1], G[2], G[3]), this.depthMask(H), this.blendColor(I[0], I[1], I[2], I[3]), this.viewport(J[0], J[1], J[2], J[3]), this.depthRange(K[0], K[1]), this.lineWidth(L)
                },
                enableBlend: function(a) {
                    return void 0 === a && (a=!0), this._dat[0] = 0 | a, this._set|=1, this
                },
                blendFunc: function(a, b) {
                    return this._dat[3] = a, this._dat[2] = b, this._set =- 4097 & this._set | 1024, this
                },
                blendFuncSeparate: function(a, b, c, d) {
                    return this._dat[3] = a, this._dat[2] = b, this._dat[6] = c, this._dat[5] = d, this._set|=5120, this
                },
                blendEquation: function(a) {
                    return this._dat[1] = a, this._set =- 2049 & this._set | 512, this
                },
                blendEquationSeparate: function(a, b) {
                    return this._dat[1] = a, this._dat[4] = b, this._set|=2560, this
                },
                blendColor: function(a, b, c, d) {
                    return this._dat[40] = f(a), this._dat[41] = f(b), this._dat[42] = f(c), this._dat[43] = f(d), this._set|=67108864, this
                },
                depthFunc: function(a) {
                    return this._dat[8] = a, this._set|=8192, this
                },
                enableDepthTest: function(a) {
                    return void 0 === a && (a=!0), this._dat[7] = 0 | a, this._set|=4, this
                },
                depthRange: function(a, b) {
                    return this._dat[48] = c(a), this._dat[49] = c(b), this._set|=268435456, this
                },
                lineWidth: function(a) {
                    return this._dat[50] = f(a), this._set|=536870912, this
                },
                cullFace: function(a) {
                    return this._dat[10] = a, this._set|=16384, this
                },
                enableCullface: function(a) {
                    return void 0 === a && (a=!0), this._dat[9] = 0 | a, this._set|=2, this
                },
                polygonOffset: function(a, b) {
                    return this._dat[34] = f(a), this._dat[35] = f(b), this._set|=8388608, this
                },
                enablePolygonOffset: function(a) {
                    return void 0 === a && (a=!0), this._dat[33] = 0 | a, this._set|=16, this
                },
                enableScissor: function(a) {
                    return void 0 === a && (a=!0), this._dat[27] = 0 | a, this._set|=128, this
                },
                scissor: function(a, b, c, d) {
                    return this._dat[28] = a, this._dat[29] = b, this._dat[30] = c, this._dat[31] = d, this._set|=4194304, this
                },
                viewport: function(a, b, c, d) {
                    return this._dat[44] = a, this._dat[45] = b, this._dat[46] = c, this._dat[47] = d, this._set|=134217728, this
                },
                enableDither: function(a) {
                    return void 0 === a && (a=!0), this._dat[32] = 0 | a, this._set|=8, this
                },
                depthMask: function(a) {
                    return this._dat[39] = 0 | a, this._set|=33554432, this
                },
                colorMask: function(a, b, c, d) {
                    var e = 0 | a | (0 | b)<<1 | (0 | c)<<2 | (0 | d)<<3;
                    return this._dat[38] = e, this._set|=16777216, this
                },
                frontFace: function(a) {
                    return this._dat[11] = a, this._set|=32768, this
                },
                enableStencil: function(a) {
                    return void 0 === a && (a=!0), this._dat[12] = 0 | a, this._set|=256, this
                },
                stencilFunc: function(a, b, c) {
                    return this._dat[13] = a, this._dat[14] = b, this._dat[15] = c, this._set =- 524289 & this._set | 65536, this
                },
                stencilOp: function(a, b, c) {
                    return this._dat[17] = a, this._dat[18] = b, this._dat[19] = c, this._set =- 1048577 & this._set | 131072, this
                },
                stencilMask: function(a) {
                    return this._dat[16] = a, this._set =- 2097153 & this._set | 262144, this
                },
                stencilFuncSeparate: function(a, b, c, d, e, f) {
                    var g = this._dat;
                    return g[13] = a, g[14] = b, g[15] = c, g[20] = d, g[21] = e, g[22] = f, this._set|=589824, this
                },
                stencilOpSeparate: function(a, b, c, d, e, f) {
                    var g = this._dat;
                    return g[17] = a, g[18] = b, g[19] = c, g[24] = d, g[25] = e, g[26] = f, this._set|=1179648, this
                },
                stencilMaskSeparate: function(a, b) {
                    return this._dat[16] = a, this._dat[23] = b, this._set|=2359296, this
                }
            }, b.exports = g
        }()
    }, {}
    ],
    152: [function(a, b, c) {
        !function() {
            function c() {
                this._stack = new Uint32Array(816), this._sets = new Uint32Array(16), this._tmpDat = new Uint32Array(51), this._size = 16, this._ptr = 0, this._headPos = 0, this._wcfg = new d
            }
            var d = a("./config"), e = d.DAT_MASKS;
            c.prototype = {
                initFromGL: function(a) {
                    this._ptr = 0, this._wcfg.fromGL(a), this._sets[0] = 0, this._stack.set(this._wcfg._dat)
                },
                push: function(a) {
                    var b, c, d, f, g, h, i, j = this._ptr, k = this._sets[j++], l = a._set;
                    for (j == this._size && this._grow(), k|=l, this._sets[j] = k, this._ptr = j, b = 51 * j, c = this._stack, d = a._dat, f = this._tmpDat, g = 0; 51 > g; g++)
                        h = e[g], i = 0 !== (l & h) ? d[g] : c[b + g - 51], f[g] = i;
                    c.set(f, b)
                },
                pop: function() {
                    var a=--this._ptr;
                    this._headPos > a && (this._sets[a]|=this._sets[a + 1], this._headPos = a)
                },
                flush: function() {
                    for (; this._ptr > 0;)
                        this.pop()
                },
                commit: function(a) {
                    var b = this._ptr;
                    this.copyConfig(b, a), this._headPos = b, this._sets[b - 1]|=this._sets[b], this._sets[b] = 0
                },
                patch: function(a, b) {
                    this.copyConfig(this._ptr, this._wcfg), this._wcfg.patch(a, b)
                },
                copyConfig: function(a, b) {
                    var c = new Uint32Array(this._stack.buffer, 204 * a, 51);
                    b._dat.set(c), b._set = this._sets[a]
                },
                _grow: function() {
                    var a = this._size<<1, b = new Uint32Array(51 * a), c = new Uint32Array(a);
                    b.set(this._stack, 0), c.set(this._sets, 0), this._stack = b, this._sets = c, this._size = a
                }
            }, b.exports = c
        }()
    }, {
        "./config": 151
    }
    ],
    153: [function(a, b, c) {
        function d(a) {
            this.gl = a, this.cfgStack = new g, this.cfgStack.initFromGL(a), this._validCfg=!1
        }
        function e(a) {
            f.call(this), this.state = a
        }
        var f = a("./config"), g = a("./stack"), h = new f;
        d.prototype = {
            push: function(a) {
                this.cfgStack.push(a), this._validCfg=!1
            },
            pop: function() {
                this.cfgStack.pop(), this._validCfg=!1
            },
            apply: function() {
                this._validCfg || (this.cfgStack.commit(h), h.setupGL(this.gl), this._validCfg=!0)
            },
            now: function(a) {
                this.push(a), this.apply(), this.pop()
            },
            config: function() {
                return new e(this)
            }
        }, e.prototype = Object.create(f.prototype), e.prototype.constructor = e, e.prototype.apply = function() {
            this.state.now(this)
        }, d.config = function() {
            return new f
        }, b.exports = d
    }, {
        "./config": 151,
        "./stack": 152
    }
    ],
    154: [function(a, b, c) {
        function d() {
            if ("undefined" != typeof g && g.defer)
                return g.defer();
            var a = {
                resolve: null,
                reject: null
            };
            return a.promise = new g(function(b, c) {
                a.resolve = b, a.reject = c
            }.bind(a)), Object.freeze(a), a
        }
        function e(a) {
            var b = h[a._uid];
            b && (b.img.onload = b.img.onerror = null, b.img.src = "", b.defer.reject(a)), delete h[a._uid]
        }
        function f(a) {
            return a.fromImage(h[a._uid].img), e(a), a
        }
        var g = a("when/es6-shim/Promise.browserify-es6"), h = {}, i = {};
        i.load = function(a, b) {
            e(a);
            var c = d(), g = new Image;
            return g.onload = function() {
                c.resolve(a)
            }, g.onerror = function() {
                c.reject(a), e(a)
            }, g.crossOrigin = "anonymous", g.src = b, h[a._uid] = {
                texture: a,
                img: g,
                defer: c
            }, c.promise.then(f), c.promise
        }, b.exports = i
    }, {
        "when/es6-shim/Promise.browserify-es6": 166
    }
    ],
    155: [function(a, b, c) {
        function d(a, b, c) {
            this.gl = a, this.usage = c || a.STATIC_DRAW, this.buffer = a.createBuffer(), this.attribs = [], this.stride = 0, this.byteLength = 0, this.length = 0, b && this.data(b)
        }
        var e = a("./bufferutils"), f = 34962;
        d.prototype = {
            bind: function() {
                this.gl.bindBuffer(f, this.buffer)
            },
            attrib: function(a, b, c, d) {
                return this.attribs.push({
                    name: a,
                    type: 0 | c,
                    size: 0 | b,
                    normalize: !!d,
                    offset: this.stride
                }), this.stride += e.getComponentSize(c) * b, this._computeLength(), this
            },
            data: function(a) {
                var b = this.gl;
                b.bindBuffer(f, this.buffer), b.bufferData(f, a, this.usage), b.bindBuffer(f, null), this.byteLength = void 0 === a.byteLength ? a : a.byteLength, this._computeLength()
            },
            subData: function(a, b) {
                var c = this.gl;
                c.bindBuffer(f, this.buffer), c.bufferSubData(f, b, a), c.bindBuffer(f, null)
            },
            attribPointer: function(a) {
                var b = this.gl;
                b.bindBuffer(f, this.buffer);
                for (var c = 0; c < this.attribs.length; c++) {
                    var d = this.attribs[c];
                    if (void 0 !== a[d.name]) {
                        var e = a[d.name]();
                        b.enableVertexAttribArray(e), b.vertexAttribPointer(e, d.size, d.type, d.normalize, this.stride, d.offset)
                    }
                }
            },
            draw: function(a, b, c) {
                b = void 0 === b ? this.length : b, this.gl.drawArrays(a, c, 0 | b)
            },
            dispose: function() {
                this.gl.deleteBuffer(this.buffer), this.buffer = null, this.gl = null
            },
            _computeLength: function() {
                this.stride > 0 && (this.length = this.byteLength / this.stride)
            }
        }, e.Drawable(d.prototype), b.exports = d
    }, {
        "./bufferutils": 156
    }
    ],
    156: [function(a, b, c) {
        b.exports = {
            getComponentSize: function(a) {
                switch (a) {
                case 5120:
                case 5121:
                    return 1;
                case 5122:
                case 5123:
                    return 2;
                case 5124:
                case 5125:
                case 5126:
                    return 4;
                default:
                    return 0
                }
            },
            Drawable: function(a) {
                a.drawPoints = function(a, b) {
                    this.draw(0, a, b)
                }, a.drawLines = function(a, b) {
                    this.draw(1, a, b)
                }, a.drawLineLoop = function(a, b) {
                    this.draw(2, a, b)
                }, a.drawLineStrip = function(a, b) {
                    this.draw(3, a, b)
                }, a.drawTriangles = function(a, b) {
                    this.draw(4, a, b)
                }, a.drawTriangleStrip = function(a, b) {
                    this.draw(5, a, b)
                }, a.drawTriangleFan = function(a, b) {
                    this.draw(6, a, b)
                }
            }
        }
    }, {}
    ],
    157: [function(a, b, c) {
        function d(a, b, c, d) {
            this.gl = a, this.width = 0, this.height = 0, this.fbo = null, d = d || h, this.flags = d.depth | 2 * d.stencil;
            var e = d.type || a.UNSIGNED_BYTE;
            this.types = Array.isArray(e) ? e : [e], this.color = new g(a, d.format), this._init(), this.resize(b, c)
        }
        function e(a, b) {
            switch (b) {
            case 1:
                return 33189;
            case 2:
                return 36168;
            case 3:
                return 34041;
            default:
                throw new Error("unknown attachment type " + b)
            }
        }
        function f(a, b) {
            switch (b) {
            case 1:
                return 36096;
            case 2:
                return 36128;
            case 3:
                return 33306;
            default:
                throw new Error("unknown attachment type " + b)
            }
        }
        var g = a("./texture");
        d.prototype = {
            resize: function(a, b) {
                this.width === a && this.height === b || (this.width = 0 | a, this.height = 0 | b, this._allocate())
            },
            bindColor: function(a, b) {
                var c = this.gl;
                c.activeTexture(c.TEXTURE0 + b), c.bindTexture(c.TEXTURE_2D, this.color.id), c.uniform1i(a, b)
            },
            bind: function() {
                var a = this.gl;
                a.bindFramebuffer(a.FRAMEBUFFER, this.fbo), a.viewport(0, 0, this.width, this.height)
            },
            clear: function() {
                var a = this.gl, b = a.COLOR_BUFFER_BIT;
                b|=1 & this.flags ? a.DEPTH_BUFFER_BIT : 0, b|=2 & this.flags ? a.STENCIL_BUFFER_BIT : 0, a.clear(b)
            },
            isValid: function() {
                var a = this.gl;
                return a.checkFramebufferStatus(a.FRAMEBUFFER) === a.FRAMEBUFFER_COMPLETE
            },
            getActualType: function() {
                return this.color.type
            },
            dispose: function() {
                var a = this.gl;
                this.attachmentBuffer && a.deleteRenderbuffer(this.attachmentBuffer), a.deleteFramebuffer(this.fbo), this.color.dispose(), this.valid=!1, this.gl = null
            },
            _init: function() {
                var a = this.gl;
                this.fbo = a.createFramebuffer(), a.bindFramebuffer(a.FRAMEBUFFER, this.fbo), a.framebufferTexture2D(a.FRAMEBUFFER, a.COLOR_ATTACHMENT0, a.TEXTURE_2D, this.color.id, 0);
                var b = 3 & this.flags;
                if (b) {
                    var c = f(a, b);
                    this.attachmentBuffer = a.createRenderbuffer(), a.bindRenderbuffer(a.RENDERBUFFER, this.attachmentBuffer), a.framebufferRenderbuffer(a.FRAMEBUFFER, c, a.RENDERBUFFER, this.attachmentBuffer)
                }
            },
            _allocate: function() {
                var a = this.gl, b = 3 & this.flags;
                if (b) {
                    var c = e(a, b);
                    a.bindRenderbuffer(a.RENDERBUFFER, this.attachmentBuffer), a.renderbufferStorage(a.RENDERBUFFER, c, this.width, this.height), a.bindRenderbuffer(a.RENDERBUFFER, null)
                }
                a.bindFramebuffer(a.FRAMEBUFFER, this.fbo);
                var d = 0, f = this.types[d];
                do 
                    this.color.fromData(this.width, this.height, null, f), a.getError();
                while (!(this.valid = this.isValid()) && (f = this.types[++d]));
                a.bindFramebuffer(a.FRAMEBUFFER, null)
            }
        };
        var h = {};
        b.exports = d
    }, {
        "./texture": 161
    }
    ],
    158: [function(a, b, c) {
        function d(a, b, c, d) {
            this.gl = a, this.buffer = a.createBuffer(), this.usage = d || a.STATIC_DRAW, this.type = 0, this.typeSize = 0, this.size = 0, this.setType(b || a.UNSIGNED_SHORT), c && this.data(c)
        }
        var e = a("./bufferutils"), f = 34963;
        d.prototype = {
            bind: function() {
                this.gl.bindBuffer(f, this.buffer)
            },
            setType: function(a) {
                this.type = a, this.typeSize = e.getComponentSize(a)
            },
            data: function(a) {
                var b = this.gl;
                b.bindBuffer(f, this.buffer), b.bufferData(f, a, this.usage), b.bindBuffer(f, null), this.size = void 0 === a.byteLength ? a : a.byteLength
            },
            subData: function(a, b) {
                var c = this.gl;
                c.bindBuffer(f, this.buffer), c.bufferSubData(f, b, a), c.bindBuffer(f, null)
            },
            dispose: function() {
                this.gl.deleteBuffer(this.buffer), this.buffer = null, this.gl = null
            },
            draw: function(a, b, c) {
                b = void 0 === b ? this.size / this.typeSize : b, this.gl.drawElements(a, b, this.type, 0 | c)
            }
        }, e.Drawable(d.prototype), b.exports = d
    }, {
        "./bufferutils": 156
    }
    ],
    159: [function(a, b, c) {
        b.exports = {
            Program: a("./program"),
            Texture: a("./texture"),
            Fbo: a("./fbo"),
            ArrayBuffer: a("./arraybuffer"),
            IndexBuffer: a("./indexbuffer")
        }
    }, {
        "./arraybuffer": 155,
        "./fbo": 157,
        "./indexbuffer": 158,
        "./program": 160,
        "./texture": 161
    }
    ],
    160: [function(a, b, c) {
        function d(a, b, c, d) {
            this.gl = a, this.program = a.createProgram(), this.vShader = a.createShader(a.VERTEX_SHADER), this.fShader = a.createShader(a.FRAGMENT_SHADER), this.dyns = [], this.ready=!1, a.attachShader(this.program, this.vShader), a.attachShader(this.program, this.fShader), void 0 !== b && void 0 !== c && this.compile(b, c, d)
        }
        function e(a) {
            console.warn(a)
        }
        function f(a, b) {
            return o[String(b + 1).length] + (b + 1) + ": " + a
        }
        function g(a) {
            return a.split("\n").map(f).join("\n")
        }
        function h(a, b, c) {
            return a.shaderSource(b, c), a.compileShader(b), d.debug&&!a.getShaderParameter(b, a.COMPILE_STATUS) ? (e(a.getShaderInfoLog(b)), e(g(c)), !1) : !0
        }
        function i(a) {
            return a = String(a), "uniform" + p[a]
        }
        function j(a, b, c, d) {
            switch (a) {
            case c.FLOAT_MAT2:
            case c.FLOAT_MAT3:
            case c.FLOAT_MAT4:
                return l(a, b, c, d);
            case c.SAMPLER_2D:
            case c.SAMPLER_CUBE:
                return m(a, b, c, d);
            default:
                return k(a, b, c, d)
            }
        }
        function k(a, b, c, d) {
            var e = i(a);
            return function() {
                return 1 === arguments.length && void 0 !== arguments[0].length ? c[e + "v"](b, arguments[0]) : arguments.length > 0 && c[e].apply(c, Array.prototype.concat.apply(b, arguments)), b
            }
        }
        function l(a, b, c, d) {
            var e = i(a);
            return function() {
                if (arguments.length > 0 && void 0 !== arguments[0].length) {
                    var a = arguments.length > 1?!!arguments[1] : !1;
                    c[e + "v"](b, a, arguments[0])
                }
                return b
            }
        }
        function m(a, b, c, d) {
            var e = d.texIndex++;
            return function() {
                return 1 === arguments.length && (void 0 !== arguments[0].bind ? (arguments[0].bind(e), c.uniform1i(b, e)) : c.uniform1i(b, arguments[0])), b
            }
        }
        function n(a) {
            return function() {
                return a
            }
        }
        d.debug=!0, d.prototype = {
            use: function() {
                this.ready || this._grabParameters(), this.gl.useProgram(this.program)
            },
            compile: function(a, b, c) {
                this.ready=!1, c = (c || "") + "\n";
                var f = this.gl;
                if (!h(f, this.fShader, c + b) ||!h(f, this.vShader, c + a))
                    return !1;
                if (f.linkProgram(this.program), d.debug&&!f.getProgramParameter(this.program, f.LINK_STATUS))
                    return e(f.getProgramInfoLog(this.program)), !1;
                for (; this.dyns.length > 0;)
                    delete this[this.dyns.pop()];
                return !0
            },
            dispose: function() {
                null !== this.gl && (this.gl.deleteProgram(this.program), this.gl.deleteShader(this.fShader), this.gl.deleteShader(this.vShader), this.gl = null)
            },
            _grabParameters: function() {
                for (var a = this.gl, b = this.program, c = a.getProgramParameter(b, a.ACTIVE_UNIFORMS), d = {
                    texIndex: 0
                }, e = 0; c > e; ++e) {
                    var f = a.getActiveUniform(b, e);
                    if (null !== f) {
                        var g = f.name, h = g.indexOf("[");
                        h >= 0 && (g = g.substring(0, h));
                        var i = a.getUniformLocation(b, f.name);
                        this[g] = j(f.type, i, a, d), this.dyns.push(g)
                    } else 
                        a.getError()
                }
                for (var k = a.getProgramParameter(b, a.ACTIVE_ATTRIBUTES), l = 0; k > l; ++l) {
                    var m = a.getActiveAttrib(b, l).name, o = a.getAttribLocation(b, m);
                    this[m] = n(o), this.dyns.push(m)
                }
                this.ready=!0
            }
        }, d.prototype.bind = d.prototype.use;
        var o = ["", "   ", "  ", " ", ""], p = {};
        p[5126] = "1f", p[35664] = "2f", p[35665] = "3f", p[35666] = "4f", p[35670] = p[5124] = p[35678] = p[35680] = "1i", p[35671] = p[35667] = "2i", p[35672] = p[35668] = "3i", p[35673] = p[35669] = "4i", p[35674] = "Matrix2f", p[35675] = "Matrix3f", p[35676] = "Matrix4f", b.exports = d
    }, {}
    ],
    161: [function(a, b, c) {
        function d(a, b, c) {
            return 9728|+a|+b<<8|+(b && c)<<1
        }
        function e(a, b) {
            this._uid = f++, this.gl = a, this.id = this.gl.createTexture(), this.width = 0, this.height = 0, this.format = b || a.RGB, this.type = a.UNSIGNED_BYTE, a.bindTexture(g, this.id), this.setFilter(!0)
        }
        var f = 0, g = 3553;
        e.prototype = {
            fromImage: function(a) {
                var b = this.gl;
                this.width = a.width, this.height = a.height, b.bindTexture(g, this.id), b.texImage2D(g, 0, this.format, this.format, this.type, a)
            },
            fromData: function(a, b, c, d) {
                var e = this.gl;
                this.width = a, this.height = b, c = c || null, this.type = d || e.UNSIGNED_BYTE, e.bindTexture(g, this.id), e.texImage2D(g, 0, this.format, a, b, 0, this.format, this.type, c)
            },
            bind: function(a) {
                var b = this.gl;
                void 0 !== a && b.activeTexture(b.TEXTURE0 + (0 | a)), b.bindTexture(g, this.id)
            },
            dispose: function() {
                this.gl.deleteTexture(this.id), this.id = null, this.gl = null
            },
            setFilter: function(a, b, c) {
                var e = this.gl, f = d(!!a, !!b, !!c);
                e.texParameteri(g, e.TEXTURE_MAG_FILTER, d(!!a, !1, !1)), e.texParameteri(g, e.TEXTURE_MIN_FILTER, f)
            },
            repeat: function() {
                this.wrap(this.gl.REPEAT)
            },
            clamp: function() {
                this.wrap(this.gl.CLAMP_TO_EDGE)
            },
            mirror: function() {
                this.wrap(this.gl.MIRRORED_REPEAT)
            },
            wrap: function(a) {
                var b = this.gl;
                b.texParameteri(g, b.TEXTURE_WRAP_S, a), b.texParameteri(g, b.TEXTURE_WRAP_T, a)
            }
        }, b.exports = e
    }, {}
    ],
    162: [function(a, b, c) {
        (function(a) {
            (function() {
                var c, d, e;
                "undefined" != typeof performance && null !== performance && performance.now ? b.exports = function() {
                    return performance.now()
                } : "undefined" != typeof a && null !== a && a.hrtime ? (b.exports = function() {
                    return (c() - e) / 1e6
                }, d = a.hrtime, c = function() {
                    var a;
                    return a = d(), 1e9 * a[0] + a[1]
                }, e = c()) : Date.now ? (b.exports = function() {
                    return Date.now() - e
                }, e = Date.now()) : (b.exports = function() {
                    return (new Date).getTime() - e
                }, e = (new Date).getTime())
            }).call(this)
        }).call(this, a("_process"))
    }, {
        _process: 163
    }
    ],
    163: [function(a, b, c) {
        function d() {
            k && h && (k=!1, h.length ? j = h.concat(j) : l =- 1, j.length && e())
        }
        function e() {
            if (!k) {
                var a = setTimeout(d);
                k=!0;
                for (var b = j.length; b;) {
                    for (h = j, j = []; ++l < b;)
                        h && h[l].run();
                    l =- 1, b = j.length
                }
                h = null, k=!1, clearTimeout(a)
            }
        }
        function f(a, b) {
            this.fun = a, this.array = b
        }
        function g() {}
        var h, i = b.exports = {}, j = [], k=!1, l =- 1;
        i.nextTick = function(a) {
            var b = new Array(arguments.length - 1);
            if (arguments.length > 1)
                for (var c = 1; c < arguments.length; c++)
                    b[c - 1] = arguments[c];
            j.push(new f(a, b)), 1 !== j.length || k || setTimeout(e, 0)
        }, f.prototype.run = function() {
            this.fun.apply(null, this.array)
        }, i.title = "browser", i.browser=!0, i.env = {}, i.argv = [], i.version = "", i.versions = {}, i.on = g, i.addListener = g, i.once = g, i.off = g, i.removeListener = g, i.removeAllListeners = g, i.emit = g, i.binding = function(a) {
            throw new Error("process.binding is not supported")
        }, i.cwd = function() {
            return "/"
        }, i.chdir = function(a) {
            throw new Error("process.chdir is not supported")
        }, i.umask = function() {
            return 0
        }
    }, {}
    ],
    164: [function(a, b, c) {
        (function(c) {
            for (var d = a("performance-now"), e = "undefined" == typeof window ? c : window, f = ["moz", "webkit"], g = "AnimationFrame", h = e["request" + g], i = e["cancel" + g] || e["cancelRequest" + g], j = 0; !h && j < f.length; j++)
                h = e[f[j] + "Request" + g], i = e[f[j] + "Cancel" + g] || e[f[j] + "CancelRequest" + g];
            if (!h ||!i) {
                var k = 0, l = 0, m = [], n = 1e3 / 60;
                h = function(a) {
                    if (0 === m.length) {
                        var b = d(), c = Math.max(0, n - (b - k));
                        k = c + b, setTimeout(function() {
                            var a = m.slice(0);
                            m.length = 0;
                            for (var b = 0; b < a.length; b++)
                                if (!a[b].cancelled)
                                    try {
                                        a[b].callback(k)
                            } catch (c) {
                                setTimeout(function() {
                                    throw c
                                }, 0)
                            }
                        }, Math.round(c))
                    }
                    return m.push({
                        handle: ++l,
                        callback: a,
                        cancelled: !1
                    }), l
                }, i = function(a) {
                    for (var b = 0; b < m.length; b++)
                        m[b].handle === a && (m[b].cancelled=!0)
                }
            }
            b.exports = function(a) {
                return h.call(e, a)
            }, b.exports.cancel = function() {
                i.apply(e, arguments)
            }, b.exports.polyfill = function() {
                e.requestAnimationFrame = h, e.cancelAnimationFrame = i
            }
        }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }, {
        "performance-now": 162
    }
    ],
    165: [function(a, b, c) {
        (function(a) {
            b.exports = a.performance && a.performance.now ? function() {
                return performance.now()
            } : Date.now || function() {
                return + new Date
            }
        }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }, {}
    ],
    166: [function(a, b, c) {
        (function(c) {
            var d = a("../lib/decorators/unhandledRejection"), e = d(a("../lib/Promise"));
            b.exports = "undefined" != typeof c ? c.Promise = e : "undefined" != typeof self ? self.Promise = e : e
        }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }, {
        "../lib/Promise": 167,
        "../lib/decorators/unhandledRejection": 178
    }
    ],
    167: [function(a, b, c) {
        !function(a) {
            "use strict";
            a(function(a) {
                var b = a("./makePromise"), c = a("./Scheduler"), d = a("./env").asap;
                return b({
                    scheduler: new c(d)
                })
            })
        }("function" == typeof define && define.amd ? define : function(c) {
            b.exports = c(a)
        })
    }, {
        "./Scheduler": 168,
        "./env": 180,
        "./makePromise": 182
    }
    ],
    168: [function(a, b, c) {
        !function(a) {
            "use strict";
            a(function() {
                function a(a) {
                    this._async = a, this._running=!1, this._queue = this, this._queueLen = 0, this._afterQueue = {}, this._afterQueueLen = 0;
                    var b = this;
                    this.drain = function() {
                        b._drain()
                    }
                }
                return a.prototype.enqueue = function(a) {
                    this._queue[this._queueLen++] = a, this.run()
                }, a.prototype.afterQueue = function(a) {
                    this._afterQueue[this._afterQueueLen++] = a, this.run()
                }, a.prototype.run = function() {
                    this._running || (this._running=!0, this._async(this.drain))
                }, a.prototype._drain = function() {
                    for (var a = 0; a < this._queueLen; ++a)
                        this._queue[a].run(), this._queue[a] = void 0;
                    for (this._queueLen = 0, this._running=!1, a = 0; a < this._afterQueueLen; ++a)
                        this._afterQueue[a].run(), this._afterQueue[a] = void 0;
                    this._afterQueueLen = 0
                }, a
            })
        }("function" == typeof define && define.amd ? define : function(a) {
            b.exports = a()
        })
    }, {}
    ],
    169: [function(a, b, c) {
        !function(a) {
            "use strict";
            a(function() {
                function a(b) {
                    Error.call(this), this.message = b, this.name = a.name, "function" == typeof Error.captureStackTrace && Error.captureStackTrace(this, a)
                }
                return a.prototype = Object.create(Error.prototype), a.prototype.constructor = a, a
            })
        }("function" == typeof define && define.amd ? define : function(a) {
            b.exports = a()
        })
    }, {}
    ],
    170: [function(a, b, c) {
        !function(a) {
            "use strict";
            a(function() {
                function a(a, c) {
                    function d(b, d, f) {
                        var g = a._defer(), h = f.length, i = new Array(h);
                        return e({
                            f: b,
                            thisArg: d,
                            args: f,
                            params: i,
                            i: h - 1,
                            call: c
                        }, g._handler), g
                    }
                    function e(b, d) {
                        if (b.i < 0)
                            return c(b.f, b.thisArg, b.params, d);
                        var e = a._handler(b.args[b.i]);
                        e.fold(f, b, void 0, d)
                    }
                    function f(a, b, c) {
                        a.params[a.i] = b, a.i -= 1, e(a, c)
                    }
                    return arguments.length < 2 && (c = b), d
                }
                function b(a, b, c, d) {
                    try {
                        d.resolve(a.apply(b, c))
                    } catch (e) {
                        d.reject(e)
                    }
                }
                return a.tryCatchResolve = b, a
            })
        }("function" == typeof define && define.amd ? define : function(a) {
            b.exports = a()
        })
    }, {}
    ],
    171: [function(a, b, c) {
        !function(a) {
            "use strict";
            a(function(a) {
                var b = a("../state"), c = a("../apply");
                return function(a) {
                    function d(b) {
                        function c(a) {
                            k = null, this.resolve(a)
                        }
                        function d(a) {
                            this.resolved || (k.push(a), 0===--j && this.reject(k))
                        }
                        for (var e, f, g = a._defer(), h = g._handler, i = b.length>>>0, j = i, k = [], l = 0; i > l; ++l)
                            if (f = b[l], void 0 !== f || l in b) {
                                if (e = a._handler(f), e.state() > 0) {
                                    h.become(e), a._visitRemaining(b, l, e);
                                    break
                                }
                                e.visit(h, c, d)
                            } else 
                                --j;
                        return 0 === j && h.reject(new RangeError("any(): array must not be empty")), g
                    }
                    function e(b, c) {
                        function d(a) {
                            this.resolved || (k.push(a), 0===--n && (l = null, this.resolve(k)))
                        }
                        function e(a) {
                            this.resolved || (l.push(a), 0===--f && (k = null, this.reject(l)))
                        }
                        var f, g, h, i = a._defer(), j = i._handler, k = [], l = [], m = b.length>>>0, n = 0;
                        for (h = 0; m > h; ++h)
                            g = b[h], (void 0 !== g || h in b)&&++n;
                        for (c = Math.max(c, 0), f = n - c + 1, n = Math.min(c, n), c > n ? j.reject(new RangeError("some(): array must contain at least " + c + " item(s), but had " + n)) : 0 === n && j.resolve(k), h = 0; m > h; ++h)
                            g = b[h], (void 0 !== g || h in b) && a._handler(g).visit(j, d, e, j.notify);
                        return i
                    }
                    function f(b, c) {
                        return a._traverse(c, b)
                    }
                    function g(b, c) {
                        var d = s.call(b);
                        return a._traverse(c, d).then(function(a) {
                            return h(d, a)
                        })
                    }
                    function h(b, c) {
                        for (var d = c.length, e = new Array(d), f = 0, g = 0; d > f; ++f)
                            c[f] && (e[g++] = a._handler(b[f]).value);
                        return e.length = g, e
                    }
                    function i(a) {
                        return p(a.map(j))
                    }
                    function j(c) {
                        var d = a._handler(c);
                        return 0 === d.state() ? o(c).then(b.fulfilled, b.rejected) : (d._unreport(), b.inspect(d))
                    }
                    function k(a, b) {
                        return arguments.length > 2 ? q.call(a, m(b), arguments[2]) : q.call(a, m(b))
                    }
                    function l(a, b) {
                        return arguments.length > 2 ? r.call(a, m(b), arguments[2]) : r.call(a, m(b))
                    }
                    function m(a) {
                        return function(b, c, d) {
                            return n(a, void 0, [b, c, d])
                        }
                    }
                    var n = c(a), o = a.resolve, p = a.all, q = Array.prototype.reduce, r = Array.prototype.reduceRight, s = Array.prototype.slice;
                    return a.any = d, a.some = e, a.settle = i, a.map = f, a.filter = g, a.reduce = k, a.reduceRight = l, a.prototype.spread = function(a) {
                        return this.then(p).then(function(b) {
                            return a.apply(this, b)
                        })
                    }, a
                }
            })
        }("function" == typeof define && define.amd ? define : function(c) {
            b.exports = c(a)
        })
    }, {
        "../apply": 170,
        "../state": 183
    }
    ],
    172: [function(a, b, c) {
        !function(a) {
            "use strict";
            a(function() {
                function a() {
                    throw new TypeError("catch predicate must be a function")
                }
                function b(a, b) {
                    return c(b) ? a instanceof b : b(a)
                }
                function c(a) {
                    return a === Error || null != a && a.prototype instanceof Error
                }
                function d(a) {
                    return ("object" == typeof a || "function" == typeof a) && null !== a
                }
                function e(a) {
                    return a
                }
                return function(c) {
                    function f(a, c) {
                        return function(d) {
                            return b(d, c) ? a.call(this, d) : j(d)
                        }
                    }
                    function g(a, b, c, e) {
                        var f = a.call(b);
                        return d(f) ? h(f, c, e) : c(e)
                    }
                    function h(a, b, c) {
                        return i(a).then(function() {
                            return b(c)
                        })
                    }
                    var i = c.resolve, j = c.reject, k = c.prototype["catch"];
                    return c.prototype.done = function(a, b) {
                        this._handler.visit(this._handler.receiver, a, b)
                    }, c.prototype["catch"] = c.prototype.otherwise = function(b) {
                        return arguments.length < 2 ? k.call(this, b) : "function" != typeof b ? this.ensure(a) : k.call(this, f(arguments[1], b))
                    }, c.prototype["finally"] = c.prototype.ensure = function(a) {
                        return "function" != typeof a ? this : this.then(function(b) {
                            return g(a, this, e, b)
                        }, function(b) {
                            return g(a, this, j, b)
                        })
                    }, c.prototype["else"] = c.prototype.orElse = function(a) {
                        return this.then(void 0, function() {
                            return a
                        })
                    }, c.prototype["yield"] = function(a) {
                        return this.then(function() {
                            return a
                        })
                    }, c.prototype.tap = function(a) {
                        return this.then(a)["yield"](this)
                    }, c
                }
            })
        }("function" == typeof define && define.amd ? define : function(a) {
            b.exports = a()
        })
    }, {}
    ],
    173: [function(a, b, c) {
        !function(a) {
            "use strict";
            a(function() {
                return function(a) {
                    return a.prototype.fold = function(b, c) {
                        var d = this._beget();
                        return this._handler.fold(function(c, d, e) {
                            a._handler(c).fold(function(a, c, d) {
                                d.resolve(b.call(this, c, a))
                            }, d, this, e)
                        }, c, d._handler.receiver, d._handler), d
                    }, a
                }
            })
        }("function" == typeof define && define.amd ? define : function(a) {
            b.exports = a()
        })
    }, {}
    ],
    174: [function(a, b, c) {
        !function(a) {
            "use strict";
            a(function(a) {
                var b = a("../state").inspect;
                return function(a) {
                    return a.prototype.inspect = function() {
                        return b(a._handler(this))
                    }, a
                }
            })
        }("function" == typeof define && define.amd ? define : function(c) {
            b.exports = c(a)
        })
    }, {
        "../state": 183
    }
    ],
    175: [function(a, b, c) {
        !function(a) {
            "use strict";
            a(function() {
                return function(a) {
                    function b(a, b, d, e) {
                        return c(function(b) {
                            return [b, a(b)]
                        }, b, d, e)
                    }
                    function c(a, b, e, f) {
                        function g(f, g) {
                            return d(e(f)).then(function() {
                                return c(a, b, e, g)
                            })
                        }
                        return d(f).then(function(c) {
                            return d(b(c)).then(function(b) {
                                return b ? c : d(a(c)).spread(g)
                            })
                        })
                    }
                    var d = a.resolve;
                    return a.iterate = b, a.unfold = c, a
                }
            })
        }("function" == typeof define && define.amd ? define : function(a) {
            b.exports = a()
        })
    }, {}
    ],
    176: [function(a, b, c) {
        !function(a) {
            "use strict";
            a(function() {
                return function(a) {
                    return a.prototype.progress = function(a) {
                        return this.then(void 0, void 0, a)
                    }, a
                }
            })
        }("function" == typeof define && define.amd ? define : function(a) {
            b.exports = a()
        })
    }, {}
    ],
    177: [function(a, b, c) {
        !function(a) {
            "use strict";
            a(function(a) {
                function b(a, b, d, e) {
                    return c.setTimer(function() {
                        a(d, e, b)
                    }, b)
                }
                var c = a("../env"), d = a("../TimeoutError");
                return function(a) {
                    function e(a, c, d) {
                        b(f, a, c, d)
                    }
                    function f(a, b) {
                        b.resolve(a)
                    }
                    function g(a, b, c) {
                        var e = "undefined" == typeof a ? new d("timed out after " + c + "ms"): a;
                        b.reject(e)
                    }
                    return a.prototype.delay = function(a) {
                        var b = this._beget();
                        return this._handler.fold(e, a, void 0, b._handler), b
                    }, a.prototype.timeout = function(a, d) {
                        var e = this._beget(), f = e._handler, h = b(g, a, d, e._handler);
                        return this._handler.visit(f, function(a) {
                            c.clearTimer(h), this.resolve(a)
                        }, function(a) {
                            c.clearTimer(h), this.reject(a)
                        }, f.notify), e
                    }, a
                }
            })
        }("function" == typeof define && define.amd ? define : function(c) {
            b.exports = c(a)
        })
    }, {
        "../TimeoutError": 169,
        "../env": 180
    }
    ],
    178: [function(a, b, c) {
        !function(a) {
            "use strict";
            a(function(a) {
                function b(a) {
                    throw a
                }
                function c() {}
                var d = a("../env").setTimer, e = a("../format");
                return function(a) {
                    function f(a) {
                        a.handled || (n.push(a), k("Potentially unhandled rejection [" + a.id + "] " + e.formatError(a.value)))
                    }
                    function g(a) {
                        var b = n.indexOf(a);
                        b >= 0 && (n.splice(b, 1), l("Handled previous rejection [" + a.id + "] " + e.formatObject(a.value)))
                    }
                    function h(a, b) {
                        m.push(a, b), null === o && (o = d(i, 0))
                    }
                    function i() {
                        for (o = null; m.length > 0;)
                            m.shift()(m.shift())
                    }
                    var j, k = c, l = c;
                    "undefined" != typeof console && (j = console, k = "undefined" != typeof j.error ? function(a) {
                        j.error(a)
                    } : function(a) {
                        j.log(a)
                    }, l = "undefined" != typeof j.info ? function(a) {
                        j.info(a)
                    } : function(a) {
                        j.log(a)
                    }), a.onPotentiallyUnhandledRejection = function(a) {
                        h(f, a)
                    }, a.onPotentiallyUnhandledRejectionHandled = function(a) {
                        h(g, a)
                    }, a.onFatalRejection = function(a) {
                        h(b, a.value)
                    };
                    var m = [], n = [], o = null;
                    return a
                }
            })
        }("function" == typeof define && define.amd ? define : function(c) {
            b.exports = c(a)
        })
    }, {
        "../env": 180,
        "../format": 181
    }
    ],
    179: [function(a, b, c) {
        !function(a) {
            "use strict";
            a(function() {
                return function(a) {
                    return a.prototype["with"] = a.prototype.withThis = function(a) {
                        var b = this._beget(), c = b._handler;
                        return c.receiver = a, this._handler.chain(c, a), b
                    }, a
                }
            })
        }("function" == typeof define && define.amd ? define : function(a) {
            b.exports = a()
        })
    }, {}
    ],
    180: [function(a, b, c) {
        (function(c) {
            !function(a) {
                "use strict";
                a(function(a) {
                    function b() {
                        return "undefined" != typeof c && "[object process]" === Object.prototype.toString.call(c)
                    }
                    function d() {
                        return "function" == typeof MutationObserver && MutationObserver || "function" == typeof WebKitMutationObserver && WebKitMutationObserver
                    }
                    function e(a) {
                        function b() {
                            var a = c;
                            c = void 0, a()
                        }
                        var c, d = document.createTextNode(""), e = new a(b);
                        e.observe(d, {
                            characterData: !0
                        });
                        var f = 0;
                        return function(a) {
                            c = a, d.data = f^=1
                        }
                    }
                    var f, g = "undefined" != typeof setTimeout && setTimeout, h = function(a, b) {
                        return setTimeout(a, b)
                    }, i = function(a) {
                        return clearTimeout(a)
                    }, j = function(a) {
                        return g(a, 0)
                    };
                    if (b())
                        j = function(a) {
                            return c.nextTick(a)
                        };
                    else if (f = d())
                        j = e(f);
                    else if (!g) {
                        var k = a, l = k("vertx");
                        h = function(a, b) {
                            return l.setTimer(b, a)
                        }, i = l.cancelTimer, j = l.runOnLoop || l.runOnContext
                    }
                    return {
                        setTimer: h,
                        clearTimer: i,
                        asap: j
                    }
                })
            }("function" == typeof define && define.amd ? define : function(c) {
                b.exports = c(a)
            })
        }).call(this, a("_process"))
    }, {
        _process: 163
    }
    ],
    181: [function(a, b, c) {
        !function(a) {
            "use strict";
            a(function() {
                function a(a) {
                    var c = "object" == typeof a && null !== a && (a.stack || a.message) ? a.stack || a.message: b(a);
                    return a instanceof Error ? c : c + " (WARNING: non-Error used)"
                }
                function b(a) {
                    var b = String(a);
                    return "[object Object]" === b && "undefined" != typeof JSON && (b = c(a, b)), b
                }
                function c(a, b) {
                    try {
                        return JSON.stringify(a)
                    } catch (c) {
                        return b
                    }
                }
                return {
                    formatError: a,
                    formatObject: b,
                    tryStringify: c
                }
            })
        }("function" == typeof define && define.amd ? define : function(a) {
            b.exports = a()
        })
    }, {}
    ],
    182: [function(a, b, c) {
        (function(a) {
            !function(b) {
                "use strict";
                b(function() {
                    return function(b) {
                        function c(a, b) {
                            this._handler = a === u ? b : d(a)
                        }
                        function d(a) {
                            function b(a) {
                                e.resolve(a)
                            }
                            function c(a) {
                                e.reject(a)
                            }
                            function d(a) {
                                e.notify(a)
                            }
                            var e = new w;
                            try {
                                a(b, c, d)
                            } catch (f) {
                                c(f)
                            }
                            return e
                        }
                        function e(a) {
                            return J(a) ? a : new c(u, new x(r(a)))
                        }
                        function f(a) {
                            return new c(u, new x(new A(a)))
                        }
                        function g() {
                            return aa
                        }
                        function h() {
                            return new c(u, new w)
                        }
                        function i(a, b) {
                            var c = new w(a.receiver, a.join().context);
                            return new b(u, c)
                        }
                        function j(a) {
                            return l(T, null, a)
                        }
                        function k(a, b) {
                            return l(O, a, b)
                        }
                        function l(a, b, d) {
                            function e(c, e, g) {
                                g.resolved || m(d, f, c, a(b, e, c), g)
                            }
                            function f(a, b, c) {
                                k[a] = b, 0===--j && c.become(new z(k))
                            }
                            for (var g, h = "function" == typeof b ? e : f, i = new w, j = d.length>>>0, k = new Array(j), l = 0; l < d.length&&!i.resolved; ++l)
                                g = d[l], void 0 !== g || l in d ? m(d, h, l, g, i) : --j;
                            return 0 === j && i.become(new z(k)), new c(u, i)
                        }
                        function m(a, b, c, d, e) {
                            if (K(d)) {
                                var f = s(d), g = f.state();
                                0 === g ? f.fold(b, c, void 0, e) : g > 0 ? b(c, f.value, e) : (e.become(f), n(a, c + 1, f))
                            } else 
                                b(c, d, e)
                        }
                        function n(a, b, c) {
                            for (var d = b; d < a.length; ++d)
                                o(r(a[d]), c)
                        }
                        function o(a, b) {
                            if (a !== b) {
                                var c = a.state();
                                0 === c ? a.visit(a, void 0, a._unreport) : 0 > c && a._unreport()
                            }
                        }
                        function p(a) {
                            return "object" != typeof a || null === a ? f(new TypeError("non-iterable passed to race()")) : 0 === a.length ? g() : 1 === a.length ? e(a[0]) : q(a)
                        }
                        function q(a) {
                            var b, d, e, f = new w;
                            for (b = 0; b < a.length; ++b)
                                if (d = a[b], void 0 !== d || b in a) {
                                    if (e = r(d), 0 !== e.state()) {
                                        f.become(e), n(a, b + 1, e);
                                        break
                                    }
                                    e.visit(f, f.resolve, f.reject)
                                }
                            return new c(u, f)
                        }
                        function r(a) {
                            return J(a) ? a._handler.join() : K(a) ? t(a) : new z(a)
                        }
                        function s(a) {
                            return J(a) ? a._handler.join() : t(a)
                        }
                        function t(a) {
                            try {
                                var b = a.then;
                                return "function" == typeof b ? new y(b, a) : new z(a)
                            } catch (c) {
                                return new A(c)
                            }
                        }
                        function u() {}
                        function v() {}
                        function w(a, b) {
                            c.createContext(this, b), this.consumers = void 0, this.receiver = a, this.handler = void 0, this.resolved=!1
                        }
                        function x(a) {
                            this.handler = a
                        }
                        function y(a, b) {
                            w.call(this), W.enqueue(new G(a, b, this))
                        }
                        function z(a) {
                            c.createContext(this), this.value = a
                        }
                        function A(a) {
                            c.createContext(this), this.id=++$, this.value = a, this.handled=!1, this.reported=!1, this._report()
                        }
                        function B(a, b) {
                            this.rejection = a, this.context = b
                        }
                        function C(a) {
                            this.rejection = a
                        }
                        function D() {
                            return new A(new TypeError("Promise cycle"))
                        }
                        function E(a, b) {
                            this.continuation = a, this.handler = b
                        }
                        function F(a, b) {
                            this.handler = b, this.value = a
                        }
                        function G(a, b, c) {
                            this._then = a, this.thenable = b, this.resolver = c
                        }
                        function H(a, b, c, d, e) {
                            try {
                                a.call(b, c, d, e)
                            } catch (f) {
                                d(f)
                            }
                        }
                        function I(a, b, c, d) {
                            this.f = a, this.z = b, this.c = c, this.to = d, this.resolver = Z, this.receiver = this
                        }
                        function J(a) {
                            return a instanceof c
                        }
                        function K(a) {
                            return ("object" == typeof a || "function" == typeof a) && null !== a
                        }
                        function L(a, b, d, e) {
                            return "function" != typeof a ? e.become(b) : (c.enterContext(b), P(a, b.value, d, e), void c.exitContext())
                        }
                        function M(a, b, d, e, f) {
                            return "function" != typeof a ? f.become(d) : (c.enterContext(d), Q(a, b, d.value, e, f), void c.exitContext())
                        }
                        function N(a, b, d, e, f) {
                            return "function" != typeof a ? f.notify(b) : (c.enterContext(d), R(a, b, e, f), void c.exitContext())
                        }
                        function O(a, b, c) {
                            try {
                                return a(b, c)
                            } catch (d) {
                                return f(d)
                            }
                        }
                        function P(a, b, c, d) {
                            try {
                                d.become(r(a.call(c, b)))
                            } catch (e) {
                                d.become(new A(e))
                            }
                        }
                        function Q(a, b, c, d, e) {
                            try {
                                a.call(d, b, c, e)
                            } catch (f) {
                                e.become(new A(f))
                            }
                        }
                        function R(a, b, c, d) {
                            try {
                                d.notify(a.call(c, b))
                            } catch (e) {
                                d.notify(e)
                            }
                        }
                        function S(a, b) {
                            b.prototype = Y(a.prototype), b.prototype.constructor = b
                        }
                        function T(a, b) {
                            return b
                        }
                        function U() {}
                        function V() {
                            return "undefined" != typeof a && null !== a && "function" == typeof a.emit ? function(b, c) {
                                return "unhandledRejection" === b ? a.emit(b, c.value, c) : a.emit(b, c)
                            } : "undefined" != typeof self && "function" == typeof CustomEvent ? function(a, b, c) {
                                var d=!1;
                                try {
                                    var e = new c("unhandledRejection");
                                    d = e instanceof c
                                } catch (f) {}
                                return d ? function(a, d) {
                                    var e = new c(a, {
                                        detail: {
                                            reason: d.value,
                                            key: d
                                        },
                                        bubbles: !1,
                                        cancelable: !0
                                    });
                                    return !b.dispatchEvent(e)
                                } : a
                            }(U, self, CustomEvent) : U
                        }
                        var W = b.scheduler, X = V(), Y = Object.create || function(a) {
                            function b() {}
                            return b.prototype = a, new b
                        };
                        c.resolve = e, c.reject = f, c.never = g, c._defer = h, c._handler = r, c.prototype.then = function(a, b, c) {
                            var d = this._handler, e = d.join().state();
                            if ("function" != typeof a && e > 0 || "function" != typeof b && 0 > e)
                                return new this.constructor(u, d);
                            var f = this._beget(), g = f._handler;
                            return d.chain(g, d.receiver, a, b, c), f
                        }, c.prototype["catch"] = function(a) {
                            return this.then(void 0, a)
                        }, c.prototype._beget = function() {
                            return i(this._handler, this.constructor)
                        }, c.all = j, c.race = p, c._traverse = k, c._visitRemaining = n, u.prototype.when = u.prototype.become = u.prototype.notify = u.prototype.fail = u.prototype._unreport = u.prototype._report = U, u.prototype._state = 0, u.prototype.state = function() {
                            return this._state
                        }, u.prototype.join = function() {
                            for (var a = this; void 0 !== a.handler;)
                                a = a.handler;
                            return a
                        }, u.prototype.chain = function(a, b, c, d, e) {
                            this.when({
                                resolver: a,
                                receiver: b,
                                fulfilled: c,
                                rejected: d,
                                progress: e
                            })
                        }, u.prototype.visit = function(a, b, c, d) {
                            this.chain(Z, a, b, c, d)
                        }, u.prototype.fold = function(a, b, c, d) {
                            this.when(new I(a, b, c, d))
                        }, S(u, v), v.prototype.become = function(a) {
                            a.fail()
                        };
                        var Z = new v;
                        S(u, w), w.prototype._state = 0, w.prototype.resolve = function(a) {
                            this.become(r(a))
                        }, w.prototype.reject = function(a) {
                            this.resolved || this.become(new A(a))
                        }, w.prototype.join = function() {
                            if (!this.resolved)
                                return this;
                            for (var a = this; void 0 !== a.handler;)
                                if (a = a.handler, a === this)
                                    return this.handler = D();
                            return a
                        }, w.prototype.run = function() {
                            var a = this.consumers, b = this.handler;
                            this.handler = this.handler.join(), this.consumers = void 0;
                            for (var c = 0; c < a.length; ++c)
                                b.when(a[c])
                        }, w.prototype.become = function(a) {
                            this.resolved || (this.resolved=!0, this.handler = a, void 0 !== this.consumers && W.enqueue(this), void 0 !== this.context && a._report(this.context))
                        }, w.prototype.when = function(a) {
                            this.resolved ? W.enqueue(new E(a, this.handler)) : void 0 === this.consumers ? this.consumers = [a] : this.consumers.push(a)
                        }, w.prototype.notify = function(a) {
                            this.resolved || W.enqueue(new F(a, this))
                        }, w.prototype.fail = function(a) {
                            var b = "undefined" == typeof a ? this.context: a;
                            this.resolved && this.handler.join().fail(b)
                        }, w.prototype._report = function(a) {
                            this.resolved && this.handler.join()._report(a)
                        }, w.prototype._unreport = function() {
                            this.resolved && this.handler.join()._unreport()
                        }, S(u, x), x.prototype.when = function(a) {
                            W.enqueue(new E(a, this))
                        }, x.prototype._report = function(a) {
                            this.join()._report(a)
                        }, x.prototype._unreport = function() {
                            this.join()._unreport()
                        }, S(w, y), S(u, z), z.prototype._state = 1, z.prototype.fold = function(a, b, c, d) {
                            M(a, b, this, c, d)
                        }, z.prototype.when = function(a) {
                            L(a.fulfilled, this, a.receiver, a.resolver)
                        };
                        var $ = 0;
                        S(u, A), A.prototype._state =- 1, A.prototype.fold = function(a, b, c, d) {
                            d.become(this)
                        }, A.prototype.when = function(a) {
                            "function" == typeof a.rejected && this._unreport(), L(a.rejected, this, a.receiver, a.resolver)
                        }, A.prototype._report = function(a) {
                            W.afterQueue(new B(this, a))
                        }, A.prototype._unreport = function() {
                            this.handled || (this.handled=!0, W.afterQueue(new C(this)))
                        }, A.prototype.fail = function(a) {
                            this.reported=!0, X("unhandledRejection", this), c.onFatalRejection(this, void 0 === a ? this.context : a)
                        }, B.prototype.run = function() {
                            this.rejection.handled || this.rejection.reported || (this.rejection.reported=!0, X("unhandledRejection", this.rejection) || c.onPotentiallyUnhandledRejection(this.rejection, this.context))
                        }, C.prototype.run = function() {
                            this.rejection.reported && (X("rejectionHandled", this.rejection) || c.onPotentiallyUnhandledRejectionHandled(this.rejection))
                        }, c.createContext = c.enterContext = c.exitContext = c.onPotentiallyUnhandledRejection = c.onPotentiallyUnhandledRejectionHandled = c.onFatalRejection = U;
                        var _ = new u, aa = new c(u, _);
                        return E.prototype.run = function() {
                            this.handler.join().when(this.continuation)
                        }, F.prototype.run = function() {
                            var a = this.handler.consumers;
                            if (void 0 !== a)
                                for (var b, c = 0; c < a.length; ++c)
                                    b = a[c], N(b.progress, this.value, this.handler, b.receiver, b.resolver)
                        }, G.prototype.run = function() {
                            function a(a) {
                                d.resolve(a)
                            }
                            function b(a) {
                                d.reject(a)
                            }
                            function c(a) {
                                d.notify(a)
                            }
                            var d = this.resolver;
                            H(this._then, this.thenable, a, b, c)
                        }, I.prototype.fulfilled = function(a) {
                            this.f.call(this.c, this.z, a, this.to)
                        }, I.prototype.rejected = function(a) {
                            this.to.reject(a)
                        }, I.prototype.progress = function(a) {
                            this.to.notify(a)
                        }, c
                    }
                })
            }("function" == typeof define && define.amd ? define : function(a) {
                b.exports = a()
            })
        }).call(this, a("_process"))
    }, {
        _process: 163
    }
    ],
    183: [function(a, b, c) {
        !function(a) {
            "use strict";
            a(function() {
                function a() {
                    return {
                        state: "pending"
                    }
                }
                function b(a) {
                    return {
                        state: "rejected",
                        reason: a
                    }
                }
                function c(a) {
                    return {
                        state: "fulfilled",
                        value: a
                    }
                }
                function d(d) {
                    var e = d.state();
                    return 0 === e ? a() : e > 0 ? c(d.value) : b(d.value)
                }
                return {
                    pending: a,
                    fulfilled: c,
                    rejected: b,
                    inspect: d
                }
            })
        }("function" == typeof define && define.amd ? define : function(a) {
            b.exports = a()
        })
    }, {}
    ],
    184: [function(a, b, c) {
        !function(a) {
            "use strict";
            a(function(a) {
                function b(a, b, c, d) {
                    var e = x.resolve(a);
                    return arguments.length < 2 ? e : e.then(b, c, d)
                }
                function c(a) {
                    return new x(a)
                }
                function d(a) {
                    return function() {
                        for (var b = 0, c = arguments.length, d = new Array(c); c > b; ++b)
                            d[b] = arguments[b];
                        return y(a, this, d)
                    }
                }
                function e(a) {
                    for (var b = 0, c = arguments.length - 1, d = new Array(c); c > b; ++b)
                        d[b] = arguments[b + 1];
                    return y(a, this, d)
                }
                function f() {
                    return new g
                }
                function g() {
                    function a(a) {
                        d._handler.resolve(a)
                    }
                    function b(a) {
                        d._handler.reject(a)
                    }
                    function c(a) {
                        d._handler.notify(a)
                    }
                    var d = x._defer();
                    this.promise = d, this.resolve = a, this.reject = b, this.notify = c, this.resolver = {
                        resolve: a,
                        reject: b,
                        notify: c
                    }
                }
                function h(a) {
                    return a && "function" == typeof a.then
                }
                function i() {
                    return x.all(arguments)
                }
                function j(a) {
                    return b(a, x.all)
                }
                function k(a) {
                    return b(a, x.settle)
                }
                function l(a, c) {
                    return b(a, function(a) {
                        return x.map(a, c)
                    })
                }
                function m(a, c) {
                    return b(a, function(a) {
                        return x.filter(a, c)
                    })
                }
                var n = a("./lib/decorators/timed"), o = a("./lib/decorators/array"), p = a("./lib/decorators/flow"), q = a("./lib/decorators/fold"), r = a("./lib/decorators/inspect"), s = a("./lib/decorators/iterate"), t = a("./lib/decorators/progress"), u = a("./lib/decorators/with"), v = a("./lib/decorators/unhandledRejection"), w = a("./lib/TimeoutError"), x = [o, p, q, s, t, r, u, n, v].reduce(function(a, b) {
                    return b(a)
                }, a("./lib/Promise")), y = a("./lib/apply")(x);
                return b.promise = c, b.resolve = x.resolve, b.reject = x.reject, b.lift = d, b["try"] = e, b.attempt = e, b.iterate = x.iterate, b.unfold = x.unfold, b.join = i, b.all = j, b.settle = k, b.any = d(x.any), b.some = d(x.some), b.race = d(x.race), b.map = l, b.filter = m, b.reduce = d(x.reduce), b.reduceRight = d(x.reduceRight), b.isPromiseLike = h, b.Promise = x, b.defer = f, b.TimeoutError = w, b
            })
        }("function" == typeof define && define.amd ? define : function(c) {
            b.exports = c(a)
        })
    }, {
        "./lib/Promise": 167,
        "./lib/TimeoutError": 169,
        "./lib/apply": 170,
        "./lib/decorators/array": 171,
        "./lib/decorators/flow": 172,
        "./lib/decorators/fold": 173,
        "./lib/decorators/inspect": 174,
        "./lib/decorators/iterate": 175,
        "./lib/decorators/progress": 176,
        "./lib/decorators/timed": 177,
        "./lib/decorators/unhandledRejection": 178,
        "./lib/decorators/with": 179
    }
    ]
}, {}, [86]);

