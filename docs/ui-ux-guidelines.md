# UI/UX Guidelines

These notes capture the current site-level design decisions for forhuman.ca.

## Brand Identity

- Keep the site quiet, literary, and human. The core signals are the bilingual voice, Literata headings, the Human, comma mark, terracotta actions, warm surfaces, and ink emphasis bands.
- Use restrained motion. Motion should support attention, not hide content or become the point.
- Preserve bilingual context where it helps families understand the service. Do not make every page visually symmetrical if one language is clearly primary for that route.

## Layout And Rhythm

- Content must render visibly before JavaScript runs. Animation can add classes, but CSS must not make core content depend on IntersectionObserver.
- Use generous spacing for major brand moments, then tighten repeated service, FAQ, and prose sections so pages do not feel empty.
- Use cards only for repeated items, forms, and framed tools. Avoid nesting cards.
- Add a clear follow-up action after decision-heavy content, especially services, blog posts, FAQs, and contact sections.

## Conversion

- The primary action is a consult, usually framed as 15 minutes and low pressure.
- Every mobile drawer should expose the consult action, not just navigation.
- Services should be scannable before the user reads paragraph copy. Include quick details such as typical work, fit, and outcome.
- Contact forms should explain what happens next, expected reply timing, and privacy expectations before asking for details.

## Accessibility

- Aim for WCAG 2.1 AA. Keep keyboard focus visible and touch targets at least 44 px.
- Inline language changes need `lang` attributes.
- Decorative videos should be hidden from assistive tech when adjacent text carries the meaning.
- Logo marquees should name each visible institution once and hide duplicated animation copies.
- Under `prefers-reduced-motion`, marquees should become static layouts and autoplay videos should pause.

## Performance And Resilience

- Third-party analytics, Turnstile, and remote fonts must fail quietly.
- Large video assets should stay visually meaningful, with enough overlay for contrast but not so much that the footage becomes unreadable.
- Generated partials, especially footers and school marquees, must be edited through their source partials or generator scripts before build.
