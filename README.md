# Club Fitting Reference (Node.js)

2025–2026 season golf club fitting reference — Drivers, Irons, Wedges (Titleist, TaylorMade, Callaway, PING). Built with Express and EJS (no React).

## Run

```bash
npm install
npm start
```

Open **http://localhost:3000**.

- **Dev (auto-restart):** `npm run dev`

## API (optional)

- `GET /api/brands` — all brands and products
- `GET /api/brands/:key` — single brand (`titleist`, `taylormade`, `callaway`, `ping`)
- `GET /api/cross-ref` — head-to-head cross-reference table

## Structure

- `server.js` — Express app, routes, EJS view
- `data/brands.js` — `BRANDS` and `CROSS_REF` data
- `views/index.ejs` — main page template
- `public/js/app.js` — client-side tabs, search, expand/collapse

Data compiled March 2026 • Specs subject to manufacturer updates.
