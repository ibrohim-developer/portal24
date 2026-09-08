import type { NewsRepository } from "./repository";
import { categorySlugs, plainSpans } from "./types";
import type {
  Article,
  ArticleBlock,
  ArticleDetail,
  AuthorContact,
  AuthorProfile,
  CategorySlug,
  Highlight,
  Stat,
} from "./types";

/*
 * Fixtures standing in for the admin REST API, which does not exist yet.
 *
 * Copy is lifted verbatim from the Figma so the layout is exercised with real
 * headline lengths - invented placeholder text hides wrapping bugs that only
 * show up with genuine headlines.
 *
 * That copy is Russian, because the Figma is: these are stand-in stories, not
 * editorial content, and only the category names below are the site's own
 * Uzbek. Real Uzbek headlines arrive with the API, not by translating fixtures.
 *
 * Only this file is thrown away when the API lands.
 */

/*
 * Display names for the five categories.
 *
 * Spelled exactly as `strings.nav` spells them - a card's "#Taʼlim" and the
 * heading above it come from different modules and must not disagree. When the
 * admin API lands it supplies these and this table goes with the rest of the
 * file.
 */
const CATEGORY_NAMES: Record<CategorySlug, string> = {
  sport: "Sport",
  education: "Taʼlim",
  finance: "Moliya",
  eco: "Ekologiya",
  tech: "Texnologiyalar",
};

/** Fixed so static builds are byte-for-byte reproducible. */
const BASE_TIME = Date.parse("2026-09-03T09:00:00Z");

type Seed = [slug: CategorySlug, title: string];

const SEEDS: Seed[] = [
  ["sport", "Сборная Узбекистана завершила подготовку к историческому матчу чемпионата мира против Колумбии"],
  ["eco", "Специалисты зафиксировали улучшение качества воздуха после серии экологических инициатив"],
  ["education", "Raiffeisen Bank International выбрал Капиталбанк в качестве стратегического партнера на финансовом рынке Узбекистана"],
  ["sport", "Узбекистан вошел в число самых прогрессирующих сборных Азии за последние пять лет"],
  ["education", "Количество иностранных студентов в вузах страны достигло рекордного уровня"],
  ["finance", "Крупнейшие банки страны запускают новые цифровые финансовые сервисы"],
  ["tech", "Скорость мобильного интернета в Узбекистане выросла благодаря модернизации сетей"],
  ["eco", "В Ташкенте установят дополнительные станции мониторинга качества воздуха"],
  ["sport", "Тренерский штаб определился с основным составом на ближайший матч"],
  ["finance", "Спрос на безналичные платежи продолжает увеличиваться"],
  ["finance", "Крупнейшие банки страны готовят новые цифровые продукты для клиентов"],
  ["education", "Вузы страны переходят на новые стандарты международной аккредитации"],
  ["education", "Университеты и ИТ-индустрия запускают совместные лаборатории для студентов"],
  ["education", "Курс на глобальную интеграцию: как меняется высшее образование"],
  ["education", "Новые KPI для вузов: фокус на практические навыки и цифровизацию"],
  ["eco", "В Узбекистане запустят новые проекты по переработке отходов"],
  ["sport", "Болельщики раскупили большинство билетов на ближайший матч сборной"],
  ["finance", "Узбекистан увеличил объем международных резервов"],
  ["finance", "Объем международных резервов Узбекистана достиг нового максимума с начала года"],
  ["tech", "OpenAI представила новые инструменты для работы с ИИ"],
  ["eco", "Под Ташкентом выявили факт незаконного использования электроэнергии более чем на 3 млрд сумов"],
  ["education", "Университеты Узбекистана запускают новые международные программы"],
  ["education", "В школах Узбекистана планируют расширить преподавание точных наук"],
  /*
   * Below this line the headlines are ours, not the Figma's.
   *
   * The design's copy only ever had to fill a main-page block, which shows at
   * most six stories - #Технологии had two. A category page is a whole feed of
   * one category, so each one is topped up to nine here: a lead, the two cards
   * beside it, and two rows of three under the number of the day.
   *
   * Appended rather than interleaved. Every other feed slices this list from
   * the front, so adding to the end leaves the main page's lead story, its
   * "Свежие новости" rail and its "#Популярное" block exactly as they were.
   */
  ["tech", "Операторы связи начали тестирование сетей пятого поколения в крупных городах"],
  ["sport", "Сборная по дзюдо завоевала четыре медали на этапе Гран-при"],
  ["eco", "Площадь зеленых насаждений в столице выросла на четверть за три года"],
  ["finance", "Центральный банк сохранил ключевую ставку без изменений"],
  ["tech", "IT Park отчитался о рекордном экспорте технологических услуг"],
  ["education", "Педагогические вузы получат новые лаборатории и учебные центры"],
  ["eco", "В Приаралье высадили более миллиона саженцев саксаула"],
  ["sport", "В Ташкенте построят спортивный комплекс на десять тысяч мест"],
  ["tech", "Разработчики представили голосового помощника на узбекском языке"],
  ["finance", "Объем переводов через мобильные приложения вырос вдвое за год"],
  ["eco", "Узбекистан представил план сокращения выбросов до 2030 года"],
  ["tech", "Отечественные стартапы привлекли рекордный объем инвестиций"],
  ["sport", "Узбекские борцы завершили сбор перед чемпионатом Азии"],
  ["finance", "Малый бизнес получит доступ к льготным кредитам на оборудование"],
  ["tech", "Дата-центры страны переведут на возобновляемые источники энергии"],
  ["eco", "Раздельный сбор мусора внедрят еще в пяти городах страны"],
  ["sport", "Школьная футбольная лига охватит все регионы страны в новом сезоне"],
  ["tech", "Кибербезопасности начнут обучать студентов с первого курса"],
  ["finance", "Страховой рынок Узбекистана вырос на треть по итогам полугодия"],
  ["eco", "Ученые оценили состояние горных рек после аномально теплой зимы"],
  ["sport", "Федерация запускает программу поддержки молодых спортсменов"],
  ["tech", "Национальную платформу цифровых госуслуг запустят до конца года"],
];

/*
 * `categories` is read by the article's AuthorBlock and by the author page;
 * `role` and `bio` only by the author page.
 *
 * Slugs are written out rather than derived from the index, so the URLs the
 * AuthorBlock links to survive someone reordering this list. Copy is Russian
 * throughout, as everywhere else in these fixtures - see the note at the top.
 */
const AUTHORS: Array<{
  slug: string;
  name: string;
  role: string;
  bio: string;
  categories: CategorySlug[];
  contacts: AuthorContact[];
}> = [
  {
    slug: "dilshod-karimov",
    name: "Дилшод Каримов",
    role: "Спортивный обозреватель",
    bio: "Пишет о национальных сборных, школьном спорте и спортивной инфраструктуре — от бюджетов региональных федераций до того, как школьные секции переживают ремонт стадионов.\n\nДо прихода в редакцию восемь лет работал комментатором на региональном телевидении и вёл репортажи с юношеских первенств.",
    categories: ["sport", "education"],
    contacts: [
      { network: "instagram", href: "https://instagram.com/portal24uz" },
      { network: "telegram", href: "https://t.me/portal24uz" },
    ],
  },
  {
    slug: "nigora-azizova",
    name: "Нигора Азизова",
    role: "Корреспондент отдела экономики",
    bio: "Разбирает банковский сектор и экологическую повестку — от качества воздуха в Ташкенте до того, как обе темы сходятся в счетах за электроэнергию.\n\nСобирает мнения отраслевых экспертов и переводит сложные финансовые решения на понятный язык фактов и цифр.",
    categories: ["eco", "finance"],
    contacts: [{ network: "telegram", href: "https://t.me/portal24uz" }],
  },
  {
    slug: "timur-yusupov",
    name: "Тимур Юсупов",
    role: "Редактор технологического направления",
    bio: "Следит за телекомом, искусственным интеллектом и цифровыми сервисами банков. Регулярно тестирует новые продукты и разбирает, что за громкими анонсами стоит на самом деле.\n\nВедёт еженедельную рассылку о технологиях в Центральной Азии.",
    categories: ["tech", "finance"],
    contacts: [
      { network: "instagram", href: "https://instagram.com/portal24uz" },
      { network: "telegram", href: "https://t.me/portal24uz" },
    ],
  },
];

/**
 * Which author wrote article `index`.
 *
 * Assigned by beat rather than round-robin. The author page prints an author's
 * beats directly above their feed, so a sports correspondent holding a run of
 * #Финансы stories is visible as wrong the moment the page loads. Where two
 * authors share a beat the index alternates between them.
 */
// Takes a plain string because `Category.slug` is one now - the fixtures only
// ever pass their own five, but the type no longer says so.
function authorIndexFor(index: number, category: string): number {
  const matches = AUTHORS.flatMap((author, i) =>
    (author.categories as readonly string[]).includes(category) ? [i] : [],
  );
  // Every category in SEEDS has an author today; degrade rather than throw if
  // a future seed introduces one that does not.
  if (matches.length === 0) return index % AUTHORS.length;

  return matches[index % matches.length];
}

/** The shape both the AuthorBlock and the author page consume. */
function buildAuthorProfile(index: number): AuthorProfile {
  const author = AUTHORS[index];

  return {
    slug: author.slug,
    name: author.name,
    role: author.role,
    bio: author.bio,
    contacts: author.contacts,
    avatar: {
      url: "/img/placeholder.svg",
      alt: author.name,
      // 2x the 264px the author page draws it at; the AuthorBlock asks for 80.
      width: 528,
      height: 528,
    },
    categories: author.categories.map((slug) => ({
      slug,
      name: CATEGORY_NAMES[slug],
    })),
  };
}

function transliterate(title: string, id: number): string {
  const map: Record<string, string> = {
    а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z",
    и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r",
    с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "c", ч: "ch", ш: "sh", щ: "sch",
    ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
  };
  const slug = title
    .toLowerCase()
    .split("")
    .map((ch) => map[ch] ?? (/[a-z0-9]/.test(ch) ? ch : "-"))
    .join("")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .split("-")
    .slice(0, 7)
    .join("-");
  return `${slug}-${id}`;
}

function buildArticles(): Article[] {
  return SEEDS.map(([slug, title], i) => ({
    id: String(i + 1),
    slug: transliterate(title, i + 1),
    title,
    category: { slug, name: CATEGORY_NAMES[slug] },
    coverImage: {
      url: "/img/placeholder.svg",
      alt: title,
      width: 1200,
      height: 800,
    },
    // Staggered so the "latest" ordering is meaningful.
    publishedAt: new Date(BASE_TIME - i * 47 * 60 * 1000).toISOString(),
    author: {
      slug: AUTHORS[authorIndexFor(i, slug)].slug,
      name: AUTHORS[authorIndexFor(i, slug)].name,
    },
  }));
}

/*
 * One body, reused by every article.
 *
 * The block sequence is the Figma News Page (1852:19332) read top to bottom -
 * two paragraphs, a section heading, a callout, a full-width portrait photo,
 * a second callout, a second heading - so the page's spacing rules are all
 * exercised by whichever fixture you happen to open.
 *
 * The first six blocks are the design's own copy; the rest continues it in the
 * same register, because the Figma frame stops showing legible text below the
 * fold.
 */
const BODY: ArticleBlock[] = [
  {
    kind: "paragraph",
    spans: plainSpans("Самолёт получил уникальную ливрею с символикой национальной команды и стал одним из символов поддержки узбекского футбола."),
  },
  {
    kind: "paragraph",
    spans: plainSpans("Презентация воздушного судна прошла в Ташкенте. В мероприятии приняли участие представители авиакомпании, Федерации футбола Узбекистана, спортсмены и приглашённые гости."),
  },
  { kind: "heading", text: "Символ исторического достижения" },
  {
    kind: "paragraph",
    spans: plainSpans("Появление брендированного самолёта приурочено к одному из самых значимых событий в истории отечественного футбола —"),
  },
  {
    kind: "callout",
    text: "Первому выходу сборной Узбекистана на чемпионат мира.",
  },
  {
    kind: "paragraph",
    spans: plainSpans("По словам представителей авиакомпании, проект призван подчеркнуть важность этого достижения и выразить поддержку команде перед предстоящим турниром."),
  },
  {
    kind: "image",
    // 801x1000 in the design - a portrait crop, not the hero's ratio.
    image: {
      url: "/img/placeholder.svg",
      alt: "Ливрея с символикой сборной Узбекистана",
      width: 801,
      height: 1000,
    },
    caption: "Ливрея с символикой сборной.",
    credit: "Фото: Portal24",
  },
  {
    kind: "paragraph",
    spans: plainSpans("Ливрея разрабатывалась несколько месяцев: дизайнеры искали решение, которое останется узнаваемым в аэропорту любой страны."),
  },
  {
    kind: "callout",
    text: "На борту разместили имена всех игроков, вызванных в национальную сборную в отборочном цикле.",
  },
  {
    kind: "paragraph",
    spans: plainSpans("Самолёт уже включён в регулярное расписание и будет выполнять рейсы по международным направлениям. Специальную ливрею сохранят как минимум до конца турнира, после чего судьбу оформления определят по итогам сезона. В авиакомпании отметили, что переоформление прошло без вывода борта из эксплуатации."),
  },
  {
    kind: "paragraph",
    spans: plainSpans("Отдельное внимание уделили салону: пассажирам будут доступны тематические материалы о сборной, а бортовое меню дополнят блюдами национальной кухни."),
  },
  { kind: "heading", text: "Что дальше" },
  {
    kind: "paragraph",
    spans: plainSpans("Первый рейс с новой ливреей примет Ташкент — оттуда команда отправится на заключительный сбор перед стартом чемпионата мира."),
  },
  {
    kind: "paragraph",
    spans: plainSpans("Федерация футбола Узбекистана сообщила, что программа поддержки сборной не ограничится самолётом: в ближайшие месяцы запланирована серия совместных проектов с партнёрами, включая открытые тренировки, детские турниры и образовательные инициативы для молодых игроков."),
  },
];

const STATS: Array<Omit<Stat, "coverImage" | "href" | "publishedAt">> = [
  { id: "1", value: "7 из 10", description: "Университетов мира полностью переведут свои библиотеки в цифровой формат" },
  { id: "2", value: "250 млн", description: "Детей по всему миру не посещают школу" },
  { id: "3", value: "700 млн", description: "Человек живут менее чем на 24 000 сум в день" },
  { id: "4", value: "11 млн тонн", description: "Пластика ежегодно попадает в мировой океан" },
  { id: "5", value: "71%", description: "Мировых выбросов приходится всего на 100 компаний" },
  { id: "6", value: "30%", description: "Задач программистов уже частично выполняются ИИ" },
];

function buildStats(): Stat[] {
  return STATS.map((s, i) => ({
    ...s,
    coverImage: { url: "/img/placeholder.svg", alt: s.description, width: 612, height: 1000 },
    href: null,
    // A day apart, so the row shows a run of dates like the Figma does.
    publishedAt: new Date(BASE_TIME - i * 24 * 60 * 60 * 1000).toISOString(),
  }));
}

/*
 * "Главное за минуту" - short vertical videos.
 *
 * The design's covers are finished artwork: the headline and the "SO'ROVNOMA"
 * badge are burnt into the picture, so these titles never render. They are the
 * link's accessible name and nothing else, which is why they read as plain
 * descriptions rather than as the covers' own display copy.
 */
const HIGHLIGHTS: Array<Pick<Highlight, "id" | "title">> = [
  { id: "1", title: "Опрос: культура пользования общественным транспортом" },
  { id: "2", title: "Может ли хантавирус вызвать новую пандемию" },
  { id: "3", title: "Как изменились цены на жилье за последний год" },
  { id: "4", title: "Что ждет рынок труда после внедрения ИИ" },
  { id: "5", title: "Почему студенты выбирают заочное обучение" },
  { id: "6", title: "Ташкент переходит на электробусы: первые итоги" },
];

function buildHighlights(): Highlight[] {
  return HIGHLIGHTS.map((h) => ({
    ...h,
    coverImage: {
      url: "/img/placeholder.svg",
      alt: h.title,
      width: 612,
      height: 1088,
    },
    href: null,
  }));
}

export const mockNewsRepository: NewsRepository = {
  async getCategories() {
    // In the Figma nav order, which is the order the main-page blocks and
    // the footer both start from.
    return categorySlugs.map((slug) => ({
      slug,
      name: CATEGORY_NAMES[slug],
    }));
  },

  async getTopStories(limit) {
    return buildArticles().slice(0, limit);
  },

  async getPopular(limit) {
    // Deliberately a different slice than getTopStories so the two blocks do
    // not render identical cards while we are still on fixtures.
    return buildArticles().slice(4, 4 + limit);
  },

  async getByCategory(category, limit) {
    return buildArticles()
      .filter((a) => a.category.slug === category)
      .slice(0, limit);
  },

  async getStatOfTheDay() {
    return buildStats()[0] ?? null;
  },

  async getRecentStats(limit) {
    return buildStats().slice(1, 1 + limit);
  },

  async getHighlights(limit) {
    return buildHighlights().slice(0, limit);
  },

  async getSearchIndex() {
    return buildArticles();
  },

  async getArticle(slug) {
    const article = buildArticles().find((a) => a.slug === slug);
    if (!article) return null;

    const index = Number(article.id) - 1;

    return {
      ...article,
      author: buildAuthorProfile(authorIndexFor(index, article.category.slug)),
      coverCaption: "Новый самолет сборной Узбекистана.",
      coverCredit: "Фото: Portal24",
      // Offset from publication rather than from "now": under static export a
      // clock-relative value would be frozen at build time.
      updatedAt: new Date(
        Date.parse(article.publishedAt) + 30 * 60 * 1000,
      ).toISOString(),
      body: BODY,
    } satisfies ArticleDetail;
  },

  async getSlugs() {
    return buildArticles().map((a) => a.slug);
  },

  async getRelated(slug, limit) {
    return buildArticles()
      .filter((a) => a.slug !== slug)
      .slice(0, limit);
  },

  async getAuthor(slug) {
    const index = AUTHORS.findIndex((a) => a.slug === slug);
    return index === -1 ? null : buildAuthorProfile(index);
  },

  async getAuthorSlugs() {
    return AUTHORS.map((a) => a.slug);
  },

  async getPopularByAuthor(slug, limit) {
    // No popularity signal in the fixtures, so this takes a slice from the
    // middle of the author's run - the same trick getPopular uses, so the
    // block does not simply repeat the top of "Все статьи" below it.
    const own = buildArticles().filter((a) => a.author?.slug === slug);
    return own.slice(2, 2 + limit).concat(own.slice(0, 2)).slice(0, limit);
  },

  async getByAuthor(slug, limit) {
    // Already newest-first: buildArticles staggers publishedAt downwards.
    return buildArticles()
      .filter((a) => a.author?.slug === slug)
      .slice(0, limit);
  },
};
