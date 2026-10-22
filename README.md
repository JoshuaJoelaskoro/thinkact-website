# ThinkAct Studio website

Static landing page: `index.html`, `styles.css`, `script.js`, `copy-id.js` and photos in `img/`. No build step.
Every push to `main` on GitHub goes live on https://thinkact-website.vercel.app within about a minute.

The previous version of the site is kept in `v1/` (live at `/v1/`, hidden from search engines) as a backup.
The original design brief for that version is in `HANDOFF.md`.

## Run locally

Serve the folder and open http://localhost:4321:

```
ruby -run -e httpd . -p 4321
```

## Notes

- Languages: the EN / ID switch in the header swaps every text tagged `data-i18n` (and screen-reader labels tagged `data-i18n-aria`). English is the text in `index.html`; the Indonesian wording is in `copy-id.js` under the same keys. When you add or change English text, tag it with a `data-i18n` key and add the Indonesian line to `copy-id.js`. A link with `?lang=id` opens the page in Indonesian, and the site remembers each visitor's choice.
- Animations: elements with the `reveal` class fade in when scrolled into view (`--delay` staggers them). Loops inside a `data-anim` element only run while it is on screen. Everything is still when the visitor's phone is set to reduce motion, and content stays visible if JavaScript fails.
- Hero example: the "New order" notifications and "Your share this month" in the hero are illustrations, labelled "Example". The orders are set near "Hero" in `script.js`.
- Earnings estimator: visitors pick the creator share with the "Your share" slider. Its range (50–70%, steps of 5) is set on `#f-share` in `index.html`.
- `thinkact.store` (in `v1/`) and the product titles are examples, not real products.
- Our creators (homepage, `#creators`): one `<figure class="creator">` per creator in `index.html`. Photos are `img/creator-*.jpg` (square, about 640px); follower counts live in `data-followers` (e.g. `87500`), and `script.js` shows them as 87.5K / 87,5 rb. Quotes are the `creators.q*` texts: English in `index.html`, Indonesian in `copy-id.js`. To add a creator, copy a figure, give it a new `creators.qN` key in both places, and add its photo. The last card is the WhatsApp invite.
- Partner program: `partner/index.html` (served at `/partner/`) reuses `styles.css`, `script.js` and `copy-id.js`; its header and footer are copies of the homepage's, so change both pages when you edit them. Its tab title and description use the `partnerMeta.*` keys (set by `data-meta` on `<html>`). In the partner estimator, visitors set creators, followers, buy rate (0.2–3%), product price (Rp10.000–Rp100.000 in Rp5.000 steps) and ThinkAct's share (30–50%) with sliders in `partner/index.html`; the 5% platform fee, the 25% partner share and the month curve (40/20/10/10/10/10) are constants near "Partner earnings estimator" in `script.js`. If those change, update the disclaimer on the page and in `copy-id.js` too. The hero example card assumes a Rp50.000 product.
- WhatsApp links with `data-wa="key"` open with a ready-made message: the English message is in the link, the Indonesian one is the `copy-id.js` text under that key.

## Photos

All photos are from Unsplash (free for commercial use under the Unsplash License). `img/thumb-*.jpg` are small copies of the same photos for the moving feed and the step pictures; `img/cover-kitchen-480.jpg` is a smaller copy of the Weeknight Kitchen photo.

Product covers:

- `weeknight-kitchen.jpg`: ikhsan baihaqi, unsplash.com/photos/RwAXb8Hv_sU
- `starter-playbook.jpg`: Venti Views, unsplash.com/photos/I1EWTM5mFEM
- `content-planner.jpg`: Mona Jain, unsplash.com/photos/AJRZMx9XV7M
- `hard-way-guide.jpg`: Rirri, unsplash.com/photos/p_swqcXUc1k

Cooking photos used as "content" tiles:

- `thumb-chillies.jpg`: Josué AS, unsplash.com/photos/fe8oJ_mLC-c
- `thumb-shallots.jpg`: unsplash.com/photos/YmgpoBhJAkI
- `thumb-fried-rice.jpg`: unsplash.com/photos/rWNcrwqF0nI
- `thumb-wok-flame.jpg`: unsplash.com/photos/vUlsoVpTbZs
- `thumb-fried-egg.jpg`: unsplash.com/photos/n1jhtaEHIhg
- `thumb-rice-bowl.jpg`: unsplash.com/photos/OV6BuDa9uCI

## Deploy (Vercel)

The repo is already connected to Vercel (framework preset "Other", no build command, output directory: root).
To use a custom domain: Project → Settings → Domains → add the domain, then add the DNS records Vercel shows at your registrar.
