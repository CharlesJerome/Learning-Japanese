'use strict';
// Local previews must reflect edits immediately. Cache only the HTTPS publication.
if('serviceWorker' in navigator&&location.protocol==='https:'){
 window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
}
