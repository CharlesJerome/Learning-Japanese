'use strict';
const CACHE='nihongo-static-v10';
const BASE=new URL('./',self.location.href);
const FILES=['index.html','style.css?v=lang2','theme.js?v=toggle2','lessons.js','extra-lessons.js','lesson-expansion.js?v=lessons1','practice-session.js?v=session1','audio-manifest.js?v=voice1','audio-player.js?v=voice2','i18n.js?v=lang2','app.js?v=speed1','account.js?v=lang2','profile.js?v=lang2','config.js?v=accounts1','offline.js','vendor/supabase.js'];
const URLS=new Set(FILES.map(path=>new URL(path,BASE).href));
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll([...URLS]))));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('nihongo-static-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);
 if(event.request.method!=='GET'||url.origin!==BASE.origin)return;
 // Only explicit static URLs (including fixed asset versions) are cached.
 // Authentication URLs, arbitrary queries, Supabase data and recordings are excluded.
 const navigation=event.request.mode==='navigate'&&(url.pathname===BASE.pathname||url.pathname===new URL('index.html',BASE).pathname)&&!url.search;
 if(!navigation&&!URLS.has(url.href))return;
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE),key=navigation?new URL('index.html',BASE).href:event.request;
  if(!navigation){const cached=await cache.match(key);if(cached)return cached}
  try{const response=await fetch(event.request);if(response.ok&&!response.redirected)await cache.put(key,response.clone());return response}
  catch(error){const cached=await cache.match(key);if(cached)return cached;throw error}
 })());
});
