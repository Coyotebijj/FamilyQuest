self.addEventListener("install", (event) => {
  console.log("FamiliQuest service worker installé");
});

self.addEventListener("fetch", (event) => {
  // Ici tu pourras plus tard gérer le cache
});
