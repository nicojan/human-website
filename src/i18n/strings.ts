/*
 * strings.ts — UI chrome strings (nav, footer, labels) keyed by locale.
 * Content (pages, posts, etc.) lives in markdown; this file is only for
 * recurring chrome that isn't worth putting in a content collection.
 */

export type Locale = 'en' | 'zh';

export const LOCALES: Locale[] = ['en', 'zh'];
export const DEFAULT_LOCALE: Locale = 'en';

export const HTML_LANG: Record<Locale, string> = {
  en: 'en-CA',
  zh: 'zh-Hant',
};

export const LOCALE_DISPLAY: Record<Locale, { native: string; label: string }> = {
  en: { native: 'English', label: 'English' },
  zh: { native: '繁體中文', label: 'Traditional Chinese' },
};

export const STRINGS = {
  en: {
    brand: {
      wordmark: 'Human,',
      descriptor: 'an Education Collective',
    },
    nav: {
      home: 'Home',
      about: 'About',
      teach: 'What We Teach',
      blog: 'Blog',
      faq: 'FAQ',
      words: 'Useful Words',
      contact: 'Contact',
    },
    footer: {
      tagline: 'An education collective for students who want to learn how to think, not just what to think.',
      copyright: (year: number) => `© ${year} Human Education Collective Ltd.`,
      privacy: 'Privacy',
      contact: 'Contact',
      langSwitchTo: 'Read in 繁體中文',
    },
    a11y: {
      skipToContent: 'Skip to main content',
      mainNav: 'Main navigation',
      languageSwitcher: 'Language',
      backToBlog: '← Back to all posts',
      readMore: 'Read',
    },
    meta: {
      titleSuffix: 'Human,',
      siteDescription: 'An education collective for students who want to learn how to think, not just what to think. English literature, writing, and critical thinking through inquiry-based methods — online, from Vancouver.',
    },
    contact: {
      heading: 'Get in touch',
      email: 'hi@nicojan.com',
      labels: {
        email: 'Email',
        instagram: 'Instagram',
        whatsapp: 'WhatsApp',
        facebook: 'Facebook',
        wechat: 'WeChat',
      },
    },
  },
  zh: {
    brand: {
      wordmark: '人本・共學社',
      descriptor: '一個教育共學社',
    },
    nav: {
      home: '首頁',
      about: '關於',
      teach: '教學內容',
      blog: '文章',
      faq: '常見問題',
      words: '字詞筆記',
      contact: '聯絡',
    },
    footer: {
      tagline: '一個教育共學社，陪伴學生學會思考，而不是只記住答案。',
      copyright: (year: number) => `© ${year} Human Education Collective Ltd.`,
      privacy: '隱私政策',
      contact: '聯絡',
      langSwitchTo: 'Read in English',
    },
    a11y: {
      skipToContent: '跳至主要內容',
      mainNav: '主選單',
      languageSwitcher: '語言',
      backToBlog: '← 返回文章列表',
      readMore: '閱讀',
    },
    meta: {
      titleSuffix: '人本・共學社',
      siteDescription: '一個教育共學社，陪伴學生學會思考。英文文學、寫作、與批判思考，透過探究式學習在線進行。',
    },
    contact: {
      heading: '與我們聯繫',
      email: 'hi@nicojan.com',
      labels: {
        email: '電子郵件',
        instagram: 'Instagram',
        whatsapp: 'WhatsApp',
        facebook: 'Facebook',
        wechat: '微信',
      },
    },
  },
} as const;

export type Strings = typeof STRINGS['en'];
