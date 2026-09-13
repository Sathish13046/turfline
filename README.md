# TurfLine — Online Sports Ground Booking System

A React + Vite single-page app for browsing sports grounds, checking live slot
availability, booking, managing bookings, and an admin dashboard for managing
grounds/users/bookings. Data is stored in your browser's `localStorage`, so it
persists across reloads on your machine (no backend server required for the demo).

## Run it locally (VS Code)

1. Open this folder in VS Code.
2. Open a terminal (`` Ctrl+` ``) and install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
4. Open the URL it prints (usually `http://localhost:5173`) in your browser.

That's it — no database or backend setup needed; everything runs client-side.

## Demo logins

- **User:** `arjun@example.com` / `demo123`
- **Admin:** `admin@turfline.app` / `admin123`

Or use "Sign up" to create a new account.

## Project structure

```
turfline/
├── index.html          # HTML entry point
├── package.json
├── vite.config.js
├── src/
│   ├── main.jsx         # mounts <App /> into the page
│   └── App.jsx          # the entire application (UI, data, logic)
└── README.md
```

## Notes

- All "database" data (grounds, users, bookings) lives in browser
  `localStorage` under keys prefixed `turfline__`. To fully reset the demo
  data, use the **Reset demo data** button on the Admin dashboard, or clear
  your browser's site storage for `localhost`.
- Passwords are stored in plain text in this client-side demo store — fine
  for a mini-project demo, but not how a real production app should handle
  credentials (a real backend would hash passwords and store them in a
  proper database instead).
- To build a production bundle: `npm run build` (output goes to `dist/`).
  To preview that build: `npm run preview`.
