/* ============================================
   Week 1: Noticing Language Choices
   CONTENT ONLY — tokens & components in theme.js
   ALL SLIDES DARK
   ============================================ */

const { Deck, Slide, Appear } = Spectacle;

/* ============================================
   SLIDE 1: Title
   ============================================ */
const slide1Notes = [
  "\u2022 welcome: first class, set a warm tone",
  "\u2022 self-intro, then ask about student\u2019s art practice and English goals",
  "\u2022 expectations: conversation, not a lecture; free to interrupt",
  "\u2022 homework will be introduced at the end of class",
  "\u2022 goal: comfort and rapport, 2\u20133 min",
  "\u2022 EXTENSION: if talkative, let intros run longer; ask about their art and daily English use",
].join("\n");

function Slide1() {
  return html`
    <${Slide} backgroundColor=${C.slideBg} padding="0">
      <div style=${{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: C.blue }} />
      <div class="slide-content justify-center">
        <div class="overline" style=${{ color: C.blue, marginBottom: "24px" }}>WEEK 1</div>
        <div class="title-heading">Noticing Language Choices</div>
        <div class="title-subtitle">denotation, connotation, and the myth of synonyms</div>
      </div>
      <div class="title-bottom-bar">
        <${BrandMark} />
        <${PdfButton} />
      </div>
      <${FormattedNotes} text=${slide1Notes} />
    </${Slide}>
  `;
}

/* ============================================
   SLIDE 2: What Is This Course About?
   ============================================ */
const slide2Notes = [
  "\u2022 keep brief: no full syllabus on day one; three cards = entire overview",
  "\u2022 three pillars: read closely, write clearly, think with language",
  "\u2022 third pillar teases 1984 excerpt (slides 9\u201310); don\u2019t name the book yet",
  "\u2022 prompt: \u2018Have you ever noticed when someone\u2019s word choice really mattered?\u2019",
  "\u2022 if quiet: \u2018That\u2019s fine, we\u2019ll find some examples together today\u2019",
  "\u2022 goal: 2\u20133 min",
  "\u2022 EXTENSION: word choice in art vs. writing; seeds the colour analogy in slide 7",
].join("\n");

function Slide2() {
  return html`
    <${Slide} backgroundColor=${C.slideBg} padding="0">
      <div class="slide-content">
        <div class="slide-heading">What Is This Course About?</div>
        <div class="slide-subtitle">every word is a choice; this course is about noticing those choices</div>

        <div class="flex-col w-full">
          <${Card} accent=${C.green} tint="tint-green">
            <${CardLabel} color=${C.green}>Reading closely</${CardLabel}>
            <div class="card-body">how skilled writers choose words, and the effect on you</div>
          </${Card}>

          <${Card} accent=${C.orange} tint="tint-orange">
            <${CardLabel} color=${C.orange}>Writing clearly</${CardLabel}>
            <div class="card-body">making your own writing more precise; what happens when language is vague</div>
          </${Card}>

          <${Card} accent=${C.blue} tint="tint-blue">
            <${CardLabel} color=${C.blue}>Thinking with language</${CardLabel}>
            <div class="card-body">whether available words shape what you can think (a novel\u2019s character says yes)</div>
          </${Card}>
        </div>

        <div class="footnote mt-12">over six weeks, we move from reading to writing to communicating with AI</div>
      </div>
      <${FormattedNotes} text=${slide2Notes} />
    </${Slide}>
  `;
}

/* ============================================
   SLIDE 3: A Quick Warm-Up
   ============================================ */
const slide3Notes = [
  "\u2022 read both sentences aloud first; don\u2019t reveal the source yet",
  "\u2022 Q1: easy opener; almost everyone picks A; push for WHY",
  "\u2022 Q2: same food, same meal, different words; the words change the feeling = core insight",
  "\u2022 Q3: \u2018pinkish-grey\u2019 (sickly colour), \u2018hunk\u2019 (rough, not sliced), \u2018milkless\u2019 (deprivation)",
  "\u2022 vocab if needed: pannikin = small metal cup, hunk = thick rough piece",
  "\u2022 goal: 5\u20137 min",
  "\u2022 EXTENSION: rewrite sentence B to sound delicious; previews connotation before naming it",
].join("\n");

function Slide3() {
  return html`
    <${Slide} backgroundColor=${C.slideBg} padding="0">
      <div class="slide-content">
        <div class="slide-heading">A Quick Warm-Up</div>
        <div class="slide-subtitle">two sentences describing the same lunch</div>

        <div class="flex-col w-full">
          <${Card} accent=${C.green} tint="tint-green">
            <span class="sentence-label accent-green">A</span>
            <div class="sentence-body">We had a warm bowl of stew with fresh bread and a cup of coffee.</div>
          </${Card}>

          <${Card} accent=${C.red} tint="tint-red">
            <span class="sentence-label accent-red">B</span>
            <div class="sentence-body">We had a pannikin of pinkish-grey stew with a hunk of bread and milkless Victory Coffee.</div>
          </${Card}>
        </div>

        <${DiscussionCard}>
          <${DItem} n="1">Which lunch sounds better? Why?</${DItem}>
          <${DItem} n="2">Both describe the same meal. What\u2019s different?</${DItem}>
          <${DItem} n="3">Which words in B make the food sound bad?</${DItem}>
        </${DiscussionCard}>
      </div>
      <${FormattedNotes} text=${slide3Notes} />
    </${Slide}>
  `;
}

/* ============================================
   SLIDE 4: What Did You Notice?
   ============================================ */
const slide4Notes = [
  "\u2022 bridge: \u2018You noticed the words made you feel something; that\u2019s exactly what we\u2019re studying\u2019",
  "\u2022 \u2018pinkish-grey\u2019: sickly, unnatural; nobody describes food they enjoy that way",
  "\u2022 \u2018spongy pinkish stuff\u2019: vagueness is deliberate; Orwell wants uncertainty and disgust",
  "\u2022 word chips: each chosen to make us feel, not just to describe",
  "\u2022 goal: 5\u20136 min",
  "\u2022 EXTENSION: pick one chip, explain its feeling; \u2018What word would a restaurant use instead?\u2019",
].join("\n");

function Slide4() {
  return html`
    <${Slide} backgroundColor=${C.slideBg} padding="0">
      <div class="slide-content">
        <div class="slide-heading">What Did You Notice?</div>

        <${Card} accent=${C.gold} tint="tint-gold" className="mt-8">
          <${CardLabel} color=${C.gold}>the key insight</${CardLabel}>
          <div class="card-body">not just describing food \u2014 making us feel disgusted by it</div>
          <div class="card-body mt-6">\u201cpinkish-grey\u201d, \u201cspongy\u201d, \u201csloppiness\u201d carry feeling, not just meaning</div>
        </${Card}>

        <div class="flex-wrap" style=${{ gap: "8px", margin: "16px 0" }}>
          ${[
            "pinkish-grey",
            "spongy",
            "sloppiness",
            "oily-tasting",
            "hunk",
          ].map((w) => html`<span class="chip chip-red">${w}</span>`)}
        </div>

        <${DiscussionCard} label="discussion">
          <${DItem} n="1">Why \u201cpinkish-grey stew\u201d instead of just \u201cstew\u201d?</${DItem}>
          <${DItem} n="2">Which of these words would you use to describe delicious food?</${DItem}>
        </${DiscussionCard}>
      </div>
      <${FormattedNotes} text=${slide4Notes} />
    </${Slide}>
  `;
}

/* ============================================
   SLIDE 5: Two Layers of Meaning
   ============================================ */
const slide5Notes = [
  "\u2022 naming the two concepts experienced in slides 3\u20134",
  "\u2022 denotation = dictionary meaning, connotation = feeling or association",
  "\u2022 \u2018home\u2019: dictionary says \u2018a place where someone lives\u2019, but also warmth, safety, belonging",
  "\u2022 connect back: \u2018stew\u2019 is neutral, \u2018pinkish-grey stew\u2019 is disgusting; same denotation, different connotation",
  "\u2022 quick check: \u2018hunk of bread\u2019 vs \u2018slice of bread\u2019; both denote a piece, but \u2018hunk\u2019 feels rough",
  "\u2022 goal: student explains both concepts in own words, 5\u20136 min",
  "\u2022 EXTENSION: word in first language with strong connotation; does English translation carry the same feeling?",
].join("\n");

function Slide5() {
  return html`
    <${Slide} backgroundColor=${C.slideBg} padding="0">
      <div class="slide-content">
        <div class="slide-heading">Two Layers of Meaning</div>
        <div class="slide-subtitle" style=${{ marginBottom: "12px" }}></div>

        <div class="flex-row gap-16 w-full items-stretch">
          <${Card} accent=${C.blue} accentSide="top" tint="tint-blue" style=${{ flex: 1 }}>
            <div class="card-title accent-blue">Denotation</div>
            <div class="card-body" style=${{ marginBottom: "10px" }}>the dictionary meaning of a word</div>
            <div class="card-secondary">
              <div>\u201chome\u201d = a place where someone lives</div>
              <div>\u201ccheap\u201d = low in price</div>
              <div>\u201cstew\u201d = a dish of meat and vegetables</div>
            </div>
          </${Card}>

          <${Card} accent=${C.orange} accentSide="top" tint="tint-orange" style=${{ flex: 1 }}>
            <div class="card-title accent-orange">Connotation</div>
            <div class="card-body" style=${{ marginBottom: "10px" }}>the feeling or association a word carries</div>
            <div class="card-secondary">
              <div>\u201chome\u201d = warmth, safety, belonging</div>
              <div>\u201ccheap\u201d = low quality, not worth much</div>
              <div>\u201cpinkish-grey stew\u201d = disgusting, unnatural</div>
            </div>
          </${Card}>
        </div>

        <${DiscussionCard}>
          <div class="card-body" style=${{ fontSize: "22px" }}>
            <strong class="accent-blue">Quick check:</strong> What is the denotation of \u201cbread\u201d? Does \u201ca hunk of bread\u201d feel different from \u201ca slice of bread\u201d?
          </div>
        </${DiscussionCard}>
      </div>
      <${FormattedNotes} text=${slide5Notes} />
    </${Slide}>
  `;
}

/* ============================================
   SLIDE 6: Connotation Sorting
   ============================================ */
const slide6Notes = [
  "\u2022 FIGMA ACTIVITY: reference slide while student drags cards in Figma",
  "\u2022 for each pair: \u2018Would you rather be called X or Y?\u2019 makes difference personal",
  "\u2022 cheap/affordable: both \u2018low price\u2019, but \u2018cheap\u2019 implies bad quality",
  "\u2022 stubborn/persistent: both \u2018won\u2019t give up\u2019, but \u2018stubborn\u2019 = annoying, \u2018persistent\u2019 = admirable",
  "\u2022 skinny/slim: both \u2018thin\u2019, but \u2018skinny\u2019 suggests unhealthily thin",
  "\u2022 goal: 8\u201310 min",
  "\u2022 EXTENSION: add a third word to any pair (e.g. \u2018thin\u2019 between \u2018skinny\u2019 and \u2018slim\u2019)",
].join("\n");

function Slide6() {
  const pairs = [
    "cheap / affordable",
    "stubborn / persistent",
    "skinny / slim",
    "nosy / curious",
    "childish / youthful",
    "aggressive / assertive",
  ];

  return html`
    <${Slide} backgroundColor=${C.slideBg} padding="0">
      <div class="slide-content">
        <div class="slide-heading">Connotation Sorting</div>
        <div class="slide-subtitle" style=${{ marginBottom: "12px" }}>word pairs with similar dictionary meanings but different feelings</div>

        <div class="sort-grid">
          <div class="sort-header" style=${{ background: "rgba(48,209,88,0.18)", color: C.green }}>
            Positive / Neutral
          </div>
          <div class="sort-header" style=${{ background: C.gray5, color: C.secondaryLabel }}>
            Word Pair
          </div>
          <div class="sort-header" style=${{ background: "rgba(255,69,58,0.18)", color: C.red }}>
            Negative
          </div>

          ${pairs.map(
            (pair) => html`
              <div class="sort-cell sort-dashed"></div>
              <div
                class="sort-cell"
                style=${{
                  background: C.cardFill,
                  fontWeight: 500,
                  border: "1px solid " + C.separator,
                }}
              >
                ${pair}
              </div>
              <div class="sort-cell sort-dashed"></div>
            `,
          )}
        </div>

        <${DiscussionCard}>
          <div class="card-body" style=${{ fontSize: "22px" }}>
            Which word would you use to describe yourself? Which for someone you don\u2019t like?
          </div>
        </${DiscussionCard}>
      </div>
      <${FormattedNotes} text=${slide6Notes} />
    </${Slide}>
  `;
}

/* ============================================
   SLIDE 7: The Semantic Gradient
   ============================================ */
const slide7Notes = [
  "\u2022 concept: words for the same feeling exist on a scale of intensity",
  "\u2022 walk through the bar: content, pleased, happy, thrilled, ecstatic; each step up is stronger",
  "\u2022 prompt: \u2018Where would you place glad? What about overjoyed?\u2019",
  "\u2022 colour analogy: should resonate with an art student; colours have names because they differ",
  "\u2022 goal: 4\u20135 min concept, then move to activity on slide 8",
  "\u2022 EXTENSION: build a gradient for a negative emotion (e.g. sadness: melancholy, sad, miserable, devastated)",
].join("\n");

function Slide7() {
  const steps = ["content", "pleased", "happy", "thrilled", "ecstatic"];
  const stepColors = [
    "rgba(48,209,88,0.20)",
    "rgba(48,209,88,0.12)",
    C.gray5,
    "rgba(255,159,10,0.20)",
    "rgba(255,69,58,0.20)",
  ];

  return html`
    <${Slide} backgroundColor=${C.slideBg} padding="0">
      <div class="slide-content">
        <div class="slide-heading">The Semantic Gradient</div>
        <div class="slide-subtitle">words exist on a scale of intensity, not just positive or negative</div>

        <div class="gradient-bar">
          ${steps.map(
            (word, i) =>
              html`<div style=${{ background: stepColors[i] }}>${word}</div>`,
          )}
        </div>
        <div class="gradient-labels">
          <span class="gradient-label-text">mild</span>
          <span class="gradient-label-text">intense</span>
        </div>

        <${Card} accent=${C.blue} tint="tint-blue" className="mt-20">
          <${CardLabel} color=${C.blue}>why does this matter?</${CardLabel}>
          <div class="card-body">\u201ccontent\u201d vs. \u201cecstatic\u201d \u2014 both positive, completely different intensity; choosing the right position = choosing precision</div>
        </${Card}>

        <${Card} accent=${C.orange} tint="tint-orange" className="mt-12">
          <${CardLabel} color=${C.orange}>think about colour</${CardLabel}>
          <div class="card-body">\u2018red\u2019, \u2018crimson\u2019, and \u2018scarlet\u2019 aren\u2019t the same \u2014 words work the same way</div>
        </${Card}>
      </div>
      <${FormattedNotes} text=${slide7Notes} />
    </${Slide}>
  `;
}

/* ============================================
   SLIDE 8: Your Turn: Build a Gradient
   ============================================ */
const slide8Notes = [
  "\u2022 FIGMA ACTIVITY: student drags word cards into order, mildest to most intense",
  "\u2022 anger: annoyed < irritated < angry < furious < enraged",
  "\u2022 size: big < large < huge < enormous < gigantic (order varies; discussion about why = the point)",
  "\u2022 fear: uneasy < nervous < scared < terrified < panicked",
  "\u2022 no single right answer: when student disagrees, ask why; reasoning IS the learning",
  "\u2022 goal: 8\u201310 min",
  "\u2022 EXTENSION: create a brand-new gradient for \u2018beauty\u2019 or \u2018intelligence\u2019",
].join("\n");

function Slide8() {
  return html`
    <${Slide} backgroundColor=${C.slideBg} padding="0">
      <div class="slide-content">
        <div class="slide-heading">Your Turn: Build a Gradient</div>
        <div class="slide-subtitle" style=${{ marginBottom: "12px" }}>arrange each set from mildest to most intense</div>

        <div class="flex-col w-full">
          <${Card} accent=${C.red} tint="tint-red">
            <${CardLabel} color=${C.red}>Anger</${CardLabel}>
            <div class="card-body">annoyed, furious, irritated, angry, enraged</div>
          </${Card}>

          <${Card} accent=${C.green} tint="tint-green">
            <${CardLabel} color=${C.green}>Size</${CardLabel}>
            <div class="card-body">large, enormous, big, huge, gigantic</div>
          </${Card}>

          <${Card} accent=${C.indigo} tint="tint-indigo">
            <${CardLabel} color=${C.indigo}>Fear</${CardLabel}>
            <div class="card-body">nervous, terrified, uneasy, scared, panicked</div>
          </${Card}>
        </div>

        <${DiscussionCard}>
          <div class="card-body" style=${{ fontSize: "22px" }}>
            <strong class="accent-blue">Bonus:</strong> Can you add one more word to any of these gradients?
          </div>
        </${DiscussionCard}>
      </div>
      <${FormattedNotes} text=${slide8Notes} />
    </${Slide}>
  `;
}

/* ============================================
   SLIDE 9: The Real Passage
   ============================================ */
const slide9Notes = [
  "\u2022 reveal moment: warm-up sentence B came from this novel; let the student react",
  "\u2022 context: 1984, a government that controls everything including language; Winston\u2019s lunch in the cafeteria",
  "\u2022 read passage aloud first, slowly; then student re-reads silently",
  "\u2022 Q1: \u2018dumped\u2019 (violent, not \u2018served\u2019), \u2018sloppiness\u2019 (disgust), \u2018pinkish-grey\u2019 (unnatural colour)",
  "\u2022 Q2: \u2018probably a preparation of meat\u2019; Winston can\u2019t identify what he\u2019s eating; uncertainty = horror",
  "\u2022 Q3: push for exactly three connotation-loaded words; commit to choices and explain each",
  "\u2022 goal: 7\u20138 min",
].join("\n");

function Slide9() {
  return html`
    <${Slide} backgroundColor=${C.slideBg} padding="0">
      <div class="slide-content">
        <div class="slide-heading">The Real Passage</div>
        <div class="footnote" style=${{ marginBottom: "12px" }}>that warm-up earlier? Sentence B was adapted from this novel</div>

        <${Card} accent=${C.indigo} tint="tint-indigo">
          <div class="card-body" style=${{ marginBottom: "10px" }}>
            On to each was dumped swiftly the regulation lunch \u2014 a metal pannikin of pinkish-grey stew, a hunk of bread, a cube of cheese, a mug of milkless Victory Coffee, and one saccharine tablet.
          </div>
          <div class="card-body" style=${{ marginBottom: "10px" }}>
            He began swallowing spoonfuls of the stew, which, in among its general sloppiness, had cubes of spongy pinkish stuff which was probably a preparation of meat.
          </div>
          <div class="footnote">George Orwell, 1984, Chapter 5</div>
        </${Card}>

        <${DiscussionCard} label="discussion">
          <${DItem} n="1">Now that you know the vocabulary, what details stand out?</${DItem}>
          <${DItem} n="2">\u201cProbably a preparation of meat.\u201d Why not just say \u201cmeat\u201d?</${DItem}>
          <${DItem} n="3">Find three words chosen for connotation, not just denotation.</${DItem}>
        </${DiscussionCard}>
      </div>
      <${FormattedNotes} text=${slide9Notes} />
    </${Slide}>
  `;
}

/* ============================================
   SLIDE 10: A Character Who Hates Synonyms
   ============================================ */
const slide10Notes = [
  "\u2022 most important slide: take your time here",
  "\u2022 read both quotes aloud; after each, pause and check understanding",
  "\u2022 context: Syme works for the government; his job = making the dictionary smaller every year; he\u2019s proud of it",
  "\u2022 left card: \u2018excellent\u2019 and \u2018splendid\u2019 are NOT the same; \u2018excellent\u2019 = high standard, \u2018splendid\u2019 = impressive, grand",
  "\u2022 right card: central idea of the entire course; \u2018Can fewer words really mean fewer thoughts?\u2019",
  "\u2022 art connection: losing colour words = losing precision in visual thinking; should resonate viscerally",
  "\u2022 goal: 10\u201312 min; let the discussion run",
].join("\n");

function Slide10() {
  return html`
    <${Slide} backgroundColor=${C.slideBg} padding="0">
      <div class="slide-content">
        <div class="slide-heading">A Character Who Hates Synonyms</div>

        <div class="quote-block mt-8">
          <div class="quote-text">\u201cIt\u2019s a beautiful thing, the destruction of words.\u201d</div>
          <div class="quote-text">\u201cIf you have a word like \u2018good\u2019, what need is there for a word like \u2018bad\u2019? \u2018Ungood\u2019 will do just as well.\u201d</div>
          <div class="quote-attribution">Syme, a government language specialist, in 1984</div>
        </div>

        <div class="flex-row gap-12 w-full items-stretch mt-16">
          <${Card} accent=${C.green} tint="tint-green" style=${{ flex: 1 }}>
            <${CardLabel} color=${C.green}>think about it</${CardLabel}>
            <div class="card-body">
              <div>Syme says \u201cexcellent\u201d and \u201csplendid\u201d are useless. Do you agree?</div>
              <div class="mt-6">Is \u201cplusgood\u201d really the same as \u201cexcellent\u201d?</div>
            </div>
          </${Card}>

          <${Card} accent=${C.gold} tint="tint-gold" style=${{ flex: 1 }}>
            <${CardLabel} color=${C.gold}>the big question</${CardLabel}>
            <div class="card-body">
              <div>\u201cThe whole aim of Newspeak is to narrow the range of thought.\u201d</div>
              <div class="mt-6">Can fewer words really mean fewer thoughts?</div>
            </div>
          </${Card}>
        </div>

        <${Card} accent=${C.blue} tint="tint-blue" className="mt-12">
          <${CardLabel} color=${C.blue}>for your art practice</${CardLabel}>
          <div class="card-body">imagine removing all colour words except \u2018red\u2019, \u2018blue\u2019, and \u2018green\u2019 \u2014 no \u2018crimson\u2019, no \u2018turquoise\u2019, no \u2018moss\u2019; would that change how you think about colour?</div>
        </${Card}>
      </div>
      <${FormattedNotes} text=${slide10Notes} />
    </${Slide}>
  `;
}

/* ============================================
   SLIDE 11: What We Covered Today
   ============================================ */
const slide11Notes = [
  "\u2022 quick recap: ask student to explain each concept back in own words",
  "\u2022 prompt 1: \u2018In your own words, what is connotation?\u2019",
  "\u2022 prompt 2: \u2018Give me one word pair with different connotations\u2019",
  "\u2022 prompt 3: \u2018What did Syme think about synonyms? Do you agree?\u2019",
  "\u2022 homework: combined assignment connecting today\u2019s concepts to their art practice; details shared after class",
  "\u2022 reassure: not a lot of work, about 30\u201340 minutes, focused on art practice",
  "\u2022 goal: 3\u20134 min wrap-up",
].join("\n");

function Slide11() {
  return html`
    <${Slide} backgroundColor=${C.slideBg} padding="0">
      <div style=${{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: C.blue }} />

      <div class="slide-content" style=${{ justifyContent: "flex-start" }}>
        <div class="slide-heading">What We Covered Today</div>

        <div class="flex-col w-full mt-8">
          <div class="dark-card tint-green" style=${{ borderLeft: "4px solid " + C.green }}>
            <div class="dark-card-title">denotation vs. connotation</div>
            <div class="dark-card-body">every word has a dictionary meaning AND a feeling; writers choose words for both</div>
          </div>

          <div class="dark-card tint-orange" style=${{ borderLeft: "4px solid " + C.orange }}>
            <div class="dark-card-title">the myth of synonyms</div>
            <div class="dark-card-body">Syme calls \u2018excellent\u2019 and \u2018splendid\u2019 useless, but they carry different shades of meaning</div>
          </div>

          <div class="dark-card tint-indigo" style=${{ borderLeft: "4px solid " + C.indigo }}>
            <div class="dark-card-title">semantic gradients</div>
            <div class="dark-card-body">words exist on a scale of intensity; choosing the right position = the right precision</div>
          </div>
        </div>

        <div class="homework-card tint-blue" style=${{ borderTop: "4px solid " + C.blue }}>
          <div class="homework-label">Homework for Next Week</div>
          <div class="homework-body">
            <div>a hands-on assignment connecting today\u2019s concepts to your art practice</div>
            <div>details and materials shared after class, about 30\u201340 minutes total</div>
          </div>
        </div>

        <div class="dark-footer">
          <span class="dark-footer-text">next week: The Abstraction Ladder</span>
          <${BrandMark} />
        </div>
      </div>
      <${FormattedNotes} text=${slide11Notes} />
    </${Slide}>
  `;
}

/* ============================================
   MOUNT
   ============================================ */
const isExportMode = new URLSearchParams(window.location.search).has(
  "exportMode",
);

ReactDOM.createRoot(document.getElementById("root")).render(
  html`<${Deck} theme=${deckTheme} template=${deckTemplate} exportMode=${isExportMode}>
    <${Slide1} />
    <${Slide2} />
    <${Slide3} />
    <${Slide4} />
    <${Slide5} />
    <${Slide6} />
    <${Slide7} />
    <${Slide8} />
    <${Slide9} />
    <${Slide10} />
    <${Slide11} />
  </${Deck}>`,
);
