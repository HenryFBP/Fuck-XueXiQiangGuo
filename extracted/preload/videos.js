module.exports = function () { const e = require("./channels.js"), { getChannelsData: t, getRandomElement: n, getRandomNumberBetween: o } = require("./util.js"); let i = null; const r = async () => { if (i && Array.isArray(i)) return i; { const n = await t(e.videos); return i = n, n } }, a = async () => { const e = await r(); return n(e) }, s = async () => (await a()).url; return { getVideoList: r, getRandomVideo: a, getRandomVideoURL: s, openVideo: async (e = s()) => { const t = await e; location.href = t }, watchVideo: async (e = 70, t = !0) => { window.scrollBy({ top: window.innerHeight + o(-20, 20), behavior: "smooth" }); const n = window.setInterval(() => { window.scrollBy({ top: o(-10, 10), behavior: "smooth" }) }, 1e3); if (await new Promise(e => { const t = new MutationObserver(() => { const n = document.querySelector("video"), o = document.querySelector("#alertBox"); n ? (t.disconnect(), e(n)) : (o && o.textContent.includes("正在维护") || !window.Aliplayer) && e(null) }); t.observe(document, { childList: !0, subtree: !0 }), setTimeout(() => { t.disconnect(), e(null) }, 5e3) })) { let n = 1e3 * e; t && (n += 10 * Math.random() * 1e3), n > 0 && await new Promise(e => { setTimeout(e, n) }) } window.clearInterval(n) } } }();