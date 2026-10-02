'use strict';
(() => {
  const makeCard = (jp, reading, en, my, speech = jp) => ({ jp, reading, en, my, speech });
  const clean = value => String(value || '').replace(/[。？！]$/, '');
  const guided = [
    ['今日は「{jp}」を三回言います。', 'Today I will say “{en}” three times.', 'ဒီနေ့ “{en}” ကို သုံးခေါက် ပြောပါမယ်။'],
    ['音声を聞いて、「{jp}」を言います。', 'I listen to the audio and say “{en}”.', 'အသံကို နားထောင်ပြီး “{en}” ကို ပြောပါမယ်။'],
    ['ノートに「{jp}」を書きます。', 'I write “{en}” in my notebook.', 'မှတ်စုစာအုပ်ထဲမှာ “{en}” ကို ရေးပါမယ်။'],
    ['友達に「{jp}」と言います。', 'I say “{en}” to my friend.', 'သူငယ်ချင်းကို “{en}” လို့ ပြောပါမယ်။'],
    ['ゆっくり「{jp}」を読んでください。', 'Please read “{en}” slowly.', '“{en}” ကို ဖြည်းဖြည်း ဖတ်ပေးပါ။'],
    ['「{jp}」という文を練習します。', 'I practise the sentence “{en}”.', '“{en}” ဆိုတဲ့ ဝါကျကို လေ့ကျင့်ပါမယ်။'],
    ['録音を聞いて、「{jp}」を比べます。', 'I listen to my recording and compare “{en}”.', 'ကိုယ့်အသံကို နားထောင်ပြီး “{en}” နဲ့ နှိုင်းယှဉ်ပါမယ်။'],
    ['先生のあとで「{jp}」を繰り返します。', 'I repeat “{en}” after the teacher.', 'ဆရာနောက်က “{en}” ကို လိုက်ပြောပါမယ်။'],
    ['朝に「{jp}」を声に出します。', 'I say “{en}” aloud in the morning.', 'မနက်မှာ “{en}” ကို အသံထွက် ပြောပါမယ်။'],
    ['最後にもう一度「{jp}」を言います。', 'At the end I say “{en}” once more.', 'အဆုံးမှာ “{en}” ကို နောက်တစ်ခေါက် ပြောပါမယ်။']
  ];
  const soundTemplates = [
    ['「{s}」の音を練習します。', 'I practise the sound {r}.', '{r} အသံကို လေ့ကျင့်ပါမယ်။'],
    ['「{s}」を三回読みます。', 'I read {r} three times.', '{r} ကို သုံးခေါက် ဖတ်ပါမယ်။'],
    ['「{s}」をノートに書きます。', 'I write {r} in my notebook.', 'မှတ်စုစာအုပ်ထဲမှာ {r} ကို ရေးပါမယ်။'],
    ['「{s}」を聞いて、まねします。', 'I listen to {r} and copy it.', '{r} ကို နားထောင်ပြီး လိုက်ပြောပါမယ်။'],
    ['「{s}」を短く言います。', 'I say {r} as a short sound.', '{r} ကို အသံတိုတိုနဲ့ ပြောပါမယ်။']
  ];
  function addUnique(lesson, card) { if (!lesson.cards.some(item => item.jp === card.jp)) lesson.cards.push(card); }
  function expandSoundLesson(lesson) {
    const script = lesson.id.startsWith('kata') ? 2 : 1;
    const row = KANA_ROWS[Number(lesson.id.split('-')[1])], chars = [...row[script]], readings = row[3];
    let template = 0;
    while (lesson.cards.length < 15) {
      const char = chars[template % chars.length], reading = readings[template % chars.length], pattern = soundTemplates[Math.floor(template / chars.length) % soundTemplates.length];
      const japanese = pattern[0].replace('{s}', char).replace('{r}', reading);
      addUnique(lesson, makeCard(japanese, `${reading} practice`, pattern[1].replace('{r}', reading), pattern[2].replace('{r}', reading), japanese));
      template++;
    }
  }
  function expandLesson(lesson) {
    const originals = lesson.cards.slice(); let index = 0;
    while (lesson.cards.length < 15) {
      const source = originals[index % originals.length], frame = guided[index % guided.length], jp = clean(source.jp), en = frame[1].replace('{en}', source.en), my = frame[2].replace('{en}', source.my);
      addUnique(lesson, makeCard(frame[0].replace('{jp}', jp), `${source.reading} · guided practice`, en, my, frame[0].replace('{jp}', source.speech || jp)));
      index++;
    }
  }
  for (const lesson of window.LESSONS || []) {
    if (lesson.cards.length >= 15) continue;
    if (/^(hira|kata)-[0-9]+$/.test(lesson.id)) expandSoundLesson(lesson); else expandLesson(lesson);
    lesson.practiceCardCount = lesson.cards.length;
  }
})();
