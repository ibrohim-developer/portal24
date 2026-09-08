/**
 * Every string the interface draws.
 *
 * The site publishes in Uzbek only, so this is a plain module of copy rather
 * than a dictionary keyed by locale - there is no second language to fall back
 * to, no loader, and no route segment carrying a language code. Editing a
 * string here changes it everywhere it is drawn.
 *
 * Uzbek is written with the modifier-letter apostrophes here - turned comma
 * above (ʻ) in "Oʻzbekiston" and apostrophe (ʼ) in "Taʼlim" - not the
 * straight quote a keyboard produces. Keep them when editing.
 */
export const strings = {
  site: {
    name: "Portal24",
    tagline: "Oʻzbekistonning asosiy yangiliklari"
  },
  nav: {
    popular: "Ommabop",
    sport: "Sport",
    eco: "Ekologiya",
    education: "Taʼlim",
    finance: "Moliya",
    tech: "Texnologiyalar",
    about: "Biz haqimizda",
    telegram: "Telegram",
    search: "Qidirish",
    searchPlaceholder: "Yangiliklar boʼyicha qidiruv...",
    menu: "Menyu",
    close: "Yopish"
  },
  sections: {
    fresh: "Soʻnggi yangiliklar",
    popular: "#Ommabop",
    numberOfDay: "Kun raqami",
    recentNumbers: "Soʻnggi kunlar raqamlari",
    minute: "Bir daqiqada asosiysi",
    seeAll: "Barchasini koʻrish",
    showMore: "Yana koʻrsatish",
    read: "Oʻqish"
  },
  article: {
    updated: "Yangilandi",
    authorLabel: "Maqola muallifi",
    authorCta: "Muallifning boshqa maqolalari",
    readAlso: "Shuningdek oʻqing",
    dailyPick: "Kun tanlovi"
  },
  author: {
    label: "Muallif",
    bioTitle: "Oʻzim haqimda",
    contactsTitle: "Bogʻlanish uchun",
    popularTitle: "Ommabop maqolalar",
    allTitle: "Barcha maqolalar",
    empty: "Muallifda hozircha eʼlon qilingan materiallar yoʻq."
  },
  popular: {
    description: "Portal24 oʻquvchilari eng koʻp oʻqigan materiallar.",
    empty: "Hozircha ommabop materiallar yoʻq."
  },
  category: {
    /** `{category}` is replaced with the section name by the page. */
    description: "Portal24ning «{category}» boʻlimidagi materiallar.",
    empty: "Bu boʻlimda hozircha materiallar yoʻq."
  },
  search: {
    title: "Qidirish",
    description: "Portal24 materiallari boʻyicha qidiruv.",
    hint: "Material topish uchun soʻz yoki iborani kiriting.",
    /** `{query}` in both of these is replaced with what the reader typed. */
    results: "«{query}» boʻyicha natijalar",
    empty: "«{query}» soʻrovingiz boʻyicha hech narsa topilmadi",
    emptyHint: "Balki xatolik bilan yozilgandir yoki bunday maqola hali yoʻq",
    popularTitle: "Hafta davomida ommabop",
    suggestions: {
      worldCup: "Jahon chempionati",
      ai: "Sunʼiy intellekt",
      airTashkent: "Toshkent havosi",
      inflation: "Inflyatsiya"
    }
  },
  about: {
    title: "Portal24 — Oʻzbekistonning mustaqil internet nashri.",
    focusIntro: "Tahririyat quyidagi mavzularga alohida eʼtibor qaratadi:",
    focus: {
      eco: "Ekologiya",
      education: "Taʼlim",
      tech: "Texnologiya",
      finance: "Moliya"
    },
    coverage: "Shuningdek, har kuni Oʻzbekiston, Markaziy Osiyo mamlakatlari va dunyodagi dolzarb voqealarni yoritib boradi.",
    platformsTitle: "Platformalar va tillar",
    platformsText: "Portal24 materiallarni rus va oʻzbek tillarida chop etadi. Biz oʻzimizning raqamli platformalarimizda ishlaymiz, jumladan:",
    goalLabel: "Bizning maqsadimiz",
    goalValue: "Ishonchlilik",
    goalText: "Oʻquvchilarga oʻz vaqtida, tekshirilgan va ishonchli maʼlumot yetkazish",
    legalTitle: "Huquqiy maʼlumot",
    legalText: "Oʻzbekiston Respublikasi Prezidenti Administratsiyasi huzuridagi Axborot va ommaviy kommunikatsiyalar agentligida roʻyxatdan oʻtgan. Internet-OAV roʻyxatdan oʻtganligi toʻgʻrisidagi guvohnoma №2588770, 2024-yil 2-oktabr.",
    editorLabel: "Bosh muharrir",
    editorName: "Qadamov Javohir",
    mediaKit: {
      title: "Mediakit",
      download: "Yuklab olish",
      items: [
        {
          title: "Loyiha va raqamlar haqida",
          text: "Biz kimmiz, asosiy koʻrsatkichlar, qamrov va auditoriyamiz hajmi"
        },
        {
          title: "Auditoriya portreti",
          text: "Batafsil demografiya (jins, yosh, hudud) va oʻquvchilarimiz qiziqishlari"
        },
        {
          title: "Reklama formatlari",
          text: "Tayyor integratsiya variantlari — native postlar va bannerlardan yirik maxsus loyihalargacha"
        },
        {
          title: "Narxlar va shartlar",
          text: "Dolzarb narxlar, paket takliflari va amalga oshirish muddatlari"
        },
        {
          title: "Bizning keyslarimiz",
          text: "Natijalari raqamlarda koʻrsatilgan muvaffaqiyatli reklama kampaniyalari namunalari"
        }
      ]
    }
  },
  footer: {
    telegramPitch: "Barcha asosiy voqealar real vaqtda — Telegram kanalimizda.",
    telegramCta: "Obuna boʻlish",
    sectionsTitle: "Boʻlimlar",
    editorialTitle: "Tahririyat",
    aboutPublication: "Nashr haqida",
    mediaKit: "Mediakitni yuklab olish",
    socialTitle: "Ijtimoiy tarmoqlarda",
    /*
     * The three lines below are still Russian, deliberately.
     *
     * They quote a media-registration certificate and name the editor-in-chief,
     * and a machine translation of a legal notice is worse than no translation.
     * The About page carries an Uzbek rendering of the same certificate in
     * `about.legalText`; replace these only with wording the editorial office
     * signs off on, not with a copy of that.
     */
    legal: "PORTAL24 — зарегистрировано в Агентстве информации и массовых коммуникаций при Администрации Президента Республики Узбекистан. Свидетельство о регистрации интернет-СМИ №2588770 от 02.10.2024",
    founder: "Учредитель: «AXBOROT MEDIA» MCHJ",
    editor: "Главный редактор: Кадамов Жавохир Азизбекович"
  },
  /*
   * The error boundaries - app/error.tsx and app/global-error.tsx.
   *
   * Written for the reader rather than the operator. The failure this stands
   * in for is almost always the CMS being unreachable, which nobody visiting
   * the site can act on beyond waiting, so the copy says "try again" and not
   * what broke. The digest is the one operator-facing thing on the page: it
   * matches the entry the server logged, so a reader who quotes it gives
   * support something to search for.
   *
   * Not read by the editorial office yet, like the rest of the Uzbek here.
   */
  error: {
    title: "Kechirasiz, nimadir notoʻgʻri ketdi",
    text:
      "Sahifani yuklab boʻlmadi. Bir necha soniyadan soʻng qayta urinib koʻring. Muammo bartaraf etilmasa, biz bilan bogʻlaning.",
    retry: "Qayta urinish",
    home: "Bosh sahifaga",
    /** Introduces the Telegram link under the rule. */
    contactLead: "Muammo davom etsa:",
    contactTelegram: "Telegram kanalimiz"
  },
  a11y: {
    home: "Portal24 — bosh sahifaga",
    mainNav: "Asosiy navigatsiya",
    advertising: "Reklama",
    prev: "Orqaga",
    next: "Oldinga"
  }
};
