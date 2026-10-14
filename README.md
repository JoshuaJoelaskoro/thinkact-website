# ThinkAct Studio website

Static landing page: `index.html`, `styles.css`, `script.js`. No build step.
The design brief is in `HANDOFF.md`.

## Run locally

Open `index.html` in a browser, or serve the folder:

```
ruby -run -e httpd . -p 4321
```

## Notes

- Scroll animations: add `data-reveal` to an element to fade it in, or `data-stagger` to a row so its children appear 80ms apart. Disabled under `prefers-reduced-motion`; content stays visible if JavaScript fails.
- Earnings estimator: visitors pick the creator share with the "Your share" slider. Its range (50–70%, steps of 5) is set on `#ta-share` in `index.html`.
- All placeholders are filled in. `thinkact.store` on the hero phone is an example address, not a real store.

## Photos

The product cover photos in `images/` are from Unsplash (free for commercial use under the Unsplash License):

- `weeknight-kitchen.jpg`: ikhsan baihaqi, unsplash.com/photos/RwAXb8Hv_sU
- `starter-playbook.jpg`: Venti Views, unsplash.com/photos/I1EWTM5mFEM
- `content-planner.jpg`: Mona Jain, unsplash.com/photos/AJRZMx9XV7M
- `hard-way-guide.jpg`: Rirri, unsplash.com/photos/p_swqcXUc1k

## Deploy (Vercel)

1. Push this folder to a GitHub repo.
2. vercel.com → Add New → Project → import the repo. Framework preset: "Other", no build command, output directory: root.
3. Project → Settings → Domains → add your domain, then add the DNS records Vercel shows at your registrar.
