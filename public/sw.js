if (!self.define) {
  let e,
    s = {};
  const n = (n, i) => (
    (n = new URL(n + ".js", i).href),
    s[n] ||
      new Promise((s) => {
        if ("document" in self) {
          const e = document.createElement("script");
          (e.src = n), (e.onload = s), document.head.appendChild(e);
        } else (e = n), importScripts(n), s();
      }).then(() => {
        let e = s[n];
        if (!e) throw new Error(`Module ${n} didn’t register its module`);
        return e;
      })
  );
  self.define = (i, a) => {
    const c =
      e ||
      ("document" in self ? document.currentScript.src : "") ||
      location.href;
    if (s[c]) return;
    let t = {};
    const o = (e) => n(e, c),
      r = { module: { uri: c }, exports: t, require: o };
    s[c] = Promise.all(i.map((e) => r[e] || o(e))).then((e) => (a(...e), t));
  };
}
define(["./workbox-4754cb34"], function (e) {
  "use strict";
  importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        {
          url: "/_next/app-build-manifest.json",
          revision: "501e000c45f945ed2d7e2b448c4628ce",
        },
        {
          url: "/_next/static/chunks/293-c2a6702c445b3228.js",
          revision: "oesb3C8idJnZ43AwkBP5L",
        },
        {
          url: "/_next/static/chunks/341.2903e54d3da731c1.js",
          revision: "2903e54d3da731c1",
        },
        {
          url: "/_next/static/chunks/402-cf2316fb28ebfa75.js",
          revision: "oesb3C8idJnZ43AwkBP5L",
        },
        {
          url: "/_next/static/chunks/472.a3826d29d6854395.js",
          revision: "a3826d29d6854395",
        },
        {
          url: "/_next/static/chunks/4bd1b696-b6602cca66340d32.js",
          revision: "oesb3C8idJnZ43AwkBP5L",
        },
        {
          url: "/_next/static/chunks/683-4e15a1d95c6080e0.js",
          revision: "oesb3C8idJnZ43AwkBP5L",
        },
        {
          url: "/_next/static/chunks/684-b5b2e39fb15d3686.js",
          revision: "oesb3C8idJnZ43AwkBP5L",
        },
        {
          url: "/_next/static/chunks/693-046bd5d46284d14f.js",
          revision: "oesb3C8idJnZ43AwkBP5L",
        },
        {
          url: "/_next/static/chunks/app/_not-found/page-7a4d73270e88c926.js",
          revision: "oesb3C8idJnZ43AwkBP5L",
        },
        {
          url: "/_next/static/chunks/app/create/page-5b47643ec6db0b9f.js",
          revision: "oesb3C8idJnZ43AwkBP5L",
        },
        {
          url: "/_next/static/chunks/app/dashboard/page-4fc101e09919241d.js",
          revision: "oesb3C8idJnZ43AwkBP5L",
        },
        {
          url: "/_next/static/chunks/app/edit/%5BtestId%5D/page-1ceb8cb4b63043ec.js",
          revision: "oesb3C8idJnZ43AwkBP5L",
        },
        {
          url: "/_next/static/chunks/app/layout-7367ee421af7da2c.js",
          revision: "oesb3C8idJnZ43AwkBP5L",
        },
        {
          url: "/_next/static/chunks/app/page-87a8d41d4299b375.js",
          revision: "oesb3C8idJnZ43AwkBP5L",
        },
        {
          url: "/_next/static/chunks/app/preview/%5BtestId%5D/page-33e645af81419e4d.js",
          revision: "oesb3C8idJnZ43AwkBP5L",
        },
        {
          url: "/_next/static/chunks/app/take/%5BtestId%5D/page-549c37ed71da9912.js",
          revision: "oesb3C8idJnZ43AwkBP5L",
        },
        {
          url: "/_next/static/chunks/ca377847-ee9d0a6e212690d1.js",
          revision: "oesb3C8idJnZ43AwkBP5L",
        },
        {
          url: "/_next/static/chunks/framework-859199dea06580b0.js",
          revision: "oesb3C8idJnZ43AwkBP5L",
        },
        {
          url: "/_next/static/chunks/main-408098e90ade8e99.js",
          revision: "oesb3C8idJnZ43AwkBP5L",
        },
        {
          url: "/_next/static/chunks/main-app-766b73f87fb7810b.js",
          revision: "oesb3C8idJnZ43AwkBP5L",
        },
        {
          url: "/_next/static/chunks/pages/_app-a66f9296699c5863.js",
          revision: "oesb3C8idJnZ43AwkBP5L",
        },
        {
          url: "/_next/static/chunks/pages/_error-d92855d9f2cf4c75.js",
          revision: "oesb3C8idJnZ43AwkBP5L",
        },
        {
          url: "/_next/static/chunks/polyfills-42372ed130431b0a.js",
          revision: "846118c33b2c0e922d7b3a7676f81f6f",
        },
        {
          url: "/_next/static/chunks/webpack-5e447b8c4067ff67.js",
          revision: "oesb3C8idJnZ43AwkBP5L",
        },
        {
          url: "/_next/static/css/91622afc5f3a803b.css",
          revision: "91622afc5f3a803b",
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
          url: "/_next/static/media/93f479601ee12b01-s.p.woff2",
          revision: "da83d5f06d825c5ae65b7cca706cb312",
        },
        {
          url: "/_next/static/media/ba015fad6dcf6784-s.woff2",
          revision: "8ea4f719af3312a055caf09f34c89a77",
        },
        {
          url: "/_next/static/oesb3C8idJnZ43AwkBP5L/_buildManifest.js",
          revision: "aab683472a0ef5b596525207a0a3adb3",
        },
        {
          url: "/_next/static/oesb3C8idJnZ43AwkBP5L/_ssgManifest.js",
          revision: "b6652df95db52feb4daf4eca35380933",
        },
        { url: "/file.svg", revision: "d09f95206c3fa0bb9bd9fefabfd0ea71" },
        { url: "/globe.svg", revision: "2aaafa6a49b6563925fe440891e32717" },
        {
          url: "/icons/icon-128.png",
          revision: "d93958d181d965ed724786a735f12bbe",
        },
        {
          url: "/icons/icon-144.png",
          revision: "b84b3942fd4b067d1d339b4d38a2e8a9",
        },
        {
          url: "/icons/icon-152.png",
          revision: "ffbfb2364b78da989072b566ecf0c47f",
        },
        {
          url: "/icons/icon-16.png",
          revision: "96b76f2528e28c14f4f47584a2f34fe7",
        },
        {
          url: "/icons/icon-180.png",
          revision: "224301653484d97ca6f9f3e393bc6ad2",
        },
        {
          url: "/icons/icon-192.png",
          revision: "5d3d31a46fbd23bcd308100cdad8db97",
        },
        {
          url: "/icons/icon-256.png",
          revision: "dc0dd7c9f05ea8e4466b81daab7c7937",
        },
        {
          url: "/icons/icon-48.png",
          revision: "daeb8efa0dd7f42d5ebf810b1f4f64c2",
        },
        {
          url: "/icons/icon-512.png",
          revision: "f1a6b462a96a01bf9d8f5f77165e3b27",
        },
        {
          url: "/icons/icon-64.png",
          revision: "c993d28278d6f35e4c4e393b23c23103",
        },
        {
          url: "/icons/icon-72.png",
          revision: "d52a89c4e6a8e5f55a59f95a8aed433e",
        },
        {
          url: "/icons/icon-96.png",
          revision: "65ab712f68c08b760c1b1afd819de29a",
        },
        { url: "/manifest.json", revision: "b1711e4baa902aac7bd71f64e1ba162b" },
        { url: "/next.svg", revision: "8e061864f388b47f33a1c3780831193e" },
        { url: "/vercel.svg", revision: "c0af2f507b369b085b35ef4bbe3bcf1e" },
        { url: "/window.svg", revision: "a2760511c65806022ad20adf74370ff3" },
      ],
      { ignoreURLParametersMatching: [] }
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
              event: n,
              state: i,
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
      "GET"
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      new e.CacheFirst({
        cacheName: "google-fonts-webfonts",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      new e.StaleWhileRevalidate({
        cacheName: "google-fonts-stylesheets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-font-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-image-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\/_next\/image\?url=.+$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-image",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:mp3|wav|ogg)$/i,
      new e.CacheFirst({
        cacheName: "static-audio-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:mp4)$/i,
      new e.CacheFirst({
        cacheName: "static-video-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:js)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-js-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:css|less)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-style-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\/_next\/data\/.+\/.+\.json$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-data",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:json|xml|csv)$/i,
      new e.NetworkFirst({
        cacheName: "static-data-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1;
        const s = e.pathname;
        return !s.startsWith("/api/auth/") && !!s.startsWith("/api/");
      },
      new e.NetworkFirst({
        cacheName: "apis",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1;
        return !e.pathname.startsWith("/api/");
      },
      new e.NetworkFirst({
        cacheName: "others",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      ({ url: e }) => !(self.origin === e.origin),
      new e.NetworkFirst({
        cacheName: "cross-origin",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 3600 }),
        ],
      }),
      "GET"
    );
});
