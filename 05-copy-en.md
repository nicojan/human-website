# Copy — English

All user-facing English strings, ready to consume. Exportable as a TypeScript constant or content collection.

## Global strings

### Nav — Home (bilingual)

```
EN links: Services · About · Writing · Contact
ZH links: 課程 · 關於 · 文章 · 聯絡
```

### Nav — Inner pages (mono EN)

```
Links: Services · About · Writing · Contact
Toggle: EN / 繁
```

### Footer

```
Brand lockup:
  Wordmark "Human," (SVG)
  人本・共學社 (Noto Serif TC, 18px Regular, neutral-600)
  An Education Collective. (Atkinson, 14px Regular, neutral-600)

Column headers (bilingual):
  SITE · 網站
  CONTACT · 聯絡方式
  BASED IN · 所在地

Site links (bilingual):
  Services · 課程
  About · 關於
  Writing · 文章
  Contact · 聯絡

Contact links:
  hi@forhuman.ca
  WeChat: classwithnico
  Instagram
  WhatsApp

Location:
  Vancouver, British Columbia
  溫哥華・卑詩省

Bottom row:
  © 2026 Human Education Collective Ltd.
  Made with care, not haste. · 用心，而非倉促。
```

### Mono footer (inner pages)

Drop the bilingual labels. Use "SITE", "CONTACT" (EN only), and drop the "人本・共學社" / "溫哥華・卑詩省" Chinese lines.

---

## Home — `/`

### Hero

```
EN headline (horizontal, large display):
  We help students think clearly, read closely, and write with purpose.

EN sub:
  One-on-one tutoring in English literature, writing, and critical thinking. Online, from Vancouver.

Primary CTA:
  Book a consult · 預約諮詢

ZH headline (vertical, 3 columns reading right-to-left):
  Right column: 把話想清楚
  Middle column: 把文本讀透
  Left column: 把字寫準。
```

### "Learning is the point" block

```
Eyebrow: WHAT WE BELIEVE · 我們的信念

EN title: Learning is the point. Not the scores.

EN body:
  In the age of AI, the most important question is no longer what children learn, but how they stay human while learning. When answers are instant, the muscle that builds real thinking weakens. We teach so that muscle gets stronger.

ZH title: 學習本身，才是重點。

ZH body:
  在 AI 的時代，最重要的問題已經不是學什麼，而是學習的過程裡如何保有自己。當答案隨手可得，思考的肌肉就容易鬆弛。我們的教學，就是讓那塊肌肉練回來。
```

### Principles section

```
Eyebrow: HOW WE TEACH · 我們的教學
Title: Five principles, with evidence.

Each PrinciplePair:
  - Number (01 through 05)
  - Eyebrow: PRINCIPLE · 原則
  - EN title + ZH title
  - Body paragraph (English only; the ZH title carries the parallel)
  - Video placeholder (16:9 aspect)

Principles:

01.
  EN: Curiosity over compliance.
  ZH: 好奇心，而非順從。
  Body: We connect classwork to the world beyond the page. We watch short clips and examine reliable websites to build context. Students test claims, compare sources, and apply new ideas to issues that matter to them.

02.
  EN: Close reading, thinking out loud.
  ZH: 細讀，也讓思考出聲。
  Body: We annotate literature and graphic novels together, modelling how to notice, question, and connect. Students turn careful observation into clear argument, and learn to do the same work on their own.

03.
  EN: Progress you can see.
  ZH: 看得見的進步。
  Body: We track every week on a shared Kanban board. Goals, samples of work, and next steps are visible to parents and students. Learning becomes a process, not a grade at the end of term.

04.
  EN: Research habits that travel.
  ZH: 帶得走的研究習慣。
  Body: We use current research tools and academic databases to plan, narrow, and verify. Students learn to manage sources, cite responsibly, and write with evidence, well before university asks them to.

05.
  EN: Human first, tools second.
  ZH: 人先於工具。
  Body: Technology serves thinking, or it replaces it. We use AI, software, and reference tools when they sharpen the work, and refuse them when they do the work for the student.
```

### Outcomes section

```
Eyebrow: OUTCOMES · 學生去向
Title: Where students go next.
Sub: Programs range from arts and humanities to engineering, business, and the sciences.

Logo grid (11 universities; Claude Code swaps names for real SVG logos post-launch):
Row 1: Berkeley, UBC, McGill, Toronto
Row 2: Queen's, HKU, Ivey (Western), Smith (Queen's)
Row 3: SFU Beedie, UBC Sauder, Western
```

### Recent Writing section

```
Eyebrow: RECENT WRITING · 近期文章
Title: Recent writing.
Sub (optional): Notes on teaching, learning, and the tools we use.
Link: All writing →

Blog cards: pull 2 most recent posts from /src/content/blog/
```

### Closing CTA

```
EN head: Ready to talk?
EN sub: Fifteen minutes, no obligation. We listen first.
ZH head: 想聊聊嗎？
ZH sub: 15 分鐘，沒有壓力。我們會先聽。
Button: Book a consult · 預約諮詢
```

---

## About — `/about`

### Hero

```
Headline: Human, is an education collective.
Sub: What we believe, how we work, and why it matters.
```

### Why we exist

```
Eyebrow: WHY WE EXIST
Title: The question is the point.

Body paragraph 1:
  In the age of AI, the most important question in education has changed. It is no longer what children learn, but how they stay human while learning.

Body paragraph 2:
  When answers are instant, the muscle of struggling with a question, where real thinking develops, gets weaker. We started Human, to protect that muscle.

Pullquote (distinct visual treatment):
  Education's purpose is not optimization. It is not scores. It is not AI-readiness. It is becoming more fully human.
```

### What we believe

```
Eyebrow: WHAT WE BELIEVE
Title: Four principles we hold.

Card 1:
  Title: The process over the product.
  Body: We value the act of inquiry, wondering, getting stuck, revising, over arriving at correct answers. The answer changes. The habit of thinking well does not.

Card 2:
  Title: Love is infrastructure.
  Body: Students learn differently when they are deeply known and cared for. The relationship between teacher and student is not a soft benefit. It is the foundation on which all learning is built.

Card 3:
  Title: Human first, tools second.
  Body: Technology is welcome when it serves human development. It is refused when it replaces the struggle that builds understanding.

Card 4:
  Title: Learning is communal.
  Body: The word "collective" is deliberate. Education happens between people, not between a person and a screen, and not in isolation.
```

### How we work

```
Eyebrow: HOW WE WORK
Title: Small on purpose.

Body paragraph 1:
  We work one-on-one. A teacher holds a small number of students at a time, which means we can hold what each one is doing, where they're stuck, and what they care about. Progress in any subject is built on trust. Trust needs attention. That is what small numbers and one-to-one time buys.

Body paragraph 2:
  Every week, parents and students see a shared Kanban board. It shows what was worked on, what the student noticed, and what's next. No end-of-term surprises.
```

### What we teach

```
Eyebrow: WHAT WE TEACH
Title: A liberal arts core.

Body:
  We teach English literature, writing, and critical thinking as a connected body of work. That includes close reading of literary texts, clear writing across argument and narrative, research habits that hold up past university, and discussion as a form of serious thought. We prepare students for specific tests when they need us to, and we coach university applications without ghostwriting. The common thread across everything: we teach students how to think, not what to think.
```

### BC Benefit Company (emphasized section)

```
Stamp pill: • REGISTERED IN BC
Eyebrow: HOW WE'RE ORGANIZED
Title: A BC Benefit Company.

Intro paragraph:
  Human Education Collective Ltd. is registered in British Columbia as a Benefit Company. This is a legal commitment. We are required by our incorporation documents to operate for specific public benefits, not just profit.

Lead-in:
  The three benefits we are committed to:

Bullet 1:
  Cultivating critical thinking in children, so they can participate thoughtfully in a world shaped by AI.

Bullet 2:
  Centering inquiry and process over product, building habits of learning that last a lifetime.

Bullet 3:
  Making high-quality supplementary education accessible to Chinese-speaking families in Canada, a community we know is underserved.

Closing paragraph:
  We also commit to paying our teachers above market, because education depends on the people who do it.
```

### Who we serve

```
Eyebrow: WHO WE SERVE
Title: Students who want to learn how to think.

Body:
  Most of our students are in elementary or secondary school, or at university. Some are in Canadian curricula, some in American, some in IB or AP programmes, some are new arrivals learning English as an additional language. What they have in common is a willingness to sit with a question long enough to understand it. We work best with families who value that kind of learning.
```

### Closing CTA

```
Headline: Want to see if we're the right fit?
Sub: Fifteen minutes, no obligation.
Button: Book a 15-minute consult
```

---

## Services — `/services`

### Hero

```
Headline: Four ways we work.
Sub: One-on-one online tutoring in English literature, writing, and critical thinking.
```

### Services grid

```
Eyebrow: WHAT WE OFFER
Title: Each service, close-up.

Card 1 (number badge: 1):
  Title: K–12 academic English
  Body: Close alignment to whatever curriculum the student is in, with visible weekly progress. We annotate readings, build argument skills, and track growth in short writing samples.
  Good for: curriculum gaps, confidence in class discussion, stronger written responses.

Card 2 (number badge: 2):
  Title: English language learners
  Body: Foundations in vocabulary, grammar, and everyday English, alongside confidence in speaking. For new arrivals and multilingual students who already know one or more languages and are building English as the next.
  Good for: settling into a new school, speaking up in class, writing in a second language.

Card 3 (number badge: 3):
  Title: English for exams
  Body: Preparation for SAT, IELTS, TOEFL, CELPIP, TOEIC, the BC Graduation Literacy Assessment, and the Duolingo English Test. We start with a diagnostic, then train with timed practice, error logs, and full-length mocks.
  Good for: students with a specific test and a specific timeline.

Card 4 (number badge: 4):
  Title: University application coaching
  Body: Support for building a strong, honest application from shortlist to submission. We map requirements, brainstorm and revise personal statements without ghostwriting, and walk through portal submissions with care.
  Good for: Grade 11 and 12 students applying to Canada, the U.S., or abroad.
```

### FAQ

```
Eyebrow: QUESTIONS
Title: What families usually ask.

Group 1 label: LESSONS

Q: Who do you teach?
A: Students from age 4 to mid-40s. Most are in elementary or secondary school, or at university.

Q: How long is a lesson?
A: 60 to 90 minutes, adjusted to the student's age and what we're working on.

Q: Where do lessons take place?
A: Online. Families choose this for consistency across schedules and locations.

Q: Is there a trial lesson?
A: Yes. Every new student starts with a 15 to 30-minute call so we can both see if it's a good fit.

Group 2 label: PROGRESS

Q: How will I see what's happening?
A: A shared Kanban board. Goals, work samples, and next steps are visible every week.

Q: Do you offer group lessons?
A: Currently one-on-one only. Small-group options are in development.

Group 3 label: LOGISTICS

Q: What technology do we need?
A: At minimum, an internet connection and a device that can join a video call. Ideally, a computer with a keyboard and mouse for longer reading and writing sessions.

Q: What's your cancellation policy?
A: Same-day cancellations count as delivered, except for illness or emergency. One full day's notice lets us reschedule within the same month.

Q: What payment methods do you accept?
A: Interac e-Transfer, WeChat Pay, PayPal, and BC Autism Funding.
```

### Closing CTA

```
Headline: Not sure which fits?
Sub: Book a 15-minute consult. We'll figure it out together.
Button: Book a consult
```

---

## Meta / SEO

For each page, set `<title>` and `<meta name="description">`. Below are the canonical values.

### Home

```
<title>Human, | Online English tutoring from Vancouver</title>
<meta name="description" content="One-on-one tutoring in English literature, writing, and critical thinking. We help students think clearly, read closely, and write with purpose." />
```

### About

```
<title>About | Human,</title>
<meta name="description" content="An education collective built to protect critical thinking in the age of AI. Registered as a BC Benefit Company with public-benefit commitments written into our incorporation." />
```

### Services

```
<title>Services | English tutoring, ELL, exam prep, university coaching | Human,</title>
<meta name="description" content="Four focused services: K–12 academic English, English language learners, exam preparation (SAT/IELTS/TOEFL), and university application coaching. Online, one-on-one." />
```

### Structured data

On Home, include `@type: Organization` schema:
```json
{
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": "Human,",
  "legalName": "Human Education Collective Ltd.",
  "url": "https://forhuman.ca",
  "email": "hi@forhuman.ca",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Vancouver",
    "addressRegion": "BC",
    "addressCountry": "CA"
  },
  "sameAs": ["https://instagram.com/...", "https://..."]
}
```

On Services, add `@type: Service` schema for each of the four services.
