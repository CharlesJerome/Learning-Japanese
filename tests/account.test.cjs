// Independent behavioral review harness; no network, real accounts, or site edits.
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../dist/account.js'), 'utf8');
const tick = () => new Promise(resolve => setTimeout(resolve, 3));
const deferred = () => { let resolve; const promise = new Promise(r => resolve = r); return {promise,resolve}; };

function setup({storageFails=false,initialUser='alice',guestKeys=[],holdInitialReads=true,signupReady=false,authError=null}={}) {
  const listeners=new Map(),nodes=new Map(),saved=new Map();
  const reads=[],writes=[],passwordUpdates=[],authRequests=[];
  const serverProgress=new Map([['alice',[]],['bob',['lesson:1']]]);
  const serverThemes=new Map([['alice','dark'],['bob','system']]);
  let theme='system',holdWrites=false,authHandler=null,sessionUser=initialUser;
  saved.set('nihongo-guest-progress',JSON.stringify(guestKeys));
  const user=id=>id?{id,email:`${id}@example.invalid`}:null;
  const node=id=>{
    if(!nodes.has(id))nodes.set(id,{textContent:'',value:'',hidden:false,disabled:false,dataset:{},classList:{toggle(){}},addEventListener(){},showModal(){this.open=true;},close(){this.open=false;},setAttribute(){}});
    return nodes.get(id);
  };
  function read(table,id){
    const data=table==='study_progress'?(serverProgress.get(id)||[]).map(card_key=>({card_key})):{theme:serverThemes.get(id)||'system'};
    if(holdInitialReads&&id===initialUser){const item={table,id,...deferred(),data};reads.push(item);return item.promise;}
    return Promise.resolve({data,error:null});
  }
  function write(table,payload){
    const item={table,payload,tokenUser:sessionUser,...deferred()};
    writes.push(item);
    function commit(){
      if(table==='study_progress')for(const row of payload){const keys=new Set(serverProgress.get(row.user_id)||[]);keys.add(row.card_key);serverProgress.set(row.user_id,[...keys]);}
      else serverThemes.set(payload.user_id,payload.theme);
      item.resolve({data:null,error:null});
    }
    item.commit=commit;
    if(!holdWrites)commit();
    return item.promise;
  }
  const client={
    from(table){return{
      select(){return{eq(column,id){return table==='study_progress'?read(table,id):{maybeSingle:()=>read(table,id)};}};},
      upsert:payload=>write(table,payload)
    };},
    auth:{
      onAuthStateChange(handler){authHandler=handler;},
      getSession(){return Promise.resolve({data:{session:sessionUser?{user:user(sessionUser)}:null},error:null});},
      updateUser(payload){passwordUpdates.push({user:sessionUser,...payload});return Promise.resolve({data:{user:user(sessionUser)},error:null});},
      signUp(payload){authRequests.push({method:'signup',payload});return Promise.resolve({data:{session:null},error:authError});},
      resetPasswordForEmail(email,options){authRequests.push({method:'reset',email,options});return Promise.resolve({data:{},error:authError});},
      signOut(){sessionUser=null;return Promise.resolve({error:null});}
    }
  };
  const window={
    NIHONGO_CONFIG:{url:'https://example.invalid',publishableKey:'test',publicSignupReady:signupReady},
    supabase:{createClient:()=>client},
    addEventListener(name,handler){listeners.set(name,handler);},
    dispatchEvent(event){listeners.get(event.type)?.(event);}
  };
  const modes=['login','signup','reset'].map(mode=>{const button=node('mode-'+mode);button.dataset.authMode=mode;return button;});
  const context={window,document:{getElementById:node,querySelectorAll:()=>modes},
    localStorage:{getItem:k=>saved.get(k)??null,setItem(k,v){if(storageFails)throw new Error('Storage unavailable');saved.set(k,v);},removeItem:k=>saved.delete(k)},
    navigator:{onLine:true},LESSONS:[{id:'lesson',cards:[{},{},{}]}],
    NihongoTheme:{apply:value=>{theme=value;}},
    CustomEvent:class{constructor(type,{detail}={}){this.type=type;this.detail=detail;}},setTimeout,AbortSignal,
    fetch(){throw new Error('No network permitted in review test');},
    location:{origin:'https://example.invalid',pathname:'/'},console};
  vm.runInNewContext(source,context);
  return{
    window,context,node,reads,writes,saved,passwordUpdates,authRequests,
    mode(value){node('mode-'+value).onclick();},
    getTheme:()=>theme,
    setTheme(value){theme=value;window.dispatchEvent({type:'themechange',detail:value});},
    holdWrites(value){holdWrites=value;},
    auth(event,id){sessionUser=id;authHandler(event,id?{user:user(id)}:null);},
    finishHydration(){holdInitialReads=false;for(const item of reads)item.resolve({data:item.data,error:null});}
  };
}

(async()=>{
  const results=[];
  const check=(test,passed,actual)=>results.push({test,passed:!!passed,...(actual===undefined?{}:{actual})});
  const first=setup();await tick();
  first.window.NihongoAccount.complete('lesson:0');first.setTheme('light');await tick();
  first.finishHydration();await tick();
  check('new completion survives delayed cloud hydration',first.window.NihongoAccount.getKeys().includes('lesson:0'),first.window.NihongoAccount.getKeys());
  check('new theme wins over stale cloud hydration',first.getTheme()==='light',first.getTheme());

  const second=setup({storageFails:true});await tick();second.finishHydration();await tick();
  second.context.navigator.onLine=false;second.window.NihongoAccount.complete('lesson:0');
  second.node('retry-sync').onclick();await tick();
  check('Retry sync preserves in-memory queue when storage fails',second.window.NihongoAccount.getKeys().includes('lesson:0'),second.window.NihongoAccount.getKeys());

  const switching=setup({holdInitialReads:false});await tick();
  switching.holdWrites(true);switching.window.NihongoAccount.complete('lesson:0');
  switching.auth('SIGNED_IN','bob');await tick();
  check('switching accounts hides previous account completion immediately',!switching.window.NihongoAccount.getKeys().includes('lesson:0')&&switching.window.NihongoAccount.getKeys().includes('lesson:1'),switching.window.NihongoAccount.getKeys());
  switching.window.NihongoAccount.complete('lesson:2');
  switching.writes[0].commit();await tick();
  const bobWrite=switching.writes.find(w=>w.table==='study_progress'&&w.payload[0].user_id==='bob');
  check('queued current-account completion syncs after old-account request finishes',!!bobWrite,bobWrite?.payload);
  if(bobWrite)bobWrite.commit();await tick();
  check('late old-account completion response cannot contaminate current state',!switching.window.NihongoAccount.getKeys().includes('lesson:0')&&switching.window.NihongoAccount.getKeys().includes('lesson:2'),switching.window.NihongoAccount.getKeys());
  check('requests never associate old completion with new account',switching.writes.every(w=>w.table!=='study_progress'||w.payload.every(row=>row.user_id===w.tokenUser)),switching.writes.map(w=>({payload:w.payload,tokenUser:w.tokenUser})));

  const lateRead=setup();await tick();
  lateRead.auth('SIGNED_IN','bob');await tick();lateRead.finishHydration();await tick();
  check('late old-account hydration cannot replace current-account state',lateRead.window.NihongoAccount.getKeys().includes('lesson:1')&&lateRead.getTheme()==='system',{keys:lateRead.window.NihongoAccount.getKeys(),theme:lateRead.getTheme()});

  const guest=setup({initialUser:null,guestKeys:['lesson:0'],holdInitialReads:false});await tick();
  check('initial null session preserves guest practice',!guest.window.NihongoAccount.isSignedIn()&&guest.window.NihongoAccount.getKeys().includes('lesson:0'),guest.window.NihongoAccount.getKeys());

  const signout=setup({holdInitialReads:false,guestKeys:['lesson:1']});await tick();
  signout.holdWrites(true);signout.window.NihongoAccount.complete('lesson:0');
  await signout.node('signout-button').onclick();
  check('explicit sign-out restores only guest progress',!signout.window.NihongoAccount.isSignedIn()&&signout.window.NihongoAccount.getKeys().includes('lesson:1')&&!signout.window.NihongoAccount.getKeys().includes('lesson:0'),signout.window.NihongoAccount.getKeys());
  signout.window.NihongoAccount.complete('lesson:2');signout.writes[0].commit();await tick();
  check('late signed-out request cannot overwrite new guest practice',!signout.window.NihongoAccount.isSignedIn()&&signout.window.NihongoAccount.getKeys().includes('lesson:2')&&!signout.window.NihongoAccount.getKeys().includes('lesson:0'),signout.window.NihongoAccount.getKeys());

  const recovery=setup({holdInitialReads:false});await tick();recovery.auth('PASSWORD_RECOVERY','alice');await tick();
  check('recovery event opens new-password form without requiring an email',recovery.node('account-dialog').open&&!recovery.node('auth-form').hidden&&recovery.node('email-field').hidden&&!recovery.node('auth-email').required,recovery.node('account-title').textContent);
  recovery.node('auth-password').value='test-password-only';await recovery.node('auth-form').onsubmit({preventDefault(){}});
  check('recovery submits password update and returns to account panel',recovery.passwordUpdates.length===1&&recovery.passwordUpdates[0].user==='alice'&&recovery.node('auth-form').hidden&&recovery.node('auth-password').value==='');

  const externalOut=setup({holdInitialReads:false});await tick();externalOut.auth('PASSWORD_RECOVERY','alice');await tick();externalOut.auth('SIGNED_OUT',null);await tick();
  check('external sign-out cancels recovery and restores sign-in form',!externalOut.node('email-field').hidden&&externalOut.node('auth-submit').textContent.includes('Sign in'),externalOut.node('auth-submit').textContent);

  const recoverySwitch=setup({holdInitialReads:false});await tick();recoverySwitch.auth('PASSWORD_RECOVERY','alice');await tick();recoverySwitch.auth('SIGNED_IN','bob');await tick();
  check('switching identity cancels another account recovery state',recoverySwitch.node('auth-form').hidden,recoverySwitch.node('account-title').textContent);

  const signup=setup({initialUser:null,signupReady:true});await tick();signup.mode('signup');
  signup.node('auth-email').value=' learner@example.invalid ';signup.node('auth-password').value='test-password-only';
  check('ready signup enables submission and shows the password requirement without a setup warning',!signup.node('auth-submit').disabled&&signup.node('email-setup-note').hidden&&!signup.node('password-hint').hidden);
  await signup.node('auth-form').onsubmit({preventDefault(){}});
  const signupCall=signup.authRequests[0];
  check('signup uses the entered address and returns to this site after confirmation',signupCall?.method==='signup'&&signupCall.payload.email==='learner@example.invalid'&&signupCall.payload.options.emailRedirectTo==='https://example.invalid/');
  check('unconfirmed signup asks for email confirmation without granting a local signed-in session',signup.node('account-status').textContent.includes('confirm your account')&&!signup.window.NihongoAccount.isSignedIn()&&signup.node('auth-password').value==='');

  const reset=setup({initialUser:null,signupReady:true});await tick();
  reset.node('auth-password').value='short';reset.mode('reset');reset.node('auth-email').value='learner@example.invalid';
  check('reset excludes a previously entered short password from native form validation',reset.node('auth-password').disabled&&!reset.node('auth-email').disabled&&reset.node('password-hint').hidden);
  await reset.node('auth-form').onsubmit({preventDefault(){}});
  check('reset sends only the email and correct redirect',reset.authRequests[0]?.method==='reset'&&reset.authRequests[0].email==='learner@example.invalid'&&reset.authRequests[0].options.redirectTo==='https://example.invalid/');

  const limited=setup({initialUser:null,signupReady:true,authError:{status:429,message:'Request rejected'}});await tick();limited.mode('signup');
  await limited.node('auth-form').onsubmit({preventDefault(){}});
  check('rate-limited signup gives a wait message and allows a later retry',limited.node('account-status').textContent.includes('Please wait')&&!limited.node('auth-submit').disabled);

  const paused=setup({initialUser:null});await tick();paused.mode('signup');await paused.node('auth-form').onsubmit({preventDefault(){}});
  check('signup readiness switch still prevents requests when email delivery is paused',paused.node('auth-submit').disabled&&!paused.node('email-setup-note').hidden&&paused.authRequests.length===0);

  console.log(JSON.stringify(results,null,2));
  process.exitCode=results.every(r=>r.passed)?0:1;
})().catch(error=>{console.error(error);process.exitCode=1;});
