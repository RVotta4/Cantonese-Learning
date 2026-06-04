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
  },
  {
    id: "pronouns-basics",
    level: 1,
    levelName: "Absolute Beginner",
    order: 4,
    title: "Pronouns: I, You, We",
    subtitle: "我 / 你 / 佢 and their plurals with 哋",
    minutes: 5,
    intro: "Master these six pronouns and you can talk about anyone — add 哋 to make any of them plural.",
    dialogue: [
      { speaker: "A", hanzi: "佢係邊個呀？", jyutping: "keoi5 hai6 bin1 go3 aa3?", english: "Who's that?" },
      { speaker: "B", hanzi: "佢係我朋友。", jyutping: "keoi5 hai6 ngo5 pang4 jau5.", english: "He's my friend." },
      { speaker: "A", hanzi: "你哋係唔係學生呀？", jyutping: "nei5 dei6 hai6 m4 hai6 hok6 saang1 aa3?", english: "Are you two students?" },
      { speaker: "B", hanzi: "係，我哋都係學生。", jyutping: "hai6, ngo5 dei6 dou1 hai6 hok6 saang1.", english: "Yes, we're both students." }
    ],
    vocab: [
      { hanzi: "我", jyutping: "ngo5", english: "I, me" },
      { hanzi: "你", jyutping: "nei5", english: "you (singular)" },
      { hanzi: "佢", jyutping: "keoi5", english: "he, she, it" },
      { hanzi: "我哋", jyutping: "ngo5 dei6", english: "we, us" },
      { hanzi: "你哋", jyutping: "nei5 dei6", english: "you (plural)" },
      { hanzi: "佢哋", jyutping: "keoi5 dei6", english: "they, them" }
    ],
    examples: [
      { hanzi: "我係學生。", jyutping: "ngo5 hai6 hok6 saang1.", english: "I am a student." },
      { hanzi: "佢係香港人。", jyutping: "keoi5 hai6 hoeng1 gong2 jan4.", english: "He is from Hong Kong." },
      { hanzi: "我哋鍾意飲茶。", jyutping: "ngo5 dei6 zung1 ji3 jam2 caa4.", english: "We like going for dim sum." }
    ],
    notes: [
      {
        title: "Plurals with 哋 (dei6)",
        body: "Add 哋 after a pronoun to make it plural: 我 (I) becomes 我哋 (we), 你 (you) becomes 你哋, and 佢 (he/she) becomes 佢哋 (they). The pronoun itself never changes — you just add 哋."
      },
      {
        title: "Yes/no questions with 係唔係",
        body: "To ask a yes/no question, say the verb in its positive-negative form: 你係唔係學生呀？ is literally \"you are-not-are student?\" Answer 係 (yes) or 唔係 (no)."
      },
      {
        title: "Culture — one word for he, she and it",
        body: "Spoken Cantonese doesn't mark gender on pronouns: 佢 (keoi5) covers he, she and it. Listeners rely on context, so you never have to choose a gender as you speak."
      }
    ]
  },
  {
    id: "question-words",
    level: 1,
    levelName: "Absolute Beginner",
    order: 5,
    title: "Question Words",
    subtitle: "what / who / where / when / how",
    minutes: 5,
    intro: "These five question words let you ask about almost anything in everyday conversation.",
    dialogue: [
      { speaker: "A", hanzi: "你聽日做咩呀？", jyutping: "nei5 ting1 jat6 zou6 me1 aa3?", english: "What are you doing tomorrow?" },
      { speaker: "B", hanzi: "去飲茶。你想去邊度呀？", jyutping: "heoi3 jam2 caa4. nei5 soeng2 heoi3 bin1 dou6 aa3?", english: "Going for dim sum. Where do you want to go?" },
      { speaker: "A", hanzi: "邊度都得。不過點去呀？", jyutping: "bin1 dou6 dou1 dak1. bat1 gwo3 dim2 heoi3 aa3?", english: "Anywhere's fine. But how do we get there?" },
      { speaker: "B", hanzi: "搭地鐵啦。我哋約邊個呀？", jyutping: "daap3 dei6 tit3 laa1. ngo5 dei6 joek3 bin1 go3 aa3?", english: "Take the MTR. Who should we invite?" },
      { speaker: "A", hanzi: "約Amy。佢幾時得閒呀？", jyutping: "joek3 Amy. keoi5 gei2 si4 dak1 haan4 aa3?", english: "Invite Amy. When is she free?" }
    ],
    vocab: [
      { hanzi: "咩", jyutping: "me1", english: "what" },
      { hanzi: "邊個", jyutping: "bin1 go3", english: "who, which one" },
      { hanzi: "邊度", jyutping: "bin1 dou6", english: "where" },
      { hanzi: "幾時", jyutping: "gei2 si4", english: "when" },
      { hanzi: "點", jyutping: "dim2", english: "how" },
      { hanzi: "呀", jyutping: "aa3", english: "(question particle)" }
    ],
    examples: [
      { hanzi: "你叫咩名呀？", jyutping: "nei5 giu3 me1 meng2 aa3?", english: "What is your name?" },
      { hanzi: "佢係邊個呀？", jyutping: "keoi5 hai6 bin1 go3 aa3?", english: "Who is he?" },
      { hanzi: "廁所喺邊度呀？", jyutping: "ci3 so2 hai2 bin1 dou6 aa3?", english: "Where is the toilet?" }
    ],
    notes: [
      {
        title: "Question words stay in place",
        body: "Cantonese doesn't move the question word to the front like English. 你叫咩名呀？ is literally \"you call what name?\" — 咩 / 邊個 / 邊度 sits exactly where the answer will go."
      },
      {
        title: "End questions with 呀 (aa3)",
        body: "Adding the particle 呀 to the end of a question makes it sound natural and friendly: 幾時呀？ (when?), 邊個呀？ (who?). Without it, a bare question word can sound abrupt."
      },
      {
        title: "Culture — 得閒飲茶 (dak1 haan4 jam2 caa4)",
        body: "Literally \"free, drink tea\" — a warm, everyday way to say \"let's catch up sometime.\" Like \"let's grab a coffee,\" it's often said in passing rather than as a firm plan."
      }
    ]
  },
  {
    id: "to-have",
    level: 1,
    levelName: "Absolute Beginner",
    order: 6,
    title: "To Have — 有 & 冇",
    subtitle: "有 (have) and 冇 (not have)",
    minutes: 5,
    intro: "有 means \"have\" and its opposite 冇 means \"not have\" — note Cantonese uses 冇, not 唔有.",
    dialogue: [
      { speaker: "A", hanzi: "你今個週末有冇時間呀？", jyutping: "nei5 gam1 go3 zau1 mut6 jau5 mou5 si4 gaan3 aa3?", english: "Do you have time this weekend?" },
      { speaker: "B", hanzi: "有呀，做咩呀？", jyutping: "jau5 aa3, zou6 me1 aa3?", english: "Yeah, what's up?" },
      { speaker: "A", hanzi: "我想去買嘢，不過我冇車。", jyutping: "ngo5 soeng2 heoi3 maai5 je5, bat1 gwo3 ngo5 mou5 ce1.", english: "I want to go shopping, but I don't have a car." },
      { speaker: "B", hanzi: "冇問題，我有車，我載你。", jyutping: "mou5 man6 tai4, ngo5 jau5 ce1, ngo5 zoi3 nei5.", english: "No problem, I've got a car — I'll give you a lift." }
    ],
    vocab: [
      { hanzi: "有", jyutping: "jau5", english: "to have, there is" },
      { hanzi: "冇", jyutping: "mou5", english: "to not have, there isn't" },
      { hanzi: "錢", jyutping: "cin2", english: "money" },
      { hanzi: "時間", jyutping: "si4 gaan3", english: "time" },
      { hanzi: "車", jyutping: "ce1", english: "car" },
      { hanzi: "冇問題", jyutping: "mou5 man6 tai4", english: "no problem" }
    ],
    examples: [
      { hanzi: "我有錢。", jyutping: "ngo5 jau5 cin2.", english: "I have money." },
      { hanzi: "我冇時間。", jyutping: "ngo5 mou5 si4 gaan3.", english: "I don't have time." },
      { hanzi: "你有冇車呀？", jyutping: "nei5 jau5 mou5 ce1 aa3?", english: "Do you have a car?" }
    ],
    notes: [
      {
        title: "冇 is the opposite of 有 — never 唔有",
        body: "Cantonese has a dedicated negative for \"have\": 冇 (mou5). To say you don't have something you use 冇, never 唔有. So 有錢 (have money) becomes 冇錢 (no money)."
      },
      {
        title: "Yes/no questions with 有冇",
        body: "Ask \"do you have…?\" by saying 有冇 + the thing: 你有冇車呀？ Answer 有 (yes) or 冇 (no). It's the same positive-negative pattern as 係唔係."
      },
      {
        title: "嘢 (je5) — \"stuff\"",
        body: "嘢 is the all-purpose word for \"things\" and builds everyday verbs: 買嘢 (shop), 食嘢 (eat), 飲嘢 (have a drink). 買嘢 literally means \"buy stuff.\""
      }
    ]
  },
  {
    id: "this-that",
    level: 1,
    levelName: "Absolute Beginner",
    order: 7,
    title: "This, That & 個",
    subtitle: "呢個 / 嗰個 / 邊個 and the classifier 個",
    minutes: 5,
    intro: "呢 (this) and 嗰 (that) plus the classifier 個 let you point at things — 呢個 (this one), 嗰個 (that one).",
    dialogue: [
      { speaker: "A", hanzi: "呢個幾錢呀？", jyutping: "ni1 go3 gei2 cin2 aa3?", english: "How much is this one?" },
      { speaker: "B", hanzi: "呢個八十蚊。", jyutping: "ni1 go3 baat3 sap6 man1.", english: "This one is eighty dollars." },
      { speaker: "A", hanzi: "嗰個呢？", jyutping: "go2 go3 ne1?", english: "And that one?" },
      { speaker: "B", hanzi: "嗰個平啲，五十蚊。你要邊個呀？", jyutping: "go2 go3 peng4 di1, ng5 sap6 man1. nei5 jiu3 bin1 go3 aa3?", english: "That one's a bit cheaper, fifty dollars. Which one do you want?" },
      { speaker: "A", hanzi: "我要呢個。", jyutping: "ngo5 jiu3 ni1 go3.", english: "I'll take this one." }
    ],
    vocab: [
      { hanzi: "呢", jyutping: "ni1", english: "this" },
      { hanzi: "嗰", jyutping: "go2", english: "that" },
      { hanzi: "個", jyutping: "go3", english: "(classifier for things/people)" },
      { hanzi: "呢個", jyutping: "ni1 go3", english: "this one" },
      { hanzi: "嗰個", jyutping: "go2 go3", english: "that one" },
      { hanzi: "邊個", jyutping: "bin1 go3", english: "which one" }
    ],
    examples: [
      { hanzi: "呢個幾錢呀？", jyutping: "ni1 go3 gei2 cin2 aa3?", english: "How much is this one?" },
      { hanzi: "我要嗰個。", jyutping: "ngo5 jiu3 go2 go3.", english: "I want that one." },
      { hanzi: "你要邊個呀？", jyutping: "nei5 jiu3 bin1 go3 aa3?", english: "Which one do you want?" }
    ],
    notes: [
      {
        title: "Point with 個, not just 呢 / 嗰",
        body: "When you single out one item you add the classifier 個: say 呢個 (this one) or 嗰個 (that one), not 呢 / 嗰 alone. 個 is the catch-all classifier for most things and people."
      },
      {
        title: "呢 (near) vs 嗰 (far)",
        body: "呢 (ni1) points to what's near you — \"this\"; 嗰 (go2) points further away — \"that.\" Pair either with 個 to get 呢個 / 嗰個, and ask 邊個 (which one)."
      },
      {
        title: "Culture — 蚊 (man1) means \"bucks\"",
        body: "In everyday speech Hongkongers count money in 蚊 — the same character as \"mosquito\" — rather than the formal 元. 五十蚊 = fifty dollars."
      }
    ]
  },
  {
    id: "colours",
    level: 2,
    levelName: "Beginner",
    order: 9,
    title: "Colours",
    subtitle: "Name the basic colours",
    minutes: 5,
    intro: "Colours come up everywhere — clothes, food, directions. Here are the everyday ones.",
    dialogue: [
      { speaker: "A", hanzi: "你鍾意咩顏色呀？", jyutping: "nei5 zung1 ji3 me1 ngaan4 sik1 aa3?", english: "What colour do you like?" },
      { speaker: "B", hanzi: "我鍾意藍色同綠色。你呢？", jyutping: "ngo5 zung1 ji3 laam4 sik1 tung4 luk6 sik1. nei5 ne1?", english: "I like blue and green. And you?" },
      { speaker: "A", hanzi: "我最鍾意紅色。", jyutping: "ngo5 zeoi3 zung1 ji3 hung4 sik1.", english: "I like red the most." },
      { speaker: "B", hanzi: "紅色好靚呀！", jyutping: "hung4 sik1 hou2 leng3 aa3!", english: "Red is really pretty!" }
    ],
    vocab: [
      { hanzi: "顏色", jyutping: "ngaan4 sik1", english: "colour" },
      { hanzi: "紅色", jyutping: "hung4 sik1", english: "red" },
      { hanzi: "藍色", jyutping: "laam4 sik1", english: "blue" },
      { hanzi: "黃色", jyutping: "wong4 sik1", english: "yellow" },
      { hanzi: "綠色", jyutping: "luk6 sik1", english: "green" },
      { hanzi: "黑色", jyutping: "hak1 sik1", english: "black" },
      { hanzi: "白色", jyutping: "baak6 sik1", english: "white" }
    ],
    examples: [
      { hanzi: "我鍾意紅色。", jyutping: "ngo5 zung1 ji3 hung4 sik1.", english: "I like red." },
      { hanzi: "呢件衫係咩顏色呀？", jyutping: "ni1 gin6 saam1 hai6 me1 ngaan4 sik1 aa3?", english: "What colour is this shirt?" },
      { hanzi: "天係藍色。", jyutping: "tin1 hai6 laam4 sik1.", english: "The sky is blue." }
    ],
    notes: [
      {
        title: "Colour = base word + 色 (sik1)",
        body: "Most colour names are a base word plus 色 (sik1, \"colour\"): 紅 (red) → 紅色, 藍 (blue) → 藍色, 黑 (black) → 黑色. Using the full …色 form is always safe."
      },
      {
        title: "同 (tung4) — \"and\"",
        body: "Join two things with 同 (tung4): 藍色同綠色 = \"blue and green\". 同 links nouns; it isn't used to join whole sentences."
      },
      {
        title: "Culture — red for luck, white for mourning",
        body: "In Cantonese culture 紅色 (red) means luck and joy — it's the colour of lai-see (lucky money) packets and weddings. 白色 (white) is linked to funerals, so it's avoided for gifts and celebrations."
      }
    ]
  },
  {
    id: "months-dates",
    level: 2,
    levelName: "Beginner",
    order: 10,
    title: "Months & Dates",
    subtitle: "Months, 號 for dates, and this/next month",
    minutes: 6,
    intro: "Cantonese months are just a number plus 月, and you give a date with the number plus 號.",
    dialogue: [
      { speaker: "A", hanzi: "你幾時生日呀？", jyutping: "nei5 gei2 si4 saang1 jat6 aa3?", english: "When's your birthday?" },
      { speaker: "B", hanzi: "下個月五號。", jyutping: "haa6 go3 jyut6 ng5 hou6.", english: "The 5th of next month." },
      { speaker: "A", hanzi: "咁啱！我都係下個月生日。", jyutping: "gam2 ngaam1! ngo5 dou1 hai6 haa6 go3 jyut6 saang1 jat6.", english: "What a coincidence! My birthday's next month too." },
      { speaker: "B", hanzi: "真係？幾號呀？", jyutping: "zan1 hai6? gei2 hou6 aa3?", english: "Really? What date?" },
      { speaker: "A", hanzi: "二十號。我哋一齊慶祝啦！", jyutping: "ji6 sap6 hou6. ngo5 dei6 jat1 cai4 hing3 zuk1 laa1!", english: "The 20th. Let's celebrate together!" }
    ],
    vocab: [
      { hanzi: "月", jyutping: "jyut6", english: "month" },
      { hanzi: "一月", jyutping: "jat1 jyut6", english: "January" },
      { hanzi: "十二月", jyutping: "sap6 ji6 jyut6", english: "December" },
      { hanzi: "號", jyutping: "hou6", english: "date (day of month)" },
      { hanzi: "今個月", jyutping: "gam1 go3 jyut6", english: "this month" },
      { hanzi: "下個月", jyutping: "haa6 go3 jyut6", english: "next month" }
    ],
    examples: [
      { hanzi: "今日係五月三號。", jyutping: "gam1 jat6 hai6 ng5 jyut6 saam1 hou6.", english: "Today is the 3rd of May." },
      { hanzi: "我下個月去旅行。", jyutping: "ngo5 haa6 go3 jyut6 heoi3 leoi5 hang4.", english: "I'm travelling next month." },
      { hanzi: "你幾時生日呀？", jyutping: "nei5 gei2 si4 saang1 jat6 aa3?", english: "When is your birthday?" }
    ],
    notes: [
      {
        title: "Months = number + 月",
        body: "Cantonese month names are just a number plus 月 (jyut6): 一月 (January), 二月 (February), all the way to 十二月 (December). There's nothing extra to memorize."
      },
      {
        title: "Dates = number + 號",
        body: "Give the day of the month with 號 (hou6): 五號 (the 5th), 二十號 (the 20th). A full date puts month before day: 三月五號 = March 5th."
      },
      {
        title: "Culture — two calendars in Hong Kong",
        body: "HK runs on the solar (Gregorian) calendar for daily life and the lunar calendar for festivals. Some people, especially older generations, also mark their birthday by the lunar date."
      }
    ]
  },
  {
    id: "weather",
    level: 2,
    levelName: "Beginner",
    order: 11,
    title: "Weather",
    subtitle: "天氣 / 熱 / 凍 / 落雨 / 天晴",
    minutes: 5,
    intro: "Hong Kong weather swings from hot to rainy — here are the words to describe it.",
    dialogue: [
      { speaker: "A", hanzi: "今日天氣點呀？", jyutping: "gam1 jat6 tin1 hei3 dim2 aa3?", english: "How's the weather today?" },
      { speaker: "B", hanzi: "好熱！不過出面落雨。", jyutping: "hou2 jit6! bat1 gwo3 ceot1 min6 lok6 jyu5.", english: "Very hot! But it's raining outside." },
      { speaker: "A", hanzi: "咁聽日呢？", jyutping: "gam2 ting1 jat6 ne1?", english: "Then what about tomorrow?" },
      { speaker: "B", hanzi: "聽日天晴，冇咁熱。", jyutping: "ting1 jat6 tin1 cing4, mou5 gam3 jit6.", english: "Tomorrow it's sunny, not as hot." }
    ],
    vocab: [
      { hanzi: "天氣", jyutping: "tin1 hei3", english: "weather" },
      { hanzi: "熱", jyutping: "jit6", english: "hot" },
      { hanzi: "凍", jyutping: "dung3", english: "cold" },
      { hanzi: "落雨", jyutping: "lok6 jyu5", english: "to rain" },
      { hanzi: "天晴", jyutping: "tin1 cing4", english: "sunny, clear sky" },
      { hanzi: "好", jyutping: "hou2", english: "very" }
    ],
    examples: [
      { hanzi: "今日好熱。", jyutping: "gam1 jat6 hou2 jit6.", english: "It's very hot today." },
      { hanzi: "出面落雨。", jyutping: "ceot1 min6 lok6 jyu5.", english: "It's raining outside." },
      { hanzi: "今日天氣好好。", jyutping: "gam1 jat6 tin1 hei3 hou2 hou2.", english: "The weather is very good today." }
    ],
    notes: [
      {
        title: "好 (hou2) = \"very\"",
        body: "Before an adjective, 好 means \"very\", not \"good\": 好熱 = \"very hot\", 好凍 = \"very cold\". So 今日好熱 is \"it's very hot today\"."
      },
      {
        title: "冇咁 (mou5 gam3) — \"not as…\"",
        body: "冇咁 + adjective means \"not as / not so …\": 冇咁熱 = \"not as hot\", 冇咁凍 = \"not as cold\". 冇 (mou5) is the everyday Cantonese word for \"not have / there isn't\"."
      },
      {
        title: "Culture — typhoons and the T8 signal",
        body: "Hong Kong summers bring typhoons. When the Observatory hoists the T8 signal (八號風球, baat3 hou6 fung1 kau4), schools and offices close — locals call an unexpected day off a \"typhoon holiday\"."
      }
    ]
  },
  {
    id: "body-parts",
    level: 2,
    levelName: "Beginner",
    order: 12,
    title: "Body Parts",
    subtitle: "頭 / 眼 / 耳 / 口 / 手 / 腳 / 肚",
    minutes: 5,
    intro: "Knowing your body parts helps a lot at the doctor — these are the everyday ones.",
    dialogue: [
      { speaker: "A", hanzi: "醫生，我個頭好痛。", jyutping: "ji1 sang1, ngo5 go3 tau4 hou2 tung3.", english: "Doctor, my head really hurts." },
      { speaker: "B", hanzi: "仲有邊度唔舒服呀？", jyutping: "zung6 jau5 bin1 dou6 m4 syu1 fuk6 aa3?", english: "Anywhere else feeling unwell?" },
      { speaker: "A", hanzi: "我對眼好攰，隻手又痛。", jyutping: "ngo5 deoi3 ngaan5 hou2 gui6, zek3 sau2 jau6 tung3.", english: "My eyes are tired, and my hand hurts." },
      { speaker: "B", hanzi: "你眼瞓啦。早啲瞓覺啦。", jyutping: "nei5 ngaan5 fan3 laa1. zou2 di1 fan3 gaau3 laa1.", english: "You're sleepy. Go to bed earlier." }
    ],
    vocab: [
      { hanzi: "頭", jyutping: "tau4", english: "head" },
      { hanzi: "眼", jyutping: "ngaan5", english: "eye" },
      { hanzi: "耳仔", jyutping: "ji5 zai2", english: "ear" },
      { hanzi: "口", jyutping: "hau2", english: "mouth" },
      { hanzi: "手", jyutping: "sau2", english: "hand" },
      { hanzi: "腳", jyutping: "goek3", english: "leg, foot" },
      { hanzi: "肚", jyutping: "tou5", english: "belly, stomach" }
    ],
    examples: [
      { hanzi: "我個頭好痛。", jyutping: "ngo5 go3 tau4 hou2 tung3.", english: "My head really hurts." },
      { hanzi: "佢隻手好凍。", jyutping: "keoi5 zek3 sau2 hou2 dung3.", english: "His hand is very cold." },
      { hanzi: "我肚好餓。", jyutping: "ngo5 tou5 hou2 ngo6.", english: "I'm very hungry." }
    ],
    notes: [
      {
        title: "Body parts take a classifier",
        body: "Cantonese pairs a body part with a classifier: 個頭 (head), 對眼 (eyes, a pair), 隻手 / 隻腳 (a hand / foot). 對 is for natural pairs, 隻 for one of a pair."
      },
      {
        title: "Say it hurts with 痛 (tung3)",
        body: "Put the body part first, then 痛: 頭痛 (headache), 肚痛 (stomachache). Add 好 for emphasis: 我個頭好痛 = \"my head really hurts.\""
      },
      {
        title: "眼瞓 (ngaan5 fan3) — sleepy",
        body: "A vivid everyday expression literally meaning \"eyes want to sleep.\" 我好眼瞓 = \"I'm really sleepy.\""
      }
    ]
  },
  {
    id: "feelings",
    level: 2,
    levelName: "Beginner",
    order: 13,
    title: "Feelings",
    subtitle: "開心 / 唔開心 / 攰 / 肚餓 / 口渴 / 驚",
    minutes: 5,
    intro: "Say how you feel with these everyday words — most just follow 我 (I am ...).",
    dialogue: [
      { speaker: "A", hanzi: "你做咩唔開心呀？", jyutping: "nei5 zou6 me1 m4 hoi1 sam1 aa3?", english: "Why are you unhappy?" },
      { speaker: "B", hanzi: "我好攰，又肚餓。", jyutping: "ngo5 hou2 gui6, jau6 tou5 ngo6.", english: "I'm really tired, and hungry too." },
      { speaker: "A", hanzi: "咁我哋去食嘢啦，食完你就開心啦。", jyutping: "gam2 ngo5 dei6 heoi3 sik6 je5 laa1, sik6 jyun4 nei5 zau6 hoi1 sam1 laa1.", english: "Then let's go eat — you'll feel happy after eating." },
      { speaker: "B", hanzi: "好呀！我而家口渴添。", jyutping: "hou2 aa3! ngo5 ji4 gaa1 hau2 hot3 tim1.", english: "Sure! I'm thirsty too now." }
    ],
    vocab: [
      { hanzi: "開心", jyutping: "hoi1 sam1", english: "happy" },
      { hanzi: "唔開心", jyutping: "m4 hoi1 sam1", english: "unhappy" },
      { hanzi: "攰", jyutping: "gui6", english: "tired" },
      { hanzi: "肚餓", jyutping: "tou5 ngo6", english: "hungry" },
      { hanzi: "口渴", jyutping: "hau2 hot3", english: "thirsty" },
      { hanzi: "驚", jyutping: "geng1", english: "scared, afraid" }
    ],
    examples: [
      { hanzi: "我好開心。", jyutping: "ngo5 hou2 hoi1 sam1.", english: "I'm very happy." },
      { hanzi: "我好攰。", jyutping: "ngo5 hou2 gui6.", english: "I'm very tired." },
      { hanzi: "你肚唔肚餓呀？", jyutping: "nei5 tou5 m4 tou5 ngo6 aa3?", english: "Are you hungry?" }
    ],
    notes: [
      {
        title: "No \"to be\" before a feeling",
        body: "Cantonese drops the verb \"to be\" before an adjective: say 我好攰 (I'm very tired) or 我肚餓 (I'm hungry), with no word for \"am\". 好 here means \"very\"."
      },
      {
        title: "Negate and ask with 唔",
        body: "Put 唔 (m4) before the feeling to flip it: 開心 → 唔開心 (unhappy). Ask a yes/no question by doubling it: 你開唔開心呀？"
      },
      {
        title: "添 (tim1) — \"as well\"",
        body: "A sentence-final particle that tacks on \"also / on top of that\": 我口渴添 (I'm thirsty too). Very common in casual speech."
      }
    ]
  },
  {
    id: "common-verbs",
    level: 2,
    levelName: "Beginner",
    order: 14,
    title: "Common Verbs",
    subtitle: "食 / 飲 / 睇 / 聽 / 講 / 行 / 坐 / 瞓",
    minutes: 6,
    intro: "These eight everyday verbs cover most of what you do in a day — eat, drink, watch, walk, sleep.",
    dialogue: [
      { speaker: "A", hanzi: "今晚想做啲咩呀？", jyutping: "gam1 maan5 soeng2 zou6 di1 me1 aa3?", english: "What do you want to do tonight?" },
      { speaker: "B", hanzi: "食完飯，睇下電視啦。", jyutping: "sik6 jyun4 faan6, tai2 haa5 din6 si6 laa1.", english: "After dinner, let's watch some TV." },
      { speaker: "A", hanzi: "我想去公園行下。", jyutping: "ngo5 soeng2 heoi3 gung1 jyun2 haang4 haa5.", english: "I want to go for a walk in the park." },
      { speaker: "B", hanzi: "都好。行完返嚟坐下，飲杯茶。", jyutping: "dou1 hou2. haang4 jyun4 faan1 lai4 co5 haa5, jam2 bui1 caa4.", english: "Sounds good. After the walk we'll come back, sit, and have some tea." }
    ],
    vocab: [
      { hanzi: "食", jyutping: "sik6", english: "to eat" },
      { hanzi: "飲", jyutping: "jam2", english: "to drink" },
      { hanzi: "睇", jyutping: "tai2", english: "to watch, to look, to read" },
      { hanzi: "聽", jyutping: "teng1", english: "to listen" },
      { hanzi: "講", jyutping: "gong2", english: "to speak, to say" },
      { hanzi: "行", jyutping: "haang4", english: "to walk" },
      { hanzi: "坐", jyutping: "co5", english: "to sit" },
      { hanzi: "瞓", jyutping: "fan3", english: "to sleep" }
    ],
    examples: [
      { hanzi: "我想飲茶。", jyutping: "ngo5 soeng2 jam2 caa4.", english: "I want to drink tea." },
      { hanzi: "佢鍾意睇電視。", jyutping: "keoi5 zung1 ji3 tai2 din6 si6.", english: "He likes watching TV." },
      { hanzi: "我要瞓覺。", jyutping: "ngo5 jiu3 fan3 gaau3.", english: "I need to sleep." }
    ],
    notes: [
      {
        title: "Verbs never change form",
        body: "Cantonese verbs stay identical for I/you/he and for past/present/future: 食 is always 食. Particles like 咗 and 緊 do the work, not the verb ending."
      },
      {
        title: "V + 下 = do a little",
        body: "Add 下 (haa5) after a verb to soften it to \"do a bit of\": 睇下 (have a look), 行下 (take a walk), 坐下 (sit for a while)."
      },
      {
        title: "睇 does a lot of work",
        body: "睇 (tai2) covers watch, look and read: 睇電視 (watch TV), 睇書 (read a book), even 睇醫生 (see a doctor)."
      }
    ]
  },
  {
    id: "common-adjectives",
    level: 2,
    levelName: "Beginner",
    order: 15,
    title: "Common Adjectives",
    subtitle: "大 / 細 / 多 / 少 / 長 / 短 / 平 / 貴",
    minutes: 5,
    intro: "These adjectives let you describe size, quantity, length and price.",
    dialogue: [
      { speaker: "A", hanzi: "呢件衫好靚，不過好貴。", jyutping: "ni1 gin6 saam1 hou2 leng3, bat1 gwo3 hou2 gwai3.", english: "This shirt is nice, but very expensive." },
      { speaker: "B", hanzi: "嗰件平啲，不過細啲。", jyutping: "go2 gin6 peng4 di1, bat1 gwo3 sai3 di1.", english: "That one's cheaper, but a bit small." },
      { speaker: "A", hanzi: "有冇大啲嘅呀？", jyutping: "jau5 mou5 daai6 di1 ge3 aa3?", english: "Do you have a bigger one?" },
      { speaker: "B", hanzi: "呢件大啲，又冇咁貴。", jyutping: "ni1 gin6 daai6 di1, jau6 mou5 gam3 gwai3.", english: "This one's bigger, and not as expensive." }
    ],
    vocab: [
      { hanzi: "大", jyutping: "daai6", english: "big" },
      { hanzi: "細", jyutping: "sai3", english: "small" },
      { hanzi: "多", jyutping: "do1", english: "many, much" },
      { hanzi: "少", jyutping: "siu2", english: "few, little" },
      { hanzi: "長", jyutping: "coeng4", english: "long" },
      { hanzi: "短", jyutping: "dyun2", english: "short" },
      { hanzi: "平", jyutping: "peng4", english: "cheap" },
      { hanzi: "貴", jyutping: "gwai3", english: "expensive" }
    ],
    examples: [
      { hanzi: "呢間屋好大。", jyutping: "ni1 gaan1 uk1 hou2 daai6.", english: "This house is very big." },
      { hanzi: "件衫好平。", jyutping: "gin6 saam1 hou2 peng4.", english: "This shirt is very cheap." },
      { hanzi: "我食得好少。", jyutping: "ngo5 sik6 dak1 hou2 siu2.", english: "I eat very little." }
    ],
    notes: [
      {
        title: "Comparatives with 啲 (di1)",
        body: "Add 啲 after an adjective for \"-er / a bit more\": 大啲 (bigger), 平啲 (cheaper), 多啲 (more). There's no separate word like English \"more\"."
      },
      {
        title: "Learn adjectives in opposite pairs",
        body: "They come in natural pairs: 大 / 細 (big / small), 多 / 少 (many / few), 長 / 短 (long / short), 平 / 貴 (cheap / expensive)."
      },
      {
        title: "冇咁 + adjective = not as…",
        body: "冇咁貴 (not as expensive), 冇咁大 (not as big). It pairs naturally with comparisons when you weigh two things."
      }
    ]
  },
  {
    id: "clothing",
    level: 2,
    levelName: "Beginner",
    order: 16,
    title: "Clothing",
    subtitle: "衫 / 褲 / 鞋 / 襪 / 裙 / 帽",
    minutes: 5,
    intro: "Learn the words for everyday clothes you wear.",
    dialogue: [
      { speaker: "A", hanzi: "你件衫好靚呀！喺邊度買㗎？", jyutping: "nei5 gin6 saam1 hou2 leng3 aa3! hai2 bin1 dou6 maai5 gaa3?", english: "Your shirt is so nice! Where'd you buy it?" },
      { speaker: "B", hanzi: "喺旺角買嘅。對鞋都係嗰度買。", jyutping: "hai2 wong6 gok3 maai5 ge3. deoi3 haai4 dou1 hai6 go2 dou6 maai5.", english: "Bought it in Mong Kok. These shoes too." },
      { speaker: "A", hanzi: "我都想買條裙同埋一頂帽。", jyutping: "ngo5 dou1 soeng2 maai5 tiu4 kwan4 tung4 maai4 jat1 deng2 mou2.", english: "I want to buy a skirt and a hat too." },
      { speaker: "B", hanzi: "咁聽日一齊去行街啦！", jyutping: "gam2 ting1 jat6 jat1 cai4 heoi3 haang4 gaai1 laa1!", english: "Then let's go shopping together tomorrow!" }
    ],
    vocab: [
      { hanzi: "衫", jyutping: "saam1", english: "shirt, clothes" },
      { hanzi: "褲", jyutping: "fu3", english: "trousers, pants" },
      { hanzi: "鞋", jyutping: "haai4", english: "shoes" },
      { hanzi: "襪", jyutping: "mat6", english: "socks" },
      { hanzi: "裙", jyutping: "kwan4", english: "skirt, dress" },
      { hanzi: "帽", jyutping: "mou2", english: "hat" }
    ],
    examples: [
      { hanzi: "我鍾意呢件衫。", jyutping: "ngo5 zung1 ji3 ni1 gin6 saam1.", english: "I like this shirt." },
      { hanzi: "呢對鞋幾錢呀？", jyutping: "ni1 deoi3 haai4 gei2 cin2 aa3?", english: "How much are these shoes?" },
      { hanzi: "佢戴緊帽。", jyutping: "keoi5 daai3 gan2 mou2.", english: "He is wearing a hat." }
    ],
    notes: [
      {
        title: "Each garment has its own classifier",
        body: "Learn the classifier with the word: 件衫 (shirt), 條褲 / 條裙 (trousers / skirt), 對鞋 / 對襪 (shoes / socks, in pairs), 頂帽 (hat)."
      },
      {
        title: "緊 (gan2) = action in progress",
        body: "Add 緊 after a verb for something happening now: 戴緊帽 (wearing a hat), 著緊衫 (getting dressed). It works like English \"-ing\"."
      },
      {
        title: "著 vs 戴 — two words for \"wear\"",
        body: "Cantonese splits \"wear\" by item: 著 (zoek3) for clothes and shoes (著衫, 著鞋), 戴 (daai3) for accessories (戴帽, 戴眼鏡, 戴錶)."
      }
    ]
  },
  {
    id: "shopping",
    level: 2,
    levelName: "Beginner",
    order: 17,
    title: "Shopping & Bargaining",
    subtitle: "買 / 賣 / 平啲 / 貴 / 打折 / 試",
    minutes: 6,
    intro: "Useful phrases for buying things and asking for a better price.",
    dialogue: [
      { speaker: "A", hanzi: "老闆，呢件幾錢呀？", jyutping: "lou5 baan2, ni1 gin6 gei2 cin2 aa3?", english: "Boss, how much is this one?" },
      { speaker: "B", hanzi: "兩百蚊。", jyutping: "loeng5 baak3 man1.", english: "Two hundred dollars." },
      { speaker: "A", hanzi: "太貴啦！平啲得唔得呀？", jyutping: "taai3 gwai3 laa1! peng4 di1 dak1 m4 dak1 aa3?", english: "Too expensive! Can you go a bit cheaper?" },
      { speaker: "B", hanzi: "好啦，打九折，一百八。", jyutping: "hou2 laa1, daa2 gau2 zit3, jat1 baak3 baat3.", english: "Alright, 10% off — a hundred and eighty." },
      { speaker: "A", hanzi: "唔該。我可唔可以試吓先呀？", jyutping: "m4 goi1. ngo5 ho2 m4 ho2 ji5 si3 haa5 sin1 aa3?", english: "Thanks. Can I try it first?" }
    ],
    vocab: [
      { hanzi: "買", jyutping: "maai5", english: "to buy" },
      { hanzi: "賣", jyutping: "maai6", english: "to sell" },
      { hanzi: "平啲", jyutping: "peng4 di1", english: "a bit cheaper" },
      { hanzi: "貴", jyutping: "gwai3", english: "expensive" },
      { hanzi: "打折", jyutping: "daa2 zit3", english: "to give a discount" },
      { hanzi: "試", jyutping: "si3", english: "to try" },
      { hanzi: "要", jyutping: "jiu3", english: "to want, to need" }
    ],
    examples: [
      { hanzi: "我想買呢件衫。", jyutping: "ngo5 soeng2 maai5 ni1 gin6 saam1.", english: "I want to buy this shirt." },
      { hanzi: "可唔可以平啲呀？", jyutping: "ho2 m4 ho2 ji5 peng4 di1 aa3?", english: "Can it be a bit cheaper?" },
      { hanzi: "我可唔可以試吓呀？", jyutping: "ngo5 ho2 m4 ho2 ji5 si3 haa5 aa3?", english: "Can I try it on?" }
    ],
    notes: [
      {
        title: "Culture — 打折 tells you what you pay",
        body: "A Cantonese discount names the fraction you pay, not the amount off: 打九折 = pay 90% (10% off), 打八折 = pay 80%, 打半價 = half price. Counterintuitive for English speakers!"
      },
      {
        title: "Bargain with 平啲",
        body: "平啲 (peng4 di1), literally \"a bit cheaper\", is the standard polite way to ask for a lower price at a market: 平啲得唔得呀？"
      },
      {
        title: "可唔可以…？ = may I…?",
        body: "Ask permission with 可唔可以 + verb: 可唔可以試吓呀？ (Can I try?). Answer 可以 (yes) or 唔得 (no)."
      }
    ]
  },
  {
    id: "cafe-drinks",
    level: 2,
    levelName: "Beginner",
    order: 18,
    title: "Café & Drinks",
    subtitle: "咖啡 / 奶茶 / 凍 / 熱 / 水 / 汽水",
    minutes: 5,
    intro: "Order drinks at a Hong Kong café and say if you want them hot or cold.",
    dialogue: [
      { speaker: "A", hanzi: "唔該，一杯熱奶茶。你呢？", jyutping: "m4 goi1, jat1 bui1 jit6 naai5 caa4. nei5 ne1?", english: "One hot milk tea please. You?" },
      { speaker: "B", hanzi: "我要凍檸茶。今日好熱。", jyutping: "ngo5 jiu3 dung3 ning4 caa4. gam1 jat6 hou2 jit6.", english: "I'll have iced lemon tea. It's hot today." },
      { speaker: "A", hanzi: "好。伙計，仲要一杯凍檸茶同杯水！", jyutping: "hou2. fo2 gei3, zung6 jiu3 jat1 bui1 dung3 ning4 caa4 tung4 bui1 seoi2!", english: "OK. Waiter, one more iced lemon tea and a water!" },
      { speaker: "B", hanzi: "唔該晒！", jyutping: "m4 goi1 saai3!", english: "Thanks a lot!" }
    ],
    vocab: [
      { hanzi: "咖啡", jyutping: "gaa3 fe1", english: "coffee" },
      { hanzi: "奶茶", jyutping: "naai5 caa4", english: "milk tea" },
      { hanzi: "凍", jyutping: "dung3", english: "cold (drink)" },
      { hanzi: "熱", jyutping: "jit6", english: "hot" },
      { hanzi: "水", jyutping: "seoi2", english: "water" },
      { hanzi: "汽水", jyutping: "hei3 seoi2", english: "soft drink, soda" },
      { hanzi: "凍檸茶", jyutping: "dung3 ning4 caa4", english: "iced lemon tea" }
    ],
    examples: [
      { hanzi: "我要一杯熱咖啡。", jyutping: "ngo5 jiu3 jat1 bui1 jit6 gaa3 fe1.", english: "I want a hot coffee." },
      { hanzi: "我鍾意飲奶茶。", jyutping: "ngo5 zung1 ji3 jam2 naai5 caa4.", english: "I like drinking milk tea." },
      { hanzi: "唔該一杯凍檸茶。", jyutping: "m4 goi1 jat1 bui1 dung3 ning4 caa4.", english: "An iced lemon tea, please." }
    ],
    notes: [
      {
        title: "凍 / 熱 go before the drink",
        body: "State the temperature first: 凍奶茶 (iced milk tea), 熱咖啡 (hot coffee). The server may ask 凍定熱呀？ — \"cold or hot?\" (定 = \"or\")."
      },
      {
        title: "Culture — 凍檸茶, the café classic",
        body: "Iced lemon tea is the default order at a 茶餐廳 (cha chaan teng). Locals often shorten it to 凍檸; hot lemon tea with honey is 熱檸蜜."
      },
      {
        title: "Order politely with 唔該",
        body: "Open an order with 唔該 (excuse me / please) and close with 唔該晒 (thanks a lot). 唔該 is also how you call the waiter over."
      }
    ]
  },
  {
    id: "fruit",
    level: 2,
    levelName: "Beginner",
    order: 19,
    title: "Fruit",
    subtitle: "蘋果 / 橙 / 香蕉 / 西瓜 / 提子 / 士多啤梨",
    minutes: 5,
    intro: "Common fruits you can buy at the market.",
    dialogue: [
      { speaker: "A", hanzi: "老闆，啲西瓜甜唔甜呀？", jyutping: "lou5 baan2, di1 sai1 gwaa1 tim4 m4 tim4 aa3?", english: "Boss, are the watermelons sweet?" },
      { speaker: "B", hanzi: "好甜呀！今日啲蘋果都好新鮮。", jyutping: "hou2 tim4 aa3! gam1 jat6 di1 ping4 gwo2 dou1 hou2 san1 sin1.", english: "Very sweet! The apples are fresh today too." },
      { speaker: "A", hanzi: "咁我要一個西瓜同一斤提子。", jyutping: "gam2 ngo5 jiu3 jat1 go3 sai1 gwaa1 tung4 jat1 gan1 tai4 zi2.", english: "Then I'll take a watermelon and a catty of grapes." },
      { speaker: "B", hanzi: "好！夠唔夠？要唔要橙呀？", jyutping: "hou2! gau3 m4 gau3? jiu3 m4 jiu3 caang2 aa3?", english: "Sure! Is that enough? Want some oranges?" }
    ],
    vocab: [
      { hanzi: "蘋果", jyutping: "ping4 gwo2", english: "apple" },
      { hanzi: "橙", jyutping: "caang2", english: "orange" },
      { hanzi: "香蕉", jyutping: "hoeng1 ziu1", english: "banana" },
      { hanzi: "西瓜", jyutping: "sai1 gwaa1", english: "watermelon" },
      { hanzi: "提子", jyutping: "tai4 zi2", english: "grapes" },
      { hanzi: "士多啤梨", jyutping: "si6 do1 be1 lei2", english: "strawberry" }
    ],
    examples: [
      { hanzi: "我鍾意食蘋果。", jyutping: "ngo5 zung1 ji3 sik6 ping4 gwo2.", english: "I like eating apples." },
      { hanzi: "西瓜幾錢一個呀？", jyutping: "sai1 gwaa1 gei2 cin2 jat1 go3 aa3?", english: "How much is one watermelon?" },
      { hanzi: "我要一斤提子。", jyutping: "ngo5 jiu3 jat1 gan1 tai4 zi2.", english: "I want one catty of grapes." }
    ],
    notes: [
      {
        title: "Culture — 斤 (gan1), the catty",
        body: "Markets sell produce by the 斤 (catty, about 600g), not the kilo: 一斤提子 (a catty of grapes). Prices are quoted per 斤."
      },
      {
        title: "Ask about a quality by doubling the adjective",
        body: "甜唔甜呀？ (sweet?), 新唔新鮮呀？ (fresh?). The A-not-A yes/no pattern works for adjectives just as it does for verbs."
      },
      {
        title: "士多啤梨 — a tasty loanword",
        body: "士多啤梨 (si6 do1 be1 lei2) is \"strawberry\" borrowed straight from English. Many imported fruits use these sound-based names."
      }
    ]
  },
  {
    id: "vegetables",
    level: 2,
    levelName: "Beginner",
    order: 20,
    title: "Vegetables",
    subtitle: "菜 / 白菜 / 番茄 / 薯仔 / 紅蘿蔔 / 洋蔥",
    minutes: 5,
    intro: "Names of vegetables you will see at the wet market.",
    dialogue: [
      { speaker: "A", hanzi: "唔該，我要兩斤白菜。", jyutping: "m4 goi1, ngo5 jiu3 loeng5 gan1 baak6 coi3.", english: "Excuse me, I'd like two catties of bok choy." },
      { speaker: "B", hanzi: "好。仲要啲咩菜呀？", jyutping: "hou2. zung6 jiu3 di1 me1 coi3 aa3?", english: "Sure. What other veg would you like?" },
      { speaker: "A", hanzi: "番茄同薯仔。薯仔平唔平呀？", jyutping: "faan1 ke2 tung4 syu4 zai2. syu4 zai2 peng4 m4 peng4 aa3?", english: "Tomatoes and potatoes. Are the potatoes cheap?" },
      { speaker: "B", hanzi: "好平！三蚊一斤。", jyutping: "hou2 peng4! saam1 man1 jat1 gan1.", english: "Very cheap! Three dollars a catty." }
    ],
    vocab: [
      { hanzi: "菜", jyutping: "coi3", english: "vegetables" },
      { hanzi: "白菜", jyutping: "baak6 coi3", english: "bok choy" },
      { hanzi: "番茄", jyutping: "faan1 ke2", english: "tomato" },
      { hanzi: "薯仔", jyutping: "syu4 zai2", english: "potato" },
      { hanzi: "紅蘿蔔", jyutping: "hung4 lo4 baak6", english: "carrot" },
      { hanzi: "洋蔥", jyutping: "joeng4 cung1", english: "onion" }
    ],
    examples: [
      { hanzi: "我鍾意食菜。", jyutping: "ngo5 zung1 ji3 sik6 coi3.", english: "I like eating vegetables." },
      { hanzi: "我要兩個番茄。", jyutping: "ngo5 jiu3 loeng5 go3 faan1 ke2.", english: "I want two tomatoes." },
      { hanzi: "薯仔平唔平呀？", jyutping: "syu4 zai2 peng4 m4 peng4 aa3?", english: "Are the potatoes cheap?" }
    ],
    notes: [
      {
        title: "Culture — the 街市 (wet market)",
        body: "Most Hongkongers buy fresh veg, meat and fish at the 街市 (gaai1 si5, wet market) rather than a supermarket — stalls are cheaper and you can bargain."
      },
      {
        title: "仔 (zai2) makes things small and familiar",
        body: "The suffix 仔 adds a small, casual feel: 薯仔 (potato, lit. \"little spud\"), 耳仔 (ear), 男仔 (boy). It's everywhere in Cantonese."
      },
      {
        title: "菜 means veg — and \"a dish\"",
        body: "菜 (coi3) is vegetables, but also a cooked dish: 我哋叫幾個菜 = \"let's order a few dishes.\" Context tells you which."
      }
    ]
  },
  {
    id: "meat-seafood",
    level: 2,
    levelName: "Beginner",
    order: 21,
    title: "Meat & Seafood",
    subtitle: "肉 / 雞 / 豬肉 / 牛肉 / 魚 / 蝦 / 蟹",
    minutes: 5,
    intro: "Words for meat and seafood when shopping or ordering food.",
    dialogue: [
      { speaker: "A", hanzi: "今晚煮咩餸好呢？", jyutping: "gam1 maan5 zyu2 me1 sung3 hou2 ne1?", english: "What dish should we cook tonight?" },
      { speaker: "B", hanzi: "買條魚啦，蒸魚最簡單。", jyutping: "maai5 tiu4 jyu2 laa1, zing1 jyu2 zeoi3 gaan2 daan1.", english: "Let's buy a fish — steamed fish is easiest." },
      { speaker: "A", hanzi: "好。再買啲蝦同少少牛肉。", jyutping: "hou2. zoi3 maai5 di1 haa1 tung4 siu2 siu2 ngau4 juk6.", english: "OK. And some shrimp and a little beef too." },
      { speaker: "B", hanzi: "啲魚好唔好食㗎？", jyutping: "di1 jyu2 hou2 m4 hou2 sik6 gaa3?", english: "Is the fish any good?" },
      { speaker: "A", hanzi: "好新鮮，今朝先到。", jyutping: "hou2 san1 sin1, gam1 ziu1 sin1 dou3.", english: "Very fresh — just came in this morning." }
    ],
    vocab: [
      { hanzi: "肉", jyutping: "juk6", english: "meat" },
      { hanzi: "雞", jyutping: "gai1", english: "chicken" },
      { hanzi: "豬肉", jyutping: "zyu1 juk6", english: "pork" },
      { hanzi: "牛肉", jyutping: "ngau4 juk6", english: "beef" },
      { hanzi: "魚", jyutping: "jyu2", english: "fish" },
      { hanzi: "蝦", jyutping: "haa1", english: "shrimp" },
      { hanzi: "蟹", jyutping: "haai5", english: "crab" }
    ],
    examples: [
      { hanzi: "我鍾意食牛肉。", jyutping: "ngo5 zung1 ji3 sik6 ngau4 juk6.", english: "I like eating beef." },
      { hanzi: "我唔食豬肉。", jyutping: "ngo5 m4 sik6 zyu1 juk6.", english: "I don't eat pork." },
      { hanzi: "啲魚好唔好食呀？", jyutping: "di1 jyu2 hou2 m4 hou2 sik6 aa3?", english: "Is the fish tasty?" }
    ],
    notes: [
      {
        title: "Culture — 餸 (sung3), the dish with rice",
        body: "A uniquely Cantonese word for the meat and veg dishes eaten with rice. 今晚有咩餸呀？ = \"what's for dinner (to go with rice) tonight?\""
      },
      {
        title: "肉 (juk6) names the meat",
        body: "Add 肉 to the animal: 豬肉 (pork, from 豬 pig), 牛肉 (beef, from 牛 cow), 雞肉 (chicken meat). Seafood — 魚 / 蝦 / 蟹 — stands alone."
      },
      {
        title: "Culture — 蒸魚, the Cantonese way",
        body: "Steaming (蒸) a whole fresh fish with ginger and spring onion is the classic home dish. Freshness matters far more than sauce."
      }
    ]
  },
  {
    id: "kitchen",
    level: 2,
    levelName: "Beginner",
    order: 22,
    title: "In the Kitchen",
    subtitle: "廚房 / 煮 / 煎 / 炒 / 碗 / 筷子 / 刀",
    minutes: 5,
    intro: "Cooking actions and utensils you use in the kitchen.",
    dialogue: [
      { speaker: "A", hanzi: "你喺廚房煮緊咩呀？", jyutping: "nei5 hai2 cyu4 fong2 zyu2 gan2 me1 aa3?", english: "What are you cooking in the kitchen?" },
      { speaker: "B", hanzi: "炒緊菜。你幫我攞個碗，好嗎？", jyutping: "caau2 gan2 coi3. nei5 bong1 ngo5 lo2 go3 wun2, hou2 maa3?", english: "Stir-frying veg. Can you grab me a bowl?" },
      { speaker: "A", hanzi: "好。要唔要拎埋筷子？", jyutping: "hou2. jiu3 m4 jiu3 ling1 maai4 faai3 zi2?", english: "Sure. Want chopsticks too?" },
      { speaker: "B", hanzi: "要。仲要煎多隻蛋。", jyutping: "jiu3. zung6 jiu3 zin1 do1 zek3 daan2.", english: "Yes. And pan-fry one more egg." }
    ],
    vocab: [
      { hanzi: "廚房", jyutping: "cyu4 fong2", english: "kitchen" },
      { hanzi: "煮", jyutping: "zyu2", english: "to cook" },
      { hanzi: "煎", jyutping: "zin1", english: "to pan-fry" },
      { hanzi: "炒", jyutping: "caau2", english: "to stir-fry" },
      { hanzi: "碗", jyutping: "wun2", english: "bowl" },
      { hanzi: "筷子", jyutping: "faai3 zi2", english: "chopsticks" },
      { hanzi: "刀", jyutping: "dou1", english: "knife" }
    ],
    examples: [
      { hanzi: "我鍾意煮飯。", jyutping: "ngo5 zung1 ji3 zyu2 faan6.", english: "I like cooking." },
      { hanzi: "佢喺廚房炒菜。", jyutping: "keoi5 hai2 cyu4 fong2 caau2 coi3.", english: "She is stir-frying vegetables in the kitchen." },
      { hanzi: "我要一對筷子。", jyutping: "ngo5 jiu3 jat1 deoi3 faai3 zi2.", english: "I want a pair of chopsticks." }
    ],
    notes: [
      {
        title: "Three ways to cook",
        body: "Cantonese names the cooking method: 煮 (boil / cook generally), 煎 (pan-fry), 炒 (stir-fry in a wok). So 炒菜 (stir-fried veg), 煎蛋 (fried egg)."
      },
      {
        title: "埋 (maai4) = …as well (on a verb)",
        body: "Tacks \"as well\" onto an action: 拎埋筷子 (bring the chopsticks too), 食埋佢 (finish it off too). It attaches to the verb, unlike 都, which goes with the subject."
      },
      {
        title: "Culture — chopstick etiquette",
        body: "Chopsticks come as 一對 (a pair). Never stand them upright in a bowl of rice — that resembles incense at a funeral and is considered bad luck."
      }
    ]
  },
  {
    id: "house-rooms",
    level: 2,
    levelName: "Beginner",
    order: 23,
    title: "House & Rooms",
    subtitle: "屋企 / 房 / 廳 / 廚房 / 廁所 / 門 / 窗",
    minutes: 5,
    intro: "Talk about the different parts of your home.",
    dialogue: [
      { speaker: "A", hanzi: "你新屋企大唔大呀？", jyutping: "nei5 san1 uk1 kei2 daai6 m4 daai6 aa3?", english: "Is your new place big?" },
      { speaker: "B", hanzi: "唔算大，有兩間房同一個廳。", jyutping: "m4 syun3 daai6, jau5 loeng5 gaan1 fong2 tung4 jat1 go3 teng1.", english: "Not that big — two bedrooms and a living room." },
      { speaker: "A", hanzi: "廚房同廁所喺邊度呀？", jyutping: "cyu4 fong2 tung4 ci3 so2 hai2 bin1 dou6 aa3?", english: "Where are the kitchen and bathroom?" },
      { speaker: "B", hanzi: "入門口右手邊。個廳好光，有個大窗。", jyutping: "jap6 mun4 hau2 jau6 sau2 bin1. go3 teng1 hou2 gwong1, jau5 go3 daai6 coeng1.", english: "Right of the entrance. The living room is bright, with a big window." }
    ],
    vocab: [
      { hanzi: "屋企", jyutping: "uk1 kei2", english: "home" },
      { hanzi: "房", jyutping: "fong2", english: "room, bedroom" },
      { hanzi: "廳", jyutping: "teng1", english: "living room" },
      { hanzi: "廚房", jyutping: "cyu4 fong2", english: "kitchen" },
      { hanzi: "廁所", jyutping: "ci3 so2", english: "toilet, bathroom" },
      { hanzi: "門", jyutping: "mun4", english: "door" },
      { hanzi: "窗", jyutping: "coeng1", english: "window" }
    ],
    examples: [
      { hanzi: "我喺屋企。", jyutping: "ngo5 hai2 uk1 kei2.", english: "I am at home." },
      { hanzi: "廁所喺邊度呀？", jyutping: "ci3 so2 hai2 bin1 dou6 aa3?", english: "Where is the toilet?" },
      { hanzi: "呢間屋有兩間房。", jyutping: "ni1 gaan1 uk1 jau5 loeng5 gaan1 fong2.", english: "This flat has two bedrooms." }
    ],
    notes: [
      {
        title: "間 (gaan1) is the room classifier",
        body: "Count rooms and flats with 間: 一間房 (a room), 兩間房 (two rooms), 一間屋 (a flat / house)."
      },
      {
        title: "屋企 = home, not the building",
        body: "屋企 (uk1 kei2) means \"home\" — where you live, even a flat. The building itself is 屋 (uk1). 返屋企 = \"go home.\""
      },
      {
        title: "Culture — flats, not houses",
        body: "In dense Hong Kong almost everyone lives in a high-rise flat (單位, daan1 wai2), so 屋企 nearly always means an apartment. Space is tight and prized."
      }
    ]
  },
  {
    id: "furniture",
    level: 2,
    levelName: "Beginner",
    order: 24,
    title: "Furniture",
    subtitle: "枱 / 櫈 / 床 / 櫃 / 沙發 / 燈",
    minutes: 5,
    intro: "Common pieces of furniture found around the home.",
    dialogue: [
      { speaker: "A", hanzi: "張床擺喺邊度好呢？", jyutping: "zoeng1 cong4 baai2 hai2 bin1 dou6 hou2 ne1?", english: "Where should we put the bed?" },
      { speaker: "B", hanzi: "擺埋窗口邊啦。張枱就放喺度。", jyutping: "baai2 maai4 coeng1 hau2 bin1 laa1. zoeng1 toi2 zau6 fong3 hai2 dou6.", english: "Put it by the window. The table goes here." },
      { speaker: "A", hanzi: "好。沙發同櫃就擺喺廳。", jyutping: "hou2. saa1 faat3 tung4 gwai6 zau6 baai2 hai2 teng1.", english: "OK. The sofa and cabinet go in the living room." },
      { speaker: "B", hanzi: "好暗呀，唔該開埋盞燈。", jyutping: "hou2 am3 aa3, m4 goi1 hoi1 maai4 zaan2 dang1.", english: "It's dark — please switch the lamp on too." }
    ],
    vocab: [
      { hanzi: "枱", jyutping: "toi2", english: "table" },
      { hanzi: "櫈", jyutping: "dang3", english: "chair, stool" },
      { hanzi: "床", jyutping: "cong4", english: "bed" },
      { hanzi: "櫃", jyutping: "gwai6", english: "cabinet, cupboard" },
      { hanzi: "沙發", jyutping: "saa1 faat3", english: "sofa" },
      { hanzi: "燈", jyutping: "dang1", english: "lamp, light" }
    ],
    examples: [
      { hanzi: "張床好大。", jyutping: "zoeng1 cong4 hou2 daai6.", english: "The bed is very big." },
      { hanzi: "我坐喺沙發度。", jyutping: "ngo5 co5 hai2 saa1 faat3 dou6.", english: "I am sitting on the sofa." },
      { hanzi: "唔該開燈。", jyutping: "m4 goi1 hoi1 dang1.", english: "Please turn on the light." }
    ],
    notes: [
      {
        title: "張 for flat, surface-like things",
        body: "Furniture with a flat surface takes 張 (zoeng1): 張床 (bed), 張枱 (table), 張櫈 (chair). A lamp, though, takes 盞: 一盞燈."
      },
      {
        title: "開 / 熄 — switching on and off",
        body: "開 (hoi1) turns something on, 熄 (sik1) turns it off: 開燈 / 熄燈 (lights), 開電視 / 熄電視 (TV)."
      },
      {
        title: "擺 vs 放 — putting things down",
        body: "Both mean \"put / place\": 擺 (baai2) leans toward arranging or displaying, 放 (fong3) toward setting down. In everyday speech they overlap."
      }
    ]
  },
  {
    id: "transport-types",
    level: 2,
    levelName: "Beginner",
    order: 25,
    title: "Types of Transport",
    subtitle: "巴士 / 小巴 / 的士 / 火車 / 船 / 飛機 / 單車",
    minutes: 5,
    intro: "Common ways to get around Hong Kong.",
    dialogue: [
      { speaker: "A", hanzi: "去尖沙咀坐咩車好呀？", jyutping: "heoi3 zim1 saa1 zeoi2 co5 me1 ce1 hou2 aa3?", english: "What's the best way to get to Tsim Sha Tsui?" },
      { speaker: "B", hanzi: "搭巴士啦，又平又有位坐。", jyutping: "daap3 baa1 si2 laa1, jau6 peng4 jau6 jau5 wai2 co5.", english: "Take the bus — cheap, and you get a seat." },
      { speaker: "A", hanzi: "趕時間呀，不如搭的士？", jyutping: "gon2 si4 gaan3 aa3, bat1 jyu4 daap3 dik1 si2?", english: "I'm in a hurry — how about a taxi?" },
      { speaker: "B", hanzi: "咁不如搭船，仲快過塞車。", jyutping: "gam2 bat1 jyu4 daap3 syun4, zung6 faai3 gwo3 sak1 ce1.", english: "Then take the ferry — faster than sitting in traffic." }
    ],
    vocab: [
      { hanzi: "巴士", jyutping: "baa1 si2", english: "bus" },
      { hanzi: "小巴", jyutping: "siu2 baa1", english: "minibus" },
      { hanzi: "的士", jyutping: "dik1 si2", english: "taxi" },
      { hanzi: "火車", jyutping: "fo2 ce1", english: "train" },
      { hanzi: "船", jyutping: "syun4", english: "boat, ferry" },
      { hanzi: "飛機", jyutping: "fei1 gei1", english: "plane" },
      { hanzi: "單車", jyutping: "daan1 ce1", english: "bicycle" }
    ],
    examples: [
      { hanzi: "我搭巴士返工。", jyutping: "ngo5 daap3 baa1 si2 faan1 gung1.", english: "I take the bus to work." },
      { hanzi: "搭的士好貴。", jyutping: "daap3 dik1 si2 hou2 gwai3.", english: "Taking a taxi is expensive." },
      { hanzi: "我鍾意踩單車。", jyutping: "ngo5 zung1 ji3 caai2 daan1 ce1.", english: "I like riding a bicycle." }
    ],
    notes: [
      {
        title: "搭 / 坐 + transport",
        body: "Use 搭 (daap3) or 坐 (co5) for taking public transport: 搭巴士 (take the bus), 搭的士 (take a taxi), 搭船 (take the ferry). A bike, though, you 踩 (踩單車)."
      },
      {
        title: "Comparisons with 過 (gwo3)",
        body: "Put 過 after the adjective to compare: 快過 (faster than), 平過 (cheaper than). 搭船快過搭巴士 = \"the ferry is faster than the bus.\""
      },
      {
        title: "Culture — the red and green 小巴",
        body: "的士 (taxi) and 巴士 (bus) are borrowed from English. The 小巴 (minibus) is a HK institution — to get off you call out 有落！ (jau5 lok6, \"stop, I'm getting off!\")."
      }
    ]
  },
  {
    id: "asking-the-way",
    level: 2,
    levelName: "Beginner",
    order: 26,
    title: "Asking the Way",
    subtitle: "點去 / 喺邊度 / 前面 / 後面 / 左 / 右 / 直行",
    minutes: 5,
    intro: "Useful phrases for asking and giving directions.",
    dialogue: [
      { speaker: "A", hanzi: "唔該，請問港鐵站點去呀？", jyutping: "m4 goi1, cing2 man6 gong2 tit3 zaam6 dim2 heoi3 aa3?", english: "Excuse me, how do I get to the MTR station?" },
      { speaker: "B", hanzi: "直行，然後轉左。", jyutping: "zik6 haang4, jin4 hau6 zyun3 zo2.", english: "Go straight, then turn left." },
      { speaker: "A", hanzi: "遠唔遠呀？", jyutping: "jyun5 m4 jyun5 aa3?", english: "Is it far?" },
      { speaker: "B", hanzi: "唔遠。轉左之後，就喺右手邊。", jyutping: "m4 jyun5. zyun3 zo2 zi1 hau6, zau6 hai2 jau6 sau2 bin1.", english: "Not far. After you turn left, it's on your right." }
    ],
    vocab: [
      { hanzi: "點去", jyutping: "dim2 heoi3", english: "how to get to" },
      { hanzi: "喺邊度", jyutping: "hai2 bin1 dou6", english: "where (is it)" },
      { hanzi: "前面", jyutping: "cin4 min6", english: "in front, ahead" },
      { hanzi: "後面", jyutping: "hau6 min6", english: "behind" },
      { hanzi: "左", jyutping: "zo2", english: "left" },
      { hanzi: "右", jyutping: "jau6", english: "right" },
      { hanzi: "直行", jyutping: "zik6 haang4", english: "go straight" }
    ],
    examples: [
      { hanzi: "請問點去地鐵站呀？", jyutping: "cing2 man6 dim2 heoi3 dei6 tit3 zaam6 aa3?", english: "Excuse me, how do I get to the MTR station?" },
      { hanzi: "直行轉左。", jyutping: "zik6 haang4 zyun3 zo2.", english: "Go straight and turn left." },
      { hanzi: "廁所喺前面。", jyutping: "ci3 so2 hai2 cin4 min6.", english: "The toilet is ahead." }
    ],
    notes: [
      {
        title: "點去 + place = how do I get to…?",
        body: "點去 (dim2 heoi3) literally means \"how go\": 點去港鐵站呀？ (How do I get to the MTR?). Add 呀 to keep it friendly."
      },
      {
        title: "轉左 / 轉右 / 直行",
        body: "The three core directions: 轉左 (turn left), 轉右 (turn right), 直行 (go straight). \"On the left/right side\" is 左手邊 / 右手邊."
      },
      {
        title: "Open politely with 請問",
        body: "Before stopping a stranger, say 唔該 (excuse me) or 請問 (may I ask): 唔該，請問…？ It softens the question and is expected."
      }
    ]
  },
  {
    id: "phone-messaging",
    level: 2,
    levelName: "Beginner",
    order: 27,
    title: "Phone & Messaging",
    subtitle: "電話 / 打電話 / 手機 / 短訊 / WhatsApp / 聽電話",
    minutes: 5,
    intro: "Words for phones, calls and messages.",
    dialogue: [
      { speaker: "A", hanzi: "我頭先打電話畀你，你冇聽電話。", jyutping: "ngo5 tau4 sin1 daa2 din6 waa2 bei2 nei5, nei5 mou5 teng1 din6 waa2.", english: "I called you just now, but you didn't answer." },
      { speaker: "B", hanzi: "唔好意思，我冇帶手機。", jyutping: "m4 hou2 ji3 si1, ngo5 mou5 daai3 sau2 gei1.", english: "Sorry, I didn't have my mobile with me." },
      { speaker: "A", hanzi: "唔緊要。我留咗個短訊畀你。", jyutping: "m4 gan2 jiu3. ngo5 lau4 zo2 go3 dyun2 seon3 bei2 nei5.", english: "Never mind. I left you a text." },
      { speaker: "B", hanzi: "收到喇！唔該晒。記住我新號碼呀。", jyutping: "sau1 dou2 laa3! m4 goi1 saai3. gei3 zyu6 ngo5 san1 hou6 maa5 aa3.", english: "Got it! Thanks. Remember my new number." }
    ],
    vocab: [
      { hanzi: "電話", jyutping: "din6 waa2", english: "telephone" },
      { hanzi: "打電話", jyutping: "daa2 din6 waa2", english: "to make a phone call" },
      { hanzi: "手機", jyutping: "sau2 gei1", english: "mobile phone" },
      { hanzi: "短訊", jyutping: "dyun2 seon3", english: "text message" },
      { hanzi: "聽電話", jyutping: "teng1 din6 waa2", english: "to answer the phone" },
      { hanzi: "號碼", jyutping: "hou6 maa5", english: "number" }
    ],
    examples: [
      { hanzi: "我打電話畀你。", jyutping: "ngo5 daa2 din6 waa2 bei2 nei5.", english: "I'll give you a call." },
      { hanzi: "你部手機幾錢呀？", jyutping: "nei5 bou6 sau2 gei1 gei2 cin2 aa3?", english: "How much is your mobile phone?" },
      { hanzi: "請聽電話。", jyutping: "cing2 teng1 din6 waa2.", english: "Please answer the phone." }
    ],
    notes: [
      {
        title: "打 / 聽 / 覆 a call",
        body: "打電話 (make a call), 聽電話 (answer it), 覆電話 (return a call). 打 literally means \"hit\" — it's the standard verb for placing a call."
      },
      {
        title: "畀 (bei2) = to / give",
        body: "Marks the recipient: 打電話畀你 (call you), 留個短訊畀佢 (leave him a text). 畀 on its own means \"give\": 畀錢 (pay)."
      },
      {
        title: "Culture — everyone's on WhatsApp",
        body: "Hongkongers mostly message on WhatsApp, so you'll hear English verbs slipped in — 我WhatsApp你 — alongside the textbook 短訊 (text message)."
      }
    ]
  },
  {
    id: "occupations",
    level: 2,
    levelName: "Beginner",
    order: 28,
    title: "Jobs & Occupations",
    subtitle: "老師 / 醫生 / 護士 / 司機 / 廚師 / 學生 / 做嘢",
    minutes: 5,
    intro: "Common jobs and how to talk about work.",
    dialogue: [],
    vocab: [
      { hanzi: "老師", jyutping: "lou5 si1", english: "teacher" },
      { hanzi: "醫生", jyutping: "ji1 sang1", english: "doctor" },
      { hanzi: "護士", jyutping: "wu6 si6", english: "nurse" },
      { hanzi: "司機", jyutping: "si1 gei1", english: "driver" },
      { hanzi: "廚師", jyutping: "cyu4 si1", english: "chef, cook" },
      { hanzi: "學生", jyutping: "hok6 saang1", english: "student" },
      { hanzi: "做嘢", jyutping: "zou6 je5", english: "to work, to do things" }
    ],
    examples: [
      { hanzi: "我係老師。", jyutping: "ngo5 hai6 lou5 si1.", english: "I am a teacher." },
      { hanzi: "佢做醫生。", jyutping: "keoi5 zou6 ji1 sang1.", english: "He works as a doctor." },
      { hanzi: "你做唔做嘢呀？", jyutping: "nei5 zou6 m4 zou6 je5 aa3?", english: "Do you work?" }
    ]
  },
  {
    id: "school-study",
    level: 2,
    levelName: "Beginner",
    order: 29,
    title: "School & Study",
    subtitle: "學校 / 讀書 / 功課 / 考試 / 老師 / 同學 / 書",
    minutes: 5,
    intro: "Vocabulary about school and studying.",
    dialogue: [],
    vocab: [
      { hanzi: "學校", jyutping: "hok6 haau6", english: "school" },
      { hanzi: "讀書", jyutping: "duk6 syu1", english: "to study" },
      { hanzi: "功課", jyutping: "gung1 fo3", english: "homework" },
      { hanzi: "考試", jyutping: "haau2 si3", english: "exam" },
      { hanzi: "同學", jyutping: "tung4 hok6", english: "classmate" },
      { hanzi: "書", jyutping: "syu1", english: "book" }
    ],
    examples: [
      { hanzi: "我去學校讀書。", jyutping: "ngo5 heoi3 hok6 haau6 duk6 syu1.", english: "I go to school to study." },
      { hanzi: "今日有好多功課。", jyutping: "gam1 jat6 jau5 hou2 do1 gung1 fo3.", english: "There is a lot of homework today." },
      { hanzi: "聽日考試。", jyutping: "ting1 jat6 haau2 si3.", english: "There's an exam tomorrow." }
    ]
  },
  {
    id: "sports",
    level: 2,
    levelName: "Beginner",
    order: 30,
    title: "Sports",
    subtitle: "運動 / 踢波 / 打波 / 游水 / 跑步 / 行山",
    minutes: 5,
    intro: "Talk about sports and exercise.",
    dialogue: [],
    vocab: [
      { hanzi: "運動", jyutping: "wan6 dung6", english: "exercise, sport" },
      { hanzi: "踢波", jyutping: "tek3 bo1", english: "to play football" },
      { hanzi: "打波", jyutping: "daa2 bo1", english: "to play ball games" },
      { hanzi: "游水", jyutping: "jau4 seoi2", english: "to swim" },
      { hanzi: "跑步", jyutping: "paau2 bou6", english: "to run, jog" },
      { hanzi: "行山", jyutping: "haang4 saan1", english: "to hike" }
    ],
    examples: [
      { hanzi: "我鍾意踢波。", jyutping: "ngo5 zung1 ji3 tek3 bo1.", english: "I like playing football." },
      { hanzi: "我哋去游水。", jyutping: "ngo5 dei6 heoi3 jau4 seoi2.", english: "We go swimming." },
      { hanzi: "聽日去行山。", jyutping: "ting1 jat6 heoi3 haang4 saan1.", english: "We're going hiking tomorrow." }
    ]
  },
  {
    id: "music-tv",
    level: 2,
    levelName: "Beginner",
    order: 31,
    title: "Music & TV",
    subtitle: "音樂 / 聽歌 / 睇電視 / 電影 / 唱歌 / 鋼琴",
    minutes: 5,
    intro: "Words about music, TV and entertainment.",
    dialogue: [],
    vocab: [
      { hanzi: "音樂", jyutping: "jam1 ngok6", english: "music" },
      { hanzi: "聽歌", jyutping: "teng1 go1", english: "to listen to music" },
      { hanzi: "睇電視", jyutping: "tai2 din6 si6", english: "to watch TV" },
      { hanzi: "電影", jyutping: "din6 jing2", english: "movie" },
      { hanzi: "唱歌", jyutping: "coeng3 go1", english: "to sing" },
      { hanzi: "鋼琴", jyutping: "gong3 kam4", english: "piano" }
    ],
    examples: [
      { hanzi: "我鍾意聽歌。", jyutping: "ngo5 zung1 ji3 teng1 go1.", english: "I like listening to music." },
      { hanzi: "我哋去睇電影。", jyutping: "ngo5 dei6 heoi3 tai2 din6 jing2.", english: "We're going to watch a movie." },
      { hanzi: "佢識彈鋼琴。", jyutping: "keoi5 sik1 taan4 gong3 kam4.", english: "She can play the piano." }
    ]
  },
  {
    id: "animals-pets",
    level: 2,
    levelName: "Beginner",
    order: 32,
    title: "Animals & Pets",
    subtitle: "動物 / 狗 / 貓 / 雀仔 / 魚 / 養",
    minutes: 5,
    intro: "Common animals and keeping pets.",
    dialogue: [],
    vocab: [
      { hanzi: "動物", jyutping: "dung6 mat6", english: "animal" },
      { hanzi: "狗", jyutping: "gau2", english: "dog" },
      { hanzi: "貓", jyutping: "maau1", english: "cat" },
      { hanzi: "雀仔", jyutping: "zoek3 zai2", english: "bird" },
      { hanzi: "魚", jyutping: "jyu2", english: "fish" },
      { hanzi: "養", jyutping: "joeng5", english: "to keep, raise (a pet)" }
    ],
    examples: [
      { hanzi: "我養咗一隻狗。", jyutping: "ngo5 joeng5 zo2 jat1 zek3 gau2.", english: "I keep a dog." },
      { hanzi: "我鍾意貓。", jyutping: "ngo5 zung1 ji3 maau1.", english: "I like cats." },
      { hanzi: "呢隻雀仔好得意。", jyutping: "ni1 zek3 zoek3 zai2 hou2 dak1 ji3.", english: "This bird is very cute." }
    ]
  },
  {
    id: "daily-routine",
    level: 2,
    levelName: "Beginner",
    order: 33,
    title: "Daily Routine",
    subtitle: "起身 / 刷牙 / 沖涼 / 食飯 / 返工 / 放工 / 瞓覺",
    minutes: 5,
    intro: "Describe the things you do every day.",
    dialogue: [],
    vocab: [
      { hanzi: "起身", jyutping: "hei2 san1", english: "to get up" },
      { hanzi: "刷牙", jyutping: "caat3 ngaa4", english: "to brush teeth" },
      { hanzi: "沖涼", jyutping: "cung1 loeng4", english: "to shower, bathe" },
      { hanzi: "食飯", jyutping: "sik6 faan6", english: "to eat (a meal)" },
      { hanzi: "返工", jyutping: "faan1 gung1", english: "to go to work" },
      { hanzi: "放工", jyutping: "fong3 gung1", english: "to get off work" },
      { hanzi: "瞓覺", jyutping: "fan3 gaau3", english: "to sleep" }
    ],
    examples: [
      { hanzi: "我七點起身。", jyutping: "ngo5 cat1 dim2 hei2 san1.", english: "I get up at seven." },
      { hanzi: "我返工之前食飯。", jyutping: "ngo5 faan1 gung1 zi1 cin4 sik6 faan6.", english: "I eat before going to work." },
      { hanzi: "我十一點瞓覺。", jyutping: "ngo5 sap6 jat1 dim2 fan3 gaau3.", english: "I go to sleep at eleven." }
    ]
  },
  {
    id: "time-words",
    level: 2,
    levelName: "Beginner",
    order: 34,
    title: "Yesterday, Today, Tomorrow",
    subtitle: "今日 / 聽日 / 琴日 / 而家 / 朝早 / 晏晝 / 夜晚",
    minutes: 5,
    intro: "Words for talking about days and times of day.",
    dialogue: [
      { speaker: "A", hanzi: "你琴日去咗邊度呀？", jyutping: "nei5 kam4 jat6 heoi3 zo2 bin1 dou6 aa3?", english: "Where did you go yesterday?" },
      { speaker: "B", hanzi: "我琴日喺屋企抖。今日先返工。", jyutping: "ngo5 kam4 jat6 hai2 uk1 kei2 tau2. gam1 jat6 sin1 faan1 gung1.", english: "I rested at home yesterday. Only went back to work today." },
      { speaker: "A", hanzi: "咁聽日朝早得唔得閒呀？", jyutping: "gam2 ting1 jat6 ziu1 zou2 dak1 m4 dak1 haan4 aa3?", english: "Then are you free tomorrow morning?" },
      { speaker: "B", hanzi: "朝早唔得，夜晚先得。", jyutping: "ziu1 zou2 m4 dak1, je6 maan5 sin1 dak1.", english: "Not in the morning — only in the evening." }
    ],
    vocab: [
      { hanzi: "今日", jyutping: "gam1 jat6", english: "today" },
      { hanzi: "聽日", jyutping: "ting1 jat6", english: "tomorrow" },
      { hanzi: "琴日", jyutping: "kam4 jat6", english: "yesterday" },
      { hanzi: "而家", jyutping: "ji4 gaa1", english: "now" },
      { hanzi: "朝早", jyutping: "ziu1 zou2", english: "morning" },
      { hanzi: "晏晝", jyutping: "aan3 zau3", english: "afternoon, noon" },
      { hanzi: "夜晚", jyutping: "je6 maan5", english: "night, evening" }
    ],
    examples: [
      { hanzi: "我今日好攰。", jyutping: "ngo5 gam1 jat6 hou2 gui6.", english: "I'm very tired today." },
      { hanzi: "聽日朝早見。", jyutping: "ting1 jat6 ziu1 zou2 gin3.", english: "See you tomorrow morning." },
      { hanzi: "我而家喺屋企。", jyutping: "ngo5 ji4 gaa1 hai2 uk1 kei2.", english: "I'm at home now." }
    ],
    notes: [
      {
        title: "Cantonese day words",
        body: "Cantonese uses its own words for days, different from Mandarin: 今日 (today), 聽日 (tomorrow, not 明日), 琴日 (yesterday, not 昨日)."
      },
      {
        title: "咗 (zo2) marks a finished action",
        body: "Add 咗 right after a verb for something completed: 去咗 (went), 食咗 (ate), 瞓咗 (slept). 你去咗邊度呀？ = \"Where did you go?\""
      },
      {
        title: "Times of day go first",
        body: "朝早 (morning) / 晏晝 (afternoon) / 夜晚 (evening) come before the rest: 聽日朝早 (tomorrow morning), 今日夜晚 (tonight)."
      }
    ]
  },
  {
    id: "making-plans",
    level: 2,
    levelName: "Beginner",
    order: 35,
    title: "Making Plans",
    subtitle: "一齊 / 去 / 聽日 / 有冇空 / 好呀 / 約",
    minutes: 5,
    intro: "How to invite a friend and arrange to do something together.",
    dialogue: [],
    vocab: [
      { hanzi: "一齊", jyutping: "jat1 cai4", english: "together" },
      { hanzi: "去", jyutping: "heoi3", english: "to go" },
      { hanzi: "聽日", jyutping: "ting1 jat6", english: "tomorrow" },
      { hanzi: "有冇空", jyutping: "jau5 mou5 hung1", english: "are you free?" },
      { hanzi: "好呀", jyutping: "hou2 aa3", english: "sure, okay (agreeing)" },
      { hanzi: "約", jyutping: "joek3", english: "to make an appointment, arrange" },
      { hanzi: "得閒", jyutping: "dak1 haan4", english: "free, have free time" }
    ],
    examples: [
      { hanzi: "你聽日有冇空？", jyutping: "nei5 ting1 jat6 jau5 mou5 hung1?", english: "Are you free tomorrow?" },
      { hanzi: "我哋一齊去食飯啦。", jyutping: "ngo5 dei6 jat1 cai4 heoi3 sik6 faan6 laa1.", english: "Let's go eat together." },
      { hanzi: "好呀，約你聽日。", jyutping: "hou2 aa3, joek3 nei5 ting1 jat6.", english: "Sure, let's arrange for tomorrow." }
    ]
  },
  {
    id: "at-the-doctor",
    level: 2,
    levelName: "Beginner",
    order: 36,
    title: "At the Doctor",
    subtitle: "醫生 / 睇醫生 / 唔舒服 / 發燒 / 頭痛 / 咳",
    minutes: 5,
    intro: "Telling a doctor how you feel when you are sick.",
    dialogue: [],
    vocab: [
      { hanzi: "醫生", jyutping: "ji1 sang1", english: "doctor" },
      { hanzi: "睇醫生", jyutping: "tai2 ji1 sang1", english: "to see a doctor" },
      { hanzi: "唔舒服", jyutping: "m4 syu1 fuk6", english: "unwell, sick" },
      { hanzi: "發燒", jyutping: "faat3 siu1", english: "to have a fever" },
      { hanzi: "頭痛", jyutping: "tau4 tung3", english: "headache" },
      { hanzi: "咳", jyutping: "kat1", english: "to cough" },
      { hanzi: "肚痛", jyutping: "tou5 tung3", english: "stomachache" }
    ],
    examples: [
      { hanzi: "我唔舒服，想睇醫生。", jyutping: "ngo5 m4 syu1 fuk6, soeng2 tai2 ji1 sang1.", english: "I'm unwell, I want to see a doctor." },
      { hanzi: "我發燒同頭痛。", jyutping: "ngo5 faat3 siu1 tung4 tau4 tung3.", english: "I have a fever and a headache." },
      { hanzi: "我咳咗幾日。", jyutping: "ngo5 kat1 zo2 gei2 jat6.", english: "I've been coughing for a few days." }
    ]
  },
  {
    id: "pharmacy",
    level: 2,
    levelName: "Beginner",
    order: 37,
    title: "At the Pharmacy",
    subtitle: "藥房 / 藥 / 感冒 / 止痛藥 / 一日食幾次",
    minutes: 5,
    intro: "Buying medicine and asking how to take it.",
    dialogue: [],
    vocab: [
      { hanzi: "藥房", jyutping: "joek6 fong2", english: "pharmacy" },
      { hanzi: "藥", jyutping: "joek6", english: "medicine" },
      { hanzi: "感冒", jyutping: "gam2 mou6", english: "cold (illness)" },
      { hanzi: "止痛藥", jyutping: "zi2 tung3 joek6", english: "painkiller" },
      { hanzi: "食藥", jyutping: "sik6 joek6", english: "to take medicine" },
      { hanzi: "一日", jyutping: "jat1 jat6", english: "one day, per day" },
      { hanzi: "幾次", jyutping: "gei2 ci3", english: "how many times" }
    ],
    examples: [
      { hanzi: "我感冒，想買藥。", jyutping: "ngo5 gam2 mou6, soeng2 maai5 joek6.", english: "I have a cold, I want to buy medicine." },
      { hanzi: "有冇止痛藥？", jyutping: "jau5 mou5 zi2 tung3 joek6?", english: "Do you have any painkillers?" },
      { hanzi: "呢隻藥一日食幾次？", jyutping: "ni1 zek3 joek6 jat1 jat6 sik6 gei2 ci3?", english: "How many times a day do I take this medicine?" }
    ]
  },
  {
    id: "bank-post",
    level: 2,
    levelName: "Beginner",
    order: 38,
    title: "Bank & Post Office",
    subtitle: "銀行 / 郵局 / 錢 / 換錢 / 寄信 / 郵票",
    minutes: 5,
    intro: "Simple errands at the bank and the post office.",
    dialogue: [],
    vocab: [
      { hanzi: "銀行", jyutping: "ngan4 hong4", english: "bank" },
      { hanzi: "郵局", jyutping: "jau4 guk2", english: "post office" },
      { hanzi: "錢", jyutping: "cin2", english: "money" },
      { hanzi: "換錢", jyutping: "wun6 cin2", english: "to change money, exchange currency" },
      { hanzi: "寄信", jyutping: "gei3 seon3", english: "to mail a letter" },
      { hanzi: "郵票", jyutping: "jau4 piu3", english: "stamp" }
    ],
    examples: [
      { hanzi: "銀行喺邊度？", jyutping: "ngan4 hong4 hai2 bin1 dou6?", english: "Where is the bank?" },
      { hanzi: "我想換錢。", jyutping: "ngo5 soeng2 wun6 cin2.", english: "I want to change money." },
      { hanzi: "我想喺郵局寄信，要郵票。", jyutping: "ngo5 soeng2 hai2 jau4 guk2 gei3 seon3, jiu3 jau4 piu3.", english: "I want to mail a letter at the post office, I need a stamp." }
    ]
  },
  {
    id: "hotel",
    level: 2,
    levelName: "Beginner",
    order: 39,
    title: "At the Hotel",
    subtitle: "酒店 / 房 / 訂房 / 鎖匙 / 幾多錢一晚 / 入住",
    minutes: 5,
    intro: "Checking in and asking about a hotel room.",
    dialogue: [],
    vocab: [
      { hanzi: "酒店", jyutping: "zau2 dim3", english: "hotel" },
      { hanzi: "房", jyutping: "fong2", english: "room" },
      { hanzi: "訂房", jyutping: "deng6 fong2", english: "to book a room" },
      { hanzi: "鎖匙", jyutping: "so2 si4", english: "key" },
      { hanzi: "一晚", jyutping: "jat1 maan5", english: "one night" },
      { hanzi: "入住", jyutping: "jap6 zyu6", english: "to check in" }
    ],
    examples: [
      { hanzi: "我想訂房。", jyutping: "ngo5 soeng2 deng6 fong2.", english: "I want to book a room." },
      { hanzi: "幾多錢一晚？", jyutping: "gei2 do1 cin2 jat1 maan5?", english: "How much per night?" },
      { hanzi: "我想入住，呢個係鎖匙。", jyutping: "ngo5 soeng2 jap6 zyu6, ni1 go3 hai6 so2 si4.", english: "I'd like to check in; this is the key." }
    ]
  },
  {
    id: "airport-travel",
    level: 2,
    levelName: "Beginner",
    order: 40,
    title: "Airport & Travel",
    subtitle: "機場 / 飛機 / 護照 / 行李 / 登機 / 去旅行",
    minutes: 5,
    intro: "Key words for the airport and for going on a trip.",
    dialogue: [],
    vocab: [
      { hanzi: "機場", jyutping: "gei1 coeng4", english: "airport" },
      { hanzi: "飛機", jyutping: "fei1 gei1", english: "airplane" },
      { hanzi: "護照", jyutping: "wu6 ziu3", english: "passport" },
      { hanzi: "行李", jyutping: "hang4 lei5", english: "luggage" },
      { hanzi: "登機", jyutping: "dang1 gei1", english: "to board (a plane)" },
      { hanzi: "去旅行", jyutping: "heoi3 leoi5 hang4", english: "to go travelling" }
    ],
    examples: [
      { hanzi: "我去機場搭飛機。", jyutping: "ngo5 heoi3 gei1 coeng4 daap3 fei1 gei1.", english: "I'm going to the airport to take a plane." },
      { hanzi: "唔該俾我睇你嘅護照。", jyutping: "m4 goi1 bei2 ngo5 tai2 nei5 ge3 wu6 ziu3.", english: "Please show me your passport." },
      { hanzi: "我聽日去旅行。", jyutping: "ngo5 ting1 jat6 heoi3 leoi5 hang4.", english: "I'm going travelling tomorrow." }
    ]
  },
  {
    id: "describing-people",
    level: 2,
    levelName: "Beginner",
    order: 41,
    title: "Describing People",
    subtitle: "高 / 矮 / 肥 / 瘦 / 靚 / 後生 / 老",
    minutes: 5,
    intro: "Adjectives for describing how someone looks.",
    dialogue: [],
    vocab: [
      { hanzi: "高", jyutping: "gou1", english: "tall" },
      { hanzi: "矮", jyutping: "ai2", english: "short (in height)" },
      { hanzi: "肥", jyutping: "fei4", english: "fat" },
      { hanzi: "瘦", jyutping: "sau3", english: "thin, slim" },
      { hanzi: "靚", jyutping: "leng3", english: "pretty, good-looking" },
      { hanzi: "後生", jyutping: "hau6 saang1", english: "young" },
      { hanzi: "老", jyutping: "lou5", english: "old (of people)" }
    ],
    examples: [
      { hanzi: "佢好高。", jyutping: "keoi5 hou2 gou1.", english: "He/she is very tall." },
      { hanzi: "佢個女好靚。", jyutping: "keoi5 go3 neoi2 hou2 leng3.", english: "Her daughter is very pretty." },
      { hanzi: "我嫲嫲好老。", jyutping: "ngo5 maa4 maa4 hou2 lou5.", english: "My grandma is very old." }
    ]
  },
  {
    id: "personality",
    level: 2,
    levelName: "Beginner",
    order: 42,
    title: "Personality",
    subtitle: "好人 / 惡 / 善良 / 聰明 / 勤力 / 懶",
    minutes: 5,
    intro: "Words to describe what someone is like.",
    dialogue: [],
    vocab: [
      { hanzi: "好人", jyutping: "hou2 jan4", english: "good person, kind person" },
      { hanzi: "惡", jyutping: "ok3", english: "fierce, strict" },
      { hanzi: "善良", jyutping: "sin6 loeng4", english: "kind-hearted" },
      { hanzi: "聰明", jyutping: "cung1 ming4", english: "smart, clever" },
      { hanzi: "勤力", jyutping: "kan4 lik6", english: "hardworking, diligent" },
      { hanzi: "懶", jyutping: "laan5", english: "lazy" }
    ],
    examples: [
      { hanzi: "佢係好人。", jyutping: "keoi5 hai6 hou2 jan4.", english: "He/she is a good person." },
      { hanzi: "我老師好惡。", jyutping: "ngo5 lou5 si1 hou2 ok3.", english: "My teacher is very strict." },
      { hanzi: "佢好聰明又勤力。", jyutping: "keoi5 hou2 cung1 ming4 jau6 kan4 lik6.", english: "He/she is smart and hardworking." }
    ]
  },
  {
    id: "measure-words",
    level: 2,
    levelName: "Beginner",
    order: 43,
    title: "Measure Words",
    subtitle: "個 / 隻 / 張 / 條 / 本 / 杯 / 件",
    minutes: 6,
    intro: "Classifiers go between a number and a noun in Cantonese.",
    dialogue: [],
    vocab: [
      { hanzi: "個", jyutping: "go3", english: "general classifier (people, things)" },
      { hanzi: "隻", jyutping: "zek3", english: "classifier for animals, one of a pair" },
      { hanzi: "張", jyutping: "zoeng1", english: "classifier for flat things (paper, tables)" },
      { hanzi: "條", jyutping: "tiu4", english: "classifier for long thin things (roads, fish)" },
      { hanzi: "本", jyutping: "bun2", english: "classifier for books" },
      { hanzi: "杯", jyutping: "bui1", english: "classifier for cups/glasses (a cup of)" },
      { hanzi: "件", jyutping: "gin6", english: "classifier for items/clothing" }
    ],
    examples: [
      { hanzi: "一個人。", jyutping: "jat1 go3 jan4.", english: "one person." },
      { hanzi: "三本書。", jyutping: "saam1 bun2 syu1.", english: "three books." },
      { hanzi: "我要一杯水。", jyutping: "ngo5 jiu3 jat1 bui1 seoi2.", english: "I want a glass of water." }
    ]
  },
  {
    id: "festivals-cny",
    level: 2,
    levelName: "Beginner",
    order: 44,
    title: "Lunar New Year",
    subtitle: "農曆新年 / 恭喜發財 / 利是 / 拜年 / 團年飯 / 煙花",
    minutes: 5,
    intro: "Words and greetings for Lunar New Year in Hong Kong.",
    dialogue: [],
    vocab: [
      { hanzi: "農曆新年", jyutping: "nung4 lik6 san1 nin4", english: "Lunar New Year" },
      { hanzi: "恭喜發財", jyutping: "gung1 hei2 faat3 coi4", english: "wishing you prosperity (New Year greeting)" },
      { hanzi: "利是", jyutping: "lai6 si6", english: "red packet (lucky money)" },
      { hanzi: "拜年", jyutping: "baai3 nin4", english: "to pay New Year visits" },
      { hanzi: "團年飯", jyutping: "tyun4 nin4 faan6", english: "reunion dinner" },
      { hanzi: "煙花", jyutping: "jin1 faa1", english: "fireworks" }
    ],
    examples: [
      { hanzi: "恭喜發財！", jyutping: "gung1 hei2 faat3 coi4!", english: "Happy New Year (wishing you prosperity)!" },
      { hanzi: "細路鍾意收利是。", jyutping: "sai3 lou6 zung1 ji3 sau1 lai6 si6.", english: "Kids love getting red packets." },
      { hanzi: "我哋一齊食團年飯。", jyutping: "ngo5 dei6 jat1 cai4 sik6 tyun4 nin4 faan6.", english: "We have reunion dinner together." }
    ]
  },
  {
    id: "emergencies",
    level: 2,
    levelName: "Beginner",
    order: 45,
    title: "Emergencies & Help",
    subtitle: "救命 / 幫手 / 報警 / 火警 / 醫院 / 小心",
    minutes: 5,
    intro: "Important words for getting help in an emergency.",
    dialogue: [],
    vocab: [
      { hanzi: "救命", jyutping: "gau3 meng6", english: "help! (save me)" },
      { hanzi: "幫手", jyutping: "bong1 sau2", english: "to help, give a hand" },
      { hanzi: "報警", jyutping: "bou3 ging2", english: "to call the police" },
      { hanzi: "火警", jyutping: "fo2 ging2", english: "fire (emergency)" },
      { hanzi: "醫院", jyutping: "ji1 jyun2", english: "hospital" },
      { hanzi: "小心", jyutping: "siu2 sam1", english: "be careful" }
    ],
    examples: [
      { hanzi: "救命呀！", jyutping: "gau3 meng6 aa3!", english: "Help!" },
      { hanzi: "唔該幫手報警。", jyutping: "m4 goi1 bong1 sau2 bou3 ging2.", english: "Please help me call the police." },
      { hanzi: "小心啲！", jyutping: "siu2 sam1 di1!", english: "Be careful!" }
    ]
  }
];
