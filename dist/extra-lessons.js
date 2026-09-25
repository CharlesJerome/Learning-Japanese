'use strict';
// Original practice material. Load after lessons.js. No textbook/media files are included.
(() => {
  const practiceCards = rows => rows.map(([jp, reading, en, my]) => ({jp, reading, en, my, speech: jp}));
  window.LESSONS.push(
    {
      id: 'n5-01-things-and-owners', name: 'N5 practice · 01 · Things and owners', stage: 'N5 practice',
      noteEn: 'これ stands alone; この must come before a noun. の connects an owner to a thing. は is pronounced wa. Point to your own objects and change the noun.',
      noteMy: 'これ ကို တစ်လုံးတည်း သုံးနိုင်ပြီး この နောက်မှာ နာမ်လိုပါတယ်။ の က ပိုင်ရှင်နဲ့ ပစ္စည်းကို ဆက်ပေးပါတယ်။ は ကို wa လို့ ဖတ်ပါ။ ကိုယ့်ပစ္စည်းကို ညွှန်ပြီး နာမ်ကို ပြောင်းပြောပါ။',
      cards: practiceCards([
        ['これは日本語のノートです。', 'これは にほんごの ノートです。', 'This is a Japanese-language notebook.', 'ဒါက ဂျပန်စာ မှတ်စုစာအုပ်ပါ။'],
        ['そのペンは私のです。', 'その ペンは わたしのです。', 'That pen is mine.', 'အဲဒီဘောပင်က ကျွန်တော်/ကျွန်မရဲ့ဟာပါ။'],
        ['あれは友達のかばんです。', 'あれは ともだちの かばんです。', 'That over there is my friend’s bag.', 'ဟိုကဟာက သူငယ်ချင်းရဲ့ အိတ်ပါ။'],
        ['この本は誰のですか。', 'この ほんは だれのですか。', 'Whose book is this?', 'ဒီစာအုပ်က ဘယ်သူ့ဟာလဲ။'],
        ['この時計は私のではありません。', 'この とけいは わたしのでは ありません。', 'This watch is not mine.', 'ဒီနာရီက ကျွန်တော်/ကျွန်မရဲ့ဟာ မဟုတ်ပါဘူး။']
      ])
    },
    {
      id: 'n5-02-your-week', name: 'N5 practice · 02 · Your weekly timetable', stage: 'N5 practice',
      noteEn: 'に marks a specific time. から means from, and まで means until. Watch the readings: 四時 = よじ, 七時 = しちじ, 九時 = くじ. Say your own start and finish times.',
      noteMy: 'တိကျတဲ့အချိန်နောက်မှာ に သုံးပါတယ်။ から က “မှ”၊ まで က “အထိ” ပါ။ 四時 ကို よじ၊ 七時 ကို しちじ၊ 九時 ကို くじ လို့ ဖတ်ပါ။ ကိုယ့်အချိန်ဇယားနဲ့ ပြန်ပြောပါ။',
      cards: practiceCards([
        ['月曜日の授業は午前八時からです。', 'げつようびの じゅぎょうは ごぜん はちじからです。', 'Monday’s class starts at 8 a.m.', 'တနင်္လာနေ့ အတန်းက မနက် ရှစ်နာရီမှာ စပါတယ်။'],
        ['授業は午前十一時に終わります。', 'じゅぎょうは ごぜん じゅういちじに おわります。', 'Class ends at 11 a.m.', 'အတန်းက မနက် ဆယ့်တစ်နာရီမှာ ပြီးပါတယ်။'],
        ['水曜日は午後一時から勉強します。', 'すいようびは ごご いちじから べんきょうします。', 'On Wednesday, I study from 1 p.m.', 'ဗုဒ္ဓဟူးနေ့မှာ နေ့လယ် တစ်နာရီကစပြီး စာလေ့လာပါတယ်။'],
        ['木曜日の授業は午後四時までです。', 'もくようびの じゅぎょうは ごご よじまでです。', 'Thursday’s class lasts until 4 p.m.', 'ကြာသပတေးနေ့ အတန်းက ညနေ လေးနာရီအထိပါ။'],
        ['日曜日の朝、教会へ行きます。', 'にちようびの あさ、きょうかいへ いきます。', 'I go to church on Sunday morning.', 'တနင်္ဂနွေနေ့ မနက်မှာ ဘုရားကျောင်း သွားပါတယ်။']
      ])
    },
    {
      id: 'n5-03-going-places', name: 'N5 practice · 03 · Going places', stage: 'N5 practice',
      noteEn: 'へ (pronounced e) or に marks a destination. で marks transport, and と marks a companion. Say the same trip with a different place or companion.',
      noteMy: 'နေရာတစ်ခုဆီ သွားတာကို へ သို့မဟုတ် に နဲ့ ပြပါတယ်။ へ ကို e လို့ ဖတ်ပါ။ ယာဉ်နောက်မှာ で၊ အတူသွားသူနောက်မှာ と သုံးပါ။ နေရာနဲ့ အတူသွားသူကို ပြောင်းပြောပါ။',
      cards: practiceCards([
        ['火曜日に図書館へ行きます。', 'かようびに としょかんへ いきます。', 'I go to the library on Tuesday.', 'အင်္ဂါနေ့မှာ စာကြည့်တိုက် သွားပါတယ်။'],
        ['友達とバスで学校へ行きます。', 'ともだちと バスで がっこうへ いきます。', 'I go to school by bus with a friend.', 'သူငယ်ချင်းနဲ့အတူ ဘတ်စ်ကားစီးပြီး ကျောင်းသွားပါတယ်။'],
        ['今日は歩いて帰ります。', 'きょうは あるいて かえります。', 'Today I will walk home.', 'ဒီနေ့ လမ်းလျှောက်ပြီး အိမ်ပြန်မယ်။'],
        ['昨日、一人で駅へ行きました。', 'きのう、ひとりで えきへ いきました。', 'Yesterday I went to the station alone.', 'မနေ့က တစ်ယောက်တည်း ဘူတာရုံ သွားခဲ့ပါတယ်။'],
        ['何で図書館へ行きますか。', 'なんで としょかんへ いきますか。', 'How do you get to the library? (By what means?)', 'စာကြည့်တိုက်ကို ဘာနဲ့ သွားသလဲ။']
      ])
    },
    {
      id: 'n5-04-actions-and-invitations', name: 'N5 practice · 04 · Actions and invitations', stage: 'N5 practice',
      noteEn: 'を (pronounced o) marks the object of an action; で marks where it happens. ～ませんか invites someone, and ～ましょう suggests doing something together.',
      noteMy: 'を ကို o လို့ ဖတ်ပြီး ကြိယာရဲ့ ကံပုဒ်နောက်မှာ သုံးပါတယ်။ လုပ်ဆောင်တဲ့နေရာနောက်မှာ で သုံးပါ။ ～ませんか က ဖိတ်ခေါ်တာ၊ ～ましょう က အတူလုပ်ဖို့ အကြံပြုတာပါ။',
      cards: practiceCards([
        ['家で日本語の歌を聞きます。', 'いえで にほんごの うたを ききます。', 'I listen to Japanese songs at home.', 'အိမ်မှာ ဂျပန်သီချင်း နားထောင်ပါတယ်။'],
        ['ノートに新しい言葉を書きます。', 'ノートに あたらしい ことばを かきます。', 'I write new words in my notebook.', 'မှတ်စုစာအုပ်ထဲမှာ စကားလုံးအသစ်တွေ ရေးပါတယ်။'],
        ['公園でお弁当を食べました。', 'こうえんで おべんとうを たべました。', 'I ate a packed lunch in the park.', 'ပန်းခြံမှာ ထမင်းဘူးထဲက ထမင်း စားခဲ့ပါတယ်။'],
        ['明日、一緒に復習しませんか。', 'あした、いっしょに ふくしゅうしませんか。', 'Would you like to review together tomorrow?', 'မနက်ဖြန် အတူတူ စာပြန်လေ့လာကြမလား။'],
        ['五分休みましょう。', 'ごふん やすみましょう。', 'Let’s take a five-minute break.', 'ငါးမိနစ် နားကြရအောင်။']
      ])
    },
    {
      id: 'n5-05-describing-things', name: 'N5 practice · 05 · Describing things', stage: 'N5 practice',
      noteEn: 'An い-adjective keeps い before a noun: 新しい本. A な-adjective uses な before a noun: 静かな部屋. For a negative, 新しい becomes 新しくない. Describe your study space.',
      noteMy: 'い နာမဝိသေသနက နာမ်ရှေ့မှာ い ကို ထိန်းထားပါတယ်။ な နာမဝိသေသနက နာမ်ရှေ့မှာ な ထည့်ပါတယ်။ 新しい ရဲ့ အငြင်းပုံစံက 新しくない ပါ။ စာလေ့လာတဲ့နေရာအကြောင်း ပြောကြည့်ပါ။',
      cards: practiceCards([
        ['新しいノートは軽いです。', 'あたらしい ノートは かるいです。', 'My new notebook is light.', 'မှတ်စုစာအုပ်အသစ်က ပေါ့ပါတယ်။'],
        ['この部屋は静かです。', 'この へやは しずかです。', 'This room is quiet.', 'ဒီအခန်းက တိတ်ဆိတ်ပါတယ်။'],
        ['静かな部屋で勉強します。', 'しずかな へやで べんきょうします。', 'I study in a quiet room.', 'တိတ်ဆိတ်တဲ့အခန်းမှာ စာလေ့လာပါတယ်။'],
        ['今日の宿題は難しくないです。', 'きょうの しゅくだいは むずかしくないです。', 'Today’s homework is not difficult.', 'ဒီနေ့ အိမ်စာက မခက်ပါဘူး။'],
        ['昨日の練習は楽しかったです。', 'きのうの れんしゅうは たのしかったです。', 'Yesterday’s practice was fun.', 'မနေ့က လေ့ကျင့်ရတာ ပျော်စရာကောင်းခဲ့ပါတယ်။']
      ])
    },
    {
      id: 'n5-06-where-things-are', name: 'N5 practice · 06 · Where things are', stage: 'N5 practice',
      noteEn: 'Use あります for things and います for people and animals. Place に + thing/person が + あります/います introduces what is there. Practise 上, 下, 隣 and 前.',
      noteMy: 'ပစ္စည်းတွေ ရှိတာကို あります၊ လူနဲ့ တိရစ္ဆာန်တွေ ရှိတာကို います နဲ့ ပြောပါတယ်။ “နေရာ に + ရှိတဲ့အရာ が” ပုံစံကို သုံးပါ။ အပေါ်၊ အောက်၊ ဘေးနဲ့ ရှေ့နေရာတွေကို လေ့ကျင့်ပါ။',
      cards: practiceCards([
        ['机の上に青いノートがあります。', 'つくえの うえに あおい ノートが あります。', 'There is a blue notebook on the desk.', 'စားပွဲပေါ်မှာ အပြာရောင် မှတ်စုစာအုပ် ရှိပါတယ်။'],
        ['椅子の下に小さい猫がいます。', 'いすの したに ちいさい ねこが います。', 'There is a small cat under the chair.', 'ကုလားထိုင်အောက်မှာ ကြောင်လေးတစ်ကောင် ရှိပါတယ်။'],
        ['学校の隣にパン屋があります。', 'がっこうの となりに パンやが あります。', 'There is a bakery next to the school.', 'ကျောင်းဘေးမှာ ပေါင်မုန့်ဆိုင် ရှိပါတယ်။'],
        ['先生は教室にいます。', 'せんせいは きょうしつに います。', 'The teacher is in the classroom.', 'ဆရာ/ဆရာမက စာသင်ခန်းထဲမှာ ရှိပါတယ်။'],
        ['駅の前に何がありますか。', 'えきの まえに なにが ありますか。', 'What is in front of the station?', 'ဘူတာရုံရှေ့မှာ ဘာရှိသလဲ။']
      ])
    },
    {
      id: 'n5-07-counting-and-duration', name: 'N5 practice · 07 · Counting and duration', stage: 'N5 practice',
      noteEn: 'Counters change with the thing counted. Listen to 三冊 (さんさつ), 二人 (ふたり), 二枚 (にまい), and 二十分 (にじゅっぷん). A duration such as 三十分 normally needs no に.',
      noteMy: 'ရေတွက်တဲ့ပစ္စည်းအလိုက် ရေတွက်ပုဒ် ပြောင်းပါတယ်။ 三冊၊ 二人၊ 二枚 နဲ့ 二十分 ရဲ့ အသံထွက်ကို နားထောင်ပါ။ 三十分 လို ကြာချိန်နောက်မှာ ပုံမှန်အားဖြင့် に မထည့်ပါဘူး။',
      cards: practiceCards([
        ['日本語の本を三冊持っています。', 'にほんごの ほんを さんさつ もっています。', 'I have three Japanese-language books.', 'ဂျပန်စာ စာအုပ် သုံးအုပ် ရှိပါတယ်။'],
        ['教室に学生が二人います。', 'きょうしつに がくせいが ふたり います。', 'There are two students in the classroom.', 'စာသင်ခန်းထဲမှာ ကျောင်းသား/ကျောင်းသူ နှစ်ယောက် ရှိပါတယ်။'],
        ['切符を二枚ください。', 'きっぷを にまい ください。', 'Two tickets, please.', 'လက်မှတ် နှစ်စောင် ပေးပါ။'],
        ['毎朝、二十分練習します。', 'まいあさ、にじゅっぷん れんしゅうします。', 'I practise for twenty minutes every morning.', 'မနက်တိုင်း မိနစ်နှစ်ဆယ် လေ့ကျင့်ပါတယ်။'],
        ['一週間に三回、漢字を復習します。', 'いっしゅうかんに さんかい、かんじを ふくしゅうします。', 'I review kanji three times a week.', 'တစ်ပတ်မှာ သုံးကြိမ် ခန်းဂျီး ပြန်လေ့လာပါတယ်။']
      ])
    },
    {
      id: 'n5-08-requests-and-permission', name: 'N5 practice · 08 · Requests and permission', stage: 'N5 practice',
      noteEn: 'Use the て-form + ください for a request. ～てもいいですか asks permission. ～てはいけません states a prohibition. Compare 読む → 読んで, 書く → 書いて, 待つ → 待って.',
      noteMy: 'တစ်ခုခု လုပ်ပေးဖို့ တောင်းဆိုရင် て ပုံစံနဲ့ ください ကို ဆက်ပါ။ ခွင့်တောင်းရင် ～てもいいですか၊ တားမြစ်ရင် ～てはいけません သုံးပါ။ 読んで၊ 書いて၊ 待って ပုံစံတွေကို လေ့ကျင့်ပါ။',
      cards: practiceCards([
        ['この短い文を読んでください。', 'この みじかい ぶんを よんでください。', 'Please read this short sentence.', 'ဒီဝါကျတိုကို ဖတ်ပေးပါ။'],
        ['答えをノートに書いてください。', 'こたえを ノートに かいてください。', 'Please write the answer in your notebook.', 'အဖြေကို မှတ်စုစာအုပ်ထဲမှာ ရေးပါ။'],
        ['ここで少し待ってください。', 'ここで すこし まってください。', 'Please wait here for a moment.', 'ဒီမှာ ခဏစောင့်ပေးပါ။'],
        ['この辞書を使ってもいいですか。', 'この じしょを つかっても いいですか。', 'May I use this dictionary?', 'ဒီအဘိဓာန်ကို သုံးလို့ရမလား။'],
        ['この部屋で食べてはいけません。', 'この へやで たべては いけません。', 'Eating is not allowed in this room.', 'ဒီအခန်းထဲမှာ အစားစားလို့ မရပါဘူး။']
      ])
    },
    {
      id: 'n5-09-wants-and-sequences', name: 'N5 practice · 09 · Wants and sequences', stage: 'N5 practice',
      noteEn: 'Remove ます and add たい to say what you want to do. A て-form can join actions in order. ～てから means after doing. Change these plans to match your day.',
      noteMy: 'လုပ်ချင်တာကို ပြောဖို့ ます ဖြုတ်ပြီး たい ထည့်ပါ။ て ပုံစံနဲ့ လုပ်ဆောင်ချက်တွေကို အစဉ်လိုက် ဆက်နိုင်ပါတယ်။ ～てから က “လုပ်ပြီးမှ” ပါ။ ကိုယ့်နေ့စဉ်အလုပ်နဲ့ ပြောင်းပြောပါ။',
      cards: practiceCards([
        ['日本語で日記を書きたいです。', 'にほんごで にっきを かきたいです。', 'I want to write a diary in Japanese.', 'ဂျပန်လို နေ့စဉ်မှတ်တမ်း ရေးချင်ပါတယ်။'],
        ['今夜、新しい歌を聞きたいです。', 'こんや、あたらしい うたを ききたいです。', 'I want to listen to a new song tonight.', 'ဒီည သီချင်းအသစ်တစ်ပုဒ် နားထောင်ချင်ပါတယ်။'],
        ['朝ご飯を食べて、学校へ行きます。', 'あさごはんを たべて、がっこうへ いきます。', 'I eat breakfast and then go to school.', 'မနက်စာစားပြီး ကျောင်းသွားပါတယ်။'],
        ['音声を聞いてから、文を読みます。', 'おんせいを きいてから、ぶんを よみます。', 'After listening to the audio, I read the sentence.', 'အသံဖိုင်ကို နားထောင်ပြီးမှ ဝါကျကို ဖတ်ပါတယ်။'],
        ['宿題をしてから、友達と話します。', 'しゅくだいを してから、ともだちと はなします。', 'After doing my homework, I talk with a friend.', 'အိမ်စာလုပ်ပြီးမှ သူငယ်ချင်းနဲ့ စကားပြောပါတယ်။']
      ])
    },
    {
      id: 'n4-01-explain-and-ask', name: 'N4 practice · 01 · Explain and ask for help', stage: 'N4 practice',
      noteEn: '～んです gives background or an explanation. Use a plain verb before it; nouns and な-adjectives take なんです. ～ていただけませんか is a polite request. Practise with a partner asking why.',
      noteMy: '～んです က အကြောင်းရင်း ဒါမှမဟုတ် နောက်ခံအကြောင်းကို ရှင်းပြပါတယ်။ ကြိယာရိုးရိုးပုံစံနောက်မှာ ဆက်ပြီး နာမ်နဲ့ な နာမဝိသေသနဆို なんです သုံးပါ။ ～ていただけませんか က ယဉ်ကျေးတဲ့ တောင်းဆိုပုံပါ။',
      cards: practiceCards([
        ['明日テストがあるんです。', 'あした テストが あるんです。', 'I have a test tomorrow. (Explaining the situation.)', 'မနက်ဖြန် စာမေးပွဲ ရှိလို့ပါ။'],
        ['この漢字の読み方が分からないんです。', 'この かんじの よみかたが わからないんです。', 'I don’t know how to read this kanji. (Explaining.)', 'ဒီခန်းဂျီးရဲ့ ဖတ်ပုံကို မသိလို့ပါ။'],
        ['今日は休みなんです。', 'きょうは やすみなんです。', 'Today is my day off. (Explaining.)', 'ဒီနေ့ နားရက်ဖြစ်လို့ပါ။'],
        ['この文を説明していただけませんか。', 'この ぶんを せつめいして いただけませんか。', 'Could you please explain this sentence?', 'ဒီဝါကျကို ရှင်းပြပေးနိုင်မလား။'],
        ['発音を聞いていただけませんか。', 'はつおんを きいて いただけませんか。', 'Could you please listen to my pronunciation?', 'ကျွန်တော်/ကျွန်မရဲ့ အသံထွက်ကို နားထောင်ပေးနိုင်မလား။']
      ])
    },
    {
      id: 'n4-02-what-you-can-do', name: 'N4 practice · 02 · What you can do', stage: 'N4 practice',
      noteEn: 'Potential forms express ability: 読む → 読める, 話す → 話せる, 覚える → 覚えられる, する → できる. が often marks the thing you can do. Add まだ to say not yet.',
      noteMy: 'လုပ်နိုင်တာကို ပြောတဲ့ပုံစံတွေက 読める၊ 話せる၊ 覚えられる နဲ့ できる ပါ။ လုပ်နိုင်တဲ့အရာနောက်မှာ が ကို မကြာခဏ သုံးပါတယ်။ “မလုပ်နိုင်သေးဘူး” လို့ ပြောဖို့ まだ ထည့်ပါ။',
      cards: practiceCards([
        ['短い日本語の話が読めます。', 'みじかい にほんごの はなしが よめます。', 'I can read short stories in Japanese.', 'ဂျပန်လို ဇာတ်လမ်းတိုတွေ ဖတ်နိုင်ပါတယ်။'],
        ['今日は三十分練習できます。', 'きょうは さんじゅっぷん れんしゅうできます。', 'I can practise for thirty minutes today.', 'ဒီနေ့ မိနစ်သုံးဆယ် လေ့ကျင့်နိုင်ပါတယ်။'],
        ['新しい言葉を五つ覚えられました。', 'あたらしい ことばを いつつ おぼえられました。', 'I was able to memorise five new words.', 'စကားလုံးအသစ် ငါးလုံးကို မှတ်မိအောင် လေ့လာနိုင်ခဲ့ပါတယ်။'],
        ['まだ速く話せません。', 'まだ はやく はなせません。', 'I cannot speak quickly yet.', 'စကားကို မြန်မြန် မပြောနိုင်သေးပါဘူး။'],
        ['来週の練習に来られますか。', 'らいしゅうの れんしゅうに こられますか。', 'Can you come to next week’s practice?', 'နောက်တစ်ပတ် လေ့ကျင့်ချိန်ကို လာနိုင်မလား။']
      ])
    },
    {
      id: 'n4-03-two-actions', name: 'N4 practice · 03 · Two actions at once', stage: 'N4 practice',
      noteEn: 'Remove ます and add ながら for while doing. Both actions normally have the same person doing them; the main action comes last. Contrast simultaneous actions with ～てから (after).',
      noteMy: 'ます ဖြုတ်ပြီး ながら ထည့်ရင် “လုပ်ရင်း” လို့ ဆိုလိုပါတယ်။ ပုံမှန်အားဖြင့် လုပ်ဆောင်ချက်နှစ်ခုလုံးကို လူတစ်ယောက်တည်း လုပ်ပြီး အဓိကလုပ်ဆောင်ချက်က နောက်မှာ လာပါတယ်။ ～てから နဲ့ အဓိပ္ပာယ်ကွာတာကို သတိပြုပါ။',
      cards: practiceCards([
        ['音声を聞きながら、ノートを取ります。', 'おんせいを ききながら、ノートを とります。', 'I take notes while listening to the audio.', 'အသံဖိုင်ကို နားထောင်ရင်း မှတ်စုရေးပါတယ်။'],
        ['写真を見ながら、旅行の話をします。', 'しゃしんを みながら、りょこうの はなしを します。', 'I talk about the trip while looking at photos.', 'ဓာတ်ပုံတွေ ကြည့်ရင်း ခရီးအကြောင်း ပြောပါတယ်။'],
        ['お茶を飲みながら、友達と話します。', 'おちゃを のみながら、ともだちと はなします。', 'I talk with a friend while drinking tea.', 'လက်ဖက်ရည်သောက်ရင်း သူငယ်ချင်းနဲ့ စကားပြောပါတယ်။'],
        ['歌いながら、新しい言葉を覚えます。', 'うたいながら、あたらしい ことばを おぼえます。', 'I learn new words while singing.', 'သီချင်းဆိုရင်း စကားလုံးအသစ်တွေ မှတ်သားပါတယ်။'],
        ['地図を見ながら、道を説明します。', 'ちずを みながら、みちを せつめいします。', 'I explain the route while looking at a map.', 'မြေပုံကြည့်ရင်း လမ်းကြောင်းကို ရှင်းပြပါတယ်။']
      ])
    },
    {
      id: 'n4-04-states-and-completion', name: 'N4 practice · 04 · States and completion', stage: 'N4 practice',
      noteEn: 'An intransitive verb with ～ています can describe a resulting state: 開いています. ～てしまいました can mean completion or an unintended result; context decides whether regret is involved.',
      noteMy: '自動詞 နဲ့ ～ています ကို တွဲရင် ဖြစ်ပြီးနောက် ရှိနေတဲ့အခြေအနေကို ပြောနိုင်ပါတယ်။ ～てしまいました က ပြီးဆုံးသွားတာ ဒါမှမဟုတ် မရည်ရွယ်ဘဲ ဖြစ်သွားတာကို ပြနိုင်ပါတယ်။ ဝမ်းနည်းသဘော ပါမပါက အခြေအနေပေါ် မူတည်ပါတယ်။',
      cards: practiceCards([
        ['教室の窓が開いています。', 'きょうしつの まどが あいています。', 'The classroom window is open.', 'စာသင်ခန်းရဲ့ ပြတင်းပေါက်က ဖွင့်နေပါတယ်။'],
        ['廊下の電気が消えています。', 'ろうかの でんきが きえています。', 'The light in the hallway is off.', 'စင်္ကြံက မီးပိတ်နေပါတယ်။'],
        ['この椅子は壊れています。', 'この いすは こわれています。', 'This chair is broken.', 'ဒီကုလားထိုင်က ပျက်နေပါတယ်။'],
        ['宿題を全部やってしまいました。', 'しゅくだいを ぜんぶ やってしまいました。', 'I have finished all my homework.', 'အိမ်စာအားလုံးကို လုပ်ပြီးသွားပါပြီ။'],
        ['大切なノートをなくしてしまいました。', 'たいせつな ノートを なくしてしまいました。', 'I unfortunately lost an important notebook.', 'အရေးကြီးတဲ့ မှတ်စုစာအုပ် ပျောက်သွားလို့ စိတ်မကောင်းပါဘူး။']
      ])
    },
    {
      id: 'n4-05-get-ready', name: 'N4 practice · 05 · Get ready in advance', stage: 'N4 practice',
      noteEn: '～ておきます describes doing something in preparation or leaving it ready. ～てあります describes a resulting state created intentionally. Compare an action you will take with something already prepared.',
      noteMy: '～ておきます က ကြိုတင်ပြင်ဆင်ထားတာကို ပြပါတယ်။ ～てあります က ရည်ရွယ်ချက်ရှိရှိ လုပ်ထားပြီး ကျန်ရှိနေတဲ့ အခြေအနေကို ပြပါတယ်။ ကြိုလုပ်မယ့်အရာနဲ့ လုပ်ထားပြီးသားအရာကို ခွဲပြောပါ။',
      cards: practiceCards([
        ['授業の前に、新しい言葉を調べておきます。', 'じゅぎょうの まえに、あたらしい ことばを しらべておきます。', 'I will look up the new words before class.', 'အတန်းမစခင် စကားလုံးအသစ်တွေကို ကြိုရှာထားမယ်။'],
        ['練習の前に、マイクを確認しておきます。', 'れんしゅうの まえに、マイクを かくにんしておきます。', 'I will check the microphone before practice.', 'မလေ့ကျင့်ခင် မိုက်ခရိုဖုန်းကို ကြိုစစ်ထားမယ်။'],
        ['明日のために、お弁当を作っておきます。', 'あしたの ために、おべんとうを つくっておきます。', 'I will prepare a packed lunch for tomorrow.', 'မနက်ဖြန်အတွက် ထမင်းဘူးကို ကြိုပြင်ထားမယ်။'],
        ['ノートに質問が書いてあります。', 'ノートに しつもんが かいてあります。', 'The questions have been written in the notebook.', 'မှတ်စုစာအုပ်ထဲမှာ မေးခွန်းတွေ ရေးထားပါတယ်။'],
        ['机の上に練習用のカードが並べてあります。', 'つくえの うえに れんしゅうようの カードが ならべてあります。', 'Practice cards have been arranged on the desk.', 'စားပွဲပေါ်မှာ လေ့ကျင့်ဖို့ ကတ်တွေ စီထားပါတယ်။']
      ])
    },
    {
      id: 'n4-06-plans-and-intentions', name: 'N4 practice · 06 · Plans and intentions', stage: 'N4 practice',
      noteEn: 'Dictionary form + つもりです expresses an intention; ない-form + つもりです expresses an intention not to do something. ～予定です describes a scheduled plan. ～ようと思っています expresses an intention you have been holding.',
      noteMy: 'ကြိယာမူရင်းပုံစံနဲ့ つもりです က လုပ်ဖို့ ရည်ရွယ်ထားတာပါ။ ない ပုံစံနဲ့ဆို မလုပ်ဖို့ ရည်ရွယ်တာပါ။ ～予定です က စီစဉ်ထားတဲ့အစီအစဉ်၊ ～ようと思っています က စိတ်ကူးထားတဲ့ ရည်ရွယ်ချက်ကို ပြပါတယ်။',
      cards: practiceCards([
        ['今月は毎日、音読するつもりです。', 'こんげつは まいにち、おんどくする つもりです。', 'I intend to read aloud every day this month.', 'ဒီလမှာ နေ့တိုင်း အသံထွက်ဖတ်ဖို့ ရည်ရွယ်ထားပါတယ်။'],
        ['今日は夜遅くまで勉強しないつもりです。', 'きょうは よる おそくまで べんきょうしない つもりです。', 'I intend not to study until late tonight.', 'ဒီနေ့ ညဉ့်နက်တဲ့အထိ စာမလေ့လာဖို့ ရည်ရွယ်ထားပါတယ်။'],
        ['土曜日に友達と練習する予定です。', 'どようびに ともだちと れんしゅうする よていです。', 'I am scheduled to practise with a friend on Saturday.', 'စနေနေ့မှာ သူငယ်ချင်းနဲ့ လေ့ကျင့်ဖို့ စီစဉ်ထားပါတယ်။'],
        ['来月から短い日記を書こうと思っています。', 'らいげつから みじかい にっきを かこうと おもっています。', 'I am planning to write short diary entries from next month.', 'နောက်လကစပြီး နေ့စဉ်မှတ်တမ်းတိုလေးတွေ ရေးဖို့ စိတ်ကူးထားပါတယ်။'],
        ['次の練習は午後二時の予定です。', 'つぎの れんしゅうは ごご にじの よていです。', 'The next practice is scheduled for 2 p.m.', 'နောက်လေ့ကျင့်ချိန်ကို နေ့လယ် နှစ်နာရီလို့ စီစဉ်ထားပါတယ်။']
      ])
    },
    {
      id: 'n4-07-advice-and-possibility', name: 'N4 practice · 07 · Advice and possibility', stage: 'N4 practice',
      noteEn: 'た-form + ほうがいいです gives positive advice; ない-form + ほうがいいです advises against something. ～かもしれません means might. Nouns and な-adjectives drop だ before かもしれません.',
      noteMy: 'လုပ်သင့်တယ်လို့ အကြံပေးရင် た ပုံစံ + ほうがいいです၊ မလုပ်သင့်ဘူးဆို ない ပုံစံ + ほうがいいです သုံးပါ။ ～かもしれません က “ဖြစ်နိုင်တယ်” ပါ။ နာမ်နဲ့ な နာမဝိသေသနဆို ရှေ့က だ ကို ဖြုတ်ပါ။',
      cards: practiceCards([
        ['難しい文は短く区切ったほうがいいです。', 'むずかしい ぶんは みじかく くぎった ほうが いいです。', 'It is better to split difficult sentences into short parts.', 'ခက်တဲ့ဝါကျတွေကို အပိုင်းတိုတို ခွဲတာ ပိုကောင်းပါတယ်။'],
        ['答えをすぐ見ないほうがいいです。', 'こたえを すぐ みない ほうが いいです。', 'It is better not to look at the answer straight away.', 'အဖြေကို ချက်ချင်း မကြည့်တာ ပိုကောင်းပါတယ်။'],
        ['この読み方は間違っているかもしれません。', 'この よみかたは まちがっている かもしれません。', 'This reading might be wrong.', 'ဒီဖတ်ပုံက မှားနေနိုင်ပါတယ်။'],
        ['明日は練習に少し遅れるかもしれません。', 'あしたは れんしゅうに すこし おくれる かもしれません。', 'I might be a little late for practice tomorrow.', 'မနက်ဖြန် လေ့ကျင့်ချိန်ကို နည်းနည်း နောက်ကျနိုင်ပါတယ်။'],
        ['その方法は便利かもしれません。', 'その ほうほうは べんり かもしれません。', 'That method might be useful.', 'အဲဒီနည်းလမ်းက အသုံးဝင်နိုင်ပါတယ်။']
      ])
    },
    {
      id: 'n4-08-conditions', name: 'N4 practice · 08 · Conditions and next steps', stage: 'N4 practice',
      noteEn: '～たら can mean if or when after an event. ～ば also expresses a condition, but it is not interchangeable with たら in every sentence. な-adjectives and nouns can use なら. Learn each example with its context.',
      noteMy: '～たら က “ရင်” ဒါမှမဟုတ် “လုပ်ပြီးတဲ့အခါ” လို့ ဆိုနိုင်ပါတယ်။ ～ば လည်း အခြေအနေကို ပြပေမယ့် たら နဲ့ ဝါကျတိုင်းမှာ အစားထိုးလို့ မရပါဘူး။ နာမ်နဲ့ な နာမဝိသေသနမှာ なら သုံးနိုင်ပါတယ်။',
      cards: practiceCards([
        ['授業が終わったら、図書館へ行きます。', 'じゅぎょうが おわったら、としょかんへ いきます。', 'When class is over, I will go to the library.', 'အတန်းပြီးရင် စာကြည့်တိုက် သွားမယ်။'],
        ['意味が分からなかったら、辞書で調べてください。', 'いみが わからなかったら、じしょで しらべてください。', 'If you do not understand the meaning, please look it up in a dictionary.', 'အဓိပ္ပာယ်ကို နားမလည်ရင် အဘိဓာန်မှာ ရှာကြည့်ပါ။'],
        ['時間があれば、もう一度聞きます。', 'じかんが あれば、もういちど ききます。', 'If I have time, I will listen once more.', 'အချိန်ရှိရင် နောက်တစ်ခေါက် နားထောင်မယ်။'],
        ['明日暇なら、一緒に練習しませんか。', 'あした ひまなら、いっしょに れんしゅうしませんか。', 'If you are free tomorrow, would you like to practise together?', 'မနက်ဖြန် အားရင် အတူတူ လေ့ကျင့်ကြမလား။'],
        ['毎日少し練習すれば、だんだん慣れます。', 'まいにち すこし れんしゅうすれば、だんだん なれます。', 'If you practise a little every day, you will gradually get used to it.', 'နေ့တိုင်း နည်းနည်း လေ့ကျင့်ရင် တဖြည်းဖြည်း ကျင့်သားရလာမယ်။']
      ])
    },
    {
      id: 'n4-09-goals-and-change', name: 'N4 practice · 09 · Goals and progress', stage: 'N4 practice',
      noteEn: '～ように can express a desired result, often with a potential or negative verb. ～ようになりました describes a change in ability or habit. ～ようにしています describes an effort to maintain a habit.',
      noteMy: '～ように က လိုချင်တဲ့ရလဒ်ကို ပြပြီး လုပ်နိုင်ပုံစံ ဒါမှမဟုတ် အငြင်းပုံစံနဲ့ မကြာခဏ တွဲသုံးပါတယ်။ ～ようになりました က ပြောင်းလဲလာတာ၊ ～ようにしています က အလေ့အကျင့်တစ်ခုကို ကြိုးစားထိန်းထားတာပါ။',
      cards: practiceCards([
        ['会話が聞き取れるように、短い音声で練習します。', 'かいわが ききとれるように、みじかい おんせいで れんしゅうします。', 'I practise with short recordings so that I can understand conversations by listening.', 'စကားပြောသံကို နားလည်နိုင်အောင် အသံဖိုင်တိုတွေနဲ့ လေ့ကျင့်ပါတယ်။'],
        ['新しい言葉を忘れないように、例文を書きます。', 'あたらしい ことばを わすれないように、れいぶんを かきます。', 'I write example sentences so that I do not forget new words.', 'စကားလုံးအသစ်တွေ မမေ့အောင် ဥပမာဝါကျတွေ ရေးပါတယ်။'],
        ['簡単な漢字が読めるようになりました。', 'かんたんな かんじが よめるように なりました。', 'I have become able to read simple kanji.', 'ရိုးရှင်းတဲ့ ခန်းဂျီးတွေ ဖတ်နိုင်လာပါပြီ။'],
        ['前より長く話せるようになりました。', 'まえより ながく はなせるように なりました。', 'I can now speak for longer than before.', 'အရင်ထက် ပိုကြာကြာ စကားပြောနိုင်လာပါပြီ။'],
        ['毎日、一文でも声に出すようにしています。', 'まいにち、いちぶんでも こえに だすように しています。', 'I make a point of saying at least one sentence aloud every day.', 'နေ့တိုင်း ဝါကျတစ်ကြောင်းပဲဖြစ်ဖြစ် အသံထွက်ပြောဖို့ ကြိုးစားလုပ်နေပါတယ်။']
      ])
    }
  );
})();
