'use strict';
(()=>{
 const media=matchMedia('(prefers-color-scheme: dark)');
 let preference='system';try{preference=localStorage.getItem('nihongo-theme')||'system'}catch{}
 function refreshButtons(){
  const dark=document.documentElement.dataset.theme==='dark';
  const t=key=>window.NihongoI18n?.t(key)||key;
  document.querySelectorAll('[data-theme-toggle]').forEach(button=>{
   button.textContent=dark?`☀ ${t('Light mode')}`:`☾ ${t('Dark mode')}`;
   button.setAttribute('aria-label',dark?`${t('Light mode')}`:`${t('Dark mode')}`);
  });
 }
 function apply(value){preference=['dark','light','system'].includes(value)?value:'system';document.documentElement.dataset.theme=preference==='system'?(media.matches?'dark':'light'):preference;try{localStorage.setItem('nihongo-theme',preference)}catch{}refreshButtons()}
 function toggle(){apply(document.documentElement.dataset.theme==='dark'?'light':'dark');window.dispatchEvent(new CustomEvent('themechange',{detail:preference}))}
 window.NihongoTheme={apply,toggle,refreshButtons,get:()=>preference};apply(preference);media.addEventListener('change',()=>{if(preference==='system')apply('system')});
 document.addEventListener('DOMContentLoaded',refreshButtons);
 window.addEventListener('languagechange',refreshButtons);
 document.addEventListener('click',event=>{if(event.target.closest?.('[data-theme-toggle]'))toggle()});
})();
