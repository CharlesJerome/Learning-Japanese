'use strict';
(()=>{
 const media=matchMedia('(prefers-color-scheme: dark)');
 let preference='system';try{preference=localStorage.getItem('nihongo-theme')||'system'}catch{}
 function apply(value){preference=['dark','light','system'].includes(value)?value:'system';document.documentElement.dataset.theme=preference==='system'?(media.matches?'dark':'light'):preference;try{localStorage.setItem('nihongo-theme',preference)}catch{}const select=document.getElementById('theme-select');if(select)select.value=preference;}
 window.NihongoTheme={apply,get:()=>preference};apply(preference);media.addEventListener('change',()=>{if(preference==='system')apply('system')});
 document.addEventListener('DOMContentLoaded',()=>{const select=document.getElementById('theme-select');select.value=preference;select.addEventListener('change',()=>{apply(select.value);window.dispatchEvent(new CustomEvent('themechange',{detail:preference}))})});
})();
