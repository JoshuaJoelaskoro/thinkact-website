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
