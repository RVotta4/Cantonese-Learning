/* ===========================================================
   Cantonese Learning — lesson content

   Single source of truth for all lessons. To add a new lesson,
   copy one of the objects below and edit the fields. Stored as a
   JS file (not JSON) so it works online AND when opened locally.

   Each lesson can have:
     dialogue  — a short conversation (speaker / hanzi / jyutping / english)
     vocab     — key words (hanzi / jyutping / english)
     examples  — example SENTENCES that show the words in context
     notes     — short grammar / usage notes

   Jyutping tone numbers: 1 high · 2 mid-rising · 3 mid ·
   4 low-falling · 5 low-rising · 6 low.
   =========================================================== */

window.LESSONS = [
  /* ================= LEVEL 1 · ABSOLUTE BEGINNER ================= */
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
    examples: [
      { hanzi: "媽", jyutping: "maa1", english: "mother (Tone 1) — compare…" },
      { hanzi: "馬", jyutping: "maa5", english: "horse (Tone 5) — same sound, different tone!" }
    ],
    notes: [
      {
        title: "Why tones matter",
        body: "All six \"si\" examples above are the same syllable — only the pitch changes, yet each is a different word. 媽 (maa1, mother) and 馬 (maa5, horse) show the same thing. Getting the tone wrong can change your meaning entirely."
      },
      {
        title: "How to read jyutping",
        body: "Read the letters roughly like English, then apply the tone number. For example nei5 = \"nei\" said with a low-rising pitch. Don't worry about perfection — focus on hearing the difference first."
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
      { hanzi: "早晨", jyutping: "zou2 san4", english: "good morning" },
      { hanzi: "我", jyutping: "ngo5", english: "I / me" },
      { hanzi: "你", jyutping: "nei5", english: "you" },
      { hanzi: "叫", jyutping: "giu3", english: "to be called / to call" },
      { hanzi: "咩", jyutping: "me1", english: "what (colloquial)" },
      { hanzi: "名", jyutping: "meng2", english: "name" },
      { hanzi: "高興", jyutping: "gou1 hing3", english: "glad / happy" },
      { hanzi: "認識", jyutping: "jing6 sik1", english: "to know / be acquainted with" }
    ],
    examples: [
      { hanzi: "早晨！", jyutping: "zou2 san4!", english: "Good morning!" },
      { hanzi: "你好嗎？", jyutping: "nei5 hou2 maa3?", english: "How are you?" },
      { hanzi: "我好好，多謝。", jyutping: "ngo5 hou2 hou2, do1 ze6.", english: "I'm very well, thank you." },
      { hanzi: "拜拜！", jyutping: "baai1 baai3!", english: "Bye-bye!" }
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
  {
    id: "yes-no-politeness",
    level: 1,
    levelName: "Absolute Beginner",
    order: 3,
    title: "Yes, No & Being Polite",
    subtitle: "Agree, disagree, thank and apologise",
    minutes: 7,
    intro:
      "Cantonese has no single word for \"yes\" or \"no\" — you usually answer with the verb. This lesson covers that, plus the everyday polite phrases you'll use constantly.",
    dialogue: [
      { speaker: "A", hanzi: "唔好意思，你係 Robbie 嗎？", jyutping: "m4 hou2 ji3 si1, nei5 hai6 Robbie maa3?", english: "Excuse me, are you Robbie?" },
      { speaker: "B", hanzi: "係呀，我係。", jyutping: "hai6 aa3, ngo5 hai6.", english: "Yes, I am." },
      { speaker: "A", hanzi: "呢個係你嘅。", jyutping: "ni1 go3 hai6 nei5 ge3.", english: "This is yours." },
      { speaker: "B", hanzi: "多謝晒！", jyutping: "do1 ze6 saai3!", english: "Thank you so much!" }
    ],
    vocab: [
      { hanzi: "係", jyutping: "hai6", english: "to be / yes (it is)" },
      { hanzi: "唔係", jyutping: "m4 hai6", english: "not / no (it isn't)" },
      { hanzi: "好", jyutping: "hou2", english: "good / OK" },
      { hanzi: "唔該", jyutping: "m4 goi1", english: "thanks / excuse me (for service)" },
      { hanzi: "多謝", jyutping: "do1 ze6", english: "thank you (for a gift/favour)" },
      { hanzi: "對唔住", jyutping: "deoi3 m4 zyu6", english: "sorry (apology)" },
      { hanzi: "唔好意思", jyutping: "m4 hou2 ji3 si1", english: "excuse me / sorry (mild)" },
      { hanzi: "唔緊要", jyutping: "m4 gan2 jiu3", english: "it's okay / never mind" }
    ],
    examples: [
      { hanzi: "你係唔係學生呀？", jyutping: "nei5 hai6 m4 hai6 hok6 saang1 aa3?", english: "Are you a student?" },
      { hanzi: "唔係，我唔係。", jyutping: "m4 hai6, ngo5 m4 hai6.", english: "No, I'm not." },
      { hanzi: "對唔住，我遲到喇。", jyutping: "deoi3 m4 zyu6, ngo5 ci4 dou3 laa3.", english: "Sorry, I'm late." },
      { hanzi: "唔緊要！", jyutping: "m4 gan2 jiu3!", english: "No worries!" }
    ],
    notes: [
      {
        title: "There's no plain \"yes\"/\"no\"",
        body: "To answer a yes/no question, repeat the verb. 你係學生嗎？ → 係 (yes) or 唔係 (no). Add 唔 (m4) in front of a verb to make it negative."
      },
      {
        title: "唔該 vs 多謝",
        body: "唔該 (m4 goi1) = thanks for a service, or \"excuse me\". 多謝 (do1 ze6) = thanks for a gift or favour. Add 晒 (saai3) for extra warmth: 多謝晒！"
      }
    ]
  },

  /* ================= LEVEL 2 · BEGINNER ================= */
  {
    id: "where-from",
    level: 2,
    levelName: "Beginner",
    order: 1,
    title: "Where Are You From?",
    subtitle: "Nationalities and speaking languages",
    minutes: 8,
    intro:
      "A natural follow-up to introductions. Learn to say where you're from and to talk about which languages you speak.",
    dialogue: [
      { speaker: "A", hanzi: "你係邊度人呀？", jyutping: "nei5 hai6 bin1 dou6 jan4 aa3?", english: "Where are you from?" },
      { speaker: "B", hanzi: "我係美國人。你呢？", jyutping: "ngo5 hai6 mei5 gwok3 jan4. nei5 ne1?", english: "I'm American. And you?" },
      { speaker: "A", hanzi: "我係香港人。你識唔識講廣東話呀？", jyutping: "ngo5 hai6 hoeng1 gong2 jan4. nei5 sik1 m4 sik1 gong2 gwong2 dung1 waa2 aa3?", english: "I'm from Hong Kong. Can you speak Cantonese?" },
      { speaker: "B", hanzi: "識少少。", jyutping: "sik1 siu2 siu2.", english: "A little." }
    ],
    vocab: [
      { hanzi: "邊度人", jyutping: "bin1 dou6 jan4", english: "from where (which place's person)" },
      { hanzi: "人", jyutping: "jan4", english: "person" },
      { hanzi: "香港", jyutping: "hoeng1 gong2", english: "Hong Kong" },
      { hanzi: "美國", jyutping: "mei5 gwok3", english: "USA" },
      { hanzi: "英國", jyutping: "jing1 gwok3", english: "UK" },
      { hanzi: "中國", jyutping: "zung1 gwok3", english: "China" },
      { hanzi: "識", jyutping: "sik1", english: "to know how to" },
      { hanzi: "講", jyutping: "gong2", english: "to speak / say" },
      { hanzi: "廣東話", jyutping: "gwong2 dung1 waa2", english: "Cantonese (language)" },
      { hanzi: "英文", jyutping: "jing1 man2", english: "English (language)" },
      { hanzi: "少少", jyutping: "siu2 siu2", english: "a little" }
    ],
    examples: [
      { hanzi: "我係英國人。", jyutping: "ngo5 hai6 jing1 gwok3 jan4.", english: "I'm British." },
      { hanzi: "我住喺香港。", jyutping: "ngo5 zyu6 hai2 hoeng1 gong2.", english: "I live in Hong Kong." },
      { hanzi: "你識唔識講英文呀？", jyutping: "nei5 sik1 m4 sik1 gong2 jing1 man2 aa3?", english: "Can you speak English?" },
      { hanzi: "我識少少廣東話。", jyutping: "ngo5 sik1 siu2 siu2 gwong2 dung1 waa2.", english: "I know a little Cantonese." }
    ],
    notes: [
      {
        title: "係 + place + 人",
        body: "Say where you're from with 我係 + place + 人: 我係美國人 (I'm American). The country names + 人 (jan4, person) give the nationality."
      },
      {
        title: "識 (sik1) = \"know how to\"",
        body: "Put 識 before a verb to say you can do it: 識講 (can speak), 識寫 (can write). Ask with 識唔識…？"
      }
    ]
  },
  {
    id: "numbers-money",
    level: 2,
    levelName: "Beginner",
    order: 2,
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
      { hanzi: "兩", jyutping: "loeng5", english: "two (before a measure word)" }
    ],
    examples: [
      { hanzi: "兩個，唔該。", jyutping: "loeng5 go3, m4 goi1.", english: "Two (of them), please." },
      { hanzi: "總共幾多錢呀？", jyutping: "zung2 gung6 gei2 do1 cin2 aa3?", english: "How much in total?" },
      { hanzi: "一百蚊。", jyutping: "jat1 baak3 man1.", english: "One hundred dollars." }
    ],
    notes: [
      {
        title: "Building bigger numbers",
        body: "Numbers stack logically: 十一 (sap6 jat1) = 11, 二十 (ji6 sap6) = 20, 三十五 (saam1 sap6 ng5) = 35. Just say \"three-ten-five\"."
      },
      {
        title: "二 vs 兩",
        body: "Use 二 (ji6) for counting and in larger numbers, but 兩 (loeng5) for \"two of something\" before a measure word: 兩個 (two items), 兩杯 (two cups)."
      }
    ]
  },
  {
    id: "time-days",
    level: 2,
    levelName: "Beginner",
    order: 3,
    title: "Telling the Time & Days",
    subtitle: "Clock times and days of the week",
    minutes: 8,
    intro:
      "Make plans and catch your train: learn to ask the time, tell the time, and name the days of the week.",
    dialogue: [
      { speaker: "A", hanzi: "而家幾點呀？", jyutping: "ji4 gaa1 gei2 dim2 aa3?", english: "What time is it now?" },
      { speaker: "B", hanzi: "三點半。", jyutping: "saam1 dim2 bun3.", english: "Half past three." },
      { speaker: "A", hanzi: "你聽日幾點返工呀？", jyutping: "nei5 ting1 jat6 gei2 dim2 faan1 gung1 aa3?", english: "What time do you go to work tomorrow?" },
      { speaker: "B", hanzi: "九點。", jyutping: "gau2 dim2.", english: "Nine o'clock." }
    ],
    vocab: [
      { hanzi: "而家", jyutping: "ji4 gaa1", english: "now" },
      { hanzi: "幾點", jyutping: "gei2 dim2", english: "what time" },
      { hanzi: "點", jyutping: "dim2", english: "o'clock" },
      { hanzi: "半", jyutping: "bun3", english: "half (past)" },
      { hanzi: "今日", jyutping: "gam1 jat6", english: "today" },
      { hanzi: "聽日", jyutping: "ting1 jat6", english: "tomorrow" },
      { hanzi: "琴日", jyutping: "kam4 jat6", english: "yesterday" },
      { hanzi: "星期", jyutping: "sing1 kei4", english: "week / day-of-week" },
      { hanzi: "返工", jyutping: "faan1 gung1", english: "to go to work" },
      { hanzi: "返學", jyutping: "faan1 hok6", english: "to go to school" }
    ],
    examples: [
      { hanzi: "今日星期幾呀？", jyutping: "gam1 jat6 sing1 kei4 gei2 aa3?", english: "What day is it today?" },
      { hanzi: "今日星期五。", jyutping: "gam1 jat6 sing1 kei4 ng5.", english: "Today is Friday." },
      { hanzi: "我聽日唔使返工。", jyutping: "ngo5 ting1 jat6 m4 sai2 faan1 gung1.", english: "I don't have to work tomorrow." }
    ],
    notes: [
      {
        title: "Days of the week",
        body: "星期 (sing1 kei4) + a number: 星期一 = Monday, 星期二 = Tuesday … 星期六 = Saturday, and 星期日 (sing1 kei4 jat6) = Sunday."
      },
      {
        title: "Telling the time",
        body: "Use number + 點 for o'clock: 三點 (3:00). Add 半 (bun3) for half past: 三點半 (3:30)."
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
    examples: [
      { hanzi: "呢個係我媽媽。", jyutping: "ni1 go3 hai6 ngo5 maa4 maa1.", english: "This is my mum." },
      { hanzi: "我有一個哥哥。", jyutping: "ngo5 jau5 jat1 go3 go4 go1.", english: "I have one older brother." },
      { hanzi: "你有冇兄弟姊妹呀？", jyutping: "nei5 jau5 mou5 hing1 dai6 zi2 mui6 aa3?", english: "Do you have any siblings?" }
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
  },
  {
    id: "likes-hobbies",
    level: 2,
    levelName: "Beginner",
    order: 5,
    title: "Likes & Hobbies",
    subtitle: "Say what you like to do",
    minutes: 8,
    intro:
      "Talk about your free time. The key word is 鍾意 (zung1 ji3, to like), which works with both nouns and verbs.",
    dialogue: [
      { speaker: "A", hanzi: "你得閒鍾意做咩呀？", jyutping: "nei5 dak1 haan4 zung1 ji3 zou6 me1 aa3?", english: "What do you like to do in your free time?" },
      { speaker: "B", hanzi: "我鍾意睇戲同埋聽歌。", jyutping: "ngo5 zung1 ji3 tai2 hei3 tung4 maai4 teng1 go1.", english: "I like watching films and listening to music." },
      { speaker: "A", hanzi: "你鍾唔鍾意運動呀？", jyutping: "nei5 zung1 m4 zung1 ji3 wan6 dung6 aa3?", english: "Do you like sports?" },
      { speaker: "B", hanzi: "鍾意！", jyutping: "zung1 ji3!", english: "Yes (I like it)!" }
    ],
    vocab: [
      { hanzi: "鍾意", jyutping: "zung1 ji3", english: "to like" },
      { hanzi: "得閒", jyutping: "dak1 haan4", english: "free / free time" },
      { hanzi: "做", jyutping: "zou6", english: "to do" },
      { hanzi: "睇戲", jyutping: "tai2 hei3", english: "to watch a film" },
      { hanzi: "聽歌", jyutping: "teng1 go1", english: "to listen to music" },
      { hanzi: "睇書", jyutping: "tai2 syu1", english: "to read (books)" },
      { hanzi: "運動", jyutping: "wan6 dung6", english: "sport / exercise" },
      { hanzi: "行街", jyutping: "haang4 gaai1", english: "to go out / shopping stroll" }
    ],
    examples: [
      { hanzi: "我好鍾意食點心。", jyutping: "ngo5 hou2 zung1 ji3 sik6 dim2 sam1.", english: "I really like eating dim sum." },
      { hanzi: "我唔鍾意落雨。", jyutping: "ngo5 m4 zung1 ji3 lok6 jyu5.", english: "I don't like the rain." },
      { hanzi: "週末我鍾意行街。", jyutping: "zau1 mut6 ngo5 zung1 ji3 haang4 gaai1.", english: "At the weekend I like to go out shopping." }
    ],
    notes: [
      {
        title: "鍾意 + noun OR verb",
        body: "鍾意 works with a noun (我鍾意茶, I like tea) or a verb phrase (我鍾意睇戲, I like watching films). Add 好 (hou2) for \"really like\"."
      },
      {
        title: "Negative & questions",
        body: "Say 唔鍾意 (m4 zung1 ji3) for \"don't like\". Ask with the A-not-A pattern: 鍾唔鍾意…？"
      }
    ]
  },
  {
    id: "yum-cha",
    level: 2,
    levelName: "Beginner",
    order: 6,
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
    examples: [
      { hanzi: "唔該，再嚟一籠蝦餃。", jyutping: "m4 goi1, zoi3 lai4 jat1 lung4 haa1 gaau2.", english: "Please bring another basket of shrimp dumplings." },
      { hanzi: "呢度有冇叉燒包呀？", jyutping: "ni1 dou6 jau5 mou5 caa1 siu1 baau1 aa3?", english: "Do you have BBQ pork buns here?" },
      { hanzi: "唔該，埋單！", jyutping: "m4 goi1, maai4 daan1!", english: "Excuse me, the bill please!" }
    ],
    notes: [
      {
        title: "我要 (ngo5 jiu3) — \"I want\"",
        body: "The simplest way to order: 我要 + the dish. Add a measure word like 一籠 (jat1 lung4, \"one steamer basket\") for dim sum portions."
      },
      {
        title: "Asking what's available",
        body: "有冇 + dish + 呀？ asks if something is available: 有冇叉燒包呀？ (Do you have BBQ pork buns?)"
      }
    ]
  },
  {
    id: "ordering-food",
    level: 2,
    levelName: "Beginner",
    order: 7,
    title: "Ordering Food & Drinks",
    subtitle: "Order a meal at a café or restaurant",
    minutes: 9,
    intro:
      "Beyond dim sum: order a dish and a drink at a typical Hong Kong café (茶餐廳). The key phrase is 我想要 (ngo5 soeng2 jiu3, I'd like).",
    dialogue: [
      { speaker: "Waiter", hanzi: "你想要啲咩呀？", jyutping: "nei5 soeng2 jiu3 di1 me1 aa3?", english: "What would you like?" },
      { speaker: "You", hanzi: "我想要一碗叉燒飯。", jyutping: "ngo5 soeng2 jiu3 jat1 wun2 caa1 siu1 faan6.", english: "I'd like a bowl of char siu rice." },
      { speaker: "Waiter", hanzi: "飲咩呀？", jyutping: "jam2 me1 aa3?", english: "Anything to drink?" },
      { speaker: "You", hanzi: "凍奶茶，唔該。", jyutping: "dung3 naai5 caa4, m4 goi1.", english: "Iced milk tea, please." }
    ],
    vocab: [
      { hanzi: "想要", jyutping: "soeng2 jiu3", english: "would like" },
      { hanzi: "餐廳", jyutping: "caan1 teng1", english: "restaurant" },
      { hanzi: "叉燒飯", jyutping: "caa1 siu1 faan6", english: "char siu (BBQ pork) rice" },
      { hanzi: "碗", jyutping: "wun2", english: "bowl (measure word)" },
      { hanzi: "凍", jyutping: "dung3", english: "cold / iced" },
      { hanzi: "熱", jyutping: "jit6", english: "hot" },
      { hanzi: "奶茶", jyutping: "naai5 caa4", english: "milk tea" },
      { hanzi: "咖啡", jyutping: "gaa3 fe1", english: "coffee" },
      { hanzi: "水", jyutping: "seoi2", english: "water" },
      { hanzi: "好食", jyutping: "hou2 sik6", english: "delicious" }
    ],
    examples: [
      { hanzi: "我想要一杯熱咖啡。", jyutping: "ngo5 soeng2 jiu3 jat1 bui1 jit6 gaa3 fe1.", english: "I'd like a cup of hot coffee." },
      { hanzi: "唔該，一杯水。", jyutping: "m4 goi1, jat1 bui1 seoi2.", english: "A glass of water, please." },
      { hanzi: "啲嘢好好食！", jyutping: "di1 je5 hou2 hou2 sik6!", english: "The food is really delicious!" }
    ],
    notes: [
      {
        title: "想 vs 要",
        body: "想 (soeng2) = \"would like to / feel like\", softer than 要 (jiu3, want). 我想要 combines both for a polite \"I'd like\"."
      },
      {
        title: "凍 / 熱 before drinks",
        body: "Put 凍 (dung3, iced) or 熱 (jit6, hot) before a drink: 凍奶茶 (iced milk tea), 熱咖啡 (hot coffee)."
      }
    ]
  },
  {
    id: "getting-around",
    level: 2,
    levelName: "Beginner",
    order: 8,
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
    examples: [
      { hanzi: "請問洗手間喺邊度呀？", jyutping: "cing2 man6 sai2 sau2 gaan1 hai2 bin1 dou6 aa3?", english: "Where is the toilet, please?" },
      { hanzi: "我想去機場。", jyutping: "ngo5 soeng2 heoi3 gei1 coeng4.", english: "I want to go to the airport." },
      { hanzi: "直行就到。", jyutping: "zik6 haang4 zau6 dou3.", english: "Go straight and you'll be there." }
    ],
    notes: [
      {
        title: "請問 (cing2 man6) — \"may I ask\"",
        body: "A polite lead-in before a question to a stranger. Pair it with 唔該 for extra courtesy: 唔該，請問…"
      },
      {
        title: "點去 + place",
        body: "Slot any destination after 點去 to ask the way: 點去機場呀？ (dim2 heoi3 gei1 coeng4 aa3?) = \"How do I get to the airport?\""
      }
    ]
  }
];
