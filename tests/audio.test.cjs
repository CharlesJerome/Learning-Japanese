const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const path=require('node:path');
function fixture(){
 const audio=[],spoken=[],timers=new Map();let id=0,cancels=0;
 const window={};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../dist/audio-player.js'),'utf8'),{window,setTimeout:fn=>{timers.set(++id,fn);return id},clearTimeout:id=>timers.delete(id),Audio:function(){},SpeechSynthesisUtterance:function(){}});
 const player=new window.NihongoSpeech({clips:{'あ':'audio/a.mp3'},createAudio:()=>{const item={paused:false,play(){return Promise.resolve()},pause(){this.paused=true},removeAttribute(){},load(){}};audio.push(item);return item},synth:{speak:u=>spoken.push(u),cancel:()=>cancels++},createUtterance:text=>({text})});
 return {player,audio,spoken,timers,cancels:()=>cancels};
}
test('clip playback works without a device voice and preserves slow playback pitch',()=>{
 const f=fixture();let starts=0,ends=0;
 f.player.play('あ',{rate:.75,onStart:kind=>{assert.equal(kind,'natural');starts++},onEnd:()=>ends++});
 assert.equal(f.audio[0].src,'audio/a.mp3');assert.equal(f.audio[0].playbackRate,.75);assert.equal(f.audio[0].preservesPitch,true);assert.equal(starts,0);
 f.audio[0].onplaying();f.audio[0].onplaying();assert.equal(starts,1);assert.equal(f.timers.size,0);
 f.audio[0].onended();assert.equal(ends,1);assert.equal(f.player.active,false);
});
test('failed clip falls back once to the chosen Japanese device voice',()=>{
 const f=fixture();let fallbacks=0,started='';const voice={name:'Japanese'};
 f.player.play('あ',{voice,onFallback:()=>fallbacks++,onStart:kind=>started=kind});
 const lateError=f.audio[0].onerror;lateError();lateError();assert.equal(fallbacks,1);assert.equal(f.spoken.length,1);assert.equal(f.spoken[0].voice,voice);assert.equal(f.audio[0].paused,true);
 f.spoken[0].onstart();assert.equal(started,'device');f.player.stop();
});
test('a slow or stalled download times out and falls back',()=>{
 const f=fixture();f.player.play('あ',{voice:{name:'Japanese'}});[...f.timers.values()][0]();assert.equal(f.spoken.length,1);f.player.stop();
});
test('navigation cancellation ignores late playback events and promise rejections',async()=>{
 const f=fixture();let starts=0,errors=0;
 f.player.play('あ',{onStart:()=>starts++,onError:()=>errors++});const lateStart=f.audio[0].onplaying,lateError=f.audio[0].onerror;
 f.player.stop();lateStart();lateError();await Promise.resolve();assert.equal(starts,0);assert.equal(errors,0);assert.equal(f.audio[0].paused,true);assert.equal(f.timers.size,0);
});
test('explicit device selection bypasses clips',()=>{
 const f=fixture();f.player.play('あ',{preferDevice:true,voice:{name:'Japanese'}});assert.equal(f.audio.length,0);assert.equal(f.spoken.length,1);f.player.stop();assert.equal(f.cancels(),1);
});
test('missing clip and unavailable device voice reports an error without unlocking quiz',()=>{
 const f=fixture();let errors=0,starts=0;f.player.play('missing',{onError:()=>errors++,onStart:()=>starts++});assert.equal(errors,1);assert.equal(starts,0);assert.equal(f.player.active,false);
});
test('old fallback callbacks cannot interrupt the next card',()=>{
 const f=fixture();let oldEnds=0;f.player.play('missing',{voice:{name:'Japanese'},onEnd:()=>oldEnds++});const lateEnd=f.spoken[0].onend;
 f.player.play('あ');lateEnd();assert.equal(oldEnds,0);assert.equal(f.player.active,true);f.player.stop();
});
test('every published lesson and kana has a small local audio file',()=>{
 const c={};c.window=c;vm.createContext(c);for(const file of ['lessons.js','extra-lessons.js','audio-manifest.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'../dist',file),'utf8'),c);
 const texts=[...c.LESSONS.flatMap(l=>l.cards.map(c=>c.speech)),...c.KANA_ROWS.flatMap(row=>[...row[1],...row[2]])];
 for(const text of texts){const file=c.NIHONGO_AUDIO.clips[text];assert.match(file,/^audio\/[a-f0-9]{16}\.mp3$/);const size=fs.statSync(path.join(__dirname,'../dist',file)).size;assert.ok(size>500&&size<200000,`${text}: ${size}`)}
 assert.equal(c.NIHONGO_AUDIO.clips['は'],c.NIHONGO_AUDIO.clips['ハ']);assert.equal(c.NIHONGO_AUDIO.clips['へ'],c.NIHONGO_AUDIO.clips['ヘ']);assert.notEqual(c.NIHONGO_AUDIO.clips['へ'],c.NIHONGO_AUDIO.clips['え']);
});
