'use strict';
(() => {
  const locales = ['en', 'my', 'ko', 'vi', 'zh'];
  const names = { en: 'English', my: 'မြန်မာ', ko: '한국어', vi: 'Tiếng Việt', zh: '简体中文' };
  const catalog = Object.create(null);
  const sourceNodes = new WeakMap();
  const trackedNodes = new Set();
  let locale = 'en';
  try { locale = locales.includes(localStorage.getItem('nihongo-language')) ? localStorage.getItem('nihongo-language') : 'en'; } catch {}
  const interpolate = (value, params = {}) => String(value).replace(/\{(\w+)\}/g, (_, key) => String(params[key] ?? `{${key}}`));
  function add(key, my, ko, vi, zh) { catalog[key] = { my, ko, vi, zh }; }
  const pairs = [
    ['ENGLISH + မြန်မာ','အင်္ဂလိပ် + မြန်မာ','영어 + 한국어','Tiếng Anh + tiếng Việt','英语 + 中文'],['Your voice. Your pace. One lesson at a time.','သင့်အသံ၊ သင့်အရှိန်။ တစ်ခန်းစီ လေ့လာပါ။','나만의 목소리와 속도로 한 번에 한 레슨씩.','Giọng của bạn, nhịp độ của bạn. Mỗi lần một bài.','用你的声音和节奏，一次练习一课。'],['နားထောင်၊ လိုက်ပြော၊ အသံသွင်းပြီး ပြန်နားထောင်ပါ။','နားထောင်၊ လိုက်ပြော၊ အသံသွင်းပြီး ပြန်နားထောင်ပါ။','듣고 따라 말하고 녹음해 다시 들어 보세요.','Nghe, nói theo, ghi âm và nghe lại.','听、跟读、录音，再听一遍。'],['၆ လ ရည်မှန်းချက်','၆ လ ရည်မှန်းချက်','6개월 목표','MỤC TIÊU 6 THÁNG','六个月目标'],['Listen & speak','နားထောင်၊ ပြောဆို','듣고 말하기','Nghe và nói','听与说'],['Kana library','အက္ခရာများ','가나 도서관','Thư viện kana','假名库'],['My study plan','လေ့လာမှု အစီအစဉ်','나의 학습 계획','Kế hoạch học tập','我的学习计划'],['Learning resources','လေ့လာရန် အရင်းအမြစ်များ','학습 자료','Tài nguyên học tập','学习资源'],['My profile','ကိုယ်ပိုင်မှတ်တမ်း','내 프로필','Hồ sơ của tôi','我的资料'],['YOUR PRACTICE ROOM','သင့်လေ့ကျင့်ခန်းခန်း','나의 연습 공간','PHÒNG LUYỆN TẬP','练习空间'],['YOUR 6-MONTH GOAL','၆ လ ရည်မှန်းချက်','6개월 목표','MỤC TIÊU 6 THÁNG','六个月目标'],['A little practice, every day.','နေ့တိုင်း နည်းနည်းစီ လေ့ကျင့်ပါ။','매일 조금씩 연습하세요.','Mỗi ngày luyện tập một chút.','每天练习一点。'],['Made by Charles','Charles ဖန်တီးသည်','Charles 제작','Được tạo bởi Charles','Charles 制作'],['Listen / နားထောင်','နားထောင်','듣기','Nghe','听'],['Speak / ပြောဆို','ပြောဆို','말하기','Nói','说'],['Choose a lesson','သင်ခန်းစာ ရွေးပါ','레슨 선택','Chọn bài học','选择课程'],['Speed','အမြန်နှုန်း','속도','Tốc độ','速度'],['Voice settings / အသံ ရွေးမယ်','အသံ ရွေးမယ်','음성 설정','Cài đặt giọng nói','语音设置'],['Japanese voice','ဂျပန်အသံ','일본어 음성','Giọng Nhật','日语语音'],['Listen first. What do you hear?','အရင်နားထောင်ပြီး ဘာကြားလဲ။','먼저 들어 보세요. 무엇이 들리나요?','Hãy nghe trước. Bạn nghe thấy gì?','先听听。你听到了什么？'],['Listen, then choose below.','နားထောင်ပြီး အောက်ကနေ ရွေးပါ။','듣고 아래에서 고르세요.','Nghe rồi chọn bên dưới.','听后从下面选择。'],['Listen, then say it yourself.','နားထောင်ပြီး ကိုယ်တိုင်ပြောပါ။','듣고 직접 말해 보세요.','Nghe rồi tự nói lại.','听后自己说出来。'],['Read it. Listen again. Make it familiar.','ဖတ်ပြီး ထပ်နားထောင်ကာ ရင်းနှီးအောင် လေ့ကျင့်ပါ။','읽고 다시 들어 익숙하게 하세요.','Đọc, nghe lại và làm quen với câu.','读一读，再听一遍，熟悉它。'],['Which one did you hear?','ဘာကြားလိုက်လဲ။','어느 것을 들었나요?','Bạn nghe thấy từ nào?','你听到的是哪一个？'],['Show answer / အဖြေကြည့်မယ်','အဖြေကြည့်မယ်','정답 보기','Xem đáp án','查看答案'],['Correct! Now try saying it.','မှန်ပါတယ်။ အခု ပြောကြည့်ပါ။','정답입니다! 이제 말해 보세요.','Đúng rồi! Bây giờ hãy nói thử.','答对了！现在试着说出来。'],['Listen again and try another.','ထပ်နားထောင်ပြီး ပြန်ရွေးပါ။','다시 듣고 다른 것을 골라 보세요.','Nghe lại và thử đáp án khác.','再听一次，试试另一个。'],['I practised this','လေ့ကျင့်ပြီးပြီ','연습 완료','Tôi đã luyện tập','我练习过了'],['Practised ✓','လေ့ကျင့်ပြီးပြီ ✓','연습 완료 ✓','Đã luyện tập ✓','已练习 ✓'],['Previous','အရင်','이전','Trước','上一张'],['Next card →','နောက်ကတ် →','다음 카드 →','Thẻ tiếp theo →','下一张卡片 →'],['Start again ↺','အစမှ ပြန်စမယ် ↺','처음부터 다시 ↺','Bắt đầu lại ↺','重新开始 ↺'],['Record my voice','ကိုယ့်အသံ အသံသွင်းမယ်','내 목소리 녹음','Ghi âm giọng của tôi','录下我的声音'],['Save your progress','တိုးတက်မှု သိမ်းမယ်','학습 진도 저장','Lưu tiến độ','保存学习进度'],['Sign in','ဝင်မယ်','로그인','Đăng nhập','登录'],['My account','အကောင့်','내 계정','Tài khoản của tôi','我的账户'],['Create account','အကောင့်ဖွင့်မယ်','အကောင့်ဖွင့်မယ်','Tạo tài khoản','创建账户'],['Forgot password?','စကားဝှက် မေ့နေပါသလား။','비밀번호를 잊으셨나요?','Quên mật khẩu?','忘记密码？'],['Email','အီးမေးလ်','이메일','Email','电子邮件'],['Password','စကားဝှက်','비밀번호','Mật khẩu','密码'],['View profile & history','ပရိုဖိုင်နှင့် မှတ်တမ်းကြည့်မယ်','프로필 및 기록 보기','Xem hồ sơ và lịch sử','查看资料和记录'],['Sign out','ထွက်မယ်','로그아웃','Đăng xuất','退出登录'],['Guest practice • saved on this device only','ဧည့်သည်လေ့ကျင့်မှု • ဒီစက်မှာပဲ သိမ်းမယ်','게스트 연습 • 이 기기에만 저장','Luyện tập khách • chỉ lưu trên thiết bị này','访客练习 • 仅保存在此设备'],['Retry sync','ပြန်ချိတ်မယ်','동기화 재시도','Thử đồng bộ lại','重试同步'],['All lessons','သင်ခန်းစာအားလုံး','모든 레슨','Tất cả bài học','所有课程'],['Start lesson','သင်ခန်းစာ စမယ်','레슨 시작','Bắt đầu bài học','开始课程'],['Continue lesson','ဆက်လေ့လာမယ်','레슨 계속하기','Tiếp tục bài học','继续课程'],['cards saved','ကတ်များ သိမ်းပြီး','장의 카드 저장','thẻ đã lưu','张卡片已保存'],['Practise again','ပြန်လေ့ကျင့်မယ်','다시 연습','Luyện lại','再次练习'],['Your name','သင့်အမည်','이름','Tên của bạn','你的姓名'],['Save profile','ပရိုဖိုင် သိမ်းမယ်','프로필 저장','Lưu hồ sơ','保存资料'],['Profile saved.','ပရိုဖိုင် သိမ်းပြီးပါပြီ။','프로필이 저장되었습니다.','Đã lưu hồ sơ.','资料已保存。'],['Light mode','အလင်းမုဒ်','라이트 모드','Chế độ sáng','浅色模式'],['Dark mode','အမှောင်မုဒ်','다크 모드','Chế độ tối','深色模式'],['Language','ဘာသာစကား','언어','Ngôn ngữ','语言'],['Japanese','ဂျပန်','일본어','Tiếng Nhật','日语']
  ];
  pairs.forEach(row => add(...row));
  function t(key, params = {}) { const item = catalog[key]; return interpolate(locale === 'en' ? key : (item?.[locale] || key), params); }
  function setText(node, key, params = {}) { if (!node) return; sourceNodes.set(node, [key, params]); trackedNodes.add(node); node.textContent = t(key, params); }
  function translate(root = document) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = []; while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      const parent = node.parentElement; if (!parent || parent.closest('script,style,[lang="ja"],input,textarea,select,option')) return;
      const raw = node.nodeValue, key = raw.trim(); if (!key || !catalog[key]) return;
      const leading = raw.match(/^\s*/)?.[0] || '', trailing = raw.match(/\s*$/)?.[0] || '';
      sourceNodes.set(node, [key, {}]); trackedNodes.add(node); node.nodeValue = leading + t(key) + trailing;
    });
  }
  function refresh(root = document) {
    trackedNodes.forEach(node => { const pair = sourceNodes.get(node); if (!pair) return; if (node.nodeType === 3) node.nodeValue = t(pair[0], pair[1]); else node.textContent = t(pair[0], pair[1]); });
    document.querySelectorAll('[lang="my"]').forEach(node => { node.hidden = locale !== 'my'; });
    translate(root); document.querySelectorAll('[data-i18n]').forEach(node => setText(node, node.dataset.i18n));
  }
  function choose(next) {
    if (!locales.includes(next)) return;
    locale = next; try { localStorage.setItem('nihongo-language', locale); } catch {}
    document.documentElement.lang = locale === 'my' ? 'my' : locale;
    refresh(); window.dispatchEvent(new CustomEvent('languagechange', { detail: locale })); window.NihongoTheme?.refreshButtons();
    document.querySelectorAll('.language-option').forEach(button => button.setAttribute('aria-pressed', button.dataset.language === locale));
    const label = document.getElementById('language-current'); if (label) label.textContent = names[locale];
  }
  window.NihongoI18n = { locales, names, register(values) { Object.keys(values || {}).forEach(key => { catalog[key] = {...catalog[key], ...values[key]}; }); }, t, setText, translate, refresh, choose, get: () => locale, lessonName: lesson => lesson.name, meaning: card => card.en, note: lesson => lesson.noteEn || '', reading: card => card.reading };
  window.addEventListener('languagechange', () => refresh());
  document.addEventListener('DOMContentLoaded', () => {
    refresh(); choose(locale);
    const toggle = document.getElementById('language-button'), menu = document.getElementById('language-menu');
    if (toggle && menu) {
      const close = () => { menu.hidden = true; toggle.setAttribute('aria-expanded', 'false'); };
      toggle.addEventListener('click', () => { menu.hidden = !menu.hidden; toggle.setAttribute('aria-expanded', String(!menu.hidden)); });
      menu.querySelectorAll('.language-option').forEach(button => button.addEventListener('click', () => { choose(button.dataset.language); close(); }));
      document.addEventListener('click', event => { if (!event.target.closest('.language-control')) close(); });
      document.addEventListener('keydown', event => { if (event.key === 'Escape') close(); });
    }
  });
})();
