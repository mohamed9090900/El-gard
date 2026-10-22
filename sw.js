const CACHE='gard-elbuffet-v1-3-1';
const SHELL=['./','./index.html','./styles.css?v=1.3.2','./app.js?v=1.3.2','./manifest.json','./icon-192.png','./icon-512.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('gard-elbuffet-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{if(event.request.method!=='GET')return;const url=new URL(event.request.url);if(url.origin!==self.location.origin)return;
 event.respondWith(caches.match(event.request).then(hit=>hit||fetch(event.request).then(res=>{if(res.ok&&url.pathname.includes('/gard')){const c=res.clone();caches.open(CACHE).then(cache=>cache.put(event.request,c))}return res}).catch(()=>event.request.mode==='navigate'?caches.match('./index.html'):Response.error())))
});
