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
- Earnings estimator: creator share is `CREATOR_SHARE` at the top of the estimator in `script.js`.
- Placeholders still to fill: `[X]` weeks, `[Your ownership terms]`, `[WHATSAPP NUMBER]`, `[EMAIL]`, `[INSTAGRAM]`, `[creator].store`.

## Deploy (Vercel)

1. Push this folder to a GitHub repo.
2. vercel.com → Add New → Project → import the repo. Framework preset: "Other", no build command, output directory: root.
3. Project → Settings → Domains → add your domain, then add the DNS records Vercel shows at your registrar.
