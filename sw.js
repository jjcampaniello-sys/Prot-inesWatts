const CACHE_NAME = 'effiprot-v3'; //
const ASSETS_TO_CACHE = [ //
  './', //
  './index.html', //
  './readme.html', //
  './app.js', //
  './manifest.json', //
  './icon-192.png', //
  './icon-512.png' //
]; //

// Installation du Service Worker
self.addEventListener('install', (event) => { //
  event.waitUntil( //
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE)) //
  ); //
  self.skipWaiting(); //
}); //

// Activation et nettoyage des anciens caches
self.addEventListener('activate', (event) => { //
  event.waitUntil( //
    caches.keys().then((keys) => //
      Promise.all(keys.map((key) => key !== CACHE_NAME ? caches.delete(key) : null)) //
    ) //
  ); //
  self.clients.claim(); //
}); //

// Stratégie réseau d'abord, secours sur le cache
self.addEventListener('fetch', (event) => { //
  event.respondWith( //
    fetch(event.request) //
      .then((networkResponse) => { //
        const clone = networkResponse.clone(); //
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone)); //
        return networkResponse; //
      }) //
      .catch(() => caches.match(event.request)) //
  ); //
}); //

// ==========================================
// AJOUT : Gestionnaire de minuteur en tâche de fond
// ==========================================
let minuteurCuisson = null;

self.addEventListener('message', (event) => {
  // Sécurité : on annule un éventuel minuteur existant si l'utilisateur change d'avis ou revient sur l'appli
  if (event.data && event.data.type === 'ANNULER_ALERTE') {
    if (minuteurCuisson) {
      clearTimeout(minuteurCuisson);
      minuteurCuisson = null;
      console.log("Alerte arrière-plan annulée.");
    }
  }

  // Programmation de l'alerte
  if (event.data && event.data.type === 'PROGRAMMER_ALERTE') {
    const { delaiMs, message, titre } = event.data;
    
    if (minuteurCuisson) clearTimeout(minuteurCuisson);
    
    // Le navigateur maintient ce setTimeout car il cible directement une notification système
    minuteurCuisson = setTimeout(() => {
      self.registration.showNotification(titre, {
        body: message,
        icon: './icon-192.png', // Utilisation de votre icône présente dans le cache
        vibrate:[200, 100, 200, 100, 400], // Séquence de vibrations pour attirer l'attention
        requireInteraction: true // La notification reste à l'écran tant que l'utilisateur ne clique pas dessus
     tag: 'fin-cuisson-effiprot', // AJOUT : Évite les doublons de notifications
        renotify: true,              // AJOUT : Fait vibrer le téléphone même si une ancienne notif existe
        data: { url: './' }          // AJOUT : Permet de rouvrir l'application au clic
      });
      minuteurCuisson = null;
    }, delaiMs);
    
    console.log(`Alerte programmée dans ${Math.round(delaiMs / 1000)} secondes.`);
  }
});
