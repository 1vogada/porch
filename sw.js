// The porch's service worker (ours; docs/install-app.md). Copied as-is next to the key page by
// tools/invite/publish_pages.py when the porch is the installable app (APP_URL). It exists for installing only: it
// keeps nothing, so the key page and its address are always the network's (each republish is live at once), and it
// never touches the game, which is another origin. Its one job beyond being there: a launch with no network gets a
// short note instead of the browser's error page.
"use strict";

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

const OFFLINE = '<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">' +
  '<title>Offline</title><body style="margin:0;min-height:100vh;display:grid;place-items:center;background:#101114;' +
  'color:#e6e9ef;font:15px/1.45 system-ui,sans-serif;padding:16px;text-align:center">' +
  "<p>No connection. Open the app again once you are online.</p></body>";

self.addEventListener("fetch", (e) => {
  const r = e.request;
  // only the key page itself (the scope's own address, any query): everything else goes to the network untouched
  if (r.mode !== "navigate" || new URL(r.url).pathname !== new URL(self.registration.scope).pathname) return;
  e.respondWith(fetch(r).catch(() => new Response(OFFLINE, { headers: { "content-type": "text/html; charset=utf-8" } })));
});
