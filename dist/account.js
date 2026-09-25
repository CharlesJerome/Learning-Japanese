'use strict';
(() => {
 const el = id => document.getElementById(id);
 const storage = {get(k, fallback){try{return JSON.parse(localStorage.getItem(k)) ?? fallback}catch{return fallback}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v));return true}catch{return false}},remove(k){try{localStorage.removeItem(k)}catch{}}};
 const config=window.NIHONGO_CONFIG;
 let client=null,user=null,epoch=0,busy=false,activeSync=null,syncAgain=false,mode='login',recovery=false;
 let pending=new Set(),completed=new Set(),pendingTheme=null,themeRevision=0;
 const guest=new Set(storage.get('nihongo-guest-progress',[]));
 const bucket=id=>`nihongo-pending-${id}`;
 const validKey=k=>typeof k==='string'&&LESSONS.some(l=>l.cards.some((_,i)=>`${l.id}:${i}`===k));
 function message(value,error=false){el('account-status').textContent=value;el('account-status').classList.toggle('error',error)}
 function syncMessage(value,error=false){el('sync-status').textContent=value;el('sync-status').classList.toggle('error',error)}
 function announce(){window.dispatchEvent(new CustomEvent('progresschange',{detail:{keys:[...completed],signedIn:!!user}}))}
 function persistPending(){if(user&&!storage.set(bucket(user.id),{keys:[...pending],theme:pendingTheme}))syncMessage('This browser cannot keep offline changes. Stay online to save progress.',true)}
 function renderAccount(){
  el('account-button').textContent=user?'My account / အကောင့်':'Sign in / ဝင်မယ်';
  el('signed-in-panel').hidden=!user;el('auth-form').hidden=!!user&&!recovery;el('auth-tabs').hidden=!!user;
  el('account-email').textContent=user?.email||'';
  el('account-title').textContent=recovery?'Choose a new password':user?'Your account / သင့်အကောင့်':'Save your progress / တိုးတက်မှု သိမ်းမယ်';
  el('password-field').hidden=mode==='reset';el('email-field').hidden=recovery;
  el('auth-password').required=mode!=='reset';el('auth-email').required=!recovery;
  el('auth-password').minLength=mode==='login'?1:10;el('auth-password').autocomplete=mode==='login'?'current-password':'new-password';
  el('auth-submit').textContent=recovery?'Save new password':mode==='signup'?'Create account':mode==='reset'?'Send reset link':'Sign in / ဝင်မယ်';
  el('auth-submit').disabled=busy||(mode==='signup'&&!config.publicSignupReady);
  el('email-setup-note').hidden=mode==='login'||recovery;
  document.querySelectorAll('[data-auth-mode]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.authMode===mode));
 }
 function errorText(error){
  const code=error?.code||'',msg=error?.message||'';
  if(code==='email_not_confirmed')return 'Confirm your email before signing in. / အီးမေးလ်ကို အရင်အတည်ပြုပါ။';
  if(code==='over_email_send_rate_limit'||code==='over_request_rate_limit')return 'Too many attempts. Please wait before trying again.';
  if(/email address not authorized|email rate|email.*sending|smtp/i.test(msg))return 'Email delivery is not ready for this address. The site owner needs to finish email setup.';
  if(code==='invalid_credentials')return 'Email or password is incorrect. / အီးမေးလ် သို့မဟုတ် စကားဝှက် မမှန်ပါ။';
  if(!navigator.onLine||/fetch|network/i.test(msg))return 'You are offline or the connection failed. Please try again when connected.';
  return msg||'Could not complete this request. Please try again.';
 }
 async function loadUser(session,forceRefresh=false){
  const next=session?.user||null;
  const sameAccount=next?.id===user?.id&&!!next===!!user;
  if(sameAccount&&!forceRefresh){renderAccount();return}
  const mine=++epoch;user=next;
  if(!sameAccount)window.dispatchEvent(new CustomEvent('identitychange'));
  if(!sameAccount){pendingTheme=null;pending=new Set();completed=new Set();
  if(user){const cache=storage.get(bucket(user.id),{});pending=new Set((Array.isArray(cache.keys)?cache.keys:[]).filter(validKey));pendingTheme=['system','dark','light'].includes(cache.theme)?cache.theme:null;completed=new Set(pending)}else completed=new Set(guest);}
  announce();renderAccount();
  if(!user){syncMessage('Guest practice • saved on this device only / ဒီစက်မှာပဲ သိမ်းမယ်');return}
  syncMessage('Loading your progress… / တိုးတက်မှုကို ဖတ်နေပါတယ်');
  const id=user.id,loadedThemeRevision=themeRevision;
  try{
   const [progress,settings]=await Promise.all([client.from('study_progress').select('card_key').eq('user_id',id),client.from('study_preferences').select('theme').eq('user_id',id).maybeSingle()]);
   if(mine!==epoch)return;
   if(progress.error)throw progress.error;if(settings.error)throw settings.error;
   completed=new Set([...progress.data.map(r=>r.card_key).filter(validKey),...completed,...pending]);
   if(pendingTheme)NihongoTheme.apply(pendingTheme);else if(settings.data?.theme&&loadedThemeRevision===themeRevision)NihongoTheme.apply(settings.data.theme);
   announce();await flush();
  }catch(error){if(mine===epoch)syncMessage('Cloud progress could not load. New practice is kept on this device until you reconnect.',true)}
 }
 async function flush(){
  if(activeSync){syncAgain=true;return activeSync}
  if(!client||!user)return;
  if(!navigator.onLine){syncMessage('Offline • your new practice will sync when connected. / အွန်လိုင်းပြန်ရရင် သိမ်းမယ်');return}
  const mine=epoch,id=user.id,keys=[...pending],theme=pendingTheme;
  activeSync=(async()=>{
   try{
    if(keys.length){syncMessage('Saving progress… / သိမ်းနေပါတယ်');const result=await client.from('study_progress').upsert(keys.map(card_key=>({user_id:id,card_key})),{onConflict:'user_id,card_key',ignoreDuplicates:true});if(result.error)throw result.error;if(mine!==epoch)return;keys.forEach(k=>pending.delete(k));persistPending()}
    if(theme){const result=await client.from('study_preferences').upsert({user_id:id,theme},{onConflict:'user_id'});if(result.error)throw result.error;if(mine!==epoch)return;if(pendingTheme===theme)pendingTheme=null;persistPending()}
    if(mine===epoch)syncMessage('Progress saved to your account / သင့်အကောင့်မှာ သိမ်းပြီးပါပြီ');
   }catch(error){if(mine===epoch){persistPending();syncMessage('Saved on this device; cloud sync needs a connection. Use Retry sync. / ပြန်ချိတ်ပြီး သိမ်းပါ။',true)}}
  })();
  await activeSync;activeSync=null;
  if(syncAgain){syncAgain=false;return flush()}
 }
 window.NihongoAccount={
  complete(key){if(!validKey(key))return;completed.add(key);if(user){pending.add(key);persistPending();void flush()}else{guest.add(key);if(!storage.set('nihongo-guest-progress',[...guest]))syncMessage('Guest practice lasts for this tab because browser storage is unavailable.',true)}announce()},
  getKeys:()=>[...completed],isSignedIn:()=>!!user
 };
 completed=new Set(guest);announce();
 el('account-button').onclick=()=>{renderAccount();message('');el('account-dialog').showModal()};
 el('account-close').onclick=()=>el('account-dialog').close();
 el('account-dialog').addEventListener('close',()=>{el('auth-password').value=''});
 document.querySelectorAll('[data-auth-mode]').forEach(b=>b.onclick=()=>{mode=b.dataset.authMode;recovery=false;message('');renderAccount()});
 el('retry-sync').onclick=()=>{if(user){void loadUser({user},true)}};
 el('auth-form').onsubmit=async event=>{
  event.preventDefault();if(busy)return;if(!client){message('Login is unavailable. Please reload when connected.',true);return}if(mode==='signup'&&!config.publicSignupReady)return;
  busy=true;renderAccount();message('Please wait… / ခဏစောင့်ပါ');
  const email=el('auth-email').value.trim(),password=el('auth-password').value;
  try{
   const redirect=location.origin+location.pathname;
   let result;
   if(recovery)result=await client.auth.updateUser({password});
   else if(mode==='signup')result=await client.auth.signUp({email,password,options:{emailRedirectTo:redirect}});
   else if(mode==='reset')result=await client.auth.resetPasswordForEmail(email,{redirectTo:redirect});
   else result=await client.auth.signInWithPassword({email,password});
   if(result.error)throw result.error;
   el('auth-password').value='';
   if(recovery){recovery=false;mode='login';message('Password updated. / စကားဝှက် ပြောင်းပြီးပါပြီ')}
   else if(mode==='reset')message('If this account can receive email, a reset link has been sent. Check your inbox.');
   else if(mode==='signup'&&!result.data.session)message('Check your email to confirm your account, then sign in.');
   else{await loadUser(result.data.session);message('Signed in. / ဝင်ပြီးပါပြီ')}
  }catch(error){message(errorText(error),true)}finally{busy=false;renderAccount()}
 };
 el('signout-button').onclick=async()=>{
  if(!client||busy)return;busy=true;el('signout-button').disabled=true;
  try{const {error}=await client.auth.signOut({scope:'local'});if(error)throw error;await loadUser(null);mode='login';recovery=false;message('Signed out on this device. / ဒီစက်မှ ထွက်ပြီးပါပြီ')}catch(error){message(errorText(error),true)}finally{busy=false;el('signout-button').disabled=false;renderAccount()}
 };
 window.addEventListener('themechange',event=>{themeRevision++;if(user){pendingTheme=event.detail;persistPending();void flush()}});
 window.addEventListener('online',()=>{if(user){void loadUser({user},true)}});
 window.addEventListener('offline',()=>syncMessage('Offline • lessons already loaded remain available. / ဖတ်ပြီးသား သင်ခန်းစာတွေကို ဆက်လေ့ကျင့်နိုင်ပါတယ်။'));
 try{
  client=window.supabase.createClient(config.url,config.publishableKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true},global:{fetch:(url,options={})=>fetch(url,{...options,signal:options.signal||AbortSignal.timeout(12000)})}});
  client.auth.onAuthStateChange((event,session)=>{setTimeout(()=>{if(event==='PASSWORD_RECOVERY'){recovery=true;mode='recovery';el('account-dialog').showModal()}else if(event==='SIGNED_OUT'||session?.user?.id!==user?.id){recovery=false;mode='login';el('auth-password').value=''}void loadUser(session)},0)});
  client.auth.getSession().then(({data,error})=>{if(error)throw error;return loadUser(data.session)}).catch(()=>syncMessage('Login connection unavailable. Guest practice still works.',true));
 }catch{syncMessage('Login could not load. Guest practice still works.',true)}
 if(!user)syncMessage('Guest practice • saved on this device only / ဒီစက်မှာပဲ သိမ်းမယ်');renderAccount();
})();
