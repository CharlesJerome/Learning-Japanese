'use strict';
// Only published lesson clips are requested. Microphone audio never enters this player.
window.NihongoSpeech = class NihongoSpeech {
 constructor({clips={},createAudio=()=>new Audio(),synth=window.speechSynthesis,createUtterance=text=>new SpeechSynthesisUtterance(text),timeout=10000}={}){
  this.clips=clips;this.createAudio=createAudio;this.synth=synth;this.createUtterance=createUtterance;this.timeout=timeout;this.generation=0;this.active=false;this.rate=1;
 }
 hasClip(text){return typeof this.clips[text]==='string'}
 normalizeRate(value){const rate=Number(value);return Number.isFinite(rate)?Math.max(.25,Math.min(2,rate)):1}
 applyAudioRate(audio){audio.defaultPlaybackRate=this.rate;audio.playbackRate=this.rate;audio.preservesPitch=true;if('webkitPreservesPitch' in audio)audio.webkitPreservesPitch=true}
 setRate(value){
  const rate=this.normalizeRate(value);if(rate===this.rate)return;this.rate=rate;
  if(this.audio)this.applyAudioRate(this.audio);
  // Speech engines read the rate when they start. Restart at the new speed
  // instead of changing an utterance property that may silently be ignored.
  if(this.active&&this.utterance&&this.request){const {text,options}=this.request;this.play(text,{...options,preferDevice:true,rate})}
 }
 stop(){
  this.generation++;this.active=false;this.request=null;clearTimeout(this.timer);
  if(this.audio){this.audio.onloadedmetadata=this.audio.onplaying=this.audio.onended=this.audio.onerror=this.audio.onwaiting=this.audio.ontimeupdate=null;this.audio.pause();this.audio.removeAttribute('src');this.audio.load();this.audio=null}
  if(this.utterance){this.utterance.onstart=this.utterance.onend=this.utterance.onerror=null;this.utterance=null;this.synth?.cancel()}
 }
 play(text,{voice=null,preferDevice=false,rate=1,onStart=()=>{},onEnd=()=>{},onError=()=>{},onFallback=()=>{}}={}){
  this.stop();this.rate=this.normalizeRate(rate);this.request={text,options:{voice,preferDevice,onStart,onEnd,onError,onFallback}};const generation=this.generation;this.active=true;
  const valid=()=>generation===this.generation&&this.active;
  const fail=()=>{if(!valid())return;this.stop();onError()};
  const finish=()=>{if(!valid())return;this.stop();onEnd()};
  let started=false,usingDevice=false;
  const begin=()=>{if(!valid())return;clearTimeout(this.timer);if(!started){started=true;onStart(usingDevice?'device':'natural')}};
  const device=()=>{
   if(!valid()||usingDevice)return;usingDevice=true;clearTimeout(this.timer);
   if(this.audio){this.audio.onloadedmetadata=this.audio.onplaying=this.audio.onended=this.audio.onerror=this.audio.onwaiting=this.audio.ontimeupdate=null;this.audio.pause();this.audio.removeAttribute('src');this.audio.load();this.audio=null}
   if(!voice||!this.synth){fail();return}
   started=false;
   try{
    const utterance=this.createUtterance(text);this.utterance=utterance;utterance.voice=voice;utterance.lang='ja-JP';utterance.rate=this.rate;utterance.pitch=1;
    utterance.onstart=begin;utterance.onend=finish;utterance.onerror=fail;
    this.timer=setTimeout(fail,this.timeout);this.synth.speak(utterance);
   }catch{fail()}
  };
  if(preferDevice||!this.hasClip(text)){device();return}
  const fallback=()=>{if(!valid()||usingDevice)return;onFallback();device()};
  try{
   const audio=this.createAudio();this.audio=audio;audio.preload='none';audio.src=this.clips[text];this.applyAudioRate(audio);
   audio.onloadedmetadata=()=>{if(valid())this.applyAudioRate(audio)};
   audio.onplaying=()=>{if(valid()){this.applyAudioRate(audio);begin()}};audio.onended=finish;audio.onerror=fallback;
   audio.onwaiting=()=>{if(valid()){clearTimeout(this.timer);this.timer=setTimeout(fallback,this.timeout)}};
   audio.ontimeupdate=()=>{if(valid()&&!audio.paused)clearTimeout(this.timer)};
   this.timer=setTimeout(fallback,this.timeout);
   Promise.resolve(audio.play()).catch(error=>{if(!valid())return;if(error?.name==='NotAllowedError')fail();else fallback()});
  }catch{fallback()}
 }
};
