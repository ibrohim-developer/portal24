import type { Locale } from "@/i18n/config";
import type { NewsRepository } from "./repository";
import type { Article, CategorySlug, Stat } from "./types";

/*
 * Fixtures standing in for the admin REST API, which does not exist yet.
 *
 * Copy is lifted verbatim from the Figma so the layout is exercised with real
 * headline lengths - invented placeholder text hides wrapping bugs that only
 * show up with genuine Russian headlines.
 *
 * Only this file is thrown away when the API lands.
 */

const CATEGORY_NAMES: Record<CategorySlug, Record<Locale, string>> = {
  sport: { ru: "Спорт", uz: "Sport", en: "Sport" },
  education: { ru: "Образование", uz: "Ta'lim", en: "Education" },
  finance: { ru: "Финансы", uz: "Moliya", en: "Finance" },
  eco: { ru: "Экология", uz: "Ekologiya", en: "Ecology" },
  tech: { ru: "Технологии", uz: "Texnologiya", en: "Technology" },
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
];

const AUTHORS = ["Дилшод Каримов", "Нигора Азизова", "Тимур Юсупов"];

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

function buildArticles(locale: Locale): Article[] {
  return SEEDS.map(([slug, title], i) => ({
    id: String(i + 1),
    slug: transliterate(title, i + 1),
    title,
    category: { slug, name: CATEGORY_NAMES[slug][locale] },
    coverImage: {
      url: "/img/placeholder.svg",
      alt: title,
      width: 1200,
      height: 800,
    },
    // Staggered so the "latest" ordering is meaningful.
    publishedAt: new Date(BASE_TIME - i * 47 * 60 * 1000).toISOString(),
    author: { slug: `author-${i % AUTHORS.length}`, name: AUTHORS[i % AUTHORS.length] },
  }));
}

const STATS: Array<Omit<Stat, "coverImage" | "href">> = [
  { id: "1", value: "7 из 10", description: "Университетов мира полностью переведут свои библиотеки в цифровой формат" },
  { id: "2", value: "250 млн", description: "Детей по всему миру не посещают школу" },
  { id: "3", value: "700 млн", description: "Человек живут менее чем на 24 000 сум в день" },
  { id: "4", value: "11 млн тонн", description: "Пластика ежегодно попадает в мировой океан" },
  { id: "5", value: "71%", description: "Мировых выбросов приходится всего на 100 компаний" },
  { id: "6", value: "30%", description: "Задач программистов уже частично выполняются ИИ" },
];

function buildStats(): Stat[] {
  return STATS.map((s) => ({
    ...s,
    coverImage: { url: "/img/placeholder.svg", alt: s.description, width: 612, height: 1000 },
    href: null,
  }));
}

export const mockNewsRepository: NewsRepository = {
  async getTopStories(locale, limit) {
    return buildArticles(locale).slice(0, limit);
  },

  async getPopular(locale, limit) {
    // Deliberately a different slice than getTopStories so the two blocks do
    // not render identical cards while we are still on fixtures.
    return buildArticles(locale).slice(4, 4 + limit);
  },

  async getByCategory(locale, category, limit) {
    return buildArticles(locale)
      .filter((a) => a.category.slug === category)
      .slice(0, limit);
  },

  async getStatOfTheDay() {
    return buildStats()[0] ?? null;
  },

  async getRecentStats(_locale, limit) {
    return buildStats().slice(1, 1 + limit);
  },
};
