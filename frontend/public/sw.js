if (!self.define) {
    let e,
        s = {}
    const a = (a, c) => (
        (a = new URL(a + ".js", c).href),
        s[a] ||
            new Promise((s) => {
                if ("document" in self) {
                    const e = document.createElement("script")
                    ;(e.src = a), (e.onload = s), document.head.appendChild(e)
                } else (e = a), importScripts(a), s()
            }).then(() => {
                let e = s[a]
                if (!e)
                    throw new Error(`Module ${a} didn’t register its module`)
                return e
            })
    )
    self.define = (c, i) => {
        const n =
            e ||
            ("document" in self ? document.currentScript.src : "") ||
            location.href
        if (s[n]) return
        let t = {}
        const r = (e) => a(e, n),
            f = { module: { uri: n }, exports: t, require: r }
        s[n] = Promise.all(c.map((e) => f[e] || r(e))).then((e) => (i(...e), t))
    }
}
define(["./workbox-e9849328"], function (e) {
    "use strict"
    importScripts(),
        self.skipWaiting(),
        e.clientsClaim(),
        e.precacheAndRoute(
            [
                {
                    url: "/_next/app-build-manifest.json",
                    revision: "6517a6d2ed69727770a70c878183dbb3",
                },
                {
                    url: "/_next/static/chunks/170-5b86f66f536b4b7c.js",
                    revision: "5b86f66f536b4b7c",
                },
                {
                    url: "/_next/static/chunks/42d20c07-c32e126377ac2f31.js",
                    revision: "c32e126377ac2f31",
                },
                {
                    url: "/_next/static/chunks/63-ce5176b97169d69f.js",
                    revision: "ce5176b97169d69f",
                },
                {
                    url: "/_next/static/chunks/703-79075169b6cfaf12.js",
                    revision: "79075169b6cfaf12",
                },
                {
                    url: "/_next/static/chunks/768-636f2886ce02f097.js",
                    revision: "636f2886ce02f097",
                },
                {
                    url: "/_next/static/chunks/app/_not-found/page-83aa0e50ce789630.js",
                    revision: "83aa0e50ce789630",
                },
                {
                    url: "/_next/static/chunks/app/activities/page-762c7a78ef7dd4b8.js",
                    revision: "762c7a78ef7dd4b8",
                },
                {
                    url: "/_next/static/chunks/app/assists/events/page-d28456d7304d2606.js",
                    revision: "d28456d7304d2606",
                },
                {
                    url: "/_next/static/chunks/app/assists/general_assists/page-27fb9d4dc6881b2f.js",
                    revision: "27fb9d4dc6881b2f",
                },
                {
                    url: "/_next/static/chunks/app/assists/individual_assists/page-08920e287d7352ca.js",
                    revision: "08920e287d7352ca",
                },
                {
                    url: "/_next/static/chunks/app/cleaning/page-e459d8ff9b39ab04.js",
                    revision: "e459d8ff9b39ab04",
                },
                {
                    url: "/_next/static/chunks/app/control/login/page-430b6c4538fc831c.js",
                    revision: "430b6c4538fc831c",
                },
                {
                    url: "/_next/static/chunks/app/control/page-e53fe93828c58a6d.js",
                    revision: "e53fe93828c58a6d",
                },
                {
                    url: "/_next/static/chunks/app/control/register/page-b530bf1ecf4a2e23.js",
                    revision: "b530bf1ecf4a2e23",
                },
                {
                    url: "/_next/static/chunks/app/finance/accounts/page-c1450d624acdc396.js",
                    revision: "c1450d624acdc396",
                },
                {
                    url: "/_next/static/chunks/app/finance/funds/page-16974f4475669b77.js",
                    revision: "16974f4475669b77",
                },
                {
                    url: "/_next/static/chunks/app/groups/page-1a34eff014bc2296.js",
                    revision: "1a34eff014bc2296",
                },
                {
                    url: "/_next/static/chunks/app/layout-c28aee2d5c980310.js",
                    revision: "c28aee2d5c980310",
                },
                {
                    url: "/_next/static/chunks/app/memebers/createP/page-cdc2a10f32980088.js",
                    revision: "cdc2a10f32980088",
                },
                {
                    url: "/_next/static/chunks/app/memebers/persons/page-71d957d2aa4426ec.js",
                    revision: "71d957d2aa4426ec",
                },
                {
                    url: "/_next/static/chunks/app/page-f96719ade1c35394.js",
                    revision: "f96719ade1c35394",
                },
                {
                    url: "/_next/static/chunks/app/settings/church_data/page-8e829684fcf92340.js",
                    revision: "8e829684fcf92340",
                },
                {
                    url: "/_next/static/chunks/app/settings/profile/page-e2893f0e224957cf.js",
                    revision: "e2893f0e224957cf",
                },
                {
                    url: "/_next/static/chunks/app/users/page-945b10f22ff784c0.js",
                    revision: "945b10f22ff784c0",
                },
                {
                    url: "/_next/static/chunks/b27dc69b-397c05590f8cb1a9.js",
                    revision: "397c05590f8cb1a9",
                },
                {
                    url: "/_next/static/chunks/e9073f74-a96c7d1c836abe3e.js",
                    revision: "a96c7d1c836abe3e",
                },
                {
                    url: "/_next/static/chunks/framework-02904ad54699822e.js",
                    revision: "02904ad54699822e",
                },
                {
                    url: "/_next/static/chunks/main-4bf9830e25d38ae5.js",
                    revision: "4bf9830e25d38ae5",
                },
                {
                    url: "/_next/static/chunks/main-app-45370376b34bbc2a.js",
                    revision: "45370376b34bbc2a",
                },
                {
                    url: "/_next/static/chunks/pages/_app-709db690e88c90d6.js",
                    revision: "709db690e88c90d6",
                },
                {
                    url: "/_next/static/chunks/pages/_error-0ddbe827a67fc03c.js",
                    revision: "0ddbe827a67fc03c",
                },
                {
                    url: "/_next/static/chunks/polyfills-42372ed130431b0a.js",
                    revision: "846118c33b2c0e922d7b3a7676f81f6f",
                },
                {
                    url: "/_next/static/chunks/webpack-ea174cc0e395b908.js",
                    revision: "ea174cc0e395b908",
                },
                {
                    url: "/_next/static/css/ca576d7cd3fbcdc9.css",
                    revision: "ca576d7cd3fbcdc9",
                },
                {
                    url: "/_next/static/css/d02f5884f994135b.css",
                    revision: "d02f5884f994135b",
                },
                {
                    url: "/_next/static/css/f30152c0704fba31.css",
                    revision: "f30152c0704fba31",
                },
                {
                    url: "/_next/static/media/569ce4b8f30dc480-s.p.woff2",
                    revision: "ef6cefb32024deac234e82f932a95cbd",
                },
                {
                    url: "/_next/static/media/747892c23ea88013-s.woff2",
                    revision: "a0761690ccf4441ace5cec893b82d4ab",
                },
                {
                    url: "/_next/static/media/8d697b304b401681-s.woff2",
                    revision: "cc728f6c0adb04da0dfcb0fc436a8ae5",
                },
                {
                    url: "/_next/static/media/93f479601ee12b01-s.p.woff2",
                    revision: "da83d5f06d825c5ae65b7cca706cb312",
                },
                {
                    url: "/_next/static/media/9610d9e46709d722-s.woff2",
                    revision: "7b7c0ef93df188a852344fc272fc096b",
                },
                {
                    url: "/_next/static/media/ba015fad6dcf6784-s.woff2",
                    revision: "8ea4f719af3312a055caf09f34c89a77",
                },
                {
                    url: "/_next/static/media/fa-brands-400.b56d441c.woff2",
                    revision: "b56d441c",
                },
                {
                    url: "/_next/static/media/fa-regular-400.47469621.woff2",
                    revision: "47469621",
                },
                {
                    url: "/_next/static/media/fa-solid-900.174bea58.woff2",
                    revision: "174bea58",
                },
                {
                    url: "/_next/static/media/fa-v4compatibility.25cfd40c.woff2",
                    revision: "25cfd40c",
                },
                {
                    url: "/_next/static/ww8yCB4UlSbXKPwkjvM0k/_buildManifest.js",
                    revision: "d225277720b9a29cf1e4486fe258d3d4",
                },
                {
                    url: "/_next/static/ww8yCB4UlSbXKPwkjvM0k/_ssgManifest.js",
                    revision: "b6652df95db52feb4daf4eca35380933",
                },
                {
                    url: "/file.svg",
                    revision: "d09f95206c3fa0bb9bd9fefabfd0ea71",
                },
                {
                    url: "/globe.svg",
                    revision: "2aaafa6a49b6563925fe440891e32717",
                },
                {
                    url: "/icon512_maskable.png",
                    revision: "2c76632e9edd7754b6c172b659ead9ef",
                },
                {
                    url: "/icon512_rounded.png",
                    revision: "c28d509cf2f8628bc8e639894ef168fa",
                },
                {
                    url: "/images/iglepay.png",
                    revision: "63ddd601381e5a2a3cb9df7a04baf488",
                },
                {
                    url: "/manifest.json",
                    revision: "97c031b892fed2ef81c804476c910c8d",
                },
                {
                    url: "/next.svg",
                    revision: "8e061864f388b47f33a1c3780831193e",
                },
                {
                    url: "/vercel.svg",
                    revision: "c0af2f507b369b085b35ef4bbe3bcf1e",
                },
                {
                    url: "/window.svg",
                    revision: "a2760511c65806022ad20adf74370ff3",
                },
            ],
            { ignoreURLParametersMatching: [] },
        ),
        e.cleanupOutdatedCaches(),
        e.registerRoute(
            "/",
            new e.NetworkFirst({
                cacheName: "start-url",
                plugins: [
                    {
                        cacheWillUpdate: async ({
                            request: e,
                            response: s,
                            event: a,
                            state: c,
                        }) =>
                            s && "opaqueredirect" === s.type
                                ? new Response(s.body, {
                                      status: 200,
                                      statusText: "OK",
                                      headers: s.headers,
                                  })
                                : s,
                    },
                ],
            }),
            "GET",
        ),
        e.registerRoute(
            /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
            new e.CacheFirst({
                cacheName: "google-fonts-webfonts",
                plugins: [
                    new e.ExpirationPlugin({
                        maxEntries: 4,
                        maxAgeSeconds: 31536e3,
                    }),
                ],
            }),
            "GET",
        ),
        e.registerRoute(
            /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
            new e.StaleWhileRevalidate({
                cacheName: "google-fonts-stylesheets",
                plugins: [
                    new e.ExpirationPlugin({
                        maxEntries: 4,
                        maxAgeSeconds: 604800,
                    }),
                ],
            }),
            "GET",
        ),
        e.registerRoute(
            /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
            new e.StaleWhileRevalidate({
                cacheName: "static-font-assets",
                plugins: [
                    new e.ExpirationPlugin({
                        maxEntries: 4,
                        maxAgeSeconds: 604800,
                    }),
                ],
            }),
            "GET",
        ),
        e.registerRoute(
            /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
            new e.StaleWhileRevalidate({
                cacheName: "static-image-assets",
                plugins: [
                    new e.ExpirationPlugin({
                        maxEntries: 64,
                        maxAgeSeconds: 86400,
                    }),
                ],
            }),
            "GET",
        ),
        e.registerRoute(
            /\/_next\/image\?url=.+$/i,
            new e.StaleWhileRevalidate({
                cacheName: "next-image",
                plugins: [
                    new e.ExpirationPlugin({
                        maxEntries: 64,
                        maxAgeSeconds: 86400,
                    }),
                ],
            }),
            "GET",
        ),
        e.registerRoute(
            /\.(?:mp3|wav|ogg)$/i,
            new e.CacheFirst({
                cacheName: "static-audio-assets",
                plugins: [
                    new e.RangeRequestsPlugin(),
                    new e.ExpirationPlugin({
                        maxEntries: 32,
                        maxAgeSeconds: 86400,
                    }),
                ],
            }),
            "GET",
        ),
        e.registerRoute(
            /\.(?:mp4)$/i,
            new e.CacheFirst({
                cacheName: "static-video-assets",
                plugins: [
                    new e.RangeRequestsPlugin(),
                    new e.ExpirationPlugin({
                        maxEntries: 32,
                        maxAgeSeconds: 86400,
                    }),
                ],
            }),
            "GET",
        ),
        e.registerRoute(
            /\.(?:js)$/i,
            new e.StaleWhileRevalidate({
                cacheName: "static-js-assets",
                plugins: [
                    new e.ExpirationPlugin({
                        maxEntries: 32,
                        maxAgeSeconds: 86400,
                    }),
                ],
            }),
            "GET",
        ),
        e.registerRoute(
            /\.(?:css|less)$/i,
            new e.StaleWhileRevalidate({
                cacheName: "static-style-assets",
                plugins: [
                    new e.ExpirationPlugin({
                        maxEntries: 32,
                        maxAgeSeconds: 86400,
                    }),
                ],
            }),
            "GET",
        ),
        e.registerRoute(
            /\/_next\/data\/.+\/.+\.json$/i,
            new e.StaleWhileRevalidate({
                cacheName: "next-data",
                plugins: [
                    new e.ExpirationPlugin({
                        maxEntries: 32,
                        maxAgeSeconds: 86400,
                    }),
                ],
            }),
            "GET",
        ),
        e.registerRoute(
            /\.(?:json|xml|csv)$/i,
            new e.NetworkFirst({
                cacheName: "static-data-assets",
                plugins: [
                    new e.ExpirationPlugin({
                        maxEntries: 32,
                        maxAgeSeconds: 86400,
                    }),
                ],
            }),
            "GET",
        ),
        e.registerRoute(
            ({ url: e }) => {
                if (!(self.origin === e.origin)) return !1
                const s = e.pathname
                return !s.startsWith("/api/auth/") && !!s.startsWith("/api/")
            },
            new e.NetworkFirst({
                cacheName: "apis",
                networkTimeoutSeconds: 10,
                plugins: [
                    new e.ExpirationPlugin({
                        maxEntries: 16,
                        maxAgeSeconds: 86400,
                    }),
                ],
            }),
            "GET",
        ),
        e.registerRoute(
            ({ url: e }) => {
                if (!(self.origin === e.origin)) return !1
                return !e.pathname.startsWith("/api/")
            },
            new e.NetworkFirst({
                cacheName: "others",
                networkTimeoutSeconds: 10,
                plugins: [
                    new e.ExpirationPlugin({
                        maxEntries: 32,
                        maxAgeSeconds: 86400,
                    }),
                ],
            }),
            "GET",
        ),
        e.registerRoute(
            ({ url: e }) => !(self.origin === e.origin),
            new e.NetworkFirst({
                cacheName: "cross-origin",
                networkTimeoutSeconds: 10,
                plugins: [
                    new e.ExpirationPlugin({
                        maxEntries: 32,
                        maxAgeSeconds: 3600,
                    }),
                ],
            }),
            "GET",
        )
})
