const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const path=require('node:path');
const window={};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../dist/practice-session.js'),'utf8'),{window});
const Session=window.NihongoPracticeSession;

test('15 turns cycle original cards and explicitly identify review without creating new saved keys',()=>{
 const s=new Session('hira-0',5),keys=[];
 for(let index=0;index<15;index++){
  assert.equal(s.index,index);
  assert.equal(s.sourceIndex,index%5);
  assert.equal(s.isReview,index>=5);
  keys.push(s.key);
  s.complete();
  if(index<14)s.move(1);
 }
 assert.equal(s.completed.size,15);
 assert.equal(new Set(keys).size,5);
 assert.equal(s.key,'hira-0:4');
});

test('listening and speaking on one turn count once; a later review counts as another turn',()=>{
 const s=new Session('kana',3);
 assert.equal(s.complete(),true);
 assert.equal(s.complete(),false);
 s.move(1);s.move(-1);
 assert.equal(s.done,true);
 s.complete();
 assert.equal(s.completed.size,1);
 s.move(1);s.move(1);s.move(1);
 assert.equal(s.key,'kana:0');
 assert.equal(s.isReview,true);
 assert.equal(s.done,false);
 s.complete();
 assert.equal(s.completed.size,2);
});

test('Start again clears the whole session while previous never wraps at the first turn',()=>{
 const s=new Session('greetings',5);
 s.move(-1);assert.equal(s.index,0);
 for(let index=0;index<15;index++){s.complete();s.move(1)}
 assert.equal(s.index,0);
 assert.equal(s.completed.size,0);
 assert.equal(s.done,false);
 assert.equal(s.isReview,false);
});

test('history resume starts at a valid source card, then cycles without altering keys',()=>{
 const s=new Session('n5',4,2);
 assert.equal(s.key,'n5:2');
 assert.equal(s.index,0);
 s.complete();s.move(1);assert.equal(s.key,'n5:3');
 s.move(1);assert.equal(s.key,'n5:0');assert.equal(s.isReview,false);
 s.move(1);s.move(1);assert.equal(s.key,'n5:2');assert.equal(s.isReview,true);
 s.reset('hira',3);
 assert.equal(s.key,'hira:0');assert.equal(s.completed.size,0);
 assert.throws(()=>s.reset('hira',3,3));
 assert.throws(()=>s.reset('empty',0));
});

test('every published lesson has 15 different cards with valid stable source keys',()=>{
 const context={};context.window=context;vm.createContext(context);
 for(const file of ['lessons.js','extra-lessons.js','lesson-expansion.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'../dist',file),'utf8'),context);
 for(const lesson of context.LESSONS){
  assert.equal(lesson.cards.length,15,lesson.id);
  assert.equal(new Set(lesson.cards.map(card=>card.jp)).size,15,lesson.id);
  const s=new Session(lesson.id,lesson.cards.length);
  for(let turn=0;turn<15;turn++){
   assert.ok(lesson.cards[s.sourceIndex]);
   assert.equal(s.key,`${lesson.id}:${s.sourceIndex}`);
   s.complete();if(turn<14)s.move(1);
  }
  assert.equal(s.completed.size,15,lesson.id);
  assert.equal(s.isReview,false,lesson.id);
 }
});
