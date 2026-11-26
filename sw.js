const CACHE_NAME='word-wheel-v1';
const CORE=['./','./index.html','./words.json','./manifest.json'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(CORE))));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k))))));
self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.method!=='GET') return;
  const url=new URL(req.url);
  if(url.origin!==location.origin) return;
  event.respondWith(caches.match(req).then(cached=>{
    const network=fetch(req).then(res=>{
      if(res.ok){const copy=res.clone();caches.open(CACHE_NAME).then(c=>c.put(req,copy));}
      return res;
    }).catch(()=>cached);
    return cached||network;
  }));
});