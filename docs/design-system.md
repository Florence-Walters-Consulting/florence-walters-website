# Design system

Source: `web/src/styles/fwc.css` (tokens + base), `web/src/components/ui/` (primitives), `web/src/data/media.ts` (every photo and video in one place).

## Direction
Set by the FWC Website Content Pack: **a modern consultancy, not a law firm.**
- **Colour mix:** about 70% white or lilac (`mist` #F4F4FF), 20% Electric Blue, 10% navy (the hero, the footer and the one "Why FWC" feature band).
- **Headings:** Satoshi (Bold/Black), self-hosted in `web/src/fonts`. Body copy is DM Sans. No serif anywhere on the public site.
- **Accent:** Electric Blue `#6B68F7`. Small text on white uses `accent-deep` (#4A47C9) and filled buttons use `accent-btn` (#5B57EE), because white on the pure brand blue is under 4.5:1 contrast.
- **Imagery:** Nigerian founders at work, hands and documents, plus soft 3D icons. Never scales, gavels, Lady Justice, courtrooms, law books or men in dark suits shaking hands.
- **Page length:** each section has one heading, one line and one button. The home page has seven sections.
- **Text on images:** dark text on light, or white text on a navy overlay. Never text straight on a busy photo. Inner-page banners (`PageHero`) are light, with a 3D scene on the right.

## Tokens
| | |
|---|---|
| Fonts | `font-display` = Satoshi, body = DM Sans. Self-hosted (`next/font/local` and `next/font/google`). |
| Colour | `ink` #1F2A44, `ink-deep` #161E33, `accent` #6B68F7, `accent-btn`, `accent-deep`, `accent-soft`, `mist`, `canvas` (white), `line` |
| Type | `text-display`, `text-title`, `text-heading`, `text-lead` (fluid, Satoshi 800) |
| Shape | `rounded-card` (28px), `rounded-card-sm`, pills are `rounded-full` |
| Motion | `ease-out-expo` for entrances, `ease-soft` for hovers. Reveals take 0.4 s. |

## Motion rules
- Only **one** thing moves at a time: the hero video, or the regulators strip, or a counter. The strip pauses while the hero is on screen (`Marquee yieldTo`).
- Sections fade up gently (0.4 s). No spinning, bouncing or flashing.
- Numbers count up once, when they scroll into view (`CountUp`).
- Carousels move every 6 s, pause when touched or hovered, always show arrows and dots under the slide, and swipe on phones (`Carousel`, and the hero).
- Hero slides cross-fade with the outgoing slide kept underneath, so there is no flash.
- Reduced motion: no auto-advance, no video (the poster image shows), numbers show their final value.

## Primitives (`@/components/ui/*`)
`Button`, `Container`, `SectionHead`, `MotionIcon` (Busola's animated icons and hero graphics; transparent WebM, MP4 for Safari, still frame for reduced motion or data saver), `TiltStage` (hero art that tilts toward the pointer), `FloatingShapes` (floating 3D tiles in the right half of a band), `AutoTabs` (the auto-advancing tabs + animated stage), `FanDeck` (pile that fans out on hover or tap), `Ring`, `BrandFilm` (click-to-play), `Accordion` (Radix), `Carousel` (Embla), `Marquee`, `Reveal`, `CountUp`, `ReadMore`, `Icon3D` (CSS 3D tile; pass `src` to use a designer's own artwork), `DocMock` (generic document, never a client name), `Scene3D` (hero art), `PageHero`, `HeroVideo`, `SocialIcons`, `SmoothScroll` (Lenis), `MotionProvider`.

## Performance rules
- Motion loads lazily (`LazyMotion` + `domAnimation`); `MotionConfig reducedMotion="user"` is on.
- Video: WebM only, no audio, poster first, pauses off-screen and in hidden tabs.
- Images: WebP from `scripts/optimize-media.sh`, rendered with `next/image`. Animate `transform` and `opacity` only.

## Liveliness (Busola's definition, round two)
Her concept page set the bar: floating shapes behind the final band, auto-advancing "how it works" scenes, a certificate pile that fans out, hero art that tilts. The same ideas are used on every service page without adding length: each interaction replaces a static block.
- Service page blocks: animated hero, tap-to-match situations, one signature tool (structure picker, licence finder, health-check ring, goal explorer, brand check), auto-advancing "what's included" stage, a fan-out document pile with a readiness ring, a floating-shapes "next step" band.
- `MotionIcon play="hover"` is used on card rows so five videos never play together; `play="visible"` is for heroes and stages (plays only on screen).
- Media: motion graphics in `public/media/motion`, certificates in `public/media/certificates` (blurred originals; the website never shows a client name), events flyers in `public/media/events`, logos in `public/brand` (SVG with the background rectangle removed).
