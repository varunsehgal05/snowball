# Glacier Growth

Here's the full single-page prompt, updated for the "Snow White" light theme.

Color palette

RoleColorHexBackground (primary)Pure snow white#FFFFFFBackground (secondary/panels)Soft frost white#F7FAFBCard/panel surfaceOff-white with cool tint#F1F5F6Hairline bordersPale ice gray#DCE6E8Primary textNear-black ink#0B0F0DSecondary/muted textCool slate gray#6E7A7DAccent (headlines, glow, links, buttons)Glacier blue#8FD3FFAccent deep (button text on light, active states)Deep glacier blue#2B6E96Ambient glow / shader mistGlacier blue at low opacity#8FD3FF @ 15–25%

Prompt for Stitch

Design a single-page scrolling landing page for Snowball, a premium AI Go-To-Market (GTM) agency for Y Combinator founders. Snowball runs LinkedIn and email outbound campaigns from a founder's own profile, written in their voice, generating warm investor/customer/candidate meetings. The site must feel like high-end engineering and transparency — a "winter research lab" aesthetic that's clinical, precise, and sophisticated, with a modern editorial edge. Move away from generic dark "AI startup" templates entirely.

Core metaphor: the snowball effect — momentum compounding. An interactive 3D snowball grows and rolls as the user scrolls, mirroring how outbound results build over time.

Aesthetic direction — "Snow White" clinical theme:

Crisp, high-fashion light theme. Pure whites (#FFFFFF), soft frost panels (#F7FAFB), hairline borders (#DCE6E8), glacier blue accents (#8FD3FF).

Should feel expensive and human-crafted, not templated — generous whitespace, precise alignment, restrained color use.

Technical polish: WebGL shader mist drifting subtly in the background (glacial fog, very low opacity, slow motion) and Three.js 3D objects (snowball, low-poly mountains) rendered with soft, clean lighting — no dark vignettes, no neon glow; light refracts and glows softly like ice in daylight.

Sticky nav bar:

White background with a hairline bottom border, blurs/gains subtle shadow on scroll.

Left: "Snowball" wordmark in near-black serif.

Center/right: anchor links (Work, Philosophy, Founders, Contact) that smooth-scroll to sections — muted slate gray, underline wipe in glacier blue on hover.

Right: "Book discovery" button — filled glacier blue (#8FD3FF) with deep-blue text (#2B6E96), pill-shaped, soft lift on hover.

Section 1 — Hero:

A thin bordered frame (hairline #DCE6E8, like a blueprint/selection box) containing:

Italicized serif line "under construction." with a thin diagonal strike-through line, in muted slate gray.

Below it, large bold serif headline in glacier blue: "engineered for founders."

Beneath the frame: the interactive 3D snowball — rendered as translucent, frosted ice with soft internal light refraction, sitting on a soft frost-white inset panel with a faint glacier-blue ambient glow radiating behind it (shader-based drifting mist). Small mono-font annotation beside it: "↘ compounding."

Small low-contrast caption: "space to jump" — playful interactive hint, corner-anchored.

Gently bouncing scroll indicator at the bottom of the hero.

Section 2 — "The Process":

Left: serif heading "The Process," a short line about running LinkedIn/email outbound in the founder's own voice, plus a small mono-font system readout for technical flavor: "SYS_CONFIG // OUTBOUND_PROTOCOL", "Active Nodes: 3" — rendered in deep glacier blue on frost-white background.

Right: three cards on a soft frost surface (#F1F5F6) with hairline borders, each numbered (01/02/03), mono eyebrow label, bold serif title, short sans-serif description:

Learn voice — model trained on historical communications to map semantic structures.

Run campaigns — omnichannel deployment targeting predefined ICP subsets, asynchronously.

Take meetings — frictionless handoff to calendar scheduling for qualified interactions.

Section 3 — "Momentum" / 3D mountains:

Full-width band with a low-poly 3D mountain range, rendered in clean whites and pale ice-blue gradients (soft daylight, not dark navy) with glacier-blue rim light tracing the ridgelines.

The snowball reappears here, visibly larger than in the hero, rolling down a visible trail line toward the base of the mountain — reinforcing compounding growth.

Headline: "Momentum compounds." with a short supporting line about outbound results building over time.

Subtle parallax: mountain layer scrolls slightly slower than foreground text.

Section 4 — Founders / proof band:

Quiet strip on white background with a stat or quote, mono-font labels, hairline dividers — consistent restrained styling, no loud stat cards.

Section 5 — Contact / closing CTA:

Centered serif headline: "Book a call and we'll show you exactly what we'd send on your behalf."

Filled glacier-blue "Schedule call →" button.

Simple contact links (email, socials) beneath in muted slate gray.

Footer:

"Snowball" wordmark bottom left (near-black serif), small mono-font copyright line beneath.

Right-aligned muted links: Privacy, Technical Spec, Terms.

Entire footer on white background with a single hairline top border.

Animation direction:

Snowball rotates continuously and grows subtly in scale as the user scrolls from hero to the mountain section, visually compounding.

WebGL shader mist drifts slowly and sparsely across the background throughout — barely noticeable, atmospheric only, never obscuring text.

Hero frame's corner brackets animate in on load, like a UI element being "measured."

Each section fades/slides up on scroll with slight stagger between elements (cards, headline, subtext).

Buttons: soft glacier-blue glow-lift on hover. Nav links: underline wipe in glacier blue.

Nav bar gains a subtle white blur/shadow once scrolled past the hero.

Typography:

Display/serif font for headlines and section titles — elegant, high-contrast, editorial, with italic support (used for the "under construction." line).

Clean geometric sans-serif for body copy.

Monospace font for technical annotations, numbers, and system-style labels (e.g. "01", "SYS_CONFIG", "Active Nodes: 3") in deep glacier blue — bridges the luxury/deep-tech feel.

Overall layout: One continuous vertical scroll on pure white, generous whitespace between sections, hairline borders throughout, glacier-blue as the only strong accent color — every element should feel deliberate and engineered, like a lab instrument catalog rather than a typical SaaS landing page.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/915db3dc-452f-4bd7-b184-67122cbac798).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
