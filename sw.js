const CACHE='periodizacion-v5';
const CORE=['./','./index.html','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const same=new URL(r.url).origin===location.origin;
  if(r.mode==='navigate'||(same&&r.url.endsWith('index.html'))){
    e.respondWith(fetch(r).then(x=>{const c=x.clone();caches.open(CACHE).then(k=>k.put(r,c));return x}).catch(()=>caches.match(r).then(x=>x||caches.match('./index.html'))));return;
  }
  e.respondWith(caches.match(r).then(x=>x||fetch(r).then(y=>{if(y&&(y.ok||y.type==='opaque')){const c=y.clone();caches.open(CACHE).then(k=>k.put(r,c))}return y}).catch(()=>x)));
});
