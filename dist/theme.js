'use strict';
(()=>{
 const media=matchMedia('(prefers-color-scheme: dark)');
 let preference='system';try{preference=localStorage.getItem('nihongo-theme')||'system'}catch{}
 function refreshButtons(){
  const dark=document.documentElement.dataset.theme==='dark';
  document.querySelectorAll('[data-theme-toggle]').forEach(button=>{
   button.textContent=dark?'☀ Light mode / အလင်း':'☾ Dark mode / အမှောင်';
   button.setAttribute('aria-label',dark?'Switch to light mode / အလင်းသို့ ပြောင်းမယ်':'Switch to dark mode / အမှောင်သို့ ပြောင်းမယ်');
  });
 }
 function apply(value){preference=['dark','light','system'].includes(value)?value:'system';document.documentElement.dataset.theme=preference==='system'?(media.matches?'dark':'light'):preference;try{localStorage.setItem('nihongo-theme',preference)}catch{}refreshButtons()}
 function toggle(){apply(document.documentElement.dataset.theme==='dark'?'light':'dark');window.dispatchEvent(new CustomEvent('themechange',{detail:preference}))}
 window.NihongoTheme={apply,toggle,refreshButtons,get:()=>preference};apply(preference);media.addEventListener('change',()=>{if(preference==='system')apply('system')});
 document.addEventListener('DOMContentLoaded',refreshButtons);
 document.addEventListener('click',event=>{if(event.target.closest?.('[data-theme-toggle]'))toggle()});
})();
