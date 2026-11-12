// Incrémente cette version à chaque mise à jour de l'application
const CACHE = "familiquest-v3";
const FICHIERS = ["./", "./index.html", "./manifest.json", "./icon-192.png", "./icon-512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => Promise.all(FICHIERS.map((f) => fetch(f, { cache: "reload" }).then((r) => c.put(f, r))))));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((cles) => Promise.all(cles.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin) return;

  // Réseau d'abord (toujours la dernière version), cache en secours hors ligne
  event.respondWith(
    fetch(req, { cache: "no-cache" })
      .then((rep) => {
        const copie = rep.clone();
        caches.open(CACHE).then((c) => c.put(req, copie));
        return rep;
      })
      .catch(() => caches.match(req).then((r) => r || caches.match("./index.html")))
  );
});
