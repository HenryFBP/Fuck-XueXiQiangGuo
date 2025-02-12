module.exports = function() {
    "use strict";
    var t = {
        MODE_NUMBER: 1,
        MODE_ALPHA_NUM: 2,
        MODE_8BIT_BYTE: 4,
        MODE_KANJI: 8
    };

    function e(e) {
        this.mode = t.MODE_8BIT_BYTE, this.data = e
    }
    e.prototype = {
        getLength: function() {
            return this.data.length
        },
        write: function(t) {
            for (var e = 0; e < this.data.length; e++) t.put(this.data.charCodeAt(e), 8)
        }
    };
    for (var r = e, n = {
            glog: function(t) {
                if (t < 1) throw new Error("glog(" + t + ")");
                return n.LOG_TABLE[t]
            },
            gexp: function(t) {
                for (; t < 0;) t += 255;
                for (; t >= 256;) t -= 255;
                return n.EXP_TABLE[t]
            },
            EXP_TABLE: new Array(256),
            LOG_TABLE: new Array(256)
        }, o = 0; o < 8; o++) n.EXP_TABLE[o] = 1 << o;
    for (o = 8; o < 256; o++) n.EXP_TABLE[o] = n.EXP_TABLE[o - 4] ^ n.EXP_TABLE[o - 5] ^ n.EXP_TABLE[o - 6] ^ n.EXP_TABLE[o - 8];
    for (o = 0; o < 255; o++) n.LOG_TABLE[n.EXP_TABLE[o]] = o;
    var i = n;

    function s(t, e) {
        if (void 0 === t.length) throw new Error(t.length + "/" + e);
        for (var r = 0; r < t.length && 0 === t[r];) r++;
        this.num = new Array(t.length - r + e);
        for (var n = 0; n < t.length - r; n++) this.num[n] = t[n + r]
    }
    s.prototype = {
        get: function(t) {
            return this.num[t]
        },
        getLength: function() {
            return this.num.length
        },
        multiply: function(t) {
            for (var e = new Array(this.getLength() + t.getLength() - 1), r = 0; r < this.getLength(); r++)
                for (var n = 0; n < t.getLength(); n++) e[r + n] ^= i.gexp(i.glog(this.get(r)) + i.glog(t.get(n)));
            return new s(e, 0)
        },
        mod: function(t) {
            if (this.getLength() - t.getLength() < 0) return this;
            for (var e = i.glog(this.get(0)) - i.glog(t.get(0)), r = new Array(this.getLength()), n = 0; n < this.getLength(); n++) r[n] = this.get(n);
            for (var o = 0; o < t.getLength(); o++) r[o] ^= i.gexp(i.glog(t.get(o)) + e);
            return new s(r, 0).mod(t)
        }
    };
    var u = s,
        a = 0,
        h = 1,
        l = 2,
        f = 3,
        g = 4,
        m = 5,
        c = 6,
        d = 7,
        L = {
            PATTERN_POSITION_TABLE: [
                [],
                [6, 18],
                [6, 22],
                [6, 26],
                [6, 30],
                [6, 34],
                [6, 22, 38],
                [6, 24, 42],
                [6, 26, 46],
                [6, 28, 50],
                [6, 30, 54],
                [6, 32, 58],
                [6, 34, 62],
                [6, 26, 46, 66],
                [6, 26, 48, 70],
                [6, 26, 50, 74],
                [6, 30, 54, 78],
                [6, 30, 56, 82],
                [6, 30, 58, 86],
                [6, 34, 62, 90],
                [6, 28, 50, 72, 94],
                [6, 26, 50, 74, 98],
                [6, 30, 54, 78, 102],
                [6, 28, 54, 80, 106],
                [6, 32, 58, 84, 110],
                [6, 30, 58, 86, 114],
                [6, 34, 62, 90, 118],
                [6, 26, 50, 74, 98, 122],
                [6, 30, 54, 78, 102, 126],
                [6, 26, 52, 78, 104, 130],
                [6, 30, 56, 82, 108, 134],
                [6, 34, 60, 86, 112, 138],
                [6, 30, 58, 86, 114, 142],
                [6, 34, 62, 90, 118, 146],
                [6, 30, 54, 78, 102, 126, 150],
                [6, 24, 50, 76, 102, 128, 154],
                [6, 28, 54, 80, 106, 132, 158],
                [6, 32, 58, 84, 110, 136, 162],
                [6, 26, 54, 82, 110, 138, 166],
                [6, 30, 58, 86, 114, 142, 170]
            ],
            G15: 1335,
            G18: 7973,
            G15_MASK: 21522,
            getBCHTypeInfo: function(t) {
                for (var e = t << 10; L.getBCHDigit(e) - L.getBCHDigit(L.G15) >= 0;) e ^= L.G15 << L.getBCHDigit(e) - L.getBCHDigit(L.G15);
                return (t << 10 | e) ^ L.G15_MASK
            },
            getBCHTypeNumber: function(t) {
                for (var e = t << 12; L.getBCHDigit(e) - L.getBCHDigit(L.G18) >= 0;) e ^= L.G18 << L.getBCHDigit(e) - L.getBCHDigit(L.G18);
                return t << 12 | e
            },
            getBCHDigit: function(t) {
                for (var e = 0; 0 !== t;) e++, t >>>= 1;
                return e
            },
            getPatternPosition: function(t) {
                return L.PATTERN_POSITION_TABLE[t - 1]
            },
            getMask: function(t, e, r) {
                switch (t) {
                    case a:
                        return (e + r) % 2 == 0;
                    case h:
                        return e % 2 == 0;
                    case l:
                        return r % 3 == 0;
                    case f:
                        return (e + r) % 3 == 0;
                    case g:
                        return (Math.floor(e / 2) + Math.floor(r / 3)) % 2 == 0;
                    case m:
                        return e * r % 2 + e * r % 3 == 0;
                    case c:
                        return (e * r % 2 + e * r % 3) % 2 == 0;
                    case d:
                        return (e * r % 3 + (e + r) % 2) % 2 == 0;
                    default:
                        throw new Error("bad maskPattern:" + t)
                }
            },
            getErrorCorrectPolynomial: function(t) {
                for (var e = new u([1], 0), r = 0; r < t; r++) e = e.multiply(new u([1, i.gexp(r)], 0));
                return e
            },
            getLengthInBits: function(e, r) {
                if (1 <= r && r < 10) switch (e) {
                    case t.MODE_NUMBER:
                        return 10;
                    case t.MODE_ALPHA_NUM:
                        return 9;
                    case t.MODE_8BIT_BYTE:
                    case t.MODE_KANJI:
                        return 8;
                    default:
                        throw new Error("mode:" + e)
                } else if (r < 27) switch (e) {
                    case t.MODE_NUMBER:
                        return 12;
                    case t.MODE_ALPHA_NUM:
                        return 11;
                    case t.MODE_8BIT_BYTE:
                        return 16;
                    case t.MODE_KANJI:
                        return 10;
                    default:
                        throw new Error("mode:" + e)
                } else {
                    if (!(r < 41)) throw new Error("type:" + r);
                    switch (e) {
                        case t.MODE_NUMBER:
                            return 14;
                        case t.MODE_ALPHA_NUM:
                            return 13;
                        case t.MODE_8BIT_BYTE:
                            return 16;
                        case t.MODE_KANJI:
                            return 12;
                        default:
                            throw new Error("mode:" + e)
                    }
                }
            },
            getLostPoint: function(t) {
                var e = t.getModuleCount(),
                    r = 0,
                    n = 0,
                    o = 0;
                for (n = 0; n < e; n++)
                    for (o = 0; o < e; o++) {
                        for (var i = 0, s = t.isDark(n, o), u = -1; u <= 1; u++)
                            if (!(n + u < 0 || e <= n + u))
                                for (var a = -1; a <= 1; a++) o + a < 0 || e <= o + a || 0 === u && 0 === a || s === t.isDark(n + u, o + a) && i++;
                        i > 5 && (r += 3 + i - 5)
                    }
                for (n = 0; n < e - 1; n++)
                    for (o = 0; o < e - 1; o++) {
                        var h = 0;
                        t.isDark(n, o) && h++, t.isDark(n + 1, o) && h++, t.isDark(n, o + 1) && h++, t.isDark(n + 1, o + 1) && h++, 0 !== h && 4 !== h || (r += 3)
                    }
                for (n = 0; n < e; n++)
                    for (o = 0; o < e - 6; o++) t.isDark(n, o) && !t.isDark(n, o + 1) && t.isDark(n, o + 2) && t.isDark(n, o + 3) && t.isDark(n, o + 4) && !t.isDark(n, o + 5) && t.isDark(n, o + 6) && (r += 40);
                for (o = 0; o < e; o++)
                    for (n = 0; n < e - 6; n++) t.isDark(n, o) && !t.isDark(n + 1, o) && t.isDark(n + 2, o) && t.isDark(n + 3, o) && t.isDark(n + 4, o) && !t.isDark(n + 5, o) && t.isDark(n + 6, o) && (r += 40);
                var l = 0;
                for (o = 0; o < e; o++)
                    for (n = 0; n < e; n++) t.isDark(n, o) && l++;
                return r += 10 * (Math.abs(100 * l / e / e - 50) / 5)
            }
        },
        v = L,
        B = {
            L: 1,
            M: 0,
            Q: 3,
            H: 2
        };

    function E(t, e) {
        this.totalCount = t, this.dataCount = e
    }
    E.RS_BLOCK_TABLE = [
        [1, 26, 19],
        [1, 26, 16],
        [1, 26, 13],
        [1, 26, 9],
        [1, 44, 34],
        [1, 44, 28],
        [1, 44, 22],
        [1, 44, 16],
        [1, 70, 55],
        [1, 70, 44],
        [2, 35, 17],
        [2, 35, 13],
        [1, 100, 80],
        [2, 50, 32],
        [2, 50, 24],
        [4, 25, 9],
        [1, 134, 108],
        [2, 67, 43],
        [2, 33, 15, 2, 34, 16],
        [2, 33, 11, 2, 34, 12],
        [2, 86, 68],
        [4, 43, 27],
        [4, 43, 19],
        [4, 43, 15],
        [2, 98, 78],
        [4, 49, 31],
        [2, 32, 14, 4, 33, 15],
        [4, 39, 13, 1, 40, 14],
        [2, 121, 97],
        [2, 60, 38, 2, 61, 39],
        [4, 40, 18, 2, 41, 19],
        [4, 40, 14, 2, 41, 15],
        [2, 146, 116],
        [3, 58, 36, 2, 59, 37],
        [4, 36, 16, 4, 37, 17],
        [4, 36, 12, 4, 37, 13],
        [2, 86, 68, 2, 87, 69],
        [4, 69, 43, 1, 70, 44],
        [6, 43, 19, 2, 44, 20],
        [6, 43, 15, 2, 44, 16],
        [4, 101, 81],
        [1, 80, 50, 4, 81, 51],
        [4, 50, 22, 4, 51, 23],
        [3, 36, 12, 8, 37, 13],
        [2, 116, 92, 2, 117, 93],
        [6, 58, 36, 2, 59, 37],
        [4, 46, 20, 6, 47, 21],
        [7, 42, 14, 4, 43, 15],
        [4, 133, 107],
        [8, 59, 37, 1, 60, 38],
        [8, 44, 20, 4, 45, 21],
        [12, 33, 11, 4, 34, 12],
        [3, 145, 115, 1, 146, 116],
        [4, 64, 40, 5, 65, 41],
        [11, 36, 16, 5, 37, 17],
        [11, 36, 12, 5, 37, 13],
        [5, 109, 87, 1, 110, 88],
        [5, 65, 41, 5, 66, 42],
        [5, 54, 24, 7, 55, 25],
        [11, 36, 12],
        [5, 122, 98, 1, 123, 99],
        [7, 73, 45, 3, 74, 46],
        [15, 43, 19, 2, 44, 20],
        [3, 45, 15, 13, 46, 16],
        [1, 135, 107, 5, 136, 108],
        [10, 74, 46, 1, 75, 47],
        [1, 50, 22, 15, 51, 23],
        [2, 42, 14, 17, 43, 15],
        [5, 150, 120, 1, 151, 121],
        [9, 69, 43, 4, 70, 44],
        [17, 50, 22, 1, 51, 23],
        [2, 42, 14, 19, 43, 15],
        [3, 141, 113, 4, 142, 114],
        [3, 70, 44, 11, 71, 45],
        [17, 47, 21, 4, 48, 22],
        [9, 39, 13, 16, 40, 14],
        [3, 135, 107, 5, 136, 108],
        [3, 67, 41, 13, 68, 42],
        [15, 54, 24, 5, 55, 25],
        [15, 43, 15, 10, 44, 16],
        [4, 144, 116, 4, 145, 117],
        [17, 68, 42],
        [17, 50, 22, 6, 51, 23],
        [19, 46, 16, 6, 47, 17],
        [2, 139, 111, 7, 140, 112],
        [17, 74, 46],
        [7, 54, 24, 16, 55, 25],
        [34, 37, 13],
        [4, 151, 121, 5, 152, 122],
        [4, 75, 47, 14, 76, 48],
        [11, 54, 24, 14, 55, 25],
        [16, 45, 15, 14, 46, 16],
        [6, 147, 117, 4, 148, 118],
        [6, 73, 45, 14, 74, 46],
        [11, 54, 24, 16, 55, 25],
        [30, 46, 16, 2, 47, 17],
        [8, 132, 106, 4, 133, 107],
        [8, 75, 47, 13, 76, 48],
        [7, 54, 24, 22, 55, 25],
        [22, 45, 15, 13, 46, 16],
        [10, 142, 114, 2, 143, 115],
        [19, 74, 46, 4, 75, 47],
        [28, 50, 22, 6, 51, 23],
        [33, 46, 16, 4, 47, 17],
        [8, 152, 122, 4, 153, 123],
        [22, 73, 45, 3, 74, 46],
        [8, 53, 23, 26, 54, 24],
        [12, 45, 15, 28, 46, 16],
        [3, 147, 117, 10, 148, 118],
        [3, 73, 45, 23, 74, 46],
        [4, 54, 24, 31, 55, 25],
        [11, 45, 15, 31, 46, 16],
        [7, 146, 116, 7, 147, 117],
        [21, 73, 45, 7, 74, 46],
        [1, 53, 23, 37, 54, 24],
        [19, 45, 15, 26, 46, 16],
        [5, 145, 115, 10, 146, 116],
        [19, 75, 47, 10, 76, 48],
        [15, 54, 24, 25, 55, 25],
        [23, 45, 15, 25, 46, 16],
        [13, 145, 115, 3, 146, 116],
        [2, 74, 46, 29, 75, 47],
        [42, 54, 24, 1, 55, 25],
        [23, 45, 15, 28, 46, 16],
        [17, 145, 115],
        [10, 74, 46, 23, 75, 47],
        [10, 54, 24, 35, 55, 25],
        [19, 45, 15, 35, 46, 16],
        [17, 145, 115, 1, 146, 116],
        [14, 74, 46, 21, 75, 47],
        [29, 54, 24, 19, 55, 25],
        [11, 45, 15, 46, 46, 16],
        [13, 145, 115, 6, 146, 116],
        [14, 74, 46, 23, 75, 47],
        [44, 54, 24, 7, 55, 25],
        [59, 46, 16, 1, 47, 17],
        [12, 151, 121, 7, 152, 122],
        [12, 75, 47, 26, 76, 48],
        [39, 54, 24, 14, 55, 25],
        [22, 45, 15, 41, 46, 16],
        [6, 151, 121, 14, 152, 122],
        [6, 75, 47, 34, 76, 48],
        [46, 54, 24, 10, 55, 25],
        [2, 45, 15, 64, 46, 16],
        [17, 152, 122, 4, 153, 123],
        [29, 74, 46, 14, 75, 47],
        [49, 54, 24, 10, 55, 25],
        [24, 45, 15, 46, 46, 16],
        [4, 152, 122, 18, 153, 123],
        [13, 74, 46, 32, 75, 47],
        [48, 54, 24, 14, 55, 25],
        [42, 45, 15, 32, 46, 16],
        [20, 147, 117, 4, 148, 118],
        [40, 75, 47, 7, 76, 48],
        [43, 54, 24, 22, 55, 25],
        [10, 45, 15, 67, 46, 16],
        [19, 148, 118, 6, 149, 119],
        [18, 75, 47, 31, 76, 48],
        [34, 54, 24, 34, 55, 25],
        [20, 45, 15, 61, 46, 16]
    ], E.getRSBlocks = function(t, e) {
        var r = E.getRsBlockTable(t, e);
        if (void 0 === r) throw new Error("bad rs block @ typeNumber:" + t + "/errorCorrectLevel:" + e);
        for (var n = r.length / 3, o = [], i = 0; i < n; i++)
            for (var s = r[3 * i + 0], u = r[3 * i + 1], a = r[3 * i + 2], h = 0; h < s; h++) o.push(new E(u, a));
        return o
    }, E.getRsBlockTable = function(t, e) {
        switch (e) {
            case B.L:
                return E.RS_BLOCK_TABLE[4 * (t - 1) + 0];
            case B.M:
                return E.RS_BLOCK_TABLE[4 * (t - 1) + 1];
            case B.Q:
                return E.RS_BLOCK_TABLE[4 * (t - 1) + 2];
            case B.H:
                return E.RS_BLOCK_TABLE[4 * (t - 1) + 3];
            default:
                return
        }
    };
    var C = E;

    function p() {
        this.buffer = [], this.length = 0
    }
    p.prototype = {
        get: function(t) {
            var e = Math.floor(t / 8);
            return 1 == (this.buffer[e] >>> 7 - t % 8 & 1)
        },
        put: function(t, e) {
            for (var r = 0; r < e; r++) this.putBit(1 == (t >>> e - r - 1 & 1))
        },
        getLengthInBits: function() {
            return this.length
        },
        putBit: function(t) {
            var e = Math.floor(this.length / 8);
            this.buffer.length <= e && this.buffer.push(0), t && (this.buffer[e] |= 128 >>> this.length % 8), this.length++
        }
    };
    var A = p;

    function _(t, e) {
        this.typeNumber = t, this.errorCorrectLevel = e, this.modules = null, this.moduleCount = 0, this.dataCache = null, this.dataList = []
    }
    _.prototype = {
        addData: function(t) {
            var e = new r(t);
            this.dataList.push(e), this.dataCache = null
        },
        isDark: function(t, e) {
            if (t < 0 || this.moduleCount <= t || e < 0 || this.moduleCount <= e) throw new Error(t + "," + e);
            return this.modules[t][e]
        },
        getModuleCount: function() {
            return this.moduleCount
        },
        make: function() {
            if (this.typeNumber < 1) {
                var t = 1;
                for (t = 1; t < 40; t++) {
                    for (var e = C.getRSBlocks(t, this.errorCorrectLevel), r = new A, n = 0, o = 0; o < e.length; o++) n += e[o].dataCount;
                    for (var i = 0; i < this.dataList.length; i++) {
                        var s = this.dataList[i];
                        r.put(s.mode, 4), r.put(s.getLength(), v.getLengthInBits(s.mode, t)), s.write(r)
                    }
                    if (r.getLengthInBits() <= 8 * n) break
                }
                this.typeNumber = t
            }
            this.makeImpl(!1, this.getBestMaskPattern())
        },
        makeImpl: function(t, e) {
            this.moduleCount = 4 * this.typeNumber + 17, this.modules = new Array(this.moduleCount);
            for (var r = 0; r < this.moduleCount; r++) {
                this.modules[r] = new Array(this.moduleCount);
                for (var n = 0; n < this.moduleCount; n++) this.modules[r][n] = null
            }
            this.setupPositionProbePattern(0, 0), this.setupPositionProbePattern(this.moduleCount - 7, 0), this.setupPositionProbePattern(0, this.moduleCount - 7), this.setupPositionAdjustPattern(), this.setupTimingPattern(), this.setupTypeInfo(t, e), this.typeNumber >= 7 && this.setupTypeNumber(t), null === this.dataCache && (this.dataCache = _.createData(this.typeNumber, this.errorCorrectLevel, this.dataList)), this.mapData(this.dataCache, e)
        },
        setupPositionProbePattern: function(t, e) {
            for (var r = -1; r <= 7; r++)
                if (!(t + r <= -1 || this.moduleCount <= t + r))
                    for (var n = -1; n <= 7; n++) e + n <= -1 || this.moduleCount <= e + n || (this.modules[t + r][e + n] = 0 <= r && r <= 6 && (0 === n || 6 === n) || 0 <= n && n <= 6 && (0 === r || 6 === r) || 2 <= r && r <= 4 && 2 <= n && n <= 4)
        },
        getBestMaskPattern: function() {
            for (var t = 0, e = 0, r = 0; r < 8; r++) {
                this.makeImpl(!0, r);
                var n = v.getLostPoint(this);
                (0 === r || t > n) && (t = n, e = r)
            }
            return e
        },
        createMovieClip: function(t, e, r) {
            var n = t.createEmptyMovieClip(e, r);
            this.make();
            for (var o = 0; o < this.modules.length; o++)
                for (var i = 1 * o, s = 0; s < this.modules[o].length; s++) {
                    var u = 1 * s;
                    this.modules[o][s] && (n.beginFill(0, 100), n.moveTo(u, i), n.lineTo(u + 1, i), n.lineTo(u + 1, i + 1), n.lineTo(u, i + 1), n.endFill())
                }
            return n
        },
        setupTimingPattern: function() {
            for (var t = 8; t < this.moduleCount - 8; t++) null === this.modules[t][6] && (this.modules[t][6] = t % 2 == 0);
            for (var e = 8; e < this.moduleCount - 8; e++) null === this.modules[6][e] && (this.modules[6][e] = e % 2 == 0)
        },
        setupPositionAdjustPattern: function() {
            for (var t = v.getPatternPosition(this.typeNumber), e = 0; e < t.length; e++)
                for (var r = 0; r < t.length; r++) {
                    var n = t[e],
                        o = t[r];
                    if (null === this.modules[n][o])
                        for (var i = -2; i <= 2; i++)
                            for (var s = -2; s <= 2; s++) 2 === Math.abs(i) || 2 === Math.abs(s) || 0 === i && 0 === s ? this.modules[n + i][o + s] = !0 : this.modules[n + i][o + s] = !1
                }
        },
        setupTypeNumber: function(t) {
            for (var e, r = v.getBCHTypeNumber(this.typeNumber), n = 0; n < 18; n++) e = !t && 1 == (r >> n & 1), this.modules[Math.floor(n / 3)][n % 3 + this.moduleCount - 8 - 3] = e;
            for (var o = 0; o < 18; o++) e = !t && 1 == (r >> o & 1), this.modules[o % 3 + this.moduleCount - 8 - 3][Math.floor(o / 3)] = e
        },
        setupTypeInfo: function(t, e) {
            for (var r, n = this.errorCorrectLevel << 3 | e, o = v.getBCHTypeInfo(n), i = 0; i < 15; i++) r = !t && 1 == (o >> i & 1), i < 6 ? this.modules[i][8] = r : i < 8 ? this.modules[i + 1][8] = r : this.modules[this.moduleCount - 15 + i][8] = r;
            for (var s = 0; s < 15; s++) r = !t && 1 == (o >> s & 1), s < 8 ? this.modules[8][this.moduleCount - s - 1] = r : s < 9 ? this.modules[8][15 - s - 1 + 1] = r : this.modules[8][15 - s - 1] = r;
            this.modules[this.moduleCount - 8][8] = !t
        },
        mapData: function(t, e) {
            for (var r = -1, n = this.moduleCount - 1, o = 7, i = 0, s = this.moduleCount - 1; s > 0; s -= 2)
                for (6 === s && s--;;) {
                    for (var u = 0; u < 2; u++)
                        if (null === this.modules[n][s - u]) {
                            var a = !1;
                            i < t.length && (a = 1 == (t[i] >>> o & 1)), v.getMask(e, n, s - u) && (a = !a), this.modules[n][s - u] = a, -1 === --o && (i++, o = 7)
                        }
                    if ((n += r) < 0 || this.moduleCount <= n) {
                        n -= r, r = -r;
                        break
                    }
                }
        }
    }, _.PAD0 = 236, _.PAD1 = 17, _.createData = function(t, e, r) {
        for (var n = C.getRSBlocks(t, e), o = new A, i = 0; i < r.length; i++) {
            var s = r[i];
            o.put(s.mode, 4), o.put(s.getLength(), v.getLengthInBits(s.mode, t)), s.write(o)
        }
        for (var u = 0, a = 0; a < n.length; a++) u += n[a].dataCount;
        if (o.getLengthInBits() > 8 * u) throw new Error("code length overflow. (" + o.getLengthInBits() + ">" + 8 * u + ")");
        for (o.getLengthInBits() + 4 <= 8 * u && o.put(0, 4); o.getLengthInBits() % 8 != 0;) o.putBit(!1);
        for (; !(o.getLengthInBits() >= 8 * u || (o.put(_.PAD0, 8), o.getLengthInBits() >= 8 * u));) o.put(_.PAD1, 8);
        return _.createBytes(o, n)
    }, _.createBytes = function(t, e) {
        for (var r = 0, n = 0, o = 0, i = new Array(e.length), s = new Array(e.length), a = 0; a < e.length; a++) {
            var h = e[a].dataCount,
                l = e[a].totalCount - h;
            n = Math.max(n, h), o = Math.max(o, l), i[a] = new Array(h);
            for (var f = 0; f < i[a].length; f++) i[a][f] = 255 & t.buffer[f + r];
            r += h;
            var g = v.getErrorCorrectPolynomial(l),
                m = new u(i[a], g.getLength() - 1).mod(g);
            s[a] = new Array(g.getLength() - 1);
            for (var c = 0; c < s[a].length; c++) {
                var d = c + m.getLength() - s[a].length;
                s[a][c] = d >= 0 ? m.get(d) : 0
            }
        }
        for (var L = 0, B = 0; B < e.length; B++) L += e[B].totalCount;
        for (var E = new Array(L), C = 0, p = 0; p < n; p++)
            for (var A = 0; A < e.length; A++) p < i[A].length && (E[C++] = i[A][p]);
        for (var _ = 0; _ < o; _++)
            for (var T = 0; T < e.length; T++) _ < s[T].length && (E[C++] = s[T][_]);
        return E
    };
    var T = _,
        D = "[47m  [0m",
        w = function(t) {
            return t ? "[40m  [0m" : D
        },
        P = function(t) {
            return {
                times: function(e) {
                    return new Array(e).join(t)
                }
            }
        },
        M = {
            error: B.L,
            generate: function(t, e, r) {
                "function" == typeof e && (r = e, e = {});
                var n = new T(-1, this.error);
                n.addData(t), n.make();
                var o = "";
                if (e && e.small) {
                    var i = n.getModuleCount(),
                        s = n.modules.slice(),
                        u = i % 2 == 1;
                    u && s.push(function(t, e) {
                        for (var r = new Array(t), n = 0; n < t; n++) r[n] = e;
                        return r
                    }(i, !1));
                    var a = {
                            WHITE_ALL: "█",
                            WHITE_BLACK: "▀",
                            BLACK_WHITE: "▄",
                            BLACK_ALL: " "
                        },
                        h = P(a.BLACK_WHITE).times(i + 3),
                        l = P(a.WHITE_BLACK).times(i + 3);
                    o += h + "\n";
                    for (var f = 0; f < i; f += 2) {
                        o += a.WHITE_ALL;
                        for (var g = 0; g < i; g++) !1 === s[f][g] && !1 === s[f + 1][g] ? o += a.WHITE_ALL : !1 === s[f][g] && !0 === s[f + 1][g] ? o += a.WHITE_BLACK : !0 === s[f][g] && !1 === s[f + 1][g] ? o += a.BLACK_WHITE : o += a.BLACK_ALL;
                        o += a.WHITE_ALL + "\n"
                    }
                    u || (o += l)
                } else {
                    var m = P(D).times(n.getModuleCount() + 3);
                    o += m + "\n", n.modules.forEach(function(t) {
                        o += D, o += t.map(w).join(""), o += D + "\n"
                    }), o += m
                }
                r ? r(o) : console.log(o)
            },
            setErrorLevel: function(t) {
                this.error = B[t] || this.error
            },
            generatePromise: function(t, e) {
                return new Promise(function(r) {
                    M.generate(t, e, function(t) {
                        e.output && console.log(t), r(t)
                    })
                })
            }
        };
    return M
}();