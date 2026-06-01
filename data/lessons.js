/* ===========================================================
   Cantonese Learning — lesson content (Phase 2)

   This is the single source of truth for all lessons. To add a
   new lesson, copy one of the objects below and edit the fields.
   Stored as a JS file (not JSON) so it works both online AND
   when you just open the HTML files locally in a browser.

   Jyutping tone numbers: 1 high · 2 mid-rising · 3 mid ·
   4 low-falling · 5 low-rising · 6 low.
   =========================================================== */

window.LESSONS = [
  /* ---------- LEVEL 1 · ABSOLUTE BEGINNER ---------- */
  {
    id: "tones-jyutping",
    level: 1,
    levelName: "Absolute Beginner",
    order: 1,
    title: "The Six Tones & Jyutping",
    subtitle: "The foundation of Cantonese pronunciation",
    minutes: 7,
    intro:
      "Cantonese is a tonal language: the same syllable means completely different things depending on its pitch. Jyutping is the romanisation system we use to write the sounds, with a number (1–6) marking the tone. Master these six and everything else gets easier.",
    dialogue: [],
    vocab: [
      { hanzi: "詩", jyutping: "si1", english: "poem — Tone 1 (high, level)" },
      { hanzi: "史", jyutping: "si2", english: "history — Tone 2 (mid, rising)" },
      { hanzi: "試", jyutping: "si3", english: "to try — Tone 3 (mid, level)" },
      { hanzi: "時", jyutping: "si4", english: "time — Tone 4 (low, falling)" },
      { hanzi: "市", jyutping: "si5", english: "market — Tone 5 (low, rising)" },
      { hanzi: "事", jyutping: "si6", english: "matter — Tone 6 (low, level)" }
    ],
    notes: [
      {
        title: "Why tones matter",
        body: "All six examples above are the syllable \"si\" — only the pitch changes, yet each is a different word. Getting the tone wrong can change your meaning entirely, so it's worth drilling these early."
      },
      {
        title: "How to read jyutping",
        body: "Read the letters roughly like English, then apply the tone number. For example nei5 = \"nei\" said with a low-rising pitch. The audio button (🔊) plays each one so you can copy it."
      }
    ]
  },
  {
    id: "greetings",
    level: 1,
    levelName: "Absolute Beginner",
    order: 2,
    title: "Greetings & Introductions",
    subtitle: "Say hello and introduce yourself",
    minutes: 6,
    intro:
      "The first things you'll ever say in Cantonese: a greeting and your name. This short dialogue covers meeting someone new.",
    dialogue: [
      { speaker: "A", hanzi: "你好！", jyutping: "nei5 hou2!", english: "Hello!" },
      { speaker: "B", hanzi: "你好！你叫咩名呀？", jyutping: "nei5 hou2! nei5 giu3 me1 meng2 aa3?", english: "Hello! What's your name?" },
      { speaker: "A", hanzi: "我叫 Robbie。你呢？", jyutping: "ngo5 giu3 Robbie. nei5 ne1?", english: "I'm called Robbie. And you?" },
      { speaker: "B", hanzi: "我叫小明。好高興認識你！", jyutping: "ngo5 giu3 siu2 ming4. hou2 gou1 hing3 jing6 sik1 nei5!", english: "I'm Siu Ming. Nice to meet you!" }
    ],
    vocab: [
      { hanzi: "你好", jyutping: "nei5 hou2", english: "hello" },
      { hanzi: "我", jyutping: "ngo5", english: "I / me" },
      { hanzi: "你", jyutping: "nei5", english: "you" },
      { hanzi: "叫", jyutping: "giu3", english: "to be called / to call" },
      { hanzi: "咩", jyutping: "me1", english: "what (colloquial)" },
      { hanzi: "名", jyutping: "meng2", english: "name" },
      { hanzi: "高興", jyutping: "gou1 hing3", english: "glad / happy" },
      { hanzi: "認識", jyutping: "jing6 sik1", english: "to know / be acquainted with" }
    ],
    notes: [
      {
        title: "Question particle 呀 (aa3)",
        body: "Cantonese often ends questions with a softening particle. 呀 (aa3) makes a question sound friendlier and less abrupt."
      },
      {
        title: "呢 (ne1) — \"and you?\"",
        body: "Add 呢 after a noun or pronoun to bounce a question back: 你呢？ (nei5 ne1?) = \"And you?\" / \"How about you?\""
      }
    ]
  },

  /* ---------- LEVEL 2 · BEGINNER ---------- */
  {
    id: "numbers-money",
    level: 2,
    levelName: "Beginner",
    order: 1,
    title: "Numbers & Money",
    subtitle: "Count to ten and ask how much things cost",
    minutes: 8,
    intro:
      "Numbers are everywhere — prices, phone numbers, addresses. Learn one to ten, then how to ask the price of something at a shop or market.",
    dialogue: [
      { speaker: "You", hanzi: "唔該，呢個幾多錢呀？", jyutping: "m4 goi1, ni1 go3 gei2 do1 cin2 aa3?", english: "Excuse me, how much is this one?" },
      { speaker: "Shopkeeper", hanzi: "三十五蚊。", jyutping: "saam1 sap6 ng5 man1.", english: "Thirty-five dollars." },
      { speaker: "You", hanzi: "好，唔該。", jyutping: "hou2, m4 goi1.", english: "Okay, thank you." }
    ],
    vocab: [
      { hanzi: "一", jyutping: "jat1", english: "one" },
      { hanzi: "二", jyutping: "ji6", english: "two" },
      { hanzi: "三", jyutping: "saam1", english: "three" },
      { hanzi: "四", jyutping: "sei3", english: "four" },
      { hanzi: "五", jyutping: "ng5", english: "five" },
      { hanzi: "六", jyutping: "luk6", english: "six" },
      { hanzi: "七", jyutping: "cat1", english: "seven" },
      { hanzi: "八", jyutping: "baat3", english: "eight" },
      { hanzi: "九", jyutping: "gau2", english: "nine" },
      { hanzi: "十", jyutping: "sap6", english: "ten" },
      { hanzi: "幾多錢", jyutping: "gei2 do1 cin2", english: "how much (money)" },
      { hanzi: "蚊", jyutping: "man1", english: "dollar (colloquial)" },
      { hanzi: "唔該", jyutping: "m4 goi1", english: "thanks / excuse me" }
    ],
    notes: [
      {
        title: "Building bigger numbers",
        body: "Numbers stack logically: 十一 (sap6 jat1) = 11, 二十 (ji6 sap6) = 20, 三十五 (saam1 sap6 ng5) = 35. Just say \"three-ten-five\"."
      },
      {
        title: "唔該 vs 多謝",
        body: "唔該 (m4 goi1) means thanks for a service or \"excuse me\" to get attention. 多謝 (do1 ze6) is thanks for a gift or favour. Use 唔該 when paying or ordering."
      }
    ]
  },
  {
    id: "yum-cha",
    level: 2,
    levelName: "Beginner",
    order: 2,
    title: "Yum Cha — Ordering Dim Sum",
    subtitle: "Order tea and your favourite dishes",
    minutes: 9,
    intro:
      "飲茶 (jam2 caa4), literally \"drink tea\", is the Hong Kong tradition of dim sum brunch. Here's how to order tea and a few classic dishes.",
    dialogue: [
      { speaker: "Waiter", hanzi: "飲咩茶呀？", jyutping: "jam2 me1 caa4 aa3?", english: "What tea would you like?" },
      { speaker: "You", hanzi: "普洱，唔該。", jyutping: "pou2 nei2, m4 goi1.", english: "Pu'er, please." },
      { speaker: "You", hanzi: "我要一籠蝦餃同埋一籠燒賣。", jyutping: "ngo5 jiu3 jat1 lung4 haa1 gaau2 tung4 maai4 jat1 lung4 siu1 maai2.", english: "I'd like a basket of shrimp dumplings and a basket of siu mai." },
      { speaker: "Waiter", hanzi: "好，等陣。", jyutping: "hou2, dang2 zan6.", english: "Okay, one moment." }
    ],
    vocab: [
      { hanzi: "飲茶", jyutping: "jam2 caa4", english: "yum cha / to drink tea" },
      { hanzi: "茶", jyutping: "caa4", english: "tea" },
      { hanzi: "我要", jyutping: "ngo5 jiu3", english: "I want / I'd like" },
      { hanzi: "蝦餃", jyutping: "haa1 gaau2", english: "shrimp dumpling" },
      { hanzi: "燒賣", jyutping: "siu1 maai2", english: "siu mai (pork dumpling)" },
      { hanzi: "叉燒包", jyutping: "caa1 siu1 baau1", english: "BBQ pork bun" },
      { hanzi: "同埋", jyutping: "tung4 maai4", english: "and / together with" },
      { hanzi: "埋單", jyutping: "maai4 daan1", english: "the bill / to pay" }
    ],
    notes: [
      {
        title: "我要 (ngo5 jiu3) — \"I want\"",
        body: "The simplest way to order: 我要 + the dish. Add a measure word like 一籠 (jat1 lung4, \"one steamer basket\") for dim sum portions."
      },
      {
        title: "Asking for the bill",
        body: "When you're done, catch the waiter's eye and say 唔該，埋單！ (m4 goi1, maai4 daan1!) — \"Excuse me, the bill please!\""
      }
    ]
  },
  {
    id: "getting-around",
    level: 2,
    levelName: "Beginner",
    order: 3,
    title: "Getting Around — The MTR",
    subtitle: "Ask for directions and take the metro",
    minutes: 8,
    intro:
      "Hong Kong's MTR is fast and easy once you can ask where to go. Learn to ask how to get somewhere and where a station is.",
    dialogue: [
      { speaker: "You", hanzi: "唔該，請問點去中環呀？", jyutping: "m4 goi1, cing2 man6 dim2 heoi3 zung1 waan4 aa3?", english: "Excuse me, how do I get to Central?" },
      { speaker: "Local", hanzi: "你可以搭地鐵。", jyutping: "nei5 ho2 ji5 daap3 dei6 tit3.", english: "You can take the MTR." },
      { speaker: "You", hanzi: "車站喺邊度呀？", jyutping: "ce1 zaam6 hai2 bin1 dou6 aa3?", english: "Where is the station?" },
      { speaker: "Local", hanzi: "前面轉左就到。", jyutping: "cin4 min6 zyun3 zo2 zau6 dou3.", english: "Turn left up ahead and you're there." }
    ],
    vocab: [
      { hanzi: "點去", jyutping: "dim2 heoi3", english: "how to get to" },
      { hanzi: "地鐵", jyutping: "dei6 tit3", english: "MTR / metro" },
      { hanzi: "搭", jyutping: "daap3", english: "to take (transport)" },
      { hanzi: "車站", jyutping: "ce1 zaam6", english: "station" },
      { hanzi: "邊度", jyutping: "bin1 dou6", english: "where" },
      { hanzi: "喺", jyutping: "hai2", english: "to be (at a place)" },
      { hanzi: "轉左", jyutping: "zyun3 zo2", english: "turn left" },
      { hanzi: "轉右", jyutping: "zyun3 jau6", english: "turn right" }
    ],
    notes: [
      {
        title: "請問 (cing2 man6) — \"may I ask\"",
        body: "A polite lead-in before a question to a stranger. Pair it with 唔該 for extra courtesy: 唔該，請問… "
      },
      {
        title: "點去 + place",
        body: "Slot any destination after 點去 to ask the way: 點去機場呀？ (dim2 heoi3 gei1 coeng4 aa3?) = \"How do I get to the airport?\""
      }
    ]
  },
  {
    id: "family",
    level: 2,
    levelName: "Beginner",
    order: 4,
    title: "Family Members",
    subtitle: "Talk about your family",
    minutes: 7,
    intro:
      "Family comes up constantly in conversation. Learn the words for close family and how to say whether you have siblings.",
    dialogue: [
      { speaker: "A", hanzi: "你屋企有幾多人呀？", jyutping: "nei5 uk1 kei2 jau5 gei2 do1 jan4 aa3?", english: "How many people are in your family?" },
      { speaker: "B", hanzi: "四個。爸爸、媽媽、一個哥哥同我。", jyutping: "sei3 go3. baa4 baa1, maa4 maa1, jat1 go3 go4 go1 tung4 ngo5.", english: "Four. Dad, mum, an older brother, and me." },
      { speaker: "A", hanzi: "你有冇妹妹呀？", jyutping: "nei5 jau5 mou5 mui6 mui2 aa3?", english: "Do you have a younger sister?" },
      { speaker: "B", hanzi: "冇。", jyutping: "mou5.", english: "No." }
    ],
    vocab: [
      { hanzi: "屋企", jyutping: "uk1 kei2", english: "home / family" },
      { hanzi: "爸爸", jyutping: "baa4 baa1", english: "dad" },
      { hanzi: "媽媽", jyutping: "maa4 maa1", english: "mum" },
      { hanzi: "哥哥", jyutping: "go4 go1", english: "older brother" },
      { hanzi: "姐姐", jyutping: "ze4 ze1", english: "older sister" },
      { hanzi: "弟弟", jyutping: "dai4 dai2", english: "younger brother" },
      { hanzi: "妹妹", jyutping: "mui6 mui2", english: "younger sister" },
      { hanzi: "有冇", jyutping: "jau5 mou5", english: "do you have (or not)" }
    ],
    notes: [
      {
        title: "Older vs younger siblings",
        body: "Cantonese distinguishes age: 哥哥/姐姐 are older brother/sister, 弟弟/妹妹 are younger. There's no single word for just \"brother\" or \"sister\"."
      },
      {
        title: "有冇 (jau5 mou5) — yes/no questions",
        body: "\"Have-not-have\" is a common way to ask yes/no questions: 你有冇… ? Answer 有 (jau5, yes) or 冇 (mou5, no)."
      }
    ]
  }
];
