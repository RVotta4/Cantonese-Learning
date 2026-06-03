/* ===========================================================
   Cantonese Learning — story content

   Single source of truth for stories. To add a story, copy an
   object below and edit the fields. Stored as a JS file (not
   JSON) so it works online AND when opened locally.

   Each story has:
     words      — target words highlighted in the text
     sentences  — the story, one line at a time (hanzi/jyutping/english)

   category: "beginner" (common-word stories) or "custom"
   (built around special words you provide).
   =========================================================== */

window.STORIES = [
  {
    id: "a-morning-greeting",
    level: 1,
    category: "beginner",
    title: "A Morning Greeting",
    titleJyutping: "zou2 san4",
    blurb: "Two people meet in the morning and introduce themselves.",
    minutes: 2,
    words: [
      { hanzi: "早晨", jyutping: "zou2 san4", english: "good morning" },
      { hanzi: "你好", jyutping: "nei5 hou2", english: "hello" },
      { hanzi: "多謝", jyutping: "do1 ze6", english: "thank you" },
      { hanzi: "名", jyutping: "meng2", english: "name" },
      { hanzi: "認識", jyutping: "jing6 sik1", english: "to know / to meet" }
    ],
    sentences: [
      { hanzi: "早晨！", jyutping: "zou2 san4!", english: "Good morning!" },
      { hanzi: "你好嗎？", jyutping: "nei5 hou2 maa3?", english: "How are you?" },
      { hanzi: "我幾好，多謝。", jyutping: "ngo5 gei2 hou2, do1 ze6.", english: "I'm very well, thank you." },
      { hanzi: "你叫咩名呀？", jyutping: "nei5 giu3 me1 meng2 aa3?", english: "What's your name?" },
      { hanzi: "我叫小明。", jyutping: "ngo5 giu3 siu2 ming4.", english: "My name is Siu Ming." },
      { hanzi: "好高興認識你！", jyutping: "hou2 gou1 hing3 jing6 sik1 nei5!", english: "Nice to meet you!" }
    ]
  },
  {
    id: "my-family",
    level: 2,
    category: "beginner",
    title: "My Family",
    titleJyutping: "ngo5 ge3 gaa1 ting4",
    blurb: "A short introduction to a family and what they do.",
    minutes: 2,
    words: [
      { hanzi: "家庭", jyutping: "gaa1 ting4", english: "family" },
      { hanzi: "哥哥", jyutping: "go4 go1", english: "older brother" },
      { hanzi: "妹妹", jyutping: "mui6 mui2", english: "younger sister" },
      { hanzi: "醫生", jyutping: "ji1 sang1", english: "doctor" },
      { hanzi: "煮飯", jyutping: "zyu2 faan6", english: "to cook" }
    ],
    sentences: [
      { hanzi: "我有一個大家庭。", jyutping: "ngo5 jau5 jat1 go3 daai6 gaa1 ting4.", english: "I have a big family." },
      { hanzi: "我有兩個哥哥。", jyutping: "ngo5 jau5 loeng5 go3 go4 go1.", english: "I have two older brothers." },
      { hanzi: "我有一個妹妹。", jyutping: "ngo5 jau5 jat1 go3 mui6 mui2.", english: "I have one younger sister." },
      { hanzi: "我爸爸係醫生。", jyutping: "ngo5 baa4 baa1 hai6 ji1 sang1.", english: "My dad is a doctor." },
      { hanzi: "我媽媽鍾意煮飯。", jyutping: "ngo5 maa4 maa1 zung1 ji3 zyu2 faan6.", english: "My mum likes to cook." },
      { hanzi: "我好愛我嘅家人。", jyutping: "ngo5 hou2 oi3 ngo5 ge3 gaa1 jan4.", english: "I love my family very much." }
    ]
  },
  {
    id: "at-the-tea-house",
    level: 2,
    category: "beginner",
    title: "At the Tea House",
    titleJyutping: "jam2 caa4",
    blurb: "Ordering dim sum and tea, then asking for the bill.",
    minutes: 2,
    words: [
      { hanzi: "飲茶", jyutping: "jam2 caa4", english: "yum cha / drink tea" },
      { hanzi: "點心", jyutping: "dim2 sam1", english: "dim sum" },
      { hanzi: "蝦餃", jyutping: "haa1 gaau2", english: "shrimp dumpling" },
      { hanzi: "好食", jyutping: "hou2 sik6", english: "delicious" },
      { hanzi: "埋單", jyutping: "maai4 daan1", english: "the bill" }
    ],
    sentences: [
      { hanzi: "今日我哋去飲茶。", jyutping: "gam1 jat6 ngo5 dei6 heoi3 jam2 caa4.", english: "Today we go for yum cha." },
      { hanzi: "唔該，我要一壺普洱。", jyutping: "m4 goi1, ngo5 jiu3 jat1 wu4 pou2 lei2.", english: "Excuse me, I'd like a pot of pu'er tea." },
      { hanzi: "我鍾意食蝦餃。", jyutping: "ngo5 zung1 ji3 sik6 haa1 gaau2.", english: "I like to eat shrimp dumplings." },
      { hanzi: "呢啲點心好好食。", jyutping: "ni1 di1 dim2 sam1 hou2 hou2 sik6.", english: "This dim sum is delicious." },
      { hanzi: "唔該埋單。", jyutping: "m4 goi1 maai4 daan1.", english: "The bill, please." }
    ]
  },
  {
    id: "buying-fruit",
    level: 2,
    category: "beginner",
    title: "Buying Fruit",
    titleJyutping: "maai5 saang1 gwo2",
    blurb: "A trip to the market to buy apples and pay.",
    minutes: 2,
    words: [
      { hanzi: "街市", jyutping: "gaai1 si5", english: "wet market" },
      { hanzi: "生果", jyutping: "saang1 gwo2", english: "fruit" },
      { hanzi: "蘋果", jyutping: "ping4 gwo2", english: "apple" },
      { hanzi: "幾錢", jyutping: "gei2 cin2", english: "how much" },
      { hanzi: "蚊", jyutping: "man1", english: "dollar" }
    ],
    sentences: [
      { hanzi: "我去街市買生果。", jyutping: "ngo5 heoi3 gaai1 si5 maai5 saang1 gwo2.", english: "I go to the market to buy fruit." },
      { hanzi: "啲蘋果幾錢呀？", jyutping: "di1 ping4 gwo2 gei2 cin2 aa3?", english: "How much are the apples?" },
      { hanzi: "五蚊一個。", jyutping: "ng5 man1 jat1 go3.", english: "Five dollars each." },
      { hanzi: "我要三個。", jyutping: "ngo5 jiu3 saam1 go3.", english: "I'd like three." },
      { hanzi: "多謝，呢度十五蚊。", jyutping: "do1 ze6, ni1 dou6 sap6 ng5 man1.", english: "Thank you, here's fifteen dollars." }
    ]
  },
  {
    id: "my-day",
    level: 2,
    category: "beginner",
    title: "My Day",
    titleJyutping: "ngo5 ge3 jat1 jat6",
    blurb: "A simple daily routine from morning to night.",
    minutes: 2,
    words: [
      { hanzi: "起身", jyutping: "hei2 san1", english: "to get up" },
      { hanzi: "早餐", jyutping: "zou2 caan1", english: "breakfast" },
      { hanzi: "返工", jyutping: "faan1 gung1", english: "go to work" },
      { hanzi: "屋企", jyutping: "uk1 kei2", english: "home" },
      { hanzi: "瞓覺", jyutping: "fan3 gaau3", english: "to sleep" }
    ],
    sentences: [
      { hanzi: "我朝早七點起身。", jyutping: "ngo5 ziu1 zou2 cat1 dim2 hei2 san1.", english: "I get up at seven in the morning." },
      { hanzi: "我食完早餐就返工。", jyutping: "ngo5 sik6 jyun4 zou2 caan1 zau6 faan1 gung1.", english: "After breakfast I go to work." },
      { hanzi: "晏晝我食午飯。", jyutping: "aan3 zau3 ngo5 sik6 ng5 faan6.", english: "At midday I eat lunch." },
      { hanzi: "夜晚我返屋企。", jyutping: "je6 maan5 ngo5 faan1 uk1 kei2.", english: "In the evening I go home." },
      { hanzi: "我鍾意睇電視。", jyutping: "ngo5 zung1 ji3 tai2 din6 si6.", english: "I like to watch TV." },
      { hanzi: "我十一點瞓覺。", jyutping: "ngo5 sap6 jat1 dim2 fan3 gaau3.", english: "I go to sleep at eleven." }
    ]
  },

  /* ================= CUSTOM · from your word bank ================= */
  {
    id: "robbie-at-the-bank",
    level: 2,
    category: "custom",
    title: "Robbie at the Bank",
    titleJyutping: "ngo5 heoi3 ngan4 hong4",
    blurb: "Robbie opens an account, saves some cash, and asks about interest.",
    minutes: 2,
    words: [
      { hanzi: "銀行", jyutping: "ngan4 hong4", english: "bank" },
      { hanzi: "開戶", jyutping: "hoi1 wu6", english: "to open an account" },
      { hanzi: "存錢", jyutping: "cyun4 cin2", english: "to save money" },
      { hanzi: "現金", jyutping: "jin6 gam1", english: "cash" },
      { hanzi: "利息", jyutping: "lei6 sik1", english: "interest" }
    ],
    sentences: [
      { hanzi: "今日我去銀行。", jyutping: "gam1 jat6 ngo5 heoi3 ngan4 hong4.", english: "Today I go to the bank." },
      { hanzi: "我想開戶。", jyutping: "ngo5 soeng2 hoi1 wu6.", english: "I want to open an account." },
      { hanzi: "我有好多現金。", jyutping: "ngo5 jau5 hou2 do1 jin6 gam1.", english: "I have a lot of cash." },
      { hanzi: "我想存錢。", jyutping: "ngo5 soeng2 cyun4 cin2.", english: "I want to save money." },
      { hanzi: "請問有冇利息呀？", jyutping: "cing2 man6 jau5 mou5 lei6 sik1 aa3?", english: "May I ask, is there interest?" },
      { hanzi: "多謝，唔該晒！", jyutping: "do1 ze6, m4 goi1 saai3!", english: "Thanks, thank you very much!" }
    ]
  },
  {
    id: "robbie-checks-in",
    level: 2,
    category: "custom",
    title: "Robbie Checks In",
    titleJyutping: "zyu6 zau2 dim3",
    blurb: "Robbie books a hotel room and asks a few questions at the front desk.",
    minutes: 2,
    words: [
      { hanzi: "訂", jyutping: "deng6", english: "to book" },
      { hanzi: "房", jyutping: "fong2", english: "room" },
      { hanzi: "雙人房", jyutping: "soeng1 jan4 fong2", english: "double room" },
      { hanzi: "標準房", jyutping: "biu1 zeon2 fong2", english: "standard room" },
      { hanzi: "退房", jyutping: "teoi3 fong2", english: "to check out" }
    ],
    sentences: [
      { hanzi: "我今日想訂房。", jyutping: "ngo5 gam1 jat6 soeng2 deng6 fong2.", english: "Today I want to book a room." },
      { hanzi: "我想要一間雙人房。", jyutping: "ngo5 soeng2 jiu3 jat1 gaan1 soeng1 jan4 fong2.", english: "I'd like a double room." },
      { hanzi: "呢間房幾大呀？", jyutping: "ni1 gaan1 fong2 gei2 daai6 aa3?", english: "How big is this room?" },
      { hanzi: "呢間係標準房。", jyutping: "ni1 gaan1 hai6 biu1 zeon2 fong2.", english: "This is a standard room." },
      { hanzi: "幾點退房呀？", jyutping: "gei2 dim2 teoi3 fong2 aa3?", english: "What time is checkout?" },
      { hanzi: "好，唔該晒！", jyutping: "hou2, m4 goi1 saai3!", english: "Great, thank you very much!" }
    ]
  },
  {
    id: "robbie-pays-the-bill",
    level: 2,
    category: "custom",
    title: "Dinner & the Bill",
    titleJyutping: "maai4 daan1",
    blurb: "Robbie and a friend enjoy dinner, then settle the bill.",
    minutes: 2,
    words: [
      { hanzi: "餐廳", jyutping: "caan1 teng1", english: "restaurant" },
      { hanzi: "好食", jyutping: "hou2 sik6", english: "delicious" },
      { hanzi: "貴", jyutping: "gwai3", english: "expensive" },
      { hanzi: "埋單", jyutping: "maai4 daan1", english: "to pay the bill" },
      { hanzi: "我請", jyutping: "ngo5 ceng2", english: "my treat" }
    ],
    sentences: [
      { hanzi: "今晚我哋去餐廳食飯。", jyutping: "gam1 maan1 ngo5 dei6 heoi3 caan1 teng1 sik6 faan6.", english: "Tonight we go to a restaurant for dinner." },
      { hanzi: "啲嘢好好食。", jyutping: "di1 je5 hou2 hou2 sik6.", english: "The food is very delicious." },
      { hanzi: "唔該，埋單。", jyutping: "m4 goi1, maai4 daan1.", english: "Excuse me, the bill please." },
      { hanzi: "有啲貴。", jyutping: "jau5 di1 gwai3.", english: "It's a bit expensive." },
      { hanzi: "唔緊要，我請！", jyutping: "m4 gan2 jiu3, ngo5 ceng2!", english: "Never mind, my treat!" },
      { hanzi: "多謝晒！", jyutping: "do1 ze6 saai3!", english: "Thank you very much!" }
    ]
  },
  {
    id: "robbie-rainy-saturday",
    level: 2,
    category: "custom",
    title: "A Rainy Saturday",
    titleJyutping: "lok6 jyu5 ge3 sing1 kei4 luk6",
    blurb: "It rains all day, so Robbie stays in and watches a movie.",
    minutes: 2,
    words: [
      { hanzi: "今日", jyutping: "gam1 jat6", english: "today" },
      { hanzi: "落雨", jyutping: "lok6 jyu5", english: "to rain" },
      { hanzi: "焗", jyutping: "guk6", english: "humid / stuffy" },
      { hanzi: "得閒", jyutping: "dak1 haan4", english: "free / available" },
      { hanzi: "電影", jyutping: "din6 jing2", english: "movie" }
    ],
    sentences: [
      { hanzi: "今日落雨。", jyutping: "gam1 jat6 lok6 jyu5.", english: "Today it's raining." },
      { hanzi: "好焗呀！", jyutping: "hou2 guk6 aa3!", english: "It's so humid!" },
      { hanzi: "今日我得閒。", jyutping: "gam1 jat6 ngo5 dak1 haan4.", english: "Today I'm free." },
      { hanzi: "我喺屋企睇電影。", jyutping: "ngo5 hai2 uk1 kei2 tai2 din6 jing2.", english: "I watch a movie at home." },
      { hanzi: "真係好好呀！", jyutping: "zan1 hai6 hou2 hou2 aa3!", english: "It's really great!" }
    ]
  },
  {
    id: "robbie-family-jobs",
    level: 2,
    category: "custom",
    title: "My Family & Their Jobs",
    titleJyutping: "ngo5 ge3 gaa1 jan4",
    blurb: "Robbie introduces his family and what each of them does.",
    minutes: 2,
    words: [
      { hanzi: "爸爸", jyutping: "baa4 baa1", english: "father" },
      { hanzi: "媽媽", jyutping: "maa4 maa1", english: "mother" },
      { hanzi: "老師", jyutping: "lou5 si1", english: "teacher" },
      { hanzi: "醫生", jyutping: "ji1 sang1", english: "doctor" },
      { hanzi: "律師", jyutping: "leot6 si1", english: "lawyer" }
    ],
    sentences: [
      { hanzi: "呢個係我爸爸。", jyutping: "ni1 go3 hai6 ngo5 baa4 baa1.", english: "This is my dad." },
      { hanzi: "佢係老師。", jyutping: "keoi5 hai6 lou5 si1.", english: "He is a teacher." },
      { hanzi: "我媽媽係醫生。", jyutping: "ngo5 maa4 maa1 hai6 ji1 sang1.", english: "My mum is a doctor." },
      { hanzi: "我大佬係律師。", jyutping: "ngo5 daai6 lou2 hai6 leot6 si1.", english: "My older brother is a lawyer." },
      { hanzi: "我好愛我嘅家人。", jyutping: "ngo5 hou2 oi3 ngo5 ge3 gaa1 jan4.", english: "I love my family very much." }
    ]
  }
];
