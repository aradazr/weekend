'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"assets/AssetManifest.bin": "8671548daa0fd8427ea725f773cf0fba",
"assets/AssetManifest.bin.json": "b47c8de89b7c5f77f5e1eff9e28a8349",
"assets/AssetManifest.json": "0d722a8545df2824c2014bc2e1f93b3f",
"assets/assets/fonts/lilj.otf": "b17114e6118c9161729793b216657134",
"assets/assets/fonts/MJ_PROMOTERLT.TTF": "5a801a311081669ae4ad8e1cc2c23232",
"assets/assets/fonts/NPINAZANINBOLD.TTF": "c60ff24b97e23eabd722f44f4fcc23de",
"assets/assets/fonts/popb.ttf": "6f1520d107205975713ba09df778f93f",
"assets/assets/fonts/popm.ttf": "bf59c687bc6d3a70204d3944082c5cc0",
"assets/assets/fonts/SHABNAM-BOLD-FD.TTF": "6434a8c072c7c2bbc349ccfff4f5c496",
"assets/assets/fonts/SHABNAM-MEDIUM-FD.TTF": "c4edea41d105d1060a4d9b7bee7798f0",
"assets/assets/images/coffee.jpg": "3666b883a8ccfe5212b74fc8cf72fc0b",
"assets/assets/images/coffee.png": "a26251bb092916673c9fc8cfd3c0145e",
"assets/assets/images/instagram.png": "a73865de6a95e81fef4c9ef32d4ae5b9",
"assets/assets/images/link.png": "9bf6f7e5730c32d3844b5372cc584fe4",
"assets/assets/images/location.png": "e8d13113520e1bd0e073ac414c09704c",
"assets/assets/images/noPic.png": "f1d1aa61ab5d31f59849523431dca8dd",
"assets/assets/images/phone.png": "a2b8c00223ab64d05682d8f7d4e4fcf0",
"assets/assets/images/remove.png": "aed1801b6e93c2cf9ca38f396fa0365d",
"assets/assets/images/salad.png": "bc5ff1c3d37ef98012fa5365b7685500",
"assets/assets/images/weekend.png": "415190096bdd53de6e0b9555970d2b6f",
"assets/assets/images/WeekendLogo.png": "6075aee643ffb460f8add64c6d29f9a3",
"assets/FontManifest.json": "ee3e95ca4211ea1a17337decdbfad80a",
"assets/fonts/MaterialIcons-Regular.otf": "e5bd8e9a379c327d889ef1a95058ebec",
"assets/NOTICES": "00a2771468feb4fe58989fc09cf1d08b",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "e986ebe42ef785b27164c36a9abc7818",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"canvaskit/canvaskit.js": "66177750aff65a66cb07bb44b8c6422b",
"canvaskit/canvaskit.js.symbols": "48c83a2ce573d9692e8d970e288d75f7",
"canvaskit/canvaskit.wasm": "1f237a213d7370cf95f443d896176460",
"canvaskit/chromium/canvaskit.js": "671c6b4f8fcc199dcc551c7bb125f239",
"canvaskit/chromium/canvaskit.js.symbols": "a012ed99ccba193cf96bb2643003f6fc",
"canvaskit/chromium/canvaskit.wasm": "b1ac05b29c127d86df4bcfbf50dd902a",
"canvaskit/skwasm.js": "694fda5704053957c2594de355805228",
"canvaskit/skwasm.js.symbols": "262f4827a1317abb59d71d6c587a93e2",
"canvaskit/skwasm.wasm": "9f0c0c02b82a910d12ce0543ec130e60",
"canvaskit/skwasm.worker.js": "89990e8c92bcb123999aa81f7e203b1c",
"favicon.png": "b6cc8566c543f87ce617638bc4a70fdf",
"flutter.js": "f393d3c16b631f36852323de8e583132",
"flutter_bootstrap.js": "8fbe274890e875bcb750edfa69387046",
"icons/android-icon-144x144.png": "4c7cbb3cce7b87223339efc0d8927e6e",
"icons/android-icon-192x192.png": "97738fddadefd019a77e833c38b86098",
"icons/android-icon-36x36.png": "941f4aa82f1369738667f9d1e593e4d4",
"icons/android-icon-48x48.png": "0be744c077820a4f1afd10f1f9d80784",
"icons/android-icon-72x72.png": "2546bbd415d09b1c42769f0438887796",
"icons/android-icon-96x96.png": "5f6532378c591b5dccd73815c4c5bc57",
"index.html": "587d761d48b42210998d4cd0ee4ada66",
"/": "587d761d48b42210998d4cd0ee4ada66",
"main.dart.js": "e86b92341f125cd7848e01c34dba52c7",
"manifest.json": "2ae8166842ff48322f04adf5a5d4e8aa",
"version.json": "474eaa4d313fe52955ad03e743866a68"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"flutter_bootstrap.js",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
