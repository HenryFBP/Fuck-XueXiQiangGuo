module.exports = function() {
    const t = {
            "Content-Type": "text/plain; charset=utf-8"
        },
        e = (t => {
            const e = [];
            return Object.entries(t).forEach(([t, r]) => {
                const n = +t + 32,
                    o = String.fromCodePoint(n);
                r.forEach(t => {
                    e[t] = o
                })
            }), e.join("")
        })({
            13: [15],
            14: [18, 23, 31],
            15: [6, 7],
            17: [17],
            26: [5],
            65: [9, 14],
            67: [8, 12],
            68: [32],
            69: [28, 33],
            70: [19],
            72: [0, 13],
            75: [22, 27],
            79: [25],
            80: [3, 10],
            82: [26, 29],
            83: [4, 30],
            84: [1, 2, 11],
            86: [16, 34],
            87: [24],
            88: [20, 21]
        }),
        r = "OdU2jThhYjN1ZmWzxMDZjOc3ZGE3N0d1NzQ0M9E",
        n = t => (t => t && "string" == typeof t && 4 == t.length)(t = t.replace(/\s/g, "")) ? t : null;
    return {
        getCaptchaText: async(o, c = r) => {
            const a = await (async(o, c = r, a = e) => {
                try {
                    const e = await fetch(a, {
                            method: "POST",
                            referrer: "",
                            referrerPolicy: "no-referrer",
                            body: JSON.stringify({
                                url: o,
                                token: c
                            }),
                            headers: t
                        }),
                        r = (await e.json()).text;
                    return n(r)
                } catch (t) {
                    return null
                }
            })(o, c);
            return a || ""
        }
    }
}();