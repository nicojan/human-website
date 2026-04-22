/*
 * strings.ts — bilingual UI chrome strings.
 *
 * Home is always bilingual; inner pages are monolingual with a language
 * toggle that points at the mirror URL. Copy is held here so pages can
 * pull it without re-stating.
 */

export interface BilingualText {
  en: string;
  zh: string;
}

export interface NavItem extends BilingualText {
  href: string;
}

/* Inner-page nav (mono EN). The "Contact" link points at the footer
 * mailto; Writing is a placeholder until the blog ships in v2. */
export const NAV_ITEMS_EN: NavItem[] = [
  { href: '/services', en: 'Services', zh: '課程' },
  { href: '/about',    en: 'About',    zh: '關於' },
  { href: '/writing',  en: 'Writing',  zh: '文章' },
  { href: 'mailto:hi@forhuman.ca', en: 'Contact', zh: '聯絡' },
];

/* Home-page nav shows both EN and ZH with the same hrefs (both land on
 * the same Home page). Separate constants in case the two sides diverge. */
export const NAV_ITEMS_HOME_EN = NAV_ITEMS_EN;
export const NAV_ITEMS_HOME_ZH: NavItem[] = NAV_ITEMS_EN.map((item) => ({
  href: item.href,
  en: item.en,
  zh: item.zh,
}));

export const FOOTER_COL_HEADERS = {
  site:    { en: 'SITE',    zh: '網站' },
  contact: { en: 'CONTACT', zh: '聯絡方式' },
  basedIn: { en: 'BASED IN', zh: '所在地' },
} satisfies Record<string, BilingualText>;

export const FOOTER_SITE_LINKS: NavItem[] = [
  { href: '/services', en: 'Services', zh: '課程' },
  { href: '/about',    en: 'About',    zh: '關於' },
  { href: '/writing',  en: 'Writing',  zh: '文章' },
  { href: 'mailto:hi@forhuman.ca', en: 'Contact', zh: '聯絡' },
];

export const FOOTER_CONTACT_LINKS: NavItem[] = [
  { href: 'mailto:hi@forhuman.ca', en: 'hi@forhuman.ca', zh: 'hi@forhuman.ca' },
  { href: '/wechat', en: 'WeChat: classwithnico', zh: '微信：classwithnico' },
  { href: 'https://instagram.com/humanedcollective', en: 'Instagram', zh: 'Instagram' },
  { href: 'https://wa.me/16045551234', en: 'WhatsApp', zh: 'WhatsApp' },
];

export const FOOTER_LOCATION: BilingualText = {
  en: 'Vancouver, British Columbia',
  zh: '溫哥華・卑詩省',
};

export const FOOTER_TAGLINE_BOTTOM: BilingualText = {
  en: 'Made with care, not haste.',
  zh: '用心，而非倉促。',
};

export const BRAND_FULL_ZH = '人本・共學社';
export const BRAND_DESCRIPTOR_EN = 'An Education Collective.';

export const SITE_DESCRIPTION: BilingualText = {
  en: 'One-on-one tutoring in English literature, writing, and critical thinking. We help students think clearly, read closely, and write with purpose.',
  zh: '一對一教學，聚焦英文文學、寫作與批判思考。我們幫助學生把話想清楚、把文本讀透、把字寫準。',
};

export const A11Y = {
  skipToContent: { en: 'Skip to main content', zh: '跳至主要內容' },
  mainNav:       { en: 'Main navigation',      zh: '主選單' },
  footerLinks:   { en: 'Footer links',         zh: '頁尾連結' },
  backToBlog:    { en: '← Back to all posts',   zh: '← 返回文章列表' },
  readMore:      { en: 'Read',                  zh: '閱讀' },
  language:      { en: 'Language',              zh: '語言' },
  openMenu:      { en: 'Open menu',             zh: '開啟選單' },
  closeMenu:     { en: 'Close menu',            zh: '關閉選單' },
} satisfies Record<string, BilingualText>;

/* The "Book a consult" shared CTA label. Single source of truth.
 * Bilingual so either language can surface it. */
export const CTA_BOOK_CONSULT: BilingualText = {
  en: 'Book a consult',
  zh: '預約諮詢',
};

export const CAL_COM_URL = 'https://cal.com/classwithnico/15-minute-consult';
