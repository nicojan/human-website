/* ============================================
   Theme — Design tokens, Spectacle theme,
   and reusable components.
   Loaded BEFORE slides.js via <script> tag.
   ALL SLIDES ARE DARK. Tokens default to dark mode.
   ============================================ */

const { Notes } = Spectacle;
const html = window.html;

/* ---------- Apple HIG Design Tokens (dark mode) ---------- */
const C = {
  // Backgrounds
  black: "#000000",
  white: "#FFFFFF",
  slideBg: "#000000",
  cardFill: "#1C1C1E",
  elevatedFill: "#2C2C2E",

  // Text
  label: "#F5F5F7",
  secondaryLabel: "#A1A1A6",
  tertiaryLabel: "#636366",

  /* Apple HIG dark-mode system colours (CLR-01)
     Slightly brighter than light-mode variants */
  blue: "#0A84FF",
  green: "#30D158",
  orange: "#FF9F0A",
  red: "#FF453A",
  gold: "#FFD60A",
  indigo: "#5E5CE6",

  // Accessible label colours (on dark bg, these are the system colours themselves)
  greenLabel: "#30D158",
  orangeLabel: "#FF9F0A",
  redLabel: "#FF453A",
  blueLabel: "#0A84FF",
  indigoLabel: "#5E5CE6",
  goldLabel: "#FFD60A",

  // Vivid tinted card backgrounds (dark mode)
  blueTint: "rgba(10,132,255,0.18)",
  greenTint: "rgba(48,209,88,0.18)",
  orangeTint: "rgba(255,159,10,0.18)",
  redTint: "rgba(255,69,58,0.18)",
  goldTint: "rgba(255,214,10,0.14)",
  indigoTint: "rgba(94,92,230,0.18)",

  // Grays (dark mode)
  gray: "#8E8E93",
  gray3: "#48484A",
  gray4: "#3A3A3C",
  gray5: "#2C2C2E",
  gray6: "#1C1C1E",

  // Separator (dark mode)
  separator: "#38383A",
};

/* ---------- Font shorthand ---------- */
const F = {
  display: "-apple-system, BlinkMacSystemFont, 'Helvetica Neue', system-ui, sans-serif",
  body: "-apple-system, BlinkMacSystemFont, 'Helvetica Neue', system-ui, sans-serif",
};

/* ---------- Spectacle Theme ---------- */
const deckTheme = {
  colors: {
    primary: C.blue,
    secondary: C.indigo,
    tertiary: C.label,
  },
  fonts: {
    header: F.display,
    text: F.body,
    monospace: "ui-monospace, 'SF Mono', monospace",
  },
  fontSizes: {
    header: "48px",
    text: "24px",
  },
};

/* ---------- Logo URLs ---------- */
const LOGO = {
  dark: "https://raw.githubusercontent.com/nicojan/human-website/main/assets/logos/human-wordmark-dark.svg",
  light: "https://raw.githubusercontent.com/nicojan/human-website/main/assets/logos/human-wordmark-light.svg",
};

/* ---------- Template (progress bar + slide counter) ---------- */
function deckTemplate({ slideNumber, numberOfSlides }) {
  const progress = (slideNumber / numberOfSlides) * 100;
  return html`
    <div class="progress-track">
      <div class="progress-fill" style=${{ width: progress + "%" }} />
    </div>
    <div class="slide-counter">
      ${slideNumber} / ${numberOfSlides}
    </div>
  `;
}

/* ---------- Reusable: brand mark ---------- */
function BrandMark() {
  return html`
    <img
      src=${LOGO.dark}
      alt="Human, an Education Collective"
      class="brand-mark"
    />
  `;
}

/* ---------- Reusable: formatted speaker notes ---------- */
function FormattedNotes({ text }) {
  return html`<${Notes}><div class="speaker-notes">${text}</div></${Notes}>`;
}

/* ---------- Reusable: PDF export button ---------- */
function PdfButton() {
  return html`
    <button
      class="pdf-btn"
      onClick=${() => {
        const base = window.location.href.split("?")[0];
        const w = window.open(base + "?exportMode=true", "_blank");
        if (w) setTimeout(() => w.print(), 3000);
      }}
    >
      <span class="icon" style=${{ fontSize: "18px" }}>picture_as_pdf</span>
      Export PDF
    </button>
  `;
}

/* ---------- Reusable: card ---------- */
function Card({ accent, tint, accentSide, children, className, style }) {
  const borderProp = accentSide === "top" ? "borderTop" : "borderLeft";
  const accentStyle = accent ? { [borderProp]: "4px solid " + accent } : {};
  return html`
    <div
      class=${"card " + (tint || "") + " " + (className || "")}
      style=${{ ...accentStyle, ...style }}
    >
      ${children}
    </div>
  `;
}

/* ---------- Reusable: card label ---------- */
function CardLabel({ children, color }) {
  return html`
    <div class="card-label" style=${color ? { color } : {}}>
      ${children}
    </div>
  `;
}

/* ---------- Reusable: discussion card ---------- */
function DiscussionCard({ children, label }) {
  return html`
    <div class="discussion-card">
      ${label && html`<div class="card-label">${label}</div>`}
      ${children}
    </div>
  `;
}

/* ---------- Reusable: numbered discussion item ---------- */
function DItem({ n, children }) {
  return html`
    <div class="d-item">
      <span class="d-item-num">${n}.</span>
      <span class="d-item-text">${children}</span>
    </div>
  `;
}

/* ---------- Expose everything on window for slides.js ---------- */
window.C = C;
window.F = F;
window.deckTheme = deckTheme;
window.deckTemplate = deckTemplate;
window.LOGO = LOGO;
window.BrandMark = BrandMark;
window.FormattedNotes = FormattedNotes;
window.PdfButton = PdfButton;
window.Card = Card;
window.CardLabel = CardLabel;
window.DiscussionCard = DiscussionCard;
window.DItem = DItem;
