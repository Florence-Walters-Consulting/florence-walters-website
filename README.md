# Florence Walters Consulting website

Next.js app in `web/`, server setup in `deploy/` (see `deploy/README.md`).

- `web/`: the website and admin (Next.js, Drizzle, MySQL)
- `deploy/`: Ubuntu server scripts, nginx and systemd config
- `site_img/`: uploaded images (served under `/site_img/`)
- `florencewalters.sql`: original database dump, used by `deploy/first-data-load.sh`
- `docs/decisions.md`: decision log

The old React/Vite + PHP site is kept on the `legacy-php` branch for reference only.
