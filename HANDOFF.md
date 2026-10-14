# ThinkAct Studio website: handoff for Claude Code

## What this is

The landing page for ThinkAct Studio. We build digital products (recipe guides, playbooks, templates, personality-led guides) together with content creators, on a revenue share. ThinkAct does the writing, design, store setup and monthly sales reports. The creator reviews the product and promotes it. The audience is content creators in Indonesia and abroad.

`index.html` in this folder is the finished design. Treat it as the source of truth for layout, copy, colors and fonts, and don't redesign it. It already works on its own: open it in a browser to see it.

## Design rules (keep exactly)

- Black is the baseline, with white and a hint of purple.
- Colors: background `#0A0A0A`, surfaces `#141414`, borders `#1F1F1F` / `#262626`, text `#F5F5F5`, muted text `#A3A3A3`, purple accent `#9B7BFF` on dark sections, `#6D4AFF` on the white section, purple-tinted cards `#17122B`.
- Fonts (Google Fonts): **Newsreader** for headlines (light, weight 300), **Inter** for body text, **Instrument Sans** for buttons and the nav. Newsreader stands in for Tiempos Headline (the paid font consulting.com uses). If I buy a Tiempos license later, swap it in.
- Reference site for the overall feel: https://consulting.com/

## Tasks

1. **Set up the project.** Keep it a simple static site (HTML, CSS, JS), no framework for now. You may move the inline styles into a stylesheet, but only if nothing changes visually. Set up git.
2. **Scroll animations.** Each section fades in and moves up about 24px over about 0.6s (ease-out), the first time it scrolls into view. Use IntersectionObserver. Cards in the same row appear one after another, about 80ms apart. The hero gets only a gentle fade on page load. Keep it subtle and premium, nothing flashy. Turn animations off when `prefers-reduced-motion` is set, and make sure all content stays visible if JavaScript fails.
3. **Fill in the placeholders.** Ask me for each value before changing it: `[X]` weeks to launch, `[Your ownership terms]`, `[WHATSAPP NUMBER]`, `[EMAIL]`, `[INSTAGRAM]`, `[creator].store`. The `[Creator name]` labels on the example product covers can stay as examples unless I give real names. Link "Chat on WhatsApp" to a `wa.me` link and "Email us" to a `mailto:` link.
4. **Check mobile.** Test at 375px wide and on desktop, and fix anything that overflows or looks cramped.
5. **Deploy.** Help me put it on Vercel (free plan) and connect a custom domain.

## Notes

- The earnings estimator's creator share is `CREATOR_SHARE` at the top of the script (currently 50%).
- The numbers on the hero's monthly report card are illustrative and labelled "EXAMPLE" on purpose. Keep that label. Don't add statistics or testimonials that aren't real.
- Later, not now: a creator portal where each creator logs in and sees their monthly sales.
