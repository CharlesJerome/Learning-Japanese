'use strict';
const CACHE='nihongo-static-v2';
const BASE=new URL('./',self.location.href);
const FILES=['index.html','style.css','theme.js','lessons.js','extra-lessons.js','app.js','account.js','config.js','offline.js','vendor/supabase.js'];
const URLS=new Set(FILES.map(path=>new URL(path,BASE).href));
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll([...URLS]))));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('nihongo-static-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);
 if(event.request.method!=='GET'||url.origin!==BASE.origin)return;
 // Never cache authentication URLs, fragments, query strings, Supabase data or recordings.
 const navigation=event.request.mode==='navigate'&&(url.pathname===BASE.pathname||url.pathname===new URL('index.html',BASE).pathname)&&!url.search;
 if(!navigation&&!URLS.has(url.href))return;
 if(url.search)return;
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE),key=navigation?new URL('index.html',BASE).href:event.request;
  if(!navigation){const cached=await cache.match(key);if(cached)return cached}
  try{const response=await fetch(event.request);if(response.ok&&!response.redirected)await cache.put(key,response.clone());return response}
  catch(error){const cached=await cache.match(key);if(cached)return cached;throw error}
 })());
});
