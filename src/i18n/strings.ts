/*
 * strings.ts — bilingual UI chrome strings.
 *
 * The site is bilingual on every URL: each piece of chrome (nav, footer,
 * labels) ships English and Traditional Chinese side-by-side. This file
 * holds both in one place.
 */

export interface BilingualText {
  en: string;
  zh: string;
}

interface NavItem extends BilingualText {
  href: string;
}

export const NAV_ITEMS: NavItem[] = [
  { href: '/about',         en: 'About',         zh: '關於' },
  { href: '/what-we-teach', en: 'What We Teach', zh: '教學內容' },
  { href: '/blog',          en: 'Blog',          zh: '文章' },
  { href: '/useful-words',  en: 'Useful Words',  zh: '字詞筆記' },
  { href: '/faq',           en: 'FAQ',           zh: '常見問題' },
  { href: '/#contact',      en: 'Contact',       zh: '聯絡' },
];

export const FOOTER_LINKS: NavItem[] = [
  { href: '/about',         en: 'About',         zh: '關於' },
  { href: '/what-we-teach', en: 'What We Teach', zh: '教學內容' },
  { href: '/blog',          en: 'Blog',          zh: '文章' },
  { href: '/useful-words',  en: 'Useful Words',  zh: '字詞筆記' },
  { href: '/faq',           en: 'FAQ',           zh: '常見問題' },
  { href: '/privacy',       en: 'Privacy',       zh: '隱私政策' },
];

export const BRAND: BilingualText = {
  en: 'Human,',
  zh: '人本・共學社',
};

export const DESCRIPTOR: BilingualText = {
  en: 'an Education Collective',
  zh: '共學社',
};

export const TAGLINE: BilingualText = {
  en: 'An education collective for students who want to learn how to think, not just what to think.',
  zh: '一個教育共學社，陪伴學生學會思考，而不是只記住答案。',
};

export const SITE_DESCRIPTION: BilingualText = {
  en: 'An education collective for students who want to learn how to think, not just what to think. English literature, writing, and critical thinking through inquiry-based methods, online, from Vancouver.',
  zh: '一個教育共學社，陪伴學生學會思考。英文文學、寫作、與批判思考，透過探究式學習在線進行。',
};

export const CONTACT_HEADING: BilingualText = {
  en: "Let's connect.",
  zh: '與我們聯繫。',
};

export const A11Y = {
  skipToContent: { en: 'Skip to main content', zh: '跳至主要內容' },
  mainNav:       { en: 'Main navigation',      zh: '主選單' },
  footerLinks:   { en: 'Footer links',         zh: '頁尾連結' },
  backToBlog:    { en: '← Back to all posts',   zh: '← 返回文章列表' },
  readMore:      { en: 'Read',                  zh: '閱讀' },
} satisfies Record<string, BilingualText>;
