module.exports = function () {
    const {
        ipcRenderer: e
    } = require("electron"), t = require("./qrcode.js"), {
        passwdLoginPage: o
    } = require("./paths.js"), {
        getRandomNumberBetween: n,
        realMouseClickOn: r,
        getRealDocumentObject: c
    } = require("./util.js"), {
        getCaptchaText: s
    } = require("./captcha.js"), i = document.createElement.bind(document), u = async () => {
        const o = await c(),
            n = await new Promise(e => {
                const t = new MutationObserver(() => {
                    const n = o.querySelector("#ddlogin-iframe");
                    n && (t.disconnect(), n.onload = (() => {
                        e(n.contentDocument)
                    }))
                });
                t.observe(o.querySelector(".layout-body"), {
                    childList: !0,
                    subtree: !0
                })
            }),
            r = n.querySelector("#app > div").__vue__,
            s = await new Promise(e => {
                const t = setInterval(() => {
                    const o = r.qrcode;
                    o && (clearInterval(t), e(o))
                }, 1e3)
            });
        (e => {
            const t = e.querySelector(".login_qrcode_refresh"),
                o = new MutationObserver(() => {
                    "none" !== t.style.display && (o.disconnect(), top.location.reload())
                });
            o.observe(t, {
                attributes: !0
            })
        })(n);
        const i = await t.generatePromise(s, {
            small: !0
        });
        return console.log(s), e.send("log", `\n请使用学习强国APP扫码登录:\n${i}\n`), e.send("log", `或者使用学习强国APP打开此链接:\n${s}\n`), s
    }, a = /^(?:(\+\d+)-)?(\d+)$/;
    return {
        onLogin: () => {
            document.querySelectorAll(".layout-header, .redflagbox, .layout-footer").forEach(e => {
                e.style.display = "none"
            });
            const t = e.sendSync("isHeadless"),
                n = e.sendSync("isDev");
            (t || n) && u(), (async () => {
                const e = await new Promise(e => {
                    const t = new MutationObserver(() => {
                        const o = document.querySelector(".ddlogintext");
                        o && (t.disconnect(), e(o))
                    });
                    t.observe(document.querySelector(".layout-body"), {
                        childList: !0,
                        subtree: !0
                    })
                }),
                    t = i("a");
                t.href = o, t.style.color = "#2db7f5", t.text = "使用用户名和密码登录", e.append(i("br"), i("br"), t)
            })(), [document.documentElement, document.body].forEach(e => {
                e.style.minWidth = "unset"
            })
        },
        isLoggedIn: () => document.cookie.includes("token="),
        onAutoLogin: async e => {
            if (!e) return;
            const {
                userName: t,
                passwd: o
            } = e, c = t.match(a);
            if (!c) return;
            const i = c[1],
                u = c[2],
                l = document.querySelector("#mobile"),
                d = document.querySelector("#pwd");
            await new Promise(e => {
                const t = new MutationObserver(() => {
                    let {
                        width: o
                    } = l.getBoundingClientRect();
                    o > 0 && (t.disconnect(), e())
                });
                t.observe(document.querySelector(".loginBox"), {
                    subtree: !0,
                    childList: !0
                })
            }), [l, d].forEach(e => {
                r(e)
            }), l.value = u, d.value = o, i && (document.querySelector("#countryCode").value = i);
            const m = document.querySelector("#loginBtn");
            setTimeout(() => {
                r(m)
            }, 1e3 * (10 + n(0, 3)));
            const y = document.querySelector(".indentify_content > img"),
                b = document.querySelector("#identifyCode");
            new MutationObserver(async () => {
                if (y.src) {
                    const e = await s(y.src);
                    b.value = e, m.click()
                }
            }).observe(y, {
                attributes: !0,
                attributeFilter: ["src"]
            })
        }
    }
}();